/* eslint-disable @typescript-eslint/no-require-imports */
// Test script: generate sample menu HTML with PedidosYa/Rappi-style dish cards
// and light mode, then save to download/ for visual inspection.

const path = require('path');
const fs = require('fs');

// We need to transpile the menu-html-builder.ts. Since this is a test script,
// we'll use ts-node-style approach. Actually, let's use a simpler approach:
// build the HTML manually with a minimal MenuData object and the buildMenuHTML
// function via dynamic require after ts transform.

// Simpler: import the compiled version. Since next build doesn't emit, we'll
// inline a minimal test by transpiling with esbuild.

async function main() {
  // tsx transpiles TS on the fly, so we can just require the .ts file directly
  const { buildMenuHTML } = require('../src/app/dashboard/[menuId]/menu-html-builder.ts');

  // Test data: dark mode with image
  const menuDark = {
    id: 'test-1',
    user_id: 'u-1',
    name: 'Restaurante La Sazón',
    slug: 'la-sazon',
    slogan: 'Comida peruana auténtica',
    description: 'El mejor ceviche de la ciudad, preparado con pescado fresco del día.',
    whatsapp: '51987654321',
    logo_url: null,
    color: '#ff6b35',
    currency: 'S/',
    branding_text: 'Creado con MenuPro',
    is_published: true,
    views_count: 0,
    created_at: '',
    updated_at: '',
    theme_color_secondary: '#1a1a2e',
    theme_font: 'Inter',
    theme_layout: 'single',
    theme_image_size: 'medium',
    theme_card_style: 'expanded',
    theme_cover_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    theme_show_search: true,
    theme_show_category_icons: true,
    theme_rounded_corners: true,
    theme_dark_mode: true,
    theme_dish_gallery: true,
    social_facebook: 'https://facebook.com/lasazon',
    social_instagram: 'lasazon',
    social_whatsapp: '51987654321',
    social_tiktok: '',
    social_twitter: '',
    social_youtube: '',
    social_web: 'https://lasazon.pe',
    categories: [
      {
        id: 'c-1',
        menu_id: 'test-1',
        name: 'Entradas',
        sort_order: 0,
        dishes: [
          {
            id: 'd-1',
            category_id: 'c-1',
            name: 'Ceviche Clásico',
            description: 'Pescado fresco marinado en limón, cebolla, cilantro y ají limo. Servido con camote y choclo.',
            price: 28,
            image_url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600',
            sort_order: 0,
          },
          {
            id: 'd-2',
            category_id: 'c-1',
            name: 'Causa Limeña',
            description: 'Papa amarilla al ají amarillo, rellena de pollo o atún, con palta y huevo.',
            price: 22,
            image_url: null,
            sort_order: 1,
          },
        ],
      },
      {
        id: 'c-2',
        menu_id: 'test-1',
        name: 'Platos de Fondo',
        sort_order: 1,
        dishes: [
          {
            id: 'd-3',
            category_id: 'c-2',
            name: 'Lomo Saltado',
            description: 'Lomo de res salteado con cebolla, tomate y papas fritas. Servido con arroz blanco.',
            price: 32,
            image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
            sort_order: 0,
          },
          {
            id: 'd-4',
            category_id: 'c-2',
            name: 'Ají de Gallina',
            description: 'Crema de pollo deshilachado al ají amarillo, con nueces y parmesano. Servido con arroz.',
            price: 26,
            image_url: 'https://images.unsplash.com/photo-1606787366850-de6330128b91?w=600',
            sort_order: 1,
          },
        ],
      },
    ],
  };

  // Light mode variant
  const menuLight = { ...menuDark, theme_dark_mode: false, color: '#2c5f2d' };

  const htmlDark = buildMenuHTML(menuDark);
  const htmlLight = buildMenuHTML(menuLight);

  const outDir = path.join(__dirname, '..', 'download');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'test-pedidosya-dark.html'), htmlDark);
  fs.writeFileSync(path.join(outDir, 'test-pedidosya-light.html'), htmlLight);

  // Verify HTML contains expected elements
  const checks = [
    { name: 'dish-img-wrap (hero image container)', pattern: /class="dish-img-wrap"/ },
    { name: 'dish-img-placeholder (no-image fallback)', pattern: /class="dish-img-placeholder"/ },
    { name: 'dish-cat-badge (category badge on image)', pattern: /class="dish-cat-badge"/ },
    { name: 'dish-info (info area)', pattern: /class="dish-info"/ },
    { name: 'add-btn with SVG + text', pattern: /class="add-btn"[^>]*>.*?Agregar/s },
    { name: 'accent-text CSS variable', pattern: /--accent-text/ },
    { name: 'beige/cream light bg (#fefcf7)', pattern: /#fefcf7/ },
    { name: 'color-mix for accent-text', pattern: /color-mix\(in srgb, var\(--accent\) 78%, #000\)/ },
    { name: 'logo placeholder (no logo_url)', pattern: /class="logo-placeholder"/ },
    { name: 'social icons container', pattern: /class="socials"/ },
    { name: 'lightbox container', pattern: /id="dishLightbox"/ },
  ];

  console.log('\n=== Dark mode HTML checks ===');
  for (const c of checks) {
    const ok = c.pattern.test(htmlDark);
    console.log(`${ok ? '✅' : '❌'} ${c.name}`);
  }

  console.log('\n=== Light mode HTML checks ===');
  for (const c of checks) {
    const ok = c.pattern.test(htmlLight);
    console.log(`${ok ? '✅' : '❌'} ${c.name}`);
  }

  console.log('\nFiles saved:');
  console.log(`  ${path.join(outDir, 'test-pedidosya-dark.html')}`);
  console.log(`  ${path.join(outDir, 'test-pedidosya-light.html')}`);
  console.log(`\nHTML size (dark): ${(htmlDark.length / 1024).toFixed(1)} KB`);
  console.log(`HTML size (light): ${(htmlLight.length / 1024).toFixed(1)} KB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
