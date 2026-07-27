import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';

const schema = z.object({
  fullName: z.string().min(2, 'Nombre muy corto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  clinicName: z.string().min(2, 'Nombre de clínica requerido'),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' },
        { status: 400 }
      );
    }

    const { fullName, email, password, clinicName, phone } = parsed.data;

    // Verificar email no registrado en nuestro perfil
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email' },
        { status: 409 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Crear usuario en Supabase Auth (esto dispara el trigger que crea el perfil)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });

    if (authError || !authData.user) {
      // Mensaje amigable para email ya registrado en Supabase pero sin perfil
      const msg = authError?.message ?? 'Error al crear la cuenta';
      if (msg.toLowerCase().includes('already been registered') || msg.toLowerCase().includes('already registered')) {
        return NextResponse.json(
          { error: 'Ya existe una cuenta con este email' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const supabaseUid = authData.user.id;

    // Fallback: si el trigger no creó el perfil (puede pasar en algunos setups),
    // lo creamos manualmente.
    const userProfile = await db.user.upsert({
      where: { supabaseUid },
      update: {
        email,
        fullName,
        phone,
        role: 'owner',
        plan: 'free',
      },
      create: {
        supabaseUid,
        email,
        fullName,
        phone,
        role: 'owner',
        plan: 'free',
      },
    });

    // Generar slug único para la clínica
    const slug =
      clinicName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') +
      '-' +
      Math.random().toString(36).slice(2, 6);

    // Crear la clínica
    const clinic = await db.clinic.create({
      data: {
        ownerId: userProfile.id,
        name: clinicName,
        slug,
        phone,
      },
    });

    // Especialidades por defecto
    const defaultSpecialties = ['Medicina General', 'Pediatría', 'Ginecología'];
    await db.specialty.createMany({
      data: defaultSpecialties.map(name => ({
        clinicId: clinic.id,
        name,
      })),
    });

    // Servicios por defecto
    const defaultServices = [
      { name: 'Consulta Médica General', price: 50, durationMin: 30 },
      { name: 'Consulta Pediátrica', price: 60, durationMin: 30 },
      { name: 'Examen Físico', price: 40, durationMin: 20 },
    ];
    await db.service.createMany({
      data: defaultServices.map(s => ({
        ...s,
        clinicId: clinic.id,
      })),
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        fullName: userProfile.fullName,
        plan: userProfile.plan,
      },
      clinic: { id: clinic.id, name: clinic.name, slug: clinic.slug },
    });
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json(
      { error: 'Error al crear la cuenta' },
      { status: 500 }
    );
  }
}
