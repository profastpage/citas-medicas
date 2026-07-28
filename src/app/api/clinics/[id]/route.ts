import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  name: z.string().optional(),
  ruc: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  currency: z.string().optional(),
  themeColor: z.string().optional(),
  brandingText: z.string().optional(),
  isWhiteLabel: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await params;

  // Verificar ownership
  const clinic = await db.clinic.findUnique({ where: { id } });
  if (!clinic || clinic.ownerId !== user.id) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  const updated = await db.clinic.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ clinic: updated });
}
