import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  importFromJSON,
  importFromCSV,
  importFromExcelXML,
  detectFileType,
  type ImportCategory,
} from '@/lib/import-export';
import { PLANS, canAddDish, canAddCategory } from '@/lib/plans';

// POST /api/menus/[id]/import
// Permite importar categorías/platos desde JSON, CSV o Excel
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  const { id: menuId } = await params;

  // Verificar ownership y obtener menú con categorías
  const { data: menu, error: menuErr } = await supabase
    .from('menus')
    .select('id, user_id')
    .eq('id', menuId)
    .eq('user_id', user.id)
    .single();

  if (menuErr || !menu) {
    return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
  }

  // Verificar plan
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  const plan = PLANS[profile?.plan || 'free'];

  // Contar categorías y platos actuales
  const { data: existingCats } = await supabase
    .from('categories')
    .select('id')
    .eq('menu_id', menuId);

  const existingDishesCount = await countDishes(supabase, menuId);
  const catCount = existingCats?.length || 0;

  // Parsear FormData o body JSON
  let fileContent: string;
  let fileName: string;

  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 });
    }
    fileName = file.name;
    fileContent = await file.text();
  } else {
    // Body JSON con { content, filename }
    const body = await req.json();
    fileContent = body.content || '';
    fileName = body.filename || 'import.json';
  }

  if (!fileContent.trim()) {
    return NextResponse.json({ error: 'Archivo vacío' }, { status: 400 });
  }

  // Detectar tipo y parsear
  const fileType = detectFileType(fileName, fileContent);
  let importedCategories: ImportCategory[];

  try {
    switch (fileType) {
      case 'json':
        importedCategories = importFromJSON(fileContent);
        break;
      case 'csv':
        importedCategories = importFromCSV(fileContent);
        break;
      case 'excel':
        importedCategories = importFromExcelXML(fileContent);
        break;
      default:
        return NextResponse.json(
          { error: 'Formato no reconocido. Usa JSON, CSV o Excel (.xls).' },
          { status: 400 }
        );
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al procesar archivo' },
      { status: 400 }
    );
  }

  if (!importedCategories.length) {
    return NextResponse.json(
      { error: 'No se encontraron categorías o platos en el archivo' },
      { status: 400 }
    );
  }

  // Validar límites del plan
  const newCatCount = importedCategories.length;
  const newDishCount = importedCategories.reduce(
    (sum, cat) => sum + cat.dishes.length,
    0
  );

  if (!canAddCategory(catCount + newCatCount, plan)) {
    return NextResponse.json(
      { error: `Límite de categorías alcanzado. Tienes ${catCount}, puedes agregar ${plan.limits.maxCategories === -1 ? '∞' : String(plan.limits.maxCategories - catCount)} más. Upgrade a Pro.` },
      { status: 403 }
    );
  }

  if (!canAddDish(existingDishesCount + newDishCount, plan)) {
    return NextResponse.json(
      { error: `Límite de platos alcanzado. Tienes ${existingDishesCount}, quieres agregar ${newDishCount} más. Upgrade a Pro.` },
      { status: 403 }
    );
  }

  // Insertar categorías y platos
  let totalCatsInserted = 0;
  let totalDishesInserted = 0;

  for (let i = 0; i < importedCategories.length; i++) {
    const cat = importedCategories[i];
    if (!cat.name.trim()) continue;

    const sortOrder = catCount + i;

    const { data: newCat, error: catErr } = await supabase
      .from('categories')
      .insert({
        menu_id: menuId,
        name: cat.name.trim(),
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (catErr || !newCat) {
      return NextResponse.json(
        { error: `Error insertando categoría "${cat.name}": ${catErr?.message}` },
        { status: 500 }
      );
    }

    totalCatsInserted++;

    for (let j = 0; j < cat.dishes.length; j++) {
      const dish = cat.dishes[j];
      if (!dish.name.trim()) continue;

      const { error: dishErr } = await supabase.from('dishes').insert({
        category_id: newCat.id,
        name: dish.name.trim(),
        description: dish.description || null,
        price: typeof dish.price === 'number' ? dish.price : parseFloat(String(dish.price)) || 0,
        image_url: dish.image_url || null,
        sort_order: j,
      });

      if (dishErr) {
        return NextResponse.json(
          { error: `Error insertando plato "${dish.name}": ${dishErr.message}` },
          { status: 500 }
        );
      }

      totalDishesInserted++;
    }
  }

  return NextResponse.json({
    success: true,
    imported: {
      categories: totalCatsInserted,
      dishes: totalDishesInserted,
    },
    message: `Se importaron ${totalCatsInserted} categorías y ${totalDishesInserted} platos correctamente.`,
  });
}

// Contar platos de un menú
async function countDishes(supabase: Awaited<ReturnType<typeof createClient>>, menuId: string): Promise<number> {
  const { data: cats } = await supabase
    .from('categories')
    .select('id')
    .eq('menu_id', menuId);

  if (!cats || cats.length === 0) return 0;

  const catIds = cats.map((c) => c.id);
  const { count } = await supabase
    .from('dishes')
    .select('*', { count: 'exact', head: true })
    .in('category_id', catIds);

  return count || 0;
}
