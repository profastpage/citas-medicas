# CitasPro — Sistema de citas médicas SaaS

Sistema moderno de gestión de citas médicas para clínicas y consultorios peruanos.
Multi-tenant, con suscripciones mensuales vía MercadoPago, desplegado en Vercel.

Construido por **FastPagePro** sobre la arquitectura SaaS de MenuPro, integrando
el dominio médico (pacientes, médicos, citas, horarios, historia clínica, caja,
inventario, auditoría) de sistemas PHP comprados.

## Stack

- **Next.js 16** + React 19 + TypeScript 5
- **Tailwind CSS 4** + shadcn/ui (40+ Radix components)
- **Prisma ORM** + **Supabase** (Postgres + Auth + RLS + Storage)
- **MercadoPago** PreApproval subscriptions + webhooks
- **next-themes** para modo claro/oscuro (claro por defecto)
- **Framer Motion** + **Sonner** toasts + PWA support

## Planes

| Plan   | Precio     | Límites principales                                   |
| ------ | ---------- | ---------------------------------------------------- |
| Free   | S/ 0/mes   | 1 médico · 50 pacientes · 100 citas/mes              |
| Pro    | S/ 50/mes  | 3 médicos · 500 pacientes · 1,000 citas/mes + caja   |
| Premium| S/ 99/mes  | 10 médicos · 2,000 pacientes · 5,000 citas/mes + reportes |
| Full   | S/ 199/mes | Médicos ilimitados · todo ilimitado + multi-sucursal |

Sin comisiones por cita.

## Estructura

```
src/
├── app/
│   ├── (auth)/                 # login, register
│   ├── dashboard/              # panel principal
│   │   ├── citas/              # gestión de citas
│   │   ├── pacientes/          # fichero de pacientes
│   │   ├── medicos/            # médicos y especialidades
│   │   ├── servicios/          # catálogo de servicios
│   │   ├── caja/               # apertura/cierre, cobros, gastos
│   │   ├── inventario/         # medicamentos e insumos
│   │   ├── reportes/           # reportes avanzados
│   │   ├── auditoria/          # bitácora de cambios
│   │   ├── clinica/            # configuración de la clínica
│   │   ├── equipo/             # gestión de equipo y roles
│   │   └── billing/            # planes y suscripción
│   ├── superadmin/             # panel multi-cliente (FastPagePro)
│   └── api/                    # API routes (REST)
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   ├── dashboard/              # dashboard shell, sidebar
│   ├── theme-provider.tsx      # next-themes wrapper (light by default)
│   └── theme-toggle.tsx        # Sun/Moon dropdown
├── lib/
│   ├── plans.ts                # configuración de planes
│   ├── db.ts                   # cliente Prisma
│   └── auth.ts                 # helpers de auth
└── middleware.ts               # protección de rutas + org resolution
```

## Tema claro/oscuro

- **Claro por defecto** — las clínicas son entornos luminosos y profesionales.
- Toggle Sun/Moon en el header del dashboard (junto a la corona del plan).
- Preferencia persistida en `localStorage` vía `next-themes`.
- Modo oscuro disponible para turnos nocturnos o salas con poca luz.

## Desarrollo

```bash
bun install
bun run dev      # http://localhost:3000
bun run build    # producción
bun run start    # servir build
```

## Despliegue

- **Vercel** (auto-deploy desde `main`)
- Variables de entorno requeridas:
  - `DATABASE_URL` (Supabase Postgres pooler)
  - `MERCADEPAGO_ACCESS_TOKEN`
  - `MERCADEPAGO_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_APP_URL`

---

© 2025 FastPagePro · Hecho en Perú
