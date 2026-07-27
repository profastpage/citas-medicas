export type PlanId = 'free' | 'pro' | 'premium' | 'full';

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number; // en Soles (PEN)
  priceUsd: number; // referencia
  mpAmount?: number; // monto cobrado por MercadoPago
  limits: {
    maxMenus: number; // -1 = ilimitado
    maxDishesPerMenu: number;
    maxImages: number; // imágenes totales por restaurante (-1 = ilimitado)
    maxImagesPerDish: number; // imágenes por producto/plato
    maxCategories: number; // -1 = ilimitado
    maxWaiters: number; // -1 = ilimitado, 0 = no disponible
    maxTables: number; // -1 = ilimitado, 0 = no disponible
    maxBranches: number; // -1 = ilimitado, 0 = no disponible
    hasQR: boolean;
    hasBranding: boolean; // true = muestra marca "Creado con MenuPro" (con hipervínculo al landing)
    hasWhiteLabel: boolean; // true = puede quitar la marca MenuPro (a partir de Premium)
    hasAnalytics: boolean;
    hasBgRemoval: boolean;
    bgRemovalCredits: number;
    hasMultiLanguage: boolean;
    hasHDQR: boolean;
    // Premium+
    hasTables: boolean; // gestión de mesas
    hasWaiters: boolean; // gestión de mozos
    hasComandas: boolean; // sistema de comandas
    hasKitchenDisplay: boolean; // cocina display
    hasInventory: boolean; // inventario de insumos
    hasRecipes: boolean; // recetas plato → insumos
    hasReservations: boolean; // reservas online
    hasWhatsAppOrders: boolean; // pedidos directos WhatsApp
    hasCustomThemes: boolean; // temas personalizados (colores custom)
    hasPwaOffline: boolean; // PWA con modo offline real para mozos
    hasAdvancedReports: boolean; // reportes avanzados
    // Full
    hasMultiBranch: boolean; // multi-sucursal
    hasVoucherPrinting: boolean; // imprimir vouchers POS
    hasOwnDomain: boolean; // dominio propio
    hasPushNotifications: boolean; // notificaciones push
    hasLoyaltyProgram: boolean; // programa de lealtad
    hasAutoTranslate: boolean; // auto-traducción AI
    hasApiAccess: boolean; // API externa
  };
  features: string[];
  highlight?: boolean;
  badge?: string;
  color: string; // hex para UI
  /** Mensaje corto para mostrar cuando un usuario alcanza un límite (upsell) */
  upgradeHint?: string;
}

/**
 * PLAN FREE — Adquisición + Viralidad
 * Mostramos marca MenuPro con hipervínculo → cada QR es un lead orgánico.
 */
