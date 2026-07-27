'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Check,
  Loader2,
  Crown,
  Sparkles,
  CreditCard,
  XOctagon,
  Lock,
  Utensils,
  ChefHat,
  Package,
  Printer,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';
import { PLANS, type PlanId, type Plan } from '@/lib/plans';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  isSuperAdmin?: boolean;
  profile: {
    plan: PlanId;
    email: string;
    currentPeriodEnd: string | null;
    mpStatus: string | null;
    mpPreapprovalId: string | null;
  };
  usage: { menusCount: number; imagesCount: number };
  queryParams: { success?: string; plan?: string; canceled?: string };
}

const PLAN_ORDER: PlanId[] = ['free', 'pro', 'premium', 'full'];

export function BillingClient({ user, plan, isSuperAdmin = false, profile, usage, queryParams }: Props) {
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const currentPlan = PLANS[profile.plan];

  useEffect(() => {
    if (queryParams.success === '1') {
      const planName = queryParams.plan ? PLANS[queryParams.plan as PlanId]?.name : '';
      toast.success(`¡Gracias! Estamos confirmando tu suscripción${planName ? ` ${planName}` : ''} con MercadoPago…`);
      setTimeout(() => window.location.reload(), 2500);
    }
    if (queryParams.canceled === '1') {
      toast.info('Pago cancelado. Puedes intentar nuevamente cuando quieras.');
    }
  }, [queryParams]);

  async function handleUpgrade(targetPlan: PlanId) {
    setLoadingPlan(targetPlan);
    try {
      const res = await fetch('/api/mercadopago/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: targetPlan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
      setLoadingPlan(null);
    }
  }

  async function handleCancel() {
    setCancelLoading(true);
    try {
      const res = await fetch('/api/mercadopago/cancel', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      toast.success('Suscripción cancelada. Conservarás tu plan hasta fin de período.');
      setConfirmCancel(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
      setCancelLoading(false);
    }
  }

  // Helper: ¿el plan objetivo es upgrade desde el actual?
  function isUpgrade(target: PlanId): boolean {
    return PLAN_ORDER.indexOf(target) > PLAN_ORDER.indexOf(profile.plan);
  }

  function isDowngrade(target: PlanId): boolean {
    return PLAN_ORDER.indexOf(target) < PLAN_ORDER.indexOf(profile.plan);
  }

  return (
    <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Planes y facturación</h1>
        <p className="text-white/60 text-sm sm:text-base">
          Estás en el plan{' '}
          <span className="font-semibold" style={{ color: currentPlan.color }}>
            {currentPlan.name}
          </span>
          {profile.plan !== 'free' && profile.currentPeriodEnd && (
            <span className="ml-2">
              · Renueva el{' '}
              {new Date(profile.currentPeriodEnd).toLocaleDateString('es-PE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
          {profile.mpStatus && profile.mpStatus !== 'authorized' && profile.plan !== 'free' && (
            <span className="ml-2 text-white/40">(estado MP: {profile.mpStatus})</span>
          )}
        </p>
      </div>

      {/* Usage cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6 text-center">
          <div className="text-3xl sm:text-4xl font-bold" style={{ color: currentPlan.color }}>
            {usage.menusCount}
            <span className="text-lg sm:text-xl text-white/40">
              /{currentPlan.limits.maxMenus === -1 ? '∞' : currentPlan.limits.maxMenus}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-white/60 mt-1">Menús</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6 text-center">
          <div className="text-3xl sm:text-4xl font-bold" style={{ color: currentPlan.color }}>
            {usage.imagesCount}
            <span className="text-lg sm:text-xl text-white/40">
              /{currentPlan.limits.maxImages === -1 ? '∞' : currentPlan.limits.maxImages}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-white/60 mt-1">Imágenes</div>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-10">
        {(Object.keys(PLANS) as PlanId[]).map((planId) => {
          const p = PLANS[planId];
          const isCurrent = profile.plan === planId;
          const isUp = isUpgrade(planId);
          const isDown = isDowngrade(planId);

          return (
            <div
              key={planId}
              className={`relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col ${
                isCurrent
                  ? 'border-2'
                  : p.highlight
                  ? 'bg-gradient-to-b from-white/[0.06] to-[#0f0f1a] border border-white/15'
                  : 'bg-white/[0.03] border border-white/10'
              }`}
              style={isCurrent ? { borderColor: p.color, background: `linear-gradient(to bottom, ${p.color}15, #0f0f1a)` } : undefined}
            >
              {/* Badge */}
              {p.badge && (
                <div
                  className="absolute top-0 right-0 px-2 sm:px-3 py-1 rounded-bl-xl text-[10px] sm:text-xs font-bold"
                  style={{ background: p.color, color: '#0a0a14' }}
                >
                  {p.badge}
                </div>
              )}

              {/* Nombre */}
              <div className="flex items-center gap-2 mb-2">
                {p.id === 'full' && <Crown className="w-5 h-5" style={{ color: p.color }} />}
                <h3 className="text-lg sm:text-xl font-bold" style={{ color: p.color }}>
                  {p.name}
                </h3>
                {isCurrent && (
                  <span
                    className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                    style={{
                      background: `${p.color}20`,
                      borderColor: `${p.color}40`,
                      color: p.color,
                    }}
                  >
                    Actual
                  </span>
                )}
              </div>

              <p className="text-xs text-white/60 mb-3 sm:mb-4 min-h-[2.5em]">{p.tagline}</p>

              {/* Precio */}
              <div className="mb-4 sm:mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold">S/ {p.priceMonthly}</span>
                  <span className="text-white/50 text-sm">/mes</span>
                </div>
                {p.priceMonthly > 0 && (
                  <div className="text-[10px] sm:text-xs text-white/40 mt-1">
                    ≈ ${p.priceUsd} USD · MercadoPago
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-1.5 mb-5 sm:mb-6 flex-1">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] sm:text-xs text-white/80 leading-snug">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: p.color }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                !confirmCancel ? (
                  <Button
                    onClick={() => setConfirmCancel(true)}
                    variant="outline"
                    className="w-full bg-transparent border-white/20 text-white hover:bg-white/5 text-xs sm:text-sm"
                  >
                    <XOctagon className="w-4 h-4 mr-2" />
                    Cancelar suscripción
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-white/80 text-center">
                      ¿Cancelar? Conservarás {p.name} hasta fin del período.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => setConfirmCancel(false)}
                        variant="outline"
                        className="bg-transparent border-white/20 text-white hover:bg-white/5 text-xs"
                      >
                        No
                      </Button>
                      <Button
                        onClick={handleCancel}
                        disabled={cancelLoading}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs"
                      >
                        {cancelLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
                        Sí
                      </Button>
                    </div>
                  </div>
                )
              ) : isUp ? (
                <Button
                  onClick={() => handleUpgrade(planId)}
                  disabled={loadingPlan === planId}
                  className="w-full font-semibold text-xs sm:text-sm"
                  style={{
                    background: `linear-gradient(to right, ${p.color}, ${p.color}cc)`,
                    color: '#0a0a14',
                  }}
                >
                  {loadingPlan === planId ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Subir a {p.name}
                </Button>
              ) : isDown ? (
                <Button
                  disabled
                  variant="outline"
                  className="w-full bg-transparent border-white/10 text-white/40 cursor-not-allowed text-xs sm:text-sm"
                >
                  Plan inferior
                </Button>
              ) : (
                <Button
                  disabled
                  variant="outline"
                  className="w-full bg-transparent border-white/10 text-white/40 cursor-not-allowed text-xs sm:text-sm"
                >
                  Plan actual
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparativa detallada */}
      <div className="mb-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Comparativa detallada</h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-xs sm:text-sm min-w-[700px]">
            <thead>
              <tr className="bg-white/[0.04] border-b border-white/10">
                <th className="text-left p-3 sm:p-4 font-semibold text-white/80">Característica</th>
                <th className="text-center p-3 sm:p-4 font-semibold text-white/60">Free</th>
                <th className="text-center p-3 sm:p-4 font-semibold" style={{ color: PLANS.pro.color }}>Pro</th>
                <th className="text-center p-3 sm:p-4 font-semibold" style={{ color: PLANS.premium.color }}>Premium</th>
                <th className="text-center p-3 sm:p-4 font-semibold" style={{ color: PLANS.full.color }}>Full</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <ComparisonRow label="Precio mensual" values={['S/ 0', 'S/ 35', 'S/ 99', 'S/ 199']} />
              <ComparisonRow label="Menús" values={['1', '∞', '∞', '∞']} />
              <ComparisonRow label="Platos por menú" values={['10', '∞', '∞', '∞']} />
              <ComparisonRow label="Imágenes" values={['5', '∞', '∞', '∞']} />
              <ComparisonRow label="QR profesional HD" values={[false, true, true, true]} />
              <ComparisonRow label="Analytics" values={[false, true, true, true]} />
              <ComparisonRow label="Quitar fondo IA" values={['0/mes', '30/mes', '100/mes', '∞']} />
              <ComparisonRow label="Multi-idioma" values={[false, true, true, true]} />
              <ComparisonRow label="Tema PedidosYa/Rappi" values={[false, true, true, true]} />
              <ComparisonRow label="White-label (sin marca)" values={[false, true, true, true]} />
              <ComparisonSection label="🍽️ Logística interna" />
              <ComparisonRow label="Gestión de mesas" values={[0, 0, '50', '∞']} icon={<Utensils className="w-3.5 h-3.5" />} />
              <ComparisonRow label="Gestión de mozos" values={[0, 0, '20', '∞']} icon={<ChefHat className="w-3.5 h-3.5" />} />
              <ComparisonRow label="Sistema de comandas" values={[false, false, true, true]} icon={<Utensils className="w-3.5 h-3.5" />} />
              <ComparisonRow label="Cocina Display" values={[false, false, true, true]} icon={<ChefHat className="w-3.5 h-3.5" />} />
              <ComparisonRow label="Inventario de insumos" values={[false, false, true, true]} icon={<Package className="w-3.5 h-3.5" />} />
              <ComparisonRow label="Recetas automáticas" values={[false, false, true, true]} icon={<Package className="w-3.5 h-3.5" />} />
              <ComparisonSection label="🏬 Multi-sucursal y voucher" />
              <ComparisonRow label="Multi-sucursal" values={[false, false, false, '∞']} icon={<Building2 className="w-3.5 h-3.5" />} />
              <ComparisonRow label="Voucher printing POS" values={[false, false, false, true]} icon={<Printer className="w-3.5 h-3.5" />} />
              <ComparisonRow label="Reportes avanzados" values={[false, false, false, true]} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment methods info */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 mb-8">
        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-[#00b1ea] flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-white/70">
          <div className="font-semibold text-white mb-1">
            Pagos procesados por MercadoPago
          </div>
          Aceptamos tarjetas Visa, Mastercard, American Express, Diners, Yape, Plin y otros métodos según tu país. El cobro es mensual y puedes cancelar cuando quieras.
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-4">
        <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Preguntas frecuentes</h3>
        <div className="space-y-3 sm:space-y-4 text-left">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
            <div className="font-semibold mb-1 text-sm sm:text-base">
              ¿Puedo cambiar de plan en cualquier momento?
            </div>
            <div className="text-xs sm:text-sm text-white/60">
              Sí. Puedes subir de plan (Pro → Premium → Full) en cualquier momento. El cobro se prorratea automáticamente. Para bajar de plan, cancela tu suscripción actual y te mantienes en tu plan hasta fin de período, luego pasas a Free.
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
            <div className="font-semibold mb-1 text-sm sm:text-base">
              ¿Puedo cancelar cuando quiera?
            </div>
            <div className="text-xs sm:text-sm text-white/60">
              Sí. Haz clic en &quot;Cancelar suscripción&quot; y confirma. El cobro recurrente se detiene, pero conservarás acceso a tu plan hasta el fin del período que ya pagaste.
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
            <div className="font-semibold mb-1 text-sm sm:text-base">
              ¿Qué métodos de pago aceptan?
            </div>
            <div className="text-xs sm:text-sm text-white/60">
              Todos los que soporta MercadoPago en tu país: tarjetas de crédito/débito, Yape, Plin, pago en efectivo en agentes autorizados y más.
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
            <div className="font-semibold mb-1 text-sm sm:text-base">
              ¿El plan Premium incluye todo lo del Pro?
            </div>
            <div className="text-xs sm:text-sm text-white/60">
              Sí. Premium incluye <strong>todo lo del Pro</strong> + logística interna del restaurante (mesas, mozos, comandas, cocina display, inventario de insumos con recetas automáticas). Y el plan Full incluye todo lo del Premium + multi-sucursal, voucher printing 1-click y reportes avanzados.
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
            <div className="font-semibold mb-1 text-sm sm:text-base">
              ¿Hay comisión por venta?
            </div>
            <div className="text-xs sm:text-sm text-white/60">
              No. MenuPro no cobra comisión por venta. Solo la suscripción mensual fija. Los pedidos del menú digital van directo al WhatsApp del restaurante, y las comandas internas se gestionan en tu propia cuenta.
            </div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-5">
            <div className="font-semibold mb-1 text-sm sm:text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#d4af37]" />
              ¿Las funciones premium aparecen aunque tenga plan Free/Pro?
            </div>
            <div className="text-xs sm:text-sm text-white/60">
              Sí, verás todos los módulos (Mesas, Comandas, Cocina, Inventario) en el menú, pero estarán bloqueados con un candado. Al hacer upgrade a Premium o Full, se desbloquean automáticamente sin necesidad de configuración adicional.
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function ComparisonRow({
  label,
  values,
  icon,
}: {
  label: string;
  values: (boolean | string | number)[];
  icon?: React.ReactNode;
}) {
  return (
    <tr className="hover:bg-white/[0.02]">
      <td className="p-3 sm:p-4 text-white/80 flex items-center gap-2">
        {icon}
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} className="p-3 sm:p-4 text-center">
          {typeof v === 'boolean' ? (
            v ? (
              <Check className="w-4 h-4 text-[#06d6a0] mx-auto" />
            ) : (
              <span className="text-white/20">—</span>
            )
          ) : (
            <span className={v === 0 ? 'text-white/30' : 'text-white/80'}>{v}</span>
          )}
        </td>
      ))}
    </tr>
  );
}

function ComparisonSection({ label }: { label: string }) {
  return (
    <tr className="bg-white/[0.04]">
      <td colSpan={5} className="p-3 sm:p-4 font-semibold text-white/90 text-xs sm:text-sm uppercase tracking-wider">
        {label}
      </td>
    </tr>
  );
}
