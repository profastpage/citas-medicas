import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const patients = await db.patient.findMany({
    where: { clinicId },
    orderBy: { lastName: 'asc' },
    include: { _count: { select: { appointments: true } } },
  });

  return NextResponse.json({ patients });
}

const createSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  documentType: z.string().optional(),
  documentId: z.string().optional(),
  birthDate: z.string().optional(),
  sex: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  medicalHistory: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  notes: z.string().optional(),
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

  const data = parsed.data;
  const patient = await db.patient.create({
    data: {
      ...data,
      fullName: `${data.firstName} ${data.lastName}`,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      medicalRecordNumber: `HC-${Date.now().toString().slice(-8)}`,
      clinicId,
    },
  });

  // Auditar
  await db.auditLog.create({
    data: {
      clinicId,
      userId: user.id,
      action: 'CREATE',
      entity: 'Patient',
      entityId: patient.id,
      description: `Paciente creado: ${patient.fullName}`,
    },
  });

  return NextResponse.json({ patient });
}