export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    tagline: 'Para empezar y validar',
    priceMonthly: 0,
    priceUsd: 0,
    color: '#6b7280',
    upgradeHint: 'Pasa a Pro (S/ 35/mes) para tener 3 menús, 3 fotos por plato y analytics.',
    limits: {
      maxMenus: 1,
      maxDishesPerMenu: 10,
      maxImages: 10,
      maxImagesPerDish: 1,
      maxCategories: 3,
      maxWaiters: 0,
      maxTables: 0,
      maxBranches: 0,
      hasQR: true,
      hasBranding: true,
      hasWhiteLabel: false,
      hasAnalytics: false,
      hasBgRemoval: false,
      bgRemovalCredits: 0,
      hasMultiLanguage: false,
      hasHDQR: false,
      hasTables: false,
      hasWaiters: false,
      hasComandas: false,
      hasKitchenDisplay: false,
      hasInventory: false,
      hasRecipes: false,
      hasReservations: false,
      hasWhatsAppOrders: true,
      hasCustomThemes: false,
      hasPwaOffline: false,
      hasAdvancedReports: false,
      hasMultiBranch: false,
      hasVoucherPrinting: false,
      hasOwnDomain: false,
      hasPushNotifications: false,
      hasLoyaltyProgram: false,
      hasAutoTranslate: false,
      hasApiAccess: false,
    },
    features: [
      '1 menú activo',
      'Hasta 10 platos',
      '1 foto por plato',
      'Hasta 3 categorías',
      'Carrito integrado con WhatsApp',
      'URL pública /r/tu-restaurante',
      'Vista previa en vivo',
      'QR básico (solo vista web)',
      'Marca "Creado con MenuPro" con hipervínculo',
      '📱 App instalable (PWA) — clientes pueden agregar tu carta a su pantalla de inicio',
    ],
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    tagline: 'Para restaurantes en serio',
    priceMonthly: 35,
    priceUsd: 9,
    mpAmount: 35,
    color: '#d4af37',
    highlight: true,
    badge: 'POPULAR',
    upgradeHint:
      'Pasa a Premium (S/ 99/mes) para tener 10 menús, 5 fotos por plato, white label (sin marca MenuPro) y comandas para mozos.',
    limits: {
      maxMenus: 3,
      maxDishesPerMenu: -1,
      maxImages: -1,
      maxImagesPerDish: 3,
      maxCategories: -1,
      maxWaiters: 0,
      maxTables: 0,
      maxBranches: 0,
      hasQR: true,
      hasBranding: true, // Pro MANTIENE "Creado con MenuPro" con hipervínculo — genera leads orgánicos
      hasWhiteLabel: false, // No puede quitar la marca
      hasAnalytics: true,
      hasBgRemoval: true,
      bgRemovalCredits: 30,
      hasMultiLanguage: true,
      hasHDQR: true,
      hasTables: false,
      hasWaiters: false,
      hasComandas: false,
      hasKitchenDisplay: false,
      hasInventory: false,
      hasRecipes: false,
      hasReservations: false,
      hasWhatsAppOrders: true,
      hasCustomThemes: true,
      hasPwaOffline: false,
      hasAdvancedReports: false,
      hasMultiBranch: false,
      hasVoucherPrinting: false,
      hasOwnDomain: false,
      hasPushNotifications: false,
      hasLoyaltyProgram: false,
      hasAutoTranslate: false,
      hasApiAccess: false,
    },
    features: [
      '3 menús activos',
      'Platos ilimitados por menú',
      '3 fotos por plato + WebP',
      'Categorías y etiquetas ilimitadas',
      '30 créditos "Quitar fondo" IA por mes',
      'Carrito integrado con WhatsApp',
      'URL pública personalizada',
      'QR profesional HD + dinámico',
      'Analytics: visitas, clics WhatsApp, top platos',
      'Menú multi-idioma (ES/EN)',
      'Tema PedidosYa/Rappi + colores personalizados',
      'Marca "Creado con MenuPro" con hipervínculo',
      'Soporte prioritario WhatsApp (48h)',
      '📱 PWA optimizada — carga instantánea de la carta',
    ],
  },

  premium: {
    id: 'premium',
    name: 'Premium',
    tagline: 'Logística interna completa + White label',
    priceMonthly: 99,
    priceUsd: 26,
    mpAmount: 99,
    color: '#9d4edd',
    badge: 'PREMIUM',
    upgradeHint:
      'Pasa a Full (S/ 199/mes) para menús ilimitados, 10 fotos por plato, multi-sucursal y voucher printing POS.',
    limits: {
      maxMenus: 10,
      maxDishesPerMenu: -1,
      maxImages: -1,
      maxImagesPerDish: 5,
      maxCategories: -1,
      maxWaiters: 20,
      maxTables: 50,
      maxBranches: 1,
      hasQR: true,
      hasBranding: false, // Premium YA ES white label — sin marca MenuPro
      hasWhiteLabel: true,
      hasAnalytics: true,
      hasBgRemoval: true,
      bgRemovalCredits: 100,
      hasMultiLanguage: true,
      hasHDQR: true,
      hasTables: true,
      hasWaiters: true,
      hasComandas: true,
      hasKitchenDisplay: true,
      hasInventory: true,
      hasRecipes: true,
      hasReservations: true,
      hasWhatsAppOrders: true,
      hasCustomThemes: true,
      hasPwaOffline: true,
      hasAdvancedReports: false,
      hasMultiBranch: false,
      hasVoucherPrinting: false,
      hasOwnDomain: false,
      hasPushNotifications: false,
      hasLoyaltyProgram: false,
      hasAutoTranslate: false,
      hasApiAccess: false,
    },
    features: [
      'Todo lo del plan Pro',
      '10 menús activos',
      '5 fotos por plato + WebP',
      '100 créditos "Quitar fondo" por mes',
      '✨ 100% White label — sin marca MenuPro',
      '🍽️ Gestión de mesas (hasta 50)',
      '👨‍🍳 Gestión de mozos (hasta 20)',
      '📋 Comandas: mesa → mozo → cocina → entrega',
      '🔥 Cocina Display (cola de pedidos en tiempo real)',
      '📦 Inventario de insumos con stock mínimo',
      '🧾 Recetas: cada plato consume insumos automáticamente',
      '📅 Reservas online (próximamente)',
      '⚡ Auto-descuento de stock al facturar',
      '🚨 Alertas de stock bajo',
      '📲 PWA del panel de mozos con modo offline (toman comandas sin internet)',
    ],
  },

  full: {
    id: 'full',
    name: 'Full',
    tagline: 'Multi-sucursal + voucher printing + AI',
    priceMonthly: 199,
    priceUsd: 52,
    mpAmount: 199,
    color: '#e63946',
    badge: 'FULL',
    limits: {
      maxMenus: -1,
      maxDishesPerMenu: -1,
      maxImages: -1,
      maxImagesPerDish: 10,
      maxCategories: -1,
      maxWaiters: -1,
      maxTables: -1,
      maxBranches: -1,
      hasQR: true,
      hasBranding: false,
      hasWhiteLabel: true,
      hasAnalytics: true,
      hasBgRemoval: true,
      bgRemovalCredits: -1, // ilimitado
      hasMultiLanguage: true,
      hasHDQR: true,
      hasTables: true,
      hasWaiters: true,
      hasComandas: true,
      hasKitchenDisplay: true,
      hasInventory: true,
      hasRecipes: true,
      hasReservations: true,
      hasWhatsAppOrders: true,
      hasCustomThemes: true,
      hasPwaOffline: true,
      hasAdvancedReports: true,
      hasMultiBranch: true,
      hasVoucherPrinting: true,
      hasOwnDomain: true,
      hasPushNotifications: true,
      hasLoyaltyProgram: true,
      hasAutoTranslate: true,
      hasApiAccess: true,
    },
    features: [
      'Todo lo del plan Premium',
      '✨ Menús ilimitados',
      '✨ 10 fotos por plato',
      '✨ Quitar fondo ilimitado',
      '🏬 Multi-sucursal ilimitada',
      '🏬 Mesas y mozos ilimitados por sucursal',
      '🖨️ Voucher printing 1-click (POS 80mm / A4 / A5)',
      '📈 Reportes avanzados: ventas por mozo, plato, sucursal, hora',
      '🌐 Dominio propio (midominio.com)',
      '🤖 Auto-traducción AI (ES/EN/PT/FR/DE)',
      '🎟️ Programa de lealtad + cupones promocionales',
      '🔔 Notificaciones push para nuevos pedidos',
      '📱 Panel móvil para mozos (PWA con Background Sync)',
      '🔄 Transferencia de stock entre sucursales',
      '🔗 Integraciones API (delivery, POS externo)',
      '🎫 Boletas/facturas electrónicas (próximamente)',
      '👑 Soporte prioritario 24/7 + onboarding personalizado',
    ],
  },
};

