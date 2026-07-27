import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  // Si hay preapproval en MP, cancelarlo vía API
  if (user.mpPreapprovalId) {
    const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (mpToken && !mpToken.startsWith('TEST-PLACEHOLDER')) {
      try {
        await fetch(`https://api.mercadopago.com/preapproval/${user.mpPreapprovalId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${mpToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'cancelled' }),
        });
      } catch (err) {
        console.error('[MP cancel]', err);
      }
    }
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      plan: 'free',
      mpStatus: 'cancelled',
      mpPreapprovalId: null,
      currentPeriodEnd: null,
    },
  });

  return NextResponse.json({ ok: true });
}
