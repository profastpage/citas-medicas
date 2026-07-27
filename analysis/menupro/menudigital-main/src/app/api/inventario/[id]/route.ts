import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/inventario/[id] — detalle con movimientos
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
    .from('inventory_items')
    .select(`
      *,
      movements:inventory_movements(*)
    `)
    .eq('id', id)
    .eq('owner_id', user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Insumo no encontrado' }, { status: 404 });
  return NextResponse.json({ item: data });
}

/**
 * PATCH /api/inventario/[id]
 * Actualiza un insumo. Body: { name?, sku?, unit?, stock_min?, stock_max?, cost_per_unit?, supplier?, category?, is_active? }
 * Nota: stock_current se modifica vía movements, no directamente aquí.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  for (const k of ['name', 'sku', 'unit', 'stock_min', 'stock_max', 'cost_per_unit', 'supplier', 'category', 'is_active']) {
    if (body[k] !== undefined) update[k] = body[k];
  }

  const { data, error } = await supabase
    .from('inventory_items')
    .update(update)
    .eq('id', id)
    .eq('owner_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Insumo no encontrado' }, { status: 404 });
  return NextResponse.json({ item: data });
}

/**
 * DELETE /api/inventario/[id]
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await params;
  // Marcar como inactivo en vez de borrar (para preservar historial)
  const { error } = await supabase
    .from('inventory_items')
    .update({ is_active: false })
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
