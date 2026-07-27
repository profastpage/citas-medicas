# MenuPro — Cartas digitales premium para restaurantes

SaaS MVP para que restaurantes creen su carta digital con carrito, integración con WhatsApp, código QR y diseño ultra premium. Construido con Next.js 16, Supabase y MercadoPago.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![Supabase](https://img.shields.io/badge/Supabase-Postgres+Auth+Storage-green) ![MercadoPago](https://img.shields.io/badge/MercadoPago-Checkout_Pro-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## Funcionalidades

- **Landing page premium** con animaciones (Framer Motion), mockup animado, pricing y FAQ.
- **Auth** email+password y Google OAuth (Supabase Auth).
- **Dashboard** con tarjetas de menús, contador de vistas y badge de plan.
- **Editor visual** en vivo (iframe preview) con auto-guardado cada 3s:
  - Logo (drag & drop / file picker / URL) con compresión canvas
  - Categorías y platos dinámicos con thumbnails
  - Color de acento, moneda, slogan, WhatsApp
- **Menú público** servido en `/r/[slug]` — HTML autocontenido, premium dark theme.
  - Carrito con badge animado
  - Botón WhatsApp con mensaje pre-formateado
  - Reveal animado con IntersectionObserver
- **Código QR** (Pro) — PNG 1024×1024 + SVG descargables.
- **Planes**:
  - **Free**: 1 menú, 15 platos, 5 imágenes, branding MenuPro, sin QR
  - **Pro (S/35/mes ≈ $9 USD)**: menús y platos ilimitados, 30 imágenes, sin branding, QR
- **Pagos** vía MercadoPago Checkout Pro (suscripción mensual) + Webhooks.
- **Row Level Security** en todas las tablas de Supabase.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Auth | Supabase Auth (email+pass, Google OAuth) |
| DB | Supabase Postgres (RLS habilitado) |
| Storage | Supabase Storage (bucket público `menus`) |
| Pagos | MercadoPago (Checkout Pro + Subscriptions + Webhooks) |
| QR | `qrcode` (Node) |
| Hosting | Vercel |

---

## Estructura

```
src/
├── app/
│   ├── (auth)/            # Login + Register con split layout
│   ├── api/
│   │   ├── auth/logout/
│   │   ├── menus/         # CRUD con límites de plan
│   │   ├── mercadopago/   # checkout, cancel, webhook
│   │   └── upload/        # Subida a Supabase Storage
│   ├── dashboard/
│   │   ├── [menuId]/      # Editor + sub-página QR
│   │   ├── billing/       # Planes + MercadoPago
│   │   └── dashboard-client.tsx
│   ├── r/[slug]/          # Menú público SSR
│   ├── auth/callback/     # OAuth callback
│   └── page.tsx           # Landing
├── components/
│   ├── landing/           # hero, features, pricing, faq, footer
│   └── ui/                # shadcn/ui
└── lib/
    ├── supabase/          # client, server, middleware
    ├── mercadopago.ts     # Cliente MP (lazy-init) + helpers
    ├── plans.ts           # Definición de planes + límites
    └── menu-utils.ts      # Helpers de menú

supabase/
└── schema.sql             # Tablas, RLS, triggers, storage policies

download/
├── generador.html         # Generador standalone (sin auth)
└── menu-ejemplo.html      # Ejemplo de menú generado

SETUP.md                   # Guía de despliegue (~30 min)
```

---

## Puesta en marcha (local)

```bash
# 1. Instalar dependencias
bun install   # o npm install

# 2. Configurar env vars
cp .env.example .env.local
# Edita .env.local con tus credenciales reales

# 3. Aplicar schema SQL en Supabase
# Copia el contenido de supabase/schema.sql y ejecútalo en SQL Editor

# 4. Levantar el dev server
bun dev
# Abre http://localhost:3000
```

Para producción en Vercel + Supabase + MercadoPago, sigue la guía completa en **`SETUP.md`** (~30 min).

---

## Planes y límites

```typescript
PLANS.free = { menus: 1, dishes: 15, images: 5, hasBranding: true,  hasQR: false }
PLANS.pro  = { menus: ∞, dishes: ∞,  images: 30, hasBranding: false, hasQR: true  }  // S/35/mes
```

Los límites se validan tanto en API routes (server-side) como en RLS policies (DB-side).

---

## Webhooks de MercadoPago

El endpoint `/api/mercadopago/webhook` recibe notificaciones de tipo:

| `type` | Acción |
|--------|--------|
| `subscription_preapproval` | Fetch del PreApproval → actualiza `plan` y `mp_status` según el estado (`authorized` → `pro`, resto → `free`) |
| `payment` | Solo log (el status del preapproval ya refleja fallos de pago) |

Configura el webhook en MercadoPago Developers → Tu aplicación → Webhooks con la URL `https://tu-dominio.vercel.app/api/mercadopago/webhook`.

---

## Licencia

MIT
