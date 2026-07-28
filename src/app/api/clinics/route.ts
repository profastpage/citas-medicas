// ============================================================
// /api/clinics — Listar y CREAR sucursales (multi-branch)
// ============================================================
// GET  → lista todas las clínicas del usuario (para selector de sucursal)
// POST → crea una nueva sucursal (respeta maxClinics del plan)
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import { assertCanAddClinic } from '@/lib/plan-limits';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinics = await db.clinic.findMany({
    where: { ownerId: user.id },
    select: {
      id: true,
      name: true,
      slug: true,
      ruc: true,
      address: true,
      phone: true,
      email: true,
      createdAt: true,
      _count: { select: { patients: true, doctors: true, appointments: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ clinics });
}

const createSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  ruc: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' },
      { status: 400 }
    );
  }

  // Verificar límite del plan
  const limitErr = await assertCanAddClinic(user.plan, user.id);
  if (limitErr) return limitErr;

  // Generar slug único
  const slug =
    parsed.data.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Math.random().toString(36).slice(2, 6);

  const clinic = await db.clinic.create({
    data: {
      ownerId: user.id,
      name: parsed.data.name,
      slug,
      ruc: parsed.data.ruc,
      address: parsed.data.address,
      phone: parsed.data.phone,
      email: parsed.data.email,
    },
  });

  // Especialidades por defecto en la nueva sucursal
  await db.specialty.createMany({
    data: ['Medicina General', 'Pediatría', 'Ginecología'].map(name => ({
      clinicId: clinic.id,
      name,
    })),
  });

  // Servicios por defecto
  await db.service.createMany({
    data: [
      { name: 'Consulta Médica General', price: 50, durationMin: 30, clinicId: clinic.id },
      { name: 'Consulta Pediátrica', price: 60, durationMin: 30, clinicId: clinic.id },
      { name: 'Examen Físico', price: 40, durationMin: 20, clinicId: clinic.id },
    ],
  });

  await db.auditLog.create({
    data: {
      clinicId: clinic.id,
      userId: user.id,
      action: 'CREATE',
      entity: 'Clinic',
      entityId: clinic.id,
      description: `Sucursal creada: ${clinic.name}`,
    },
  });

  return NextResponse.json({ clinic }, { status: 201 });
}
