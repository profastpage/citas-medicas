import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PLANS, type PlanId } from '@/lib/plans';
import { BillingClient } from './billing-client';

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string; plan?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Contar uso
  const { count: menusCount } = await supabase
    .from('menus')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { data: userFiles } = await supabase.storage
    .from('menus')
    .list(user.id, { limit: 1000 });

  const params = await searchParams;

  const plan = PLANS[(profile?.plan as PlanId) || 'free'];

  return (
    <BillingClient
      user={{ email: user.email || '', name: profile?.full_name || user.email?.split('@')[0] || '' }}
      plan={plan}
      isSuperAdmin={profile?.is_super_admin === true}
      profile={{
        plan: (profile?.plan as PlanId) || 'free',
        email: profile?.email || user.email || '',
        currentPeriodEnd: profile?.current_period_end || null,
        mpStatus: profile?.mp_status || null,
        mpPreapprovalId: profile?.mp_preapproval_id || null,
      }}
      usage={{
        menusCount: menusCount || 0,
        imagesCount: userFiles?.length || 0,
      }}
      queryParams={params}
    />
  );
}
