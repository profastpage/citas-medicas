-- ============================================================
-- FIX — Backfill de profiles + activar super admin
-- Ejecuta esto en Supabase SQL Editor para solucionar
-- el problema de "no veo el panel super admin"
-- ============================================================

-- PASO 1: Backfill — crea profiles para TODOS los auth.users
-- que no tengan profile aún (trigger solo funciona en nuevos)
INSERT INTO public.profiles (id, email, full_name, avatar_url, plan, is_super_admin, is_active, created_at, updated_at)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', NULL),
  COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture', NULL),
  'free'::user_plan,
  false,
  true,
  u.created_at,
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- PASO 2: Activar is_super_admin en las cuentas indicadas
UPDATE public.profiles
SET
  is_super_admin = true,
  is_active = true,
  updated_at = NOW()
WHERE email IN ('profastpage@gmail.com', 'expertperutravel@gmail.com');

-- PASO 3: Verificación — muestra qué se actualizó
SELECT
  id,
  email,
  full_name,
  plan,
  is_super_admin,
  is_active,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- ============================================================
-- Si ves en el resultado:
--   profastpage@gmail.com | is_super_admin = true | is_active = true
-- entonces ya está listo.
--
-- Después: vuelve a tu app y entra a https://menudigital-pro.vercel.app/superadmin
-- (o haz logout y login otra vez para que el middleware redirija)
-- ============================================================
