import { redirect } from 'next/navigation';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan } from '@/lib/plans';
import { ServiciosClient } from './servicios-client';

export const dynamic = 'force-dynamic';

export default async function ServiciosPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) redirect('/login');
  const clinic = await db.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic) redirect('/login');

  const services = await db.service.findMany({
    where: { clinicId },
    orderBy: { name: 'asc' },
  });

  const plan = getPlan(user.plan);

  return (
    <ServiciosClient
      user={{ email: user.email, name: user.fullName }}
      plan={plan}
      clinicName={clinic.name}
      isSuperAdmin={user.role === 'super_admin'}
      services={services.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        durationMin: s.durationMin,
        isActive: s.isActive,
      }))}
    />
  );
}
