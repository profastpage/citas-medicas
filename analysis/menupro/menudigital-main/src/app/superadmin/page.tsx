import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SuperAdminClient } from './superadmin-client';

export default async function SuperAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/superadmin');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar_url, is_super_admin, is_active')
    .eq('id', user.id)
    .single();

  // Usuario baneado → logout
  if (profile && profile.is_active === false) {
    redirect('/login?error=account_banned');
  }

  if (!profile?.is_super_admin) {
    // No es super admin → al dashboard de usuario normal
    redirect('/dashboard');
  }

  return (
    <SuperAdminClient
      admin={{
        email: profile.email || user.email || '',
        name: profile.full_name || user.email?.split('@')[0] || 'Admin',
        avatar_url: profile.avatar_url || null,
      }}
    />
  );
}
