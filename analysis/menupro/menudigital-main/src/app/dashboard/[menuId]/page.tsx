import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PLANS } from '@/lib/plans';
import { EditorClient } from './editor-client';
import type { MenuData, ProfileData } from '@/lib/menu-utils';

export default async function EditorPage({
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

  // Cargar menu con categorias y platos
  const { data: menu } = await supabase
    .from('menus')
    .select('*')
    .eq('id', menuId)
    .eq('user_id', user.id)
    .single();

  if (!menu) {
    redirect('/dashboard');
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('menu_id', menuId)
    .order('sort_order', { ascending: true });

  const categoriesWithDishes = await Promise.all(
    (categories || []).map(async (cat) => {
      const { data: dishes } = await supabase
        .from('dishes')
        .select('*')
        .eq('category_id', cat.id)
        .order('sort_order', { ascending: true });
      return { ...cat, dishes: dishes || [] };
    })
  );

  // Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const plan = PLANS[profile?.plan || 'free'];

  // Contar imágenes del usuario
  const { data: userFiles } = await supabase.storage
    .from('menus')
    .list(user.id, { limit: 1000 });

  const fullMenu: MenuData = {
    ...menu,
    categories: categoriesWithDishes,
  } as MenuData;

  return (
    <EditorClient
      initialMenu={fullMenu}
      plan={plan}
      profile={profile as ProfileData}
      imagesCount={userFiles?.length || 0}
    />
  );
}
