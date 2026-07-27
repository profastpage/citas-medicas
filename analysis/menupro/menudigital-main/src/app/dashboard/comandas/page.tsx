import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PLANS, type PlanId } from '@/lib/plans';
import { ComandasClient } from './comandas-client';

export default async function ComandasPage() {
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

  // Cargar menú del usuario para seleccionar platos al crear comanda
  const { data: menus } = await supabase
    .from('menus')
    .select(`
      id, name, slug,
      categories:categories(id, name, dishes:dishes(id, name, price, description, image_url))
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <ComandasClient
      user={{ email: user.email || '', name: profile?.full_name || '' }}
      plan={plan}
      isSuperAdmin={profile?.is_super_admin === true}
      menus={menus || []}
    />
  );
}
