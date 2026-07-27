import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { SuperadminClient } from './superadmin-client';

export const dynamic = 'force-dynamic';

export default async function SuperadminPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== 'super_admin') redirect('/dashboard');

  const [users, clinics, totalStats] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { ownedClinics: { select: { id: true, name: true } } },
    }),
    db.clinic.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { patients: true, appointments: true, doctors: true } } },
    }),
    Promise.all([
      db.user.count(),
      db.clinic.count(),
      db.appointment.count(),
      db.payment.aggregate({ _sum: { amount: true } }),
    ]).then(([u, c, a, p]) => ({
      totalUsers: u,
      totalClinics: c,
      totalAppointments: a,
      totalRevenue: p._sum.amount ?? 0,
    })),
  ]);

  return (
    <SuperadminClient
      user={{ email: user.email, name: user.fullName }}
      stats={totalStats}
      users={users.map(u => ({
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        plan: u.plan,
        mpStatus: u.mpStatus,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString(),
        clinics: u.ownedClinics.map(c => c.name),
      }))}
      clinics={clinics.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        ownerEmail: users.find(u => u.ownedClinics.some(oc => oc.id === c.id))?.email ?? '—',
        plan: users.find(u => u.ownedClinics.some(oc => oc.id === c.id))?.plan ?? 'free',
        patients: c._count.patients,
        appointments: c._count.appointments,
        doctors: c._count.doctors,
        createdAt: c.createdAt.toISOString(),
      }))}
    />
  );
}
