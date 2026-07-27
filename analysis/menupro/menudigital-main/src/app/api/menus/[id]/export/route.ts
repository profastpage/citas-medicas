import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  exportToJSON,
  exportToCSV,
  exportToExcelHTML,
  exportToWordHTML,
  type ExportData,
} from '@/lib/import-export';

// GET /api/menus/[id]/export?format=json|csv|excel|word
// Permite exportar un menú en múltiples formatos
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { id } = await params;
  const url = new URL(_req.url);
  const format = (url.searchParams.get('format') || 'json').toLowerCase();

  // Verificar ownership
  const { data: menu, error: menuErr } = await supabase
    .from('menus')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (menuErr || !menu) {
    return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
  }

  // Obtener categorías con platos
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('menu_id', id)
    .order('sort_order', { ascending: true });

  const categoriesWithDishes = await Promise.all(
    (categories || []).map(async (cat) => {
      const { data: dishes } = await supabase
        .from('dishes')
        .select('*')
        .eq('category_id', cat.id)
        .order('sort_order', { ascending: true });
      return {
        name: cat.name,
        dishes: (dishes || []).map((d) => ({
          name: d.name,
          description: d.description || '',
          price: d.price,
          image_url: d.image_url || '',
        })),
      };
    })
  );

  // Construir datos de exportación
  const exportData: ExportData = {
    menu_name: menu.name,
    slogan: menu.slogan || '',
    description: menu.description || '',
    whatsapp: menu.whatsapp || '',
    currency: menu.currency || 'S/',
    categories: categoriesWithDishes,
    exported_at: new Date().toISOString(),
    version: '1.0.0',
  };

  // Generar según formato
  let content: string;
  let mimeType: string;
  let filename: string;
  const safeName = (menu.name || 'menu').replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '').replace(/\s+/g, '-');

  switch (format) {
    case 'csv':
      content = exportToCSV(exportData);
      mimeType = 'text/csv; charset=utf-8';
      filename = `${safeName}.csv`;
      break;
    case 'excel':
      content = exportToExcelHTML(exportData);
      mimeType = 'application/vnd.ms-excel; charset=utf-8';
      filename = `${safeName}.xls`;
      break;
    case 'word':
      content = exportToWordHTML(exportData);
      mimeType = 'application/msword; charset=utf-8';
      filename = `${safeName}.doc`;
      break;
    case 'json':
    default:
      content = exportToJSON(exportData);
      mimeType = 'application/json; charset=utf-8';
      filename = `${safeName}.json`;
      break;
  }

  // Agregar BOM para CSV/Excel/Word para que Excel reconozca UTF-8
  if (format === 'csv' || format === 'excel' || format === 'word') {
    content = '\uFEFF' + content;
  }

  return new NextResponse(content, {
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
