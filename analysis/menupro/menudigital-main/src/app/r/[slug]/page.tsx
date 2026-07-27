import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { buildMenuHTML } from '@/app/dashboard/[menuId]/menu-html-builder';
import type { MenuData } from '@/lib/menu-utils';

export const dynamic = 'force-dynamic';

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Buscar menu por slug (debe estar publicado)
  const { data: menu } = await supabase
    .from('menus')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!menu) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#07070b] text-white p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Menú no encontrado</h1>
          <p className="text-white/60 mb-6">
            El menú que buscas no existe o no está publicado.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-[#d4af37] text-[#1a1a2e] font-semibold hover:opacity-90"
          >
            Volver al inicio
          </a>
        </div>
      </main>
    );
  }

  // Cargar categorias y platos
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('menu_id', menu.id)
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

  // Determinar si mostrar branding: Free y Pro muestran "Creado con MenuPro" con hipervínculo.
  // Premium y Full son white label (sin marca).
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', menu.user_id)
    .single();

  // Planes Free y Pro muestran branding (con hipervínculo al landing — genera leads orgánicos)
  const showBranding = ['free', 'pro'].includes(profile?.plan || 'free');

  const fullMenu: MenuData = {
    ...menu,
    branding_text: showBranding ? 'Creado con MenuPro' : null,
    categories: categoriesWithDishes,
  } as MenuData;

  // Registrar visita (fire-and-forget, no bloquea render)
  registerView(menu.id).catch(() => {});

  const html = buildMenuHTML(fullMenu);

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}

async function registerView(menuId: string) {
  const supabase = await createClient();
  // Insert en menu_views (policy permite insert anónimo)
  await supabase.from('menu_views').insert({
    menu_id: menuId,
  });
  // Incrementar contador
  await supabase.rpc('increment_menu_views', { menu_uuid: menuId });
}

// Desactivar headers que cacheen demasiado
export async function generateMetadata() {
  return {
    other: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  };
}

// Reexportar NextResponse para evitar tree-shake (no se usa pero evita warnings)
export const _unused = NextResponse;
