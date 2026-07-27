# CitasPro — Guía de Setup Supabase

Guía paso a paso para conectar CitasPro con Supabase (producción).

---

## Paso 1 — Crear proyecto en Supabase (5 minutos)

1. Ve a https://supabase.com y crea una cuenta (o inicia sesión)
2. Click en **"New Project"**
3. Completa:
   - **Name:** `citaspro-prod`
   - **Database Password:** genera una fuerte y guárdala en 1Password / Bitwarden
   - **Region:** **São Paulo (sa-east-1)** ← importante para latencia desde Perú
   - **Pricing Plan:** Free (suficiente para empezar)
4. Espera 2-3 minutos a que se aprovisione el proyecto

---

## Paso 2 — Obtener credenciales

En el dashboard de Supabase, ve a **Settings → API** y copia:

| Variable | Dónde está |
|----------|------------|
| `Project URL` | Settings → API → Project URL |
| `anon public` key | Settings → API → Project API keys |
| `service_role` key | Settings → API → Project API keys (¡trátala como contraseña!) |
| `Database connection string` (Pooler) | Settings → Database → Connection string → Transaction pooler |
| `Database connection string` (Direct) | Settings → Database → Connection string → Session pooler |

---

## Paso 3 — Aplicar schema y RLS

Tienes **dos opciones** para aplicar las tablas:

### Opción A — Con Supabase CLI (recomendada)

```bash
# Instala CLI (Linux/macOS)
brew install supabase/tap/supabase
# o
npm install -g supabase

# Login
supabase login

# Link al proyecto remoto (te pedirá el project ref y access token)
supabase link --project-ref TU-PROJECT-REF

# Aplicar schema (tablas + triggers)
supabase db push

# Aplicar RLS policies (separadas para revisión)
# Pega el contenido de supabase/rls-policies.sql en:
# Dashboard → SQL Editor → New query → Run
```

### Opción B — Solo Dashboard (sin CLI)

1. Ve a **Dashboard → SQL Editor → New query**
2. Copia y pega TODO el contenido de `supabase/schema.sql` → **Run**
3. Crea otra query, copia y pega TODO el contenido de `supabase/rls-policies.sql` → **Run**
4. Verifica con: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`

Deberías ver 16 tablas: User, Clinic, ClinicMember, Specialty, Service, Doctor, DoctorSchedule, Patient, Appointment, Interconsult, Payment, CashSession, CashExpense, Medication, PatientFile, AuditLog.

---

## Paso 4 — Configurar Auth en Supabase

En el dashboard, ve a **Authentication → Providers**:

1. **Email** → asegurarse de que esté **Enabled**
2. (Opcional futuro) **Google** → configurar OAuth para login con Google:
   - Crea un OAuth Client en Google Cloud Console
   - Redirect URL: `https://TU-PROJECT-REF.supabase.co/auth/v1/callback`
   - Copia client ID y secret a Supabase

En **Authentication → URL Configuration**:
- **Site URL:** `http://localhost:3000` (dev) o `https://citas-medicas.vercel.app` (prod)
- **Redirect URLs:** añade ambas URLs + `https://citas-medicas.vercel.app/auth/callback`

---

## Paso 5 — Configurar variables de entorno

### Local (`.env.local`)

```bash
# Copia el template
cp .env.example .env.local

# Edita con tus valores reales
nano .env.local
```

Completa todas las variables con los valores del Paso 2.

### Vercel (producción)

1. Ve a tu proyecto en Vercel → **Settings → Environment Variables**
2. Añade las mismas variables del `.env.local`
3. Cambia `NEXT_PUBLIC_APP_URL` a tu dominio real (ej: `https://citas-medicas.vercel.app`)
4. En Supabase: actualiza **Site URL** y **Redirect URLs** con tu dominio Vercel

---

## Paso 6 — Generar cliente Prisma

```bash
bun run db:generate
```

Esto crea `node_modules/.prisma/client` con los tipos TypeScript basados en el schema de Postgres.

---

## Paso 7 — Verificar

```bash
# Build de producción
bun run build

# Iniciar en local (necesitas .env.local configurado)
bun run dev
```

Abre http://localhost:3000 y prueba:
1. Regístrate con un email nuevo → debería crear usuario en Supabase Auth + fila en tabla User + Clinic + Specialty + Service
2. Inicia sesión → debería autenticar vía Supabase Auth
3. Ve al dashboard → debería mostrar las stats de la nueva clínica (vacías)

