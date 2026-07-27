'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CreditCard, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PLANS, type Plan, LIMIT_COMPARISON } from '@/lib/plans';
import { toast } from 'sonner';
import { useState } from 'react';

interface Props {
  user: { email: string; name: string };
  currentPlan: Plan;
  mpStatus: string | null;
  currentPeriodEnd: string | null;
  isSuperAdmin?: boolean;
}

export function BillingClient({ user, currentPlan, mpStatus, currentPeriodEnd }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const upgrade = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al iniciar suscripción');
        return;
      }
      if (data.initPoint) {
        window.location.href = data.initPoint;
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(null);
    }
  };

  const cancel = async () => {
    if (!confirm('¿Cancelar tu suscripción? Volverás al plan Free.')) return;
    setLoading('cancel');
    try {
      const res = await fetch('/api/billing/cancel', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Error al cancelar');
        return;
      }
      toast.success('Suscripción cancelada');
      setTimeout(() => window.location.reload(), 800);
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(null);
    }
  };

  return (
    <DashboardShell user={user} plan={currentPlan} clinicName="—" isSuperAdmin={false}>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Planes y facturación</h1>
          <p className="text-white/60 text-sm mt-1">
            Gestiona tu suscripción a CitasPro
          </p>
        </div>

        {/* Plan actual */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            background: `${currentPlan.color}10`,
            borderColor: `${currentPlan.color}40`,
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/40 mb-1">
                Plan actual
              </div>
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl font-bold" style={{ color: currentPlan.color }}>
                  {currentPlan.name}
                </h2>
                <span className="text-white/40 text-sm">
                  {currentPlan.priceMonthly === 0
                    ? 'Gratis para siempre'
                    : `S/ ${currentPlan.priceMonthly}/mes`}
                </span>
              </div>
              <p className="text-white/60 text-sm mt-1">{currentPlan.tagline}</p>

              {mpStatus === 'authorized' && currentPeriodEnd && (
                <div className="mt-3 text-sm text-white/60 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Próximo cobro: {new Date(currentPeriodEnd).toLocaleDateString('es-PE')}
                </div>
              )}
            </div>

            {currentPlan.id !== 'free' && (
              <Button variant="outline" onClick={cancel} disabled={loading === 'cancel'}>
                Cancelar suscripción
              </Button>
            )}
          </div>
        </div>

        {/* Cambiar plan */}
        <div>
          <h2 className="text-xl font-bold mb-4">Cambiar de plan</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(PLANS).map(plan => {
              const isCurrent = plan.id === currentPlan.id;
              const isUpgrade = PLANS[plan.id] && (
                ['free', 'pro', 'premium', 'full'].indexOf(plan.id) >
                ['free', 'pro', 'premium', 'full'].indexOf(currentPlan.id)
              );

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-6 border ${
                    plan.highlight
                      ? 'border-[#d4af37]/40 bg-gradient-to-b from-[#d4af37]/5 to-transparent'
                      : 'border-white/10 bg-white/[0.02]'
                  } ${isCurrent ? 'ring-2 ring-[#0ea5e9]' : ''}`}
                >
                  {plan.badge && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: plan.color, color: '#0a0a14' }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <h3 className="text-lg font-bold mb-1" style={{ color: plan.color }}>
                    {plan.name}
                  </h3>
                  <p className="text-xs text-white/40 mb-4">{plan.tagline}</p>

                  <div className="mb-4">
                    <span className="text-3xl font-bold">S/ {plan.priceMonthly}</span>
                    <span className="text-white/40 text-sm">/mes</span>
                  </div>

                  <ul className="space-y-2 text-sm mb-6 min-h-[180px]">
                    {plan.features.slice(0, 7).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/70">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <Button disabled className="w-full" variant="outline">
                      Plan actual
                    </Button>
                  ) : isUpgrade ? (
                    <Button
                      onClick={() => upgrade(plan.id)}
                      disabled={loading === plan.id}
                      className="w-full"
                      style={{ background: plan.color, color: '#0a0a14' }}
                    >
                      {loading === plan.id ? 'Procesando...' : 'Mejorar'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => upgrade(plan.id)}
                      disabled={loading === plan.id}
                      variant="outline"
                      className="w-full border-white/10"
                    >
                      Cambiar a {plan.name}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparativa */}
        <div className="overflow-x-auto bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Comparativa detallada</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-white/60">Característica</th>
                <th className="text-center py-3 px-2 text-white/60">Free</th>
                <th className="text-center py-3 px-2 text-white/60">Pro</th>
                <th className="text-center py-3 px-2 text-white/60">Premium</th>
                <th className="text-center py-3 px-2 text-white/60">Full</th>
              </tr>
            </thead>
            <tbody>
              {LIMIT_COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2 px-2">
                    <span className="mr-2">{row.icon}</span>
                    {row.label}
                  </td>
                  {row.values.map((v, j) => (
                    <td key={j} className="text-center py-2 px-2">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
