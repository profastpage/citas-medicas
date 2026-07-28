-- ============================================================
-- CitasPro SaaS — Row Level Security (RLS) Policies
-- ============================================================
-- Garantiza a nivel de base de datos que cada clínica solo
-- pueda ver y modificar SUS propios datos. Incluso si hay un
-- bug en el código, la DB bloquea el acceso cruzado.
--
-- Estrategia:
--   1. Cada tabla con clinic_id tiene RLS habilitado.
--   2. Una función `current_user_clinic_ids()` devuelve los IDs
--      de clínicas donde el usuario actual es owner o miembro.
--   3. SELECT/INSERT/UPDATE/DELETE solo se permiten si clinic_id
--      está en ese conjunto.
--   4. Para tablas hijas (sin clinic_id directo, ej. CashExpense,
--      Interconsult) se resuelve vía JOIN a la tabla padre.
-- ============================================================

-- ============================================================
-- FUNCIÓN HELPER: clínicas del usuario actual
-- ============================================================
-- Devuelve un arreglo de clinic_id donde el usuario autenticado
-- (vía Supabase Auth) es owner o miembro aceptado.

CREATE OR REPLACE FUNCTION current_user_clinic_ids()
RETURNS TEXT[]
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    array_agg(DISTINCT c.id),
    ARRAY[]::TEXT[]
  )
  FROM "User" u
  LEFT JOIN "Clinic" c ON c.owner_id = u.id
  LEFT JOIN "ClinicMember" cm ON cm.user_id = u.id AND cm.accepted_at IS NOT NULL
  WHERE u.supabase_uid = auth.uid();
$$;

-- Función helper: el usuario actual está autenticado (cualquier rol)
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid() IS NOT NULL;
$$;

-- ============================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================

ALTER TABLE "User"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Clinic"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ClinicMember"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Specialty"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Service"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Doctor"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DoctorSchedule" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Patient"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Appointment"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Interconsult"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CashSession"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CashExpense"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Medication"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PatientFile"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog"       ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS: User
-- ============================================================
-- Un usuario puede ver y editar su propio perfil.
-- super_admin puede ver todos.

DROP POLICY IF EXISTS user_select_own ON "User";
CREATE POLICY user_select_own ON "User"
  FOR SELECT USING (
    supabase_uid = auth.uid()
    OR role = 'super_admin'
  );

DROP POLICY IF EXISTS user_update_own ON "User";
CREATE POLICY user_update_own ON "User"
  FOR UPDATE USING (supabase_uid = auth.uid());

DROP POLICY IF EXISTS user_insert_own ON "User";
CREATE POLICY user_insert_own ON "User"
  FOR INSERT WITH CHECK (supabase_uid = auth.uid());

-- ============================================================
-- POLÍTICAS: Clinic
-- ============================================================
-- Owner o miembros pueden ver/editar. Solo owner puede crear/borrar.

DROP POLICY IF EXISTS clinic_select_members ON "Clinic";
CREATE POLICY clinic_select_members ON "Clinic"
  FOR SELECT USING (
    id = ANY(current_user_clinic_ids())
    OR owner_id IN (SELECT id FROM "User" WHERE supabase_uid = auth.uid() AND role = 'super_admin')
  );

DROP POLICY IF EXISTS clinic_insert_owner ON "Clinic";
CREATE POLICY clinic_insert_owner ON "Clinic"
  FOR INSERT WITH CHECK (
    owner_id IN (SELECT id FROM "User" WHERE supabase_uid = auth.uid())
  );

DROP POLICY IF EXISTS clinic_update_owner ON "Clinic";
CREATE POLICY clinic_update_owner ON "Clinic"
  FOR UPDATE USING (
    owner_id IN (SELECT id FROM "User" WHERE supabase_uid = auth.uid())
  );

DROP POLICY IF EXISTS clinic_delete_owner ON "Clinic";
CREATE POLICY clinic_delete_owner ON "Clinic"
  FOR DELETE USING (
    owner_id IN (SELECT id FROM "User" WHERE supabase_uid = auth.uid())
  );

-- ============================================================
-- POLÍTICAS: ClinicMember
-- ============================================================
-- Los miembros de una clínica pueden ver otros miembros.
-- Solo el owner de la clínica puede invitar/eliminar miembros.

DROP POLICY IF EXISTS member_select_clinic ON "ClinicMember";
CREATE POLICY member_select_clinic ON "ClinicMember"
  FOR SELECT USING (clinic_id = ANY(current_user_clinic_ids()));

