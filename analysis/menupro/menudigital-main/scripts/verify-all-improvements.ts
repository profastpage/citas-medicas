/**
 * Verificación integral de todos los cambios aplicados.
 * Genera HTML con buildMenuHTML y verifica patrones clave.
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
      ]
    }
  ]
};

const html = buildMenuHTML(sampleMenu);
writeFileSync('/home/z/my-project/download/test-menu.html', html);

console.log('HTML generado:', html.length, 'bytes');
console.log('Guardado en: /home/z/my-project/download/test-menu.html\n');

// Verificar patrones clave
const checks: { name: string; pass: boolean; detail: string }[] = [];

// === TEMA TOGGLE ===
const hasThemeToggleBtn = html.includes('id="themeToggleBtn"');
checks.push({
  name: '✓ Botón toggle de tema presente en HTML',
  pass: hasThemeToggleBtn,
  detail: hasThemeToggleBtn ? 'OK' : 'FALTA'
});

const hasAntiFouc = html.includes('localStorage.getItem("menupro-theme")');
checks.push({
  name: '✓ Anti-FOUC script (aplica tema antes de render)',
  pass: hasAntiFouc,
  detail: hasAntiFouc ? 'OK' : 'FALTA'
});

const hasBothThemesDefined = /:root\[data-theme="dark"\]/.test(html) && /:root\[data-theme="light"\]/.test(html);
checks.push({
  name: '✓ CSS variables para dark y light theme',
  pass: hasBothThemesDefined,
  detail: hasBothThemesDefined ? 'OK' : 'FALTA'
});

const hasThemeToggleJs = /themeToggleBtn\.addEventListener\("click"/.test(html);
checks.push({
  name: '✓ JS handler del toggle de tema',
  pass: hasThemeToggleJs,
  detail: hasThemeToggleJs ? 'OK' : 'FALTA'
});

// === OVERLAP FIXES ===
const hasBodyMobilePadding = /body\{[^}]*padding-bottom:calc\(110px \+ env\(safe-area-inset-bottom, 0px\)\)/.test(html);
checks.push({
  name: '✓ Body padding-bottom mobile (110px) — evita overlap',
  pass: hasBodyMobilePadding,
  detail: hasBodyMobilePadding ? 'OK' : 'FALTA'
});

const hasAppIdSelector = /#app\{padding-bottom:calc\(110px/.test(html);
checks.push({
  name: '✓ #app selector correcto (no .app)',
  pass: hasAppIdSelector,
  detail: hasAppIdSelector ? 'OK' : 'FALTA'
});

const hasNavHideOnModal = /body:has\(\.dish-lightbox\.visible\) \.mobile-bottom-nav/.test(html);
checks.push({
  name: '✓ Nav se oculta cuando modal está abierto',
  pass: hasNavHideOnModal,
  detail: hasNavHideOnModal ? 'OK' : 'FALTA'
});

// === SCROLL TOP ===
const hasScrollTopBtn = html.includes('id="scrollTopBtn"');
checks.push({
  name: '✓ Botón scroll-to-top presente',
  pass: hasScrollTopBtn,
  detail: hasScrollTopBtn ? 'OK' : 'FALTA'
});

// === MOBILE UX ===
const hasMinHeightTapTargets = /min-height:44px/.test(html);
checks.push({
  name: '✓ Tap targets ≥44px (Apple HIG / Material)',
  pass: hasMinHeightTapTargets,
  detail: hasMinHeightTapTargets ? 'OK' : 'FALTA'
});

const hasHoverHoverOnly = /@media\(hover:hover\)/.test(html);
checks.push({
  name: '✓ Hover solo en dispositivos con hover real (no sticky hover mobile)',
  pass: hasHoverHoverOnly,
  detail: hasHoverHoverOnly ? 'OK' : 'FALTA'
});

const hasScrollMarginTop = /scroll-margin-top:70px/.test(html);
checks.push({
  name: '✓ scroll-margin-top en sections (compensa header sticky)',
  pass: hasScrollMarginTop,
  detail: hasScrollMarginTop ? 'OK' : 'FALTA'
});

// === PLACEHOLDER INTERNAL ONLY ===
const hasJsGuard = /if\(typeof IS_PREVIEW!=="undefined"&&IS_PREVIEW\)/.test(html);
checks.push({
  name: '✓ Placeholder "Personaliza tu pedido" solo en preview dashboard',
  pass: hasJsGuard,
  detail: hasJsGuard ? 'OK' : 'FALTA'
});

// === MODAL FULLSCREEN MOBILE ===
const hasMinHeight100dvh = /min-height:100dvh/.test(html);
checks.push({
  name: '✓ Modal full-screen en mobile (min-height:100dvh)',
  pass: hasMinHeight100dvh,
  detail: hasMinHeight100dvh ? 'OK' : 'FALTA'
});

console.log('=== VERIFICACIÓN INTEGRAL ===');
let allPass = true;
for (const c of checks) {
  const icon = c.pass ? '✅' : '❌';
  console.log(`${icon} ${c.name}: ${c.detail}`);
  if (!c.pass) allPass = false;
}
console.log('\n' + (allPass ? '🎉 TODOS LOS CHECKS PASARON' : '⚠️ HAY CHECKS FALLIDOS'));

// Exit code
process.exit(allPass ? 0 : 1);
