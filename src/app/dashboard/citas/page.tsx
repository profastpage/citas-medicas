import { redirect } from 'next/navigation';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan } from '@/lib/plans';
import { CitasClient } from './citas-client';

export const dynamic = 'force-dynamic';

export default async function CitasPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) redirect('/login');

  const clinic = await db.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic) redirect('/login');

  const [patients, doctors, services, appointments] = await Promise.all([
    db.patient.findMany({
      where: { clinicId },
      select: { id: true, fullName: true, phone: true },
      orderBy: { fullName: 'asc' },
    }),
    db.doctor.findMany({
      where: { clinicId, isActive: true },
      include: { specialty: true },
      orderBy: { fullName: 'asc' },
    }),
    db.service.findMany({
      where: { clinicId, isActive: true },
      orderBy: { name: 'asc' },
    }),
    db.appointment.findMany({
      where: { clinicId },
      include: {
        patient: true,
        doctor: { include: { specialty: true } },
        service: true,
      },
      orderBy: { appointmentDate: 'asc' },
      take: 500,
    }),
  ]);

  const plan = getPlan(user.plan);

  return (
    <CitasClient
      user={{ email: user.email, name: user.fullName }}
      plan={plan}
      clinicName={clinic.name}
      isSuperAdmin={user.role === 'super_admin'}
      patients={patients.map(p => ({ id: p.id, name: p.fullName, phone: p.phone }))}
      doctors={doctors.map(d => ({
        id: d.id,
        name: d.fullName,
        specialty: d.specialty.name,
      }))}
      services={services.map(s => ({
        id: s.id,
        name: s.name,
        price: s.price,
        durationMin: s.durationMin,
      }))}
      appointments={appointments.map(a => ({
        id: a.id,
        date: a.appointmentDate.toISOString(),
        durationMin: a.durationMin,
        patientId: a.patientId,
        patientName: a.patient.fullName,
        doctorId: a.doctorId,
        doctorName: a.doctor.fullName,
        specialty: a.doctor.specialty.name,
        serviceId: a.serviceId,
        serviceName: a.service?.name ?? null,
        servicePrice: a.service?.price ?? null,
        reason: a.reason,
        status: a.status,
        notes: a.notes,
      }))}
    />
  );
}
