import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const doctorId = searchParams.get('doctorId');
  const status = searchParams.get('status');

  const where: any = { clinicId };
  if (from || to) {
    where.appointmentDate = {};
    if (from) where.appointmentDate.gte = new Date(from);
    if (to) where.appointmentDate.lte = new Date(to);
  }
  if (doctorId) where.doctorId = doctorId;
  if (status) where.status = status;

  const appointments = await db.appointment.findMany({
    where,
    include: {
      patient: true,
      doctor: { include: { specialty: true } },
      service: true,
    },
    orderBy: { appointmentDate: 'asc' },
    take: 500,
  });

  return NextResponse.json({ appointments });
}

const createSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  serviceId: z.string().optional(),
  appointmentDate: z.string().min(1),
  durationMin: z.number().min(5).max(480).default(30),
  reason: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().default('pendiente'),
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

  const { appointmentDate, ...rest } = parsed.data;
  const appointment = await db.appointment.create({
    data: {
      ...rest,
      clinicId,
      appointmentDate: new Date(appointmentDate),
    },
  });

  await db.auditLog.create({
    data: {
      clinicId,
      userId: user.id,
      action: 'CREATE',
      entity: 'Appointment',
      entityId: appointment.id,
      description: `Cita creada para ${appointmentDate}`,
    },
  });

  return NextResponse.json({ appointment });
}
