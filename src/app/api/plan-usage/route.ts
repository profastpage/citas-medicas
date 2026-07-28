// ============================================================
// GET /api/plan-usage
// Devuelve el uso actual vs límite del plan para el clinic activo.
// Usado por PlanUsageBadge en cada sección del dashboard.
// ============================================================
import { NextResponse } from 'next/server';
import { getCurrentUser, getActiveClinicId } from '@/lib/auth';
import { db } from '@/lib/db';
import { getPlan } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const clinicId = await getActiveClinicId(user.id);
  if (!clinicId) {
    return NextResponse.json({ error: 'Sin clínica activa' }, { status: 400 });
  }

  const plan = getPlan(user.plan);

  // Cálculo de mes actual para citas
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [
    patientsCount,
    doctorsCount,
    appointmentsThisMonth,
    clinicsCount,
    teamMembersCount,
  ] = await Promise.all([
    db.patient.count({ where: { clinicId, isActive: true } }),
    db.doctor.count({ where: { clinicId, isActive: true } }),
    db.appointment.count({
      where: {
        clinicId,
        appointmentDate: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
    db.clinic.count({ where: { ownerId: user.id } }),
    db.clinicMember.count({ where: { clinicId } }),
  ]);

  // +1 por el owner en team members
  const totalTeam = teamMembersCount + 1;

  const buildUsage = (current: number, limit: number) => {
    if (limit === -1) {
      return {
        current,
        limit: -1,
        limitLabel: '∞',
        percent: 0,
        unlimited: true,
        atLimit: false,
        nearLimit: false,
      };
    }
    const percent = limit > 0 ? Math.min(100, Math.round((current / limit) * 100)) : 0;
    const atLimit = current >= limit;
    return {
      current,
      limit,
      limitLabel: String(limit),
      percent,
      unlimited: false,
      atLimit,
      nearLimit: percent >= 80 && !atLimit,
    };
  };

  return NextResponse.json({
    plan: { id: plan.id, name: plan.name, color: plan.color },
    usage: {
      patients: buildUsage(patientsCount, plan.limits.maxPatients),
      doctors: buildUsage(doctorsCount, plan.limits.maxDoctors),
      appointments: buildUsage(appointmentsThisMonth, plan.limits.maxAppointmentsPerMonth),
      clinics: buildUsage(clinicsCount, plan.limits.maxClinics),
      team: buildUsage(totalTeam, plan.limits.maxUsers),
    },
    features: {
      hasCashManagement: plan.limits.hasCashManagement,
      hasInventory: plan.limits.hasInventory,
      hasWhatsAppReminders: plan.limits.hasWhatsAppReminders,
      hasAdvancedReports: plan.limits.hasAdvancedReports,
      hasMultiBranch: plan.limits.hasMultiBranch,
      hasWhiteLabel: plan.limits.hasWhiteLabel,
      hasAPI: plan.limits.hasAPI,
      hasAuditLog: plan.limits.hasAuditLog,
    },
  });
}
