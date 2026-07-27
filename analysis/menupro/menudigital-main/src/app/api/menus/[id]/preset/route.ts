import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { id: menuId } = await params;
    const body = await req.json();
    const presetSlug = body.preset_slug as string;

    if (!presetSlug) {
      return NextResponse.json({ error: 'preset_slug requerido' }, { status: 400 });
    }

    // 1. Verificar que el menú pertenece al usuario
    const { data: menu, error: menuErr } = await supabase
      .from('menus')
      .select('id, user_id')
      .eq('id', menuId)
      .single();

    if (menuErr || !menu) {
      return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
    }

    if (menu.user_id !== user.id) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
    }

    // 2. Verificar que el usuario sea Pro
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan, is_super_admin')
      .eq('id', user.id)
      .single();

    if (profile?.plan !== 'pro' && !profile?.is_super_admin) {
      return NextResponse.json(
        { error: 'Requiere plan Pro para aplicar temas pre-diseñados' },
        { status: 403 }
      );
    }

    // 3. Buscar el preset por slug
    const { data: preset, error: presetErr } = await supabase
      .from('menu_theme_presets')
      .select('*')
      .eq('slug', presetSlug)
      .single();

    if (presetErr || !preset) {
      return NextResponse.json({ error: 'Preset no encontrado' }, { status: 404 });
    }

    // 4. Aplicar preset vía RPC (SECURITY DEFINER, valida ownership)
    const { data: result, error: rpcErr } = await supabase.rpc('apply_theme_preset', {
      p_menu_id: menuId,
      p_preset_id: preset.id,
    });

    if (rpcErr) {
      return NextResponse.json({ error: rpcErr.message }, { status: 500 });
    }

    // 5. Devolver el theme aplicado para que el cliente actualice su estado
    return NextResponse.json({
      ok: true,
      preset: preset.slug,
      menu_id: menuId,
      theme: preset.config,
    });
  } catch (err) {
    console.error('Error applying preset:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error interno' },
      { status: 500 }
    );
  }
}
