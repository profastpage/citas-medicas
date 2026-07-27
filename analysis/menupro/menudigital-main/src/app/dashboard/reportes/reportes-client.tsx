'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrendingUp, Users, Utensils, Clock, Building2, Receipt,
  RefreshCw, Download, Calendar, BarChart3, Award, ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PremiumGate } from '@/components/dashboard/premium-gate';
import { toast } from 'sonner';
import type { Plan, PlanId } from '@/lib/plans';

interface DataReporte {
  rango: { from: string; to: string; dias: number };
  kpis: {
    total_ventas: number;
    num_comandas: number;
    ticket_promedio: number;
    num_mesas_usadas: number;
    num_platos_vendidos: number;
  };
  por_mozo: {
    waiter_id: string; waiter_name: string;
    num_comandas: number; total_ventas: number; ticket_promedio: number;
  }[];
  por_plato: {
    menu_item_id: string; menu_item_name: string;
    cantidad: number; total_ventas: number; num_comandas: number;
  }[];
  por_sucursal: {
    branch_id: string | null; branch_name: string;
    num_comandas: number; total_ventas: number;
  }[];
  por_hora: { hora: number; num_comandas: number; total_ventas: number }[];
  por_dia: { fecha: string; num_comandas: number; total_ventas: number }[];
  por_tipo: { tipo: string; num_comandas: number; total_ventas: number }[];
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  isSuperAdmin: boolean;
  branches: { id: string; name: string }[];
}

type RangePreset = '7d' | '30d' | '90d' | 'month';

