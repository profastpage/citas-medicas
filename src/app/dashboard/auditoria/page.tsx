import { redirect } from 'next/navigation';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan } from '@/lib/plans';
import { AuditoriaClient } from './auditoria-client';

export const dynamic = 'force-dynamic';

export default async function AuditoriaPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) redirect('/login');
  const clinic = await db.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic) redirect('/login');

  const plan = getPlan(user.plan);

  if (!plan.limits.hasAuditLog) {
    return (
      <AuditoriaClient
        user={{ email: user.email, name: user.fullName }}
        plan={plan}
        clinicName={clinic.name}
        isSuperAdmin={user.role === 'super_admin'}
        locked={true}
        logs={[]}
      />
    );
  }

  const logs = await db.auditLog.findMany({
    where: { clinicId },
    include: { user: { select: { fullName: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <AuditoriaClient
      user={{ email: user.email, name: user.fullName }}
      plan={plan}
      clinicName={clinic.name}
      isSuperAdmin={user.role === 'super_admin'}
      locked={false}
      logs={logs.map(l => ({
        id: l.id,
        action: l.action,
        entity: l.entity ?? '',
        entityId: l.entityId ?? '',
        description: l.description ?? '',
        userName: l.user?.fullName ?? 'Sistema',
        ipAddress: l.ipAddress ?? '',
        createdAt: l.createdAt.toISOString(),
      }))}
    />
  );
}
