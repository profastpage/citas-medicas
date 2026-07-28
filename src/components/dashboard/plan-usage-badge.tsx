'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, AlertTriangle, TrendingUp, Clock } from 'lucide-react';

interface UsageData {
  current: number;
  limit: number;
  limitLabel: string;
  percent: number;
  unlimited: boolean;
  atLimit: boolean;
  nearLimit: boolean;
  currentLabel?: string;
}

interface ApiResponse {
  plan: { id: string; name: string; color: string };
  usage: {
    patients: UsageData;
    doctors: UsageData;
    appointments: UsageData;
    clinics: UsageData;
    team: UsageData;
    whatsapp: UsageData;
    storage: UsageData;
  };
  features: Record<string, boolean>;
  expiry: {
    currentPeriodEnd: string;
    daysRemaining: number;
    isExpiringSoon: boolean;
    isExpired: boolean;
  } | null;
  clinics: Array<{ id: string; name: string; slug: string; createdAt: string }>;
  activeClinicId: string;
}

type UsageKey = keyof ApiResponse['usage'];

interface Props {
  /** Recurso a mostrar: patients | doctors | appointments | clinics | team | whatsapp | storage */
  resource: UsageKey;
  /** Etiqueta legible: "Pacientes", "Médicos", "Citas este mes", etc. */
  label: string;
  /** Versión compacta (badge inline) o expandida (con barra de progreso) */
  variant?: 'compact' | 'full';
  /** Refrescar después de X segundos (default: 0 = no auto-refresh) */
  refreshIntervalMs?: number;
  /** Texto personalizado para el recurso (ej: "5.2 MB / 10 MB") — solo si el current no es un número simple */
  formatCurrent?: (current: number) => string;
}

/**
 * Badge que muestra el uso actual vs el límite del plan.
 * Auto-recarga cada 30s. Muestra CTA "Mejorar plan" cuando llega al límite.
 *
 * @example
 * <PlanUsageBadge resource="patients" label="Pacientes" />
 * <PlanUsageBadge resource="appointments" label="Citas este mes" variant="compact" />
 * <PlanUsageBadge resource="storage" label="Almacenamiento" />
 */
export function PlanUsageBadge({
  resource,
  label,
  variant = 'full',
  refreshIntervalMs = 0,
}: Props) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/plan-usage', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (mounted) {
            setData(json);
            setLoading(false);
          }
        } else if (mounted) {
          setLoading(false);
        }
      } catch {
        if (mounted) setLoading(false);
      }
    };
    load();
    if (refreshIntervalMs > 0) {
      const t = setInterval(load, refreshIntervalMs);
      return () => {
        mounted = false;
        clearInterval(t);
      };
    }
    return () => {
      mounted = false;
    };
  }, [refreshIntervalMs]);

  if (loading || !data) {
    return variant === 'compact' ? (
      <span className="text-[10px] text-muted-foreground/60">···</span>
    ) : null;
  }

  const u = data.usage[resource];
  if (!u) return null;

  // Display value: si tiene currentLabel (storage), úsalo; si no, el número
  const currentDisplay = u.currentLabel ?? String(u.current);
  const limitDisplay = u.limitLabel;

  // Ilimitado: chip verde sutil
  if (u.unlimited) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          variant === 'compact' ? '' : 'border'
        } bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20`}
      >
        <span className="opacity-70">{label}:</span>
        <span className="font-bold">{currentDisplay}</span>
        <span className="opacity-60">/ ∞</span>
      </div>
    );
  }

  // Color según uso
  const colorClass = u.atLimit
    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
    : u.nearLimit
    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
    : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';

  if (variant === 'compact') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${colorClass}`}
      >
        <span className="opacity-70">{u.current}</span>
        <span className="opacity-50">/</span>
        <span className="font-bold">{u.limit}</span>
        {u.atLimit && <AlertTriangle className="w-2.5 h-2.5 ml-0.5" />}
      </span>
    );
  }

  return (
    <div className={`rounded-xl border p-3 ${colorClass}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium opacity-80 truncate">{label}</span>
          {u.atLimit && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />}
          {u.nearLimit && !u.atLimit && <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />}
        </div>
        <div className="flex items-baseline gap-1 text-sm font-bold whitespace-nowrap">
          <span>{currentDisplay}</span>
          <span className="opacity-50">/</span>
          <span>{limitDisplay}</span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            u.atLimit
              ? 'bg-red-500'
              : u.nearLimit
              ? 'bg-amber-500'
              : 'bg-sky-500'
          }`}
          style={{ width: `${Math.max(2, u.percent)}%` }}
        />
      </div>

      {/* CTA upgrade cuando está al límite o cerca */}
      {(u.atLimit || u.nearLimit) && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[10px] opacity-80">
            {u.atLimit
              ? `Límite alcanzado. Mejora tu plan para seguir.`
              : `Estás al ${u.percent}%. Considera mejorar tu plan.`}
          </span>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-foreground/10 hover:bg-foreground/20 transition whitespace-nowrap"
          >
            <Crown className="w-3 h-3" />
            Mejorar
          </Link>
        </div>
      )}
    </div>
  );
}