export function ReportesClient({ user, plan, isSuperAdmin, branches }: Props) {
  const [data, setData] = useState<DataReporte | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangePreset>('30d');
  const [branchId, setBranchId] = useState<string>('');
  const [view, setView] = useState<'mozos' | 'platos' | 'sucursales' | 'horas'>('mozos');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const now = new Date();
      const start = new Date();
      if (range === '7d') start.setDate(now.getDate() - 7);
      else if (range === '30d') start.setDate(now.getDate() - 30);
      else if (range === '90d') start.setDate(now.getDate() - 90);
      else if (range === 'month') {
        start.setDate(1);
        start.setMonth(start.getMonth());
      }
      params.set('from', start.toISOString().slice(0, 10));
      params.set('to', now.toISOString().slice(0, 10));
      if (branchId) params.set('branch_id', branchId);

      const res = await fetch(`/api/reportes?${params}`);
      if (!res.ok) throw new Error('Error cargando reportes');
      const d = await res.json();
      setData(d);
    } catch (err) {
      toast.error('Error cargando reportes');
    } finally {
      setLoading(false);
    }
  }, [range, branchId]);

  useEffect(() => {
    if (plan.limits.hasAdvancedReports) load();
  }, [plan.limits.hasAdvancedReports, load]);

  // ───── Gate: solo plan Full ─────
  if (!plan.limits.hasAdvancedReports) {
    return (
      <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
        <PremiumGate
          requiredPlan="full"
          userPlan={plan.id as PlanId}
          featureName="Reportes Avanzados"
          featureIcon={<BarChart3 className="w-8 h-8 text-[#e63946]" />}
          description="Analiza las ventas por mozo, plato, sucursal y hora del día. Identifica tus mejores horas pico, top platos y mozos estrella. Toma decisiones con datos reales."
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#e63946]" />
              Reportes avanzados
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Análisis de ventas por mozo, plato, sucursal y hora
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={range}
              onChange={e => setRange(e.target.value as RangePreset)}
              className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="month">Este mes</option>
            </select>
            {branches.length > 0 && (
              <select
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-2"
              >
                <option value="">Todas las sucursales</option>
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={load}
              disabled={loading}
              className="border-white/10 text-white hover:bg-white/5"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 animate-spin text-white/40" />
          </div>
        ) : !data ? (
          <div className="text-center py-20 text-white/40">Sin datos</div>
        ) : (
          <>
            {/* ───── KPIs ───── */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <KpiCard
                label="Ventas totales"
                value={`S/ ${data.kpis.total_ventas.toFixed(2)}`}
                icon={<TrendingUp className="w-4 h-4" />}
                color="#06d6a0"
              />
              <KpiCard
                label="Comandas"
                value={String(data.kpis.num_comandas)}
                icon={<Receipt className="w-4 h-4" />}
                color="#118ab2"
              />
              <KpiCard
                label="Ticket prom."
                value={`S/ ${data.kpis.ticket_promedio.toFixed(2)}`}
                icon={<ShoppingBag className="w-4 h-4" />}
                color="#d4af37"
              />
              <KpiCard
                label="Platos vendidos"
                value={String(data.kpis.num_platos_vendidos)}
                icon={<Utensils className="w-4 h-4" />}
                color="#9d4edd"
              />
              <KpiCard
                label="Mesas usadas"
                value={String(data.kpis.num_mesas_usadas)}
                icon={<Users className="w-4 h-4" />}
                color="#e63946"
              />
            </div>

            {/* ───── Tabs ───── */}
            <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
              <TabBtn active={view === 'mozos'} onClick={() => setView('mozos')} icon={<Users className="w-4 h-4" />}>
                Por mozo
              </TabBtn>
              <TabBtn active={view === 'platos'} onClick={() => setView('platos')} icon={<Utensils className="w-4 h-4" />}>
                Por plato
              </TabBtn>
              {plan.limits.hasMultiBranch && (
                <TabBtn active={view === 'sucursales'} onClick={() => setView('sucursales')} icon={<Building2 className="w-4 h-4" />}>
                  Por sucursal
                </TabBtn>
              )}
              <TabBtn active={view === 'horas'} onClick={() => setView('horas')} icon={<Clock className="w-4 h-4" />}>
                Por hora
              </TabBtn>
            </div>

            {/* ───── Contenido ───── */}
            {view === 'mozos' && <PorMozoView data={data.por_mozo} />}
            {view === 'platos' && <PorPlatoView data={data.por_plato} />}
            {view === 'sucursales' && plan.limits.hasMultiBranch && <PorSucursalView data={data.por_sucursal} />}
            {view === 'horas' && <PorHoraView data={data.por_hora} />}

            {/* ───── Por día (siempre visible) ───── */}
            <PorDiaView data={data.por_dia} />
          </>
        )}
      </div>
    </DashboardShell>
  );
}

// ────────────────────────────────────────────────────────────────
// COMPONENTES
// ────────────────────────────────────────────────────────────────

function KpiCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 text-white/50 text-xs mb-2">
        <span style={{ color }}>{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <div className="text-xl font-bold text-white truncate">{value}</div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
        active ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function PorMozoView({ data }: { data: DataReporte['por_mozo'] }) {
  if (data.length === 0) {
    return <EmptyState text="No hay comandas con mozo asignado en este período" />;
  }
  const maxVentas = Math.max(...data.map(d => d.total_ventas), 1);
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-[#d4af37]" />
        <h3 className="text-white font-semibold">Ranking de mozos</h3>
      </div>
      <div className="space-y-3">
        {data.map((m, i) => (
          <div key={m.waiter_id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-[#d4af37] text-black' :
                  i === 1 ? 'bg-[#c0c0c0] text-black' :
                  i === 2 ? 'bg-[#cd7f32] text-white' :
                  'bg-white/5 text-white/60'
                }`}>{i + 1}</span>
                <span className="text-white">{m.waiter_name}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <span className="text-xs">{m.num_comandas} comandas</span>
                <span className="text-xs">ticket S/ {m.ticket_promedio.toFixed(2)}</span>
                <span className="text-white font-semibold">S/ {m.total_ventas.toFixed(2)}</span>
              </div>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#9d4edd] to-[#d4af37] rounded-full"
                style={{ width: `${(m.total_ventas / maxVentas) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PorPlatoView({ data }: { data: DataReporte['por_plato'] }) {
  if (data.length === 0) {
    return <EmptyState text="No hay platos vendidos en este período" />;
  }
  const maxCant = Math.max(...data.map(d => d.cantidad), 1);
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="w-5 h-5 text-[#9d4edd]" />
        <h3 className="text-white font-semibold">Top platos vendidos</h3>
      </div>
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {data.slice(0, 30).map((p, i) => (
          <div key={p.menu_item_id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs w-6">#{i + 1}</span>
                <span className="text-white truncate max-w-[300px]">{p.menu_item_name}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <span className="text-xs">{p.cantidad} u.</span>
                <span className="text-white font-semibold">S/ {p.total_ventas.toFixed(2)}</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#06d6a0] to-[#118ab2] rounded-full"
                style={{ width: `${(p.cantidad / maxCant) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PorSucursalView({ data }: { data: DataReporte['por_sucursal'] }) {
  if (data.length === 0) {
    return <EmptyState text="No hay comandas en este período" />;
  }
  const maxVentas = Math.max(...data.map(d => d.total_ventas), 1);
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-[#e63946]" />
        <h3 className="text-white font-semibold">Ventas por sucursal</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {data.map(s => (
          <div key={s.branch_id || 'main'} className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">{s.branch_name}</span>
              <span className="text-white font-bold text-lg">S/ {s.total_ventas.toFixed(2)}</span>
            </div>
            <div className="text-xs text-white/50 mb-2">
              {s.num_comandas} comandas · ticket S/ {(s.num_comandas > 0 ? s.total_ventas / s.num_comandas : 0).toFixed(2)}
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#e63946] to-[#d4af37] rounded-full"
                style={{ width: `${(s.total_ventas / maxVentas) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PorHoraView({ data }: { data: DataReporte['por_hora'] }) {
  const maxComandas = Math.max(...data.map(d => d.num_comandas), 1);
  const hoursWithSales = data.filter(d => d.num_comandas > 0);
  const peakHour = data.reduce((max, d) => d.num_comandas > max.num_comandas ? d : max, data[0]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#118ab2]" />
          <h3 className="text-white font-semibold">Ventas por hora del día</h3>
        </div>
        {peakHour && peakHour.num_comandas > 0 && (
          <span className="text-xs text-white/60">
            Hora pico: <span className="text-[#d4af37] font-semibold">{String(peakHour.hora).padStart(2, '0')}:00</span> ({peakHour.num_comandas} comandas)
          </span>
        )}
      </div>
      <div className="flex items-end gap-1 h-48">
        {data.map(d => (
          <div key={d.hora} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
              {d.num_comandas > 0 ? `${d.num_comandas}` : ''}
            </div>
            <div
              className={`w-full rounded-t transition-all ${
                d.num_comandas > 0
                  ? d.num_comandas === maxComandas
                    ? 'bg-gradient-to-t from-[#e63946] to-[#d4af37]'
                    : 'bg-gradient-to-t from-[#118ab2] to-[#06d6a0]'
                  : 'bg-white/5'
              }`}
              style={{ height: `${Math.max(d.num_comandas > 0 ? 8 : 2, (d.num_comandas / maxComandas) * 140)}px` }}
              title={`${String(d.hora).padStart(2, '0')}:00 — ${d.num_comandas} comandas, S/ ${d.total_ventas.toFixed(2)}`}
            />
            <div className="text-[9px] text-white/40">{d.hora}</div>
          </div>
        ))}
      </div>
      {hoursWithSales.length === 0 && (
        <p className="text-center text-white/40 py-6">Sin ventas registradas en este período</p>
      )}
    </div>
  );
}

function PorDiaView({ data }: { data: DataReporte['por_dia'] }) {
  if (data.length === 0) {
    return <EmptyState text="Sin datos diarios" />;
  }
  const maxVentas = Math.max(...data.map(d => d.total_ventas), 1);
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-[#06d6a0]" />
        <h3 className="text-white font-semibold">Ventas por día</h3>
      </div>
      <div className="flex items-end gap-1 h-32 overflow-x-auto">
        {data.map(d => (
          <div key={d.fecha} className="flex-1 min-w-[6px] flex flex-col items-center group relative">
            <div
              className="w-full rounded-t bg-gradient-to-t from-[#06d6a0] to-[#118ab2] hover:from-[#d4af37] hover:to-[#e63946] transition-all"
              style={{ height: `${Math.max(4, (d.total_ventas / maxVentas) * 100)}px` }}
              title={`${d.fecha} — ${d.num_comandas} comandas, S/ ${d.total_ventas.toFixed(2)}`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2 text-[10px] text-white/40">
        <span>{data[0]?.fecha}</span>
        <span>{data[data.length - 1]?.fecha}</span>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
      <BarChart3 className="w-10 h-10 text-white/20 mx-auto mb-3" />
      <p className="text-white/40 text-sm">{text}</p>
    </div>
  );
}
