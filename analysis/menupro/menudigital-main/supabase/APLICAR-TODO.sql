-- ============================================================
--  MENU PRO — SCRIPT SQL COMPLETO (TODO EN UNO)
--  Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ============================================================
--  Este script consolida TODAS las migraciones necesarias:
--   1. Columnas theme_*, social_*, gallery, options
--   2. Tabla menu_theme_presets
--   3. Campos is_super_admin, is_active en profiles
--   4. Storage bucket "menus" + políticas
--   5. Función SECURITY DEFINER is_self_super_admin() (evita recursión RLS)
--   6. RLS policies usando la función (no recursión)
--   7. Función admin_get_user_detail() (modal de detalle superadmin)
--
--  ✅ 100% IDEMPOTENTE — puedes ejecutarlo cuantas veces quieras.
--  ✅ Orden correcto — schema → funciones → RLS → RPC.
--  ✅ Si algo ya existe, lo salta o lo reemplaza sin error.
-- ============================================================

-- ════════════════════════════════════════════════════════════
--  PARTE 1: Columnas de redes sociales + galería en `menus`
-- ════════════════════════════════════════════════════════════
ALTER TABLE menus
  ADD COLUMN IF NOT EXISTS social_facebook   TEXT,
  ADD COLUMN IF NOT EXISTS social_instagram  TEXT,
  ADD COLUMN IF NOT EXISTS social_whatsapp   TEXT,
  ADD COLUMN IF NOT EXISTS social_tiktok     TEXT,
  ADD COLUMN IF NOT EXISTS social_twitter    TEXT,
  ADD COLUMN IF NOT EXISTS social_youtube    TEXT,
  ADD COLUMN IF NOT EXISTS social_web        TEXT;

ALTER TABLE menus
  ADD COLUMN IF NOT EXISTS theme_dish_gallery BOOLEAN NOT NULL DEFAULT true;

-- ════════════════════════════════════════════════════════════
--  PARTE 2: Columnas theme_* (tema personalizable Pro)
-- ════════════════════════════════════════════════════════════
ALTER TABLE menus
  ADD COLUMN IF NOT EXISTS theme_color_secondary TEXT DEFAULT '#1a1a2e',
  ADD COLUMN IF NOT EXISTS theme_font TEXT DEFAULT 'Inter',
  ADD COLUMN IF NOT EXISTS theme_layout TEXT NOT NULL DEFAULT 'single'
    CHECK (theme_layout IN ('single', 'double', 'grid')),
  ADD COLUMN IF NOT EXISTS theme_image_size TEXT NOT NULL DEFAULT 'medium'
    CHECK (theme_image_size IN ('none', 'small', 'medium', 'large', 'hero')),
  ADD COLUMN IF NOT EXISTS theme_card_style TEXT NOT NULL DEFAULT 'expanded'
    CHECK (theme_card_style IN ('compact', 'expanded', 'minimal')),
  ADD COLUMN IF NOT EXISTS theme_cover_url TEXT,
  ADD COLUMN IF NOT EXISTS theme_show_search BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS theme_show_category_icons BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS theme_rounded_corners BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS theme_dark_mode BOOLEAN NOT NULL DEFAULT true;

-- ════════════════════════════════════════════════════════════
--  PARTE 3: Galería + opciones en `dishes`
-- ════════════════════════════════════════════════════════════
--  gallery: array de URLs adicionales (lightbox carrusel)
--  options: JSON con grupos de opciones (single/multiple, max, required)
ALTER TABLE dishes
  ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::jsonb;

-- ════════════════════════════════════════════════════════════
--  PARTE 4: Tabla menu_theme_presets (presets Pro)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS menu_theme_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL,
  is_pro BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insertar presets por defecto si la tabla está vacía
