-- ============================================================
-- MenuPro — FIX TODO EN UNO (corrección de 3 bugs reportados)
-- ============================================================
-- Pegar TODO este archivo en Supabase → SQL Editor → Run
-- Es 100% idempotente: se puede ejecutar cuantas veces se quiera.
--
-- BUGS QUE CORRIGE:
--   1) "syntax error at or near RAISE" en mozos-mesas-migration.sql
--      → RAISE NOTICE estaba fuera de un bloque PL/pgSQL
--
--   2) "column d.created_at must appear in the GROUP BY clause"
--      en admin_get_user_detail al ver detalles de cliente
--      → ORDER BY estaba afuera del json_agg()
--
--   3) No se puede activar Premium o Full manualmente, solo Pro
--      → El enum user_plan original solo tenía ('free','pro')
--      → Faltaban 'premium' y 'full' como valores válidos
--      → También agregamos el backfill de qr_token para mozos
-- ============================================================


-- ============================================================
-- BUG 1: Backfill qr_token + RAISE NOTICE correcto
-- ============================================================
-- (Idempotente: si ya existe la columna, no hace nada)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'waiters' AND column_name = 'qr_token'
  ) THEN
    ALTER TABLE waiters ADD COLUMN qr_token TEXT UNIQUE;
    RAISE NOTICE '✅ Columna qr_token agregada a waiters';
  ELSE
    RAISE NOTICE 'ℹ️  Columna qr_token ya existe en waiters';
  END IF;
END $$;

-- Generar tokens para mozos existentes que no tengan uno
UPDATE waiters
SET qr_token = encode(gen_random_bytes(24), 'hex')
WHERE qr_token IS NULL;

-- ✅ Ahora el RAISE NOTICE va dentro de un bloque DO (correcto)
DO $$
DECLARE
  total_waiters INT;
  con_token INT;
BEGIN
  SELECT COUNT(*) INTO total_waiters FROM waiters;
  SELECT COUNT(*) INTO con_token FROM waiters WHERE qr_token IS NOT NULL;

  RAISE NOTICE '✅ Backfill qr_token: % / % mozos con token', con_token, total_waiters;
END $$;


-- ============================================================
-- BUG 2: Fix admin_get_user_detail (ORDER BY dentro de json_agg)
-- ============================================================
-- La función estaba haciendo:
--   SELECT json_agg(row_to_json(d)) FROM ... ORDER BY d.created_at DESC
-- Lo cual tira: "column d.created_at must appear in the GROUP BY clause"
-- La forma correcta: json_agg(row_to_json(d) ORDER BY d.created_at DESC)

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
  -- Sin recursión de RLS
  SELECT public.is_self_super_admin() INTO caller_admin;
  IF NOT caller_admin THEN
    RAISE EXCEPTION 'Acceso denegado: se requiere super admin';
  END IF;

  -- Profile completo
  SELECT row_to_json(p) INTO profile_data FROM profiles p WHERE id = target_user_id;
  IF profile_data IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  -- Stats agregadas
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

  -- Merge stats en profile_data
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

  -- Menus + categorias + dishes
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

  -- ✅ FIX: ORDER BY va DENTRO de json_agg, no afuera
  SELECT COALESCE(json_agg(row_to_json(d) ORDER BY d.created_at DESC), '[]'::json) INTO domains_data
  FROM custom_domains d
  WHERE d.user_id = target_user_id;

  -- Últimas 50 vistas (este ya estaba OK porque usa subquery)
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

COMMENT ON FUNCTION public.admin_get_user_detail IS 'Detalle completo de un usuario para el panel super admin (sin recursión RLS, ORDER BY dentro de json_agg)';


-- ============================================================
-- BUG 3: Extender enum user_plan con 'premium' y 'full'
-- ============================================================
-- El enum original era solo ('free','pro').
-- Cuando el super admin intenta asignar 'premium' o 'full' falla con:
--   "invalid input value for enum user_plan: 'premium'"
--
-- IMPORTANTE: ALTER TYPE ... ADD VALUE NO puede ir dentro de un bloque
-- DO/ BEGIN-END si luego se usa el valor en la misma transacción.
-- Por eso los ejecutamos como statements sueltos (cada uno autocommit).

ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'premium';
ALTER TYPE user_plan ADD VALUE IF NOT EXISTS 'full';

-- Verificación
DO $$
DECLARE
  plan_count INT;
