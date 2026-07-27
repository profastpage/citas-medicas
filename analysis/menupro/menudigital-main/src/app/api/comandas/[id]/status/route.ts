import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/comandas/[id]/status
 * Cambia el estado de una comanda.
 * Body: { status: 'enviada'|'en_preparacion'|'lista'|'entregada'|'facturada'|'cancelada', notes? }
 *
 * Estados válidos del flujo:
 *   borrador → enviada → en_preparacion → lista → entregada → facturada
 *   (cualquiera) → cancelada
 */
const VALID_TRANSITIONS: Record<string, string[]> = {
  borrador: ['enviada', 'cancelada'],
  enviada: ['en_preparacion', 'cancelada'],
  en_preparacion: ['lista', 'cancelada'],
  lista: ['entregada', 'cancelada'],
  entregada: ['facturada', 'cancelada'],
  facturada: [],
  cancelada: [],
};

const STATUS_TIMESTAMPS: Record<string, string | null> = {
  enviada: 'sent_at',
  en_preparacion: null,
  lista: 'ready_at',
  entregada: 'delivered_at',
  facturada: 'invoiced_at',
  cancelada: 'cancelled_at',
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { status: newStatus, notes, cancel_reason } = body;

  if (!newStatus) {
    return NextResponse.json({ error: 'Falta status' }, { status: 400 });
  }

  // Cargar comanda actual
  const { data: order, error: loadError } = await supabase
    .from('orders')
    .select('status, table_id, owner_id')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (loadError || !order) {
    return NextResponse.json({ error: 'Comanda no encontrada' }, { status: 404 });
  }

  // Validar transición
  const allowed = VALID_TRANSITIONS[order.status] || [];
  if (!allowed.includes(newStatus)) {
    return NextResponse.json(
      { error: `No puedes pasar de "${order.status}" a "${newStatus}"` },
      { status: 400 }
    );
  }

  // Construir update
  const update: Record<string, unknown> = { status: newStatus };
  const tsField = STATUS_TIMESTAMPS[newStatus];
  if (tsField) update[tsField] = new Date().toISOString();
  if (newStatus === 'cancelada' && cancel_reason) update.cancel_reason = cancel_reason;

  const { data: updated, error } = await supabase
    .from('orders')
    .update(update)
    .eq('id', id)
    .eq('owner_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Registrar historial
  await supabase.from('order_status_history').insert({
    order_id: id,
    from_status: order.status,
    to_status: newStatus,
    changed_by: 'system',
    notes: notes || null,
  });

  // Si fue cancelada, liberar mesa
  if (newStatus === 'cancelada' && order.table_id) {
    await supabase
      .from('tables')
      .update({ status: 'libre' })
      .eq('id', order.table_id)
      .eq('owner_id', user.id);
  }

  // Si fue facturada, la mesa vuelve a libre (cliente se fue)
  if (newStatus === 'facturada' && order.table_id) {
    await supabase
      .from('tables')
      .update({ status: 'libre' })
      .eq('id', order.table_id)
      .eq('owner_id', user.id);
  }

  return NextResponse.json({ order: updated });
}