INSERT INTO menu_theme_presets (name, description, config, is_pro)
SELECT * FROM (VALUES
  ('Oscuro Premium', 'Tema oscuro con acentos dorados',
    '{"theme_dark_mode":true,"theme_color_secondary":"#1a1a2e","theme_font":"Inter","theme_layout":"single","theme_card_style":"expanded","theme_image_size":"medium"}'::jsonb, false),
  ('Claro Cálido', 'Tema claro tipo beige/crema',
    '{"theme_dark_mode":false,"theme_color_secondary":"#fefcf7","theme_font":"Inter","theme_layout":"single","theme_card_style":"expanded","theme_image_size":"medium"}'::jsonb, false),
  ('Restaurant Pro', 'Tema premium con doble columna',
    '{"theme_dark_mode":true,"theme_color_secondary":"#0f0f1a","theme_font":"Playfair Display","theme_layout":"double","theme_card_style":"expanded","theme_image_size":"large"}'::jsonb, true)
) AS t(name, description, config, is_pro)
WHERE NOT EXISTS (SELECT 1 FROM menu_theme_presets LIMIT 1);

-- ════════════════════════════════════════════════════════════
--  PARTE 5: Campos de superadmin en `profiles`
-- ════════════════════════════════════════════════════════════
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS banned_reason TEXT,
  ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- ════════════════════════════════════════════════════════════
--  PARTE 6: Storage bucket "menus" + políticas
-- ════════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public)
VALUES ('menus', 'menus', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "menus_storage_select_all" ON storage.objects;
DROP POLICY IF EXISTS "menus_storage_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "menus_storage_update_own" ON storage.objects;
DROP POLICY IF EXISTS "menus_storage_delete_own" ON storage.objects;

CREATE POLICY "menus_storage_select_all"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menus');

CREATE POLICY "menus_storage_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'menus' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "menus_storage_update_own"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'menus' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "menus_storage_delete_own"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'menus' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ════════════════════════════════════════════════════════════
--  PARTE 7: Función SECURITY DEFINER is_self_super_admin()
--  (evita recursión infinita en RLS de profiles)
-- ════════════════════════════════════════════════════════════
--  Como es SECURITY DEFINER, se ejecuta con permisos del owner
--  (postgres) y NO aplica RLS dentro de ella. Rompe la recursión.
CREATE OR REPLACE FUNCTION public.is_self_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND is_super_admin = true
      AND is_active = true
  );
$$;

-- ════════════════════════════════════════════════════════════
--  PARTE 8: RLS policies para profiles (sin recursión)
-- ════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "profiles_select_self" ON profiles;
DROP POLICY IF EXISTS "profiles_update_self" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_self" ON profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_select_super_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON profiles;

-- Cada usuario lee/edita su propio profile
CREATE POLICY "profiles_select_self" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_self" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_self" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Super admin puede leer/editar/eliminar TODOS los profiles
-- (usa la función SECURITY DEFINER para evitar recursión)
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (public.is_self_super_admin());
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE USING (public.is_self_super_admin());
CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE USING (public.is_self_super_admin());

-- ════════════════════════════════════════════════════════════
--  PARTE 9: RLS admin policies para menus, categories, dishes,
--  menu_views, custom_domains (mismo patrón, sin recursión)
-- ════════════════════════════════════════════════════════════

-- menus
DROP POLICY IF EXISTS "menus_select_admin" ON menus;
DROP POLICY IF EXISTS "menus_update_admin" ON menus;
DROP POLICY IF EXISTS "menus_delete_admin" ON menus;
CREATE POLICY "menus_select_admin" ON menus
  FOR SELECT USING (public.is_self_super_admin());
CREATE POLICY "menus_update_admin" ON menus
  FOR UPDATE USING (public.is_self_super_admin());
CREATE POLICY "menus_delete_admin" ON menus
  FOR DELETE USING (public.is_self_super_admin());

-- categories
DROP POLICY IF EXISTS "categories_select_admin" ON categories;
DROP POLICY IF EXISTS "categories_update_admin" ON categories;
DROP POLICY IF EXISTS "categories_delete_admin" ON categories;
CREATE POLICY "categories_select_admin" ON categories
  FOR SELECT USING (public.is_self_super_admin());
CREATE POLICY "categories_update_admin" ON categories
  FOR UPDATE USING (public.is_self_super_admin());
CREATE POLICY "categories_delete_admin" ON categories
  FOR DELETE USING (public.is_self_super_admin());

-- dishes
DROP POLICY IF EXISTS "dishes_select_admin" ON dishes;
DROP POLICY IF EXISTS "dishes_update_admin" ON dishes;
DROP POLICY IF EXISTS "dishes_delete_admin" ON dishes;
CREATE POLICY "dishes_select_admin" ON dishes
  FOR SELECT USING (public.is_self_super_admin());
