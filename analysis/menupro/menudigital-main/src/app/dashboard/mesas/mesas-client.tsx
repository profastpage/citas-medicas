'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, RefreshCw, Trash2, Users, X, Utensils, Crown, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PremiumGate } from '@/components/dashboard/premium-gate';
import type { Plan, PlanId } from '@/lib/plans';

interface Mesa {
  id: string;
  number: number;
  name: string | null;
  capacity: number;
  status: 'libre' | 'ocupada' | 'reservada' | 'inactiva';
  location: string | null;
  is_active: boolean;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  isSuperAdmin: boolean;
}

const STATUS_CONFIG = {
  libre: { label: 'Libre', color: '#06d6a0', bg: 'rgba(6,214,160,0.15)' },
  ocupada: { label: 'Ocupada', color: '#e63946', bg: 'rgba(230,57,70,0.15)' },
  reservada: { label: 'Reservada', color: '#d4af37', bg: 'rgba(212,175,55,0.15)' },
  inactiva: { label: 'Inactiva', color: '#6b7280', bg: 'rgba(107,114,128,0.15)' },
};

export function MesasClient({ user, plan, isSuperAdmin }: Props) {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newMesa, setNewMesa] = useState({ number: '', name: '', capacity: '4', location: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/mesas');
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      const data = await res.json();
      setMesas(data.tables || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (plan.limits.hasTables) load();
  }, [plan.limits.hasTables, load]);

  // Si no tiene acceso premium, mostrar gate
  if (!plan.limits.hasTables) {
    return (
      <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
        <PremiumGate
          requiredPlan="premium"
          userPlan={plan.id as PlanId}
          featureName="Gestión de Mesas"
          featureIcon={<Utensils className="w-8 h-8 text-[#9d4edd]" />}
          description="Administra las mesas de tu restaurante: estados (libre/ocupada/reservada), capacidad, ubicación y más. Las mesas se vinculan automáticamente con las comandas."
        />
      </DashboardShell>
    );
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/mesas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: parseInt(newMesa.number),
          name: newMesa.name || undefined,
          capacity: parseInt(newMesa.capacity) || 4,
          location: newMesa.location || undefined,
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Mesa creada');
      setNewMesa({ number: '', name: '', capacity: '4', location: '' });
      setShowAdd(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleStatusChange(id: string, status: Mesa['status']) {
    try {
      const res = await fetch(`/api/mesas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Estado actualizado');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta mesa?')) return;
    try {
      const res = await fetch(`/api/mesas/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Mesa eliminada');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  // Stats
  const stats = {
    total: mesas.length,
    libres: mesas.filter(m => m.status === 'libre').length,
    ocupadas: mesas.filter(m => m.status === 'ocupada').length,
    reservadas: mesas.filter(m => m.status === 'reservada').length,
  };

  return (
    <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Mesas</h1>
          <p className="text-white/60 text-sm">
            Gestiona las mesas de tu restaurante · {stats.total} mesas · {stats.libres} libres · {stats.ocupadas} ocupadas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refrescar
          </Button>
          <Button
            size="sm"
            onClick={() => setShowAdd(true)}
            disabled={plan.limits.maxTables !== -1 && mesas.length >= plan.limits.maxTables}
            style={{ background: 'linear-gradient(to right, #9d4edd, #c77dff)', color: 'white' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva mesa
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" value={stats.total} color="#9d4edd" />
        <StatCard label="Libres" value={stats.libres} color="#06d6a0" />
        <StatCard label="Ocupadas" value={stats.ocupadas} color="#e63946" />
        <StatCard label="Reservadas" value={stats.reservadas} color="#d4af37" />
      </div>

      {/* ───────── Contador de límite (banner) ───────── */}
      {(() => {
        const maxTables = plan.limits.maxTables;
        const isUnlimited = maxTables === -1;
        if (isUnlimited) {
          return (
            <div className="mb-6 rounded-2xl border border-[#e63946]/30 bg-[#e63946]/10 p-3 flex items-center gap-3">
              <Crown className="w-5 h-5 text-[#e63946] flex-shrink-0" />
              <div className="text-sm">
                <span className="font-semibold text-[#e63946]">Plan Full</span>
                <span className="text-white/60 ml-2">Mesas ilimitadas · {stats.total} creadas</span>
              </div>
            </div>
          );
        }
        const atLimit = mesas.length >= maxTables;
        const nearLimit = !atLimit && mesas.length >= maxTables * 0.8;
        const remaining = Math.max(0, maxTables - mesas.length);
        return (
          <div
            className={`mb-6 rounded-2xl border p-4 flex items-center justify-between flex-wrap gap-3 ${
              atLimit
                ? 'border-red-500/40 bg-red-500/10'
                : nearLimit
                ? 'border-amber-500/40 bg-amber-500/10'
                : 'border-white/10 bg-white/[0.03]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  atLimit ? 'bg-red-500/20' : nearLimit ? 'bg-amber-500/20' : 'bg-white/5'
                }`}
              >
                {atLimit || nearLimit ? (
                  <AlertCircle className={`w-5 h-5 ${atLimit ? 'text-red-400' : 'text-amber-400'}`} />
                ) : (
                  <Utensils className="w-5 h-5 text-white/60" />
                )}
              </div>
              <div>
                <div className="text-sm font-semibold">
                  {mesas.length} / {maxTables} mesas usadas
                  {remaining > 0 && (
                    <span className="text-white/50 font-normal ml-1">· {remaining} restantes</span>
                  )}
                </div>
                <div className="text-xs text-white/50">
                  Plan {plan.name} · {atLimit ? 'Límite alcanzado' : nearLimit ? 'Cerca del límite' : 'Dentro del límite'}
                </div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="flex-1 max-w-xs min-w-[120px]">
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    atLimit ? 'bg-red-500' : nearLimit ? 'bg-amber-500' : 'bg-[#9d4edd]'
                  }`}
                  style={{ width: `${Math.min(100, (mesas.length / maxTables) * 100)}%` }}
                />
              </div>
            </div>

            {(atLimit || nearLimit) && (
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] text-xs font-semibold hover:opacity-90 transition"
              >
                <Crown className="w-3.5 h-3.5" />
                {plan.id === 'premium' ? 'Upgrade a Full (ilimitado)' : 'Upgrade a Premium'}
              </Link>
            )}
          </div>
        );
      })()}

      {/* Grid de mesas */}
      {loading ? (
        <div className="text-center py-12 text-white/40">Cargando mesas…</div>
      ) : mesas.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <Utensils className="w-12 h-12 mx-auto text-white/20 mb-3" />
          <p className="text-white/60 mb-2">No tienes mesas registradas</p>
          <Button onClick={() => setShowAdd(true)} style={{ background: '#9d4edd', color: 'white' }}>
            <Plus className="w-4 h-4 mr-2" />
            Crear primera mesa
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {mesas.map((mesa) => {
            const cfg = STATUS_CONFIG[mesa.status];
            return (
              <div
                key={mesa.id}
                className="rounded-2xl border p-4 relative group transition-all hover:scale-105"
                style={{ borderColor: `${cfg.color}40`, background: cfg.bg }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: cfg.color, color: '#0a0a14' }}
                  >
                    {cfg.label}
                  </span>
                  <button
                    onClick={() => handleDelete(mesa.id)}
                    className="opacity-0 group-hover:opacity-100 transition text-white/40 hover:text-red-400"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-3xl font-bold text-center my-3" style={{ color: cfg.color }}>
                  {mesa.number}
                </div>
                <div className="text-xs text-center text-white/80 mb-1">{mesa.name || `Mesa ${mesa.number}`}</div>
                <div className="flex items-center justify-center gap-1 text-[10px] text-white/60">
                  <Users className="w-3 h-3" />
                  {mesa.capacity} pers.
                </div>
                {mesa.location && (
                  <div className="text-[10px] text-center text-white/40 mt-1">{mesa.location}</div>
                )}

                {/* Selector de estado */}
                <select
                  value={mesa.status}
                  onChange={(e) => handleStatusChange(mesa.id, e.target.value as Mesa['status'])}
                  className="w-full mt-3 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white"
                >
                  <option value="libre">Libre</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="reservada">Reservada</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal agregar */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f1a] border border-white/15 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Nueva mesa</h3>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label>Número *</Label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={newMesa.number}
                  onChange={(e) => setNewMesa({ ...newMesa, number: e.target.value })}
                  placeholder="1"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div>
                <Label>Nombre (opcional)</Label>
                <Input
                  value={newMesa.name}
                  onChange={(e) => setNewMesa({ ...newMesa, name: e.target.value })}
                  placeholder="Terraza, Salón principal…"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Capacidad</Label>
                  <Input
                    type="number"
                    min="1"
                    value={newMesa.capacity}
                    onChange={(e) => setNewMesa({ ...newMesa, capacity: e.target.value })}
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label>Ubicación</Label>
                  <Input
                    value={newMesa.location}
                    onChange={(e) => setNewMesa({ ...newMesa, location: e.target.value })}
                    placeholder="2do piso…"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAdd(false)} className="flex-1 bg-transparent border-white/20">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" style={{ background: '#9d4edd', color: 'white' }}>
                  Crear mesa
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
      <div className="text-2xl sm:text-3xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs text-white/60 mt-1">{label}</div>
    </div>
  );
}
