-- ============================================================
-- FIX URGENTE — admin_get_user_detail (error al "ver detalles" en super admin)
-- Pegar en Supabase SQL Editor → Run
-- ============================================================
-- PROBLEMA:
--   Al hacer clic en "Ver detalles" de un usuario en /superadmin aparece error.
--   Causa raíz:
--     1) La función admin_get_user_detail usa `SELECT is_super_admin FROM profiles WHERE id = auth.uid()`
--        lo cual puede disparar recursión de RLS en algunas configuraciones.
--     2) La función NO incluye los campos calculados (menus_count, views_total,
--        published_menus, dishes_count) que el frontend espera en userDetail.profile.
--        → el modal los muestra como undefined/0.
--     3) La función NO retorna los nuevos campos theme_*/social_* agregados por
--        add-social-and-gallery.sql, por lo que la info completa del menú no llega.
--
-- SOLUCIÓN:
--   Reescribimos admin_get_user_detail() para:
--     ✓ Usar public.is_self_super_admin() (igual que las RLS, sin recursión)
--     ✓ Calcular menus_count, views_total, published_menus, dishes_count
--     ✓ Traer todas las columnas nuevas (theme_*, social_*)
--     ✓ Incluir cover_url y galería lightbox
--
-- ESTE SCRIPT ES IDEMPOTENTE — ejecútalo cuantas veces quieras.
-- ============================================================

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
  -- ✓ FIX 1: usar is_self_super_admin() evita recursión de RLS
  SELECT public.is_self_super_admin() INTO caller_admin;
  IF NOT caller_admin THEN
    RAISE EXCEPTION 'Acceso denegado: se requiere super admin';
  END IF;

  -- Profile completo (row_to_json trae TODAS las columnas incluidas bg_removals_*, mp_*, etc.)
  SELECT row_to_json(p) INTO profile_data FROM profiles p WHERE id = target_user_id;
  IF profile_data IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  -- ✓ FIX 2: stats agregadas para que el modal las muestre correctamente
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

  -- Merge stats dentro del profile_data (JSON || JSON solo funciona en PG 13+,
  -- usamos jsonb_set encadenado para máxima compatibilidad)
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

  -- ✓ FIX 3: traer TODAS las columnas nuevas (theme_*, social_*, theme_dish_gallery)
  SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) INTO menus_data
  FROM (
    SELECT
      mn.id, mn.name, mn.slug, mn.slogan, mn.description, mn.whatsapp,
      mn.logo_url, mn.color, mn.currency, mn.branding_text,
      mn.is_published, mn.views_count, mn.created_at, mn.updated_at,
      -- Nuevas columnas de tema
      mn.theme_color_secondary, mn.theme_font, mn.theme_layout,
      mn.theme_image_size, mn.theme_card_style, mn.theme_cover_url,
      mn.theme_show_search, mn.theme_show_category_icons,
      mn.theme_rounded_corners, mn.theme_dark_mode, mn.theme_dish_gallery,
      -- Nuevas columnas de redes sociales
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
            SELECT id, name, description, price, image_url, sort_order
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

  -- Dominios
  -- IMPORTANTE: Cuando se usa json_agg() sin GROUP BY, cualquier ORDER BY
  -- debe ir DENTRO del aggregate. Si va afuera, Postgres tira:
  --   "column d.created_at must appear in the GROUP BY clause or be used in an aggregate function"
  SELECT COALESCE(json_agg(row_to_json(d) ORDER BY d.created_at DESC), '[]'::json) INTO domains_data
  FROM custom_domains d
  WHERE d.user_id = target_user_id;

  -- Últimas 50 vistas
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

-- ────────────────────────────────────────────────────────────
-- Verificación: prueba rápida (debe retornar JSON sin error)
-- Reemplaza el UUID por un ID real de un usuario en tu DB.
-- ────────────────────────────────────────────────────────────
-- SELECT public.admin_get_user_detail('00000000-0000-0000-0000-000000000000'::uuid);

-- ============================================================
-- FIN — La función admin_get_user_detail queda:
--   ✓ Sin recursión de RLS (usa is_self_super_admin)
--   ✓ Con stats agregadas (menus_count, views_total, etc.)
--   ✓ Con todas las columnas nuevas (theme_*, social_*)
-- ============================================================
