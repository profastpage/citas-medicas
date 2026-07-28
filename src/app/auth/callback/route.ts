import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

/**
 * OAuth callback — Supabase redirige aquí tras login con Google.
 * Intercambia el código por sesión, crea/actualiza el perfil de
 * negocio y redirige al dashboard (o a /superadmin si es super_admin).
 */
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Ensure profile exists in our DB. The trigger
      // trg_on_auth_user_created should have created it, but for
      // OAuth users the metadata sometimes arrives slightly later,
      // so we double-check here as a fallback.
      const existing = await db.user.findUnique({
        where: { supabaseUid: data.user.id },
      });

      if (!existing) {
        const fullName =
          data.user.user_metadata?.full_name ??
          data.user.user_metadata?.name ??
          (data.user.email ?? 'user').split('@')[0];

        const avatarUrl = data.user.user_metadata?.avatar_url ?? null;

        // Check if this email should be super_admin
        const SUPER_ADMIN_EMAIL = 'profastpage@gmail.com';
        const isSuperAdmin = (data.user.email ?? '').toLowerCase() === SUPER_ADMIN_EMAIL;

        await db.user.create({
          data: {
            supabaseUid: data.user.id,
            email: data.user.email ?? '',
            fullName,
            avatarUrl,
            role: isSuperAdmin ? 'super_admin' : 'owner',
            isActive: true,
            plan: 'free',
          },
        });
      } else {
        // Upgrade to super_admin if email matches (covers cases where
        // the user already existed but we're now flagging them)
        const SUPER_ADMIN_EMAIL = 'profastpage@gmail.com';
        if (
          (data.user.email ?? '').toLowerCase() === SUPER_ADMIN_EMAIL &&
          existing.role !== 'super_admin'
        ) {
          await db.user.update({
            where: { id: existing.id },
            data: { role: 'super_admin' },
          });
        }
      }

      // If super_admin, send to /superadmin
      const profile = existing ?? await db.user.findUnique({ where: { supabaseUid: data.user.id } });
      const dest = profile?.role === 'super_admin' ? '/superadmin' : next;
      return NextResponse.redirect(`${origin}${dest}`);
    }
    console.error('[auth/callback] error:', error?.message);
  }

  // Si falla, redirigir a login con error
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
