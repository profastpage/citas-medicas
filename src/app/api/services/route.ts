import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const services = await db.service.findMany({
    where: { clinicId },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ services });
}

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  durationMin: z.number().min(5).max(480).default(30),
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

  const service = await db.service.create({
    data: { ...parsed.data, clinicId },
  });

  return NextResponse.json({ service });
}
