// ============================================================
// CitasPro SaaS — Planes de suscripción
// Adaptado del modelo de MenuPro pero con límites del dominio médico
// ============================================================

export type PlanId = 'free' | 'pro' | 'premium' | 'full';

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number; // Soles (PEN)
  priceUsd: number;
  mpAmount?: number;
  color: string;
  badge?: string;
  highlight?: boolean;
  upgradeHint?: string;
  limits: {
    maxDoctors: number;       // -1 = ilimitado
    maxPatients: number;      // -1 = ilimitado
    maxAppointmentsPerMonth: number;
    maxClinics: number;       // sucursales
    maxUsers: number;         // miembros del equipo
    hasAppointmentCalendar: boolean;
    hasMedicalHistory: boolean;
    hasCashManagement: boolean;
    hasInventory: boolean;
    hasWhatsAppReminders: boolean;
    hasEmailReminders: boolean;
    hasCustomBranding: boolean;
    hasWhiteLabel: boolean;
    hasAdvancedReports: boolean;
    hasMultiBranch: boolean;
    hasAPI: boolean;
    hasAuditLog: boolean;
    hasFileUploads: boolean;
    hasInterconsults: boolean;
    hasPdfExport: boolean;
    reminderCreditsPerMonth: number;
    fileStorageMb: number;
  };
  features: string[];
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    tagline: 'Para consultorios que arrancan',
    priceMonthly: 0,
    priceUsd: 0,
    color: '#6b7280',
    upgradeHint: 'Pasa a Pro (S/ 50/mes) para tener 3 médicos, recordatorios WhatsApp y reportes.',
    limits: {
      maxDoctors: 1,
      maxPatients: 50,
      maxAppointmentsPerMonth: 100,
      maxClinics: 1,
      maxUsers: 1,
      hasAppointmentCalendar: true,
      hasMedicalHistory: true,
      hasCashManagement: false,
      hasInventory: false,
      hasWhatsAppReminders: false,
      hasEmailReminders: false,
      hasCustomBranding: false,
      hasWhiteLabel: false,
      hasAdvancedReports: false,
      hasMultiBranch: false,
      hasAPI: false,
      hasAuditLog: false,
      hasFileUploads: false,
      hasInterconsults: false,
      hasPdfExport: false,
      reminderCreditsPerMonth: 0,
      fileStorageMb: 50,
    },
    features: [
      '1 médico',
      'Hasta 50 pacientes',
      'Hasta 100 citas al mes',
      'Calendario de citas',
      'Historia clínica básica',
      'Marca "Gestionado con CitasPro"',
      '1 usuario',
    ],
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    tagline: 'Para clínicas en crecimiento',
    priceMonthly: 50,
    priceUsd: 13,
    mpAmount: 50,
    color: '#d4af37',
    badge: 'POPULAR',
    highlight: true,
    upgradeHint:
      'Pasa a Premium (S/ 99/mes) para tener 10 médicos, multi-sucursal y white label.',
    limits: {
      maxDoctors: 3,
      maxPatients: -1,
      maxAppointmentsPerMonth: -1,
      maxClinics: 1,
      maxUsers: 3,
      hasAppointmentCalendar: true,
      hasMedicalHistory: true,
      hasCashManagement: true,
      hasInventory: true,
      hasWhatsAppReminders: true,
      hasEmailReminders: true,
      hasCustomBranding: true,
      hasWhiteLabel: false,
      hasAdvancedReports: false,
      hasMultiBranch: false,
      hasAPI: false,
      hasAuditLog: true,
      hasFileUploads: true,
      hasInterconsults: true,
      hasPdfExport: true,
      reminderCreditsPerMonth: 200,
      fileStorageMb: 1024,
    },
    features: [
      'Todo lo de Free',
      '3 médicos',
      'Pacientes y citas ilimitadas',
      'Gestión de caja y pagos',
      'Inventario de medicamentos',
      'Recordatorios WhatsApp (200/mes)',
      'Recordatorios por email',
      'Interconsultas',
      'Auditoría de cambios',
      'Subida de archivos (1 GB)',
      'Exportar a PDF',
      '3 usuarios del equipo',
    ],
  },

  premium: {
    id: 'premium',
    name: 'Premium',
    tagline: 'White label + multi-sucursal',
    priceMonthly: 99,
    priceUsd: 26,
    mpAmount: 99,
    color: '#9d4edd',
    badge: 'PREMIUM',
    upgradeHint:
      'Pasa a Full (S/ 199/mes) para usuarios ilimitados, API y reportes avanzados.',
    limits: {
      maxDoctors: 10,
      maxPatients: -1,
      maxAppointmentsPerMonth: -1,
      maxClinics: 3,
      maxUsers: 10,
      hasAppointmentCalendar: true,
      hasMedicalHistory: true,
      hasCashManagement: true,
      hasInventory: true,
      hasWhatsAppReminders: true,
      hasEmailReminders: true,
      hasCustomBranding: true,
      hasWhiteLabel: true,
      hasAdvancedReports: true,
      hasMultiBranch: true,
      hasAPI: false,
      hasAuditLog: true,
      hasFileUploads: true,
      hasInterconsults: true,
      hasPdfExport: true,
      reminderCreditsPerMonth: 1000,
      fileStorageMb: 10240,
    },
    features: [
      'Todo lo de Pro',
      '10 médicos',
      'Multi-sucursal (3 clínicas)',
      'White label — sin marca CitasPro',
      'Reportes avanzados con gráficos',
      'Recordatorios WhatsApp (1000/mes)',
      '10 usuarios del equipo',
      '10 GB de almacenamiento',
      'Soporte prioritario',
    ],
  },

  full: {
    id: 'full',
    name: 'Full',
    tagline: 'Multi-sucursal ilimitada + API',
    priceMonthly: 199,
    priceUsd: 52,
    mpAmount: 199,
    color: '#e63946',
    badge: 'FULL',
    limits: {
      maxDoctors: -1,
      maxPatients: -1,
      maxAppointmentsPerMonth: -1,
      maxClinics: -1,
      maxUsers: -1,
      hasAppointmentCalendar: true,
      hasMedicalHistory: true,
      hasCashManagement: true,
      hasInventory: true,
      hasWhatsAppReminders: true,
      hasEmailReminders: true,
      hasCustomBranding: true,
      hasWhiteLabel: true,
      hasAdvancedReports: true,
      hasMultiBranch: true,
      hasAPI: true,
      hasAuditLog: true,
      hasFileUploads: true,
      hasInterconsults: true,
      hasPdfExport: true,
      reminderCreditsPerMonth: -1, // ilimitado
      fileStorageMb: -1,
    },
    features: [
      'Todo lo de Premium',
      'Médicos ilimitados',
      'Sucursales ilimitadas',
      'Usuarios ilimitados',
      'API externa',
      'Recordatorios WhatsApp ilimitados',
      'Almacenamiento ilimitado',
      'Integraciones con sistemas externos',
      'Soporte 24/7 + onboarding personalizado',
    ],
  },
};

