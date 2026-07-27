import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const { id } = await params;
  const body = await req.json();

  // Verificar que la cita pertenece a la clínica
  const existing = await db.appointment.findFirst({
    where: { id, clinicId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
  }

  // Campos actualizables
  const allowed = [
    'status', 'reason', 'notes',
    'weight', 'height', 'temperature', 'bloodPressure',
    'heartRate', 'respiratoryRate', 'oxygenSaturation',
    'illnessDuration', 'currentIllness', 'background',
    'physicalExam', 'auxiliaryExams', 'diagnosis',
    'treatment', 'prescription', 'restDays', 'restEndDate',
    'followUpDate', 'serviceId', 'doctorId', 'appointmentDate',
    'durationMin',
  ];

  const data: any = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      data[key] = body[key];
    }
  }

  if (data.appointmentDate) data.appointmentDate = new Date(data.appointmentDate);
  if (data.restEndDate) data.restEndDate = new Date(data.restEndDate);
  if (data.followUpDate) data.followUpDate = new Date(data.followUpDate);

  const updated = await db.appointment.update({
    where: { id },
    data,
  });

  await db.auditLog.create({
    data: {
      clinicId,
      userId: user.id,
      action: 'UPDATE',
      entity: 'Appointment',
      entityId: id,
      description: `Cita actualizada. Campos: ${Object.keys(data).join(', ')}`,
    },
  });

  return NextResponse.json({ appointment: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const { id } = await params;

  const existing = await db.appointment.findFirst({
    where: { id, clinicId },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
  }

  await db.appointment.delete({ where: { id } });

  await db.auditLog.create({
    data: {
      clinicId,
      userId: user.id,
      action: 'DELETE',
      entity: 'Appointment',
      entityId: id,
      description: `Cita eliminada`,
    },
  });

  return NextResponse.json({ ok: true });
}
