// Generate a sample menu HTML and write to public/ for browser testing
import { buildMenuHTML } from '/home/z/my-project/src/app/dashboard/[menuId]/menu-html-builder';
import { writeFileSync } from 'fs';

const sampleMenu = {
  id: 'test-1',
  user_id: 'test-user',
  name: 'Pollería Riko\'s',
  slug: 'polleria-rikos',
  slogan: 'El mejor pollo a la brasa',
  description: 'Auténtica cocina peruana con ingredientes frescos del mercado.',
  whatsapp: '51906431630',
  logo_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80',
  color: '#ff6b35',
  currency: 'S/',
  branding_text: null,
  is_published: true,
  views_count: 0,
  created_at: '',
  updated_at: '',
  theme_color_secondary: '#1a1a2e',
  theme_font: 'Inter',
  theme_layout: 'single',
  theme_image_size: 'medium',
  theme_card_style: 'expanded',
  theme_cover_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80',
  theme_show_search: true,
  theme_show_category_icons: true,
  theme_rounded_corners: true,
  theme_dark_mode: true,
  theme_dish_gallery: true,
  social_facebook: 'https://facebook.com/polleria.rikos',
  social_instagram: '@polleria_rikos',
  social_whatsapp: '',
  social_tiktok: '@polleria_rikos',
  social_twitter: '',
  social_youtube: '',
  social_web: 'https://polleria-rikos.com',
  categories: [
    {
      id: 'cat-1',
      menu_id: 'test-1',
      name: 'Especialidades',
      sort_order: 0,
      dishes: [
        { id: 'd-1', category_id: 'cat-1', name: 'Pollo a la Brasa Entero', description: 'Pollo crocante con papas fritas, ensalada y ají de la casa.', price: 45, image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&q=80', sort_order: 0 },
        { id: 'd-2', category_id: 'cat-1', name: '1/2 Pollo con Guarnición', description: 'Media porción con papas o ensalada.', price: 28, image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80', sort_order: 1 },
        { id: 'd-3', category_id: 'cat-1', name: '1/4 de Pollo', description: 'Cuarto de pollo con guarnición.', price: 18, image_url: '', sort_order: 2 },
      ],
    },
    {
      id: 'cat-2',
      menu_id: 'test-1',
      name: 'Bebidas',
      sort_order: 1,
      dishes: [
        { id: 'd-4', category_id: 'cat-2', name: 'Inca Kola 1.5L', description: 'Refresco nacional peruano.', price: 9, image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80', sort_order: 0 },
        { id: 'd-5', category_id: 'cat-2', name: 'Chicha Morada', description: 'Bebida tradicional de maíz morado.', price: 7, image_url: '', sort_order: 1 },
      ],
    },
  ],
};

const html = buildMenuHTML(sampleMenu as any);
writeFileSync('/home/z/my-project/public/test-menu.html', html);
console.log('Test menu written to /public/test-menu.html');
console.log('Size:', html.length, 'bytes');
