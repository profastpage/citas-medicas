import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/comandas/[id] — detalle de comanda
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      table:tables(id, number, name),
      waiter:waiters(id, full_name),
      items:order_items(*),
      history:order_status_history(*)
    `)
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Comanda no encontrada' }, { status: 404 });
  return NextResponse.json({ order: data });
}

/**
 * DELETE /api/comandas/[id] — cancelar comanda
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const reason = body.reason || 'Cancelada por el usuario';

  // Marcar como cancelada
  const { data, error } = await supabase
    .from('orders')
    .update({
      status: 'cancelada',
      cancelled_at: new Date().toISOString(),
      cancel_reason: reason,
    })
    .eq('id', id)
    .eq('owner_id', user.id)
    .select('table_id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Comanda no encontrada' }, { status: 404 });

  // Liberar mesa si estaba ocupada por esta comanda
  if (data.table_id) {
    await supabase
      .from('tables')
      .update({ status: 'libre' })
      .eq('id', data.table_id)
      .eq('owner_id', user.id);
  }

  // Registrar historial
  await supabase.from('order_status_history').insert({
    order_id: id,
    to_status: 'cancelada',
    changed_by: 'system',
    notes: reason,
  });

  return NextResponse.json({ ok: true });
}
