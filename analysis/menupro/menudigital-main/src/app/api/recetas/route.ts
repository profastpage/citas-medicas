import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';

/**
 * GET /api/recetas?menu_item_id=xxx
 * Lista recetas (opcionalmente filtradas por plato).
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = PLANS[(profile?.plan as PlanId) || 'free'] || PLANS.free;
  if (!plan.limits.hasRecipes) {
    return NextResponse.json({ error: 'Requiere Premium', upgradeRequired: true }, { status: 403 });
  }

  const url = new URL(req.url);
  const menuItemId = url.searchParams.get('menu_item_id');

  let query = supabase
    .from('product_recipes')
    .select(`
      *,
      inventory_item:inventory_items(id, name, unit, stock_current, stock_min)
    `)
    .eq('owner_id', user.id);

  if (menuItemId) query = query.eq('menu_item_id', menuItemId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ recipes: data || [] });
}

/**
 * POST /api/recetas
 * Crea una receta (asocia un plato con un insumo y cantidad).
 * Body: { menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes? }
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = PLANS[(profile?.plan as PlanId) || 'free'] || PLANS.free;
  if (!plan.limits.hasRecipes) {
    return NextResponse.json({ error: 'Requiere Premium', upgradeRequired: true }, { status: 403 });
  }

  const body = await req.json();
  const { menu_item_id, menu_item_name, inventory_item_id, quantity_per_dish, notes } = body;

  if (!menu_item_id || !menu_item_name || !inventory_item_id || typeof quantity_per_dish !== 'number') {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }
  if (quantity_per_dish <= 0) {
    return NextResponse.json({ error: 'La cantidad debe ser > 0' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('product_recipes')
    .insert({
      owner_id: user.id,
      menu_item_id,
      menu_item_name,
      inventory_item_id,
      quantity_per_dish,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Esta receta ya existe' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ recipe: data });
}
