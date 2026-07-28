// ============================================================
// POST /api/clinics/activate
// ============================================================
// Cambia la sucursal activa del usuario actual.
// Setea la cookie `active_clinic_id` con el ID de la clínica elegida,
// siempre y cuando el usuario sea owner o miembro de la misma.
// La cookie la lee `getActiveClinicId()` en @/lib/auth.ts para
// scoping multi-sucursal en todas las queries (patients, doctors, citas…)
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  clinicId: z.string().min(1, 'clinicId requerido'),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }, { status: 400 });
  }

  const { clinicId } = parsed.data;

  // Verificar propiedad o membresía
  const [owned, member] = await Promise.all([
    db.clinic.findFirst({ where: { id: clinicId, ownerId: user.id }, select: { id: true, name: true } }),
    db.clinicMember.findFirst({ where: { clinicId, userId: user.id }, select: { clinic: { select: { name: true } } } }),
  ]);

  if (!owned && !member) {
    return NextResponse.json({ error: 'No tienes acceso a esta sucursal' }, { status: 403 });
  }

  const clinicName = owned?.name ?? member?.clinic.name ?? '';

  const res = NextResponse.json({ ok: true, activeClinicId: clinicId, clinicName });
  // Cookie válida 1 año, httpOnly para seguridad, sameSite=lax, path=/
  res.cookies.set('active_clinic_id', clinicId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 año
  });

  // Auditoría
  await db.auditLog.create({
    data: {
      clinicId,
      userId: user.id,
      action: 'SWITCH_CLINIC',
      entity: 'Clinic',
      entityId: clinicId,
      description: `Sucursal activada: ${clinicName}`,
    },
  });

  return res;
}
