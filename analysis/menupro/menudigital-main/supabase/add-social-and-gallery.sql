-- ============================================================
-- MENU PRO — Redes sociales + Galería de platos (lightbox carrusel)
-- Pegar en Supabase SQL Editor → Run
-- ============================================================
-- Este script es IDEEMPOTENTE: puedes ejecutarlo cuantas veces quieras.
--
-- Qué hace:
-- 1. Agrega columnas de redes sociales a la tabla `menus`
--    (Facebook, Instagram, WhatsApp, TikTok, Twitter/X, YouTube, Web)
-- 2. Agrega columna `theme_dish_gallery` (BOOLEAN) — activa el lightbox
--    carrusel al hacer clic en un plato
-- 3. Verifica que las columnas theme_* previas existan (por si acaso)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PARTE 1: Redes sociales en `menus`
-- ────────────────────────────────────────────────────────────
ALTER TABLE menus
  ADD COLUMN IF NOT EXISTS social_facebook   TEXT,
  ADD COLUMN IF NOT EXISTS social_instagram  TEXT,
  ADD COLUMN IF NOT EXISTS social_whatsapp   TEXT,   -- si vacío, usa el `whatsapp` principal
  ADD COLUMN IF NOT EXISTS social_tiktok     TEXT,
  ADD COLUMN IF NOT EXISTS social_twitter    TEXT,   --Twitter/X handle o URL
  ADD COLUMN IF NOT EXISTS social_youtube    TEXT,
  ADD COLUMN IF NOT EXISTS social_web        TEXT;   -- sitio web personalizado

-- ────────────────────────────────────────────────────────────
-- PARTE 2: Galería de platos (lightbox carrusel)
-- ────────────────────────────────────────────────────────────
ALTER TABLE menus
  ADD COLUMN IF NOT EXISTS theme_dish_gallery BOOLEAN NOT NULL DEFAULT true;

-- ────────────────────────────────────────────────────────────
-- PARTE 3: Verificación de columnas theme_* (idempotente)
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
-- PARTE 4: Comentario informativo
-- ────────────────────────────────────────────────────────────
COMMENT ON TABLE menus IS 'Tabla principal de menús — incluye campos de tema (Pro), redes sociales y galería de platos (lightbox).';

-- ============================================================
-- FIN — Ejecuta este script en: Supabase Dashboard → SQL Editor
-- ============================================================