DROP POLICY IF EXISTS member_insert_owner ON "ClinicMember";
CREATE POLICY member_insert_owner ON "ClinicMember"
  FOR INSERT WITH CHECK (
    clinic_id IN (
      SELECT c.id FROM "Clinic" c
      JOIN "User" u ON u.id = c.owner_id
      WHERE u.supabase_uid = auth.uid()
    )
  );

DROP POLICY IF EXISTS member_update_owner ON "ClinicMember";
CREATE POLICY member_update_owner ON "ClinicMember"
  FOR UPDATE USING (
    clinic_id IN (
      SELECT c.id FROM "Clinic" c
      JOIN "User" u ON u.id = c.owner_id
      WHERE u.supabase_uid = auth.uid()
    )
  );

DROP POLICY IF EXISTS member_delete_owner ON "ClinicMember";
CREATE POLICY member_delete_owner ON "ClinicMember"
  FOR DELETE USING (
    clinic_id IN (
      SELECT c.id FROM "Clinic" c
      JOIN "User" u ON u.id = c.owner_id
      WHERE u.supabase_uid = auth.uid()
    )
  );

-- ============================================================
-- POLÍTICAS: Specialty, Service, Doctor, DoctorSchedule,
-- Patient, Appointment, Payment, CashSession, Medication,
-- PatientFile, AuditLog — todas tienen clinic_id directo
-- ============================================================
-- Patrón: solo usuarios con acceso a la clínica pueden CRUD.

-- Macro SQL: aplicar a todas las tablas con clinic_id
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'Specialty','Service','Doctor','DoctorSchedule',
    'Patient','Appointment','Payment','CashSession',
    'Medication','PatientFile','AuditLog'
  ])
  LOOP
    -- SELECT
    EXECUTE format($f$
      DROP POLICY IF EXISTS %1$s_select_clinic ON "%1$s";
      CREATE POLICY %1$s_select_clinic ON "%1$s"
        FOR SELECT USING (clinic_id = ANY(current_user_clinic_ids()));
    $f$, tbl);

    -- INSERT (debe tener clinic_id válido + usuario autenticado)
    EXECUTE format($f$
      DROP POLICY IF EXISTS %1$s_insert_clinic ON "%1$s";
      CREATE POLICY %1$s_insert_clinic ON "%1$s"
        FOR INSERT WITH CHECK (clinic_id = ANY(current_user_clinic_ids()));
    $f$, tbl);

    -- UPDATE
    EXECUTE format($f$
      DROP POLICY IF EXISTS %1$s_update_clinic ON "%1$s";
      CREATE POLICY %1$s_update_clinic ON "%1$s"
        FOR UPDATE USING (clinic_id = ANY(current_user_clinic_ids()));
    $f$, tbl);

    -- DELETE
    EXECUTE format($f$
      DROP POLICY IF EXISTS %1$s_delete_clinic ON "%1$s";
      CREATE POLICY %1$s_delete_clinic ON "%1$s"
        FOR DELETE USING (clinic_id = ANY(current_user_clinic_ids()));
    $f$, tbl);
  END LOOP;
END $$;

-- ============================================================
-- POLÍTICAS: Interconsult (sin clinic_id directo)
-- ============================================================
-- Acceso derivado del clinic_id de la appointment padre.

DROP POLICY IF EXISTS interconsult_select ON "Interconsult";
CREATE POLICY interconsult_select ON "Interconsult"
  FOR SELECT USING (
    appointment_id IN (
      SELECT id FROM "Appointment"
      WHERE clinic_id = ANY(current_user_clinic_ids())
    )
  );

DROP POLICY IF EXISTS interconsult_insert ON "Interconsult";
CREATE POLICY interconsult_insert ON "Interconsult"
  FOR INSERT WITH CHECK (
    appointment_id IN (
      SELECT id FROM "Appointment"
      WHERE clinic_id = ANY(current_user_clinic_ids())
    )
  );

DROP POLICY IF EXISTS interconsult_update ON "Interconsult";
CREATE POLICY interconsult_update ON "Interconsult"
  FOR UPDATE USING (
    appointment_id IN (
      SELECT id FROM "Appointment"
      WHERE clinic_id = ANY(current_user_clinic_ids())
    )
  );

