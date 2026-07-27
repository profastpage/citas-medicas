import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';

/**
 * GET /api/mozo-panel?token=xxx
 * Resuelve los datos iniciales del panel del mozo:
 *  - waiter info (full_name, branch)
 *  - mesas libres y ocupadas
 *  - menú del dueño (categorías + platos)
 *  - comandas activas del mozo
 *
 * El token es waiter.qr_token (único por mozo, generado al crearlo).
 * El endpoint valida que el plan del dueño sea Premium+.
 */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token || !token.startsWith('wt-')) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 400 });
  }

  // Buscar mozo por token
  const { data: waiter, error: wErr } = await supabase
    .from('waiters')
    .select(`
      id, full_name, owner_id, branch_id, is_active, pin,
      branch:branches(id, name)
    `)
    .eq('qr_token', token)
    .single();

  if (wErr || !waiter) {
    return NextResponse.json({ error: 'Mozo no encontrado' }, { status: 404 });
  }
  if (!waiter.is_active) {
    return NextResponse.json({ error: 'Mozo inactivo. Contacta al administrador.' }, { status: 403 });
  }

  // Validar plan del dueño
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', waiter.owner_id)
    .single();

  const plan = PLANS[(profile?.plan as PlanId) || 'free'] || PLANS.free;
  if (!plan.limits.hasComandas) {
    return NextResponse.json(
      { error: 'El restaurante no tiene activo el sistema de comandas', upgradeRequired: true },
      { status: 403 }
    );
  }

  // Cargar mesas
  let mesasQuery = supabase
    .from('tables')
    .select('id, number, name, status, capacity, location')
    .eq('owner_id', waiter.owner_id)
    .eq('is_active', true)
    .order('number');

  if (waiter.branch_id) {
    mesasQuery = mesasQuery.eq('branch_id', waiter.branch_id);
  }
  const { data: mesas } = await mesasQuery;

  // Cargar menú del dueño (primer menú)
  const { data: menu } = await supabase
    .from('menus')
    .select(`
      id, name, slug,
      categories:categories(id, name, sort_order, dishes:dishes(id, name, price, description, image_url))
    `)
    .eq('user_id', waiter.owner_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Cargar comandas activas de este mozo
  const { data: comandas } = await supabase
    .from('orders')
    .select(`
      id, order_number, status, total, currency, created_at, notes,
      table:tables(id, number, name),
      items:order_items(id, menu_item_name, quantity, menu_item_price, notes, status)
    `)
    .eq('owner_id', waiter.owner_id)
    .eq('waiter_id', waiter.id)
    .in('status', ['borrador', 'enviada', 'en_preparacion', 'lista'])
    .order('created_at', { ascending: false })
    .limit(20);

  return NextResponse.json({
    waiter: {
      id: waiter.id,
      full_name: waiter.full_name,
      has_pin: Boolean(waiter.pin),
      branch: waiter.branch,
    },
    mesas: mesas || [],
    menu: menu || null,
    comandas: comandas || [],
    plan: { id: plan.id, name: plan.name },
  });
}

/**
 * POST /api/mozo-panel
 * Crea una comanda desde el panel del mozo.
 * Body: {
 *   token, table_id, items: [{ menu_item_id, menu_item_name, menu_item_price, quantity, notes? }],
 *   customer_name?, party_size?, notes?
 * }
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { token, table_id, items, customer_name, party_size, notes } = body;

  if (!token || !items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  // Resolver mozo
  const { data: waiter, error: wErr } = await supabase
    .from('waiters')
    .select('id, owner_id, branch_id, full_name, is_active, pin')
    .eq('qr_token', token)
    .single();

  if (wErr || !waiter) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 404 });
  }
  if (!waiter.is_active) {
    return NextResponse.json({ error: 'Mozo inactivo' }, { status: 403 });
  }

  // Validar plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', waiter.owner_id)
    .single();
  const plan = PLANS[(profile?.plan as PlanId) || 'free'] || PLANS.free;
  if (!plan.limits.hasComandas) {
    return NextResponse.json({ error: 'Plan sin comandas', upgradeRequired: true }, { status: 403 });
  }

  // Validar PIN si está configurado
  if (body.pin && waiter.pin && body.pin !== waiter.pin) {
    return NextResponse.json({ error: 'PIN incorrecto' }, { status: 401 });
  }

  // Calcular subtotal
  let subtotal = 0;
  for (const item of items) {
    subtotal += (Number(item.menu_item_price) || 0) * Number(item.quantity || 1);
  }

  // Generar número
  const { data: orderNumber } = await supabase.rpc('get_next_order_number', {
    p_owner: waiter.owner_id,
  });

  // Crear comanda
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      owner_id: waiter.owner_id,
      branch_id: waiter.branch_id,
      table_id: table_id || null,
      waiter_id: waiter.id,
      order_number: orderNumber || '#0001',
      status: 'enviada', // directo a cocina desde el panel mozo
      order_type: 'mesa',
      customer_name: customer_name || null,
      party_size: party_size || null,
      notes: notes || null,
      subtotal,
      total: subtotal,
      currency: 'S/',
      sent_at: new Date().toISOString(),
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
  const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  // Marcar mesa como ocupada
  if (table_id) {
    await supabase
      .from('tables')
      .update({ status: 'ocupada' })
      .eq('id', table_id)
      .eq('owner_id', waiter.owner_id);
  }

  // Registrar en historial
  await supabase.from('order_status_history').insert({
    order_id: order.id,
    to_status: 'enviada',
    changed_by: `mozo:${waiter.full_name}`,
    notes: 'Comanda creada desde panel mozo',
  });

  return NextResponse.json({ ok: true, order_id: order.id, order_number: order.order_number });
}

/**
 * PATCH /api/mozo-panel
 * Avanza el estado de una comanda desde el panel del mozo.
 * Body: { token, order_id, action: 'marcar_entregada' | 'cancelar' }
 */
export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();
  const { token, order_id, action } = body;

  if (!token || !order_id || !action) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
  }

  // Resolver mozo
  const { data: waiter } = await supabase
    .from('waiters')
    .select('id, owner_id, full_name')
    .eq('qr_token', token)
    .single();

  if (!waiter) return NextResponse.json({ error: 'Token inválido' }, { status: 404 });

  // Validar que la comanda es del mozo
  const { data: order } = await supabase
    .from('orders')
    .select('id, status, table_id')
    .eq('id', order_id)
    .eq('waiter_id', waiter.id)
    .single();

  if (!order) return NextResponse.json({ error: 'Comanda no encontrada' }, { status: 404 });

  let newStatus = order.status;
  let extra: any = {};

  if (action === 'marcar_entregada') {
    newStatus = 'entregada';
    extra.delivered_at = new Date().toISOString();
  } else if (action === 'cancelar') {
    newStatus = 'cancelada';
    extra.cancelled_at = new Date().toISOString();
  } else {
    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 });
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus, ...extra })
    .eq('id', order_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Si entregada o cancelada → liberar mesa
  if (newStatus === 'entregada' || newStatus === 'cancelada') {
    if (order.table_id) {
      await supabase
        .from('tables')
        .update({ status: 'libre' })
        .eq('id', order.table_id)
        .eq('owner_id', waiter.owner_id);
    }
  }

  // Registrar en historial
  await supabase.from('order_status_history').insert({
    order_id,
    from_status: order.status,
    to_status: newStatus,
    changed_by: `mozo:${waiter.full_name}`,
  });

  return NextResponse.json({ ok: true, status: newStatus });
}
