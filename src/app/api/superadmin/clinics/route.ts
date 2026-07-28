import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'super_admin') return null;
  return user;
}

/**
 * GET /api/superadmin/clinics
 * List all clinics in the platform.
 */
export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const clinics = await db.clinic.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      owner: { select: { id: true, email: true, fullName: true, plan: true } },
      _count: { select: { patients: true, appointments: true, doctors: true } },
    },
  });

  return NextResponse.json({
    clinics: clinics.map(c => ({
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
    })),
  });
}