CREATE POLICY "dishes_update_admin" ON dishes
  FOR UPDATE USING (public.is_self_super_admin());
CREATE POLICY "dishes_delete_admin" ON dishes
  FOR DELETE USING (public.is_self_super_admin());

-- menu_views
DROP POLICY IF EXISTS "menu_views_select_admin" ON menu_views;
CREATE POLICY "menu_views_select_admin" ON menu_views
  FOR SELECT USING (public.is_self_super_admin());

-- custom_domains
DROP POLICY IF EXISTS "custom_domains_select_admin" ON custom_domains;
DROP POLICY IF EXISTS "custom_domains_update_admin" ON custom_domains;
DROP POLICY IF EXISTS "custom_domains_delete_admin" ON custom_domains;
CREATE POLICY "custom_domains_select_admin" ON custom_domains
  FOR SELECT USING (public.is_self_super_admin());
CREATE POLICY "custom_domains_update_admin" ON custom_domains
  FOR UPDATE USING (public.is_self_super_admin());
CREATE POLICY "custom_domains_delete_admin" ON custom_domains
  FOR DELETE USING (public.is_self_super_admin());

-- ════════════════════════════════════════════════════════════
--  PARTE 10: Función admin_get_user_detail (modal superadmin)
--  — trae profile + menus + categories + dishes + dominios +
--    últimas vistas, con stats agregadas y columnas nuevas.
-- ════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.admin_get_user_detail(target_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_admin BOOLEAN;
  profile_data JSON;
  menus_data JSON;
  domains_data JSON;
  recent_views JSON;
  stats RECORD;
BEGIN
  -- Verifica que el caller sea super admin (sin recursión)
  SELECT public.is_self_super_admin() INTO caller_admin;
  IF NOT caller_admin THEN
    RAISE EXCEPTION 'Acceso denegado: se requiere super admin';
  END IF;

  -- Profile completo (row_to_json trae TODAS las columnas)
  SELECT row_to_json(p) INTO profile_data FROM profiles p WHERE id = target_user_id;
  IF profile_data IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  -- Stats agregadas (menus_count, views_total, published_menus, dishes_count)
  SELECT
    COUNT(*)                                                             AS menus_count,
    COALESCE(SUM(mn.views_count), 0)                                     AS views_total,
    COUNT(*) FILTER (WHERE mn.is_published)                              AS published_menus,
    COALESCE((
      SELECT COUNT(*)
      FROM dishes d2
      JOIN categories c2 ON c2.id = d2.category_id
      JOIN menus mn2     ON mn2.id = c2.menu_id
      WHERE mn2.user_id = target_user_id
    ), 0)                                                                AS dishes_count
  INTO stats
  FROM menus mn
  WHERE mn.user_id = target_user_id;

  -- Merge stats dentro del profile_data
  profile_data := jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(profile_data::jsonb, '{menus_count}',     to_jsonb(stats.menus_count)),
        '{views_total}',     to_jsonb(stats.views_total)
      ),
      '{published_menus}', to_jsonb(stats.published_menus)
    ),
    '{dishes_count}',     to_jsonb(stats.dishes_count)
  )::json;

  -- Menús con categorías y platos anidados (incluye theme_* y social_*)
  SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) INTO menus_data
  FROM (
    SELECT
      mn.id, mn.name, mn.slug, mn.slogan, mn.description, mn.whatsapp,
      mn.logo_url, mn.color, mn.currency, mn.branding_text,
      mn.is_published, mn.views_count, mn.created_at, mn.updated_at,
      mn.theme_color_secondary, mn.theme_font, mn.theme_layout,
      mn.theme_image_size, mn.theme_card_style, mn.theme_cover_url,
      mn.theme_show_search, mn.theme_show_category_icons,
      mn.theme_rounded_corners, mn.theme_dark_mode, mn.theme_dish_gallery,
      mn.social_facebook, mn.social_instagram, mn.social_whatsapp,
      mn.social_tiktok, mn.social_twitter, mn.social_youtube, mn.social_web,
      COALESCE(cats.categories, '[]'::json) AS categories
    FROM menus mn
    LEFT JOIN LATERAL (
      SELECT COALESCE(json_agg(row_to_json(c)), '[]'::json) AS categories
      FROM (
        SELECT
          cat.id, cat.name, cat.sort_order,
          COALESCE(dsh.dishes, '[]'::json) AS dishes
        FROM categories cat
        LEFT JOIN LATERAL (
          SELECT COALESCE(json_agg(row_to_json(d)), '[]'::json) AS dishes
          FROM (
            SELECT id, name, description, price, image_url, sort_order,
                   gallery, options
            FROM dishes WHERE category_id = cat.id
            ORDER BY sort_order
          ) d
        ) dsh ON true
        WHERE cat.menu_id = mn.id
        ORDER BY cat.sort_order
      ) c
    ) cats ON true
    WHERE mn.user_id = target_user_id
    ORDER BY mn.created_at DESC
  ) t;

  -- Dominios personalizados del usuario
  SELECT COALESCE(json_agg(row_to_json(d)), '[]'::json) INTO domains_data
  FROM custom_domains d
  WHERE d.user_id = target_user_id
  ORDER BY d.created_at DESC;

  -- Últimas 50 vistas de sus menús
  SELECT COALESCE(json_agg(row_to_json(v)), '[]'::json) INTO recent_views
  FROM (
    SELECT mv.id, mv.menu_id, mv.ip, mv.user_agent, mv.created_at, m.name AS menu_name
    FROM menu_views mv
    JOIN menus m ON m.id = mv.menu_id
    WHERE m.user_id = target_user_id
    ORDER BY mv.created_at DESC
    LIMIT 50
  ) v;

  RETURN json_build_object(
    'profile', profile_data,
    'menus', menus_data,
    'domains', domains_data,
    'recent_views', recent_views
  );
