-- ============================================================
-- FIX URGENTE v2 — Bug admin_list_all_users + Columnas de tema
-- Pegar en Supabase SQL Editor → Run
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PARTE 1: Fix del bug "d.created_at must appear in GROUP BY"
-- ────────────────────────────────────────────────────────────
-- El alias `d` del LATERAL JOIN choca con el `d` interno de `dishes d`.
-- Renombramos los aliases internos a `dd`, `cc`, `mn2` para evitar colisión.

CREATE OR REPLACE FUNCTION public.admin_list_all_users(
  page_offset INTEGER DEFAULT 0,
  page_limit INTEGER DEFAULT 50,
  search TEXT DEFAULT ''
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_admin BOOLEAN;
  result_data JSON;
  total_count INTEGER;
BEGIN
  SELECT public.is_self_super_admin() INTO caller_admin;
  IF NOT caller_admin THEN
    RAISE EXCEPTION 'Forbidden: super admin only';
  END IF;

  IF search IS NULL OR search = '' THEN
    SELECT COUNT(*) INTO total_count FROM profiles;
  ELSE
    SELECT COUNT(*) INTO total_count FROM profiles
      WHERE email ILIKE '%' || search || '%' OR COALESCE(full_name, '') ILIKE '%' || search || '%';
  END IF;

  IF search IS NULL OR search = '' THEN
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) INTO result_data
    FROM (
      SELECT
        p.id, p.email, p.full_name, p.avatar_url, p.plan, p.is_super_admin, p.is_active,
        p.banned_at, p.banned_reason, p.mp_status, p.mp_preapproval_id, p.current_period_end,
        p.bg_removals_used, p.bg_removals_reset_at, p.created_at, p.updated_at,
        COALESCE(m.stats_menus, 0) AS menus_count,
        COALESCE(m.stats_views, 0) AS views_total,
        COALESCE(m.stats_published, 0) AS published_menus,
        COALESCE(dd.stats_dishes, 0) AS dishes_count
      FROM profiles p
      LEFT JOIN LATERAL (
        SELECT COUNT(*) AS stats_menus,
               COALESCE(SUM(views_count), 0) AS stats_views,
               COUNT(*) FILTER (WHERE is_published) AS stats_published
        FROM menus WHERE user_id = p.id
      ) m ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*) AS stats_dishes
        FROM dishes d2
        JOIN categories c2 ON c2.id = d2.category_id
        JOIN menus mn2 ON mn2.id = c2.menu_id
        WHERE mn2.user_id = p.id
      ) dd ON true
      ORDER BY p.created_at DESC
      LIMIT page_limit OFFSET page_offset
    ) t;
  ELSE
    SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) INTO result_data
    FROM (
      SELECT
        p.id, p.email, p.full_name, p.avatar_url, p.plan, p.is_super_admin, p.is_active,
        p.banned_at, p.banned_reason, p.mp_status, p.mp_preapproval_id, p.current_period_end,
        p.bg_removals_used, p.bg_removals_reset_at, p.created_at, p.updated_at,
        COALESCE(m.stats_menus, 0) AS menus_count,
        COALESCE(m.stats_views, 0) AS views_total,
        COALESCE(m.stats_published, 0) AS published_menus,
        COALESCE(dd.stats_dishes, 0) AS dishes_count
      FROM profiles p
      LEFT JOIN LATERAL (
        SELECT COUNT(*) AS stats_menus,
               COALESCE(SUM(views_count), 0) AS stats_views,
               COUNT(*) FILTER (WHERE is_published) AS stats_published
        FROM menus WHERE user_id = p.id
      ) m ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*) AS stats_dishes
        FROM dishes d3
        JOIN categories c3 ON c3.id = d3.category_id
        JOIN menus mn3 ON mn3.id = c3.menu_id
        WHERE mn3.user_id = p.id
      ) dd ON true
      WHERE p.email ILIKE '%' || search || '%' OR COALESCE(p.full_name, '') ILIKE '%' || search || '%'
      ORDER BY p.created_at DESC
      LIMIT page_limit OFFSET page_offset
    ) t;
  END IF;

  RETURN json_build_object(
    'users', result_data,
    'total', total_count,
    'page_offset', page_offset,
    'page_limit', page_limit
  );
END;
$$;

-- ────────────────────────────────────────────────────────────
-- PARTE 2: Columnas de tema personalizables en menus
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
-- PARTE 3: Verificación final
-- ────────────────────────────────────────────────────────────
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'menus'
  AND column_name LIKE 'theme_%'
ORDER BY column_name;

-- Test rápido: lista tus super admins (debe dar 2 filas)
SELECT id, email, is_super_admin, is_active
FROM public.profiles
WHERE email IN ('profastpage@gmail.com', 'expertperutravel@gmail.com');
