import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const schema = z.object({
  email: z.string().email(),
});

/**
 * POST /api/auth/forgot
 * Sends a password reset email via Supabase Auth.
 * Rate-limited at the middleware layer (5/hour/IP) to prevent abuse.
 * Always returns 200 OK (don't leak whether the email exists).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    const { email } = parsed.data;
    const supabase = await createSupabaseServerClient();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://citas-medicas-red.vercel.app';
    const redirectTo = `${appUrl}/login?reset=1`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.error('[forgot] supabase error:', error.message);
    }

    // Always return success — even if the email doesn't exist (anti-enumeration)
    return NextResponse.json({
      ok: true,
      message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña.',
    });
  } catch (err) {
    console.error('[forgot]', err);
    return NextResponse.json({ error: 'Error al enviar el email' }, { status: 500 });
  }
}
