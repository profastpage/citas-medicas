import { buildMenuHTML } from '../src/app/dashboard/[menuId]/menu-html-builder';

const sampleData = {
  name: "Pollería Riko's",
  description: 'El mejor pollo a la brasa',
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
  theme_social: { whatsapp: '51999999999', instagram: '' },
  categories: [
    {
      name: 'PLATOS DE FONDO',
      dishes: [
        { name: 'Pollo a la Brasa', description: 'Pollo entero a la Brasa, delicioso y jugoso.', price: 60, image_url: 'https://example.com/pollo.jpg' },
        { name: 'Sin imagen', description: 'Prueba placeholder', price: 25, image_url: '' },
      ],
    },
  ],
};

const html = buildMenuHTML(sampleData as any);

// Check the OLD buggy pattern (onerror="this.outerHTML='...'")
const oldBuggyPattern = /onerror=\\?"this\.outerHTML=\\?'<div/;
const hasOldBug = oldBuggyPattern.test(html);
console.log('❌ Old buggy onerror pattern present:', hasOldBug);

// Check the NEW clean pattern
const newPattern = /function buildDishHeroHTML/;
const hasNew = newPattern.test(html);
console.log('✅ New buildDishHeroHTML function present:', hasNew);

// Check createElement usage
const usesCreateElement = html.includes('document.createElement("img")');
console.log('✅ Uses createElement for img:', usesCreateElement);

// Check no bare "/> "; } pattern that would leak
const leakPattern = /innerHTML="[^"]*"\/>\s*";/;
const hasLeak = leakPattern.test(html);
console.log('❌ Has leaking "/>" pattern:', hasLeak);

// Save sample
import * as fs from 'fs';
fs.writeFileSync('/tmp/menu-test.html', html);
console.log('HTML saved to /tmp/menu-test.html, size:', html.length);
