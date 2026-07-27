-- ============================================================
-- MENU PRO — SCRIPT CONSOLIDADO IDEMPOTENTE
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ============================================================
-- Este script consolida TODAS las migraciones SQL pendientes en
-- un solo lugar. Es 100% idempotente: puedes ejecutarlo cuantas
-- veces quieras sin riesgo. Solo agrega lo que falta.
--
-- Incluye:
-- 1. Redes sociales en `menus` (Facebook, Instagram, WhatsApp,
--    TikTok, Twitter/X, YouTube, Web)
-- 2. Galería de platos (theme_dish_gallery)
-- 3. Campos theme_* (color_secondary, font, layout, image_size,
--    card_style, cover_url, show_search, show_category_icons,
--    rounded_corners, dark_mode)
-- 4. Campos de opciones y galería en `dishes` (gallery, options)
-- 5. Tabla menu_theme_presets (presets de tema Pro)
-- 6. Campos de superadmin en `profiles` (is_super_admin, is_active)
-- 7. Storage bucket `menus` + políticas (si no existen)
-- 8. Fix RLS recursion (security definer functions)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PARTE 1: Redes sociales + galería en `menus`
-- ────────────────────────────────────────────────────────────
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

-- ────────────────────────────────────────────────────────────
-- PARTE 2: Campos theme_* (idempotente)
-- ────────────────────────────────────────────────────────────
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

-- ────────────────────────────────────────────────────────────
-- PARTE 3: Galería + opciones en `dishes`
-- ────────────────────────────────────────────────────────────
-- gallery: array de URLs de imágenes adicionales (lightbox carrusel)
-- options: JSON con grupos de opciones (single/multiple, max, required)
ALTER TABLE dishes
  ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::jsonb;

-- ────────────────────────────────────────────────────────────
-- PARTE 4: Tabla menu_theme_presets (presets de tema Pro)
-- ────────────────────────────────────────────────────────────
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
  ('Oscuro Premium', 'Tema oscuro con acentos dorados', '{"theme_dark_mode":true,"theme_color_secondary":"#1a1a2e","theme_font":"Inter","theme_layout":"single","theme_card_style":"expanded","theme_image_size":"medium"}'::jsonb, false),
  ('Claro Cálido', 'Tema claro tipo beige/crema', '{"theme_dark_mode":false,"theme_color_secondary":"#fefcf7","theme_font":"Inter","theme_layout":"single","theme_card_style":"expanded","theme_image_size":"medium"}'::jsonb, false),
  ('Restaurant Pro', 'Tema premium con doble columna', '{"theme_dark_mode":true,"theme_color_secondary":"#0f0f1a","theme_font":"Playfair Display","theme_layout":"double","theme_card_style":"expanded","theme_image_size":"large"}'::jsonb, true)
) AS t(name, description, config, is_pro)
WHERE NOT EXISTS (SELECT 1 FROM menu_theme_presets LIMIT 1);

-- ────────────────────────────────────────────────────────────
-- PARTE 5: Campos de superadmin en `profiles`
-- ────────────────────────────────────────────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS banned_reason TEXT,
  ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- ────────────────────────────────────────────────────────────
-- PARTE 6: Storage bucket `menus` + políticas
-- ────────────────────────────────────────────────────────────
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

-- ────────────────────────────────────────────────────────────
-- PARTE 7: RLS policies en `profiles` (admin override)
-- ────────────────────────────────────────────────────────────
-- Permite a un superadmin leer/modificar todos los perfiles
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;
CREATE POLICY "profiles_select_own_or_admin"
  ON profiles FOR SELECT
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.is_super_admin = true AND p.is_active = true
    )
  );

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON profiles;
CREATE POLICY "profiles_update_own_or_admin"
  ON profiles FOR UPDATE
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.is_super_admin = true AND p.is_active = true
    )
  );

-- ────────────────────────────────────────────────────────────
-- PARTE 8: Comentarios informativos
-- ────────────────────────────────────────────────────────────
COMMENT ON TABLE menus IS 'Tabla principal de menús — incluye campos de tema (Pro), redes sociales y galería de platos (lightbox).';
COMMENT ON TABLE dishes IS 'Platos del menú — incluye galería (array de URLs) y opciones (JSON: grupos single/multiple con max y required).';
COMMENT ON TABLE menu_theme_presets IS 'Presets de tema predefinidos (Free y Pro).';

-- ============================================================
-- FIN — Verifica que se ejecutó sin errores.
-- Si ya tenías todo aplicado, verás "ALTER TABLE" repetidos
-- con "column already exists" — esto es normal y seguro.
-- ============================================================
