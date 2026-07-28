import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { PLANS } from '@/lib/plans';

/**
 * Assert the current user is a super_admin. Returns the user or null.
 */
async function requireSuperAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'super_admin') return null;
  return user;
}

/**
 * GET /api/superadmin/users
 * List all users with their clinics and stats.
 */
export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      ownedClinics: {
        select: {
          id: true, name: true, slug: true,
          _count: { select: { patients: true, appointments: true, doctors: true } },
        },
      },
    },
  });

  return NextResponse.json({
    users: users.map(u => ({
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
    })),
  });
}

const updateSchema = z.object({
  userId: z.string().min(1),
  action: z.enum(['change_plan', 'activate', 'deactivate', 'make_super_admin', 'remove_super_admin']),
  plan: z.enum(['free', 'pro', 'premium', 'full']).optional(),
});

/**
 * PATCH /api/superadmin/users
 * Actions:
 *   - change_plan: update user's plan
 *   - activate / deactivate: toggle isActive
 *   - make_super_admin / remove_super_admin: change role
 */
export async function PATCH(req: NextRequest) {
  const admin = await requireSuperAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' },
      { status: 400 }
    );
  }

  const { userId, action, plan } = parsed.data;

  // Prevent self-deactivation (admin lockout protection)
  if (userId === admin.id && (action === 'deactivate' || action === 'remove_super_admin')) {
    return NextResponse.json(
      { error: 'No puedes desactivarte ni quitarte el rol de super_admin a ti mismo.' },
      { status: 400 }
    );
  }

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });

  let updateData: any = {};
  let message = '';

  switch (action) {
    case 'change_plan':
      if (!plan) return NextResponse.json({ error: 'Plan requerido' }, { status: 400 });
      updateData.plan = plan;
      message = `Plan cambiado a ${PLANS[plan].name}`;
      break;
    case 'activate':
      updateData.isActive = true;
      message = 'Usuario activado';
      break;
    case 'deactivate':
      updateData.isActive = false;
      message = 'Usuario desactivado';
      break;
    case 'make_super_admin':
      updateData.role = 'super_admin';
      message = 'Rol actualizado a super_admin';
      break;
    case 'remove_super_admin':
      updateData.role = 'owner';
      message = 'Rol cambiado a owner';
      break;
  }

  const updated = await db.user.update({
    where: { id: userId },
    data: updateData,
  });

  // Audit log
  await db.auditLog.create({
    data: {
      clinicId: updated.ownedClinics?.[0]?.id ?? admin.ownedClinics?.[0]?.id ?? 'super-admin',
      userId: admin.id,
      action: 'UPDATE',
      entity: 'User',
      entityId: userId,
      description: `Super admin: ${message} para ${updated.email}`,
    },
  }).catch(() => null); // audit log is best-effort

  return NextResponse.json({ ok: true, message, user: { id: updated.id, plan: updated.plan, role: updated.role, isActive: updated.isActive } });
}
