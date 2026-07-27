import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PLANS } from '@/lib/plans';
import { QRClient } from './qr-client';

export default async function QRPage({
  params,
}: {
  params: Promise<{ menuId: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { menuId } = await params;

  const { data: menu } = await supabase
    .from('menus')
    .select('*')
    .eq('id', menuId)
    .eq('user_id', user.id)
    .single();

  if (!menu) {
    redirect('/dashboard');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = PLANS[profile?.plan || 'free'];

  return (
    <QRClient
      menu={{
        id: menu.id,
        name: menu.name,
        slug: menu.slug,
        color: menu.color,
      }}
      plan={plan}
    />
  );
}
