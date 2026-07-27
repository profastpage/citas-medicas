import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';
import { randomBytes } from 'crypto';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = PLANS[(profile?.plan as PlanId) || 'free'] || PLANS.free;
  if (!plan.limits.hasWaiters) {
    return NextResponse.json({ error: 'Requiere Premium', upgradeRequired: true }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('waiters')
    .select('id, full_name, document_id, phone, pin, is_active, qr_token, created_at')
    .eq('owner_id', user.id)
    .order('full_name', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ waiters: data || [] });
}

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
  if (!plan.limits.hasWaiters) {
    return NextResponse.json({ error: 'Requiere Premium', upgradeRequired: true }, { status: 403 });
  }

  // Verificar límite
  if (plan.limits.maxWaiters !== -1) {
    const { count } = await supabase
      .from('waiters')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id);
    if ((count || 0) >= plan.limits.maxWaiters) {
      return NextResponse.json(
        { error: `Has alcanzado el límite de ${plan.limits.maxWaiters} mozos del plan ${plan.name}.` },
        { status: 403 }
      );
    }
  }

  const body = await req.json();
  const { full_name, document_id, phone, pin } = body;

  if (!full_name || typeof full_name !== 'string') {
    return NextResponse.json({ error: 'Nombre del mozo es requerido' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('waiters')
    .insert({
      owner_id: user.id,
      full_name,
      document_id: document_id || null,
      phone: phone || null,
      pin: pin || null,
      qr_token: randomBytes(24).toString('hex'), // QR token auto-generado para acceso móvil sin login
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ waiter: data });
}
