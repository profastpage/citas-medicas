import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';
import sharp from 'sharp';
import removeBackground from '@imgly/background-removal-node';
import { optimizeImage } from '@/lib/image-optimizer';
import type { ImageSize } from '@/lib/image-utils';

/**
 * POST /api/bg-removal/process
 *
 * Quita el fondo de una imagen SERVER-SIDE usando @imgly/background-removal-node.
 *
 * Ventajas sobre el pipeline client-side:
 *  - Sin descarga de 50MB de WASM en el navegador del usuario.
 *  - Procesamiento ~1-3s (modelo cacheado en el servidor).
 *  - Resultado pre-depositado en Supabase Storage; el cliente solo recibe la URL.
 *  - Funciona en cualquier dispositivo (incluso móviles antiguos).
 *
 * Flujo:
 *   1. Auth + plan Pro + cuota > 0.
 *   2. Descargar la imagen original desde la URL (Supabase Storage).
 *   3. removeBackground(buffer, { model: 'medium' }) → Blob PNG con alpha.
 *   4. autoCropAndCenter(sharp) → recorta al bbox + 10% padding + cuadrado.
 *   5. Subir resultado a Supabase Storage (transparent=true).
 *   6. Incrementar contador bg_removals_used vía RPC.
 *   7. Devolver { url, quota: { used, limit, remaining } }.
 *
 * Body: { imageUrl: string }
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  // 1. Cargar perfil y plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const planId = (profile?.plan as PlanId) || 'free';
  const plan = PLANS[planId] || PLANS.free;

  if (!plan.limits.hasBgRemoval) {
    return NextResponse.json(
      {
        error:
          'Tu plan no incluye "Quitar fondo". Upgrade a Pro o superior para usar esta función.',
        upgradeRequired: true,
      },
      { status: 403 }
    );
  }

  // Plan Full = ilimitado
  if (plan.limits.bgRemovalCredits === -1) {
    // Sin verificación de cuota — continúa directo
  } else if (plan.limits.bgRemovalCredits === 0) {
    return NextResponse.json(
      {
        error: 'Tu plan no incluye créditos de "Quitar fondo".',
        upgradeRequired: true,
      },
      { status: 403 }
    );
  }

  // 2. Verificar cuota antes de procesar (skip si es ilimitado)
  let quota = { remaining: 999999, used: 0 };
  if (plan.limits.bgRemovalCredits !== -1) {
    const { data: quotaData, error: quotaError } = await supabase.rpc(
      'get_bg_removals_quota',
      {
        user_uuid: user.id,
        monthly_limit: plan.limits.bgRemovalCredits,
      }
    );

    if (quotaError) {
      console.error('[bg-removal/process] quota check error:', quotaError);
      return NextResponse.json(
        { error: 'Error verificando cuota' },
        { status: 500 }
      );
    }

    quota = (quotaData || {}) as { remaining: number; used: number };
  }
  if ((quota.remaining ?? 0) <= 0 && plan.limits.bgRemovalCredits !== -1) {
    return NextResponse.json(
      {
        error:
          'Has alcanzado tu límite mensual de "Quitar fondo". Tu cuota se renueva en 30 días.',
        limitReached: true,
      },
      { status: 403 }
    );
  }

  // 3. Obtener URL de la imagen
  let body: { imageUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { imageUrl } = body;
  if (!imageUrl || typeof imageUrl !== 'string') {
    return NextResponse.json(
      { error: 'Falta imageUrl en el body' },
      { status: 400 }
    );
  }

  try {
    // 4. Descargar la imagen original
    const imgRes = await fetch(imageUrl, { cache: 'no-store' });
    if (!imgRes.ok) {
      return NextResponse.json(
        { error: `No se pudo descargar la imagen (${imgRes.status})` },
        { status: 502 }
      );
    }
    const originalBuffer = Buffer.from(await imgRes.arrayBuffer());

    // 5. Quitar fondo con IA (server-side)
    //    model: 'medium' = equilibrio calidad/velocidad (~1-3s)
    //    output: PNG con alpha para preservar transparencia
    const noBgBlob = await removeBackground(originalBuffer, {
      model: 'medium',
      output: { format: 'image/png', quality: 1 },
    });

    const noBgBuffer = Buffer.from(await noBgBlob.arrayBuffer());

    // 6. Auto-crop + center con sharp
    //    a) Cargar PNG con alpha
    //    b) Detectar bbox de píxeles con alpha > 10
    //    c) Recortar al bbox + 10% padding
    //    d) Centrar en lienzo cuadrado (max 1200px)
    const image = sharp(noBgBuffer, { pages: 1 });
    const metadata = await image.metadata();
    const { width = 0, height = 0 } = metadata;
    if (!width || !height) {
      throw new Error('Imagen sin dimensiones válidas');
    }

    // Encontrar bounding box: usar la capa alpha
    const { data: rawRGBA, info } = await image
      .clone()
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const W = info.width;
    const H = info.height;
    const channels = info.channels; // 4 (RGBA)

    let minX = W;
    let minY = H;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const alpha = rawRGBA[(y * W + x) * channels + (channels - 1)];
        if (alpha > 10) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // Si no hay píxeles visibles, devolver la imagen tal cual
    let finalBuffer: Buffer;
    if (maxX < 0 || maxY < 0) {
      finalBuffer = noBgBuffer;
    } else {
      const bboxW = maxX - minX + 1;
      const bboxH = maxY - minY + 1;
      const padding = Math.round(Math.max(bboxW, bboxH) * 0.1);
      const paddedW = bboxW + padding * 2;
      const paddedH = bboxH + padding * 2;
      const side = Math.max(paddedW, paddedH);
      const finalSide = Math.min(side, 1200);

      // Crear lienzo cuadrado transparente y centrar el recorte escalado
      finalBuffer = await sharp(noBgBuffer)
        .extract({
          left: Math.max(minX, 0),
          top: Math.max(minY, 0),
          width: Math.min(bboxW, W - minX),
          height: Math.min(bboxH, H - minY),
        })
        .resize(finalSide, finalSide, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          withoutEnlargement: false,
        })
        .png() // mantener PNG lossless temporal con alpha antes de optimizar a WebP
        .toBuffer();
    }

    // ─── 7. Optimizar el resultado a multi-size WebP con alpha preservado ───
    const optimized = await optimizeImage(finalBuffer, {
      transparent: true,
      sizes: ['thumb', 'medium', 'large'] as ImageSize[],
    });

    // 8. Subir todas las variantes a Supabase Storage
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    const baseName = `${user.id}/${timestamp}-bgremoved-${random}`;

    const uploadedUrls: Record<string, string> = {};
    for (const variant of optimized.variants) {
      const filename = `${baseName}${variant.suffix}.webp`;
      const { error: variantErr } = await supabase.storage
        .from('menus')
        .upload(filename, variant.buffer, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: false,
        });
      if (variantErr) {
        console.error(`[bg-removal/process] upload error (${variant.size}):`, variantErr);
        continue;
      }
      const { data: publicUrlData } = supabase.storage
        .from('menus')
        .getPublicUrl(filename);
      uploadedUrls[variant.size] = publicUrlData.publicUrl;
    }

    // Fallback si el large falló pero hay otro
    if (!uploadedUrls.large) {
      const anySize = Object.keys(uploadedUrls)[0];
      if (!anySize) {
        return NextResponse.json(
          { error: 'Error al subir imagen optimizada' },
          { status: 500 }
        );
      }
      uploadedUrls.large = uploadedUrls[anySize];
    }

    // 9. Incrementar contador atómicamente
    const { data: newUsed, error: incError } = await supabase.rpc(
      'increment_bg_removals',
      { user_uuid: user.id }
    );

    if (incError) {
      console.error('[bg-removal/process] increment error:', incError);
      // No fallamos la request — la imagen ya se procesó y subió.
      // El contador puede quedar inconsistente pero el usuario recibió su imagen.
    }

    const used = plan.limits.bgRemovalCredits === -1 ? 0 : ((newUsed as number) ?? quota.used + 1);
    return NextResponse.json({
      url: uploadedUrls.large,
      thumb: uploadedUrls.thumb || uploadedUrls.large,
      medium: uploadedUrls.medium || uploadedUrls.large,
      large: uploadedUrls.large,
      variants: {
        thumb: uploadedUrls.thumb || uploadedUrls.large,
        medium: uploadedUrls.medium || uploadedUrls.large,
        large: uploadedUrls.large,
      },
      metadata: {
        originalBytes: optimized.metadata.originalBytes,
        optimizedBytes: optimized.metadata.optimizedBytes,
        savingsPct: optimized.metadata.savingsPct,
        hasAlpha: optimized.metadata.hasAlpha,
      },
      quota: {
        used,
        limit: plan.limits.bgRemovalCredits,
        remaining: plan.limits.bgRemovalCredits === -1 ? -1 : Math.max(plan.limits.bgRemovalCredits - used, 0),
      },
    });
  } catch (err) {
    console.error('[bg-removal/process] error:', err);
    const message = err instanceof Error ? err.message : 'Error procesando imagen';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
