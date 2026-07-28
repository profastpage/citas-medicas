'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CreditCard, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PLANS, type Plan, LIMIT_COMPARISON } from '@/lib/plans';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Props {
  user: { email: string; name: string };
  currentPlan: Plan;
  mpStatus: string | null;
  currentPeriodEnd: string | null;
  isSuperAdmin?: boolean;
}

interface ProrationQuote {
  currentPlan: { id: string; name: string; price: number };
  targetPlan: { id: string; name: string; price: number };
  proration: {
    amountDue: number;
    creditRemaining: number;
    daysRemaining: number;
    currentPeriodEnd: string | null;
    explanation: string;
  };
}

export function BillingClient({ user, currentPlan, mpStatus, currentPeriodEnd }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [quote, setQuote] = useState<ProrationQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // 1. Solicitar cotización con prorrateo
  const requestQuote = async (planId: string) => {
    setQuoteLoading(true);
    try {
      const res = await fetch(`/api/billing/quote-upgrade?planId=${planId}`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al calcular prorrateo');
        return;
      }
      setQuote(data as ProrationQuote);
    } catch {
      toast.error('Error de conexión');
    } finally {
      setQuoteLoading(false);
    }
  };

  // 2. Confirmar upgrade (procede a checkout con la cotización mostrada)
  const confirmUpgrade = async () => {
    if (!quote) return;
    setLoading(quote.targetPlan.id);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: quote.targetPlan.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al iniciar suscripción');
        return;
      }
      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else if (data.redirect) {
        // Modo demo
        toast.success('Plan activado en modo demo');
        setTimeout(() => {
          window.location.href = data.redirect;
        }, 800);
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setLoading(null);
      setQuote(null);
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
          <p className="text-muted-foreground text-sm mt-1">
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
              <div className="text-xs uppercase tracking-wider text-muted-foreground/70 mb-1">
                Plan actual
              </div>
              <div className="flex items-baseline gap-3">
                <h2 className="text-2xl font-bold" style={{ color: currentPlan.color }}>
                  {currentPlan.name}
                </h2>
                <span className="text-muted-foreground/70 text-sm">
                  {currentPlan.priceMonthly === 0
                    ? 'Gratis para siempre'
                    : `S/ ${currentPlan.priceMonthly}/mes`}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-1">{currentPlan.tagline}</p>

              {mpStatus === 'authorized' && currentPeriodEnd && (
                <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
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
                      : 'border-border bg-muted/30'
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
                  <p className="text-xs text-muted-foreground/70 mb-4">{plan.tagline}</p>

                  <div className="mb-4">
                    <span className="text-3xl font-bold">S/ {plan.priceMonthly}</span>
                    <span className="text-muted-foreground/70 text-sm">/mes</span>
                  </div>

                  <ul className="space-y-2 text-sm mb-6 min-h-[180px]">
                    {plan.features.slice(0, 7).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <Button disabled className="w-full" variant="outline">
                      Plan actual
                    </Button>
                  ) : isUpgrade ? (
                    <Button
                      onClick={() => requestQuote(plan.id)}
                      disabled={quoteLoading}
                      className="w-full"
                      style={{ background: plan.color, color: '#0a0a14' }}
                    >
                      {quoteLoading ? 'Calculando...' : 'Mejorar'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => requestQuote(plan.id)}
                      disabled={quoteLoading}
                      variant="outline"
                      className="w-full border-border"
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
        <div className="overflow-x-auto bg-muted/50 border border-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Comparativa detallada</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground">Característica</th>
                <th className="text-center py-3 px-2 text-muted-foreground">Free</th>
                <th className="text-center py-3 px-2 text-muted-foreground">Pro</th>
                <th className="text-center py-3 px-2 text-muted-foreground">Premium</th>
                <th className="text-center py-3 px-2 text-muted-foreground">Full</th>
              </tr>
            </thead>
            <tbody>
              {LIMIT_COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-border/60">
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

      {/* Modal de prorrateo */}
      <Dialog open={!!quote} onOpenChange={open => !open && setQuote(null)}>
        <DialogContent className="max-w-md bg-sidebar border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Mejorar a {quote?.targetPlan.name}
            </DialogTitle>
          </DialogHeader>
          {quote && (
            <div className="space-y-4">
              {/* Resumen visual */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Plan actual
                  </div>
                  <div className="text-lg font-bold mt-1">{quote.currentPlan.name}</div>
                  <div className="text-xs text-muted-foreground">
                    S/ {quote.currentPlan.price.toFixed(2)}/mes
                  </div>
                </div>
                <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-amber-700 dark:text-amber-400">
                    Plan nuevo
                  </div>
                  <div className="text-lg font-bold mt-1 text-amber-700 dark:text-amber-400">
                    {quote.targetPlan.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    S/ {quote.targetPlan.price.toFixed(2)}/mes
                  </div>
                </div>
              </div>

              {/* Cargo prorrateado */}
              <div className="rounded-lg border-2 border-sky-500/40 bg-sky-500/5 p-4 text-center">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Cargo hoy (prorrateado)
                </div>
                <div className="text-3xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                  S/ {quote.proration.amountDue.toFixed(2)}
                </div>
                {quote.proration.creditRemaining > 0 && (
                  <div className="text-[10px] text-emerald-600 mt-1">
                    Crédito a favor: S/ {quote.proration.creditRemaining.toFixed(2)}
                  </div>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  A partir del próximo ciclo: S/ {quote.targetPlan.price.toFixed(2)}/mes
                </div>
              </div>

              {/* Explicación */}
              <div className="rounded-lg bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
                {quote.proration.explanation}
              </div>

              {/* Footer */}
              <DialogFooter className="gap-2 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setQuote(null)}
                  className="w-full sm:w-auto"
                  disabled={!!loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmUpgrade}
                  disabled={!!loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]"
                >
                  {loading
                    ? 'Procesando...'
                    : `Confirmar upgrade · S/ ${quote.proration.amountDue.toFixed(2)}`}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