export function getPlan(planId: string): Plan {
  return PLANS[planId as PlanId] ?? PLANS.free;
}

export function canCreateMenu(currentCount: number, plan: Plan): boolean {
  if (plan.limits.maxMenus === -1) return true;
  return currentCount < plan.limits.maxMenus;
}

export function canAddDish(currentCount: number, plan: Plan): boolean {
  if (plan.limits.maxDishesPerMenu === -1) return true;
  return currentCount < plan.limits.maxDishesPerMenu;
}

export function canAddCategory(currentCount: number, plan: Plan): boolean {
  if (plan.limits.maxCategories === -1) return true;
  return currentCount < plan.limits.maxCategories;
}

export function canUploadImage(currentCount: number, plan: Plan): boolean {
  if (plan.limits.maxImages === -1) return true;
  return currentCount < plan.limits.maxImages;
}

/** ¿Puede subir N imágenes a un plato? — límite por plato según el plan */
export function canAddDishImage(currentCount: number, plan: Plan): boolean {
  if (plan.limits.maxImagesPerDish === -1) return true;
  return currentCount < plan.limits.maxImagesPerDish;
}

/** ¿Puede crear otro mozo? */
export function canCreateWaiter(currentCount: number, plan: Plan): boolean {
  if (plan.limits.maxWaiters === -1) return true;
  if (plan.limits.maxWaiters === 0) return false;
  return currentCount < plan.limits.maxWaiters;
}

/** ¿Puede crear otra mesa? */
export function canCreateTable(currentCount: number, plan: Plan): boolean {
  if (plan.limits.maxTables === -1) return true;
  if (plan.limits.maxTables === 0) return false;
  return currentCount < plan.limits.maxTables;
}

