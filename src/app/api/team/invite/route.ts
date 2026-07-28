// ============================================================
// /api/team/invite — Invitar miembro al equipo
// ============================================================
// POST → crea ClinicMember con estado pendiente (acceptedAt=null)
//        + envía invitación por email vía Supabase Auth Admin API
//          (supabase.auth.admin.inviteUserByEmail)
// Respeta maxUsers del plan.
// El email lo envía Supabase gratis (incluido en el free tier de Auth,
// 4 emails/segundo, 50k MAU). No usa Resend ni ningún servicio externo.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { assertCanAddTeamMember } from '@/lib/plan-limits';

const schema = z.object({
  email: z.string().email('Email inválido'),
  fullName: z.string().min(2, 'Nombre requerido'),
  role: z.enum(['admin', 'doctor', 'receptionist'], {
    errorMap: () => ({ message: 'Rol inválido' }),
  }),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica activa' }, { status: 400 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' },
      { status: 400 }
    );
  }

  // Verificar límite del plan
  const limitErr = await assertCanAddTeamMember(user.plan, clinicId);
  if (limitErr) return limitErr;

  const { email, fullName, role } = parsed.data;

  // Buscar si ya existe el usuario en nuestra DB
  const existingUser = await db.user.findUnique({ where: { email } });

  // Verificar que no sea ya miembro
  if (existingUser) {
    const existingMember = await db.clinicMember.findUnique({
      where: { userId_clinicId: { userId: existingUser.id, clinicId } },
    });
    if (existingMember) {
      return NextResponse.json(
        { error: 'Este usuario ya es miembro de la clínica' },
        { status: 409 }
      );
    }
  }

  // Crear o reusar usuario en nuestra DB (sin contraseña — se registrará vía Supabase Auth)
  // Si no existe, lo creamos con un supabaseUid temporal que se reemplazará al aceptar
  const memberUser =
    existingUser ??
    (await db.user.create({
      data: {
        supabaseUid: `pending-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        email,
        fullName,
        role,
        plan: 'free',
        isActive: false, // se activa cuando acepta la invitación
      },
    }));

  // Crear ClinicMember pendiente
  const member = await db.clinicMember.create({
    data: {
      userId: memberUser.id,
      clinicId,
      role,
    },
  });

  await db.auditLog.create({
    data: {
      clinicId,
      userId: user.id,
      action: 'CREATE',
      entity: 'ClinicMember',
      entityId: member.id,
      description: `Invitación enviada a ${email} como ${role}`,
    },
  });

  // ── Enviar invitación real vía Supabase Auth Admin API ──
  // supabase.auth.admin.inviteUserByEmail envía un email con un magic link
  // que lleva al usuario al callback de la app, donde se completa el registro.
  // Costo: $0 — incluido en el free tier de Supabase Auth.
  // Requiere SUPABASE_SERVICE_ROLE_KEY. Si no está configurada, la invitación
  // queda pendiente en DB y el owner puede reenviarla luego.
  const adminClient = createSupabaseAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  // Codificamos clinicId+role+memberId en la URL redirect para que el callback
  // pueda aceptar la invitación automáticamente y setear acceptedAt.
  const redirectUrl = `${siteUrl}/auth/callback?invite_clinic=${encodeURIComponent(clinicId)}&invite_member=${encodeURIComponent(member.id)}&invite_role=${encodeURIComponent(role)}`;

  let inviteResult: { sent: boolean; warning?: string } = { sent: false };
  if (!adminClient) {
    inviteResult = {
      sent: false,
      warning: 'SUPABASE_SERVICE_ROLE_KEY no configurada. La invitación quedó pendiente en DB; el usuario deberá registrarse manualmente.',
    };
  } else {
    try {
      const { error } = await adminClient.auth.admin.inviteUserByEmail(email, {
        redirectTo: redirectUrl,
        data: {
          full_name: fullName,
          invited_role: role,
          invited_clinic_id: clinicId,
          invited_clinic_name: user.ownedClinics.find(c => c.id === clinicId)?.name ?? '',
        },
      });
      if (error) {
        console.warn('[team invite] supabase admin invite error', error.message);
        inviteResult = { sent: false, warning: error.message };
      } else {
        inviteResult = { sent: true };
      }
    } catch (err) {
      console.warn('[team invite] supabase admin invite threw', err);
      inviteResult = { sent: false, warning: (err as Error).message };
    }
  }

  return NextResponse.json(
    {
      member: {
        id: member.id,
        userId: memberUser.id,
        email,
        fullName,
        role,
        invitedAt: member.invitedAt.toISOString(),
        acceptedAt: null,
      },
      invite: inviteResult,
    },
    { status: 201 }
  );
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica activa' }, { status: 400 });

  const members = await db.clinicMember.findMany({
    where: { clinicId },
    include: { user: { select: { email: true, fullName: true, isActive: true } } },
    orderBy: { invitedAt: 'desc' },
  });

  return NextResponse.json({
    members: members.map(m => ({
      id: m.id,
      email: m.user.email,
      fullName: m.user.fullName,
      role: m.role,
      invitedAt: m.invitedAt.toISOString(),
      acceptedAt: m.acceptedAt?.toISOString() ?? null,
      isActive: m.user.isActive,
    })),
  });
}

