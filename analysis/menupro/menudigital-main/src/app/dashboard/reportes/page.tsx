import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PLANS, type PlanId } from '@/lib/plans';
import { ReportesClient } from './reportes-client';

export default async function ReportesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const planId = (profile?.plan as PlanId) || 'free';
  const plan = PLANS[planId] || PLANS.free;

  // Cargar sucursales si tiene multi-branch
  let branches: { id: string; name: string }[] = [];
  if (plan.limits.hasMultiBranch) {
    const { data } = await supabase
      .from('branches')
      .select('id, name')
      .eq('owner_id', user.id)
      .eq('is_active', true)
      .order('name');
    branches = data || [];
  }

  return (
    <ReportesClient
      user={{ email: user.email || '', name: profile?.full_name || '' }}
      plan={plan}
      isSuperAdmin={profile?.is_super_admin === true}
      branches={branches}
    />
  );
}
