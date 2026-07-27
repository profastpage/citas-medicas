import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { GuiaClient } from './guia-client';
import { PLANS } from '@/lib/plans';

export default async function GuiaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/guia');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, plan, is_super_admin')
    .eq('id', user.id)
    .single();

  const plan = PLANS[(profile?.plan as keyof typeof PLANS) || 'free'] || PLANS.free;

  return (
    <GuiaClient
      user={{
        email: user.email || '',
        name: profile?.full_name || user.email?.split('@')[0] || '',
      }}
      plan={plan}
      isSuperAdmin={profile?.is_super_admin === true}
    />
  );
}
