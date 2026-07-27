'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  RefreshCw,
  Trash2,
  X,
  UtensilsCrossed,
  QrCode,
  Copy,
  Phone,
  CreditCard,
  ToggleLeft,
  ToggleRight,
  Crown,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PremiumGate } from '@/components/dashboard/premium-gate';
import type { Plan, PlanId } from '@/lib/plans';

interface Waiter {
  id: string;
  full_name: string;
  document_id: string | null;
  phone: string | null;
  pin: string | null;
  is_active: boolean;
  qr_token: string | null;
  created_at: string;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  isSuperAdmin: boolean;
}

export function MozosClient({ user, plan, isSuperAdmin }: Props) {
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showQrFor, setShowQrFor] = useState<Waiter | null>(null);
  const [newMozo, setNewMozo] = useState({
    full_name: '',
    document_id: '',
    phone: '',
    pin: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/waiters');
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      const data = await res.json();
      setWaiters(data.waiters || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (plan.limits.hasWaiters) load();
  }, [plan.limits.hasWaiters, load]);

  // ─── Gating: si no tiene acceso Premium, mostrar gate ───
  if (!plan.limits.hasWaiters) {
    return (
      <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
        <PremiumGate
          requiredPlan="premium"
          userPlan={plan.id as PlanId}
          featureName="Gestión de Mozos"
          featureIcon={<UtensilsCrossed className="w-8 h-8 text-[#9d4edd]" />}
          description="Administra tu equipo de mozos: crea perfiles, asigna PINs para acceso rápido al POS, genera códigos QR para que cada mozo acceda a su panel móvil, y monitorea su actividad. Cada mozo podrá tomar comandas desde su celular."
        />
      </DashboardShell>
    );
  }

  // ─── Límites del plan ───
  const maxWaiters = plan.limits.maxWaiters;
  const isUnlimited = maxWaiters === -1;
  const atLimit = !isUnlimited && waiters.length >= maxWaiters;
  const nearLimit = !isUnlimited && !atLimit && waiters.length >= maxWaiters * 0.8;
  const remaining = isUnlimited ? null : Math.max(0, maxWaiters - waiters.length);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (atLimit) {
      toast.error(`Has alcanzado el límite de ${maxWaiters} mozos del plan ${plan.name}.`);
      return;
    }
    try {
      const res = await fetch('/api/waiters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: newMozo.full_name.trim(),
          document_id: newMozo.document_id.trim() || undefined,
          phone: newMozo.phone.trim() || undefined,
          pin: newMozo.pin.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Mozo creado');
      setNewMozo({ full_name: '', document_id: '', phone: '', pin: '' });
      setShowAdd(false);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleToggleActive(w: Waiter) {
    try {
      const res = await fetch(`/api/waiters/${w.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !w.is_active }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success(w.is_active ? 'Mozo desactivado' : 'Mozo activado');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleDelete(w: Waiter) {
    if (!confirm(`¿Eliminar a "${w.full_name}"? Esta acción no se puede deshacer.`)) return;
    try {
      const res = await fetch(`/api/waiters/${w.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Mozo eliminado');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleRegenerateQr(w: Waiter) {
    if (!confirm(`¿Generar un nuevo código QR para ${w.full_name}? El QR anterior dejará de funcionar.`)) return;
    try {
      // PATCH con flag especial para regenerar qr_token
      const res = await fetch(`/api/waiters/${w.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regenerate_qr: true }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Nuevo QR generado');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  function copyMozoUrl(w: Waiter) {
    if (!w.qr_token) return;
    const url = `${window.location.origin}/mozo/${w.qr_token}`;
    navigator.clipboard.writeText(url);
    toast.success('URL del panel del mozo copiada');
  }

  // Stats
  const stats = {
    total: waiters.length,
    active: waiters.filter((w) => w.is_active).length,
    inactive: waiters.filter((w) => !w.is_active).length,
    withQr: waiters.filter((w) => w.qr_token).length,
  };

  return (
    <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
      {/* ───────── Header + actions ───────── */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Mozos</h1>
          <p className="text-white/60 text-sm">
            Gestiona tu equipo · {stats.total} mozos · {stats.active} activos · {stats.inactive} inactivos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refrescar
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (atLimit) {
                toast.error(`Límite alcanzado (${maxWaiters} mozos). Upgrade para crear más.`);
                return;
              }
              setShowAdd(true);
            }}
            disabled={atLimit}
            style={{ background: 'linear-gradient(to right, #9d4edd, #c77dff)', color: 'white' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo mozo
          </Button>
        </div>
      </div>

      {/* ───────── Stats cards ───────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" value={stats.total} color="#9d4edd" />
        <StatCard label="Activos" value={stats.active} color="#06d6a0" />
        <StatCard label="Inactivos" value={stats.inactive} color="#6b7280" />
        <StatCard label="Con QR" value={stats.withQr} color="#d4af37" />
      </div>

      {/* ───────── Contador de límite (banner) ───────── */}
      {!isUnlimited && (
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
              {atLimit ? (
                <AlertCircle className="w-5 h-5 text-red-400" />
              ) : nearLimit ? (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              ) : (
                <UtensilsCrossed className="w-5 h-5 text-white/60" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold">
                {waiters.length} / {maxWaiters} mozos usados
                {remaining !== null && remaining > 0 && (
                  <span className="text-white/50 font-normal ml-1">· {remaining} restantes</span>
                )}
              </div>
              <div className="text-xs text-white/50">
                Plan {plan.name} · {atLimit ? 'Límite alcanzado' : nearLimit ? 'Cerca del límite' : 'Inside del límite'}
              </div>
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div className="flex-1 max-w-xs min-w-[120px]">
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  atLimit ? 'bg-red-500' : nearLimit ? 'bg-amber-500' : 'bg-[#9d4edd]'
                }`}
                style={{ width: `${Math.min(100, (waiters.length / maxWaiters) * 100)}%` }}
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
      )}

      {isUnlimited && (
        <div className="mb-6 rounded-2xl border border-[#e63946]/30 bg-[#e63946]/10 p-3 flex items-center gap-3">
          <Crown className="w-5 h-5 text-[#e63946] flex-shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-[#e63946]">Plan Full</span>
            <span className="text-white/60 ml-2">Mozos ilimitados · {stats.total} creados</span>
          </div>
        </div>
      )}

      {/* ───────── Grid de mozos ───────── */}
      {loading ? (
        <div className="text-center py-12 text-white/40">Cargando mozos…</div>
      ) : waiters.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <UtensilsCrossed className="w-12 h-12 mx-auto text-white/20 mb-3" />
          <p className="text-white/60 mb-2">No tienes mozos registrados</p>
          <p className="text-xs text-white/40 mb-4">
            Crea tu primer mozo para habilitar el panel móvil con QR y PIN de acceso rápido
          </p>
          <Button
            onClick={() => setShowAdd(true)}
            style={{ background: '#9d4edd', color: 'white' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear primer mozo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {waiters.map((w) => (
            <div
              key={w.id}
              className={`rounded-2xl border p-4 transition-all hover:scale-[1.02] ${
                w.is_active
                  ? 'border-[#9d4edd]/30 bg-[#9d4edd]/5'
                  : 'border-white/10 bg-white/[0.02] opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      w.is_active
                        ? 'bg-gradient-to-br from-[#9d4edd] to-[#c77dff] text-white'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {w.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{w.full_name}</div>
                    <div className="text-xs text-white/50">
                      {w.is_active ? (
                        <span className="text-[#06d6a0]">● Activo</span>
                      ) : (
                        <span className="text-white/40">● Inactivo</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(w)}
                  className="text-white/30 hover:text-red-400 transition p-1"
                  title="Eliminar mozo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Datos */}
              <div className="space-y-1.5 text-xs text-white/70 mb-3">
                {w.document_id && (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-3 h-3 text-white/40" />
                    <span className="font-mono">{w.document_id}</span>
                  </div>
                )}
                {w.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3 text-white/40" />
                    <span>{w.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-white/40">PIN:</span>
                  <span className="font-mono font-semibold">{w.pin || '—'}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-1 pt-2 border-t border-white/5">
                <button
                  onClick={() => setShowQrFor(w)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition"
                  title="Ver QR del mozo"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  QR
                </button>
                <button
                  onClick={() => copyMozoUrl(w)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition"
                  title="Copiar URL del panel"
                >
                  <Copy className="w-3.5 h-3.5" />
                  URL
                </button>
                <button
                  onClick={() => handleToggleActive(w)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/80 transition"
                  title={w.is_active ? 'Desactivar' : 'Activar'}
                >
                  {w.is_active ? (
                    <ToggleRight className="w-3.5 h-3.5 text-[#06d6a0]" />
                  ) : (
                    <ToggleLeft className="w-3.5 h-3.5 text-white/50" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ───────── Modal: Nuevo mozo ───────── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f1a] border border-white/15 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Nuevo mozo</h3>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label>Nombre completo *</Label>
                <Input
                  required
                  value={newMozo.full_name}
                  onChange={(e) => setNewMozo({ ...newMozo, full_name: e.target.value })}
                  placeholder="Juan Pérez"
                  className="bg-white/5 border-white/10"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>DNI / Documento</Label>
                  <Input
                    value={newMozo.document_id}
                    onChange={(e) => setNewMozo({ ...newMozo, document_id: e.target.value })}
                    placeholder="12345678"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    value={newMozo.phone}
                    onChange={(e) => setNewMozo({ ...newMozo, phone: e.target.value })}
                    placeholder="987 654 321"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
              <div>
                <Label>PIN de acceso rápido (4-6 dígitos)</Label>
                <Input
                  value={newMozo.pin}
                  onChange={(e) => setNewMozo({ ...newMozo, pin: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  placeholder="1234"
                  inputMode="numeric"
                  pattern="[0-9]{4,6}"
                  className="bg-white/5 border-white/10 font-mono"
                />
                <p className="text-[10px] text-white/40 mt-1">
                  PIN para login rápido en POS. El mozo también podrá acceder vía QR sin PIN.
                </p>
              </div>

              {/* Aviso de límite */}
              {!isUnlimited && (
                <div className="text-xs text-white/50 bg-white/[0.03] border border-white/10 rounded-lg p-2.5">
                  Quedan <span className="font-semibold text-white/80">{remaining}</span> mozos disponibles en tu plan {plan.name}.
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 bg-transparent border-white/20"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  style={{ background: '#9d4edd', color: 'white' }}
                >
                  Crear mozo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────── Modal: Ver QR del mozo ───────── */}
      {showQrFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f1a] border border-white/15 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">QR de {showQrFor.full_name}</h3>
                <p className="text-xs text-white/50 mt-0.5">Escanea para abrir el panel del mozo</p>
              </div>
              <button onClick={() => setShowQrFor(null)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4 mb-4 flex items-center justify-center">
              {showQrFor.qr_token ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                    `${typeof window !== 'undefined' ? window.location.origin : ''}/mozo/${showQrFor.qr_token}`
                  )}`}
                  alt={`QR ${showQrFor.full_name}`}
                  width={240}
                  height={240}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-[240px] h-[240px] flex items-center justify-center text-center text-xs text-gray-500">
                  Sin token QR.
                  <br />
                  Genera uno nuevo.
                </div>
              )}
            </div>

            {showQrFor.qr_token && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 mb-3 flex items-center gap-2">
                <code className="text-[10px] text-white/60 truncate flex-1 font-mono">
                  /mozo/{showQrFor.qr_token}
                </code>
                <button
                  onClick={() => copyMozoUrl(showQrFor)}
                  className="text-white/60 hover:text-white p-1"
                  title="Copiar URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleRegenerateQr(showQrFor)}
                className="flex-1 bg-transparent border-white/20"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Generar nuevo
              </Button>
              <Button
                onClick={() => setShowQrFor(null)}
                className="flex-1"
                style={{ background: '#9d4edd', color: 'white' }}
              >
                Cerrar
              </Button>
            </div>

            <p className="text-[10px] text-white/40 text-center mt-3">
              El mozo abre este QR desde su celular para tomar comandas sin login.
            </p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
      <div className="text-2xl sm:text-3xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-white/60 mt-1">{label}</div>
    </div>
  );
}
