/**
 * Verifica que buildMenuHTML con isPreview=true muestre el placeholder
 * y con isPreview=false (carta pública) lo oculte.
 */
import { buildMenuHTML } from '../src/app/dashboard/[menuId]/menu-html-builder';
import type { MenuData } from '../src/lib/menu-utils';

const sampleMenu: MenuData = {
  id: 'test-1', user_id: 'u1', slug: 'test',
  name: 'Pollería Rikos', slogan: 'El mejor pollo a la brasa',
  whatsapp: '51999999999', color: '#dc2626', secondary_color: '#1a1a2e',
  layout: 'single', image_size: 'medium', card_style: 'expanded',
  font: 'Inter', dark_mode: true, show_search: true,
  show_category_icons: true, rounded_corners: true,
  cover_url: null, dish_gallery: true, is_published: true,
  branding_text: 'Creado con MenuPro',
  categories: [
    { id: 'c1', menu_id: 'test-1', name: 'Entradas', sort_order: 0,
      dishes: [
        { id: 'd1', category_id: 'c1', name: 'Ensalada de Palta',
          description: 'Ensalada con abundante palta, lechuga y tomate',
          price: 25, image_url: 'https://example.com/salad.jpg',
          gallery: [], options: [], sort_order: 0 },
      ],
    },
  ],
} as any;

const publicHtml = buildMenuHTML(sampleMenu, { isPreview: false });
const previewHtml = buildMenuHTML(sampleMenu, { isPreview: true });

console.log('\n=== TEST: isPreview vs public ===\n');
console.log('PUBLIC (isPreview=false):');
console.log('  - Contains "Personaliza tu pedido":', publicHtml.includes('Personaliza tu pedido'));
console.log('  - Contains "Este plato no tiene extras":', publicHtml.includes('Este plato no tiene extras'));
console.log('  - Contains IS_PREVIEW = false:', publicHtml.includes('IS_PREVIEW = false'));
console.log('');
console.log('PREVIEW (isPreview=true):');
console.log('  - Contains "Personaliza tu pedido":', previewHtml.includes('Personaliza tu pedido'));
console.log('  - Contains "Este plato no tiene extras":', previewHtml.includes('Este plato no tiene extras'));
console.log('  - Contains IS_PREVIEW = true:', previewHtml.includes('IS_PREVIEW = true'));
console.log('');

// Additional checks for cart bar overlap fix
console.log('=== Mobile bottom nav fixes ===');
console.log('  - Cart hidden on mobile (.cart display:none):', publicHtml.includes('@media(max-width:639px){.cart{display:none'));
console.log('  - mbn-icon-wrap class added:', publicHtml.includes('mbn-icon-wrap'));
console.log('  - mbn-cart-total max-width:90px:', publicHtml.includes('max-width:90px'));
console.log('  - Cart total z-index:2:', publicHtml.includes('z-index:2;max-width:90px'));
console.log('');

const allPass = !publicHtml.includes('Personaliza tu pedido') 
  && previewHtml.includes('Personaliza tu pedido')
  && publicHtml.includes('@media(max-width:639px){.cart{display:none')
  && publicHtml.includes('mbn-icon-wrap');

console.log('=== RESULT:', allPass ? '✅ ALL PASS' : '❌ FAIL', '===');
if (!allPass) process.exit(1);
