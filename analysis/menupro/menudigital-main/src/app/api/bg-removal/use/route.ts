import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';

/**
 * POST /api/bg-removal/use
 *
 * Incrementa el contador mensual de "Quitar fondo" del usuario.
 * Verifica:
 *   1. Auth
 *   2. Plan Pro (hasBgRemoval)
 *   3. Cuota disponible (remaining > 0)
 *
 * Llama a la RPC `increment_bg_removals` que:
 *   - Si pasaron 30+ días desde reset_at, resetea el contador a 1.
 *   - Sino, suma 1.
 *   - Devuelve el nuevo valor de bg_removals_used.
 *
 * Respuesta: { used, limit, remaining }
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const planId = (profile?.plan as PlanId) || 'free';
  const plan = PLANS[planId] || PLANS.free;

  if (!plan.limits.hasBgRemoval) {
    return NextResponse.json(
      {
        error:
          'Tu plan no incluye "Quitar fondo". Upgrade a Pro o superior para usar esta función.',
        upgradeRequired: true,
      },
      { status: 403 }
    );
  }

  // Plan Full = ilimitado, no verifica cuota
  if (plan.limits.bgRemovalCredits === -1) {
    return NextResponse.json({
      used: 0,
      limit: -1,
      remaining: -1,
    });
  }

  // Verificar cuota antes de incrementar
  const { data: quotaData, error: quotaError } = await supabase.rpc(
    'get_bg_removals_quota',
    {
      user_uuid: user.id,
      monthly_limit: plan.limits.bgRemovalCredits,
    }
  );

  if (quotaError) {
    console.error('[bg-removal/use] quota check error:', quotaError);
    return NextResponse.json(
      { error: 'Error verificando cuota' },
      { status: 500 }
    );
  }

  const quota = (quotaData || {}) as { remaining: number; used: number };
  if ((quota.remaining ?? 0) <= 0) {
    return NextResponse.json(
      {
        error:
          'Has alcanzado tu límite mensual de "Quitar fondo". Tu cuota se renueva en 30 días.',
        limitReached: true,
      },
      { status: 403 }
    );
  }

  // Incrementar contador atómicamente
  const { data: newUsed, error: incError } = await supabase.rpc(
    'increment_bg_removals',
    { user_uuid: user.id }
  );

  if (incError) {
    console.error('[bg-removal/use] increment error:', incError);
    return NextResponse.json(
      { error: 'Error incrementando contador' },
      { status: 500 }
    );
  }

  const used = (newUsed as number) ?? 0;
  return NextResponse.json({
    used,
    limit: plan.limits.bgRemovalCredits,
    remaining: Math.max(plan.limits.bgRemovalCredits - used, 0),
  });
}
