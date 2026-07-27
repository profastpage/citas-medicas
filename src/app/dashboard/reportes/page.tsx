import { redirect } from 'next/navigation';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan } from '@/lib/plans';
import { ReportesClient } from './reportes-client';

export const dynamic = 'force-dynamic';

export default async function ReportesPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) redirect('/login');
  const clinic = await db.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic) redirect('/login');

  const plan = getPlan(user.plan);

  // Datos para reportes
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [appointments, payments, doctors] = await Promise.all([
    db.appointment.findMany({
      where: { clinicId, appointmentDate: { gte: thirtyDaysAgo } },
      include: { doctor: true, service: true, patient: true },
    }),
    db.payment.findMany({
      where: { clinicId, paymentDate: { gte: thirtyDaysAgo } },
      include: { appointment: { include: { patient: true, doctor: true } } },
    }),
    db.doctor.findMany({
      where: { clinicId },
      include: { specialty: true, _count: { select: { appointments: true } } },
    }),
  ]);

  return (
    <ReportesClient
      user={{ email: user.email, name: user.fullName }}
      plan={plan}
      clinicName={clinic.name}
      isSuperAdmin={user.role === 'super_admin'}
      data={{
        totalAppointments: appointments.length,
        totalRevenue: payments.reduce((s, p) => s + p.amount, 0),
        appointmentsByStatus: appointments.reduce((acc, a) => {
          acc[a.status] = (acc[a.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        revenueByDoctor: doctors.map(d => ({
          name: d.fullName,
          specialty: d.specialty.name,
          appointments: appointments.filter(a => a.doctorId === d.id).length,
          revenue: payments
            .filter(p => p.appointment?.doctorId === d.id)
            .reduce((s, p) => s + p.amount, 0),
        })),
        revenueByDay: Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          const dayAppointments = appointments.filter(a =>
            new Date(a.appointmentDate).toDateString() === date.toDateString()
          );
          const dayRevenue = payments
            .filter(p => new Date(p.paymentDate).toDateString() === date.toDateString())
            .reduce((s, p) => s + p.amount, 0);
          return {
            date: date.toISOString().slice(0, 10),
            appointments: dayAppointments.length,
            revenue: dayRevenue,
          };
        }),
      }}
    />
  );
}
