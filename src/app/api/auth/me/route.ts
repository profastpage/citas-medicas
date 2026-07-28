import { NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const clinicId = await getActiveClinicId(user.id);

  let clinic = null;
  if (clinicId) {
    clinic = await db.clinic.findUnique({
      where: { id: clinicId },
      select: {
        id: true,
        name: true,
        slug: true,
        currency: true,
        themeColor: true,
        isWhiteLabel: true,
      },
    });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      plan: user.plan,
      mpStatus: user.mpStatus,
      currentPeriodEnd: user.currentPeriodEnd,
    },
    clinic,
  });
}
