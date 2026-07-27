import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPreapproval } from '@/lib/mercadopago';
import { PLANS, type PlanId } from '@/lib/plans';

/**
 * POST /api/mercadopago/checkout
 *
 * Body opcional: { planId?: 'pro' | 'premium' | 'full' }
 * Default: 'pro' (compat con versiones anteriores)
 *
 * Crea una suscripción (PreApproval) en MercadoPago y devuelve la URL
 * de Checkout Pro (`init_point`) a la que el frontend redirige al usuario.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  // Leer planId del body (default 'pro' para compat)
  let planId: PlanId = 'pro';
  try {
    const body = await req.json().catch(() => ({}));
    if (body?.planId && ['pro', 'premium', 'full'].includes(body.planId)) {
      planId = body.planId as PlanId;
    }
  } catch {
    /* body vacío ok */
  }

  const plan = PLANS[planId];
  if (!plan || !plan.mpAmount || plan.mpAmount === 0) {
    return NextResponse.json(
      { error: 'Plan inválido o sin monto configurado' },
      { status: 400 }
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, mp_preapproval_id, mp_status')
    .eq('id', user.id)
    .single();

  if (!profile?.email) {
    return NextResponse.json(
      { error: 'Tu perfil no tiene email configurado' },
      { status: 400 }
    );
  }

  // Si ya tiene suscripción autorizada para el mismo plan, no crear otra
  if (
    profile.mp_preapproval_id &&
    profile.mp_status === 'authorized'
  ) {
    return NextResponse.json(
      { error: 'Ya tienes una suscripción activa. Cancela primero si quieres cambiar de plan.' },
      { status: 400 }
    );
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const result = await createPreapproval({
      payerEmail: profile.email,
      reason: `MenuPro ${plan.name} — Suscripción mensual`,
      amount: plan.mpAmount,
      userId: user.id,
      planId,
      backUrl: `${origin}/dashboard/billing?success=1&plan=${planId}`,
    });

    // Guardar el preapproval_id + plan pendiente
    await supabase
      .from('profiles')
      .update({
        mp_preapproval_id: result.id,
        mp_status: 'pending',
      })
      .eq('id', user.id);

    return NextResponse.json({ url: result.initPoint });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : 'Error creando suscripción';
    console.error('[MP checkout] error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
