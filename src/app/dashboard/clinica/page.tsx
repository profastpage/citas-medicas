import { redirect } from 'next/navigation';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan, isPlanAtLeast } from '@/lib/plans';
import { ClinicaClient } from './clinica-client';

export const dynamic = 'force-dynamic';

export default async function ClinicaPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) redirect('/login');
  const clinic = await db.clinic.findUnique({
    where: { id: clinicId },
    include: { specialties: true },
  });
  if (!clinic) redirect('/login');

  const plan = getPlan(user.plan);

  // Cargar todas las sucursales del usuario (para multi-branch UI)
  const allClinics = await db.clinic.findMany({
    where: { ownerId: user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      ruc: true,
      address: true,
      phone: true,
      email: true,
      createdAt: true,
      _count: { select: { patients: true, doctors: true, appointments: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <ClinicaClient
      user={{ email: user.email, name: user.fullName }}
      plan={plan}
      isSuperAdmin={user.role === 'super_admin'}
      clinic={{
        id: clinic.id,
        name: clinic.name,
        slug: clinic.slug,
        ruc: clinic.ruc ?? '',
        address: clinic.address ?? '',
        phone: clinic.phone ?? '',
        email: clinic.email ?? '',
        currency: clinic.currency,
        themeColor: clinic.themeColor,
        brandingText: clinic.brandingText,
        isWhiteLabel: clinic.isWhiteLabel,
        logoUrl: clinic.logoUrl ?? '',
      }}
      specialties={clinic.specialties.map(s => ({ id: s.id, name: s.name }))}
      allClinics={allClinics.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        ruc: c.ruc,
        address: c.address,
        phone: c.phone,
        email: c.email,
        createdAt: c.createdAt.toISOString(),
        _count: { patients: c._count.patients, doctors: c._count.doctors, appointments: c._count.appointments },
      }))}
      canCreateMore={plan.limits.maxClinics === -1 || allClinics.length < plan.limits.maxClinics}
    />
  );
}
