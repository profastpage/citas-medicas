import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';

/**
 * GET /api/bg-removal/quota
 *
 * Devuelve la cuota mensual de "Quitar fondo" del usuario autenticado:
 *   { used, limit, remaining, resetAt, hasFeature }
 *
 * Llama a la RPC `get_bg_removals_quota` de Supabase que:
 *  - Si pasaron 30+ días desde reset_at, devuelve used=0 (con reset implícito).
 *  - Devuelve remaining = max(limit - used, 0).
 */
export async function GET() {
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
    return NextResponse.json({
      hasFeature: false,
      used: 0,
      limit: 0,
      remaining: 0,
      resetAt: null,
    });
  }

  // Plan Full = ilimitado
  if (plan.limits.bgRemovalCredits === -1) {
    return NextResponse.json({
      hasFeature: true,
      used: 0,
      limit: -1,
      remaining: -1,
      resetAt: null,
    });
  }

  const { data, error } = await supabase.rpc('get_bg_removals_quota', {
    user_uuid: user.id,
    monthly_limit: plan.limits.bgRemovalCredits,
  });

  if (error) {
    console.error('[bg-removal/quota] RPC error:', error);
    return NextResponse.json(
      { error: 'Error obteniendo cuota' },
      { status: 500 }
    );
  }

  // La RPC devuelve JSON: { used, limit, remaining, reset_at }
  const result = (data || {}) as {
    used: number;
    limit: number;
    remaining: number;
    reset_at: string;
  };

  return NextResponse.json({
    hasFeature: true,
    used: result.used ?? 0,
    limit: result.limit ?? plan.limits.bgRemovalCredits,
    remaining: result.remaining ?? plan.limits.bgRemovalCredits,
    resetAt: result.reset_at ?? null,
  });
}
