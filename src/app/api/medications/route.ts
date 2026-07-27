import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) return NextResponse.json({ error: 'Sin clínica' }, { status: 400 });

  const medications = await db.medication.findMany({
    where: { clinicId },
    orderBy: { commercialName: 'asc' },
  });

  return NextResponse.json({ medications });
}

const schema = z.object({
  commercialName: z.string().min(1),
  genericName: z.string().optional(),
  presentation: z.string().optional(),
  stock: z.number().int().default(0),
  minStock: z.number().int().default(5),
  unitPrice: z.number().optional(),
  expiryDate: z.string().optional(),
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

  const { expiryDate, ...rest } = parsed.data;
  const medication = await db.medication.create({
    data: {
      ...rest,
      clinicId,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
    },
  });

  return NextResponse.json({ medication });
}
