import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { PLANS } from '@/lib/plans';

// En producción, este endpoint debe crear un PreApproval en MercadoPago
// y devolver el initPoint para redirigir al usuario.
// Por ahora, en modo demo, simulamos el upgrade.

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json();
  const { planId } = body;

  const plan = PLANS[planId as keyof typeof PLANS];
  if (!plan || plan.id === 'free') {
    return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
  }

  // Si tenemos access token de MercadoPago, crear PreApproval real
  const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (mpToken && !mpToken.startsWith('TEST-PLACEHOLDER')) {
    try {
      const mpRes = await fetch('https://api.mercadopago.com/preapproval', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mpToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: `CitasPro ${plan.name} — Suscripción mensual`,
          auto_recurring: {
            frequency: 1,
            frequency_type: 'months',
            transaction_amount: plan.mpAmount,
            currency_id: 'PEN',
          },
          payer_email: user.email,
          external_reference: `${user.id}:${plan.id}`,
          back_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/billing`,
        }),
      });

      const data = await mpRes.json();
      if (!mpRes.ok) {
        console.error('[MP]', data);
        return NextResponse.json({ error: 'Error MercadoPago' }, { status: 500 });
      }

      await db.user.update({
        where: { id: user.id },
        data: {
          mpPreapprovalId: data.id,
        },
      });

      return NextResponse.json({
        initPoint: data.init_point,
        preapprovalId: data.id,
      });
    } catch (err) {
      console.error('[MP checkout]', err);
      return NextResponse.json({ error: 'Error de conexión' }, { status: 500 });
    }
  }

  // Modo demo: activar plan directamente (solo DEV)
  if (process.env.NODE_ENV === 'development') {
    await db.user.update({
      where: { id: user.id },
      data: {
        plan: plan.id,
        mpStatus: 'authorized',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    return NextResponse.json({
      demo: true,
      message: 'Plan activado en modo demo (sin MercadoPago configurado)',
      redirect: '/dashboard/billing?success=1',
    });
  }

  return NextResponse.json(
    { error: 'MercadoPago no configurado. Configura MERCADOPAGO_ACCESS_TOKEN.' },
    { status: 500 }
  );
}
