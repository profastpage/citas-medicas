import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin — Dashboard de super admin
 *   ?tab=stats                    → métricas globales
 *   ?tab=users&page=1&search=     → lista de usuarios con métricas
 *   ?tab=domains                  → dominios personalizados
 *   ?tab=user_detail&userId=xxx   → detalle completo de un usuario
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin, is_active')
    .eq('id', user.id)
    .single();

  if (!profile?.is_super_admin) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  const url = new URL(req.url);
  const tab = url.searchParams.get('tab') || 'users';
  const search = url.searchParams.get('search') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = 20;

  // ── STATS ──────────────────────────────────────────────
  if (tab === 'stats') {
    const { data, error } = await supabase.rpc('admin_global_stats');
    if (error) {
      // Fallback: stats manuales si la RPC falla
      return getStatsFallback(supabase);
    }
    return NextResponse.json({ stats: data });
  }

  // ── DOMAINS ────────────────────────────────────────────
  if (tab === 'domains') {
    return getDomains(supabase);
  }

  // ── USER DETAIL ────────────────────────────────────────
  if (tab === 'user_detail') {
    const userId = url.searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Falta userId' }, { status: 400 });
    const { data, error } = await supabase.rpc('admin_get_user_detail', {
      target_user_id: userId,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ detail: data });
  }

  // ── USERS (default) ────────────────────────────────────
  const { data: rpcData, error: rpcError } = await supabase.rpc('admin_list_all_users', {
    page_offset: (page - 1) * pageSize,
    page_limit: pageSize,
    search,
  });

  if (rpcError) {
    // Fallback: consulta manual si la RPC falla
    return getUsersFallback(supabase, search, page, pageSize);
  }

  return NextResponse.json({
    users: rpcData.users || [],
    total: rpcData.total || 0,
    page,
    pageSize,
  });
}

/**
 * PUT /api/admin — Acciones de admin sobre usuarios
 * Body: { action, userId, ...extra }
 */
