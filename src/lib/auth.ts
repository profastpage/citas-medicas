// ============================================================
// CitasPro SaaS — Auth con JWT (cookie httpOnly)
// ============================================================

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'citaspro-dev-secret-change-in-prod';
const COOKIE_NAME = 'citaspro_session';
const SESSION_DAYS = 7;

function getSecretKey() {
  return new TextEncoder().encode(JWT_SECRET);
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  plan: string;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySession(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/// Obtiene el usuario actual con su perfil completo
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await db.user.findUnique({
    where: { id: session.userId },
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