END;
$$;

-- ════════════════════════════════════════════════════════════
--  PARTE 11: Otorgar permisos de ejecución a la función RPC
-- ════════════════════════════════════════════════════════════
GRANT EXECUTE ON FUNCTION public.admin_get_user_detail(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_self_super_admin() TO authenticated;

-- ════════════════════════════════════════════════════════════
--  PARTE 12: Comentarios informativos
-- ════════════════════════════════════════════════════════════
COMMENT ON TABLE menus IS 'Tabla principal de menús — incluye campos de tema (Pro), redes sociales y galería de platos (lightbox).';
COMMENT ON TABLE dishes IS 'Platos del menú — incluye galería (array de URLs) y opciones (JSON: grupos single/multiple con max y required).';
COMMENT ON TABLE menu_theme_presets IS 'Presets de tema predefinidos (Free y Pro).';
COMMENT ON FUNCTION public.is_self_super_admin() IS 'Función SECURITY DEFINER que bypassa RLS para evitar recursión infinita al verificar si el usuario actual es super admin.';
COMMENT ON FUNCTION public.admin_get_user_detail(UUID) IS 'RPC usada por el modal de detalle del superadmin. Trae profile + stats + menus + categorías + platos + dominios + últimas vistas.';

-- ════════════════════════════════════════════════════════════
--  PARTE 13: Verificación opcional (descomenta para probar)
-- ════════════════════════════════════════════════════════════
-- ¿Soy super admin? (debe retornar true si tu sesión es de un super admin)
-- SELECT public.is_self_super_admin() AS soy_super_admin;

-- Ver todos los super admins registrados:
-- SELECT id, email, full_name, is_super_admin, is_active, created_at
-- FROM profiles
-- WHERE is_super_admin = true
-- ORDER BY created_at DESC;

-- Promover a un usuario a super admin (cambia el email):
-- UPDATE profiles SET is_super_admin = true WHERE email = 'tu-email@gmail.com';

-- ============================================================
--  FIN — Si todo se ejecutó sin errores, ya tienes:
--   ✓ Esquema completo (theme_*, social_*, gallery, options)
--   ✓ Storage bucket "menus" con políticas
--   ✓ Función is_self_super_admin() sin recursión
--   ✓ RLS policies en todas las tablas (sin recursión)
--   ✓ Función admin_get_user_detail() (modal superadmin)
--   ✓ Permisos concedidos a usuarios autenticados
--
--  Si ves mensajes "column already exists" en algunas partes,
--  es normal — significa que ya tenías esos campos aplicados.
--  El script es idempotente.
-- ============================================================
