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

  // Cálculo de mes actual para citas y WhatsApp
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Conteos paralelos
  const [
    patientsCount,
    doctorsCount,
    appointmentsThisMonth,
    clinicsCount,
    teamMembersCount,
    whatsappSentThisMonth,
    storageAgg,
    allClinics,
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
    // WhatsApp: contamos AuditLog entries con action='WHATSAPP_REMINDER_SENT' este mes.
    // Cada vez que se envía un recordatorio (vía /api/appointments/[id]/send-reminder)
    // se inserta un AuditLog, que es el contador canónico del plan.
    db.auditLog.count({
      where: {
        clinicId,
        action: 'WHATSAPP_REMINDER_SENT',
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
    // Storage: sumar fileSize de todos los PatientFile del clinic.
    // Es solo un aggregate SQL — NO es un servicio externo, no tiene costo adicional.
    // Supabase free tier incluye 1GB storage que cubre todos los plan tiers.
    db.patientFile.aggregate({
      where: { clinicId },
      _sum: { fileSize: true },
    }),
    // Lista todas las clínicas del usuario (para multi-sucursal)
    db.clinic.findMany({
      where: { ownerId: user.id },
      select: { id: true, name: true, slug: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  // +1 por el owner en team members
  const totalTeam = teamMembersCount + 1;

  // Storage: convertir bytes a MB
  const storageBytes = storageAgg._sum.fileSize ?? 0;
  const storageMb = Math.round((storageBytes / (1024 * 1024)) * 100) / 100;

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

  // Plan expiry calculation
  const expiryInfo = (() => {
    if (!user.currentPeriodEnd) return null;
    const end = new Date(user.currentPeriodEnd);
    const msDiff = end.getTime() - now.getTime();
    const daysDiff = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
    return {
      currentPeriodEnd: end.toISOString(),
      daysRemaining: daysDiff,
      isExpiringSoon: daysDiff > 0 && daysDiff <= 7,
      isExpired: daysDiff <= 0,
    };
  })();

  return NextResponse.json({
    plan: { id: plan.id, name: plan.name, color: plan.color },
    usage: {
      patients: buildUsage(patientsCount, plan.limits.maxPatients),
      doctors: buildUsage(doctorsCount, plan.limits.maxDoctors),
      appointments: buildUsage(appointmentsThisMonth, plan.limits.maxAppointmentsPerMonth),
      clinics: buildUsage(clinicsCount, plan.limits.maxClinics),
      team: buildUsage(totalTeam, plan.limits.maxUsers),
      whatsapp: buildUsage(whatsappSentThisMonth, plan.limits.reminderCreditsPerMonth),
      storage: {
        ...buildUsage(storageMb, plan.limits.fileStorageMb),
        // Para storage, current lo mostramos en MB legible
        currentLabel: formatBytes(storageBytes),
        limitLabel:
          plan.limits.fileStorageMb === -1 ? '∞' : `${plan.limits.fileStorageMb} MB`,
      },
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
    expiry: expiryInfo,
    clinics: allClinics,
    activeClinicId: clinicId,
  });
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
