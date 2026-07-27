import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword, signSession, setSessionCookie } from '@/lib/auth';

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

    // Verificar email no registrado
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email' },
        { status: 409 }
      );
    }

    // Crear usuario + clínica en transacción
    const passwordHash = await hashPassword(password);
    const slug = clinicName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6);

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone,
        role: 'owner',
        plan: 'free',
        ownedClinics: {
          create: {
            name: clinicName,
            slug,
            phone,
          },
        },
      },
      include: { ownedClinics: true },
    });

    // Crear specialties de default
    const defaultSpecialties = ['Medicina General', 'Pediatría', 'Ginecología'];
    await db.specialty.createMany({
      data: defaultSpecialties.map(name => ({
        clinicId: user.ownedClinics[0].id,
        name,
      })),
    });

    // Servicios default
    const defaultServices = [
      { name: 'Consulta Médica General', price: 50, durationMin: 30 },
      { name: 'Consulta Pediátrica', price: 60, durationMin: 30 },
      { name: 'Examen Físico', price: 40, durationMin: 20 },
    ];
    await db.service.createMany({
      data: defaultServices.map(s => ({
        ...s,
        clinicId: user.ownedClinics[0].id,
      })),
    });

    // Sesión
    const token = await signSession({
      userId: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, fullName: user.fullName, plan: user.plan },
    });
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json(
      { error: 'Error al crear la cuenta' },
      { status: 500 }
    );
  }
}
