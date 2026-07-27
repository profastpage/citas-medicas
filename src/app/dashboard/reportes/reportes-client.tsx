'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import type { Plan } from '@/lib/plans';
import { BarChart3, TrendingUp, Users, DollarSign, Lock, Crown } from 'lucide-react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  clinicName: string;
  isSuperAdmin?: boolean;
  data: {
    totalAppointments: number;
    totalRevenue: number;
    appointmentsByStatus: Record<string, number>;
    revenueByDoctor: Array<{ name: string; specialty: string; appointments: number; revenue: number }>;
    revenueByDay: Array<{ date: string; appointments: number; revenue: number }>;
  };
}

const STATUS_COLORS: Record<string, string> = {
  pendiente: '#facc15',
  confirmada: '#3b82f6',
  en_atencion: '#a855f7',
  finalizada: '#10b981',
  cancelada: '#ef4444',
  no_asistio: '#6b7280',
};

const STATUS_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  en_atencion: 'En atención',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
  no_asistio: 'No asistió',
};

export function ReportesClient(props: Props) {
  const { user, plan, clinicName, isSuperAdmin, data } = props;

  if (!plan.limits.hasAdvancedReports) {
    return (
      <DashboardShell user={user} plan={plan} clinicName={clinicName} isSuperAdmin={isSuperAdmin}>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold">Reportes avanzados es una función Premium</h2>
            <p className="text-white/60">
              Incluye gráficos de ingresos por médico, evolución de citas y análisis de ocupación.
              Disponible desde el plan Premium (S/ 99/mes).
            </p>
            <Link href="/dashboard/billing">
              <button className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90">
                <Crown className="w-4 h-4 inline mr-2" />
                Mejorar a Premium
              </button>
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const pieData = Object.entries(data.appointmentsByStatus).map(([k, v]) => ({
    name: STATUS_LABELS[k] || k,
    value: v,
    color: STATUS_COLORS[k] || '#6b7280',
  }));

  return (
    <DashboardShell user={user} plan={plan} clinicName={clinicName} isSuperAdmin={isSuperAdmin}>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Reportes</h1>
          <p className="text-white/60 text-sm mt-1">Últimos 30 días</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi icon={BarChart3} label="Citas (30 días)" value={data.totalAppointments.toString()} color="#0ea5e9" />
          <Kpi icon={DollarSign} label="Ingresos (30 días)" value={`S/ ${data.totalRevenue.toFixed(0)}`} color="#10b981" />
          <Kpi icon={TrendingUp} label="Ticket promedio" value={`S/ ${data.totalAppointments > 0 ? (data.totalRevenue / data.totalAppointments).toFixed(0) : 0}`} color="#d4af37" />
          <Kpi icon={Users} label="Médicos activos" value={data.revenueByDoctor.filter(d => d.appointments > 0).length.toString()} color="#a855f7" />
        </div>

        {/* Evolución diaria */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold mb-4">Evolución de citas e ingresos (30 días)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={d => format(new Date(d), 'dd/MM', { locale: es })}
              />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelFormatter={d => format(new Date(d), 'dd/MM/yyyy', { locale: es })}
              />
              <Line type="monotone" dataKey="appointments" stroke="#0ea5e9" strokeWidth={2} name="Citas" />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Ingresos S/" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Por médico */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold mb-4">Citas por médico</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.revenueByDoctor} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                />
                <Bar dataKey="appointments" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Estados */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="font-bold mb-4">Distribución por estado</h2>
            {pieData.length === 0 ? (
              <p className="text-white/40 text-center py-12">Sin datos suficientes</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tabla de médicos */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold mb-4">Ranking de médicos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-xs uppercase">
                  <th className="text-left p-2">Médico</th>
                  <th className="text-left p-2">Especialidad</th>
                  <th className="text-center p-2">Citas</th>
                  <th className="text-right p-2">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {data.revenueByDoctor
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((d, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="p-2">{d.name}</td>
                      <td className="p-2 text-white/60">{d.specialty}</td>
                      <td className="p-2 text-center">{d.appointments}</td>
                      <td className="p-2 text-right text-emerald-400 font-bold">S/ {d.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Kpi({ icon: Icon, label, value, color }: { icon: typeof BarChart3; label: string; value: string; color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/40">{label}</span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20`, color }}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
