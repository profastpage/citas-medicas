import { redirect } from 'next/navigation';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan } from '@/lib/plans';
import { PacientesClient } from './pacientes-client';

export const dynamic = 'force-dynamic';

export default async function PacientesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) redirect('/login');

  const clinic = await db.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic) redirect('/login');

  const patients = await db.patient.findMany({
    where: { clinicId },
    include: {
      _count: { select: { appointments: true, files: true } },
    },
    orderBy: { fullName: 'asc' },
  });

  const plan = getPlan(user.plan);

  return (
    <PacientesClient
      user={{ email: user.email, name: user.fullName }}
      plan={plan}
      clinicName={clinic.name}
      isSuperAdmin={user.role === 'super_admin'}
      patients={patients.map(p => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        fullName: p.fullName,
        documentId: p.documentId,
        documentType: p.documentType,
        birthDate: p.birthDate?.toISOString() ?? null,
        sex: p.sex,
        phone: p.phone,
        email: p.email,
        address: p.address,
        bloodType: p.bloodType,
        allergies: p.allergies,
        chronicConditions: p.chronicConditions,
        medicalHistory: p.medicalHistory,
        emergencyContact: p.emergencyContact,
        emergencyPhone: p.emergencyPhone,
        medicalRecordNumber: p.medicalRecordNumber,
        notes: p.notes,
        isActive: p.isActive,
        appointmentsCount: p._count.appointments,
        filesCount: p._count.files,
      }))}
    />
  );
}
