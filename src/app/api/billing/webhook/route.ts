import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Webhook de MercadoPago para suscripciones
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
          await updateUserPlan(existing.id, info.status, info.nextPaymentDate, dataId);
        }
        return NextResponse.json({ received: true });
      }

      await updateUserPlan(userId, info.status, info.nextPaymentDate, dataId, planId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[MP webhook error]', err);
    return NextResponse.json({ error: 'ok' }, { status: 200 });
  }
}

async function updateUserPlan(
  userId: string,
  status: string,
  nextPaymentDate: string | null,
  preapprovalId: string,
  planId?: string
) {
  const plan = status === 'authorized' ? planId || 'pro' : 'free';
  const periodEnd = nextPaymentDate ? new Date(nextPaymentDate) : null;

  await db.user.update({
    where: { id: userId },
    data: {
      plan: ['authorized', 'active'].includes(status) ? plan : 'free',
      mpStatus: status,
      mpPreapprovalId: preapprovalId,
      currentPeriodEnd: periodEnd,
    },
  });
}
