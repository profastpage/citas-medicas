import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';

/**
 * PATCH /api/mesas/[id]
 * Actualiza una mesa (estado, capacidad, nombre, etc.)
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
  if (body.status) update.status = body.status;
  if (body.name !== undefined) update.name = body.name;
  if (body.capacity !== undefined) update.capacity = body.capacity;
  if (body.location !== undefined) update.location = body.location;
  if (body.is_active !== undefined) update.is_active = body.is_active;

  const { data, error } = await supabase
    .from('tables')
    .update(update)
    .eq('id', id)
    .eq('owner_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Mesa no encontrada' }, { status: 404 });
  return NextResponse.json({ table: data });
}

/**
 * DELETE /api/mesas/[id]
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase
    .from('tables')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
