-- ============================================================
-- FIX URGENTE — Eliminar recursión infinita en RLS de profiles
-- Pegar en Supabase SQL Editor → Run
--
-- Problema: la policy "profiles_select_admin" hace:
--   EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_super_admin = true)
-- Eso dispara RLS de profiles → que vuelve a llamar a la policy → recursión infinita.
-- El middleware/callback reciben NULL y nunca detectan al super admin.
--
-- Solución:
--   1. Crear función SECURITY DEFINER is_self_super_admin() que bypassa RLS
--   2. Reescribir las policies para que llamen a esa función (no a SELECT directo)
--   3. Aplicar el mismo patrón a menus, dishes, categories, menu_views, custom_domains
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PASO 1: Función helper que bypassa RLS (SECURITY DEFINER)
-- ────────────────────────────────────────────────────────────
-- Como es SECURITY DEFINER, se ejecuta con los permisos del owner
-- (postgres) y NO se aplica RLS dentro de ella. Esto rompe la recursión.
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

-- ────────────────────────────────────────────────────────────
-- PASO 2: Reescribir policies de profiles
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "profiles_select_self" ON profiles;
DROP POLICY IF EXISTS "profiles_update_self" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_self" ON profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_admin" ON profiles;
DROP POLICY IF EXISTS "profiles_select_super_admin" ON profiles;

-- Cada usuario lee/edita su propio profile
CREATE POLICY "profiles_select_self" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_self" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_self" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Super admin puede leer/editar TODOS los profiles
-- (usa la función SECURITY DEFINER para evitar recursión)
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (public.is_self_super_admin());

CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE USING (public.is_self_super_admin());

CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE USING (public.is_self_super_admin());

-- ────────────────────────────────────────────────────────────
-- PASO 3: Reescribir policies de menus (mismo patrón)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "menus_select_admin" ON menus;
DROP POLICY IF EXISTS "menus_update_admin" ON menus;
DROP POLICY IF EXISTS "menus_delete_admin" ON menus;

CREATE POLICY "menus_select_admin" ON menus
  FOR SELECT USING (public.is_self_super_admin());

CREATE POLICY "menus_update_admin" ON menus
  FOR UPDATE USING (public.is_self_super_admin());

CREATE POLICY "menus_delete_admin" ON menus
  FOR DELETE USING (public.is_self_super_admin());

-- ────────────────────────────────────────────────────────────
-- PASO 4: Reescribir policies de categories (mismo patrón)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "categories_select_admin" ON categories;
DROP POLICY IF EXISTS "categories_update_admin" ON categories;
DROP POLICY IF EXISTS "categories_delete_admin" ON categories;

CREATE POLICY "categories_select_admin" ON categories
  FOR SELECT USING (public.is_self_super_admin());

CREATE POLICY "categories_update_admin" ON categories
  FOR UPDATE USING (public.is_self_super_admin());

CREATE POLICY "categories_delete_admin" ON categories
  FOR DELETE USING (public.is_self_super_admin());

-- ────────────────────────────────────────────────────────────
-- PASO 5: Reescribir policies de dishes (mismo patrón)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "dishes_select_admin" ON dishes;
DROP POLICY IF EXISTS "dishes_update_admin" ON dishes;
DROP POLICY IF EXISTS "dishes_delete_admin" ON dishes;

CREATE POLICY "dishes_select_admin" ON dishes
  FOR SELECT USING (public.is_self_super_admin());

CREATE POLICY "dishes_update_admin" ON dishes
  FOR UPDATE USING (public.is_self_super_admin());

CREATE POLICY "dishes_delete_admin" ON dishes
  FOR DELETE USING (public.is_self_super_admin());

-- ────────────────────────────────────────────────────────────
-- PASO 6: Reescribir policies de menu_views
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "menu_views_select_admin" ON menu_views;

CREATE POLICY "menu_views_select_admin" ON menu_views
  FOR SELECT USING (public.is_self_super_admin());

-- ────────────────────────────────────────────────────────────
-- PASO 7: Reescribir policies de custom_domains
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "custom_domains_select_admin" ON custom_domains;
DROP POLICY IF EXISTS "custom_domains_update_admin" ON custom_domains;
DROP POLICY IF EXISTS "custom_domains_delete_admin" ON custom_domains;

CREATE POLICY "custom_domains_select_admin" ON custom_domains
  FOR SELECT USING (public.is_self_super_admin());

CREATE POLICY "custom_domains_update_admin" ON custom_domains
  FOR UPDATE USING (public.is_self_super_admin());

CREATE POLICY "custom_domains_delete_admin" ON custom_domains
  FOR DELETE USING (public.is_self_super_admin());

-- ────────────────────────────────────────────────────────────
-- PASO 8: Verificación — esto ya NO debe dar error de recursión
-- ────────────────────────────────────────────────────────────
-- Ejecuta esta query (cambia el email por el tuyo):
SELECT
  id,
  email,
  is_super_admin,
  is_active,
  created_at
FROM public.profiles
WHERE email IN ('profastpage@gmail.com', 'expertperutravel@gmail.com')
ORDER BY created_at DESC;

-- ────────────────────────────────────────────────────────────
-- PASO 9: Test final — verificar que la función no recursa
-- ────────────────────────────────────────────────────────────
SELECT public.is_self_super_admin() AS soy_super_admin;

-- Si esto retorna true → el problema está resuelto
-- Si retorna false → tu sesión no es de un super admin (revisa el email)
