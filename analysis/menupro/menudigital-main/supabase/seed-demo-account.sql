-- ============================================================
-- MENU PRO — CUENTA DEMO CON 5 MENÚS POBLADOS
-- ============================================================
-- Este script es IDEMPOTENTE: puede ejecutarse cuantas veces
-- quieras sin riesgo. Solo crea lo que falta o actualiza lo
-- existente.
--
-- Credenciales demo:
--   Email:    demo@menudigital.pro
--   Password: DemoMenuPro2025!
--
-- Plan: FULL (white-label, todas las funcionalidades)
--
-- 5 menús de distintos rubros:
--   1. Pollería El Dorado Chicken     (single, dark, expanded, large)
--   2. Chifa Dragón de Oro            (double, dark, Playfair, medium)
--   3. Pizzería Bella Napoli          (grid, light, minimal, Playfair)
--   4. Smash Brothers Burger House    (single + carta_style=carrusel Rappi)
--   5. La Mar Cevichería              (single + carta_list_style=lista Rappi)
--
-- Total: ~25 categorías y ~115 platos con imágenes WebP de Unsplash
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PASO 0: Asegurar que el enum user_plan tiene todos los valores
-- ────────────────────────────────────────────────────────────
ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'premium';
ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'full';

-- ────────────────────────────────────────────────────────────
-- PASO 1: Crear usuario en auth.users (con password bcrypt)
-- ────────────────────────────────────────────────────────────
-- Si el usuario ya existe (mismo email), NO lo modificamos.
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, last_sign_in_at,
  confirmation_token, recovery_token,
  email_change_token_new, email_change,
  phone, phone_confirmed_at,
  banned_until, is_sso_user, deleted_at
) VALUES (
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'demo@menudigital.pro',
  '$2b$10$lysY5HxcMpxDMJ7ilu5/Q.4KuiAlOFESk5p0KaKU2K.of2bSm0lS.',
  NOW(),
  '{}'::jsonb,
  '{"full_name":"Cuenta Demo MenuPro"}'::jsonb,
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  '',
  NULL,
  NULL,
  FALSE,
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Si el email ya existe pero con otro ID, intentamos por email
-- (esto puede fallar si hay otro usuario con ese email —
-- en ese caso elimina primero el usuario existente desde el
-- panel de Supabase → Authentication → Users).

-- Asegurar identidad en auth.identities
-- Esquema REAL de auth.identities en Supabase moderno (8 columnas insertables):
--   id, user_id, identity_data, provider, provider_id,
--   last_sign_in_at, created_at, updated_at
-- Notas:
--   - provider_id (NOT NULL): para 'email' provider, value = user_id
--   - email: es GENERATED column (calculada desde auth.users.email), NO se inserta
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
) VALUES (
  '16b06793-5254-5994-b41c-5e96beca9813'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  '{"sub":"2f2a30d8-bea6-5a5c-9787-040fe0ba1f15","email":"demo@menudigital.pro"}'::jsonb,
  'email',
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15',  -- provider_id = user_id para email provider
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- ────────────────────────────────────────────────────────────
-- PASO 2: Crear profile con plan='full'
-- ────────────────────────────────────────────────────────────
INSERT INTO profiles (
  id, email, full_name, plan, is_super_admin, is_active,
  created_at, updated_at
) VALUES (
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'demo@menudigital.pro',
  'Cuenta Demo MenuPro',
  'full',
  FALSE,
  TRUE,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  plan = 'full',
  is_active = TRUE,
  updated_at = NOW();


-- ════════════════════════════════════════════════════════════
-- MENÚ 1: Pollería El Dorado Chicken
-- ════════════════════════════════════════════════════════════

INSERT INTO menus (
  id, user_id, name, slug, slogan, description, whatsapp,
  color, currency, logo_url, branding_text, is_published,
  theme_color_secondary, theme_font, theme_layout,
  theme_image_size, theme_card_style, theme_cover_url,
  theme_show_search, theme_show_category_icons,
  theme_rounded_corners, theme_dark_mode, theme_dish_gallery,
  theme_carta_style, theme_carta_list_style,
  theme_carta_autoscroll, theme_carta_scroll_speed,
  social_facebook, social_instagram, social_whatsapp,
  social_tiktok, social_twitter, social_youtube, social_web,
  created_at, updated_at
) VALUES (
  'b50ff998-709a-5bac-bddd-ee498c999440'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'Pollería El Dorado Chicken',
  'polleria-el-dorado',
  'El verdadero pollo a la brasa peruano',
  'Más de 25 años llevando el mejor pollo a la brasa a tu mesa. Brasa, broaster y guarniciones hechas en casa todos los días.',
  '+51987654321',
  '#d62828',
  'S/',
  'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400&h=400&fit=crop&crop=entropy&q=80&fm=webp',
  NULL,
  TRUE,
  '#1a1a2e',
  'Inter',
  'single',
  'large',
  'expanded',
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=1600&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  FALSE,
  FALSE,
  FALSE,
  30,
  'https://facebook.com/elpolleriaeldorado',
  'https://instagram.com/eldorado_chicken',
  '+51987654321',
  'https://tiktok.com/@eldoradochicken',
  NULL,
  NULL,
  NULL,
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  slogan = EXCLUDED.slogan,
  description = EXCLUDED.description,
  whatsapp = EXCLUDED.whatsapp,
  color = EXCLUDED.color,
  currency = EXCLUDED.currency,
  logo_url = EXCLUDED.logo_url,
  branding_text = EXCLUDED.branding_text,
  is_published = TRUE,
  theme_color_secondary = EXCLUDED.theme_color_secondary,
  theme_font = EXCLUDED.theme_font,
  theme_layout = EXCLUDED.theme_layout,
  theme_image_size = EXCLUDED.theme_image_size,
  theme_card_style = EXCLUDED.theme_card_style,
  theme_cover_url = EXCLUDED.theme_cover_url,
  theme_show_search = EXCLUDED.theme_show_search,
  theme_show_category_icons = EXCLUDED.theme_show_category_icons,
  theme_rounded_corners = EXCLUDED.theme_rounded_corners,
  theme_dark_mode = EXCLUDED.theme_dark_mode,
  theme_dish_gallery = EXCLUDED.theme_dish_gallery,
  theme_carta_style = EXCLUDED.theme_carta_style,
  theme_carta_list_style = EXCLUDED.theme_carta_list_style,
  theme_carta_autoscroll = EXCLUDED.theme_carta_autoscroll,
  theme_carta_scroll_speed = EXCLUDED.theme_carta_scroll_speed,
  social_facebook = EXCLUDED.social_facebook,
  social_instagram = EXCLUDED.social_instagram,
  social_whatsapp = EXCLUDED.social_whatsapp,
  social_tiktok = EXCLUDED.social_tiktok,
  social_twitter = EXCLUDED.social_twitter,
  social_youtube = EXCLUDED.social_youtube,
  social_web = EXCLUDED.social_web,
  updated_at = NOW();

-- Categoría 1: Pollos a la Brasa
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'eeb194d6-cff9-56d5-9cd4-2d37ca79ad2d'::uuid,
  'b50ff998-709a-5bac-bddd-ee498c999440'::uuid,
  'Pollos a la Brasa',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'fcee7f67-03ac-56c0-9bd7-ea85c17cfc5f'::uuid,
  'eeb194d6-cff9-56d5-9cd4-2d37ca79ad2d'::uuid,
  'Pollo a la Brasa Entero',
  '1 pollo entero (8 presas) ahumado al carbón, servido con papas fritas, ensalada y ají de la casa.',
  58.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'b94390fb-5369-53dc-b2e4-337f8d875b01'::uuid,
  'eeb194d6-cff9-56d5-9cd4-2d37ca79ad2d'::uuid,
  'Medio Pollo a la Brasa',
  '4 presas de pollo a la brasa con papas fritas y ensalada clásica.',
  34.0,
  'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'c767dec6-554b-5cb1-8ab1-3b54a3b575cd'::uuid,
  'eeb194d6-cff9-56d5-9cd4-2d37ca79ad2d'::uuid,
  'Cuarto de Pollo',
  '2 presas de pollo a la brasa con papas fritas y ensalada.',
  19.0,
  'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '24b3bcc2-99f1-538c-85b0-d63f48698aa8'::uuid,
  'eeb194d6-cff9-56d5-9cd4-2d37ca79ad2d'::uuid,
  'Cuarto de Pollo + Porción Extra',
  'Cuarto de pollo con doble porción de papas fritas y ensalada familiar.',
  24.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'ad9c569a-c0e9-5118-af9f-755910b2e7af'::uuid,
  'eeb194d6-cff9-56d5-9cd4-2d37ca79ad2d'::uuid,
  'Pollo a la Brasa Picante',
  'Pollo a la brasa bañado en salsa picante de la casa. Para los amantes del ají.',
  36.0,
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 2: Pollo Broaster
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '8cfd1818-03a2-55b7-addc-75f8c121b727'::uuid,
  'b50ff998-709a-5bac-bddd-ee498c999440'::uuid,
  'Pollo Broaster',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'b4ef2f6f-52fc-50b4-be40-dae0885c52bf'::uuid,
  '8cfd1818-03a2-55b7-addc-75f8c121b727'::uuid,
  'Pollo Broaster Entero',
  '8 presas de pollo broaster crujiente con papas fritas y ají.',
  56.0,
  'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '41c0eaff-d0ca-5aad-ad6a-98a378b5dbf7'::uuid,
  '8cfd1818-03a2-55b7-addc-75f8c121b727'::uuid,
  'Medio Pollo Broaster',
  '4 presas broaster con papas fritas y ensalada.',
  32.0,
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '03457e1f-a889-5a67-a36c-d0bdee5e2f7f'::uuid,
  '8cfd1818-03a2-55b7-addc-75f8c121b727'::uuid,
  'Cuarto Broaster',
  '2 presas broaster con papas fritas.',
  18.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '2e045d02-8a87-59a5-8bae-515f6e304b47'::uuid,
  '8cfd1818-03a2-55b7-addc-75f8c121b727'::uuid,
  'Alitas Broaster (12 u)',
  '12 alitas broaster crujientes con salsa a elección.',
  28.0,
  'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '31720398-e837-5779-a556-bd81867055fb'::uuid,
  '8cfd1818-03a2-55b7-addc-75f8c121b727'::uuid,
  'Nuggets de Pollo (10 u)',
  '10 nuggets crujientes con salsa a elección.',
  18.0,
  'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 3: Guarniciones
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '16016e00-962d-52db-aa30-1b1d9c336fab'::uuid,
  'b50ff998-709a-5bac-bddd-ee498c999440'::uuid,
  'Guarniciones',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '042df0aa-25e8-59ec-aa80-e57a9982285b'::uuid,
  '16016e00-962d-52db-aa30-1b1d9c336fab'::uuid,
  'Papas Fritas Familiares',
  'Porción grande de papas fritas crujientes para 4 personas.',
  14.0,
  'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'd81cf32e-4eed-54b8-9c9d-80f893e1c2ff'::uuid,
  '16016e00-962d-52db-aa30-1b1d9c336fab'::uuid,
  'Ensalada Familiar',
  'Lechuga, tomate, cebolla, zanahoria y palta. Aderezo de la casa.',
  12.0,
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'f46324fd-2cf3-5b46-aa87-12db4d875706'::uuid,
  '16016e00-962d-52db-aa30-1b1d9c336fab'::uuid,
  'Arroz Blanco',
  'Porción de arroz blanco graneado para acompañar.',
  6.0,
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '777c3ffc-4c60-5970-8c69-b7b199daca27'::uuid,
  '16016e00-962d-52db-aa30-1b1d9c336fab'::uuid,
  'Arroz Chaufa de Pollo',
  'Salteado al wok con huevo, sillao y cebollita china.',
  18.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '579b97a9-91cd-5859-8c5b-e8ba1d99196d'::uuid,
  '16016e00-962d-52db-aa30-1b1d9c336fab'::uuid,
  'Frijoles Patrones',
  'Porción de frijoles canarios guisados al estilo peruano.',
  8.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 4: Combos Familiares
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'e61ae6aa-05e3-5839-9848-8652fe13ab39'::uuid,
  'b50ff998-709a-5bac-bddd-ee498c999440'::uuid,
  'Combos Familiares',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '45b266d7-9aca-50d6-ba1c-bfb39106e728'::uuid,
  'e61ae6aa-05e3-5839-9848-8652fe13ab39'::uuid,
  'Combo Familiar 4 Personas',
  '1 pollo entero a la brasa + papas + ensalada + 4 gaseosas 500ml.',
  75.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'ae7ad072-36c4-5d15-a748-e5b450d8ef94'::uuid,
  'e61ae6aa-05e3-5839-9848-8652fe13ab39'::uuid,
  'Combo Pareja',
  '1/2 pollo + papas + ensalada + 2 gaseosas 500ml.',
  45.0,
  'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'c9607e7c-d32a-5127-abe1-0b294d483663'::uuid,
  'e61ae6aa-05e3-5839-9848-8652fe13ab39'::uuid,
  'Combo Súper Familiar',
  '1 pollo entero + 1/4 pollo extra + papas grandes + ensalada + 4 gaseosas.',
  89.0,
  'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'b0264845-26ce-541e-8153-e81f76260e25'::uuid,
  'e61ae6aa-05e3-5839-9848-8652fe13ab39'::uuid,
  'Combo Individual',
  '1/4 pollo + papas + ensalada + gaseosa 500ml.',
  22.0,
  'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 5: Bebidas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '9006b6a7-2e2f-5ba3-91d9-8bd94838e065'::uuid,
  'b50ff998-709a-5bac-bddd-ee498c999440'::uuid,
  'Bebidas',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '4f2d3152-a4a6-5045-a95c-43e87d383a72'::uuid,
  '9006b6a7-2e2f-5ba3-91d9-8bd94838e065'::uuid,
  'Inca Kola 500ml',
  'Gaseosa Inca Kola personal 500ml bien helada.',
  5.0,
  'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'aafcadce-36ca-5f09-896b-3eb56034c0b8'::uuid,
  '9006b6a7-2e2f-5ba3-91d9-8bd94838e065'::uuid,
  'Coca Cola 500ml',
  'Gaseosa Coca Cola personal 500ml.',
  5.0,
  'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'f88bbbcc-fc0d-52c0-a87a-26a96fd99334'::uuid,
  '9006b6a7-2e2f-5ba3-91d9-8bd94838e065'::uuid,
  'Chicha Morada 1L',
  'Chicha morada casera preparada con maíz morado, piña y canela.',
  12.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '41d6432e-afd9-55fe-bec7-2de5bb9914e4'::uuid,
  '9006b6a7-2e2f-5ba3-91d9-8bd94838e065'::uuid,
  'Maracuyá 1L',
  'Jugo de maracuyá natural preparado al momento.',
  14.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'd77e72f8-79f1-53eb-8796-ad996e8770e1'::uuid,
  '9006b6a7-2e2f-5ba3-91d9-8bd94838e065'::uuid,
  'Limonada Fría 1L',
  'Limonada con hierbabuena fría.',
  10.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;


-- ════════════════════════════════════════════════════════════
-- MENÚ 2: Chifa Dragón de Oro
-- ════════════════════════════════════════════════════════════

INSERT INTO menus (
  id, user_id, name, slug, slogan, description, whatsapp,
  color, currency, logo_url, branding_text, is_published,
  theme_color_secondary, theme_font, theme_layout,
  theme_image_size, theme_card_style, theme_cover_url,
  theme_show_search, theme_show_category_icons,
  theme_rounded_corners, theme_dark_mode, theme_dish_gallery,
  theme_carta_style, theme_carta_list_style,
  theme_carta_autoscroll, theme_carta_scroll_speed,
  social_facebook, social_instagram, social_whatsapp,
  social_tiktok, social_twitter, social_youtube, social_web,
  created_at, updated_at
) VALUES (
  '60acb89d-9e7b-50dc-b369-b295d15bd940'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'Chifa Dragón de Oro',
  'chifa-dragon-de-oro',
  'Tradición china peruana desde 1985',
  'Auténtica comida china-peruana preparada por chefs cantoneses. Wok al fuego, ingredientes frescos y el verdadero sabor del chifa peruano.',
  '+51987654322',
  '#c1121f',
  'S/',
  'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=400&fit=crop&crop=entropy&q=80&fm=webp',
  NULL,
  TRUE,
  '#1a1a2e',
  'Playfair Display',
  'double',
  'medium',
  'expanded',
  'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=1600&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  FALSE,
  FALSE,
  FALSE,
  30,
  'https://facebook.com/chifadragondeoro',
  'https://instagram.com/dragondeoro',
  '+51987654322',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  slogan = EXCLUDED.slogan,
  description = EXCLUDED.description,
  whatsapp = EXCLUDED.whatsapp,
  color = EXCLUDED.color,
  currency = EXCLUDED.currency,
  logo_url = EXCLUDED.logo_url,
  branding_text = EXCLUDED.branding_text,
  is_published = TRUE,
  theme_color_secondary = EXCLUDED.theme_color_secondary,
  theme_font = EXCLUDED.theme_font,
  theme_layout = EXCLUDED.theme_layout,
  theme_image_size = EXCLUDED.theme_image_size,
  theme_card_style = EXCLUDED.theme_card_style,
  theme_cover_url = EXCLUDED.theme_cover_url,
  theme_show_search = EXCLUDED.theme_show_search,
  theme_show_category_icons = EXCLUDED.theme_show_category_icons,
  theme_rounded_corners = EXCLUDED.theme_rounded_corners,
  theme_dark_mode = EXCLUDED.theme_dark_mode,
  theme_dish_gallery = EXCLUDED.theme_dish_gallery,
  theme_carta_style = EXCLUDED.theme_carta_style,
  theme_carta_list_style = EXCLUDED.theme_carta_list_style,
  theme_carta_autoscroll = EXCLUDED.theme_carta_autoscroll,
  theme_carta_scroll_speed = EXCLUDED.theme_carta_scroll_speed,
  social_facebook = EXCLUDED.social_facebook,
  social_instagram = EXCLUDED.social_instagram,
  social_whatsapp = EXCLUDED.social_whatsapp,
  social_tiktok = EXCLUDED.social_tiktok,
  social_twitter = EXCLUDED.social_twitter,
  social_youtube = EXCLUDED.social_youtube,
  social_web = EXCLUDED.social_web,
  updated_at = NOW();

-- Categoría 1: Entradas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '9cc9a692-6aea-5fe4-be46-11de8d2ed48e'::uuid,
  '60acb89d-9e7b-50dc-b369-b295d15bd940'::uuid,
  'Entradas',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'd2b9218d-b770-5791-8148-f74d83b2734d'::uuid,
  '9cc9a692-6aea-5fe4-be46-11de8d2ed48e'::uuid,
  'Wantán Frito (12 u)',
  '12 wantanes crujientes rellenos de carne de cerdo, con salsa tamarindo.',
  18.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '2c82eb77-8491-5fe0-9ffe-2bfc148d0ca9'::uuid,
  '9cc9a692-6aea-5fe4-be46-11de8d2ed48e'::uuid,
  'Sopa Wantán',
  'Sopa con wantanes de cerdo, pollo, huevos y cebollita china.',
  16.0,
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'a3f5df4d-85d8-59de-ac6e-e0986985e874'::uuid,
  '9cc9a692-6aea-5fe4-be46-11de8d2ed48e'::uuid,
  'Tallarín Saltado Kallu',
  'Tallarín chino saltado al wok con pollo, sillao y vegetales.',
  22.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '984fda6a-7390-5787-82c7-2db3d4c866c2'::uuid,
  '9cc9a692-6aea-5fe4-be46-11de8d2ed48e'::uuid,
  'Chijaukay de Pollo',
  'Pollo rebozado frito con salsa dulce-tamarindo y semillas de sésamo.',
  26.0,
  'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '083c1d2f-47c6-5117-a057-c0bb64407b55'::uuid,
  '9cc9a692-6aea-5fe4-be46-11de8d2ed48e'::uuid,
  'Ensalada de Wantán',
  'Wantanes fritos sobre lechuga con aderezo de mostaza y sillao.',
  20.0,
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 2: Sopas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '2cceec65-c8db-59cb-8233-1f7d55ea96c0'::uuid,
  '60acb89d-9e7b-50dc-b369-b295d15bd940'::uuid,
  'Sopas',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '2be2a42f-2c5a-5f55-b76a-18003889091c'::uuid,
  '2cceec65-c8db-59cb-8233-1f7d55ea96c0'::uuid,
  'Sopa Wantán Especial',
  'Caldo de pollo con wantanes, pollo, huevos y cebollita china.',
  18.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '517fd0b5-b0e2-5577-80f8-79602e437fda'::uuid,
  '2cceec65-c8db-59cb-8233-1f7d55ea96c0'::uuid,
  'Sopa Fuchifú',
  'Sopa de arroz inflado con pollo, huevos y cebollita china.',
  16.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '88f96a1d-da46-5db7-bbe1-026a74bff4c3'::uuid,
  '2cceec65-c8db-59cb-8233-1f7d55ea96c0'::uuid,
  'SuedPa',
  'Sopa con fideos chinos, mariscos, pollo y huevos.',
  28.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'e82e874f-6cb7-5a52-88dd-7d5c11a44598'::uuid,
  '2cceec65-c8db-59cb-8233-1f7d55ea96c0'::uuid,
  'Sopa de Mariscos',
  'Caldo con camarones, calamar, pescado y huevos.',
  32.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 3: Arroz Chaufa
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'a446425d-1f8d-549b-a097-8ffa004afa4d'::uuid,
  '60acb89d-9e7b-50dc-b369-b295d15bd940'::uuid,
  'Arroz Chaufa',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'b5bd3ca4-3059-519a-a4be-3b8f9758db31'::uuid,
  'a446425d-1f8d-549b-a097-8ffa004afa4d'::uuid,
  'Arroz Chaufa de Pollo',
  'Arroz frito al wok con pollo, huevos, sillao y cebollita china.',
  22.0,
  'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'b7d3cb45-79eb-5d6e-9624-e1bbc01337a1'::uuid,
  'a446425d-1f8d-549b-a097-8ffa004afa4d'::uuid,
  'Arroz Chaufa de Camarón',
  'Arroz frito con camarones, huevos y vegetales.',
  32.0,
  'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '6939bf38-aa95-5ef2-abfe-7971e0f3abf2'::uuid,
  'a446425d-1f8d-549b-a097-8ffa004afa4d'::uuid,
  'Arroz Chaufa Especial',
  'Arroz frito con pollo, camarón, jamón y huevos.',
  36.0,
  'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'fdccfc8d-1d44-59ec-8f5b-c00753b08045'::uuid,
  'a446425d-1f8d-549b-a097-8ffa004afa4d'::uuid,
  'Arroz Chaufa con Tallarín',
  'Mitad arroz chaufa, mitad tallarín saltado. Para indecisos.',
  28.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'a868ba4f-be38-58c2-b715-5fd1d6e99bf5'::uuid,
  'a446425d-1f8d-549b-a097-8ffa004afa4d'::uuid,
  'Arroz Tipakay',
  'Arroz frito con pollo rebozado, jamón y huevos.',
  30.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 4: Tallarines
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '2b08c609-464f-5666-adc5-81658a2c63e8'::uuid,
  '60acb89d-9e7b-50dc-b369-b295d15bd940'::uuid,
  'Tallarines',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '3baa5b51-d4f0-535e-8d9f-9d760e37e798'::uuid,
  '2b08c609-464f-5666-adc5-81658a2c63e8'::uuid,
  'Tallarín Saltado de Pollo',
  'Fideos chinos saltados al wok con pollo, sillao y cebollita china.',
  24.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '3b7ec2fd-94fd-5d76-9f25-1177a169b88a'::uuid,
  '2b08c609-464f-5666-adc5-81658a2c63e8'::uuid,
  'Tallarín Saltado de Camarón',
  'Fideos chinos saltados con camarones y vegetales.',
  34.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'f1f99b1b-c722-5354-b176-67f03e0da0e0'::uuid,
  '2b08c609-464f-5666-adc5-81658a2c63e8'::uuid,
  'Tallarín Saltado Especial',
  'Fideos con pollo, camarón, jamón y huevos.',
  38.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'abad4ce4-770f-51fd-97de-5f74ac8ba0c8'::uuid,
  '2b08c609-464f-5666-adc5-81658a2c63e8'::uuid,
  'Tallarín con Tamarindo',
  'Fideos chinos con salsa tamarindo y pollo rebozado.',
  28.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 5: Especiales
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '78012a29-ce4b-5df9-a9fc-5a1b17f63f47'::uuid,
  '60acb89d-9e7b-50dc-b369-b295d15bd940'::uuid,
  'Especiales',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '4687697e-c54b-518c-b06d-0da59a2e0d1c'::uuid,
  '78012a29-ce4b-5df9-a9fc-5a1b17f63f47'::uuid,
  'Pollo Chi Jau Kay',
  'Pollo rebozado crujiente con salsa tamarindo dulce.',
  28.0,
  'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '37fd9f09-dad0-56d1-bf49-8b6c2ff78352'::uuid,
  '78012a29-ce4b-5df9-a9fc-5a1b17f63f47'::uuid,
  'Camarón Chi Jau Kay',
  'Camarones rebozados con salsa tamarindo.',
  42.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '5d1c34d8-45ee-5899-91d8-b673b8630437'::uuid,
  '78012a29-ce4b-5df9-a9fc-5a1b17f63f47'::uuid,
  'Pollo Kallu',
  'Pollo deshilachado saltado con tallarín, ajo y sillao.',
  26.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'ebae3aa3-7bc0-5ec7-963b-be410743be99'::uuid,
  '78012a29-ce4b-5df9-a9fc-5a1b17f63f47'::uuid,
  'Japu',
  'Arroz chaufa cubierto con pollo saltado al wok.',
  32.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'df003cc3-4813-543e-9449-4973d93b9015'::uuid,
  '78012a29-ce4b-5df9-a9fc-5a1b17f63f47'::uuid,
  'Pollo Sueco',
  'Pollo frito con salsa agridulce de tomate.',
  26.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 6: Bebidas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '2d49ca51-4fd9-5ed2-9309-07f7a672b8ca'::uuid,
  '60acb89d-9e7b-50dc-b369-b295d15bd940'::uuid,
  'Bebidas',
  5,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '4345f2d1-5d01-5519-a61d-98581663f661'::uuid,
  '2d49ca51-4fd9-5ed2-9309-07f7a672b8ca'::uuid,
  'Té Chino',
  'Té de jazmín caliente para acompañar la comida.',
  4.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '79ec87a2-443b-5942-9242-4b2865f36101'::uuid,
  '2d49ca51-4fd9-5ed2-9309-07f7a672b8ca'::uuid,
  'Chicha Morada 1L',
  'Chicha morada casera preparada con maíz morado.',
  12.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '7b528995-9b7b-55ab-83be-c308511ab25e'::uuid,
  '2d49ca51-4fd9-5ed2-9309-07f7a672b8ca'::uuid,
  'Inca Kola 1.5L',
  'Gaseosa Inca Kola 1.5 litros para compartir.',
  12.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '261bc27a-af85-5a17-a183-73a0af454273'::uuid,
  '2d49ca51-4fd9-5ed2-9309-07f7a672b8ca'::uuid,
  'Coca Cola 1.5L',
  'Gaseosa Coca Cola 1.5 litros.',
  12.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '1077c1a4-46e4-5684-9482-ca6683657543'::uuid,
  '2d49ca51-4fd9-5ed2-9309-07f7a672b8ca'::uuid,
  'Limón Frío 1L',
  'Limonada con hierbabuena bien fría.',
  10.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;


-- ════════════════════════════════════════════════════════════
-- MENÚ 3: Pizzería Bella Napoli
-- ════════════════════════════════════════════════════════════

INSERT INTO menus (
  id, user_id, name, slug, slogan, description, whatsapp,
  color, currency, logo_url, branding_text, is_published,
  theme_color_secondary, theme_font, theme_layout,
  theme_image_size, theme_card_style, theme_cover_url,
  theme_show_search, theme_show_category_icons,
  theme_rounded_corners, theme_dark_mode, theme_dish_gallery,
  theme_carta_style, theme_carta_list_style,
  theme_carta_autoscroll, theme_carta_scroll_speed,
  social_facebook, social_instagram, social_whatsapp,
  social_tiktok, social_twitter, social_youtube, social_web,
  created_at, updated_at
) VALUES (
  '3c2c4753-162f-5a0d-bc08-bc3ca95647c6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'Pizzería Bella Napoli',
  'pizzeria-bella-napoli',
  'Auténtica pizza napolitana al horno de piedra',
  'Pizza artesanal hecha con masa madre y horno de piedra. Ingredientes importados de Italia y mozzarella fior di latte.',
  '+51987654323',
  '#bc4749',
  'S/',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&crop=entropy&q=80&fm=webp',
  NULL,
  TRUE,
  '#f2e8cf',
  'Playfair Display',
  'grid',
  'medium',
  'minimal',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  TRUE,
  TRUE,
  TRUE,
  FALSE,
  TRUE,
  FALSE,
  FALSE,
  FALSE,
  30,
  'https://facebook.com/bellanapolipizzeria',
  'https://instagram.com/bellanapoli_pe',
  '+51987654323',
  'https://tiktok.com/@bellanapoli',
  NULL,
  NULL,
  NULL,
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  slogan = EXCLUDED.slogan,
  description = EXCLUDED.description,
  whatsapp = EXCLUDED.whatsapp,
  color = EXCLUDED.color,
  currency = EXCLUDED.currency,
  logo_url = EXCLUDED.logo_url,
  branding_text = EXCLUDED.branding_text,
  is_published = TRUE,
  theme_color_secondary = EXCLUDED.theme_color_secondary,
  theme_font = EXCLUDED.theme_font,
  theme_layout = EXCLUDED.theme_layout,
  theme_image_size = EXCLUDED.theme_image_size,
  theme_card_style = EXCLUDED.theme_card_style,
  theme_cover_url = EXCLUDED.theme_cover_url,
  theme_show_search = EXCLUDED.theme_show_search,
  theme_show_category_icons = EXCLUDED.theme_show_category_icons,
  theme_rounded_corners = EXCLUDED.theme_rounded_corners,
  theme_dark_mode = EXCLUDED.theme_dark_mode,
  theme_dish_gallery = EXCLUDED.theme_dish_gallery,
  theme_carta_style = EXCLUDED.theme_carta_style,
  theme_carta_list_style = EXCLUDED.theme_carta_list_style,
  theme_carta_autoscroll = EXCLUDED.theme_carta_autoscroll,
  theme_carta_scroll_speed = EXCLUDED.theme_carta_scroll_speed,
  social_facebook = EXCLUDED.social_facebook,
  social_instagram = EXCLUDED.social_instagram,
  social_whatsapp = EXCLUDED.social_whatsapp,
  social_tiktok = EXCLUDED.social_tiktok,
  social_twitter = EXCLUDED.social_twitter,
  social_youtube = EXCLUDED.social_youtube,
  social_web = EXCLUDED.social_web,
  updated_at = NOW();

-- Categoría 1: Pizzas Clásicas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'b1f6a2ba-c834-5c43-ba8e-3cc3642be232'::uuid,
  '3c2c4753-162f-5a0d-bc08-bc3ca95647c6'::uuid,
  'Pizzas Clásicas',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'f3800a1d-0894-5227-828f-273be2fa28de'::uuid,
  'b1f6a2ba-c834-5c43-ba8e-3cc3642be232'::uuid,
  'Pizza Margherita',
  'Salsa de tomate San Marzano, mozzarella fior di latte, albahaca fresca y aceite de oliva.',
  38.0,
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'e1491c44-c11d-5a0f-9c12-8eb35fbb4460'::uuid,
  'b1f6a2ba-c834-5c43-ba8e-3cc3642be232'::uuid,
  'Pizza Napolitana',
  'Salsa de tomate, mozzarella, anchoas, alcaparras y orégano.',
  42.0,
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '13946579-b356-54c0-ad47-574ae89e08c1'::uuid,
  'b1f6a2ba-c834-5c43-ba8e-3cc3642be232'::uuid,
  'Pizza Pepperoni',
  'Salsa de tomate, mozzarella y pepperoni picante.',
  44.0,
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '78ab4d04-b2d4-5efe-9106-46bcdc358b0b'::uuid,
  'b1f6a2ba-c834-5c43-ba8e-3cc3642be232'::uuid,
  'Pizza Quattro Formaggi',
  'Mozzarella, gorgonzola, parmesano y fontina.',
  48.0,
  'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'f7222493-377a-51c7-933b-941ad612ae0f'::uuid,
  'b1f6a2ba-c834-5c43-ba8e-3cc3642be232'::uuid,
  'Pizza Quattro Stagioni',
  'Tomate, mozzarella, jamón, champiñones, alcachofas y aceitunas.',
  46.0,
  'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'a1f98907-add8-56e6-b990-49fb4f050529'::uuid,
  'b1f6a2ba-c834-5c43-ba8e-3cc3642be232'::uuid,
  'Pizza Prosciutto e Funghi',
  'Tomate, mozzarella, jamón italiano y champiñones frescos.',
  44.0,
  'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  5,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 2: Pizzas Especiales
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '7c397df2-a131-5d17-89a1-c0ea9398046b'::uuid,
  '3c2c4753-162f-5a0d-bc08-bc3ca95647c6'::uuid,
  'Pizzas Especiales',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '2181373f-c65e-567c-b91f-6f31dcdc0dab'::uuid,
  '7c397df2-a131-5d17-89a1-c0ea9398046b'::uuid,
  'Pizza Diavola',
  'Salsa de tomate, mozzarella, salame picante y ají molido.',
  46.0,
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'b2010e4a-cbca-5987-9916-b5b0d3054b47'::uuid,
  '7c397df2-a131-5d17-89a1-c0ea9398046b'::uuid,
  'Pizza Capricciosa',
  'Tomate, mozzarella, jamón, champiñones, alcachofas y aceitunas.',
  48.0,
  'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '14f43bf4-600e-5fd1-b895-a3cf547e9282'::uuid,
  '7c397df2-a131-5d17-89a1-c0ea9398046b'::uuid,
  'Pizza Tartufo',
  'Mozzarella, crema de trufa negra y champiñones porcini.',
  58.0,
  'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'b1a5080c-2e62-5b78-9a9d-095c2f7b84be'::uuid,
  '7c397df2-a131-5d17-89a1-c0ea9398046b'::uuid,
  'Pizza Burrata',
  'Pizza margherita cubierta con burrata fresca y tomates cherry.',
  56.0,
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '34ec6a6d-8b26-5411-9f7a-50f932fcdcb3'::uuid,
  '7c397df2-a131-5d17-89a1-c0ea9398046b'::uuid,
  'Pizza Parma',
  'Tomate, mozzarella, jamón de Parma, rúcula y parmesano.',
  54.0,
  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '9f51c4bb-c2ed-5fea-9a0b-e49cfeea39f9'::uuid,
  '7c397df2-a131-5d17-89a1-c0ea9398046b'::uuid,
  'Pizza Frutti di Mare',
  'Salsa de tomate, mozzarella, camarones, calamar y mejillones.',
  62.0,
  'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  5,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 3: Pastas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'abb834df-2068-5555-b347-2fa67803c6ab'::uuid,
  '3c2c4753-162f-5a0d-bc08-bc3ca95647c6'::uuid,
  'Pastas',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '90519df2-3756-5527-a7d4-406f8a7bac9e'::uuid,
  'abb834df-2068-5555-b347-2fa67803c6ab'::uuid,
  'Spaghetti Bolognesa',
  'Espaguetis con salsa de carne de res y tomate al estilo italiano.',
  32.0,
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '23169906-ca2c-5a25-9000-bd73bc09965d'::uuid,
  'abb834df-2068-5555-b347-2fa67803c6ab'::uuid,
  'Spaghetti Carbonara',
  'Espaguetis con panceta, huevo, pecorino y pimienta negra.',
  36.0,
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '23a52fa5-df85-55ad-9662-28f26b89a3da'::uuid,
  'abb834df-2068-5555-b347-2fa67803c6ab'::uuid,
  'Fettuccine Alfredo',
  'Fettuccine con salsa cremosa de parmesano y mantequilla.',
  34.0,
  'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '01d969d5-aa0f-5326-a534-a88e09918992'::uuid,
  'abb834df-2068-5555-b347-2fa67803c6ab'::uuid,
  'Lasagna Bolognesa',
  'Capas de pasta con ragú de carne, bechamel y parmesano.',
  38.0,
  'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '9e51644e-5272-5cfc-9f6f-2f2cb46c5f3c'::uuid,
  'abb834df-2068-5555-b347-2fa67803c6ab'::uuid,
  'Ravioli di Ricotta',
  'Raviolis rellenos de ricotta y espinaca con salsa de tomate.',
  40.0,
  'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 4: Entradas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'f14c645d-173b-5ee6-b631-3676cc224c0a'::uuid,
  '3c2c4753-162f-5a0d-bc08-bc3ca95647c6'::uuid,
  'Entradas',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '4b0c67de-84fe-593f-9b3e-a8ac35496d54'::uuid,
  'f14c645d-173b-5ee6-b631-3676cc224c0a'::uuid,
  'Bruschetta Classica',
  'Pan tostado con tomate fresco, ajo, albahaca y aceite de oliva.',
  18.0,
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'e4b9fbb5-e753-5101-a094-1164a8649cce'::uuid,
  'f14c645d-173b-5ee6-b631-3676cc224c0a'::uuid,
  'Caprese',
  'Tomate, mozzarella fresca, albahaca y aceite de oliva.',
  24.0,
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '9964fa40-7edd-5704-a2e1-08c4103d37da'::uuid,
  'f14c645d-173b-5ee6-b631-3676cc224c0a'::uuid,
  'Antipasto Italiano',
  'Tabla de jamón, salame, quesos, aceitunas y vegetales asados.',
  38.0,
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '4ac2c2a4-f073-52b6-9e88-761f1170932d'::uuid,
  'f14c645d-173b-5ee6-b631-3676cc224c0a'::uuid,
  'Garlic Bread',
  'Pan al ajo con mantequilla y perejil, gratinado con parmesano.',
  14.0,
  'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'dde6e56c-a2fd-5711-8f95-9dd9f8ff6851'::uuid,
  'f14c645d-173b-5ee6-b631-3676cc224c0a'::uuid,
  'Calamari Fritti',
  'Anillos de calamar rebozados con salsa marinara.',
  28.0,
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 5: Postres
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '20827836-c7cc-5cf2-8c6c-9d434827b289'::uuid,
  '3c2c4753-162f-5a0d-bc08-bc3ca95647c6'::uuid,
  'Postres',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '2a004e77-0ed2-5b9b-84e2-8e9c752591e5'::uuid,
  '20827836-c7cc-5cf2-8c6c-9d434827b289'::uuid,
  'Tiramisú',
  'Bizcocho bañado en café, crema de mascarpone y cacao.',
  18.0,
  'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '804960b9-c5af-56c4-ac2f-acce514dcae1'::uuid,
  '20827836-c7cc-5cf2-8c6c-9d434827b289'::uuid,
  'Panna Cotta',
  'Crema cocida con vainilla y coulis de frutos rojos.',
  16.0,
  'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '67a3ea30-f65b-51fb-ad1a-ffb4413e13b7'::uuid,
  '20827836-c7cc-5cf2-8c6c-9d434827b289'::uuid,
  'Cannoli Siciliani',
  'Crepes rellenos de crema de ricotta y pistachos.',
  17.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'd02bb61d-a1fa-5fbd-9113-0bb98f7c28f5'::uuid,
  '20827836-c7cc-5cf2-8c6c-9d434827b289'::uuid,
  'Gelato (2 bolas)',
  'Helado artesanal italiano, sabores a elección.',
  14.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 6: Bebidas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '2dd0060c-5a6d-52f3-a63d-a2fac949c1a2'::uuid,
  '3c2c4753-162f-5a0d-bc08-bc3ca95647c6'::uuid,
  'Bebidas',
  5,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '9dcab678-0eb5-54aa-957a-dce3ff51fd5c'::uuid,
  '2dd0060c-5a6d-52f3-a63d-a2fac949c1a2'::uuid,
  'Vino Tinto Copa',
  'Copa de vino tinto Sangiovese.',
  14.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '6a78a204-86ec-5ead-a42b-04f9ef927080'::uuid,
  '2dd0060c-5a6d-52f3-a63d-a2fac949c1a2'::uuid,
  'Limonata Italiana',
  'Limonada con gas al estilo italiano.',
  8.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '80bbf706-5e9e-5681-90b6-361cde70185f'::uuid,
  '2dd0060c-5a6d-52f3-a63d-a2fac949c1a2'::uuid,
  'Espresso',
  'Café espresso italiano.',
  6.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '6fadc187-3acd-5030-bf1e-3c69d9caf21a'::uuid,
  '2dd0060c-5a6d-52f3-a63d-a2fac949c1a2'::uuid,
  'Coca Cola 500ml',
  'Gaseosa personal.',
  5.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;


-- ════════════════════════════════════════════════════════════
-- MENÚ 4: Smash Brothers Burger House
-- ════════════════════════════════════════════════════════════

INSERT INTO menus (
  id, user_id, name, slug, slogan, description, whatsapp,
  color, currency, logo_url, branding_text, is_published,
  theme_color_secondary, theme_font, theme_layout,
  theme_image_size, theme_card_style, theme_cover_url,
  theme_show_search, theme_show_category_icons,
  theme_rounded_corners, theme_dark_mode, theme_dish_gallery,
  theme_carta_style, theme_carta_list_style,
  theme_carta_autoscroll, theme_carta_scroll_speed,
  social_facebook, social_instagram, social_whatsapp,
  social_tiktok, social_twitter, social_youtube, social_web,
  created_at, updated_at
) VALUES (
  'ea3753d1-ada6-5559-9d48-61061f2e09b6'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'Smash Brothers Burger House',
  'smash-brothers-burgers',
  'Smash burgers hechos con amor y mucho queso',
  'Hamburguesas estilo smash con carne 100% res peruana, pan brioche hecho en casa y salsas artesanales. El verdadero sabor americano en Lima.',
  '+51987654324',
  '#e63946',
  'S/',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop&crop=entropy&q=80&fm=webp',
  NULL,
  TRUE,
  '#1d3557',
  'Inter',
  'single',
  'medium',
  'compact',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1600&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  FALSE,
  TRUE,
  30,
  'https://facebook.com/smashbrothersburgers',
  'https://instagram.com/smashbrothers_pe',
  '+51987654324',
  'https://tiktok.com/@smashbrothers',
  NULL,
  NULL,
  NULL,
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  slogan = EXCLUDED.slogan,
  description = EXCLUDED.description,
  whatsapp = EXCLUDED.whatsapp,
  color = EXCLUDED.color,
  currency = EXCLUDED.currency,
  logo_url = EXCLUDED.logo_url,
  branding_text = EXCLUDED.branding_text,
  is_published = TRUE,
  theme_color_secondary = EXCLUDED.theme_color_secondary,
  theme_font = EXCLUDED.theme_font,
  theme_layout = EXCLUDED.theme_layout,
  theme_image_size = EXCLUDED.theme_image_size,
  theme_card_style = EXCLUDED.theme_card_style,
  theme_cover_url = EXCLUDED.theme_cover_url,
  theme_show_search = EXCLUDED.theme_show_search,
  theme_show_category_icons = EXCLUDED.theme_show_category_icons,
  theme_rounded_corners = EXCLUDED.theme_rounded_corners,
  theme_dark_mode = EXCLUDED.theme_dark_mode,
  theme_dish_gallery = EXCLUDED.theme_dish_gallery,
  theme_carta_style = EXCLUDED.theme_carta_style,
  theme_carta_list_style = EXCLUDED.theme_carta_list_style,
  theme_carta_autoscroll = EXCLUDED.theme_carta_autoscroll,
  theme_carta_scroll_speed = EXCLUDED.theme_carta_scroll_speed,
  social_facebook = EXCLUDED.social_facebook,
  social_instagram = EXCLUDED.social_instagram,
  social_whatsapp = EXCLUDED.social_whatsapp,
  social_tiktok = EXCLUDED.social_tiktok,
  social_twitter = EXCLUDED.social_twitter,
  social_youtube = EXCLUDED.social_youtube,
  social_web = EXCLUDED.social_web,
  updated_at = NOW();

-- Categoría 1: Smash Burgers
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'cdc8ef47-fda5-5dbe-8e9d-7ecf4a957a92'::uuid,
  'ea3753d1-ada6-5559-9d48-61061f2e09b6'::uuid,
  'Smash Burgers',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'e55ad162-2422-5d1d-a18b-b19c20833e52'::uuid,
  'cdc8ef47-fda5-5dbe-8e9d-7ecf4a957a92'::uuid,
  'Single Smash',
  '1 smash burger de 90g, cheddar, pepinillos, cebolla y salsa smash.',
  18.0,
  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '4ac949cc-d56b-52e8-bdc1-3d103598e133'::uuid,
  'cdc8ef47-fda5-5dbe-8e9d-7ecf4a957a92'::uuid,
  'Double Smash',
  '2 smash burgers de 90g, cheddar doble, pepinillos y salsa smash.',
  26.0,
  'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '4b359602-efcd-5073-9709-d84635217c41'::uuid,
  'cdc8ef47-fda5-5dbe-8e9d-7ecf4a957a92'::uuid,
  'Triple Smash',
  '3 smash burgers de 90g, cheddar triple, todo completo.',
  34.0,
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'a8c9401a-c078-5810-925e-dafc8f240045'::uuid,
  'cdc8ef47-fda5-5dbe-8e9d-7ecf4a957a92'::uuid,
  'Bacon Smash',
  'Double smash burger con tocino crujiente y salsa BBQ.',
  30.0,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '737865cf-8086-5a05-b7b2-b0177dca5de9'::uuid,
  'cdc8ef47-fda5-5dbe-8e9d-7ecf4a957a92'::uuid,
  'Cheese Lover',
  'Double smash con cheddar, americano y mozzarella fundida.',
  32.0,
  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'ae53446e-3f2c-5103-88af-d4cfddc199d3'::uuid,
  'cdc8ef47-fda5-5dbe-8e9d-7ecf4a957a92'::uuid,
  'Mushroom Swiss',
  'Double smash con champiñones salteados y queso suizo.',
  30.0,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  5,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 2: Clásicas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'cf8bd9be-ff84-5ffd-916b-c68372821787'::uuid,
  'ea3753d1-ada6-5559-9d48-61061f2e09b6'::uuid,
  'Clásicas',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '77a02838-813c-5f98-ba49-164e496696c6'::uuid,
  'cf8bd9be-ff84-5ffd-916b-c68372821787'::uuid,
  'Classic Cheeseburger',
  'Carne 150g, cheddar, lechuga, tomate, cebolla y salsa thousand.',
  22.0,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '9424eb1f-abb3-5a15-88a5-8cdf80f26ed7'::uuid,
  'cf8bd9be-ff84-5ffd-916b-c68372821787'::uuid,
  'Bacon Cheeseburger',
  'Carne 150g, cheddar, tocino, cebolla caramelizada.',
  26.0,
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '40038e03-c482-5269-91f4-05dac41994d4'::uuid,
  'cf8bd9be-ff84-5ffd-916b-c68372821787'::uuid,
  'BBQ Burger',
  'Carne 150g, cheddar, tocino, aros de cebolla y salsa BBQ.',
  28.0,
  'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'a98fbd93-9bc1-5808-b486-d7cc1d2b155e'::uuid,
  'cf8bd9be-ff84-5ffd-916b-c68372821787'::uuid,
  'Big Brothers',
  'Doble carne 150g, doble cheddar, tocino y huevo frito.',
  34.0,
  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 3: Especiales
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'd65d6282-f003-5d5a-a72b-05dbc0e46341'::uuid,
  'ea3753d1-ada6-5559-9d48-61061f2e09b6'::uuid,
  'Especiales',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '36cbc278-5f7b-52de-85e3-4eef46d82315'::uuid,
  'd65d6282-f003-5d5a-a72b-05dbc0e46341'::uuid,
  'Truffle Burger',
  'Carne 150g, queso suizo, champiñones y mayo de trufa.',
  32.0,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '58dd9176-38bd-5320-ad33-e86992d48e08'::uuid,
  'd65d6282-f003-5d5a-a72b-05dbc0e46341'::uuid,
  'Spicy Mexican',
  'Carne 150g, jalapeños, guacamole, cheddar y salsa picante.',
  28.0,
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'ca885099-25be-5b73-a8d0-fad5d488ac15'::uuid,
  'd65d6282-f003-5d5a-a72b-05dbc0e46341'::uuid,
  'Hawaiiana',
  'Carne 150g, jamón, piña, cheddar y salsa BBQ.',
  26.0,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '515f5c4f-2fb2-5471-b06c-6f193ceb9757'::uuid,
  'd65d6282-f003-5d5a-a72b-05dbc0e46341'::uuid,
  'Crispy Chicken',
  'Pollo crujiente, cheddar, lechuga, pepinillos y mayo chipotle.',
  24.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '6609290d-23b4-506d-888a-ece81543c4bd'::uuid,
  'd65d6282-f003-5d5a-a72b-05dbc0e46341'::uuid,
  'Veggie Brothers',
  'Burger de lentejas y quinoa, lechuga, tomate y aguacate.',
  22.0,
  'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 4: Hot Dogs
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '88fc2c5e-9027-583f-bfc3-87a732b8285b'::uuid,
  'ea3753d1-ada6-5559-9d48-61061f2e09b6'::uuid,
  'Hot Dogs',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '04054588-6efd-565a-8b13-955f491b0a75'::uuid,
  '88fc2c5e-9027-583f-bfc3-87a732b8285b'::uuid,
  'Classic Dog',
  'Salchicha de res, cebolla, pepinillos, ketchup y mostaza.',
  14.0,
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '86eab5aa-2d26-5d0e-aea8-1b51b46b3e39'::uuid,
  '88fc2c5e-9027-583f-bfc3-87a732b8285b'::uuid,
  'Bacon Dog',
  'Salchicha envuelta en tocino, cebolla caramelizada y BBQ.',
  18.0,
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'e1279504-87b4-5d73-9991-22645aa13fa4'::uuid,
  '88fc2c5e-9027-583f-bfc3-87a732b8285b'::uuid,
  'Chili Cheese Dog',
  'Salchicha con chili con carne, cheddar fundido y cebolla.',
  20.0,
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 5: Acompañamientos
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '45341c57-128d-5ef5-a36e-3590bf467097'::uuid,
  'ea3753d1-ada6-5559-9d48-61061f2e09b6'::uuid,
  'Acompañamientos',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'acd7ed88-fff4-5d7f-89fe-1bf23e21ff9f'::uuid,
  '45341c57-128d-5ef5-a36e-3590bf467097'::uuid,
  'Papas Fritas',
  'Corte natural con piel, sal y hierbas.',
  9.0,
  'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '2cbde782-1d12-5b47-ab4e-bf5f9cdf1b06'::uuid,
  '45341c57-128d-5ef5-a36e-3590bf467097'::uuid,
  'Papas Gajo',
  'Papas gajo crujientes con salsa especial.',
  12.0,
  'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'b47cc48f-9875-59ae-bfa6-c07d58d02b3e'::uuid,
  '45341c57-128d-5ef5-a36e-3590bf467097'::uuid,
  'Papas con Cheddar y Tocino',
  'Papas cubiertas con cheddar fundido y tocino crujiente.',
  18.0,
  'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'dbf2439b-13bd-59fb-a0e0-21281e9ed66e'::uuid,
  '45341c57-128d-5ef5-a36e-3590bf467097'::uuid,
  'Aros de Cebolla',
  '8 aros de cebolla empanizados crujientes.',
  12.0,
  'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '3d727c5f-e70d-5163-be53-e14a661a3044'::uuid,
  '45341c57-128d-5ef5-a36e-3590bf467097'::uuid,
  'Nuggets de Pollo (8 u)',
  '8 nuggets de pollo crujientes con salsa a elección.',
  14.0,
  'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 6: Combos
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '4e76dbaf-16b8-565a-9ded-e9dee44cdbdb'::uuid,
  'ea3753d1-ada6-5559-9d48-61061f2e09b6'::uuid,
  'Combos',
  5,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'd00d1c10-46e5-5965-84a7-487f72253447'::uuid,
  '4e76dbaf-16b8-565a-9ded-e9dee44cdbdb'::uuid,
  'Combo Smash Brothers',
  'Double Smash + papas + gaseosa 500ml.',
  36.0,
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '71962311-ef55-5037-af24-ffee9fc03b92'::uuid,
  '4e76dbaf-16b8-565a-9ded-e9dee44cdbdb'::uuid,
  'Combo Clásico',
  'Classic Cheeseburger + papas + gaseosa 500ml.',
  30.0,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'febb0108-1fa0-5728-a278-9a182621c1d3'::uuid,
  '4e76dbaf-16b8-565a-9ded-e9dee44cdbdb'::uuid,
  'Combo Familiar 4 personas',
  '4 burgers clásicas + 2 papas grandes + 4 gaseosas.',
  110.0,
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'f155b300-4a34-57e6-9a8d-38453e502696'::uuid,
  '4e76dbaf-16b8-565a-9ded-e9dee44cdbdb'::uuid,
  'Combo Pareja',
  '2 burgers + 1 papas grande + 2 gaseosas.',
  56.0,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 7: Bebidas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'd8f785ba-1f65-57c9-a44a-75473878b950'::uuid,
  'ea3753d1-ada6-5559-9d48-61061f2e09b6'::uuid,
  'Bebidas',
  6,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'fad3859f-cc7d-5abc-9cdf-144a2ff88820'::uuid,
  'd8f785ba-1f65-57c9-a44a-75473878b950'::uuid,
  'Coca Cola 500ml',
  'Gaseosa personal bien fría.',
  5.0,
  'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '257f342a-1491-5367-a6f5-b9c2496b426f'::uuid,
  'd8f785ba-1f65-57c9-a44a-75473878b950'::uuid,
  'Inca Kola 500ml',
  'Gaseosa Inca Kola personal.',
  5.0,
  'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '5e9d59f0-2310-5d6a-8389-c82952dcaf7d'::uuid,
  'd8f785ba-1f65-57c9-a44a-75473878b950'::uuid,
  'Limonada Fría 500ml',
  'Limonada con hierbabuena bien helada.',
  7.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'e81894ef-2e26-5e6d-abc7-d4808bc6718c'::uuid,
  'd8f785ba-1f65-57c9-a44a-75473878b950'::uuid,
  'Milkshake Clásico',
  'Malteada de vainilla, chocolate o fresa (400ml).',
  14.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'f64bcc8e-2d5a-5ee0-9111-c476037de22c'::uuid,
  'd8f785ba-1f65-57c9-a44a-75473878b950'::uuid,
  'Cerveza Artesanal',
  'Cerveza artesanal nacional 330ml.',
  12.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;


-- ════════════════════════════════════════════════════════════
-- MENÚ 5: La Mar Cevichería
-- ════════════════════════════════════════════════════════════

INSERT INTO menus (
  id, user_id, name, slug, slogan, description, whatsapp,
  color, currency, logo_url, branding_text, is_published,
  theme_color_secondary, theme_font, theme_layout,
  theme_image_size, theme_card_style, theme_cover_url,
  theme_show_search, theme_show_category_icons,
  theme_rounded_corners, theme_dark_mode, theme_dish_gallery,
  theme_carta_style, theme_carta_list_style,
  theme_carta_autoscroll, theme_carta_scroll_speed,
  social_facebook, social_instagram, social_whatsapp,
  social_tiktok, social_twitter, social_youtube, social_web,
  created_at, updated_at
) VALUES (
  '010dd000-4151-5607-b07f-8759dffdce15'::uuid,
  '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid,
  'La Mar Cevichería',
  'cevicheria-la-mar',
  'La frescura del mar peruano en cada plato',
  'Cevichería peruana con pescado fresco del día. Especialidades en ceviches, tiraditos, leche de tigre y mariscos. Tradición costeña desde 1998.',
  '+51987654325',
  '#0077b6',
  'S/',
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=400&fit=crop&crop=entropy&q=80&fm=webp',
  NULL,
  TRUE,
  '#caf0f8',
  'Inter',
  'single',
  'medium',
  'minimal',
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1600&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  TRUE,
  TRUE,
  TRUE,
  FALSE,
  TRUE,
  FALSE,
  TRUE,
  FALSE,
  30,
  'https://facebook.com/lamarcevicheria',
  'https://instagram.com/lamarcevicheria',
  '+51987654325',
  NULL,
  NULL,
  NULL,
  NULL,
  NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  slogan = EXCLUDED.slogan,
  description = EXCLUDED.description,
  whatsapp = EXCLUDED.whatsapp,
  color = EXCLUDED.color,
  currency = EXCLUDED.currency,
  logo_url = EXCLUDED.logo_url,
  branding_text = EXCLUDED.branding_text,
  is_published = TRUE,
  theme_color_secondary = EXCLUDED.theme_color_secondary,
  theme_font = EXCLUDED.theme_font,
  theme_layout = EXCLUDED.theme_layout,
  theme_image_size = EXCLUDED.theme_image_size,
  theme_card_style = EXCLUDED.theme_card_style,
  theme_cover_url = EXCLUDED.theme_cover_url,
  theme_show_search = EXCLUDED.theme_show_search,
  theme_show_category_icons = EXCLUDED.theme_show_category_icons,
  theme_rounded_corners = EXCLUDED.theme_rounded_corners,
  theme_dark_mode = EXCLUDED.theme_dark_mode,
  theme_dish_gallery = EXCLUDED.theme_dish_gallery,
  theme_carta_style = EXCLUDED.theme_carta_style,
  theme_carta_list_style = EXCLUDED.theme_carta_list_style,
  theme_carta_autoscroll = EXCLUDED.theme_carta_autoscroll,
  theme_carta_scroll_speed = EXCLUDED.theme_carta_scroll_speed,
  social_facebook = EXCLUDED.social_facebook,
  social_instagram = EXCLUDED.social_instagram,
  social_whatsapp = EXCLUDED.social_whatsapp,
  social_tiktok = EXCLUDED.social_tiktok,
  social_twitter = EXCLUDED.social_twitter,
  social_youtube = EXCLUDED.social_youtube,
  social_web = EXCLUDED.social_web,
  updated_at = NOW();

-- Categoría 1: Ceviches
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '88a10ef3-684a-5a8c-bc3c-7ed15b95011b'::uuid,
  '010dd000-4151-5607-b07f-8759dffdce15'::uuid,
  'Ceviches',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '0898c09e-318a-5a6b-9322-1b4a58cb55d4'::uuid,
  '88a10ef3-684a-5a8c-bc3c-7ed15b95011b'::uuid,
  'Ceviche Clásico',
  'Pescado fresco en leche de tigre, cebolla morada, camote, choclo y ají limo.',
  28.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '90cec0df-9112-56bd-9621-f4c1b4a9c310'::uuid,
  '88a10ef3-684a-5a8c-bc3c-7ed15b95011b'::uuid,
  'Ceviche Mixto',
  'Pescado, camarones, calamar y conchas de abanico en leche de tigre.',
  38.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '3415182a-2891-5b66-91f0-b52d2ad98bae'::uuid,
  '88a10ef3-684a-5a8c-bc3c-7ed15b95011b'::uuid,
  'Ceviche de Camarón',
  'Camarones frescos en leche de tigre con ají limo y cebolla.',
  36.0,
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '68233760-9a3d-5ee4-8a07-5764a9e73957'::uuid,
  '88a10ef3-684a-5a8c-bc3c-7ed15b95011b'::uuid,
  'Ceviche de Conchas Negras',
  'Conchas negras frescas en leche de tigre clásica.',
  48.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'a412935c-74dd-510a-b066-4357eee577bd'::uuid,
  '88a10ef3-684a-5a8c-bc3c-7ed15b95011b'::uuid,
  'Ceviche de Pota',
  'Pota (calamar gigante) en leche de tigre con cebolla y camote.',
  26.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'e977e85f-3baa-54a2-a982-6f1991e3ef01'::uuid,
  '88a10ef3-684a-5a8c-bc3c-7ed15b95011b'::uuid,
  'Ceviche Norteño',
  'Pescado en leche de tigre al estilo norteño con ají mocho.',
  30.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  5,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 2: Tiraditos
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'd6021798-73a9-5aa8-90cd-74930b69033a'::uuid,
  '010dd000-4151-5607-b07f-8759dffdce15'::uuid,
  'Tiraditos',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'e487406c-738b-5ad9-9817-fab5d0cd1b2c'::uuid,
  'd6021798-73a9-5aa8-90cd-74930b69033a'::uuid,
  'Tiradito Clásico',
  'Filetes de pescado cortados fino en leche de tigre, ají limo y sésamo.',
  32.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '6f0dddbb-34df-5473-9228-df1ab77b38f2'::uuid,
  'd6021798-73a9-5aa8-90cd-74930b69033a'::uuid,
  'Tiradito Apanado',
  'Tiradito de pescado rebozado frito con salsa criolla.',
  30.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '7e8068b6-c1ad-57a0-ba5c-f83d886e50ee'::uuid,
  'd6021798-73a9-5aa8-90cd-74930b69033a'::uuid,
  'Tiradito de Atún',
  'Atún fresco en salsa acevichada con ají amarillo.',
  36.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '34f71c98-99f0-57a6-ab02-e22477740725'::uuid,
  'd6021798-73a9-5aa8-90cd-74930b69033a'::uuid,
  'Tiradito Tricolor',
  'Tres tiraditos: ají amarillo, ají limo y acevichado.',
  38.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 3: Leches de Tigre
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'de0e653b-c099-50e6-908a-aabe7cc14abb'::uuid,
  '010dd000-4151-5607-b07f-8759dffdce15'::uuid,
  'Leches de Tigre',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '5b7e2408-bede-571c-a79e-3507089c4fff'::uuid,
  'de0e653b-c099-50e6-908a-aabe7cc14abb'::uuid,
  'Leche de Tigre Clásica',
  'Caldo de ceviche con trozos de pescado, cebolla y ají limo.',
  22.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '33d2beca-955b-545d-9620-2b1cacf3e939'::uuid,
  'de0e653b-c099-50e6-908a-aabe7cc14abb'::uuid,
  'Leche de Pantera',
  'Leche de tigre con mariscos negros, más intensa.',
  28.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '517341d1-6725-5773-a153-c238ef1a8ab2'::uuid,
  'de0e653b-c099-50e6-908a-aabe7cc14abb'::uuid,
  'Leche de Tigre Mixta',
  'Con pescado, camarón, calamar y conchas.',
  30.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '4bc0d8cf-bd47-53a1-b3f8-4d42f9796298'::uuid,
  'de0e653b-c099-50e6-908a-aabe7cc14abb'::uuid,
  'Leche de Tigre con Camarón',
  'Leche de tigre con camarones frescos.',
  26.0,
  'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 4: Pescados
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '383eda6f-9640-53df-946d-0e66261e5f2e'::uuid,
  '010dd000-4151-5607-b07f-8759dffdce15'::uuid,
  'Pescados',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '3ffbeed0-5e65-5d73-ab5b-5a44cbfcac9e'::uuid,
  '383eda6f-9640-53df-946d-0e66261e5f2e'::uuid,
  'Chicharrón de Pescado',
  'Pescado frito crujiente con yuca y salsa criolla.',
  30.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '87591498-ad43-570b-a0c5-09dc20714096'::uuid,
  '383eda6f-9640-53df-946d-0e66261e5f2e'::uuid,
  'Pescado Frito',
  'Filete de pescado frito con yuca, cebolla y limón.',
  28.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'bcd31dec-547b-5e73-8368-6298f67cc98b'::uuid,
  '383eda6f-9640-53df-946d-0e66261e5f2e'::uuid,
  'Pescado a lo Macho',
  'Filete de pescado en salsa de mariscos con ají.',
  36.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '002cecf2-3456-58d9-97dd-4b55003d74f1'::uuid,
  '383eda6f-9640-53df-946d-0e66261e5f2e'::uuid,
  'Sudado de Pescado',
  'Pescado cocido al vapor con cebolla, tomate y cilantro.',
  30.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '46c63155-629f-5534-84fb-cc350b6d2ea4'::uuid,
  '383eda6f-9640-53df-946d-0e66261e5f2e'::uuid,
  'Filete a la Plancha',
  'Filete de pescado a la plancha con guarnición a elección.',
  32.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 5: Mariscos
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '5fb90e48-64f2-5ddf-82a0-9a94f7f02020'::uuid,
  '010dd000-4151-5607-b07f-8759dffdce15'::uuid,
  'Mariscos',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'aab0fcbd-2638-5260-af3c-35330f5ad374'::uuid,
  '5fb90e48-64f2-5ddf-82a0-9a94f7f02020'::uuid,
  'Chicharrón de Mariscos',
  'Mezcla de mariscos rebozados fritos con yuca y salsa criolla.',
  38.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '8bf7636f-7001-526c-88d9-b01246da4d36'::uuid,
  '5fb90e48-64f2-5ddf-82a0-9a94f7f02020'::uuid,
  'Arroz con Mariscos',
  'Arroz graneado con mariscos salteados al wok.',
  36.0,
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'b1de8a21-d249-57ac-8b76-c5b3a29cffc4'::uuid,
  '5fb90e48-64f2-5ddf-82a0-9a94f7f02020'::uuid,
  'Parihuela de Mariscos',
  'Sopa de mariscos con pescado, camarón, calamar y conchas.',
  42.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'f707307c-b95f-5036-b16f-c222451e7571'::uuid,
  '5fb90e48-64f2-5ddf-82a0-9a94f7f02020'::uuid,
  'Jalea Mixta',
  'Pescado y mariscos rebozados fritos con yuca y salsa criolla.',
  40.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'a3cfe372-e126-5bb8-8457-074aec5d8490'::uuid,
  '5fb90e48-64f2-5ddf-82a0-9a94f7f02020'::uuid,
  'Conchas a la Parmesana',
  'Conchas de abanico gratinadas con parmesano y vino blanco.',
  36.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 6: Entradas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  '1277ccb7-d396-5f0a-9bdc-3ca82d596afe'::uuid,
  '010dd000-4151-5607-b07f-8759dffdce15'::uuid,
  'Entradas',
  5,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '7aab3f09-7efd-5474-add8-e18938bcd57b'::uuid,
  '1277ccb7-d396-5f0a-9bdc-3ca82d596afe'::uuid,
  'Causa de Camarón',
  'Causa limeña de papa amarilla con relleno de camarón.',
  22.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'c7b739a0-d325-55c8-8303-aa9e74e6034f'::uuid,
  '1277ccb7-d396-5f0a-9bdc-3ca82d596afe'::uuid,
  'Causa de Atún',
  'Causa de papa amarilla con relleno de atún y palta.',
  18.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'b6783711-9b64-5df5-9dac-3fd4088f401b'::uuid,
  '1277ccb7-d396-5f0a-9bdc-3ca82d596afe'::uuid,
  'Pulpo al Olivo',
  'Pulpo cocido con salsa de aceitunas botija y pan tostado.',
  32.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '6a9e9acd-01cf-58f6-9b8c-c71e81913ea1'::uuid,
  '1277ccb7-d396-5f0a-9bdc-3ca82d596afe'::uuid,
  'Anticucho de Corazón',
  '4 anticuchos de corazón de res con papa y ají.',
  24.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '136836d5-26de-5fa9-a87b-e22c0b051579'::uuid,
  '1277ccb7-d396-5f0a-9bdc-3ca82d596afe'::uuid,
  'Tequeños de Mariscos (6 u)',
  '6 tequeños rellenos de mariscos con salsa tártara.',
  22.0,
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- Categoría 7: Bebidas
INSERT INTO categories (
  id, menu_id, name, sort_order, created_at
) VALUES (
  'ff113fc5-1a3d-562e-b08e-7a9db63ab14f'::uuid,
  '010dd000-4151-5607-b07f-8759dffdce15'::uuid,
  'Bebidas',
  6,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '428b454a-970c-50be-bc9b-f84f988c1311'::uuid,
  'ff113fc5-1a3d-562e-b08e-7a9db63ab14f'::uuid,
  'Chicha Morada 1L',
  'Chicha morada casera preparada con maíz morado, piña y canela.',
  12.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  0,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'f6b98097-f7d6-54e1-9476-391735f0b6a4'::uuid,
  'ff113fc5-1a3d-562e-b08e-7a9db63ab14f'::uuid,
  'Maracuyá 1L',
  'Jugo de maracuyá natural preparado al momento.',
  14.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  1,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  'fbccbd5a-90fb-52aa-b097-cad4e987a203'::uuid,
  'ff113fc5-1a3d-562e-b08e-7a9db63ab14f'::uuid,
  'Cerveza Cusqueña 620ml',
  'Cerveza nacional bien helada.',
  12.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  2,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '36f330af-0f46-556c-9761-c07b2e906127'::uuid,
  'ff113fc5-1a3d-562e-b08e-7a9db63ab14f'::uuid,
  'Limonada Fría 1L',
  'Limonada con hierbabuena bien fría.',
  10.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  3,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

INSERT INTO dishes (
  id, category_id, name, description, price, image_url, sort_order, created_at
) VALUES (
  '87bc9805-7412-5bc8-ada6-2c33230407fd'::uuid,
  'ff113fc5-1a3d-562e-b08e-7a9db63ab14f'::uuid,
  'Inca Kola 1.5L',
  'Gaseosa Inca Kola 1.5L para compartir.',
  12.0,
  'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=800&h=600&fit=crop&crop=entropy&q=80&fm=webp',
  4,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  sort_order = EXCLUDED.sort_order;

-- ════════════════════════════════════════════════════════════
-- VERIFICACIÓN
-- ════════════════════════════════════════════════════════════
DO $$ BEGIN
  RAISE NOTICE '✅ Cuenta demo creada: demo@menudigital.pro (plan FULL)';
  RAISE NOTICE '🔑 Password: DemoMenuPro2025!';
END $$;

SELECT 'menus creados' AS info, COUNT(*) AS total FROM menus WHERE user_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid;
SELECT 'categorias creadas' AS info, COUNT(*) AS total FROM categories WHERE menu_id IN (SELECT id FROM menus WHERE user_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid);
SELECT 'platos creados' AS info, COUNT(*) AS total FROM dishes WHERE category_id IN (SELECT c.id FROM categories c JOIN menus m ON m.id = c.menu_id WHERE m.user_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid);

-- URLs públicas de los 5 menús (después de deploy):
-- https://menudigital-pro.vercel.app/r/polleria-el-dorado
-- https://menudigital-pro.vercel.app/r/chifa-dragon-de-oro
-- https://menudigital-pro.vercel.app/r/pizzeria-bella-napoli
-- https://menudigital-pro.vercel.app/r/smash-brothers-burgers
-- https://menudigital-pro.vercel.app/r/cevicheria-la-mar

-- ════════════════════════════════════════════════════════════
-- FIN DEL SCRIPT
-- ════════════════════════════════════════════════════════════