/** ¿Puede crear otra sucursal? */
export function canCreateBranch(currentCount: number, plan: Plan): boolean {
  if (plan.limits.maxBranches === -1) return true;
  if (plan.limits.maxBranches === 0) return false;
  return currentCount < plan.limits.maxBranches;
}

/**
 * Helpers de feature gating para logística premium.
 * Estos se usan en middleware y en UI para bloquear/permitir acciones.
 */
export function hasFeature(planId: string, feature: string): boolean {
  const plan = getPlan(planId);
  const limits = plan.limits as Record<string, unknown>;
  return Boolean(limits[feature]);
}

/**
 * Compara si un plan tiene igual o mayor jerarquía que otro.
 * Jerarquía: free < pro < premium < full
 */
export function isPlanAtLeast(planId: string, minPlan: PlanId): boolean {
  const order: PlanId[] = ['free', 'pro', 'premium', 'full'];
  const currentIdx = order.indexOf((planId as PlanId));
  const minIdx = order.indexOf(minPlan);
  if (currentIdx === -1 || minIdx === -1) return false;
  return currentIdx >= minIdx;
}

export const PLAN_ORDER: PlanId[] = ['free', 'pro', 'premium', 'full'];

export const COLORS = [
  { hex: '#ff6b35', name: 'Naranja Vibrante' },
  { hex: '#e63946', name: 'Rojo Premium' },
  { hex: '#06d6a0', name: 'Verde Esmeralda' },
  { hex: '#118ab2', name: 'Azul Profundo' },
  { hex: '#9d4edd', name: 'Morado Real' },
  { hex: '#d4af37', name: 'Dorado Champagne' },
];

export const CURRENCIES = [
  { value: 'S/', label: 'S/ Soles (Perú)' },
  { value: '$', label: '$ Dólares' },
  { value: '€', label: '€ Euros' },
  { value: 'Bs', label: 'Bs Bolivianos' },
  { value: '₲', label: '₲ Guaraníes' },
  { value: 'AR$', label: 'AR$ Pesos Arg' },
  { value: '$U', label: '$U Pesos Uru' },
  { value: 'CLP$', label: 'CLP$ Pesos Chilenos' },
  { value: 'MX$', label: 'MX$ Pesos Mexicanos' },
  { value: 'R$', label: 'R$ Reales' },
];

/**
 * Límites comparativos para mostrar en la landing y en el dashboard.
 * Cada fila indica el límite por plan (para que el usuario vea por qué conviene subir de tier).
 */
export const LIMIT_COMPARISON: Array<{
  label: string;
  icon: string;
  values: [string, string, string, string]; // free, pro, premium, full
}> = [
  {
    label: 'Menús activos',
    icon: '📋',
    values: ['1', '3', '10', '∞'],
  },
  {
    label: 'Fotos por plato',
    icon: '📸',
    values: ['1', '3', '5', '10'],
  },
  {
    label: 'Platos por menú',
    icon: '🍽️',
    values: ['10', '∞', '∞', '∞'],
  },
  {
    label: 'Quitar fondo IA',
    icon: '✨',
    values: ['—', '30/mes', '100/mes', '∞'],
  },
  {
    label: 'White label (sin marca)',
    icon: '🏷️',
    values: ['—', '—', '✓', '✓'],
  },
  {
    label: 'Analytics',
    icon: '📊',
    values: ['—', '✓', '✓', '✓ Avanzado'],
  },
  {
    label: 'Comandas + Cocina Display',
    icon: '👨‍🍳',
    values: ['—', '—', '✓', '✓'],
  },
  {
    label: 'Mozos',
    icon: '🧑‍🍳',
    values: ['—', '—', '20', '∞'],
  },
  {
    label: 'Mesas',
    icon: '🪑',
    values: ['—', '—', '50', '∞'],
  },
  {
    label: 'Inventario + Recetas',
    icon: '📦',
    values: ['—', '—', '✓', '✓'],
  },
  {
    label: 'Multi-sucursal',
    icon: '🏬',
    values: ['—', '—', '—', '∞'],
  },
  {
    label: 'Voucher printing POS',
    icon: '🖨️',
    values: ['—', '—', '—', '✓'],
  },
  {
    label: 'Dominio propio',
    icon: '🌐',
    values: ['—', '—', '—', '✓'],
  },
  {
    label: 'Reportes avanzados AI',
    icon: '🤖',
    values: ['—', '—', '—', '✓'],
  },
  {
    label: 'PWA offline (mozos)',
    icon: '📲',
    values: ['Básica', 'Optimizada', 'Offline real', 'Background Sync'],
  },
];
