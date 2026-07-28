import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getPlan, PLANS, LIMIT_COMPARISON } from '@/lib/plans';
import { BillingClient } from './billing-client';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const plan = getPlan(user.plan);

  return (
    <BillingClient
      user={{
        email: user.email,
        name: user.fullName,
      }}
      currentPlan={plan}
      mpStatus={user.mpStatus}
      currentPeriodEnd={user.currentPeriodEnd?.toISOString() ?? null}
      isSuperAdmin={user.role === 'super_admin'}
    />
  );
}
