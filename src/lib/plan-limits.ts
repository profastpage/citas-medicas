// ============================================================
// Plan limits — server-side enforcement helpers
// ============================================================
// Every create operation must call these before db.*.create().
// Returns a 402 "limit reached" response if the plan is exhausted.
// ============================================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getPlan, type PlanId } from '@/lib/plans';

/**
 * Check if the user's clinic can add one more patient.
 * Returns null if OK, or a NextResponse 402 if limit reached.
 */
export async function assertCanAddPatient(userPlan: string, clinicId: string) {
  const plan = getPlan(userPlan);
  const limit = plan.limits.maxPatients;
  if (limit === -1) return null; // unlimited

  const current = await db.patient.count({ where: { clinicId, isActive: true } });
  if (current >= limit) {
    return NextResponse.json(
      {
        error: `Límite del plan ${plan.name}: ${limit} pacientes. Mejora tu plan para agregar más.`,
        code: 'PLAN_LIMIT_PATIENTS',
        limit,
        current,
        plan: plan.id,
        upgradeUrl: '/dashboard/billing',
      },
      { status: 402 }
    );
  }
  return null;
}

/**
 * Check if the user's clinic can add one more appointment THIS MONTH.
 * Returns null if OK, or a NextResponse 402 if limit reached.
 */
export async function assertCanAddAppointment(userPlan: string, clinicId: string) {
  const plan = getPlan(userPlan);
  const limit = plan.limits.maxAppointmentsPerMonth;
  if (limit === -1) return null; // unlimited

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const current = await db.appointment.count({
    where: {
      clinicId,
      appointmentDate: { gte: startOfMonth, lte: endOfMonth },
    },
  });
  if (current >= limit) {
    return NextResponse.json(
      {
        error: `Límite del plan ${plan.name}: ${limit} citas al mes. Mejora tu plan para seguir agendando.`,
        code: 'PLAN_LIMIT_APPOINTMENTS',
        limit,
        current,
        plan: plan.id,
        upgradeUrl: '/dashboard/billing',
      },
      { status: 402 }
    );
  }
  return null;
}

/**
 * Check if the user's clinic can add one more doctor.
 */
export async function assertCanAddDoctor(userPlan: string, clinicId: string) {
  const plan = getPlan(userPlan);
  const limit = plan.limits.maxDoctors;
  if (limit === -1) return null;

  const current = await db.doctor.count({ where: { clinicId, isActive: true } });
  if (current >= limit) {
    return NextResponse.json(
      {
        error: `Límite del plan ${plan.name}: ${limit} médico${limit === 1 ? '' : 's'}. Mejora tu plan para agregar más.`,
        code: 'PLAN_LIMIT_DOCTORS',
        limit,
        current,
        plan: plan.id,
        upgradeUrl: '/dashboard/billing',
      },
      { status: 402 }
    );
  }
  return null;
}

/**
 * Check if the user can add one more clinic (branch).
 */
export async function assertCanAddClinic(userPlan: string, userId: string) {
  const plan = getPlan(userPlan);
  const limit = plan.limits.maxClinics;
  if (limit === -1) return null;

  const current = await db.clinic.count({ where: { ownerId: userId } });
  if (current >= limit) {
    return NextResponse.json(
      {
        error: `Límite del plan ${plan.name}: ${limit} sucursal${limit === 1 ? '' : 'es'}. Mejora tu plan para agregar más.`,
        code: 'PLAN_LIMIT_CLINICS',
        limit,
        current,
        plan: plan.id,
        upgradeUrl: '/dashboard/billing',
      },
      { status: 402 }
    );
  }
  return null;
}

/**
 * Check if the user can add one more team member.
 */
export async function assertCanAddTeamMember(userPlan: string, clinicId: string) {
  const plan = getPlan(userPlan);
  const limit = plan.limits.maxUsers;
  if (limit === -1) return null;

  // Count ClinicMember records + the owner (1)
  const [members, owner] = await Promise.all([
    db.clinicMember.count({ where: { clinicId } }),
    db.clinic.count({ where: { id: clinicId } }),
  ]);
  const current = members + (owner > 0 ? 1 : 0);
  if (current >= limit) {
    return NextResponse.json(
      {
        error: `Límite del plan ${plan.name}: ${limit} usuario${limit === 1 ? '' : 's'}. Mejora tu plan para invitar más.`,
        code: 'PLAN_LIMIT_USERS',
        limit,
        current,
        plan: plan.id,
        upgradeUrl: '/dashboard/billing',
      },
      { status: 402 }
    );
  }
  return null;
}

/**
 * Check if the user's clinic can send one more WhatsApp reminder THIS MONTH.
 * Returns null if OK, or a NextResponse 402 if the monthly credit limit is hit.
 * Counts AuditLog entries with action='WHATSAPP_REMINDER_SENT' this month.
 */
export async function assertCanSendWhatsAppReminder(userPlan: string, clinicId: string) {
  const plan = getPlan(userPlan);
  const limit = plan.limits.reminderCreditsPerMonth;
  if (limit === -1) return null; // unlimited

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const current = await db.auditLog.count({
    where: {
      clinicId,
      action: 'WHATSAPP_REMINDER_SENT',
      createdAt: { gte: startOfMonth, lte: endOfMonth },
    },
  });

  if (current >= limit) {
    return NextResponse.json(
      {
        error: `Límite del plan ${plan.name}: ${limit} recordatorios WhatsApp al mes. Mejora tu plan para enviar más.`,
        code: 'PLAN_LIMIT_WHATSAPP',
        limit,
        current,
        plan: plan.id,
        upgradeUrl: '/dashboard/billing',
      },
      { status: 402 }
    );
  }
  return null;
}

/**
 * Check feature flag for current plan.
 * Returns NextResponse 402 if feature is disabled.
 */
export function assertFeature(userPlan: string, feature: keyof ReturnType<typeof getPlan>['limits'], label: string) {
  const plan = getPlan(userPlan);
  const limits = plan.limits as Record<string, unknown>;
  if (!limits[feature as string]) {
    return NextResponse.json(
      {
        error: `Función "${label}" disponible a partir del plan Pro. Mejora tu plan para acceder.`,
        code: 'PLAN_FEATURE_LOCKED',
        plan: plan.id,
        upgradeUrl: '/dashboard/billing',
      },
      { status: 402 }
    );
  }
  return null;
}
