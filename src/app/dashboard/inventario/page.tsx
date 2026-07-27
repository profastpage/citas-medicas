import { redirect } from 'next/navigation';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan } from '@/lib/plans';
import { InventarioClient } from './inventario-client';

export const dynamic = 'force-dynamic';

export default async function InventarioPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) redirect('/login');
  const clinic = await db.clinic.findUnique({ where: { id: clinicId } });
  if (!clinic) redirect('/login');

  const medications = await db.medication.findMany({
    where: { clinicId },
    orderBy: { commercialName: 'asc' },
  });

  const plan = getPlan(user.plan);

  return (
    <InventarioClient
      user={{ email: user.email, name: user.fullName }}
      plan={plan}
      clinicName={clinic.name}
      isSuperAdmin={user.role === 'super_admin'}
      medications={medications.map(m => ({
        id: m.id,
        commercialName: m.commercialName,
        genericName: m.genericName ?? '',
        presentation: m.presentation ?? '',
        stock: m.stock,
        minStock: m.minStock,
        unitPrice: m.unitPrice ?? null,
        expiryDate: m.expiryDate?.toISOString() ?? null,
        isActive: m.isActive,
      }))}
    />
  );
}
