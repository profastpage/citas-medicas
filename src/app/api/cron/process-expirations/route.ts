// ============================================================
// POST /api/cron/process-expirations
// ============================================================
// Cron diario (Vercel Cron) que downgrades a usuarios cuyas suscripciones
// expiraron y están en grace period o vencidos.
//
// Reglas:
//   1. mpStatus='grace' AND currentPeriodEnd < now → plan='free', mpStatus='expired'
//   2. mpStatus='authorized' AND currentPeriodEnd < now-3d → el cron intenta
//      refrescar el status desde MP; si sigue sin payment, entra en grace 7d.
//   3. mpStatus='cancelled' → plan='free', mpStatus='expired'
//
// Protegido por CRON_SECRET (Vercel). El header Authorization: Bearer <secret>
// debe coincidir con process.env.CRON_SECRET.
//
// Vercel Cron config (vercel.json):
//   "crons": [{ "path": "/api/cron/process-expirations", "schedule": "0 3 * * *" }]
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  // Verificar CRON_SECRET
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const now = new Date();
  let downgraded = 0;
  let refetched = 0;
  const errors: string[] = [];

  try {
    // 1. Usuarios en grace period cuya ventana terminó → downgrade a Free
    const graceExpired = await db.user.findMany({
      where: {
        mpStatus: 'grace',
        currentPeriodEnd: { lt: now },
        plan: { not: 'free' },
      },
      select: { id: true, email: true, plan: true, mpPreapprovalId: true },
    });

    for (const user of graceExpired) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: {
            plan: 'free',
            mpStatus: 'expired',
            // Mantenemos currentPeriodEnd para que el banner de expiración lo muestre
          },
        });
        // Auditoría
        await db.auditLog.create({
          data: {
            userId: user.id,
            action: 'PLAN_DOWNGRADE_AUTO',
            entity: 'User',
            entityId: user.id,
            description: `Suscripción expiró tras grace period. Plan ${user.plan} → Free.`,
          },
        });
        downgraded++;
      } catch (err) {
        errors.push(`user ${user.id}: ${(err as Error).message}`);
      }
    }

    // 2. Usuarios autorizados cuyo periodo terminó hace más de 3 días →
    //    intentar refrescar el status desde MP antes de cancelar.
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const staleAuthorized = await db.user.findMany({
      where: {
        mpStatus: 'authorized',
        currentPeriodEnd: { lt: threeDaysAgo },
        mpPreapprovalId: { not: null },
        plan: { not: 'free' },
      },
      select: { id: true, email: true, plan: true, mpPreapprovalId: true },
    });

    const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (mpToken && !mpToken.startsWith('TEST-PLACEHOLDER')) {
      for (const user of staleAuthorized) {
        try {
          const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${user.mpPreapprovalId}`, {
            headers: { 'Authorization': `Bearer ${mpToken}` },
          });
          const info = await mpRes.json();
          // Si MP dice cancelled/paused → entrar en grace
          if (['cancelled', 'paused'].includes(info.status)) {
            const graceEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            await db.user.update({
              where: { id: user.id },
              data: { mpStatus: 'grace', currentPeriodEnd: graceEnd },
            });
            await db.auditLog.create({
              data: {
                userId: user.id,
                action: 'PLAN_GRACE_ENTER',
                entity: 'User',
                entityId: user.id,
                description: `MP reporta status=${info.status}. Entrando en grace period 7 días.`,
              },
            });
            refetched++;
          } else if (info.nextPaymentDate) {
            // MP sigue autorizado y tiene nueva fecha de pago → actualizar
            await db.user.update({
              where: { id: user.id },
              data: { currentPeriodEnd: new Date(info.nextPaymentDate) },
            });
          }
        } catch (err) {
          errors.push(`MP refetch user ${user.id}: ${(err as Error).message}`);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      processed: {
        downgraded,
        refetched,
        staleAuthorized: staleAuthorized.length,
        graceExpired: graceExpired.length,
      },
      errors: errors.slice(0, 10),
    });
  } catch (err) {
    console.error('[cron process-expirations]', err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message, errors },
      { status: 500 }
    );
  }
}

// Soportar GET también por si Vercel Cron usa GET (algunas config viejas)
export async function GET(req: NextRequest) {
  return POST(req);
}
