/**
 * Verifica que el bottom nav no pisa el contenido del menú en mobile.
 * Genera HTML con buildMenuHTML, lo guarda en download/test-menu.html,
 * y revisa patrones clave en el CSS/HTML generado.
 */
import { writeFileSync } from 'fs';
import { buildMenuHTML } from '../src/app/dashboard/[menuId]/menu-html-builder';
import type { MenuData } from '../src/lib/menu-utils';

const sampleMenu: MenuData = {
  id: 'test',
  slug: 'test',
  name: 'El Sabor Peruano',
  description: 'La mejor comida peruana',
  color: '#ff6b35',
  whatsapp: '+51999888777',
  currency: 'PEN',
  logo_url: null,
  cover_url: null,
  theme_layout: 'single',
  theme_image_size: 'medium',
  theme_card_style: 'expanded',
  theme_font: 'Inter',
  theme_dark_mode: true,
  theme_show_search: true,
  theme_show_category_icons: true,
  theme_rounded_corners: true,
  theme_color_secondary: '#1a1a2e',
  theme_dish_gallery: true,
  theme_show_social: true,
  social_facebook: 'https://fb.com/test',
  social_instagram: 'https://instagram.com/test',
  social_tiktok: '',
  social_twitter: '',
  social_youtube: '',
  social_website: '',
  social_whatsapp: '+51999888777',
  categories: [
    {
      id: 'cat1',
      name: 'Entradas',
      icon: '🥗',
      dishes: [
        {
          id: 'd1',
          name: 'Ceviche Clásico',
          description: 'Pescado fresco marinado en limón con cebolla y cilantro',
          price: 28,
          image_url: null,
          images: [],
          options: [
            {
              id: 'opt1',
              name: 'Nivel de picante',
              type: 'single',
              required: false,
              max: 1,
              items: [
                { id: 'i1', name: 'Suave', price: 0 },
                { id: 'i2', name: 'Medio', price: 0 },
                { id: 'i3', name: 'Picante', price: 0 }
              ]
            }
          ]
        },
        {
          id: 'd2',
          name: 'Causa Limeña',
          description: 'Papa amarilla con relleno de pollo y palta',
          price: 22,
          image_url: null,
          images: [],
          options: []
        }
      ]
    },
    {
      id: 'cat2',
      name: 'Platos de Fondo',
      icon: '🍽️',
      dishes: [
        {
          id: 'd3',
          name: 'Lomo Saltado',
          description: 'Tiras de res salteadas con cebolla, tomate y papas fritas',
          price: 35,
          image_url: null,
          images: [],
          options: []
        },
        {
          id: 'd4',
          name: 'Ají de Gallina',
          description: 'Crema de pollo con ají amarillo y nueces',
          price: 30,
          image_url: null,
          images: [],
          options: []
        }
      ]
    }
  ]
};

const html = buildMenuHTML(sampleMenu);
writeFileSync('/home/z/my-project/download/test-menu.html', html);

console.log('HTML generado:', html.length, 'bytes');
console.log('Guardado en: /home/z/my-project/download/test-menu.html');

// Verificar patrones clave
const checks: { name: string; pass: boolean; detail: string }[] = [];

const hasBodyMobilePadding = /body\{[^}]*padding-bottom:calc\(110px \+ env\(safe-area-inset-bottom, 0px\)\)/.test(html);
checks.push({
  name: 'Body padding-bottom mobile (110px)',
  pass: hasBodyMobilePadding,
  detail: hasBodyMobilePadding ? 'OK' : 'FALTA'
});

const hasDesktopNoPadding = /@media\(min-width:640px\)\{body\{padding-bottom:0;\}\}/.test(html);
checks.push({
  name: 'Desktop sin padding-bottom (nav oculta)',
  pass: hasDesktopNoPadding,
  detail: hasDesktopNoPadding ? 'OK' : 'FALTA'
});

const hasAppIdSelector = /#app\{padding-bottom:calc\(110px \+ env\(safe-area-inset-bottom, 0px\)\)/.test(html);
checks.push({
  name: '#app selector correcto (no .app)',
  pass: hasAppIdSelector,
  detail: hasAppIdSelector ? 'OK' : 'FALTA'
});

const noOldAppClassBug = !/\.app\{padding-bottom:calc\(80px/.test(html);
checks.push({
  name: 'Bug .app eliminado',
  pass: noOldAppClassBug,
  detail: noOldAppClassBug ? 'OK' : 'Aún presente'
});

const hasNavHidden = /@media\(min-width:640px\)\{\.mobile-bottom-nav\{display:none;\}\}/.test(html);
checks.push({
  name: 'Nav oculta en desktop',
  pass: hasNavHidden,
  detail: hasNavHidden ? 'OK' : 'FALTA'
});

// Verificar que el placeholder de "Personaliza tu pedido" NO aparece cuando IS_PREVIEW=false
const hasPreviewFlagFalse = /var IS_PREVIEW = false;/.test(html);
checks.push({
  name: 'IS_PREVIEW = false (vista cliente)',
  pass: hasPreviewFlagFalse,
  detail: hasPreviewFlagFalse ? 'OK' : 'FALTA'
});

// En HTML estático NO debe haber texto del placeholder renderizado (la string existe en JS source
// pero solo se ejecuta si IS_PREVIEW=true). Verificamos que el JS source incluye el guard correcto.
const hasJsGuard = /if\(typeof IS_PREVIEW!=="undefined"&&IS_PREVIEW\)/.test(html);
checks.push({
  name: 'JS guard con IS_PREVIEW (placeholder solo en preview)',
  pass: hasJsGuard,
  detail: hasJsGuard ? 'OK' : 'FALTA'
});

console.log('\n=== VERIFICACIÓN ===');
let allPass = true;
for (const c of checks) {
  const icon = c.pass ? '✅' : '❌';
  console.log(`${icon} ${c.name}: ${c.detail}`);
  if (!c.pass) allPass = false;
}
console.log('\n' + (allPass ? '🎉 TODOS LOS CHECKS PASARON' : '⚠️ HAY CHECKS FALLIDOS'));
