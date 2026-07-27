/**
 * Verifica que las correcciones del modal ultra-pro estén aplicadas correctamente.
 * Genera HTML con buildMenuHTML y revisa patrones clave.
 */
import { buildMenuHTML } from '../src/app/dashboard/[menuId]/menu-html-builder';
import type { MenuData } from '../src/lib/menu-utils';
import * as fs from 'fs';

const sampleMenu: MenuData = {
  id: 'test-1',
  user_id: 'u1',
  slug: 'test',
  name: 'Pollería Rikos',
  slogan: 'El mejor pollo a la brasa',
  whatsapp: '51999999999',
  color: '#dc2626',
  secondary_color: '#1a1a2e',
  layout: 'single',
  image_size: 'medium',
  card_style: 'expanded',
  font: 'Inter',
  dark_mode: true,
  show_search: true,
  show_category_icons: true,
  rounded_corners: true,
  cover_url: null,
  dish_gallery: true,
  is_published: true,
  branding_text: 'Creado con MenuPro',
  categories: [
    {
      id: 'c1',
      menu_id: 'test-1',
      name: 'Entradas',
      sort_order: 0,
      dishes: [
        {
          id: 'd1',
          category_id: 'c1',
          name: 'Ensalada de Palta',
          description: 'Ensalada con abundante palta, lechuga y tomate',
          price: 25,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
          gallery: [],
          options: [],
          sort_order: 0,
        },
      ],
    },
  ],
} as any;

const html = buildMenuHTML(sampleMenu);

// Verificar patrones clave
const checks = [
  { name: 'Modal stretch (no flex-end in lightbox)', test: !html.includes('.dish-lightbox{position:fixed;inset:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);z-index:300;display:none;align-items:flex-end'), critical: true },
  { name: 'Modal min-height:100dvh', test: html.includes('min-height:100dvh'), critical: true },
  { name: 'Modal border-radius:0 mobile', test: html.includes('border-radius:0;'), critical: false },
  { name: 'Hero max-height:48vh', test: html.includes('max-height:48vh'), critical: true },
  { name: 'single-layout CSS class', test: html.includes('single-layout'), critical: true },
  { name: 'Desktop 2-col grid (920px)', test: html.includes('max-width:920px') && html.includes('repeat(2,1fr)'), critical: true },
  { name: 'Dish options placeholder', test: html.includes('dish-options-empty'), critical: true },
  { name: 'Personaliza tu pedido text', test: html.includes('Personaliza tu pedido'), critical: true },
  { name: 'Dish note textarea', test: html.includes('dish-note-input'), critical: true },
  { name: 'Notas del pedido label', test: html.includes('Notas del pedido'), critical: true },
  { name: 'addToCart accepts note param', test: html.includes('addToCart(catIdx,dishIdx,btn,options,note)'), critical: true },
  { name: 'Cart shows note with emoji', test: html.includes('cart-item-note'), critical: false },
  { name: 'WhatsApp msg includes note', test: html.includes('msg+="   📝 "+item.note'), critical: false },
  { name: 'Old buggy pattern removed (no max-height:42vh)', test: !html.includes('max-height:42vh'), critical: true },
];

console.log('\n=== VERIFICACIÓN DE CORRECCIONES ULTRA-PRO ===\n');
let pass = 0, fail = 0;
checks.forEach(c => {
  const status = c.test ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${c.name}${c.critical ? '' : ' (non-critical)'}`);
  if (c.test) pass++; else fail++;
});

console.log(`\n=== RESULTADO: ${pass}/${checks.length} pasaron, ${fail} fallaron ===\n`);

// Guardar HTML para inspección
fs.writeFileSync('/home/z/my-project/upload/test-menu-output.html', html);
console.log('HTML guardado en /home/z/my-project/upload/test-menu-output.html');
console.log(`Tamaño: ${(html.length / 1024).toFixed(1)} KB`);

if (fail > 0) process.exit(1);
