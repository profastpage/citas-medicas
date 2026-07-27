import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';

/**
 * GET /api/comandas
 * Lista comandas. Query params:
 *   ?status=enviada         → filtra por estado
 *   ?table_id=xxx           → filtra por mesa
 *   ?today=1                → solo de hoy
 *   ?limit=50
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
  if (!plan.limits.hasComandas) {
    return NextResponse.json({ error: 'Requiere Premium', upgradeRequired: true }, { status: 403 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const tableId = url.searchParams.get('table_id');
  const today = url.searchParams.get('today') === '1';
  const limit = parseInt(url.searchParams.get('limit') || '50');

  let query = supabase
    .from('orders')
    .select(`
      *,
      table:tables(id, number, name),
      waiter:waiters(id, full_name),
      items:order_items(*)
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) query = query.eq('status', status);
  if (tableId) query = query.eq('table_id', tableId);
  if (today) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    query = query.gte('created_at', startOfToday.toISOString());
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data || [] });
}

/**
 * POST /api/comandas
 * Crea una nueva comanda.
 * Body: {
 *   table_id?, waiter_id?, order_type='mesa',
 *   customer_name?, customer_phone?, party_size?, notes?,
 *   items: [{ menu_item_id, menu_item_name, menu_item_price, quantity, notes? }]
 * }
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
  if (!plan.limits.hasComandas) {
    return NextResponse.json({ error: 'Requiere Premium', upgradeRequired: true }, { status: 403 });
  }

  const body = await req.json();
  const {
    table_id, waiter_id, order_type = 'mesa',
    customer_name, customer_phone, party_size, notes,
    items = [],
  } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'La comanda debe tener al menos 1 item' }, { status: 400 });
  }

  // Calcular subtotal
  let subtotal = 0;
  for (const item of items) {
    if (typeof item.quantity !== 'number' || item.quantity < 1) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 });
    }
    subtotal += (item.menu_item_price || 0) * item.quantity;
  }

  // Generar número de comanda
  const { data: orderNumber } = await supabase.rpc('get_next_order_number', {
    p_owner: user.id,
  });

  // Crear comanda
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      owner_id: user.id,
      table_id: table_id || null,
      waiter_id: waiter_id || null,
      order_number: orderNumber || '#0001',
      status: 'borrador',
      order_type,
      customer_name: customer_name || null,
      customer_phone: customer_phone || null,
      party_size: party_size || null,
      notes: notes || null,
      subtotal,
      total: subtotal, // sin tax ni tip por defecto
      currency: 'S/',
    })
    .select()
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  // Insertar items
  const itemsToInsert = items.map((item: any) => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    menu_item_name: item.menu_item_name,
    menu_item_price: item.menu_item_price,
    quantity: item.quantity,
    notes: item.notes || null,
    status: 'pendiente',
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert);

  if (itemsError) {
    // Rollback: eliminar la comanda sin items
    await supabase.from('orders').delete().eq('id', order.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  // Si la mesa está libre, marcarla como ocupada
  if (table_id) {
    await supabase
      .from('tables')
      .update({ status: 'ocupada' })
      .eq('id', table_id)
      .eq('owner_id', user.id);
  }

  // Registrar en historial
  await supabase.from('order_status_history').insert({
    order_id: order.id,
    to_status: 'borrador',
    changed_by: 'system',
    notes: 'Comanda creada',
  });

  // Fetch completo con items
  const { data: fullOrder } = await supabase
    .from('orders')
    .select(`*, table:tables(id, number, name), waiter:waiters(id, full_name), items:order_items(*)`)
    .eq('id', order.id)
    .single();

  return NextResponse.json({ order: fullOrder });
}
