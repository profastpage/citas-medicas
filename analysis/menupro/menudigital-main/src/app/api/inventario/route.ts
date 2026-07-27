import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';

/**
 * GET /api/inventario
 * Lista insumos. Query: ?low_stock=1 → solo los que están bajo el mínimo
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
  if (!plan.limits.hasInventory) {
    return NextResponse.json({ error: 'Requiere Premium', upgradeRequired: true }, { status: 403 });
  }

  const url = new URL(req.url);
  const lowStockOnly = url.searchParams.get('low_stock') === '1';

  let query = supabase
    .from('inventory_items')
    .select('*')
    .eq('owner_id', user.id)
    .order('name', { ascending: true });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const filtered = lowStockOnly
    ? (data || []).filter(i => i.stock_current <= i.stock_min)
    : data || [];

  return NextResponse.json({ items: filtered });
}

/**
 * POST /api/inventario
 * Crea un insumo.
 * Body: { name, sku?, unit, stock_current?, stock_min?, stock_max?, cost_per_unit?, supplier?, category? }
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
  if (!plan.limits.hasInventory) {
    return NextResponse.json({ error: 'Requiere Premium', upgradeRequired: true }, { status: 403 });
  }

  const body = await req.json();
  const {
    name, sku, unit = 'unidad',
    stock_current = 0, stock_min = 0, stock_max = 0,
    cost_per_unit = 0, supplier, category,
  } = body;

  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Nombre del insumo es requerido' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('inventory_items')
    .insert({
      owner_id: user.id,
      name,
      sku: sku || null,
      unit,
      stock_current,
      stock_min,
      stock_max,
      cost_per_unit,
      supplier: supplier || null,
      category: category || null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: `Ya existe un insumo llamado "${name}"` }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Registrar movimiento inicial si stock_current > 0
  if (stock_current > 0) {
    await supabase.from('inventory_movements').insert({
      owner_id: user.id,
      inventory_item_id: data.id,
      movement_type: 'entrada',
      quantity: stock_current,
      unit_cost: cost_per_unit,
      reason: 'Stock inicial',
      created_by: 'system',
    });
  }

  return NextResponse.json({ item: data });
}
