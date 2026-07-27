import { buildMenuHTML } from '../src/app/dashboard/[menuId]/menu-html-builder';
import * as fs from 'fs';

const sampleData = {
  name: "Pollería Riko's",
  description: 'El mejor pollo a la brasa del Perú',
  color: '#dc2626',
  slug: 'rikos',
  logo_url: 'https://example.com/logo.png',
  cover_url: '',
  theme_dark_mode: true,
  theme_show_search: true,
  theme_show_gallery: true,
  theme_show_category_icons: true,
  theme_show_social: true,
  theme_currency: 'PEN',
  theme_whatsapp: '51999999999',
  theme_social: { whatsapp: '51999999999', instagram: '', facebook: '' },
  categories: [
    {
      name: 'PLATOS DE FONDO',
      dishes: [
        {
          name: 'Pollo a la Brasa',
          description: 'Pollo entero a la Brasa, delicioso y jugoso. Incluye papas fritas, ensalada y ají de la casa.',
          price: 60,
          image_url: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=900',
          gallery: [
            'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=900',
            'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=900',
            'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=900',
          ],
          options: [
            {
              id: 'salsas',
              name: 'Salsas',
              type: 'single',
              required: false,
              max: 1,
              items: [
                { id: 'aji', name: 'Ají de la casa', price: 0 },
                { id: 'mayo', name: 'Mayonesa', price: 0 },
                { id: 'ketchup', name: 'Ketchup', price: 0 },
              ],
            },
            {
              id: 'extras',
              name: 'Extras',
              type: 'multiple',
              required: false,
              max: 3,
              items: [
                { id: 'papas', name: 'Papas extra', price: 3.00 },
                { id: 'ensalada', name: 'Ensalada extra', price: 2.50 },
                { id: 'huevo', name: 'Huevo frito', price: 1.50 },
              ],
            },
          ],
        },
        { name: '1/4 Pollo', description: 'Cuarto de pollo con papas y ensalada.', price: 22, image_url: '' },
      ],
    },
  ],
};

const html = buildMenuHTML(sampleData as any);
fs.writeFileSync('/home/z/my-project/download/pro-menu-test.html', html);
console.log('Test menu saved. Size:', html.length);

// Validations
const validations = [
  { name: 'Swiper CDN CSS', test: html.includes('swiper-bundle.min.css') },
  { name: 'Swiper CDN JS', test: html.includes('swiper-bundle.min.js') },
  { name: 'buildDishHero function', test: html.includes('function buildDishHero') },
  { name: 'buildDishOptions function', test: html.includes('function buildDishOptions') },
  { name: 'Mobile bottom nav', test: html.includes('mobile-bottom-nav') },
  { name: '4 mbn items (home/search/fav/cart)', test: (html.match(/mbn-item/g) || []).length >= 4 },
  { name: 'syncDishURL function', test: html.includes('function syncDishURL') },
  { name: 'restoreDishFromURL function', test: html.includes('function restoreDishFromURL') },
  { name: 'Hero gradient bg (no black gap)', test: html.includes('linear-gradient(135deg,rgba(var(--accent-rgb)') },
  { name: 'Favorites system', test: html.includes('loadFavorites') },
  { name: 'Dynamic total in addToCart', test: html.includes('extrasTotal') },
];
console.log('\nValidations:');
validations.forEach(v => console.log((v.test ? '✅' : '❌') + ' ' + v.name));
