-- ============================================================
-- FIX — Agregar qr_token a waiters para vista móvil de mozos
-- ============================================================
-- El panel móvil del mozo (/mozo/[token]) requiere un token único
-- por mozo para autenticar sin login (QR escaneado por el mozo).
-- También agregamos pin (ya existe en schema pero lo garantizamos).
-- ============================================================

-- 1) Agregar qr_token a waiters si no existe
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

-- 2) Generar tokens para waiters existentes que no tengan uno
UPDATE waiters
SET qr_token = 'wt-' || replace(gen_random_uuid()::text, '-', '')
WHERE qr_token IS NULL;

-- 3) Crear función trigger para auto-generar qr_token en INSERT
CREATE OR REPLACE FUNCTION set_waiter_qr_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qr_token IS NULL THEN
    NEW.qr_token := 'wt-' || replace(gen_random_uuid()::text, '-', '');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_waiter_qr_token ON waiters;
CREATE TRIGGER trg_waiter_qr_token
  BEFORE INSERT ON waiters
  FOR EACH ROW
  EXECUTE FUNCTION set_waiter_qr_token();

-- 4) Índice para búsquedas rápidas por token
CREATE INDEX IF NOT EXISTS idx_waiters_qr_token ON waiters(qr_token) WHERE qr_token IS NOT NULL;

-- 5) Verificación
DO $$
DECLARE
  total_waiters INT;
  con_token INT;
BEGIN
  SELECT COUNT(*) INTO total_waiters FROM waiters;
  SELECT COUNT(*) INTO con_token FROM waiters WHERE qr_token IS NOT NULL;

  RAISE NOTICE '✅ Total mozos: %', total_waiters;
  RAISE NOTICE '✅ Mozos con token: %', con_token;
  RAISE NOTICE '✅ Trigger trg_waiter_qr_token creado';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Ahora cada mozo tiene un QR token accesible en /mozo/{qr_token}';
END $$;
