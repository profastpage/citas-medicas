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
  return user;
}

/// Obtiene la clínica activa del usuario (la primera propiedad por defecto)
export async function getActiveClinicId(userId: string): Promise<string | null> {
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
