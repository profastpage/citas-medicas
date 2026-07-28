'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Stethoscope,
  MoreHorizontal,
  DollarSign,
  Pill,
  BarChart3,
  Shield,
  Building2,
  UserCog,
  CreditCard,
  FileText,
  X,
  Crown,
  LogOut,
} from 'lucide-react';
import type { Plan } from '@/lib/plans';
import { isPlanAtLeast, type PlanId } from '@/lib/plans';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  pro?: boolean;
  premium?: boolean;
  full?: boolean;
}

// 5 items principales del bottom nav (mobile-first, fácil acceso con pulgar)
const PRIMARY_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/citas', label: 'Citas', icon: Calendar },
  { href: '/dashboard/pacientes', label: 'Pacientes', icon: Users },
  { href: '/dashboard/medicos', label: 'Médicos', icon: Stethoscope },
];

// Items secundarios (accedidos vía "Más")
const SECONDARY_ITEMS: NavItem[] = [
  { href: '/dashboard/servicios', label: 'Servicios', icon: FileText },
  { href: '/dashboard/caja', label: 'Caja', icon: DollarSign, pro: true },
  { href: '/dashboard/inventario', label: 'Inventario', icon: Pill, pro: true },
  { href: '/dashboard/reportes', label: 'Reportes', icon: BarChart3, premium: true },
  { href: '/dashboard/auditoria', label: 'Auditoría', icon: Shield, pro: true },
  { href: '/dashboard/clinica', label: 'Clínica', icon: Building2 },
  { href: '/dashboard/equipo', label: 'Equipo', icon: UserCog, pro: true },
  { href: '/dashboard/billing', label: 'Planes', icon: CreditCard },
];

interface Props {
  plan: Plan;
  isSuperAdmin?: boolean;
  userEmail?: string;
}

export function BottomNav({ plan, isSuperAdmin = false, userEmail }: Props) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  // Cerrar menú "Más" al cambiar de ruta
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      /* noop */
    }
    window.location.href = '/login';
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const isLocked = (item: NavItem) => {
    if (item.pro && !isPlanAtLeast(plan.id, 'pro' as PlanId)) return true;
    if (item.premium && !isPlanAtLeast(plan.id, 'premium' as PlanId)) return true;
    if (item.full && !isPlanAtLeast(plan.id, 'full' as PlanId)) return true;
    return false;
  };

  // Verificar si alguna ruta secundaria está activa (para resaltar "Más")
  const isMoreActive = SECONDARY_ITEMS.some(i => isActive(i.href)) ||
    (isSuperAdmin && pathname.startsWith('/superadmin'));

  return (
    <>
      {/* Bottom nav — solo visible en mobile (lg:hidden) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-sidebar/95 backdrop-blur-lg border-t border-border"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Navegación principal"
      >
        <div className="grid grid-cols-5 gap-0.5 px-1.5 py-1.5 max-w-md mx-auto">
          {PRIMARY_ITEMS.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg transition-colors"
              >
                <div
                  className={`p-1 rounded-lg transition-all ${
                    active
                      ? 'bg-sky-500 text-white shadow-sm scale-105'
                      : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span
                  className={`text-[9px] font-medium leading-none ${
                    active ? 'text-sky-600 dark:text-sky-400' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Botón "Más" */}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-lg transition-colors"
            aria-label="Ver más opciones"
          >
            <div
              className={`p-1 rounded-lg transition-all ${
                isMoreActive
                  ? 'bg-sky-500 text-white shadow-sm scale-105'
                  : 'text-muted-foreground hover:bg-muted/60'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" strokeWidth={isMoreActive ? 2.5 : 2} />
            </div>
            <span
              className={`text-[9px] font-medium leading-none ${
                isMoreActive ? 'text-sky-600 dark:text-sky-400' : 'text-muted-foreground'
              }`}
            >
              Más
            </span>
          </button>
        </div>
      </nav>

      {/* Sheet "Más" — sheet deslizante desde abajo */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div className="relative bg-sidebar rounded-t-3xl border-t border-border max-h-[80vh] overflow-y-auto slide-up">
            {/* Handle bar */}
            <div className="sticky top-0 bg-sidebar pt-3 pb-2 flex justify-center">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-4 pb-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base">Más opciones</h2>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted/60 text-muted-foreground"
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Plan badge */}
              <Link
                href="/dashboard/billing"
                onClick={() => setMoreOpen(false)}
                className="block mb-4 p-3 rounded-xl border border-border bg-muted/40 hover:bg-muted/60 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${plan.color}20`,
                        color: plan.color,
                        border: `1px solid ${plan.color}40`,
                      }}
                    >
                      <Crown className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Plan actual</div>
                      <div className="font-bold text-sm" style={{ color: plan.color }}>
                        {plan.name}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-sky-500 font-medium whitespace-nowrap">
                    Mejorar →
                  </span>
                </div>
              </Link>

              {/* Grid de opciones secundarias */}
              <div className="grid grid-cols-3 gap-2">
                {SECONDARY_ITEMS.map(item => {
                  const active = isActive(item.href);
                  const locked = isLocked(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition relative ${
                        active
                          ? 'border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          : 'border-border bg-muted/30 hover:bg-muted/60 text-foreground'
                      } ${locked ? 'opacity-60' : ''}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-[10px] font-medium text-center leading-tight">
                        {item.label}
                      </span>
                      {locked && (
                        <span className="absolute top-1 right-1 text-[8px] text-amber-500 font-bold">
                          🔒
                        </span>
                      )}
                    </Link>
                  );
                })}

                {isSuperAdmin && (
                  <Link
                    href="/superadmin"
                    onClick={() => setMoreOpen(false)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition ${
                      pathname.startsWith('/superadmin')
                        ? 'border-amber-500 bg-amber-500/10 text-amber-600'
                        : 'border-amber-300 bg-amber-100/50 text-amber-700 hover:bg-amber-200/50'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span className="text-[10px] font-medium text-center leading-tight">
                      Super Admin
                    </span>
                  </Link>
                )}
              </div>

              {/* User block + logout al final */}
              <div className="mt-6 pt-4 border-t border-border space-y-2">
                {userEmail && (
                  <div className="px-2 text-xs text-muted-foreground truncate">
                    {userEmail}
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground transition"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