export function getPlan(planId: string): Plan {
  return PLANS[planId as PlanId] ?? PLANS.free;
}

export function isPlanAtLeast(planId: string, minPlan: PlanId): boolean {
  const order: PlanId[] = ['free', 'pro', 'premium', 'full'];
  const currentIdx = order.indexOf(planId as PlanId);
  const minIdx = order.indexOf(minPlan);
  if (currentIdx === -1 || minIdx === -1) return false;
  return currentIdx >= minIdx;
}

export function hasFeature(planId: string, feature: string): boolean {
  const plan = getPlan(planId);
  const limits = plan.limits as Record<string, unknown>;
  return Boolean(limits[feature]);
}

export const PLAN_ORDER: PlanId[] = ['free', 'pro', 'premium', 'full'];

export const LIMIT_COMPARISON: Array<{
  label: string;
  icon: string;
  values: [string, string, string, string];
}> = [
  { label: 'Médicos', icon: '👨‍⚕️', values: ['1', '3', '10', '∞'] },
  { label: 'Pacientes', icon: '🧑‍🤝‍🧑', values: ['50', '∞', '∞', '∞'] },
  { label: 'Citas por mes', icon: '📅', values: ['100', '∞', '∞', '∞'] },
  { label: 'Sucursales', icon: '🏬', values: ['1', '1', '3', '∞'] },
  { label: 'Usuarios', icon: '👥', values: ['1', '3', '10', '∞'] },
  { label: 'Recordatorios WhatsApp', icon: '💬', values: ['—', '200', '1000', '∞'] },
  { label: 'Caja y pagos', icon: '💵', values: ['—', '✓', '✓', '✓'] },
  { label: 'Inventario', icon: '💊', values: ['—', '✓', '✓', '✓'] },
  { label: 'White label', icon: '🏷️', values: ['—', '—', '✓', '✓'] },
  { label: 'Reportes avanzados', icon: '📊', values: ['—', '—', '✓', '✓'] },
  { label: 'Auditoría', icon: '🔍', values: ['—', '✓', '✓', '✓'] },
  { label: 'API externa', icon: '🔌', values: ['—', '—', '—', '✓'] },
];
