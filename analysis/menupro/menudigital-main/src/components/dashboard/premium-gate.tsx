'use client';

import Link from 'next/link';
import { Lock, Sparkles, Crown, Check } from 'lucide-react';
import { PLANS, type PlanId } from '@/lib/plans';

interface Props {
  requiredPlan: PlanId; // 'premium' | 'full'
  userPlan: PlanId;
  featureName: string;
  featureIcon?: React.ReactNode;
  description?: string;
}

const PLAN_ORDER: PlanId[] = ['free', 'pro', 'premium', 'full'];

export function PremiumGate({ requiredPlan, userPlan, featureName, featureIcon, description }: Props) {
  const requiredPlanData = PLANS[requiredPlan];
  const isUpgrade = PLAN_ORDER.indexOf(requiredPlan) > PLAN_ORDER.indexOf(userPlan);

  // Si ya tiene el plan, no mostrar gate
  if (!isUpgrade) return null;

  // Encontrar el plan mínimo que incluye esta feature
  const minPlan = requiredPlan;

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto">
        <div
          className="rounded-3xl p-8 border-2 relative overflow-hidden"
          style={{
            borderColor: `${requiredPlanData.color}50`,
            background: `linear-gradient(135deg, ${requiredPlanData.color}15, #0f0f1a)`,
          }}
        >
          {/* Glow effect */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
            style={{ background: requiredPlanData.color }}
          />

          <div className="relative">
            {/* Icon + Lock */}
            <div className="flex items-center justify-center mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: `${requiredPlanData.color}30`, border: `1px solid ${requiredPlanData.color}60` }}
              >
                {featureIcon || <Lock className="w-8 h-8" style={{ color: requiredPlanData.color }} />}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">{featureName}</h2>
            <p className="text-sm text-white/60 text-center mb-6">
              {description ||
                `Esta función está disponible en el plan ${requiredPlanData.name}. Upgrade ahora para desbloquearla.`}
            </p>

            {/* Price */}
            <div className="text-center mb-6">
              <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Plan requerido</div>
              <div className="flex items-center justify-center gap-2">
                {requiredPlan === 'full' && <Crown className="w-5 h-5" style={{ color: requiredPlanData.color }} />}
                {requiredPlan === 'premium' && <Sparkles className="w-5 h-5" style={{ color: requiredPlanData.color }} />}
                <span className="text-3xl font-bold" style={{ color: requiredPlanData.color }}>
                  {requiredPlanData.name}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold">S/ {requiredPlanData.priceMonthly}</span>
                <span className="text-white/50">/mes</span>
              </div>
            </div>

            {/* What's included */}
            <div className="bg-white/[0.03] rounded-2xl p-4 mb-6">
              <div className="text-xs text-white/60 mb-3 uppercase tracking-wider">Incluye en este plan:</div>
              <ul className="space-y-1.5">
                {requiredPlanData.features.slice(0, 6).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: requiredPlanData.color }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <Link
              href="/dashboard/billing"
              className="block text-center py-3.5 rounded-xl font-semibold transition hover:opacity-90"
              style={{
                background: `linear-gradient(to right, ${requiredPlanData.color}, ${requiredPlanData.color}cc)`,
                color: '#0a0a14',
              }}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              Hacer upgrade a {requiredPlanData.name}
            </Link>

            {/* Trust signals */}
            <div className="mt-4 text-center text-xs text-white/40">
              Cancelas cuando quieras · Sin contratos · MercadoPago
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/dashboard" className="text-sm text-white/50 hover:text-white">
            ← Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper para usar en server components: comprobar si el plan del usuario
 * tiene acceso a la feature. Si no, devolver el PremiumGate.
 */
export function checkPremiumAccess(
  userPlan: PlanId,
  requiredPlan: PlanId
): boolean {
  return PLAN_ORDER.indexOf(userPlan) >= PLAN_ORDER.indexOf(requiredPlan);
}
