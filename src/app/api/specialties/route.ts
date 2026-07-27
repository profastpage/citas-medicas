import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const [specialties, services] = await Promise.all([
    db.specialty.findMany({ where: { clinicId }, orderBy: { name: 'asc' } }),
    db.service.findMany({ where: { clinicId }, orderBy: { name: 'asc' } }),
  ]);

  return NextResponse.json({ specialties, services });
}

const schema = z.object({
  name: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  // Verificar duplicado
  const existing = await db.specialty.findFirst({
    where: { clinicId, name: parsed.data.name },
  });
  if (existing) {
    return NextResponse.json({ error: 'Ya existe' }, { status: 400 });
  }

  const specialty = await db.specialty.create({
    data: { name: parsed.data.name, clinicId },
  });

  return NextResponse.json({ specialty });
}
