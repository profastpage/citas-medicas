-- ============================================================
-- MENU THEME PRESETS + PERSISTENCIA ROBUSTA
-- Pegar en Supabase SQL Editor → Run
-- ============================================================
-- Este script es IDEMPOTENTE: puedes ejecutarlo cuantas veces quieras.
--
-- Qué hace:
-- 1. Verifica que las columnas theme_* existan en menus (ya creadas antes)
-- 2. Crea la tabla menu_theme_presets con 8 temas premium pre-diseñados
-- 3. Aplica RLS público para lectura (cualquiera puede ver presets)
-- 4. Crea índices para acelerar carga del menú público
-- 5. Agrega trigger para actualizar updated_at automáticamente
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PARTE 1: Verificar columnas theme_* en menus (idempotente)
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
  ADD COLUMN IF NOT EXISTS theme_dark_mode BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS theme_preset_id UUID REFERENCES public.menu_theme_presets(id) ON DELETE SET NULL;

-- ────────────────────────────────────────────────────────────
-- PARTE 2: Tabla menu_theme_presets
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.menu_theme_presets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  preview_color   TEXT NOT NULL,           -- color representativo para preview
  is_pro          BOOLEAN NOT NULL DEFAULT true,
  config          JSONB NOT NULL,          -- todo el theme_* empaquetado
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ────────────────────────────────────────────────────────────
-- PARTE 3: RLS — presets son públicos de lectura
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.menu_theme_presets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "presets_public_read" ON public.menu_theme_presets;
CREATE POLICY "presets_public_read"
  ON public.menu_theme_presets
  FOR SELECT
  USING (true);

-- Solo super admin puede escribir (usar función anti-recursión)
DROP POLICY IF EXISTS "presets_super_admin_write" ON public.menu_theme_presets;
CREATE POLICY "presets_super_admin_write"
  ON public.menu_theme_presets
  FOR ALL
  USING (public.is_self_super_admin())
  WITH CHECK (public.is_self_super_admin());

