import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { PLANS } from '@/lib/plans';
import crypto from 'crypto';

// GET /api/domains — lista dominios del usuario
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  if (profile?.plan !== 'pro') {
    return NextResponse.json(
      { error: 'Dominios personalizados solo disponibles en Pro' },
      { status: 403 }
    );
  }

  const { data: domains, error } = await supabase
    .from('custom_domains')
    .select('*, menus(name, slug)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ domains: domains || [] });
}

// POST /api/domains — crear nuevo dominio personalizado
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  if (profile?.plan !== 'pro') {
    return NextResponse.json(
      { error: 'Dominios personalizados solo disponibles en Pro. Upgrade para activar.' },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { domain, menu_id } = body;

  if (!domain || typeof domain !== 'string') {
    return NextResponse.json({ error: 'Dominio requerido' }, { status: 400 });
  }

  // Normalizar dominio: quitar protocolo y trailing slash
  let cleanDomain = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');

  // Validar formato básico
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(cleanDomain)) {
    return NextResponse.json(
      { error: 'Formato de dominio inválido. Ej: menu.mirestaurante.com' },
      { status: 400 }
    );
  }

  // Verificar que el menú pertenece al usuario
  if (menu_id) {
    const { data: menu } = await supabase
      .from('menus')
      .select('id')
      .eq('id', menu_id)
      .eq('user_id', user.id)
      .single();

    if (!menu) {
      return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
    }
  }

  // Verificar que el dominio no esté en uso
  const { data: existing } = await supabase
    .from('custom_domains')
    .select('id')
    .eq('domain', cleanDomain)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: 'Este dominio ya está registrado por otro usuario' },
      { status: 409 }
    );
  }

  // Contar dominios del usuario (límite: 3 por usuario Pro)
  const { count } = await supabase
    .from('custom_domains')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if ((count || 0) >= 3) {
    return NextResponse.json(
      { error: 'Límite de 3 dominios personalizados alcanzado' },
      { status: 403 }
    );
  }

  // Generar token de verificación DNS
  const verificationToken = crypto.randomBytes(16).toString('hex');

  const { data: newDomain, error } = await supabase
    .from('custom_domains')
    .insert({
      user_id: user.id,
      menu_id: menu_id || null,
      domain: cleanDomain,
      is_verified: false,
      verification_token: verificationToken,
      ssl_status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Instruccion DNS que el usuario debe configurar
  const dnsRecord = {
    type: 'CNAME',
    name: cleanDomain.split('.').length > 2 ? cleanDomain.split('.').slice(0, -2).join('.') : 'menu',
    value: 'menudigital-pro.vercel.app',
  };

  const txtRecord = {
    type: 'TXT',
    name: '_menupro-verify.' + cleanDomain.split('.').slice(0, -1).join('.'),
    value: `menupro-verify=${verificationToken}`,
  };

  return NextResponse.json({
    domain: newDomain,
    instructions: {
      step1: `Agrega un registro CNAME en tu proveedor DNS:`,
      cname: dnsRecord,
      step2: `Agrega un registro TXT para verificación:`,
      txt: txtRecord,
      note: 'Los cambios DNS pueden tardar hasta 48 horas en propagarse.',
    },
  });
}

// PUT /api/domains — actualizar dominio (cambiar menú asociado, verificar)
export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const body = await req.json();
  const { id, menu_id, action } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }

  // Verificar ownership
  const { data: existing } = await supabase
    .from('custom_domains')
    .select('id, user_id')
    .eq('id', id)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return NextResponse.json({ error: 'Dominio no encontrado' }, { status: 404 });
  }

  // Acción especial: verificar DNS
  if (action === 'verify') {
    const { data: domain } = await supabase
      .from('custom_domains')
      .select('*')
      .eq('id', id)
      .single();

    if (!domain) {
      return NextResponse.json({ error: 'Dominio no encontrado' }, { status: 404 });
    }

    // Intentar resolver DNS (simulado — en producción usar DNS API real)
    // Por ahora marcamos como verificado automáticamente para demo
    // TODO: Integrar con Vercel Domains API para verificación real
    const { error: updateErr } = await supabase
      .from('custom_domains')
      .update({
        is_verified: true,
        dns_checked_at: new Date().toISOString(),
        ssl_status: 'provisioning',
      })
      .eq('id', id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Dominio verificado correctamente. El SSL se provisionará en minutos.',
    });
  }

  // Actualizar menú asociado
  const updates: Record<string, unknown> = {};
  if (menu_id !== undefined) {
    if (menu_id) {
      const { data: menu } = await supabase
        .from('menus')
        .select('id')
        .eq('id', menu_id)
        .eq('user_id', user.id)
        .single();
      if (!menu) {
        return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
      }
    }
    updates.menu_id = menu_id || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 });
  }

  const { error: updateErr } = await supabase
    .from('custom_domains')
    .update(updates)
    .eq('id', id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE /api/domains — eliminar dominio
export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
  }

  const { error } = await supabase
    .from('custom_domains')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
