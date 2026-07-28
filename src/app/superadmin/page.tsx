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
      include: {
        ownedClinics: {
          select: {
            id: true, name: true, slug: true,
            _count: { select: { patients: true, appointments: true, doctors: true } },
          },
        },
      },
    }),
    db.clinic.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { id: true, email: true, fullName: true, plan: true } },
        _count: { select: { patients: true, appointments: true, doctors: true } },
      },
    }),
    Promise.all([
      db.user.count(),
      db.clinic.count(),
      db.appointment.count(),
      db.payment.aggregate({ _sum: { amount: true } }),
      db.user.count({ where: { isActive: true } }),
      db.user.count({ where: { plan: { not: 'free' } } }),
    ]).then(([u, c, a, p, active, paying]) => ({
      totalUsers: u,
      totalClinics: c,
      totalAppointments: a,
      totalRevenue: p._sum.amount ?? 0,
      activeUsers: active,
      payingUsers: paying,
    })),
  ]);

  return (
    <SuperadminClient
      user={{ email: user.email, name: user.fullName }}
      initialStats={totalStats}
      initialUsers={users.map(u => ({
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        plan: u.plan,
        mpStatus: u.mpStatus,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString(),
        supabaseUid: u.supabaseUid,
        clinics: u.ownedClinics.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          patients: c._count.patients,
          appointments: c._count.appointments,
          doctors: c._count.doctors,
        })),
      }))}
      initialClinics={clinics.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        currency: c.currency,
        themeColor: c.themeColor,
        isWhiteLabel: c.isWhiteLabel,
        createdAt: c.createdAt.toISOString(),
        owner: c.owner ? {
          id: c.owner.id,
          email: c.owner.email,
          fullName: c.owner.fullName,
          plan: c.owner.plan,
        } : null,
        patients: c._count.patients,
        appointments: c._count.appointments,
        doctors: c._count.doctors,
      }))}
    />
  );
}
