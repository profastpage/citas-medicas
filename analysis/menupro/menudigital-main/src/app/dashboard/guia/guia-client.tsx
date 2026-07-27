'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import type { Plan } from '@/lib/plans';
import {
  Rocket,
  Plus,
  Pencil,
  Image as ImageIcon,
  Palette,
  Share2,
  QrCode,
  Globe,
  BarChart3,
  Crown,
  CreditCard,
  Upload,
  Download,
  Search,
  ShoppingCart,
  Sparkles,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Facebook,
  Instagram,
  Youtube,
  Globe as GlobeIcon,
  Shield,
  Eye,
  Save,
  CheckCircle2,
  Zap,
  TrendingUp,
  Smartphone,
} from 'lucide-react';

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  isSuperAdmin?: boolean;
}

interface Section {
  id: string;
  emoji: string;
  title: string;
  icon: typeof Rocket;
  description: string;
  steps: Array<{
    title: string;
    detail: string;
    tip?: string;
    link?: { href: string; label: string };
  }>;
}

const SECTIONS: Section[] = [
  {
    id: 'crear-menu',
    emoji: '🚀',
    title: 'Crear tu primer menú',
    icon: Rocket,
    description: 'Primeros pasos para tener tu carta digital lista en menos de 5 minutos.',
    steps: [
      {
        title: 'Entra a tu panel',
        detail: 'Inicia sesión en MenuPro y serás recibido por tu dashboard en /dashboard. Ahí verás la lista de tus menús (si tienes) o un botón "Nuevo menú" si es tu primera vez.',
        tip: 'Si vienes del generador antiguo, todo está ahora centralizado en el editor de cada menú. Ya no necesitas un panel separado.',
      },
      {
        title: 'Haz clic en "Nuevo menú"',
        detail: 'Abre el modal, escribe el nombre de tu restaurante (ej. "La Parrilla del Chef") y presiona Enter. Se creará un menú vacío y serás llevado al editor integrado.',
        tip: 'El nombre puede editarse después. Lo importante es empezar.',
        link: { href: '/dashboard', label: 'Ir a Mis menús' },
      },
      {
        title: 'Verás el editor único integrado',
        detail: 'Aquí está TODO en una sola pantalla: datos del restaurante, logo, portada, redes sociales, categorías, platos, apariencia y vista previa en vivo. No necesitas ir a ningún otro panel.',
      },
    ],
  },
  {
    id: 'datos-restaurante',
    emoji: '🏪',
    title: 'Datos del restaurante',
    icon: Pencil,
    description: 'Configura la identidad de tu negocio: nombre, slogan, descripción, contacto y logo.',
    steps: [
      {
        title: 'Completa los campos básicos',
        detail: 'En la parte superior del editor verás: Nombre, Slogan (frase corta), Descripción (1-2 párrafos), WhatsApp (con código de país, ej. 51987654321) y Moneda.',
        tip: 'El WhatsApp se usará para que los clientes te envíen sus pedidos con 1 clic desde el menú publicado.',
      },
      {
        title: 'Sube tu logo',
        detail: 'Haz clic en el área circular de logo para subir una imagen desde tu dispositivo. Se optimiza automáticamente (WebP, 1200px). Formatos soportados: JPG, PNG, WebP.',
        tip: 'Plan Pro: puedes quitar el fondo del logo con 1 clic (30 veces al mes incluidas) para que quede perfecto sobre cualquier color.',
      },
      {
        title: 'Todo se autoguarda',
        detail: 'Mientras editas, los cambios se guardan automáticamente cada 1.5 segundos (con debounce). Verás un indicador "Guardado a las HH:MM" junto al título. No necesitas presionar ningún botón de guardar. La vista previa en vivo se actualiza cada 400ms.',
        tip: 'El indicador verde ✓ significa que tus datos están seguros en la nube.',
      },
    ],
  },
  {
    id: 'portada-redes',
    emoji: '🎨',
    title: 'Imagen de portada y redes sociales',
    icon: Share2,
    description: 'Personaliza tu menú con una imagen hero profesional y enlaces a todas tus redes.',
    steps: [
      {
        title: 'Sube una imagen de portada (opcional)',
        detail: 'En la sección "Portada" del editor, arrastra o haz clic para subir una imagen wide (3:1). Esta imagen aparecerá como fondo detrás del logo y nombre de tu restaurante, dando un efecto ultra profesional.',
        tip: 'Resolución recomendada: 1200x400px o superior. Usa fotos de tus mejores platos o del local.',
      },
      {
        title: 'Agrega tus redes sociales',
        detail: 'Verás 7 campos con íconos premium: Facebook, Instagram, WhatsApp, TikTok, Twitter/X, YouTube y Web. Pega la URL completa de cada red. Solo los que rellenes aparecerán en el menú publicado.',
        tip: 'Los íconos se renderizan como SVG inline premium, no como imágenes. Se ven perfectos en cualquier tamaño y tema (claro/oscuro).',
      },
      {
        title: 'Vista previa en tiempo real',
        detail: 'Mientras rellenas datos, la vista previa a la derecha se actualiza instantáneamente (con 400ms de debounce para no recargar). Puedes ver exactamente cómo verán tus clientes el menú.',
      },
    ],
  },
  {
    id: 'categorias-platos',
    emoji: '🍽️',
    title: 'Categorías y platos',
    icon: Upload,
    description: 'Organiza tu carta en categorías (Entradas, Principales, Bebidas...) y agrega tus platos con fotos.',
    steps: [
      {
        title: 'Crea categorías',
        detail: 'En la sección "Categorías", haz clic en "+ Agregar categoría". Nombra cada una (ej. "Entradas", "Parrilla", "Postres"). Puedes reordenarlas arrastrando el icono ≡.',
        tip: 'Máximo recomendado: 6-8 categorías. Más categorías hacen el menú más largo de navegar.',
      },
      {
        title: 'Agrega platos a cada categoría',
        detail: 'Dentro de cada categoría, clic en "+ Agregar plato". Completa: Nombre (ej. "Lomo Saltado"), Descripción (ingredientes, presentación), Precio (número) y Foto (cuadrada, recomendado 800x800px).',
        tip: 'Las fotos profesionales aumentan hasta 40% las ventas. Invierte tiempo en buenas fotos.',
      },
      {
        title: 'Importa masivamente (opcional)',
        detail: 'Si ya tienes tu carta en Excel/CSV/JSON, usa el menú ⋮ del menú en /dashboard y elige "Importar platos". El sistema creará las categorías y platos automáticamente.',
        tip: 'Formatos aceptados: .xlsx, .csv, .json. Plantilla: descarga un menú existente como JSON para ver la estructura.',
      },
    ],
  },
  {
    id: 'lightbox-platos',
    emoji: '📸',
    title: 'Vista detallada de platos (Lightbox)',
    icon: Eye,
    description: ' Tus clientes verán cada plato en grande estilo PedidosYa/Rappi al hacer clic.',
    steps: [
      {
        title: 'Lightbox activado por defecto',
        detail: 'En Apariencia, el toggle "Lightbox de platos" está activado por defecto. Esto significa que cuando un cliente hace clic en un plato, se abre una vista full-screen con foto grande, nombre, precio, descripción y botón "Agregar al pedido".',
        tip: 'Puedes desactivarlo si prefieres que el clic agregue directamente al carrito (comportamiento rápido).',
      },
      {
        title: 'Diseño mobile-first profesional',
        detail: 'En móvil: el lightbox sube desde abajo (bottom-sheet) con un handle bar, foto cuadrada hero gigante, título grande, precio destacado debajo, descripción y CTA sticky. En desktop: card centrada con animación zoom.',
        tip: 'Este es el mismo patrón UX que usan PedidosYa, Rappi y Uber Eats — probado para maximizar conversión.',
      },
      {
        title: 'Botón "Agregar al pedido" con feedback',
        detail: 'Al hacer clic en agregar, el botón se pone verde con ✓ "Agregado" y se cierra en 0.9s. El carrito inferior se actualiza con animación pulse para que el cliente vea que se agregó.',
      },
    ],
  },
  {
    id: 'apariencia-tema',
    emoji: '🎨',
    title: 'Apariencia y temas (Plan Pro)',
    icon: Palette,
    description: 'Personaliza el diseño visual de tu menú: layout, fuentes, colores, tamaños de imagen y más.',
    steps: [
      {
        title: 'Elige un preset',
        detail: 'Plan Pro: 8 temas pre-diseñados (Elegante, Moderno, Picante, Fresco, Premium Gold, Grid, Parrilla, Libre). Haz clic en uno para aplicarlo instantáneamente.',
        tip: 'Plan Free: puedes usar color principal y modo claro/oscuro. Upgrade a Pro para desbloquear todos los temas.',
        link: { href: '/dashboard/billing', label: 'Ver planes Pro' },
      },
      {
        title: 'Personalización manual',
        detail: 'Debajo de los presets tienes control granular: color secundario, fuente (Inter, Poppins, Playfair, etc.), layout (1, 2 o 3 columnas), tamaño de imagen (none, small, medium, large, hero), estilo de tarjeta (compact, expanded, minimal), bordes redondeados, modo oscuro, búsqueda, etc.',
      },
      {
        title: 'Toggle "Lightbox de platos"',
        detail: 'En esta misma sección puedes activar/desactivar la vista detallada al hacer clic en un plato. Recomendado: activado.',
      },
      {
        title: 'Toggle de tema para el cliente',
        detail: 'Tu menú público incluye un botón flotante de sol/luna (arriba a la derecha). El cliente puede alternar entre tema claro y oscuro según su preferencia. Su elección se guarda en localStorage y persiste entre visitas. El tema por defecto es el que tú configures aquí (Modo oscuro).',
        tip: 'Este toggle NO cambia tu configuración — solo es para la comodidad del cliente final. Tu tema por defecto se respeta si el cliente nunca ha tocado el botón.',
      },
    ],
  },
  {
    id: 'publicar',
    emoji: '🌐',
    title: 'Publicar tu menú como página real',
    icon: Globe,
    description: 'Convierte tu menú en una página web pública con URL propia basada en el slug.',
    steps: [
      {
        title: 'Edita el slug',
        detail: 'El slug es la URL pública de tu menú: menudigital-pro.vercel.app/r/tu-slug. Cámbialo en el editor por algo memorable (ej. "la-parrilla-del-chef"). Solo minúsculas, números y guiones.',
        tip: 'El slug debe ser único en toda la plataforma. Si existe, se agregará un número al final.',
      },
      {
        title: 'Presiona "Publicar"',
        detail: 'En la toolbar superior del editor, el botón "Publicar" cambia tu menú de estado "Borrador" a "Publicado". A partir de ese momento, la URL /r/tu-slug es accesible públicamente.',
        tip: 'Puedes despublicar cuando quieras (vuelve a Borrador). Los datos se mantienen guardados.',
      },
      {
        title: 'Comparte tu enlace',
        detail: 'Una vez publicado, copia el enlace desde /dashboard con el botón "Copiar enlace" o el icono de clipboard. Pégalo en tu Instagram, WhatsApp Business, Facebook, tarjetas físicas con QR, etc.',
      },
    ],
  },
  {
    id: 'qr-codigo',
    emoji: '📱',
    title: 'Código QR',
    icon: QrCode,
    description: 'Genera códigos QR para impresos (mesas, flyers, tarjetas) que llevan directo a tu menú.',
    steps: [
      {
        title: 'Ve al generador QR',
        detail: 'Desde /dashboard, en el menú ⋮ de tu menú publicado, elige "Código QR". Se abrirá una página dedicada con opciones de personalización.',
        tip: 'Disponible solo si tu menú está publicado y tu plan incluye QR (Free y Pro ambos).',
      },
      {
        title: 'Personaliza el QR',
        detail: 'Elige color del QR, fondo, tamaño y agregá tu logo al centro. Descarga en PNG (alta resolución para impresión) o SVG (vectorial para escalado infinito).',
        tip: 'Para tarjetas de presentación usa 300x300px mínimo. Para stickers de mesa: 200x200px es suficiente.',
      },
    ],
  },
  {
    id: 'dominio-propio',
    emoji: '🌍',
    title: 'Dominio propio (Plan Pro)',
    icon: Globe,
    description: 'Usa tu propio dominio (ej. menu.mirestaurante.com) en lugar del subdominio de MenuPro.',
    steps: [
      {
        title: 'Ve a Dominios',
        detail: 'En el sidebar: Dominios. Agrega tu dominio o subdominio. El sistema te dará un registro CNAME que debes configurar en tu proveedor de DNS (Cloudflare, GoDaddy, Namecheap, etc.).',
        tip: 'Plan Pro exclusivo. Free usa siempre menudigital-pro.vercel.app/r/tu-slug.',
        link: { href: '/dashboard/domains', label: 'Ir a Dominios' },
      },
      {
        title: 'Espera la verificación',
        detail: 'Una vez configurado el CNAME, el sistema verifica automáticamente. SSL se emite gratis vía Let\'s Encrypt. Estado: "Pendiente" → "Verificado" (5-30 min).',
      },
    ],
  },
  {
    id: 'analiticas',
    emoji: '📊',
    title: 'Analíticas y métricas',
    icon: BarChart3,
    description: 'Mide cuántas visitas recibe tu menú, qué platos son más populares, etc.',
    steps: [
      {
        title: 'Ve a Analíticas',
        detail: 'En el sidebar: Analíticas (Plan Pro). Verás KPIs: vistas totales, vistas por día (gráfico), top platos, dispositivos (mobile vs desktop), fuentes de tráfico.',
        tip: 'Plan Free: solo ve el contador de vistas en cada tarjeta de menú en /dashboard.',
        link: { href: '/dashboard/analytics', label: 'Ir a Analíticas' },
      },
      {
        title: 'Usa los datos para optimizar',
        detail: 'Si ves que el 80% viene de mobile, asegúrate de que tus fotos se vean bien en celular. Si un plato tiene muchas vistas pero pocos pedidos, revisa su precio o descripción.',
      },
    ],
  },
  {
    id: 'exportar-importar',
    emoji: '📤',
    title: 'Exportar e importar datos',
    icon: Download,
    description: 'Respalda tu carta o pásala a otro sistema. Importa desde Excel para llenar menús rápido.',
    steps: [
      {
        title: 'Exporta tu menú',
        detail: 'En /dashboard, menú ⋮ de tu menú → Exportar. Formatos: JSON (completo, con imágenes), CSV (tabla simple), Excel (.xls), Word (.doc). Útil para backups o compartir.',
      },
      {
        title: 'Importa platos masivamente',
        detail: 'Tiene un menú vacío? Importa desde Excel/CSV/JSON y se crean categorías + platos automáticamente. Ideal cuando ya tienes tu carta en una planilla.',
        tip: 'Descarga un menú como JSON para usar de plantilla. Respeta la estructura {categories: [{name, dishes: [{name, description, price, image_url}]}]}.',
      },
    ],
  },
  {
    id: 'planes-facturacion',
    emoji: '💎',
    title: 'Planes y facturación',
    icon: CreditCard,
    description: 'Free vs Pro. Cómo hacer upgrade, gestionar tu suscripción MercadoPago.',
    steps: [
      {
        title: 'Plan Free (gratis para siempre)',
        detail: '1 menú, hasta 10 platos, branding "Creado con MenuPro" visible, sin dominio propio, sin analíticas avanzadas, sin quitar fondo. Perfecto para empezar.',
      },
      {
        title: 'Plan Pro (S/35/mes)',
        detail: 'Menús ilimitados, platos ilimitados, sin branding, dominio propio, analíticas completas, 30 quitadas de fondo al mes, todos los temas, soporte prioritario.',
        tip: 'Pago automático mensual vía MercadoPago. Cancela cuando quieras desde /dashboard/billing.',
        link: { href: '/dashboard/billing', label: 'Hacer upgrade a Pro' },
      },
      {
        title: 'Gestión de suscripción',
        detail: 'En /dashboard/billing puedes: ver tu estado actual, cambiar de plan, actualizar método de pago, cancelar, descargar facturas. Todo automatizado con MercadoPago.',
      },
    ],
  },
  {
    id: 'super-admin',
    emoji: '👑',
    title: 'Panel Super Admin (si eres admin)',
    icon: Shield,
    description: 'Si tienes rol de Super Admin, accedes a un panel interno con control total de la plataforma.',
    steps: [
      {
        title: 'Accede a /superadmin',
        detail: 'Verás el link "Super Admin" en el sidebar si tu cuenta tiene el flag is_super_admin = true. El panel tiene 3 tabs: Estadísticas, Usuarios y Dominios.',
        tip: 'Si crees que deberías ser admin y no ves el link, contacta al equipo de MenuPro para que activen tu flag.',
      },
      {
        title: 'Gestión de usuarios',
        detail: 'En el tab Usuarios puedes: ver todos los usuarios (con búsqueda y paginación), dar/quitar Pro, dar/quitar Super Admin, banear/reactivar, eliminar usuario (con todos sus menús). Haz clic en "Detalle" para ver menús, dominios y vistas recientes de cualquier usuario.',
      },
      {
        title: 'Estadísticas globales',
        detail: 'Métricas de toda la plataforma: total usuarios, Pro vs Free, registros 7d/30d, total menús, vistas acumuladas, ingresos estimados, top 10 menús más vistos.',
      },
    ],
  },
  {
    id: 'tips-pro',
    emoji: '✨',
    title: 'Tips Pro para vender más',
    icon: Lightbulb,
    description: 'Consejos prácticos para que tu menú digital genere más pedidos.',
    steps: [
      {
        title: 'Fotos profesionales = más ventas',
        detail: 'Los platos con foto se piden 40% más que los que no tienen. Usa luz natural, fondo neutro, ángulo cenital o 45°. Si no tienes cámara pro, cualquier celular moderno con buena luz funciona.',
      },
      {
        title: 'Descripciones que dan hambre',
        detail: 'En vez de "Lomo Saltado" solo, escribe: "Lomo de res salteado al wok con cebolla, tomate, papas fritas crocantes y arroz al vapor. Servir bien caliente." Detalles sensoriales aumentan conversión.',
      },
      {
        title: 'Precios psicológicos',
        detail: 'S/29.90 funciona mejor que S/30. Evita precios redondos. Pero no termines en .99 (se ve barato). .90 es el sweet spot.',
      },
      {
        title: 'WhatsApp Business + menú',
        detail: 'Configura tu WhatsApp Business con respuestas automáticas. Cuando alguien llega desde el menú, recibe saludo + menu link. Conversión se dispara.',
      },
      {
        title: 'QR en cada mesa',
        detail: 'Imprime QRs pequeños (5x5cm) y pégalos en cada mesa. Los clientes escanean, ven el menú, arman su pedido y te lo mandan por WhatsApp. Cero fricción.',
        tip: 'Descarga el QR desde el generador integrado en MenuPro. Usa PNG 300x300 para impresión nítida.',
      },
    ],
  },
];

