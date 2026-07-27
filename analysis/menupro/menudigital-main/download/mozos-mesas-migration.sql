-- ============================================================
-- MenuPro — Migración: Gestión de Mozos + Mesas (Premium+)
-- ============================================================
-- Ejecutar este script en Supabase → SQL Editor.
-- Es 100% idempotente: puede ejecutarse múltiples veces sin error.
--
-- Qué hace:
--   1. Verifica/crea las tablas `waiters` (mozos) y `tables` (mesas)
--   2. Garantiza que `waiters.qr_token` existe (para acceso móvil sin login)
--   3. Crea un trigger para auto-generar qr_token al insertar un mozo
--   4. Backfill: genera qr_token para mozos existentes que no tengan uno
--   5. Habilita RLS con políticas owner-only
--   6. Crea índices para performance
--
-- Compatible con: schema.sql, add-premium-logistics.sql, add-waiter-qr-token.sql
-- ============================================================

-- ============================================================
-- 1. ENUM types (necesarios para `tables.status`)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE table_status AS ENUM ('libre', 'ocupada', 'reservada', 'inactiva');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- 2. Tabla: branches (sucursales — requerida por FK en tables y waiters)
-- ============================================================
CREATE TABLE IF NOT EXISTS branches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  address         TEXT,
  phone           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_branches_owner ON branches(owner_id);

-- ============================================================
-- 3. Tabla: tables (mesas)
-- ============================================================
CREATE TABLE IF NOT EXISTS tables (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id       UUID REFERENCES branches(id) ON DELETE SET NULL,
  number          INT NOT NULL,
  name            TEXT,
  capacity        INT NOT NULL DEFAULT 4,
  status          table_status NOT NULL DEFAULT 'libre',
  qr_token        TEXT UNIQUE,
  location        TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
  -- Restricción UNIQUE movida abajo (ver sección 5.5) para soportar multi-sucursal
);

CREATE INDEX IF NOT EXISTS idx_tables_owner ON tables(owner_id);
CREATE INDEX IF NOT EXISTS idx_tables_status ON tables(owner_id, status);

-- ============================================================
-- 3.5 Restricción UNIQUE para tables (multi-sucursal)
-- ============================================================
-- IMPORTANTE: la restricción debe ser (owner_id, branch_id, number)
-- y NO (owner_id, number), porque un mismo owner puede tener varias
-- sucursales y cada sucursal tiene su propia numeración 1, 2, 3...
-- Si branch_id es NULL, Postgres permite duplicados (NULL != NULL).
DO $$
BEGIN
  -- Eliminar la restricción vieja si existe (migraciones anteriores)
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tables_owner_id_number_key'
      AND conrelid = 'tables'::regclass
  ) THEN
    ALTER TABLE tables DROP CONSTRAINT tables_owner_id_number_key;
    RAISE NOTICE '✅ Restricción vieja tables_owner_id_number_key eliminada';
  END IF;

  -- Crear la nueva si no existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'tables_owner_branch_number_key'
      AND conrelid = 'tables'::regclass
  ) THEN
    ALTER TABLE tables
      ADD CONSTRAINT tables_owner_branch_number_key
      UNIQUE (owner_id, branch_id, number);
    RAISE NOTICE '✅ Restricción nueva tables_owner_branch_number_key creada';
  ELSE
    RAISE NOTICE 'ℹ️  Restricción tables_owner_branch_number_key ya existe';
  END IF;
END $$;

-- ============================================================
-- 4. Tabla: waiters (mozos)
-- ============================================================
CREATE TABLE IF NOT EXISTS waiters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch_id       UUID REFERENCES branches(id) ON DELETE SET NULL,
  auth_user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name       TEXT NOT NULL,
  document_id     TEXT,
  phone           TEXT,
  pin             TEXT,
  qr_token        TEXT UNIQUE,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_waiters_owner ON waiters(owner_id);
