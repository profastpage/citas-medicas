import { redirect } from 'next/navigation';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan } from '@/lib/plans';
import { EquipoClient } from './equipo-client';

export const dynamic = 'force-dynamic';

export default async function EquipoPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) redirect('/login');
  const clinic = await db.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic) redirect('/login');

  const plan = getPlan(user.plan);

  if (!plan.limits.hasAdvancedReports) {
    return (
      <EquipoClient
        user={{ email: user.email, name: user.fullName }}
        plan={plan}
        clinicName={clinic.name}
        isSuperAdmin={user.role === 'super_admin'}
        locked={true}
        members={[]}
      />
    );
  }

  const members = await db.clinicMember.findMany({
    where: { clinicId },
    include: { user: { select: { email: true, fullName: true } } },
  });

  return (
    <EquipoClient
      user={{ email: user.email, name: user.fullName }}
      plan={plan}
      clinicName={clinic.name}
      isSuperAdmin={user.role === 'super_admin'}
      locked={false}
      members={members.map(m => ({
        id: m.id,
        name: m.user.fullName,
        email: m.user.email,
        role: m.role,
        invitedAt: m.invitedAt.toISOString(),
        acceptedAt: m.acceptedAt?.toISOString() ?? null,
      }))}
    />
  );
}
