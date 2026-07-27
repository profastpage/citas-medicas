-- ============================================================
-- Migración: Estilo Carta (PedidosYa/Rappi) + Analytics QR source
-- ============================================================
-- Cambios:
--   1. Agregar 4 columnas a menus para el nuevo tema "Carta":
--      - theme_carta_style        (boolean, default false)
--      - theme_carta_list_style   (boolean, default false)
--      - theme_carta_autoscroll   (boolean, default false)
--      - theme_carta_scroll_speed (integer, default 30)
--   2. Agregar columna `source` a menu_views para distinguir
--      visitas directas (/r/[slug]) de visitas vía QR (/qr/[slug]).
--
-- Idempotente: usa IF NOT EXISTS / DO blocks. Se puede ejecutar
-- múltiples veces sin error.
-- ============================================================

-- ─── 1. Nuevas columnas en menus ─────────────────────────────
DO $$
BEGIN
  -- theme_carta_style: activa el modo carrusel horizontal (Destacados + categorías)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menus' AND column_name = 'theme_carta_style'
  ) THEN
    ALTER TABLE menus ADD COLUMN theme_carta_style BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;

  -- theme_carta_list_style: activa el modo lista Rappi (texto izq, imagen der)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menus' AND column_name = 'theme_carta_list_style'
  ) THEN
    ALTER TABLE menus ADD COLUMN theme_carta_list_style BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;

  -- theme_carta_autoscroll: activa el auto-scroll del carrusel Destacados
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menus' AND column_name = 'theme_carta_autoscroll'
  ) THEN
    ALTER TABLE menus ADD COLUMN theme_carta_autoscroll BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;

  -- theme_carta_scroll_speed: velocidad del auto-scroll en px/seg (10-120)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menus' AND column_name = 'theme_carta_scroll_speed'
  ) THEN
    ALTER TABLE menus ADD COLUMN theme_carta_scroll_speed INTEGER NOT NULL DEFAULT 30;
    -- Constraint para validar rango (10-120 px/seg)
    ALTER TABLE menus ADD CONSTRAINT menus_theme_carta_scroll_speed_chk
      CHECK (theme_carta_scroll_speed >= 5 AND theme_carta_scroll_speed <= 200);
  END IF;
END $$;

-- ─── 2. Columna `source` en menu_views (analytics QR) ─────────
-- Permite distinguir en analíticas:
--   - source = 'qr'    → visita vino de un QR code (ruta /qr/[slug])
--   - source = 'direct' → visita directa (ruta /r/[slug])
--   - source = NULL     → visita sin fuente identificable (compat hacia atrás)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_views' AND column_name = 'source'
  ) THEN
    ALTER TABLE menu_views ADD COLUMN source TEXT;
    -- Index para filtrar por source eficientemente
    CREATE INDEX IF NOT EXISTS idx_menu_views_source ON menu_views(source);
  END IF;
END $$;

-- ─── 3. Comentarios informativos ─────────────────────────────
COMMENT ON COLUMN menus.theme_carta_style IS 'Activa el modo Carta PedidosYa/Rappi: Destacados arriba + categorías como carruseles horizontales';
COMMENT ON COLUMN menus.theme_carta_list_style IS 'Activa el modo Lista Rappi: productos en filas con texto izquierda e imagen pequeña derecha';
COMMENT ON COLUMN menus.theme_carta_autoscroll IS 'Activa el auto-scroll automático del carrusel Destacados (pausa al interactuar)';
COMMENT ON COLUMN menus.theme_carta_scroll_speed IS 'Velocidad del auto-scroll en px/seg (rango 5-200, default 30)';
COMMENT ON COLUMN menu_views.source IS 'Fuente de la visita: qr (vía /qr/[slug]) o direct (vía /r/[slug]). NULL = no tracking.';

-- ─── 4. Verificación final ───────────────────────────────────
-- Confirmar que las columnas se agregaron correctamente
DO $$
DECLARE
  carta_count INTEGER;
  source_exists BOOLEAN;
BEGIN
  SELECT COUNT(*) INTO carta_count
  FROM information_schema.columns
  WHERE table_name = 'menus' AND column_name IN (
    'theme_carta_style',
    'theme_carta_list_style',
    'theme_carta_autoscroll',
    'theme_carta_scroll_speed'
  );

  SELECT EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_views' AND column_name = 'source'
  ) INTO source_exists;

  RAISE NOTICE 'Migración completada: % columnas Carta agregadas, source column exists: %',
    carta_count, source_exists;
  RAISE NOTICE '✅ Listo. El tema Carta ya está disponible en el editor de menús.';
END $$;