BEGIN
  SELECT COUNT(*) INTO plan_count
  FROM pg_enum
  WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_plan');

  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE '✅ user_plan enum tiene % valores', plan_count;
  RAISE NOTICE '   (esperado: 4 — free, pro, premium, full)';
  IF plan_count < 4 THEN
    RAISE WARNING '⚠️  Faltan valores en el enum. Ejecuta de nuevo este script.';
  ELSE
    RAISE NOTICE '✅ Ya podés asignar premium y full desde el super admin panel';
  END IF;
  RAISE NOTICE '═══════════════════════════════════════════════════';
END $$;


-- ============================================================
-- FIX ADICIONAL: admin_list_all_users — también usar ORDER BY dentro de json_agg
-- ============================================================
-- Por las dudas revisamos la función que lista usuarios. Si tiene el mismo
-- patrón, lo arreglamos acá también.

CREATE OR REPLACE FUNCTION public.admin_list_all_users(
  page_offset INT DEFAULT 0,
  page_limit INT DEFAULT 20,
  search TEXT DEFAULT ''
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_admin BOOLEAN;
  total_count INT;
  users_data JSON;
BEGIN
  SELECT public.is_self_super_admin() INTO caller_admin;
  IF NOT caller_admin THEN
    RAISE EXCEPTION 'Acceso denegado: se requiere super admin';
  END IF;

  -- Contar total
  IF search = '' THEN
    SELECT COUNT(*) INTO total_count FROM profiles;
  ELSE
    SELECT COUNT(*) INTO total_count
    FROM profiles
    WHERE email ILIKE '%' || search || '%'
       OR full_name ILIKE '%' || search || '%';
  END IF;

  -- Listar con stats (ORDER BY dentro de json_agg para evitar error GROUP BY)
  SELECT COALESCE(json_agg(row_to_json(t) ORDER BY t.created_at DESC), '[]'::json) INTO users_data
  FROM (
    SELECT
      p.id, p.email, p.full_name, p.avatar_url, p.plan,
      p.is_super_admin, p.is_active, p.banned_at, p.banned_reason,
      p.mp_status, p.mp_preapproval_id, p.current_period_end,
      p.bg_removals_used, p.bg_removals_reset_at,
      p.created_at, p.updated_at,
      COALESCE(s.menus_count, 0)       AS menus_count,
      COALESCE(s.views_total, 0)       AS views_total,
      COALESCE(s.published_menus, 0)   AS published_menus,
      COALESCE(s.dishes_count, 0)      AS dishes_count
    FROM profiles p
    LEFT JOIN LATERAL (
      SELECT
        COUNT(*)                                                AS menus_count,
        COALESCE(SUM(mn.views_count), 0)                        AS views_total,
        COUNT(*) FILTER (WHERE mn.is_published)                 AS published_menus,
        COALESCE((
          SELECT COUNT(*)
          FROM dishes d2
          JOIN categories c2 ON c2.id = d2.category_id
          JOIN menus mn2     ON mn2.id = c2.menu_id
          WHERE mn2.user_id = p.id
        ), 0)                                                   AS dishes_count
      FROM menus mn
      WHERE mn.user_id = p.id
    ) s ON true
    WHERE search = ''
       OR p.email ILIKE '%' || search || '%'
       OR p.full_name ILIKE '%' || search || '%'
  ) t
  LIMIT page_limit OFFSET page_offset;

  RETURN json_build_object(
    'users', users_data,
    'total', total_count
  );
END;
$$;

COMMENT ON FUNCTION public.admin_list_all_users IS 'Lista paginada de usuarios con stats agregadas (ORDER BY dentro de json_agg)';


-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
DO $$
DECLARE
  plan_values TEXT;
BEGIN
  SELECT string_agg(enumlabel, ', ' ORDER BY enumsortorder) INTO plan_values
  FROM pg_enum
  WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_plan');

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE '🎉 FIX COMPLETO APLICADO';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE 'Valores de user_plan: %', plan_values;
  RAISE NOTICE 'Función admin_get_user_detail: recreada correctamente';
  RAISE NOTICE 'Función admin_list_all_users: recreada correctamente';
  RAISE NOTICE 'Backfill qr_token: aplicado';
  RAISE NOTICE '';
  RAISE NOTICE 'Ahora podés:';
  RAISE NOTICE '  ✅ Ver detalles de cualquier cliente sin error';
  RAISE NOTICE '  ✅ Asignar planes Free / Pro / Premium / Full';
  RAISE NOTICE '  ✅ Mozos con qr_token generados automáticamente';
  RAISE NOTICE '═══════════════════════════════════════════════════';
END $$;
