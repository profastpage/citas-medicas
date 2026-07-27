import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * /qr/[slug] — Ruta corta optimizada para QR codes.
 *
 * Problemática que resuelve:
 *   Algunos escáneres QR (especialmente apps de terceros) muestran la URL escaneada
 *   como texto plano en vez de abrirla automáticamente. Cuanto más corta y limpia
 *   sea la URL, más sencillo es el QR (menos módulos) y más probable es que el
 *   escáner lo trate como hipervínculo.
 *
 * Flujo:
 *   1. Cliente escanea QR que contiene https://menudigital-pro.vercel.app/qr/[slug]
 *   2. Si el escáner auto-abre (cámara nativa iOS/Android, modern browsers):
 *      → llega a /qr/[slug] → redirect 302 a /r/[slug] → menú se renderiza
 *   3. Si el escáner muestra URL como texto:
 *      → usuario tap sobre la URL → navegador abre /qr/[slug] → redirect 302 → menú
 *
 * Validación:
 *   Antes de redirigir, verifica que el menú exista y esté publicado.
 *   Si no existe, redirige a /r/[slug] igual para que el usuario vea el mensaje
 *   "Menú no encontrado" estándar (evita exponer información de existencia).
 *
 * SEO: esta ruta NO debe indexarse (es solo un redirect, no contenido).
 */
export const dynamic = 'force-dynamic';

export default async function QRRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Validación rápida: ¿existe el menú y está publicado?
  // Hacemos la verificación para registrar la vista (igual que /r/[slug]) y
  // evitar redirects a URLs que no existen (mejor UX si el slug es inválido).
  try {
    const supabase = await createClient();
    const { data: menu } = await supabase
      .from('menus')
      .select('id, is_published')
      .eq('slug', slug)
      .single();

    if (menu?.is_published) {
      // Registrar visita (fire-and-forget — no bloquea el redirect)
      registerQRView(menu.id).catch(() => {});
    }
  } catch {
    // Si falla la verificación, igual redirigimos a /r/[slug] — el handler
    // de /r/[slug] mostrará "Menú no encontrado" si aplica.
  }

  // HTTP 302 redirect al menú público
  redirect(`/r/${slug}`);
}

/**
 * Registra una visita proveniente de un QR code.
 * Esto permite distinguir en analíticas entre visitas directas (/r/) y visitas
 * vía QR (/qr/), aunque ambas terminan renderizando el mismo menú.
 *
 * Nota: la columna `source` se agrega en la migración SQL `add-carta-style.sql`.
 * Si la columna no existe todavía, este insert falla silenciosamente (catch).
 */
async function registerQRView(menuId: string) {
  const supabase = await createClient();
  try {
    await supabase.from('menu_views').insert({
      menu_id: menuId,
      source: 'qr',
    });
  } catch {
    // Columna `source` no existe aún → insert sin source
    try {
      await supabase.from('menu_views').insert({ menu_id: menuId });
    } catch {
      // Si ni siquiera sin source funciona, ignoramos — el redirect sigue funcionando
    }
  }
  await supabase.rpc('increment_menu_views', { menu_uuid: menuId });
}

// Metadata: NO indexar esta ruta (es solo un redirect)
export async function generateMetadata() {
  return {
    robots: {
      index: false,
      follow: false,
    },
    other: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  };
}
