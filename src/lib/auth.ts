// ============================================================
// CitasPro SaaS — Auth helpers (Supabase Auth + Prisma)
// ============================================================
// La autenticación real la hace Supabase Auth (auth.users).
// Este módulo provee helpers para:
//   - Obtener el usuario actual (sesión leída de cookies)
//   - Obtener la clínica activa
//   - Hash de password (legacy, no usado con Supabase Auth)
// ============================================================

import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

/// Obtiene el usuario actual autenticado vía Supabase + perfil de negocio
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  // Buscar el perfil de negocio del usuario
  const user = await db.user.findUnique({
    where: { supabaseUid: authUser.id },
    include: {
      ownedClinics: true,
      memberships: { include: { clinic: true } },
    },
  });

  if (!user || !user.isActive) return null;

  // ── Downgrade on-demand: si el periodo expiró y está en grace/cancelled → Free ──
  // Defensa en profundidad además del cron diario. Garantiza que el usuario
  // vea su plan correcto inmediatamente después de la expiración, sin esperar
  // al cron. El downgrade es idempotente (no re-audita si ya está en Free).
  if (
    user.plan !== 'free' &&
    user.currentPeriodEnd &&
    user.currentPeriodEnd < new Date() &&
    user.mpStatus &&
    ['grace', 'cancelled', 'expired'].includes(user.mpStatus)
  ) {
    try {
      await db.user.update({
        where: { id: user.id },
        data: { plan: 'free', mpStatus: 'expired' },
      });
      await db.auditLog.create({
        data: {
          userId: user.id,
          action: 'PLAN_DOWNGRADE_LAZY',
          entity: 'User',
          entityId: user.id,
          description: 'Downgrade on-demand: periodo expirado detectado en login.',
        },
      });
      user.plan = 'free';
      user.mpStatus = 'expired';
    } catch (err) {
      console.warn('[getCurrentUser] lazy downgrade failed', err);
    }
  }

  return user;
}

/// Obtiene la clínica activa del usuario.
/// 1. Si hay cookie `active_clinic_id` y pertenece al usuario → usarla
/// 2. Si no, usar la primera clínica del usuario (ordenada por createdAt)
export async function getActiveClinicId(userId: string): Promise<string | null> {
  // 1. Intentar leer la cookie de sucursal activa
  try {
    const cookieStore = await cookies();
    const cookieClinicId = cookieStore.get('active_clinic_id')?.value;
    if (cookieClinicId) {
      // Validar que esta clínica pertenezca al usuario (owner o miembro)
      const owned = await db.clinic.findFirst({
        where: { id: cookieClinicId, ownerId: userId },
        select: { id: true },
      });
      if (owned) return owned.id;
      const member = await db.clinicMember.findFirst({
        where: { userId, clinicId: cookieClinicId },
        select: { clinicId: true },
      });
      if (member) return member.clinicId;
    }
  } catch {
    // cookies() puede lanzar si se llama desde un contexto no soportado — ignoramos y seguimos
  }

  // 2. Fallback: primera clínica del usuario
  const clinic = await db.clinic.findFirst({
    where: { OR: [{ ownerId: userId }, { members: { some: { userId } } }] },
    orderBy: { createdAt: 'asc' },
  });
  return clinic?.id ?? null;
}

/// Obtiene el ID de la clínica activa usando el UUID de Supabase Auth
export async function getActiveClinicIdBySupabaseUid(supabaseUid: string): Promise<string | null> {
  const user = await db.user.findUnique({
    where: { supabaseUid },
    select: { id: true },
  });
  if (!user) return null;
  return getActiveClinicId(user.id);
}

// ============================================================
// Legacy helpers (compatibilidad con código existente)
// ============================================================
// Estos se mantienen porque algunas rutas todavía los referencian,
// pero con Supabase Auth ya no son necesarios para la mayoría
// de los flujos. Se pueden remover gradualmente.

export const SESSION_COOKIE_NAMES = ['sb-access-token', 'sb-refresh-token'];

export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return !!session;
}

export async function getSupabaseUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
