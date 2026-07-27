import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { MozoPanel } from './mozo-client';

export default async function MozoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  // Validar que el token existe y trae datos
  const supabase = await createClient();
  const { data: waiter } = await supabase
    .from('waiters')
    .select('id, full_name, is_active, qr_token')
    .eq('qr_token', token)
    .single();

  if (!waiter) notFound();

  return <MozoPanel token={token} waiterName={waiter.full_name} />;
}
