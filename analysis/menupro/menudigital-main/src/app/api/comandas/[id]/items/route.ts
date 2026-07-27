import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/comandas/[id]/items
 * Agrega un item a una comanda existente.
 * Body: { menu_item_id, menu_item_name, menu_item_price, quantity, notes? }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await params;

  // Verificar ownership
  const { data: order } = await supabase
    .from('orders')
    .select('id, status, subtotal')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (!order) return NextResponse.json({ error: 'Comanda no encontrada' }, { status: 404 });

  if (order.status === 'facturada' || order.status === 'cancelada') {
    return NextResponse.json(
      { error: `No puedes agregar items a una comanda ${order.status}` },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { menu_item_id, menu_item_name, menu_item_price, quantity, notes } = body;

  if (!menu_item_name || typeof quantity !== 'number' || quantity < 1) {
    return NextResponse.json({ error: 'Datos de item inválidos' }, { status: 400 });
  }

  const { data: item, error } = await supabase
    .from('order_items')
    .insert({
      order_id: id,
      menu_item_id,
      menu_item_name,
      menu_item_price,
      quantity,
      notes: notes || null,
      status: 'pendiente',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Actualizar subtotal
  const newSubtotal = (order.subtotal || 0) + (menu_item_price || 0) * quantity;
  await supabase
    .from('orders')
    .update({ subtotal: newSubtotal, total: newSubtotal })
    .eq('id', id);

  return NextResponse.json({ item });
}
