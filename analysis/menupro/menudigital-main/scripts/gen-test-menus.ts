import { buildMenuHTML } from '../src/app/dashboard/[menuId]/menu-html-builder';
import * as fs from 'fs';

const sampleMenu: any = {
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
          description: 'Ensalada con palta', price: 25,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
          gallery: [], options: [], sort_order: 0 },
      ],
    },
  ],
};

fs.writeFileSync('/home/z/my-project/upload/test-public.html', buildMenuHTML(sampleMenu, { isPreview: false }));
fs.writeFileSync('/home/z/my-project/upload/test-preview.html', buildMenuHTML(sampleMenu, { isPreview: true }));
console.log('Generated: /home/z/my-project/upload/test-public.html (isPreview=false)');
console.log('Generated: /home/z/my-project/upload/test-preview.html (isPreview=true)');
