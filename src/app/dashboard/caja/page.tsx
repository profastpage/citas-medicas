import { redirect } from 'next/navigation';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan } from '@/lib/plans';
import { CajaClient } from './caja-client';

export const dynamic = 'force-dynamic';

export default async function CajaPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) redirect('/login');
  const clinic = await db.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic) redirect('/login');

  const [sessions, payments] = await Promise.all([
    db.cashSession.findMany({
      where: { clinicId },
      include: { expenses: true },
      orderBy: { openedAt: 'desc' },
      take: 30,
    }),
    db.payment.findMany({
      where: {
        clinicId,
        paymentDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      include: {
        appointment: { include: { patient: true } },
      },
      orderBy: { paymentDate: 'desc' },
    }),
  ]);

  const plan = getPlan(user.plan);

  // Bloquear si no tiene plan pro
  if (!plan.limits.hasCashManagement) {
    return (
      <CajaClient
        user={{ email: user.email, name: user.fullName }}
        plan={plan}
        clinicName={clinic.name}
        isSuperAdmin={user.role === 'super_admin'}
        locked={true}
        sessions={[]}
        paymentsToday={[]}
      />
    );
  }

  return (
    <CajaClient
      user={{ email: user.email, name: user.fullName }}
      plan={plan}
      clinicName={clinic.name}
      isSuperAdmin={user.role === 'super_admin'}
      locked={false}
      sessions={sessions.map(s => ({
        id: s.id,
        openingAmount: s.openingAmount,
        closingAmount: s.closingAmount,
        openedAt: s.openedAt.toISOString(),
        closedAt: s.closedAt?.toISOString() ?? null,
        status: s.status,
        notes: s.notes,
        expenses: s.expenses.map(e => ({
          id: e.id,
          description: e.description,
          amount: e.amount,
        })),
      }))}
      paymentsToday={payments.map(p => ({
        id: p.id,
        amount: p.amount,
        method: p.method,
        patientName: p.appointment?.patient.fullName ?? '—',
        paymentDate: p.paymentDate.toISOString(),
      }))}
    />
  );
}
