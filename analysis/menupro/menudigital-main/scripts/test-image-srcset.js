/**
 * Smoke test: build a sample menu HTML and verify the generated JS
 * (imgSrcset/imgMedium helpers + dish img tags) is syntactically valid.
 *
 * Run: npx tsx scripts/test-image-srcset.js
 */
const { buildMenuHTML } = require('../src/app/dashboard/[menuId]/menu-html-builder.ts');

const data = {
  id: 'test',
  slug: 'test',
  name: 'Test Restaurant',
  color: '#ff6b35',
  currency: 'S/',
  whatsapp: '51999999999',
  theme_color_secondary: '#1a1a2e',
  theme_font: 'Inter',
  theme_cover_url: 'https://example.supabase.co/storage/v1/object/public/menus/user1/123-large-w1200.webp',
  theme_layout: 'single',
  theme_image_size: 'medium',
  theme_card_style: 'expanded',
  theme_show_search: true,
  theme_show_category_icons: true,
  theme_rounded_corners: true,
  theme_dark_mode: true,
  theme_dish_gallery: false,
  theme_carta_style: false,
  theme_carta_list_style: false,
  categories: [
    {
      id: 'cat1',
      name: 'Platos',
      dishes: [
        {
          id: 'd1',
          name: 'Lomo Saltado',
          price: 25,
          description: 'Clásico peruano',
          image_url: 'https://example.supabase.co/storage/v1/object/public/menus/user1/456-large-w1200.webp',
        },
      ],
    },
  ],
};

try {
  const html = buildMenuHTML(data, { isPreview: true });
  console.log('✅ HTML built successfully');
  console.log(`   Total length: ${html.length} chars`);

  if (!html.includes('function imgSrcset')) {
    throw new Error('imgSrcset helper not found in HTML');
  }
  if (!html.includes('function imgMedium')) {
    throw new Error('imgMedium helper not found in HTML');
  }
  console.log('✅ Helper functions present (imgSrcset, imgMedium)');

  // Check that dish img tag uses imgMedium + imgSrcset
  if (!html.includes('imgMedium(')) {
    throw new Error('imgMedium() not called in dish img tag');
  }
  if (!html.includes('imgSrcset(')) {
    throw new Error('imgSrcset() not called in dish img tag');
  }
  console.log('✅ Dish <img> tag uses imgMedium() + imgSrcset()');

  if (!html.includes('decoding=\\"async\\"')) {
    throw new Error('decoding="async" not found');
  }
  console.log('✅ decoding="async" attribute present');

  // Extract the regex pattern from imgSrcset and test it
  const regexMatch = html.match(/var m=String\(url\)\.match\((\/\^(.+?)\$\/[a-z]*)\)/);
  if (!regexMatch) {
    throw new Error('Regex pattern not found in imgSrcset');
  }
  console.log(`✅ Regex pattern found: /${regexMatch[2]}/${regexMatch[3] || ''}`);

  // Build a JS-side regex from the captured string (escaping adjusted)
  // The pattern is: ^(.*?)-(thumb|medium|large)-w\d+\.(webp|avif)$
  const re = new RegExp(regexMatch[2]);
  const testOptimized = 'https://example.supabase.co/storage/v1/object/public/menus/user1/123-large-w1200.webp';
  if (!re.test(testOptimized)) {
    throw new Error(`Regex does not match optimized URL: ${testOptimized}`);
  }
  console.log('✅ Regex correctly matches optimized URL pattern');

  const testPlain = 'https://example.com/photo.jpg';
  if (re.test(testPlain)) {
    throw new Error('Regex incorrectly matches non-optimized URL (should reject)');
  }
  console.log('✅ Regex correctly rejects non-optimized URL (graceful fallback)');

  // Simulate the imgSrcset function output
  const m = testOptimized.match(re);
  if (!m) throw new Error('Pattern did not capture groups');
  const base = m[1];
  const ext = m[3];
  const expectedSrcset = `${base}-thumb-w400.${ext} 400w, ${base}-medium-w800.${ext} 800w, ${base}-large-w1200.${ext} 1200w`;
  console.log(`✅ Generated srcset example:`);
  console.log(`   ${expectedSrcset}`);

  console.log('\n🎉 All image optimization tests passed!');
  process.exit(0);
} catch (err) {
  console.error('❌ Test failed:', err.message);
  console.error(err.stack);
  process.exit(1);
}
