// ============================================================
// CitasPro SaaS — Planes de suscripción
// Adaptado del modelo de MenuPro pero con límites del dominio médico
// ============================================================
// FILOSOFÍA DE LÍMITES (v2 — 2026-07-28):
//   Free    = prueba literal. 5 citas/mes, 5 pacientes. 1 médico. 1 usuario.
//              Quiere usar más? Pagar. Sin caja, sin inventario, sin WhatsApp.
//   Pro     = consultorio en crecimiento. 20 citas/mes. 3 médicos. Caja + inventario.
//   Premium = clínica seria. 50 citas/mes. 10 médicos. Multi-sucursal + white label.
//   Full    = ilimitado. Para redes de clínicas.
// Los límites se ENFUERZAN en:
//   - src/app/api/appointments/route.ts (POST crea cita → check maxAppointmentsPerMonth)
//   - src/app/api/patients/route.ts     (POST crea paciente → check maxPatients)
//   - src/app/api/doctors/route.ts      (POST crea médico → check maxDoctors)
//   - src/app/api/clinics/route.ts      (POST crea sucursal → check maxClinics)
//   - src/app/api/auth/register/route.ts(clínica inicial respeta maxClinics=1)
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
    tagline: 'Prueba literal — 5 citas al mes',
    priceMonthly: 0,
    priceUsd: 0,
    color: '#64748b',
    upgradeHint: 'Solo 5 citas/mes y 5 pacientes. Pasa a Pro (S/ 50/mes) para 20 citas, caja, inventario y WhatsApp.',
    limits: {
      maxDoctors: 1,
      maxPatients: 5,
      maxAppointmentsPerMonth: 5,
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
      fileStorageMb: 10,
    },
    features: [
      '1 médico',
      'Hasta 5 pacientes',
      'Hasta 5 citas al mes',
      'Calendario de citas básico',
      'Historia clínica básica',
      '1 usuario',
      'Marca "Gestionado con CitasPro"',
    ],
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    tagline: 'Para consultorios en crecimiento',
    priceMonthly: 50,
    priceUsd: 13,
    mpAmount: 50,
    color: '#0ea5e9',
    badge: 'POPULAR',
    highlight: true,
    upgradeHint:
      '20 citas/mes. Pasa a Premium (S/ 99/mes) para 50 citas, multi-sucursal y white label.',
    limits: {
      maxDoctors: 3,
      maxPatients: -1,
      maxAppointmentsPerMonth: 20,
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
      'Pacientes ilimitados',
      'Hasta 20 citas al mes',
      'Gestión de caja y pagos',
      'Inventario de medicamentos',
      'Recordatorios WhatsApp (200/mes)',
      'Recordatorios por email',
      'Interconsultas',
      'Auditoría de cambios',
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
      '50 citas/mes. Pasa a Full (S/ 199/mes) para citas y usuarios ilimitados + API.',
    limits: {
      maxDoctors: 10,
      maxPatients: -1,
      maxAppointmentsPerMonth: 50,
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
      'Hasta 50 citas al mes',
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
    tagline: 'Ilimitado + API',
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
      'Citas y médicos ilimitados',
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
  { label: 'Citas por mes', icon: '📅', values: ['5', '20', '50', '∞'] },
  { label: 'Pacientes', icon: '🧑‍🤝‍🧑', values: ['5', '∞', '∞', '∞'] },
  { label: 'Médicos', icon: '👨‍⚕️', values: ['1', '3', '10', '∞'] },
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
