-- ============================================================
-- CitasPro SaaS — Esquema completo PostgreSQL para Supabase
-- ============================================================
-- Ejecutar con:  supabase db push
-- O pegar en:    Supabase Dashboard → SQL Editor → New query
--
-- Convención: snake_case (Postgres nativo). Prisma mapea
-- automáticamente entre PascalCase (TS) y snake_case (DB).
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLAS CORE SAAS
-- ============================================================

-- ── Users ──
-- El auth real está en auth.users (gestionado por Supabase Auth).
-- Esta tabla es el PERFIL DE NEGOCIO del usuario (plan, rol, etc).
-- Se sincroniza con auth.users vía trigger (ver más abajo).
CREATE TABLE IF NOT EXISTS "User" (
  id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  supabase_uid        UUID UNIQUE NOT NULL,
  email               TEXT UNIQUE NOT NULL,
  password_hash       TEXT NOT NULL DEFAULT '',
  full_name           TEXT NOT NULL,
  phone               TEXT,
  avatar_url          TEXT,
  role                TEXT NOT NULL DEFAULT 'owner',
  plan                TEXT NOT NULL DEFAULT 'free',
  mp_preapproval_id   TEXT,
  mp_status           TEXT,
  current_period_end  TIMESTAMPTZ,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_user_supabase_uid ON "User"(supabase_uid);

-- ── Clinics ──
CREATE TABLE IF NOT EXISTS "Clinic" (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  owner_id        TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  ruc             TEXT,
  address         TEXT,
  phone           TEXT,
  email           TEXT,
  logo_url        TEXT,
  currency        TEXT NOT NULL DEFAULT 'S/',
  theme_color     TEXT NOT NULL DEFAULT '#0ea5e9',
  branding_text   TEXT NOT NULL DEFAULT 'Gestionado con CitasPro',
  is_white_label  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_clinic_owner ON "Clinic"(owner_id);

-- ── Clinic Members (roles multi-clínica) ──
CREATE TABLE IF NOT EXISTS "ClinicMember" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id     TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  clinic_id   TEXT NOT NULL REFERENCES "Clinic"(id) ON DELETE CASCADE,
  role        TEXT NOT NULL,
  invited_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(user_id, clinic_id)
);
CREATE INDEX IF NOT EXISTS idx_clinic_member_clinic ON "ClinicMember"(clinic_id);

-- ============================================================
-- DOMINIO MÉDICO
-- ============================================================

-- ── Specialties ──
CREATE TABLE IF NOT EXISTS "Specialty" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clinic_id   TEXT NOT NULL REFERENCES "Clinic"(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(clinic_id, name)
);
CREATE INDEX IF NOT EXISTS idx_specialty_clinic ON "Specialty"(clinic_id);

-- ── Services ──
CREATE TABLE IF NOT EXISTS "Service" (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clinic_id    TEXT NOT NULL REFERENCES "Clinic"(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  price        DOUBLE PRECISION NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 30,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(clinic_id, name)
);
CREATE INDEX IF NOT EXISTS idx_service_clinic ON "Service"(clinic_id);

-- ── Doctors ──
CREATE TABLE IF NOT EXISTS "Doctor" (
  id                 TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clinic_id          TEXT NOT NULL REFERENCES "Clinic"(id) ON DELETE CASCADE,
  user_id            TEXT REFERENCES "User"(id) ON DELETE SET NULL,
  specialty_id       TEXT NOT NULL REFERENCES "Specialty"(id) ON DELETE CASCADE,
  full_name          TEXT NOT NULL,
  document_id        TEXT,
  colegiatura        TEXT,
  phone              TEXT,
  email              TEXT,
  bio                TEXT,
  consultation_price DOUBLE PRECISION,
  is_active          BOOLEAN NOT NULL DEFAULT true,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_doctor_clinic ON "Doctor"(clinic_id);
CREATE INDEX IF NOT EXISTS idx_doctor_specialty ON "Doctor"(specialty_id);

-- ── Doctor Schedules ──
CREATE TABLE IF NOT EXISTS "DoctorSchedule" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clinic_id     TEXT NOT NULL REFERENCES "Clinic"(id) ON DELETE CASCADE,
  doctor_id     TEXT NOT NULL REFERENCES "Doctor"(id) ON DELETE CASCADE,
  day_of_week   TEXT NOT NULL,
  specific_date TIMESTAMPTZ,
  start_time    TEXT NOT NULL,
  end_time      TEXT NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_schedule_doctor_dow ON "DoctorSchedule"(doctor_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_schedule_clinic ON "DoctorSchedule"(clinic_id);

-- ── Patients ──
CREATE TABLE IF NOT EXISTS "Patient" (
  id                    TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clinic_id             TEXT NOT NULL REFERENCES "Clinic"(id) ON DELETE CASCADE,
  first_name            TEXT NOT NULL,
  last_name             TEXT NOT NULL,
  full_name             TEXT NOT NULL,
  document_type         TEXT,
  document_id           TEXT,
  birth_date            TIMESTAMPTZ,
  sex                   TEXT,
  phone                 TEXT,
  email                 TEXT,
  address               TEXT,
  blood_type            TEXT,
  allergies             TEXT,
  chronic_conditions    TEXT,
  medical_history       TEXT,
  emergency_contact     TEXT,
  emergency_phone       TEXT,
  medical_record_number TEXT,
  notes                 TEXT,
  is_active             BOOLEAN NOT NULL DEFAULT true,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_patient_clinic ON "Patient"(clinic_id);
CREATE INDEX IF NOT EXISTS idx_patient_clinic_doc ON "Patient"(clinic_id, document_id);
CREATE INDEX IF NOT EXISTS idx_patient_clinic_lastname ON "Patient"(clinic_id, last_name);

-- ── Appointments (cita médica + historia clínica) ──
CREATE TABLE IF NOT EXISTS "Appointment" (
  id                          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clinic_id                   TEXT NOT NULL REFERENCES "Clinic"(id) ON DELETE CASCADE,
  patient_id                  TEXT NOT NULL REFERENCES "Patient"(id) ON DELETE CASCADE,
  doctor_id                   TEXT NOT NULL REFERENCES "Doctor"(id) ON DELETE CASCADE,
  service_id                  TEXT REFERENCES "Service"(id) ON DELETE SET NULL,
  appointment_date            TIMESTAMPTZ NOT NULL,
  duration_min                INTEGER NOT NULL DEFAULT 30,
  reason                      TEXT,
  status                      TEXT NOT NULL DEFAULT 'pendiente',
  notes                       TEXT,
  -- Signos vitales
  weight                      DOUBLE PRECISION,
  height                      DOUBLE PRECISION,
  temperature                 DOUBLE PRECISION,
  blood_pressure              TEXT,
  heart_rate                  TEXT,
  respiratory_rate            TEXT,
  oxygen_saturation           TEXT,
  -- Historia clínica
  illness_duration            TEXT,
  current_illness             TEXT,
  background                  TEXT,
  physical_exam               TEXT,
  auxiliary_exams             TEXT,
  diagnosis                   TEXT,
  treatment                   TEXT,
  prescription                TEXT,
  rest_days                   INTEGER NOT NULL DEFAULT 0,
  rest_end_date               TIMESTAMPTZ,
  follow_up_date              TIMESTAMPTZ,
  interconsult_specialty_id   TEXT,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_appointment_clinic_date ON "Appointment"(clinic_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointment_doctor_date ON "Appointment"(doctor_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointment_patient ON "Appointment"(patient_id);

-- ── Interconsults ──
CREATE TABLE IF NOT EXISTS "Interconsult" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  appointment_id TEXT NOT NULL REFERENCES "Appointment"(id) ON DELETE CASCADE,
  specialty_id  TEXT NOT NULL REFERENCES "Specialty"(id) ON DELETE CASCADE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_interconsult_appointment ON "Interconsult"(appointment_id);
CREATE INDEX IF NOT EXISTS idx_interconsult_specialty ON "Interconsult"(specialty_id);

-- ============================================================
-- CAJA Y PAGOS
-- ============================================================

-- ── Payments ──
CREATE TABLE IF NOT EXISTS "Payment" (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clinic_id     TEXT NOT NULL REFERENCES "Clinic"(id) ON DELETE CASCADE,
  appointment_id TEXT NOT NULL REFERENCES "Appointment"(id) ON DELETE CASCADE,
  amount        DOUBLE PRECISION NOT NULL,
  method        TEXT NOT NULL,
  reference     TEXT,
  notes         TEXT,
  payment_date  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payment_clinic_date ON "Payment"(clinic_id, payment_date);
CREATE INDEX IF NOT EXISTS idx_payment_appointment ON "Payment"(appointment_id);

-- ── Cash Sessions ──
CREATE TABLE IF NOT EXISTS "CashSession" (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clinic_id         TEXT NOT NULL REFERENCES "Clinic"(id) ON DELETE CASCADE,
  opened_by_user_id TEXT NOT NULL,
  opening_amount    DOUBLE PRECISION NOT NULL DEFAULT 0,
  closing_amount    DOUBLE PRECISION,
  opened_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at         TIMESTAMPTZ,
  status            TEXT NOT NULL DEFAULT 'abierta',
  notes             TEXT
);
CREATE INDEX IF NOT EXISTS idx_cash_clinic_status ON "CashSession"(clinic_id, status);

-- ── Cash Expenses ──
CREATE TABLE IF NOT EXISTS "CashExpense" (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cash_session_id TEXT NOT NULL REFERENCES "CashSession"(id) ON DELETE CASCADE,
  description    TEXT NOT NULL,
  amount         DOUBLE PRECISION NOT NULL,
  expense_date   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_expense_session ON "CashExpense"(cash_session_id);

-- ============================================================
-- INVENTARIO MÉDICO
-- ============================================================

CREATE TABLE IF NOT EXISTS "Medication" (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clinic_id       TEXT NOT NULL REFERENCES "Clinic"(id) ON DELETE CASCADE,
  commercial_name TEXT NOT NULL,
  generic_name    TEXT,
  presentation    TEXT,
  stock           INTEGER NOT NULL DEFAULT 0,
  min_stock       INTEGER NOT NULL DEFAULT 5,
  unit_price      DOUBLE PRECISION,
  expiry_date     TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_medication_clinic_name ON "Medication"(clinic_id, commercial_name);

-- ============================================================
-- ARCHIVOS ADJUNTOS DE PACIENTES
-- ============================================================

CREATE TABLE IF NOT EXISTS "PatientFile" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clinic_id   TEXT NOT NULL REFERENCES "Clinic"(id) ON DELETE CASCADE,
  patient_id  TEXT NOT NULL REFERENCES "Patient"(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_type   TEXT,
  file_size   INTEGER,
  description TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_file_patient ON "PatientFile"(patient_id);
CREATE INDEX IF NOT EXISTS idx_file_clinic ON "PatientFile"(clinic_id);

-- ============================================================
-- AUDITORÍA
-- ============================================================

CREATE TABLE IF NOT EXISTS "AuditLog" (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clinic_id   TEXT REFERENCES "Clinic"(id) ON DELETE SET NULL,
  user_id     TEXT REFERENCES "User"(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  entity      TEXT,
  entity_id   TEXT,
  description TEXT,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_clinic_date ON "AuditLog"(clinic_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_user ON "AuditLog"(user_id);

-- ============================================================
-- TRIGGER: updated_at automático
-- ============================================================

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['User','Clinic','Patient','Appointment','Medication'])
  LOOP
    EXECUTE format($f$
      DROP TRIGGER IF EXISTS trg_%s_updated_at ON "%s";
      CREATE TRIGGER trg_%s_updated_at
        BEFORE UPDATE ON "%s"
        FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
    $f$, t, t, t, t);
  END LOOP;
END $$;

-- ============================================================
-- TRIGGER: Crear perfil en "User" cuando un usuario se registra
-- en Supabase Auth (auth.users). Esto sincroniza auth → perfil de negocio.
-- ============================================================

CREATE OR REPLACE FUNCTION fn_handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "User" (supabase_uid, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (supabase_uid) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION fn_handle_new_auth_user();

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Bucket para archivos de pacientes (PDFs, imágenes de lesiones, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-files', 'patient-files', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket para logos de clínicas (público para mostrar en página pública)
INSERT INTO storage.buckets (id, name, public)
VALUES ('clinic-logos', 'clinic-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket para avatares de usuarios
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
