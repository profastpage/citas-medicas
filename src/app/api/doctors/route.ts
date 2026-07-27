import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const doctors = await db.doctor.findMany({
    where: { clinicId },
    include: {
      specialty: true,
      schedules: true,
      _count: { select: { appointments: true } },
    },
    orderBy: { fullName: 'asc' },
  });

  return NextResponse.json({ doctors });
}

const createSchema = z.object({
  fullName: z.string().min(2),
  specialtyId: z.string().min(1),
  documentId: z.string().optional(),
  colegiatura: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  bio: z.string().optional(),
  consultationPrice: z.number().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' },
      { status: 400 }
    );
  }

  const doctor = await db.doctor.create({
    data: { ...parsed.data, clinicId },
  });

  await db.auditLog.create({
    data: {
      clinicId,
      userId: user.id,
      action: 'CREATE',
      entity: 'Doctor',
      entityId: doctor.id,
      description: `Médico creado: ${doctor.fullName}`,
    },
  });

  return NextResponse.json({ doctor });
}