Para verificar en Supabase Dashboard:
- **Authentication → Users:** deberías ver el usuario creado
- **Table Editor → User:** debería tener una fila con `supabase_uid` coincidente
- **Table Editor → Clinic:** debería tener la clínica recién creada

---

## Estructura de archivos Supabase

```
supabase/
├── config.toml           # Configuración CLI (region, puertos, etc)
├── schema.sql            # 16 tablas + índices + triggers + buckets
├── rls-policies.sql      # Row Level Security por clinic_id
└── seed.sql              # Verificación (no inserta datos reales)

src/lib/supabase/
├── server.ts             # Cliente para Server Components / Route Handlers
├── client.ts             # Cliente para Client Components
├── middleware.ts         # Cliente para middleware (Edge runtime)
└── database.types.ts     # Tipos TypeScript de las tablas
```

---

## Cómo funciona la seguridad multi-tenant

CitasPro tiene **3 capas de seguridad** para datos médicos:

### Capa 1: Auth (Supabase)
- Solo usuarios autenticados pueden hacer requests
- Middleware (`src/middleware.ts`) bloquea rutas privadas si no hay sesión
- Sesión expira automáticamente y se refresca

### Capa 2: App-level (Prisma + código)
- Todas las consultas Prisma filtran por `clinicId` del usuario actual
- Si un usuario de Clínica A intenta acceder a datos de Clínica B, el query simplemente no los devuelve

### Capa 3: DB-level (RLS) ← la más importante
- Aunque el código tenga un bug y olvide filtrar por `clinicId`, **la base de datos bloquea el acceso**
- Cada tabla tiene policies: `clinic_id = ANY(current_user_clinic_ids())`
- Un usuario solo puede ver/editar datos de clínicas donde es owner o miembro aceptado
- Para datos médicos (cumplimiento Ley 29733 Perú), esto es crítico

---

## Migración desde SQLite (datos existentes)

Si tienes datos en `db/custom.db` (SQLite) que quieres migrar a Supabase:

```bash
# 1. Exporta datos de SQLite a JSON
bun run scripts/export-sqlite-to-json.ts

# 2. Importa a Postgres vía Prisma
bun run scripts/import-json-to-postgres.ts
```

**Nota:** Por ahora no hay datos críticos en SQLite (solo 1 usuario demo). Recomendado: empezar limpio en Supabase y registrar el primer usuario real desde la UI.

---

## Troubleshooting

### Error: `relation "User" does not exist`
- Asegúrate de haber corrido `supabase/schema.sql` completo
- Verifica con: `SELECT count(*) FROM "User";`

### Error: `JWT secret not set`
- Revisa que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén en `.env.local`
- Reinicia `bun run dev` después de editar `.env.local`

### Error: `Row Level Security bloquea INSERT`
- Verifica que el trigger `trg_on_auth_user_created` esté creado (está en schema.sql)
- El trigger crea el perfil automáticamente cuando un usuario se registra en Supabase Auth
- Sin el perfil, `current_user_clinic_ids()` devuelve array vacío y RLS bloquea todo

### No aparece el usuario en tabla User tras registro
- El trigger `trg_on_auth_user_created` debería crearlo automáticamente
- Si no se crea, la ruta `/api/auth/register` tiene un fallback con `db.user.upsert()`
- Verifica en Supabase Dashboard → Authentication → Users que el usuario exista
- Si existe ahí pero no en tabla User, ejecuta manualmente el trigger SQL de schema.sql

### Latencia alta desde Perú
- Verifica que la región del proyecto sea **São Paulo (sa-east-1)**
- Si está en US East, puedes migrar creando un nuevo proyecto en São Paulo y re-aplicando el schema

---

## Próximos pasos

Una vez funcionando Supabase en local:

1. Desplegar en Vercel → las variables de entorno ya estarán listas
2. Configurar OAuth con Google (opcional, para login social)
3. Configurar MercadoPago webhooks a tu URL de Vercel
4. Activar backups diarios (Supabase Free los hace, Pro más frecuentes)
5. Configurar Sentry / Vercel Analytics para monitoreo

---

¿Dudas? Revisa el código en `src/lib/supabase/` o consulta la [documentación oficial de Supabase](https://supabase.com/docs).
