// scripts/test-carta-style.ts
// Genera 3 HTMLs de prueba con los 3 modos:
//   1. Modo Carta (carrusel PedidosYa/Rappi con Destacados + categorías horizontales)
//   2. Modo Lista Rappi (texto izq, imagen pequeña der)
//   3. Modo Carta + Auto-scroll habilitado
// Los guarda en /home/z/my-project/download/ para inspección visual con VLM.

import { buildMenuHTML } from '../src/app/dashboard/[menuId]/menu-html-builder';
import type { MenuData } from '../src/lib/menu-utils';
import * as fs from 'fs';
import * as path from 'path';

const sampleMenu: MenuData = {
  id: 'test-menu-id',
  user_id: 'test-user-id',
  name: 'Miku Sushi & Pub',
  slug: 'miku-sushi-pub',
  slogan: 'Cocina japonesa fusión',
  description: 'Sushi premium con técnicas tradicionales japonesas y toques peruanos.',
  whatsapp: '51933667414',
  logo_url: null,
  color: '#e63946',
  currency: 'S/.',
  branding_text: null,
  is_published: true,
  views_count: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  theme_color_secondary: '#1a1a2e',
  theme_font: 'Inter',
  theme_layout: 'single',
  theme_image_size: 'medium',
  theme_card_style: 'expanded',
  theme_cover_url: null,
  theme_show_search: true,
  theme_show_category_icons: true,
  theme_rounded_corners: true,
  theme_dark_mode: true,
  theme_dish_gallery: true,
  categories: [
    {
      id: 'cat-1',
      menu_id: 'test-menu-id',
      name: 'Entradas',
      sort_order: 0,
      dishes: [
        {
          id: 'd1', category_id: 'cat-1', name: 'Ostras al Limón', description: 'Frescas ostras con limón peruano y toque de ají limo.', price: 53, image_url: 'https://images.unsplash.com/photo-1606731224790-358308b5b0c1?w=400', sort_order: 0,
        },
        {
          id: 'd2', category_id: 'cat-1', name: 'Imperial Roll', description: 'Roll de salmón, palta y queso crema con salsa especial.', price: 26, image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', sort_order: 1,
        },
        {
          id: 'd3', category_id: 'cat-1', name: 'Tokio Crunch', description: 'Crocante roll con salmón crujiente y mayonesa de wasabi.', price: 24, image_url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400', sort_order: 2,
        },
        {
          id: 'd4', category_id: 'cat-1', name: 'Alitas BBQ', description: 'Deliciosas alitas bañadas en salsa BBQ con papas fritas.', price: 38, image_url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400', sort_order: 3,
        },
        {
          id: 'd5', category_id: 'cat-1', name: 'Antojitos', description: 'Bocados de salmón kanikama, palta y queso crema.', price: 30, image_url: null, sort_order: 4,
        },
        {
          id: 'd6', category_id: 'cat-1', name: 'Edamame', description: 'Habas de soya al vapor con sal marina.', price: 18, image_url: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400', sort_order: 5,
        },
      ],
    },
    {
      id: 'cat-2',
      menu_id: 'test-menu-id',
      name: 'Platos de Fondo',
      sort_order: 1,
      dishes: [
        {
          id: 'p1', category_id: 'cat-2', name: 'Ramen Tonkotsu', description: 'Caldo cremoso de cerdo cocido por 18 horas con fideos artesanales.', price: 42, image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', sort_order: 0,
        },
        {
          id: 'p2', category_id: 'cat-2', name: 'Salmón Teriyaki', description: 'Filete de salmón a la parrilla con glaseado teriyaki y arroz.', price: 48, image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400', sort_order: 1,
        },
        {
          id: 'p3', category_id: 'cat-2', name: 'Tempura Mixta', description: 'Camarones y vegetales rebozados tempura con salsa tentsuyu.', price: 36, image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', sort_order: 2,
        },
        {
          id: 'p4', category_id: 'cat-2', name: 'Gyozas', description: 'Empanadillas japonesas rellenas de cerdo y vegetales.', price: 28, image_url: null, sort_order: 3,
        },
      ],
    },
    {
      id: 'cat-3',
      menu_id: 'test-menu-id',
      name: 'Bebidas',
      sort_order: 2,
      dishes: [
        {
          id: 'b1', category_id: 'cat-3', name: 'Sake Premium', description: 'Sake japonés premium servido frío.', price: 35, image_url: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=400', sort_order: 0,
        },
        {
          id: 'b2', category_id: 'cat-3', name: 'Matcha Latte', description: 'Té verde matcha con leche cremosa.', price: 15, image_url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400', sort_order: 1,
        },
      ],
    },
  ],
};

// Configuraciones para los 3 tests
const tests = [
  {
    name: 'carta-carousel',
    label: 'Modo Carta Carrusel',
    overrides: { theme_carta_style: true, theme_carta_list_style: false, theme_carta_autoscroll: false },
  },
  {
    name: 'carta-rappi-list',
    label: 'Modo Lista Rappi',
    overrides: { theme_carta_style: false, theme_carta_list_style: true, theme_carta_autoscroll: false },
  },
  {
    name: 'carta-carousel-autoscroll',
    label: 'Modo Carta + Auto-scroll (50px/seg)',
    overrides: { theme_carta_style: true, theme_carta_list_style: false, theme_carta_autoscroll: true, theme_carta_scroll_speed: 50 },
  },
];

const downloadDir = '/home/z/my-project/download';
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

for (const t of tests) {
  const data: MenuData = { ...sampleMenu, ...(t.overrides as any) } as MenuData;
  const html = buildMenuHTML(data);
  const outPath = path.join(downloadDir, `test-carta-${t.name}.html`);
  fs.writeFileSync(outPath, html);
  console.log(`✅ ${t.label} → ${outPath} (${(html.length / 1024).toFixed(1)}KB)`);
}

console.log('\nHecho. Abre los HTMLs en navegador para inspeccionar visualmente.');
