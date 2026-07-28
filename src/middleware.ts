// ============================================================
// CitasPro SaaS — Middleware de autenticación + rate limiting
// ============================================================
// 1. Refresca la sesión de Supabase Auth en cada request
// 2. Protege rutas privadas (redirige a /login si no autenticado)
// 3. Rate limiting por IP y por usuario para proteger Supabase,
//    Vercel y la base de datos de abuso, bugs o ataques.
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitConfig,
  buildRateLimitKey,
} from '@/lib/rate-limit';

const PUBLIC_PATHS = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register', '/api/auth/forgot', '/api/auth/google', '/api/health'];
const PUBLIC_PREFIXES = [
  '/api/webhooks/',
  '/_next/',
  '/icons/',
  '/manifest.json',
  '/favicon',
  '/icon',
  '/auth/callback', // OAuth callback
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ============================================================
  // RATE LIMITING — runs on EVERY request, even public ones
  // ============================================================
  // Skip rate limiting for static assets (the matcher already excludes
  // most, but double-check here for safety)
  if (pathname.startsWith('/_next/static') ||
      pathname.startsWith('/_next/image') ||
      /\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map|ico)$/.test(pathname)) {
    return NextResponse.next();
  }

  // Determine identifier (IP for unauthenticated, user ID for authenticated)
  // We'll use IP for rate limiting on public routes, and try to extract user ID
  // from the session cookie for authenticated routes.
  const identifier = getClientIdentifier(req);
  const config = getRateLimitConfig(pathname);
  const key = buildRateLimitKey(identifier, pathname);

  const rateLimitResponse = checkRateLimit(key, config);
  if (rateLimitResponse) {
    // Return 429 with Retry-After header
    return rateLimitResponse;
  }

  // Permitir assets y rutas públicas sin verificar sesión
  if (PUBLIC_PATHS.includes(pathname) || PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Crear cliente Supabase (refresca sesión expirada automáticamente)
  const { supabase, res } = createSupabaseMiddlewareClient(req);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Si es una llamada API, devolver 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    // Redirigir a login preservando la URL destino
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sesión válida: devolver la respuesta con cookies posiblemente refrescadas
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map)$).*)',
  ],
};
