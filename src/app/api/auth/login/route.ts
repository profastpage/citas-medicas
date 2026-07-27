import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const supabase = await createSupabaseServerClient();

    // Autenticar con Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // Verificar que el usuario tenga perfil de negocio activo
    const user = await db.user.findUnique({
      where: { supabaseUid: data.user.id },
    });

    if (!user) {
      // El trigger trg_on_auth_user_created debería haberlo creado.
      // Si no existe, lo creamos aquí como fallback.
      await db.user.create({
        data: {
          supabaseUid: data.user.id,
          email: data.user.email ?? email,
          fullName:
            data.user.user_metadata?.full_name ??
            email.split('@')[0],
        },
      });
    } else if (!user.isActive) {
      // Cerrar sesión de Supabase si está deshabilitado
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: 'Cuenta deshabilitada. Contacta soporte.' },
        { status: 403 }
      );
    }

    const profile = user ?? (await db.user.findUnique({ where: { supabaseUid: data.user.id } }));

    return NextResponse.json({
      ok: true,
      user: {
        id: profile?.id,
        email: profile?.email,
        fullName: profile?.fullName,
        role: profile?.role,
        plan: profile?.plan,
      },
    });
  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}
