import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PLANS } from '@/lib/plans';
import { AnalyticsClient } from './analytics-client';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, full_name, email, is_super_admin')
    .eq('id', user.id)
    .single();

  const plan = PLANS[profile?.plan || 'free'];

  const { data: menus } = await supabase
    .from('menus')
    .select('id, name, slug, views_count, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <AnalyticsClient
      user={{ email: user.email || '', name: profile?.full_name || user.email?.split('@')[0] || '' }}
      plan={plan}
      isSuperAdmin={profile?.is_super_admin === true}
      menus={menus || []}
      profilePlan={profile?.plan || 'free'}
    />
  );
}
