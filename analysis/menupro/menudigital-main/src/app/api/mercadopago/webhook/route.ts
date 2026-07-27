import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPreapproval, preapprovalStatusToPlan } from '@/lib/mercadopago';

/**
 * POST /api/mercadopago/webhook
 *
 * Recibe notificaciones de MercadoPago (Webhooks API).
 *
 * Body típico:
 * {
 *   "type": "subscription_preapproval",
 *   "data": { "id": "2C9323E0A..." },
 *   "live_mode": true
 * }
 *
 * Flujo:
 * 1. Si type === 'subscription_preapproval', fetch del PreApproval
 * 2. Mapear status → plan (authorized=mantiene plan, resto=free)
 * 3. Buscar usuario por external_reference o mp_preapproval_id
 * 4. Actualizar profile
 */
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    // MercadoPago a veces envía form-encoded — tolerarlo
    const text = await req.text();
    body = Object.fromEntries(new URLSearchParams(text));
  }

  const type: string = body?.type || body?.topic || '';
  const dataId: string | undefined = body?.data?.id || body?.id || body?.resource;

  console.log('[MP webhook] type:', type, 'id:', dataId);

  if (type === 'subscription_preapproval' && dataId) {
    try {
      const info = await getPreapproval(dataId);
      const { plan, userId: userIdFromRef } = preapprovalStatusToPlan(
        info.status,
        info.externalReference
      );

      const supabase = await createClient();
      let userId: string | undefined = userIdFromRef || undefined;

      if (!userId) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('mp_preapproval_id', dataId)
          .single();
        userId = existing?.id;
      }

      if (!userId) {
        console.warn('[MP webhook] sin userId para preapproval', dataId);
        return NextResponse.json({ received: true, ignored: true });
      }

      // Calcular fin del período (1 mes desde el próximo cobro)
      let currentPeriodEnd: string | null = null;
      if (info.nextPaymentDate) {
        currentPeriodEnd = new Date(info.nextPaymentDate).toISOString();
      } else if (info.status === 'authorized') {
        // Si no hay fecha próxima, asumir +1 mes
        currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      await supabase
        .from('profiles')
        .update({
          plan,
          mp_status: info.status,
          mp_preapproval_id: dataId,
          current_period_end: currentPeriodEnd,
        })
        .eq('id', userId);

      console.log(`[MP webhook] ✅ Usuario ${userId} → plan=${plan} status=${info.status}`);
    } catch (err) {
      console.error(
        '[MP webhook] error procesando preapproval',
        dataId,
        err
      );
    }
  }

  if (type === 'payment' && dataId) {
    console.log('[MP webhook] payment event (no-op):', dataId);
  }

  return NextResponse.json({ received: true });
}
