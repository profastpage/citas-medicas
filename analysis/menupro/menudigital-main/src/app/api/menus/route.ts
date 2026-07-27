import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { PLANS, canCreateMenu } from '@/lib/plans';
import { slugify } from '@/lib/menu-utils';

// GET /api/menus — lista menus del usuario
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  // Obtener plan del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = PLANS[profile?.plan || 'free'];

  const { data: menus, error } = await supabase
    .from('menus')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    menus: menus || [],
    plan,
    canCreate: canCreateMenu(menus?.length || 0, plan),
  });
}

// POST /api/menus — crear nuevo menu
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const body = await req.json();
  const { name } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Nombre requerido' }, { status: 400 });
  }

  // Obtener plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = PLANS[profile?.plan || 'free'];

  // Contar menus existentes
  const { count } = await supabase
    .from('menus')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (!canCreateMenu(count || 0, plan)) {
    // Mensaje plan-aware para upsell
    const nextPlan = plan.id === 'free' ? 'Pro (S/ 35/mes) para 3 menús' : plan.id === 'pro' ? 'Premium (S/ 99/mes) para 10 menús' : 'Full (S/ 199/mes) para menús ilimitados';
    return NextResponse.json(
      {
        error: `Has alcanzado el límite de ${plan.limits.maxMenus} menú(s) del plan ${plan.name}. Sube a ${nextPlan}.`,
        upgradeRequired: true,
        currentPlan: plan.id,
        limit: plan.limits.maxMenus,
      },
      { status: 403 }
    );
  }

  // Generar slug único
  let baseSlug = slugify(name) || 'menu';
  let slug = baseSlug;
  let suffix = 1;
  while (true) {
    const { data: existing } = await supabase
      .from('menus')
      .select('id')
      .eq('user_id', user.id)
      .eq('slug', slug)
      .maybeSingle();
    if (!existing) break;
    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }

  const { data: menu, error } = await supabase
    .from('menus')
    .insert({
      user_id: user.id,
      name: name.trim(),
      slug,
      whatsapp: '',
      color: '#ff6b35',
      currency: 'S/',
      is_published: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ menu });
}
