import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';

/**
 * GET /api/mesas
 * Lista todas las mesas del usuario autenticado.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const planId = (profile?.plan as PlanId) || 'free';
  const plan = PLANS[planId] || PLANS.free;

  if (!plan.limits.hasTables) {
    return NextResponse.json(
      { error: 'Tu plan no incluye gestión de mesas. Upgrade a Premium.', upgradeRequired: true },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .eq('owner_id', user.id)
    .order('number', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tables: data || [] });
}

/**
 * POST /api/mesas
 * Crea una nueva mesa.
 * Body: { number, name?, capacity?, location? }
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const planId = (profile?.plan as PlanId) || 'free';
  const plan = PLANS[planId] || PLANS.free;

  if (!plan.limits.hasTables) {
    return NextResponse.json(
      { error: 'Tu plan no incluye gestión de mesas. Upgrade a Premium.', upgradeRequired: true },
      { status: 403 }
    );
  }

  // Verificar límite
  if (plan.limits.maxTables !== -1) {
    const { count } = await supabase
      .from('tables')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id);
    if ((count || 0) >= plan.limits.maxTables) {
      return NextResponse.json(
        { error: `Has alcanzado el límite de ${plan.limits.maxTables} mesas del plan ${plan.name}.` },
        { status: 403 }
      );
    }
  }

  const body = await req.json();
  const { number, name, capacity, location } = body;

  if (typeof number !== 'number' || number < 1) {
    return NextResponse.json({ error: 'Número de mesa inválido' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('tables')
    .insert({
      owner_id: user.id,
      number,
      name: name || `Mesa ${number}`,
      capacity: capacity || 4,
      location: location || null,
      status: 'libre',
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: `Ya existe una mesa número ${number}` }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ table: data });
}
