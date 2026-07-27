// ============================================================
// CitasPro SaaS — Middleware de autenticación
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

const PUBLIC_PATHS = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register', '/api/health'];
const PUBLIC_PREFIXES = ['/api/webhooks/', '/_next/', '/icons/', '/manifest.json', '/favicon'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir assets y rutas públicas
  if (PUBLIC_PATHS.includes(pathname) || PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Verificar sesión
  const token = req.cookies.get('citaspro_session')?.value;
  const session = token ? await verifySession(token) : null;

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

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map)$).*)',
  ],
};
