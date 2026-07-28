import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const sessions = await db.cashSession.findMany({
    where: { clinicId },
    include: { expenses: true, _count: { select: { expenses: true } } },
    orderBy: { openedAt: 'desc' },
    take: 30,
  });

  const active = sessions.find(s => s.status === 'abierta') ?? null;

  return NextResponse.json({ sessions, active });
}

const openSchema = z.object({
  openingAmount: z.number().min(0).default(0),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const body = await req.json();
  const parsed = openSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  // No permitir 2 sesiones abiertas a la vez
  const existing = await db.cashSession.findFirst({
    where: { clinicId, status: 'abierta' },
  });
  if (existing) {
    return NextResponse.json(
      { error: 'Ya hay una sesión de caja abierta' },
      { status: 400 }
    );
  }

  const session = await db.cashSession.create({
    data: {
      ...parsed.data,
      clinicId,
      openedByUserId: user.id,
      status: 'abierta',
    },
  });

  return NextResponse.json({ session });
}
