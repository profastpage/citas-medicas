-- ============================================================
-- Migration: agregar columnas de "Quitar fondo" a profiles
-- Para bases de datos existentes que ya tienen la tabla profiles.
-- Si partiste de cero con la migración 20250101000000_init.sql,
-- estas columnas ya existen — este archivo es no-op (safe).
-- ============================================================

-- Agregar columnas si no existen
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS bg_removals_used INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bg_removals_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Crear la función RPC si no existe (CREATE OR REPLACE)
CREATE OR REPLACE FUNCTION public.increment_bg_removals(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  current_used INTEGER;
  current_reset TIMESTAMPTZ;
  new_value INTEGER;
BEGIN
  SELECT bg_removals_used, bg_removals_reset_at
    INTO current_used, current_reset
  FROM profiles WHERE id = user_uuid;

  IF current_reset IS NULL OR NOW() - current_reset >= INTERVAL '30 days' THEN
    new_value := 1;
    UPDATE profiles
      SET bg_removals_used = 1, bg_removals_reset_at = NOW()
      WHERE id = user_uuid;
  ELSE
    new_value := current_used + 1;
    UPDATE profiles
      SET bg_removals_used = current_used + 1
      WHERE id = user_uuid;
  END IF;

  RETURN new_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_bg_removals_quota(user_uuid UUID, monthly_limit INTEGER)
RETURNS JSON AS $$
DECLARE
  current_used INTEGER;
  current_reset TIMESTAMPTZ;
  effective_used INTEGER;
  effective_reset TIMESTAMPTZ;
BEGIN
  SELECT bg_removals_used, bg_removals_reset_at
    INTO current_used, current_reset
  FROM profiles WHERE id = user_uuid;

  IF current_reset IS NULL OR NOW() - current_reset >= INTERVAL '30 days' THEN
    effective_used := 0;
    effective_reset := NOW();
  ELSE
    effective_used := COALESCE(current_used, 0);
    effective_reset := current_reset;
  END IF;

  RETURN json_build_object(
    'used', effective_used,
    'limit', monthly_limit,
    'remaining', GREATEST(monthly_limit - effective_used, 0),
    'reset_at', effective_reset
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
