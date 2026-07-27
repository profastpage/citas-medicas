import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Si hay error de OAuth (ej: usuario canceló, o Google retornó error)
  if (error) {
    const loginUrl = new URL('/login', requestUrl.origin);
    loginUrl.searchParams.set('error', error);
    if (errorDescription) loginUrl.searchParams.set('error_description', errorDescription);
    return NextResponse.redirect(loginUrl);
  }

  let resolvedRedirect = redirect || '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      const loginUrl = new URL('/login', requestUrl.origin);
      loginUrl.searchParams.set('error', 'auth_failed');
      loginUrl.searchParams.set('error_description', exchangeError.message);
      return NextResponse.redirect(loginUrl);
    }

    // ── Detectar rol del usuario y redirigir automáticamente ──
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id) {
      // Si no existe profile, backfill manual (por si el trigger falló)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, is_super_admin, is_active')
        .eq('id', user.id)
        .maybeSingle();

      if (!existingProfile) {
        // Crear profile manualmente si falta
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email || '',
          full_name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            null,
          avatar_url:
            user.user_metadata?.avatar_url ||
            user.user_metadata?.picture ||
            null,
          plan: 'free',
          is_active: true,
        }, { onConflict: 'id' });
      }

      // Volver a leer profile (por si acabamos de crearlo)
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_super_admin, is_active')
        .eq('id', user.id)
        .single();

      // Usuario baneado → cerrar sesión inmediatamente
      if (profile && profile.is_active === false) {
        await supabase.auth.signOut();
        const loginUrl = new URL('/login', requestUrl.origin);
        loginUrl.searchParams.set('error', 'account_banned');
        loginUrl.searchParams.set(
          'error_description',
          'Tu cuenta ha sido desactivada. Contacta al administrador.'
        );
        return NextResponse.redirect(loginUrl);
      }

      // Super admin → forzar /superadmin SI el redirect es exactamente /dashboard
      // (si el redirect es a subruta como /dashboard/[id], respetarlo)
      if (profile?.is_super_admin && (resolvedRedirect === '/dashboard' || !resolvedRedirect)) {
        resolvedRedirect = '/superadmin';
      }
    }
  }

  // Redirigir al destino final
  const targetUrl = new URL(resolvedRedirect, requestUrl.origin);
  return NextResponse.redirect(targetUrl);
}
