import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PLANS } from '@/lib/plans';
import { DomainsClient } from './domains-client';

export default async function DomainsPage() {
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

  const { data: menus } = await supabase
    .from('menus')
    .select('id, name, slug, is_published')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const plan = PLANS[profile?.plan || 'free'];

  return (
    <DomainsClient
      user={{ email: user.email || '', name: profile?.full_name || user.email?.split('@')[0] || '' }}
      plan={plan}
      isSuperAdmin={profile?.is_super_admin === true}
      planId={profile?.plan || 'free'}
      menus={menus || []}
    />
  );
}
