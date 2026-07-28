import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

/**
 * GET /api/auth/google
 * Redirects the user to Google OAuth via Supabase.
 * After Google authenticates, Supabase redirects to /auth/callback
 * which exchanges the code for a session and creates/updates the
 * user profile.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const next = searchParams.get('next') ?? '/dashboard';

  const supabase = await createSupabaseServerClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://citas-medicas-red.vercel.app';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error || !data?.url) {
    console.error('[google] oauth error:', error?.message);
    return NextResponse.redirect(
      `${appUrl}/login?error=google_oauth_failed`
    );
  }

  return NextResponse.redirect(data.url);
}
