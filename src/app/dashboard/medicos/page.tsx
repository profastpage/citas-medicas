import { redirect } from 'next/navigation';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan } from '@/lib/plans';
import { MedicosClient } from './medicos-client';

export const dynamic = 'force-dynamic';

export default async function MedicosPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) redirect('/login');

  const clinic = await db.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic) redirect('/login');

  const [doctors, specialties] = await Promise.all([
    db.doctor.findMany({
      where: { clinicId },
      include: {
        specialty: true,
        schedules: true,
        _count: { select: { appointments: true } },
      },
      orderBy: { fullName: 'asc' },
    }),
    db.specialty.findMany({ where: { clinicId }, orderBy: { name: 'asc' } }),
  ]);

  const plan = getPlan(user.plan);

  return (
    <MedicosClient
      user={{ email: user.email, name: user.fullName }}
      plan={plan}
      clinicName={clinic.name}
      isSuperAdmin={user.role === 'super_admin'}
      specialties={specialties.map(s => ({ id: s.id, name: s.name }))}
      doctors={doctors.map(d => ({
        id: d.id,
        fullName: d.fullName,
        specialtyId: d.specialtyId,
        specialtyName: d.specialty.name,
        colegiatura: d.colegiatura,
        phone: d.phone,
        email: d.email,
        bio: d.bio,
        consultationPrice: d.consultationPrice,
        isActive: d.isActive,
        appointmentsCount: d._count.appointments,
        schedulesCount: d.schedules.length,
      }))}
    />
  );
}
