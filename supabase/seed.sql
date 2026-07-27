-- ============================================================
-- CitasPro SaaS — Seed (datos demo / configuración base)
-- ============================================================
-- NO crear usuarios demo aquí (Supabase Auth maneja eso aparte).
-- Este archivo solo inserta datos de catálogo que aplican a TODAS
-- las clínicas nuevas cuando se registran.
--
-- En producción, este seed se ejecuta automáticamente desde
-- src/app/api/auth/register/route.ts cuando un nuevo usuario
-- crea su clínica (especialidades y servicios por defecto).
--
-- Ejecutar manualmente solo si quieres precargar datos:
--   supabase db seed
-- ============================================================

-- No hay seed global real porque cada clínica tiene sus propios
-- datos. Las especialidades y servicios por defecto se crean
-- en el momento de registro de cada clínica (ver register route).

-- Para desarrollo, puedes crear datos demo ejecutando:
--   psql -f supabase/seed-dev.sql  (crear este archivo si se necesita)

-- ============================================================
-- Verificación: mostrar tablas creadas (solo info, no modifica)
-- ============================================================
SELECT 'Users' AS tabla, COUNT(*) AS total FROM "User"
UNION ALL SELECT 'Clinics', COUNT(*) FROM "Clinic"
UNION ALL SELECT 'Patients', COUNT(*) FROM "Patient"
UNION ALL SELECT 'Appointments', COUNT(*) FROM "Appointment"
UNION ALL SELECT 'Doctors', COUNT(*) FROM "Doctor"
UNION ALL SELECT 'Specialties', COUNT(*) FROM "Specialty"
UNION ALL SELECT 'Services', COUNT(*) FROM "Service"
UNION ALL SELECT 'Payments', COUNT(*) FROM "Payment"
UNION ALL SELECT 'Medications', COUNT(*) FROM "Medication";
