// Simula la apertura del lightbox en browser real usando el HTML generado
import { buildMenuHTML } from '../src/app/dashboard/[menuId]/menu-html-builder';
import * as fs from 'fs';

const sampleData = {
  name: "Pollería Riko's",
  description: 'El mejor pollo a la brasa del Perú',
  color: '#dc2626',
  slug: 'riko',
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
        { name: 'Pollo a la Brasa', description: 'Pollo entero a la Brasa, delicioso y jugoso. Incluye papas fritas, ensalada y ají de la casa.', price: 60, image_url: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600' },
        { name: '1/4 Pollo', description: 'Cuarto de pollo con papas y ensalada.', price: 22, image_url: '' },
        { name: '1/2 Pollo', description: 'Medio pollo con papas y ensalada.', price: 38, image_url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600' },
      ],
    },
    {
      name: 'BEBIDAS',
      dishes: [
        { name: 'Inca Kola 1.5L', description: 'Botella personal.', price: 8, image_url: '' },
        { name: 'Coca Cola 1.5L', description: 'Botella personal.', price: 8, image_url: '' },
      ],
    },
  ],
};

const html = buildMenuHTML(sampleData as any);
fs.writeFileSync('/home/z/my-project/download/menu-lightbox-test.html', html);
console.log('Test menu saved to /home/z/my-project/download/menu-lightbox-test.html');
console.log('Size:', html.length, 'chars');

// Validate critical patterns
const validations = [
  { name: 'No old buggy onerror pattern', test: !/onerror=\\?"this\.outerHTML=\\?'<div/.test(html) },
  { name: 'Has buildDishHeroHTML helper', test: html.includes('buildDishHeroHTML') },
  { name: 'Has delegated error handler', test: html.includes('document.addEventListener("error"') },
  { name: 'Has data-letter attribute', test: html.includes('data-letter=') },
  { name: 'Uses createElement in lightbox', test: html.includes('document.createElement("img")') },
  { name: 'Inner uses flex-direction:column', test: html.includes('flex-direction:column') },
  { name: 'No "/> " text leak', test: !/innerHTML="[^"]*"\/>\s*";/.test(html) },
];
console.log('\nValidations:');
validations.forEach(v => console.log((v.test ? '✅' : '❌') + ' ' + v.name));
