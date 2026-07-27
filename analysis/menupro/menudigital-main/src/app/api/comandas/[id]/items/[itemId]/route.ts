import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/comandas/[id]/items/[itemId]
 * Actualiza un item (cantidad, notas, estado).
 * Body: { quantity?, notes?, status? }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id, itemId } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  if (body.quantity !== undefined) update.quantity = body.quantity;
  if (body.notes !== undefined) update.notes = body.notes;
  if (body.status) {
    update.status = body.status;
    if (body.status === 'listo') update.prepared_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('order_items')
    .update(update)
    .eq('id', itemId)
    .eq('order_id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });

  // Recalcular subtotal de la comanda
  if (body.quantity !== undefined) {
    const { data: items } = await supabase
      .from('order_items')
      .select('menu_item_price, quantity, status')
      .eq('order_id', id);
    const newSubtotal = (items || [])
      .filter(i => i.status !== 'cancelado')
      .reduce((sum, i) => sum + (i.menu_item_price || 0) * i.quantity, 0);
    await supabase
      .from('orders')
      .update({ subtotal: newSubtotal, total: newSubtotal })
      .eq('id', id)
      .eq('owner_id', user.id);
  }

  return NextResponse.json({ item: data });
}

/**
 * DELETE /api/comandas/[id]/items/[itemId]
 * Elimina (o marca como cancelado) un item.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id, itemId } = await params;

  // Si la comanda ya fue enviada, marcar como cancelado en vez de eliminar
  const { data: order } = await supabase
    .from('orders')
    .select('status')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (!order) return NextResponse.json({ error: 'Comanda no encontrada' }, { status: 404 });

  if (order.status === 'borrador') {
    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('id', itemId)
      .eq('order_id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    // Marcar como cancelado
    const { error } = await supabase
      .from('order_items')
      .update({ status: 'cancelado' })
      .eq('id', itemId)
      .eq('order_id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Recalcular subtotal
  const { data: items } = await supabase
    .from('order_items')
    .select('menu_item_price, quantity, status')
    .eq('order_id', id);
  const newSubtotal = (items || [])
    .filter(i => i.status !== 'cancelado')
    .reduce((sum, i) => sum + (i.menu_item_price || 0) * i.quantity, 0);
  await supabase
    .from('orders')
    .update({ subtotal: newSubtotal, total: newSubtotal })
    .eq('id', id)
    .eq('owner_id', user.id);

  return NextResponse.json({ ok: true });
}
