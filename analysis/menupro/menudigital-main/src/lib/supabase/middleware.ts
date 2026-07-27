import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Si no hay configuración de Supabase, skip middleware (modo demo)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user: { id: string } | null = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    user = null;
  }

  // Rutas protegidas (incluye /superadmin)
  const protectedPaths = ['/dashboard', '/superadmin'];
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  // Rutas de auth (si ya logueado, redirigir según rol)
  const authPaths = ['/login', '/register'];
  const isAuthPath = authPaths.includes(request.nextUrl.pathname);

  // Verificar si usuario está baneado en rutas protegidas
  if (user && isProtected) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_active, is_super_admin')
        .eq('id', user.id)
        .single();

      // Usuario baneado → cerrar sesión y mandar a login
      if (profile && profile.is_active === false) {
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('error', 'account_banned');
        url.searchParams.set('error_description', 'Tu cuenta ha sido desactivada por el administrador.');
        return NextResponse.redirect(url);
      }

      // Super admin en /dashboard (exacto, sin subruta) → redirigir a /superadmin
      // Si está en subruta (ej: /dashboard/[menuId]) respetamos la navegación
      if (
        profile?.is_super_admin &&
        request.nextUrl.pathname === '/dashboard'
      ) {
        const url = request.nextUrl.clone();
        url.pathname = '/superadmin';
        url.search = '';
        return NextResponse.redirect(url);
      }

      // NO super admin intentando entrar a /superadmin → redirigir a /dashboard
      if (!profile?.is_super_admin && request.nextUrl.pathname.startsWith('/superadmin')) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
      }
    } catch {
      // Si falla la verificación (tabla no existe, etc.) no bloquear al usuario
    }
  }

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPath) {
    // Detectar si es super admin para redirigir al panel correcto
    let targetPath = '/dashboard';
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_super_admin, is_active')
        .eq('id', user.id)
        .single();
      if (profile?.is_active === false) {
        await supabase.auth.signOut();
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        url.searchParams.set('error', 'account_banned');
        return NextResponse.redirect(url);
      }
      if (profile?.is_super_admin) {
        targetPath = '/superadmin';
      }
    } catch {}
    const url = request.nextUrl.clone();
    url.pathname = targetPath;
    url.search = '';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
