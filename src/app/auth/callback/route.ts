import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * OAuth callback — Supabase redirige aquí tras login con Google/GitHub.
 * Intercambia el código por sesión y redirige al dashboard.
 */
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('[auth/callback] error:', error.message);
  }

  // Si falla, redirigir a login con error
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