export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_super_admin) {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
  }

  const body = await req.json();
  const { action, userId } = body;

  if (!userId || !action) {
    return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
  }

  // No permitir admin autodestruirse
  if (userId === user.id && action === 'toggle_super_admin') {
    return NextResponse.json(
      { error: 'No puedes quitarte el rol de super admin a ti mismo' },
      { status: 400 }
    );
  }
  if (userId === user.id && action === 'toggle_active') {
    return NextResponse.json(
      { error: 'No puedes desactivarte a ti mismo' },
      { status: 400 }
    );
  }

  switch (action) {
    case 'toggle_plan': {
      const { data: targetProfile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single();
      // Cycle through plans: free → pro → premium → full → free
      const cycle: Record<string, string> = {
        free: 'pro',
        pro: 'premium',
        premium: 'full',
        full: 'free',
      };
      const newPlan = cycle[targetProfile?.plan || 'free'] || 'free';
      const { error } = await supabase
        .from('profiles')
        .update({
          plan: newPlan,
          current_period_end:
            newPlan === 'free'
              ? null
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', userId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, newPlan });
    }

    case 'set_plan': {
      // Set specific plan: body.plan = 'free' | 'pro' | 'premium' | 'full'
      const plan = body.plan;
      if (!['free', 'pro', 'premium', 'full'].includes(plan)) {
        return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
      }
      const { error } = await supabase
        .from('profiles')
        .update({
          plan,
          current_period_end:
            plan === 'free'
              ? null
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', userId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, newPlan: plan });
    }

    case 'toggle_super_admin': {
      const { data: targetProfile } = await supabase
        .from('profiles')
        .select('is_super_admin')
        .eq('id', userId)
        .single();
      const newVal = !targetProfile?.is_super_admin;
      const { error } = await supabase
        .from('profiles')
        .update({ is_super_admin: newVal })
        .eq('id', userId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, is_super_admin: newVal });
    }

    case 'toggle_active': {
      const reason = body.reason || 'Desactivado por administrador';
      const { data, error } = await supabase.rpc('admin_toggle_user_active', {
        target_user_id: userId,
        reason,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({
        success: true,
        is_active: data.is_active,
      });
    }

    case 'delete_user': {
      const { error: menuErr } = await supabase
        .from('menus')
        .delete()
        .eq('user_id', userId);
      if (menuErr) return NextResponse.json({ error: menuErr.message }, { status: 500 });

      const { error: profileErr } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 500 });

      return NextResponse.json({ success: true });
    }

    case 'delete_menu': {
      const { menuId } = body;
      if (!menuId) return NextResponse.json({ error: 'Falta menuId' }, { status: 400 });
      const { error } = await supabase.from('menus').delete().eq('id', menuId);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    case 'impersonate': {
      // Marca en sesión que el admin está "suplantando" a este usuario
      // (Solo para auditoría — no loguea como el otro usuario, solo abre su dashboard en modo lectura)
      const { data: target } = await supabase
        .from('profiles')
        .select('email, full_name, plan')
        .eq('id', userId)
        .single();
      if (!target) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      return NextResponse.json({
        success: true,
        impersonated: target,
        note: 'Modo auditoría — ver datos del usuario sin loguearse como él',
      });
    }

    case 'update_avatar': {
      // Admin updates his OWN avatar_url (no impersonation; userId is ignored, uses auth.uid())
      // body.avatarUrl is the uploaded public URL from /api/upload
      const { avatarUrl } = body;
      if (!avatarUrl || typeof avatarUrl !== 'string') {
        return NextResponse.json({ error: 'Falta avatarUrl' }, { status: 400 });
      }
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      const { error: upErr } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq('id', currentUser.id);
      if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });
      return NextResponse.json({ success: true, avatar_url: avatarUrl });
    }

    default:
      return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  }
}

// ── Fallbacks (si las RPC fallan) ────────────────────────

async function getStatsFallback(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  const { count: proUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('plan', 'pro');
  const { count: premiumUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('plan', 'premium');
  const { count: fullUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('plan', 'full');
  const { count: totalMenus } = await supabase
    .from('menus')
    .select('*', { count: 'exact', head: true });
  const { count: publishedMenus } = await supabase
    .from('menus')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);
  const { count: totalDishes } = await supabase
    .from('dishes')
    .select('*', { count: 'exact', head: true });
  const { count: totalDomains } = await supabase
    .from('custom_domains')
    .select('*', { count: 'exact', head: true });
  const { count: verifiedDomains } = await supabase
    .from('custom_domains')
    .select('*', { count: 'exact', head: true })
    .eq('is_verified', true);
  const { data: viewsData } = await supabase.from('menus').select('views_count');
  const totalViews = (viewsData || []).reduce((s, m) => s + (m.views_count || 0), 0);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: recentSignups } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo);

  return NextResponse.json({
    stats: {
      total_users: totalUsers || 0,
      pro_users: proUsers || 0,
      premium_users: premiumUsers || 0,
      full_users: fullUsers || 0,
      free_users: (totalUsers || 0) - (proUsers || 0) - (premiumUsers || 0) - (fullUsers || 0),
      total_menus: totalMenus || 0,
      published_menus: publishedMenus || 0,
      total_dishes: totalDishes || 0,
      total_domains: totalDomains || 0,
      verified_domains: verifiedDomains || 0,
      total_views: totalViews,
      recent_signups_7d: recentSignups || 0,
      recent_signups_30d: recentSignups || 0,
      active_users: totalUsers || 0,
      banned_users: 0,
      super_admins: 0,
      revenue_estimate_pen: (proUsers || 0) * 35 + (premiumUsers || 0) * 99 + (fullUsers || 0) * 199,
      revenue_estimate_usd: (proUsers || 0) * 9 + (premiumUsers || 0) * 26 + (fullUsers || 0) * 52,
      top_menus_by_views: [],
    },
  });
}

async function getDomains(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase
    .from('custom_domains')
    .select(`*, profiles:user_id (email, full_name, plan), menus:menu_id (name, slug)`)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ domains: data || [] });
}

async function getUsersFallback(
  supabase: Awaited<ReturnType<typeof createClient>>,
  search: string,
  page: number,
  pageSize: number
) {
  let query = supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (search) {
    query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  }
  const from = (page - 1) * pageSize;
  const { data, error, count } = await query.range(from, from + pageSize - 1);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const usersWithMenus = await Promise.all(
    (data || []).map(async (u) => {
      const { count: menuCount } = await supabase
        .from('menus')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', u.id);
      return { ...u, menus_count: menuCount || 0 };
    })
  );

  return NextResponse.json({
    users: usersWithMenus,
    total: count || 0,
    page,
    pageSize,
  });
}