export function GuiaClient({ user, plan, isSuperAdmin = false }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>('crear-menu');

  const toggle = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#d4af37]/15 via-[#d4af37]/5 to-transparent border border-[#d4af37]/30 p-6 sm:p-8 mb-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-bold tracking-wider uppercase border border-[#d4af37]/40">
              📚 Centro de Ayuda
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight">
            Cómo usar MenuPro <span className="text-[#d4af37]">paso a paso</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl">
            Esta guía te lleva desde crear tu cuenta hasta tener tu menú digital publicado
            y generando pedidos. Todo en un solo lugar, con ejemplos y tips Pro.
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] font-semibold text-sm hover:opacity-90 transition"
            >
              <Rocket className="w-4 h-4" /> Empezar ahora
            </Link>
            <a
              href="#crear-menu"
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-white/15 text-white/80 hover:text-white hover:bg-white/5 transition text-sm"
            >
              Ver pasos <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        {/* Glow decorations */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none" />
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={Zap} color="#fbbf24" value="< 5 min" label="Tu menú listo" />
        <StatCard icon={Smartphone} color="#22c55e" value="100%" label="Mobile-first" />
        <StatCard icon={Save} color="#3b82f6" value="Auto" label="Guardado continuo" />
        <StatCard icon={TrendingUp} color="#ec4899" value="+40%" label="Ventas con fotos" />
      </div>

      {/* SECCIONES ACORDEÓN */}
      <div className="space-y-3">
        {SECTIONS.map((section, idx) => {
          const isOpen = expandedId === section.id;
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              id={section.id}
              className={`rounded-2xl border transition-all duration-200 ${
                isOpen
                  ? 'border-[#d4af37]/40 bg-white/[0.04] shadow-lg shadow-[#d4af37]/5'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
              }`}
            >
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left"
                aria-expanded={isOpen}
              >
                {/* Step number + emoji */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg font-bold transition ${
                      isOpen
                        ? 'bg-gradient-to-br from-[#d4af37] to-[#f4d35e] text-[#1a1a2e]'
                        : 'bg-white/5 text-white/60'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <span className="text-2xl sm:text-3xl">{section.emoji}</span>
                </div>

                {/* Title + description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <Icon className={`w-4 h-4 ${isOpen ? 'text-[#d4af37]' : 'text-white/40'}`} />
                    <h3 className="font-bold text-sm sm:text-base leading-tight">{section.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-white/50 line-clamp-1">
                    {section.description}
                  </p>
                </div>

                {/* Chevron */}
                <div className="flex-shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#d4af37]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/40" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 space-y-4">
                  {section.steps.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-white/[0.02] border border-white/5 rounded-xl p-4 sm:p-5 relative"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-7 h-7 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {sIdx + 1}
                        </div>
                        <h4 className="font-semibold text-sm sm:text-base text-white flex-1 leading-snug">
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed pl-10 mb-2">
                        {step.detail}
                      </p>
                      {step.tip && (
                        <div className="ml-10 mt-3 flex items-start gap-2 p-3 rounded-lg bg-[#d4af37]/8 border border-[#d4af37]/20">
                          <Lightbulb className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                          <p className="text-xs sm:text-sm text-[#d4af37]/90 leading-relaxed">
                            <span className="font-bold">Tip Pro: </span>
                            {step.tip}
                          </p>
                        </div>
                      )}
                      {step.link && (
                        <div className="ml-10 mt-3">
                          <Link
                            href={step.link.href}
                            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-white/5 border border-white/15 text-xs text-white/80 hover:bg-white/10 hover:text-white transition"
                          >
                            {step.link.label} <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA FINAL */}
      <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#d4af37]/15 to-transparent border border-[#d4af37]/30 p-6 sm:p-8 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2">¿Listo para publicar tu menú?</h2>
        <p className="text-white/70 text-sm sm:text-base mb-4 max-w-xl mx-auto">
          Ya tienes todo lo necesario para crear un menú digital profesional. Tu primer menú
          puede estar publicado en menos de 5 minutos.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] font-semibold text-sm hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" /> Crear mi menú ahora
          </Link>
          {plan.id === 'free' && (
            <Link
              href="/dashboard/billing"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-xl border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 transition text-sm font-semibold"
            >
              <Crown className="w-4 h-4" /> Hacerme Pro
            </Link>
          )}
        </div>
      </div>

      {/* FOOTER HELP */}
      <div className="mt-6 text-center text-xs text-white/40 px-4">
        ¿Necesitas ayuda adicional? Escríbenos a{' '}
        <a
          href="https://wa.me/51987654321"
          target="_blank"
          rel="noreferrer"
          className="text-[#d4af37] hover:underline"
        >
          WhatsApp soporte
        </a>{' '}
        · Esta guía se actualiza con cada nueva funcionalidad.
      </div>
    </DashboardShell>
  );
}

function StatCard({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: typeof Zap;
  color: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 sm:p-4">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
          {label}
        </span>
      </div>
      <div className="text-lg sm:text-xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
