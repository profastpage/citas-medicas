import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cancelPreapproval } from '@/lib/mercadopago';

/**
 * POST /api/mercadopago/cancel
 *
 * Cancela la suscripción Pro del usuario autenticado.
 *
 * MercadoPago no tiene un "Customer Portal" como Stripe, así que
 * construimos la cancelación directamente en nuestra UI.
 *
 * Flujo:
 * 1. Auth check
 * 2. Si no tiene preapproval_id, error
 * 3. PUT /preapproval/{id} con status=cancelled
 * 4. Actualizar profile: plan=free, mp_status=cancelled
 */
export async function POST(_req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('mp_preapproval_id, mp_status')
    .eq('id', user.id)
    .single();

  if (!profile?.mp_preapproval_id) {
    return NextResponse.json(
      { error: 'No tienes una suscripción activa' },
      { status: 400 }
    );
  }

  if (profile.mp_status === 'cancelled') {
    return NextResponse.json(
      { error: 'La suscripción ya está cancelada' },
      { status: 400 }
    );
  }

  try {
    await cancelPreapproval(profile.mp_preapproval_id);

    await supabase
      .from('profiles')
      .update({
        plan: 'free',
        mp_status: 'cancelled',
        current_period_end: null,
      })
      .eq('id', user.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : 'Error cancelando suscripción';
    console.error('[MP cancel] error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