-- ────────────────────────────────────────────────────────────
-- PARTE 4: Insertar 8 temas premium pre-diseñados
-- ────────────────────────────────────────────────────────────
INSERT INTO public.menu_theme_presets (slug, name, description, preview_color, is_pro, sort_order, config) VALUES
(
  'elegante-oscuro',
  'Elegante Oscuro',
  'Negro premium con acentos dorados. Ideal para restaurantes fine-dining.',
  '#d4af37',
  true,
  1,
  '{"theme_color_secondary":"#0a0a14","theme_font":"Playfair Display","theme_layout":"single","theme_image_size":"large","theme_card_style":"expanded","theme_show_search":true,"theme_show_category_icons":true,"theme_rounded_corners":true,"theme_dark_mode":true}'::jsonb
),
(
  'moderno-claro',
  'Moderno Claro',
  'Blanco minimalista con tipografía limpia. Perfecto para cafés y bistrós.',
  '#f5f5f0',
  true,
  2,
  '{"theme_color_secondary":"#fafafa","theme_font":"Inter","theme_layout":"single","theme_image_size":"medium","theme_card_style":"minimal","theme_show_search":true,"theme_show_category_icons":false,"theme_rounded_corners":true,"theme_dark_mode":false}'::jsonb
),
(
  'picante-mexicano',
  'Picante Mexicano',
  'Colores cálidos rojo/naranja con esquinas redondeadas. Para comida mexicana y latina.',
  '#ff6b35',
  true,
  3,
  '{"theme_color_secondary":"#3d1f1f","theme_font":"Poppins","theme_layout":"double","theme_image_size":"medium","theme_card_style":"expanded","theme_show_search":true,"theme_show_category_icons":true,"theme_rounded_corners":true,"theme_dark_mode":true}'::jsonb
),
(
  'fresco-verde',
  'Fresco Verde',
  'Verde natural con modo claro. Ideal para veganos, healthy y juguerías.',
  '#06d6a0',
  true,
  4,
  '{"theme_color_secondary":"#f0f9f4","theme_font":"Nunito","theme_layout":"single","theme_image_size":"large","theme_card_style":"expanded","theme_show_search":true,"theme_show_category_icons":true,"theme_rounded_corners":true,"theme_dark_mode":false}'::jsonb
),
(
  'premium-gold',
  'Premium Gold',
  'Dorado sobre negro, tipografía serif. Para restaurantes gourmet y steakhouses.',
  '#d4af37',
  true,
  5,
  '{"theme_color_secondary":"#1a1a2e","theme_font":"Lora","theme_layout":"single","theme_image_size":"hero","theme_card_style":"expanded","theme_show_search":true,"theme_show_category_icons":true,"theme_rounded_corners":false,"theme_dark_mode":true}'::jsonb
),
(
  'grid-completo',
  'Grid Completo',
  'Layout en grid de 3 columnas con imágenes grandes. Para cartas visuales.',
  '#9d4edd',
  true,
  6,
  '{"theme_color_secondary":"#0f0f1a","theme_font":"Montserrat","theme_layout":"grid","theme_image_size":"medium","theme_card_style":"compact","theme_show_search":true,"theme_show_category_icons":true,"theme_rounded_corners":true,"theme_dark_mode":true}'::jsonb
),
(
  'parrilla-rustica',
  'Parrilla Rústica',
  'Tonos tierra y naranja. Perfecto para parrillas y asados.',
  '#c0392b',
  true,
  7,
  '{"theme_color_secondary":"#2c1810","theme_font":"Roboto","theme_layout":"single","theme_image_size":"large","theme_card_style":"expanded","theme_show_search":false,"theme_show_category_icons":true,"theme_rounded_corners":false,"theme_dark_mode":true}'::jsonb
),
(
  'libre-pro',
  'Libre Pro',
  'Sin preset aplicado — tú configuras todo manualmente.',
  '#ffffff',
  true,
  99,
  '{"theme_color_secondary":"#1a1a2e","theme_font":"Inter","theme_layout":"single","theme_image_size":"medium","theme_card_style":"expanded","theme_show_search":true,"theme_show_category_icons":true,"theme_rounded_corners":true,"theme_dark_mode":true}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name            = EXCLUDED.name,
  description     = EXCLUDED.description,
  preview_color   = EXCLUDED.preview_color,
  is_pro          = EXCLUDED.is_pro,
  config          = EXCLUDED.config,
  sort_order      = EXCLUDED.sort_order,
  updated_at      = now();

-- ────────────────────────────────────────────────────────────
-- PARTE 5: Índices para acelerar carga del menú público
-- ────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_menus_slug_published
  ON public.menus (slug)
  WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_categories_menu_id_sort
  ON public.categories (menu_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_dishes_category_id_sort
  ON public.dishes (category_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_menu_views_menu_id_created
  ON public.menu_views (menu_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_menus_user_id_created
  ON public.menus (user_id, created_at DESC);

-- ────────────────────────────────────────────────────────────
-- PARTE 6: Trigger updated_at en menus (si no existe)
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_menus_touch_updated ON public.menus;
CREATE TRIGGER trg_menus_touch_updated
  BEFORE UPDATE ON public.menus
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_categories_touch_updated ON public.categories;
CREATE TRIGGER trg_categories_touch_updated
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_dishes_touch_updated ON public.dishes;
CREATE TRIGGER trg_dishes_touch_updated
  BEFORE UPDATE ON public.dishes
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- ────────────────────────────────────────────────────────────
-- PARTE 7: Función RPC para aplicar preset a un menú (Pro only)
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.apply_theme_preset(
  p_menu_id UUID,
  p_preset_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_id UUID := auth.uid();
  v_menu_owner UUID;
  v_preset public.menu_theme_presets%ROWTYPE;
  v_config JSONB;
BEGIN
  IF caller_id IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  -- Verificar que el menú pertenece al caller
  SELECT user_id INTO v_menu_owner FROM menus WHERE id = p_menu_id;
  IF v_menu_owner IS NULL THEN
    RAISE EXCEPTION 'Menú no encontrado';
  END IF;
  IF v_menu_owner <> caller_id AND NOT public.is_self_super_admin() THEN
    RAISE EXCEPTION 'Sin permisos sobre este menú';
  END IF;

  -- Cargar preset
  SELECT * INTO v_preset FROM menu_theme_presets WHERE id = p_preset_id;
  IF v_preset.id IS NULL THEN
    RAISE EXCEPTION 'Preset no encontrado';
  END IF;

  v_config := v_preset.config;

  -- Aplicar config al menú
  UPDATE menus SET
    theme_preset_id          = v_preset.id,
    theme_color_secondary    = v_config->>'theme_color_secondary',
    theme_font               = v_config->>'theme_font',
    theme_layout             = v_config->>'theme_layout',
    theme_image_size         = v_config->>'theme_image_size',
    theme_card_style         = v_config->>'theme_card_style',
    theme_show_search        = COALESCE((v_config->>'theme_show_search')::boolean, true),
    theme_show_category_icons = COALESCE((v_config->>'theme_show_category_icons')::boolean, true),
    theme_rounded_corners    = COALESCE((v_config->>'theme_rounded_corners')::boolean, true),
    theme_dark_mode          = COALESCE((v_config->>'theme_dark_mode')::boolean, true),
    updated_at               = now()
  WHERE id = p_menu_id;

  RETURN json_build_object(
    'ok', true,
    'preset', v_preset.slug,
    'menu_id', p_menu_id
  );
END;
$$;

-- ────────────────────────────────────────────────────────────
-- PARTE 8: Verificación final
-- ────────────────────────────────────────────────────────────
SELECT '✓ Tabla menu_theme_presets creada' AS status, count(*) AS presets_count
FROM public.menu_theme_presets;

SELECT '✓ Columnas theme_* en menus' AS status, count(*) AS column_count
FROM information_schema.columns
WHERE table_name = 'menus' AND column_name LIKE 'theme_%';

SELECT '✓ Índices creados' AS status, indexname
FROM pg_indexes
WHERE tablename IN ('menus', 'categories', 'dishes', 'menu_views')
  AND indexname LIKE 'idx_%'
ORDER BY indexname;
