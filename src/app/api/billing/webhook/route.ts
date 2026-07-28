import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// ============================================================
// Webhook de MercadoPago para suscripciones
// ============================================================
// Eventos manejados:
//
//   subscription_preapproval:
//     - status=authorized     → activa plan, setea currentPeriodEnd=nextPaymentDate
//     - status=active         → ídem authorized (algunas MP responde "active")
//     - status=cancelled      → entra en GRACE 7 días (mpStatus='grace'),
//                               currentPeriodEnd = now + 7 días
//     - status=paused         → ídem cancelled (pausa no recurrente en MP,
//                               pero lo tratamos como grace para seguridad)
//     - status=pending        → no cambia el plan (sigue pendiente, sin embargo
//                               cuenta como warning si dura más de 3 días)
//
// Lógica de downgrade:
//   1. Webhook recibe cancelled → mpStatus='grace', currentPeriodEnd=now+7d
//   2. El cron diario /api/cron/process-expirations (Vercel Cron) revisa
//      todos los usuarios con mpStatus='grace' y currentPeriodEnd<now
//      → los downgradea a Free.
//   3. Adicionalmente, getCurrentUser() aplica el downgrade on-demand
//      si detecta que el periodo expiró (defensa en profundidad).
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = body?.type || body?.topic;
    const dataId = body?.data?.id || body?.id;

    console.log('[MP webhook]', type, dataId);

    if (type === 'subscription_preapproval' && dataId) {
      const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!mpToken) return NextResponse.json({ received: true });

      // Fetch del PreApproval
      const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${dataId}`, {
        headers: { 'Authorization': `Bearer ${mpToken}` },
      });
      const info = await mpRes.json();

      const externalRef = info.external_reference || '';
      const [userId, planId] = externalRef.split(':');

      if (!userId || !planId) {
        // Buscar por mpPreapprovalId
        const existing = await db.user.findFirst({
          where: { mpPreapprovalId: dataId },
        });
        if (existing) {
          await applySubscriptionStatus(existing.id, info.status, info.nextPaymentDate, dataId, undefined);
        }
        return NextResponse.json({ received: true });
      }

      await applySubscriptionStatus(userId, info.status, info.nextPaymentDate, dataId, planId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[MP webhook error]', err);
    return NextResponse.json({ error: 'ok' }, { status: 200 });
  }
}

/**
 * Aplica el estado de la suscripción al usuario.
 * - authorized/active → plan = planId (o 'pro' fallback), periodEnd = nextPaymentDate
 * - cancelled/paused  → mpStatus='grace', periodEnd = now + 7 días (grace period)
 * - pending           → no cambia el plan, solo actualiza mpStatus
 */
async function applySubscriptionStatus(
  userId: string,
  status: string,
  nextPaymentDate: string | null,
  preapprovalId: string,
  planId?: string
) {
  const now = new Date();

  if (['authorized', 'active'].includes(status)) {
    const newPlan = planId || 'pro';
    const periodEnd = nextPaymentDate ? new Date(nextPaymentDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    await db.user.update({
      where: { id: userId },
      data: {
        plan: newPlan,
        mpStatus: status,
        mpPreapprovalId: preapprovalId,
        currentPeriodEnd: periodEnd,
      },
    });
    console.log(`[MP webhook] user ${userId} → plan=${newPlan}, periodEnd=${periodEnd.toISOString()}`);
    return;
  }

  if (['cancelled', 'paused'].includes(status)) {
    // GRACE PERIOD: 7 días para que el usuario actualice su método de pago
    // antes de ser downgradeado a Free.
    const graceEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    await db.user.update({
      where: { id: userId },
      data: {
        mpStatus: 'grace',
        mpPreapprovalId: preapprovalId,
        currentPeriodEnd: graceEnd,
        // NO cambiamos plan aquí — el usuario sigue con su plan durante el grace.
        // El downgrade real lo hace el cron cuando currentPeriodEnd < now.
      },
    });
    console.log(`[MP webhook] user ${userId} → GRACE period until ${graceEnd.toISOString()}`);
    return;
  }

  // Otros estados (pending, etc.) — solo actualizamos mpStatus
  await db.user.update({
    where: { id: userId },
    data: {
      mpStatus: status,
      mpPreapprovalId: preapprovalId,
    },
  });
  console.log(`[MP webhook] user ${userId} → status=${status} (no plan change)`);
}