/**
 * Banner grande para mostrar al inicio de una sección cuando se ha alcanzado el límite.
 * Recomienda mejorar el plan para máxima conversión.
 */
export function PlanLimitBanner({ resource, label }: { resource: UsageKey; label: string }) {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/plan-usage', { cache: 'no-store' })
      .then(r => r.json())
      .then(json => mounted && setData(json))
      .catch(() => mounted && setData(null));
    return () => {
      mounted = false;
    };
  }, []);

  if (!data) return null;
  const u = data.usage[resource];
  if (!u || u.unlimited || !u.atLimit) return null;

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
        <Crown className="w-6 h-6 text-amber-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm sm:text-base">
          Has alcanzado el límite de {label.toLowerCase()} del plan {data.plan.name}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Estás usando <strong>{u.currentLabel ?? u.current}</strong> de <strong>{u.limitLabel}</strong>.{' '}
          Recomendamos mejorar tu plan para máximos beneficios y seguir creciendo sin interrupciones.
        </p>
      </div>
      <Link
        href="/dashboard/billing"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:opacity-90 transition whitespace-nowrap w-full sm:w-auto"
      >
        <Crown className="w-4 h-4" />
        Mejorar plan
      </Link>
    </div>
  );
}

/**
 * Hook reutilizable para obtener el estado de uso del plan.
 * Útil para deshabilitar botones de "Nuevo X" cuando se está al límite.
 *
 * @example
 * const { usage, atLimit } = usePlanUsage();
 * <Button disabled={atLimit('patients')}>Nuevo paciente</Button>
 */
export function usePlanUsage() {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = () => {
      fetch('/api/plan-usage', { cache: 'no-store' })
        .then(r => mounted && r.json())
        .then(json => mounted && setData(json))
        .catch(() => {});
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const atLimit = (resource: UsageKey): boolean => {
    if (!data) return false;
    const u = data.usage[resource];
    return u ? u.atLimit : false;
  };

  const isFeatureLocked = (feature: string): boolean => {
    if (!data) return false;
    return !data.features[feature];
  };

  return {
    data,
    usage: data?.usage,
    expiry: data?.expiry,
    atLimit,
    isFeatureLocked,
    plan: data?.plan,
  };
}

/**
 * Banner que avisa cuando el plan está por expirar (≤7 días).
 * Se muestra en el dashboard principal.
 */
export function PlanExpiryBanner() {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/plan-usage', { cache: 'no-store' })
      .then(r => r.json())
      .then(json => mounted && setData(json))
      .catch(() => mounted && setData(null));
    return () => {
      mounted = false;
    };
  }, []);

  if (!data?.expiry || data.plan.id === 'free') return null;
  const e = data.expiry;

  if (e.isExpired) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0">
          <Clock className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm sm:text-base text-red-700 dark:text-red-400">
            Tu suscripción al plan {data.plan.name} ha expirado
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Renueva ahora para recuperar acceso a todas las funciones. Mientras tanto, tu cuenta opera en modo Free.
          </p>
        </div>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition whitespace-nowrap w-full sm:w-auto"
        >
          Renovar ahora
        </Link>
      </div>
    );
  }

  if (e.isExpiringSoon) {
    return (
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
          <Clock className="w-6 h-6 text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm sm:text-base text-amber-700 dark:text-amber-400">
            Tu plan {data.plan.name} expira en {e.daysRemaining} {e.daysRemaining === 1 ? 'día' : 'días'}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Renueva antes del{' '}
            <strong>{new Date(e.currentPeriodEnd).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>{' '}
            para mantener todas las funciones activas.
          </p>
        </div>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition whitespace-nowrap w-full sm:w-auto"
        >
          Renovar
        </Link>
      </div>
    );
  }

  return null;
}
