import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/inventario/[id]/movements
 * Registra un movimiento de stock y actualiza stock_current.
 *
 * Body: {
 *   movement_type: 'entrada' | 'salida' | 'ajuste' | 'merma',
 *   quantity: number (positivo siempre; signo se aplica según tipo),
 *   unit_cost?, reason?, created_by?
 * }
 *
 * Para 'ajuste', quantity = diferencia (puede ser negativa o positiva).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { movement_type, quantity, unit_cost = 0, reason, created_by } = body;

  if (!['entrada', 'salida', 'ajuste', 'merma'].includes(movement_type)) {
    return NextResponse.json({ error: 'movement_type inválido' }, { status: 400 });
  }
  if (typeof quantity !== 'number') {
    return NextResponse.json({ error: 'quantity debe ser número' }, { status: 400 });
  }

  // Calcular delta según tipo
  let delta = 0;
  switch (movement_type) {
    case 'entrada':
      delta = Math.abs(quantity);
      break;
    case 'salida':
    case 'merma':
      delta = -Math.abs(quantity);
      break;
    case 'ajuste':
      delta = quantity; // puede ser positivo o negativo
      break;
  }

  // Verificar stock suficiente para salidas
  const { data: item } = await supabase
    .from('inventory_items')
    .select('stock_current, name')
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (!item) return NextResponse.json({ error: 'Insumo no encontrado' }, { status: 404 });

  const newStock = (item.stock_current || 0) + delta;
  if (newStock < 0) {
    return NextResponse.json(
      { error: `Stock insuficiente. Stock actual: ${item.stock_current}, intentas sacar: ${Math.abs(delta)}` },
      { status: 400 }
    );
  }

  // Actualizar stock
  const { error: updError } = await supabase
    .from('inventory_items')
    .update({ stock_current: newStock })
    .eq('id', id)
    .eq('owner_id', user.id);

  if (updError) return NextResponse.json({ error: updError.message }, { status: 500 });

  // Registrar movimiento
  const { data: movement, error: movError } = await supabase
    .from('inventory_movements')
    .insert({
      owner_id: user.id,
      inventory_item_id: id,
      movement_type,
      quantity: delta,
      unit_cost,
      reason: reason || null,
      created_by: created_by || 'manual',
    })
    .select()
    .single();

  if (movError) return NextResponse.json({ error: movError.message }, { status: 500 });

  return NextResponse.json({
    movement,
    new_stock: newStock,
    low_stock: newStock <= (await supabase.from('inventory_items').select('stock_min').eq('id', id).single()).data?.stock_min,
  });
}
