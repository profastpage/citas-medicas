// Quick smoke test for menu-html-builder.ts — generates a sample HTML file
// to verify the new PedidosYa-style lightbox renders correctly.
import { buildMenuHTML } from '../src/app/dashboard/[menuId]/menu-html-builder';
import * as fs from 'fs';
import * as path from 'path';

const sampleMenu: any = {
  id: 'test-1',
  user_id: 'user-1',
  name: 'La Parrilla del Chef',
  slug: 'la-parrilla-del-chef',
  slogan: 'El verdadero sabor a parrilla',
  description: 'Restaurante familiar con más de 15 años detradición. Especialidad en cortes premium y cocina peruana fusion.',
  whatsapp: '51987654321',
  logo_url: null,
  color: '#d4af37',
  currency: 'S/',
  branding_text: null,
  is_published: true,
  views_count: 0,
  theme_color_secondary: '#1a1a2e',
  theme_font: 'Inter',
  theme_layout: 'single',
  theme_image_size: 'medium',
  theme_card_style: 'expanded',
  theme_cover_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  theme_show_search: true,
  theme_show_category_icons: true,
  theme_rounded_corners: true,
  theme_dark_mode: true,
  theme_dish_gallery: true,
  social_facebook: 'https://facebook.com/laparrilladelchef',
  social_instagram: 'https://instagram.com/laparrilladelchef',
  social_whatsapp: '51987654321',
  social_tiktok: '',
  social_twitter: '',
  social_youtube: '',
  social_web: 'https://laparrilladelchef.com',
  categories: [
    {
      id: 'cat-1',
      name: 'Entradas',
      sort_order: 0,
      dishes: [
        { id: 'd-1', name: 'Ceviche Clásico', description: 'Pescado fresco marinado en limón, cebolla, cilantro y ají limo. Servido con camote y choclo.', price: '28', image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80', sort_order: 0 },
        { id: 'd-2', name: 'Anticuchos de Corazón', description: 'Brochetas de corazón de res marinadas en ají panca. 4 unidades.', price: '22', image_url: null, sort_order: 1 },
      ],
    },
    {
      id: 'cat-2',
      name: 'Parrilla',
      sort_order: 1,
      dishes: [
        { id: 'd-3', name: 'Lomo de Res Premium', description: 'Lomo de res 250g a la parrilla con guarnición de papas rústicas y ensalada.', price: '49', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80', sort_order: 0 },
        { id: 'd-4', name: 'Costillar BBQ', description: 'Costillar de cerdo al horno con salsa BBQ casera. 500g. Para 2 personas.', price: '65', image_url: null, sort_order: 1 },
      ],
    },
  ],
};

const html = buildMenuHTML(sampleMenu);
const outPath = path.join(__dirname, '..', 'download', 'menu-lightbox-test.html');
fs.writeFileSync(outPath, html, 'utf-8');
console.log('✅ HTML generated:', outPath);
console.log('Size:', Math.round(html.length / 1024), 'KB');
console.log('Contains lightbox CSS:', html.includes('dish-lightbox-hero'));
console.log('Contains lightbox JS:', html.includes('openDishLightbox'));
console.log('Contains PedidosYa-style CTA:', html.includes('dish-lightbox-cta'));
console.log('Contains handle bar:', html.includes('dish-lightbox-handle'));
