import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Endpoint de diagnóstico: muestra qué ve el server del usuario actual.
// Útil para debuggear por qué un super admin no es redirigido.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json(
      {
        authenticated: false,
        error: userErr?.message || 'No session',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  }

  // Intentar leer el profile (igual que hace /dashboard)
  let profile: unknown = null;
  let profileError: string | null = null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) {
      profileError = error.message;
    } else {
      profile = data;
    }
  } catch (e) {
    profileError = e instanceof Error ? e.message : String(e);
  }

  // También intentar con maybeSingle() (por si single falla)
  let profileMaybe: unknown = null;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('id, email, is_super_admin, is_active, plan, created_at')
      .eq('id', user.id)
      .maybeSingle();
    profileMaybe = data;
  } catch {}

  const p = profile as { is_super_admin?: boolean } | null;
  const pm = profileMaybe as { is_super_admin?: boolean } | null;

  return NextResponse.json(
    {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        app_metadata: user.app_metadata,
        user_metadata_keys: Object.keys(user.user_metadata || {}),
        created_at: user.created_at,
      },
      profile,
      profile_error: profileError,
      profile_maybe_single: profileMaybe,
      would_redirect_to_superadmin:
        p?.is_super_admin === true || pm?.is_super_admin === true,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