CREATE INDEX IF NOT EXISTS idx_waiters_active ON waiters(owner_id, is_active);

-- ============================================================
-- 5. Garantizar columna qr_token en waiters (si la tabla ya existía)
-- ============================================================
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

-- ============================================================
-- 6. Función para generar tokens aleatorios (hex 48 chars)
-- ============================================================
CREATE OR REPLACE FUNCTION generate_mozopro_token()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT encode(gen_random_bytes(24), 'hex');
$$;

-- ============================================================
-- 7. Trigger: auto-generar qr_token al insertar mozo si no viene
-- ============================================================
CREATE OR REPLACE FUNCTION ensure_waiter_qr_token()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.qr_token IS NULL THEN
    NEW.qr_token := generate_mozopro_token();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ensure_waiter_qr_token ON waiters;
CREATE TRIGGER trg_ensure_waiter_qr_token
  BEFORE INSERT ON waiters
  FOR EACH ROW
  EXECUTE FUNCTION ensure_waiter_qr_token();

-- ============================================================
-- 8. Backfill: mozos existentes sin qr_token
-- ============================================================
UPDATE waiters
SET qr_token = generate_mozopro_token()
WHERE qr_token IS NULL;

-- RAISE NOTICE solo puede usarse dentro de un bloque PL/pgSQL (DO $$)
DO $$
BEGIN
  RAISE NOTICE '✅ Backfill de qr_token completado para mozos existentes';
END $$;

-- ============================================================
-- 9. Row Level Security (RLS)
-- ============================================================

-- branches
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "branches_owner_all" ON branches;
CREATE POLICY "branches_owner_all" ON branches
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- tables
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tables_owner_all" ON tables;
CREATE POLICY "tables_owner_all" ON tables
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- waiters
ALTER TABLE waiters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "waiters_owner_all" ON waiters;
CREATE POLICY "waiters_owner_all" ON waiters
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- ============================================================
-- 10. Comentarios para documentación
-- ============================================================
COMMENT ON TABLE branches IS 'Sucursales del restaurante — plan Full (multi-sucursal)';
COMMENT ON TABLE tables IS 'Mesas del restaurante — plan Premium+ (límites: Free=0, Pro=0, Premium=50, Full=∞)';
COMMENT ON TABLE waiters IS 'Mozos/asociados — plan Premium+ (límites: Free=0, Pro=0, Premium=20, Full=∞)';
COMMENT ON COLUMN waiters.qr_token IS 'Token único para acceso al panel móvil del mozo (/mozo/[token]) sin login';
COMMENT ON COLUMN waiters.pin IS 'PIN numérico (4-6 dígitos) para login rápido en POS';
COMMENT ON COLUMN tables.qr_token IS 'Token único para QR específico de mesa (futuro)';
COMMENT ON FUNCTION generate_mozopro_token IS 'Genera un token aleatorio hex de 48 chars para QR tokens';
COMMENT ON FUNCTION ensure_waiter_qr_token IS 'Trigger function: auto-genera qr_token al insertar mozo';

-- ============================================================
-- 11. Verificación final — mostrar estado
-- ============================================================
DO $$
DECLARE
  waiters_count INT;
  tables_count INT;
  waiters_with_token INT;
BEGIN
  SELECT COUNT(*) INTO waiters_count FROM waiters;
  SELECT COUNT(*) INTO tables_count FROM tables;
  SELECT COUNT(*) INTO waiters_with_token FROM waiters WHERE qr_token IS NOT NULL;

  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE '✅ Migración completada exitosamente';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE 'Mozos totales: %', waiters_count;
  RAISE NOTICE 'Mozos con QR token: %', waiters_with_token;
  RAISE NOTICE 'Mesas totales: %', tables_count;
  RAISE NOTICE 'RLS habilitado en: branches, tables, waiters';
  RAISE NOTICE 'Trigger trg_ensure_waiter_qr_token: activo';
  RAISE NOTICE '═══════════════════════════════════════════════════';
END $$;