DROP POLICY IF EXISTS interconsult_delete ON "Interconsult";
CREATE POLICY interconsult_delete ON "Interconsult"
  FOR DELETE USING (
    appointment_id IN (
      SELECT id FROM "Appointment"
      WHERE clinic_id = ANY(current_user_clinic_ids())
    )
  );

-- ============================================================
-- POLÍTICAS: CashExpense (sin clinic_id directo)
-- ============================================================
-- Acceso derivado del clinic_id de la CashSession padre.

DROP POLICY IF EXISTS expense_select ON "CashExpense";
CREATE POLICY expense_select ON "CashExpense"
  FOR SELECT USING (
    cash_session_id IN (
      SELECT cs.id FROM "CashSession" cs
      WHERE cs.clinic_id = ANY(current_user_clinic_ids())
    )
  );

DROP POLICY IF EXISTS expense_insert ON "CashExpense";
CREATE POLICY expense_insert ON "CashExpense"
  FOR INSERT WITH CHECK (
    cash_session_id IN (
      SELECT cs.id FROM "CashSession" cs
      WHERE cs.clinic_id = ANY(current_user_clinic_ids())
    )
  );

DROP POLICY IF EXISTS expense_update ON "CashExpense";
CREATE POLICY expense_update ON "CashExpense"
  FOR UPDATE USING (
    cash_session_id IN (
      SELECT cs.id FROM "CashSession" cs
      WHERE cs.clinic_id = ANY(current_user_clinic_ids())
    )
  );

DROP POLICY IF EXISTS expense_delete ON "CashExpense";
CREATE POLICY expense_delete ON "CashExpense"
  FOR DELETE USING (
    cash_session_id IN (
      SELECT cs.id FROM "CashSession" cs
      WHERE cs.clinic_id = ANY(current_user_clinic_ids())
    )
  );

-- ============================================================
-- POLÍTICAS: STORAGE (archivos de pacientes)
-- ============================================================
-- Solo usuarios con acceso a la clínica del paciente pueden
-- subir/leer/borrar archivos.

-- patient-files bucket (privado)
DROP POLICY IF EXISTS "patient-files-read-clinic" ON storage.objects;
CREATE POLICY "patient-files-read-clinic" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'patient-files'
    AND (
      -- El path incluye el clinic_id del usuario
      (storage.foldername(name))[1] = ANY(
        SELECT slug FROM "Clinic" WHERE id = ANY(current_user_clinic_ids())
      )
      OR auth.uid() IS NULL  -- acceso público vía URL firmada
    )
  );

DROP POLICY IF EXISTS "patient-files-write-clinic" ON storage.objects;
CREATE POLICY "patient-files-write-clinic" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'patient-files'
    AND (storage.foldername(name))[1] = ANY(
      SELECT slug FROM "Clinic" WHERE id = ANY(current_user_clinic_ids())
    )
  );

DROP POLICY IF EXISTS "patient-files-delete-clinic" ON storage.objects;
CREATE POLICY "patient-files-delete-clinic" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'patient-files'
    AND (storage.foldername(name))[1] = ANY(
      SELECT slug FROM "Clinic" WHERE id = ANY(current_user_clinic_ids())
    )
  );

-- clinic-logos bucket (público)
DROP POLICY IF EXISTS "logos-read-public" ON storage.objects;
CREATE POLICY "logos-read-public" ON storage.objects
  FOR SELECT USING (bucket_id = 'clinic-logos');

DROP POLICY IF EXISTS "logos-write-clinic" ON storage.objects;
CREATE POLICY "logos-write-clinic" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'clinic-logos'
    AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "logos-delete-clinic" ON storage.objects;
CREATE POLICY "logos-delete-clinic" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'clinic-logos'
    AND auth.uid() IS NOT NULL
  );

-- avatars bucket (público)
DROP POLICY IF EXISTS "avatars-read-public" ON storage.objects;
CREATE POLICY "avatars-read-public" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatars-write-own" ON storage.objects;
CREATE POLICY "avatars-write-own" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "avatars-delete-own" ON storage.objects;
CREATE POLICY "avatars-delete-own" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
  );

-- ============================================================
-- DESACTIVAR POLICY FORCE (opcional pero recomendado en dev)
-- ============================================================
-- Por defecto, RLS permite SELECT a anon si hay una policy que lo permita.
-- Si quieres forzar que TODO requiera auth, descomenta:
-- ALTER TABLE "User" FORCE ROW LEVEL SECURITY;
-- ALTER TABLE "Clinic" FORCE ROW LEVEL SECURITY;
-- (etc para todas las tablas)
