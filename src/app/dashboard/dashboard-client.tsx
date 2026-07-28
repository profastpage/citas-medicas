'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import type { Plan } from '@/lib/plans';
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { PlanUsageBadge, PlanExpiryBanner } from '@/components/dashboard/plan-usage-badge';

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  clinicName: string;
  isSuperAdmin?: boolean;
  stats: {
    patientsCount: number;
    doctorsCount: number;
    appointmentsToday: number;
    appointmentsThisMonth: number;
    revenueToday: number;
    revenueThisMonth: number;
    pendingAppointments: number;
  };
  upcoming: Array<{
    id: string;
    date: string;
    patientName: string;
    doctorName: string;
    serviceName: string | null;
    status: string;
  }>;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  confirmada: { label: 'Confirmada', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  en_atencion: { label: 'En atención', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  finalizada: { label: 'Finalizada', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  cancelada: { label: 'Cancelada', color: 'bg-red-100 text-red-800 border-red-300' },
  no_asistio: { label: 'No asistió', color: 'bg-gray-100 text-gray-800 border-gray-300' },
};

export function DashboardClient({
  user,
  plan,
  clinicName,
  isSuperAdmin,
  stats,
  upcoming,
}: Props) {
  const formatPEN = (n: number) =>
    `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <DashboardShell
      user={user}
      plan={plan}
      clinicName={clinicName}
      isSuperAdmin={isSuperAdmin}
    >
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner de expiración del plan (si está por vencer) */}
        <PlanExpiryBanner />

        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Hola, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Dashboard de {clinicName} · {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>

        {/* Plan usage summary — muestra límites por plan automáticamente */}
        <div className="space-y-3">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Uso de tu plan {plan.name}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            <PlanUsageBadge resource="appointments" label="Citas / mes" />
            <PlanUsageBadge resource="patients" label="Pacientes" />
            <PlanUsageBadge resource="doctors" label="Médicos" />
            <PlanUsageBadge resource="team" label="Equipo" />
            <PlanUsageBadge resource="clinics" label="Sucursales" />
            <PlanUsageBadge resource="whatsapp" label="WhatsApp / mes" />
            <PlanUsageBadge resource="storage" label="Almacenamiento" />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Calendar}
            label="Citas hoy"
            value={stats.appointmentsToday.toString()}
            sublabel={`${stats.pendingAppointments} pendientes`}
            color="#0ea5e9"
          />
          <StatCard
            icon={Users}
            label="Pacientes"
            value={stats.patientsCount.toString()}
            sublabel="Activos"
            color="#10b981"
          />
          <StatCard
            icon={Stethoscope}
            label="Médicos"
            value={stats.doctorsCount.toString()}
            sublabel="Activos"
            color="#a855f7"
          />
          <StatCard
            icon={DollarSign}
            label="Ingresos hoy"
            value={formatPEN(stats.revenueToday)}
            sublabel={`${formatPEN(stats.revenueThisMonth)} este mes`}
            color="#d4af37"
          />
        </div>

        {/* Próximas citas */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-base sm:text-lg">Próximas citas</h2>
              <p className="text-muted-foreground/70 text-xs sm:text-sm">Siguientes 5 citas programadas</p>
            </div>
            <Link
              href="/dashboard/citas"
              className="text-[#0ea5e9] text-xs sm:text-sm hover:underline whitespace-nowrap"
            >
              Ver todas →
            </Link>
          </div>

          {upcoming.length === 0 ? (
            <div className="py-8 sm:py-12 text-center text-muted-foreground/70">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No tienes citas programadas</p>
              <Link
                href="/dashboard/citas"
                className="text-[#0ea5e9] text-sm hover:underline mt-2 inline-block"
              >
                Crear primera cita
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.map(apt => {
                const status = STATUS_LABELS[apt.status] ?? STATUS_LABELS.pendiente;
                const date = new Date(apt.date);
                return (
                  <div
                    key={apt.id}
                    className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg bg-muted/30 border border-border/60 hover:border-border transition"
                  >
                    <div className="text-center min-w-[50px] sm:min-w-[60px]">
                      <div className="text-[10px] sm:text-xs text-muted-foreground/70">
                        {date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                      </div>
                      <div className="text-base sm:text-lg font-bold text-[#0ea5e9]">
                        {date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">{apt.patientName}</div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground/70 truncate">
                        {apt.doctorName} · {apt.serviceName ?? 'Sin servicio'}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] sm:text-xs border whitespace-nowrap ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Accesos rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <QuickAccess
            href="/dashboard/citas"
            icon={Calendar}
            title="Nueva cita"
            desc="Agenda una cita"
            color="#0ea5e9"
          />
          <QuickAccess
            href="/dashboard/pacientes"
            icon={Users}
            title="Nuevo paciente"
            desc="Registra un paciente"
            color="#10b981"
          />
          <QuickAccess
            href="/dashboard/billing"
            icon={TrendingUp}
            title="Mejorar plan"
            desc="Desbloquea más funciones"
            color="#d4af37"
          />
        </div>
      </div>
    </DashboardShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  sublabel: string;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] sm:text-xs text-muted-foreground/70 truncate">{label}</span>
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20`, color }}
        >
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      </div>
      <div className="text-lg sm:text-2xl font-bold">{value}</div>
      <div className="text-[10px] sm:text-xs text-muted-foreground/70 mt-1 truncate">{sublabel}</div>
    </div>
  );
}

function QuickAccess({
  href,
  icon: Icon,
  title,
  desc,
  color,
}: {
  href: string;
  icon: typeof Calendar;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:border-border hover:shadow-sm transition"
    >
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}20`, color }}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="min-w-0">
        <div className="font-bold text-sm sm:text-base">{title}</div>
        <div className="text-xs text-muted-foreground/70">{desc}</div>
      </div>
    </Link>
  );
}
