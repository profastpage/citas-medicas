// ============================================================
// CitasPro SaaS — Middleware de autenticación
// ============================================================
// Refresca la sesión de Supabase Auth en cada request y
// protege rutas privadas. Si el usuario no está autenticado,
// redirige a /login (o devuelve 401 si es API).
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

const PUBLIC_PATHS = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register', '/api/health'];
const PUBLIC_PREFIXES = [
  '/api/webhooks/',
  '/_next/',
  '/icons/',
  '/manifest.json',
  '/favicon',
  '/auth/callback', // OAuth callback
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
