import { redirect } from 'next/navigation';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan } from '@/lib/plans';
import { DashboardClient } from './dashboard-client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) redirect('/login');

  const clinic = await db.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic) redirect('/login');

  // Stats para el dashboard
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const [
    patientsCount,
    doctorsCount,
    appointmentsToday,
    appointmentsThisMonth,
    revenueToday,
    revenueThisMonth,
    pendingAppointments,
  ] = await Promise.all([
    db.patient.count({ where: { clinicId, isActive: true } }),
    db.doctor.count({ where: { clinicId, isActive: true } }),
    db.appointment.count({
      where: {
        clinicId,
        appointmentDate: { gte: startOfDay, lte: endOfDay },
      },
    }),
    db.appointment.count({
      where: {
        clinicId,
        appointmentDate: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    }),
    db.payment.aggregate({
      where: {
        clinicId,
        paymentDate: { gte: startOfDay, lte: endOfDay },
      },
      _sum: { amount: true },
    }),
    db.payment.aggregate({
      where: {
        clinicId,
        paymentDate: {
          gte: new Date(new Date().setDate(1)),
        },
      },
      _sum: { amount: true },
    }),
    db.appointment.count({
      where: {
        clinicId,
        status: 'pendiente',
        appointmentDate: { gte: new Date() },
      },
    }),
  ]);

  // Próximas citas
  const upcoming = await db.appointment.findMany({
    where: {
      clinicId,
      appointmentDate: { gte: new Date() },
      status: { in: ['pendiente', 'confirmada'] },
    },
    include: {
      patient: true,
      doctor: true,
      service: true,
    },
    orderBy: { appointmentDate: 'asc' },
    take: 5,
  });

  const plan = getPlan(user.plan);

  return (
    <DashboardClient
      user={{
        email: user.email,
        name: user.fullName,
      }}
      plan={plan}
      clinicName={clinic.name}
      isSuperAdmin={user.role === 'super_admin'}
      stats={{
        patientsCount,
        doctorsCount,
        appointmentsToday,
        appointmentsThisMonth,
        revenueToday: revenueToday._sum.amount ?? 0,
        revenueThisMonth: revenueThisMonth._sum.amount ?? 0,
        pendingAppointments,
      }}
      upcoming={upcoming.map(a => ({
        id: a.id,
        date: a.appointmentDate.toISOString(),
        patientName: a.patient.fullName,
        doctorName: a.doctor.fullName,
        serviceName: a.service?.name ?? null,
        status: a.status,
      }))}
    />
  );
}
