'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  LayoutDashboard,
  CreditCard,
  Shield,
  Stethoscope,
  Users,
  Calendar,
  Pill,
  DollarSign,
  FileText,
  BarChart3,
  Menu as MenuIcon,
  X,
  Lock,
  Crown,
  Building2,
  UserCog,
} from 'lucide-react';
import type { Plan } from '@/lib/plans';
import { isPlanAtLeast, type PlanId } from '@/lib/plans';
import { ThemeToggle } from '@/components/theme-toggle';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { PlanUsageBadge } from '@/components/dashboard/plan-usage-badge';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  pro?: boolean;
  premium?: boolean;
  full?: boolean;
  superAdmin?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/citas', label: 'Citas', icon: Calendar },
  { href: '/dashboard/pacientes', label: 'Pacientes', icon: Users },
  { href: '/dashboard/medicos', label: 'Médicos', icon: Stethoscope },
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
  user: { email: string; name: string };
  plan: Plan;
  clinicName: string;
  isSuperAdmin?: boolean;
  children: ReactNode;
}

export function DashboardShell({
  user,
  plan,
  clinicName,
  isSuperAdmin = false,
  children,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

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

  const renderItem = (item: NavItem, mobile = false) => {
    const active = isActive(item.href);
    const base = mobile
      ? 'flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[10px]'
      : 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors';
    // Active link: fondo azul médico (sky-500) con texto blanco SIEMPRE legible.
    // Idle link: gris, hover bg gris claro.
    const activeCls = mobile
      ? 'bg-sky-500 text-white font-medium'
      : 'bg-sky-500 text-white font-medium shadow-sm';
    const idleCls = mobile
      ? 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60';

    let locked = false;
    let lockReason = '';
    if (item.pro && !isPlanAtLeast(plan.id, 'pro' as PlanId)) {
      locked = true;
      lockReason = 'Requiere plan Pro';
    } else if (item.premium && !isPlanAtLeast(plan.id, 'premium' as PlanId)) {
      locked = true;
      lockReason = 'Requiere plan Premium';
    } else if (item.full && !isPlanAtLeast(plan.id, 'full' as PlanId)) {
      locked = true;
      lockReason = 'Requiere plan Full';
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        prefetch={true}
        onClick={() => mobile && setDrawerOpen(false)}
        className={`${base} ${active ? activeCls : idleCls} ${locked ? 'opacity-60' : ''}`}
        title={locked ? lockReason : item.label}
      >
        <item.icon className={mobile ? 'w-5 h-5' : 'w-4 h-4'} />
        <span className="flex-1 min-w-0 truncate">
          {mobile ? item.label.split(' ')[0] : item.label}
        </span>
        {!mobile && locked && (
          <Lock className="w-3 h-3 text-amber-400/80 ml-auto flex-shrink-0" />
        )}
        {!mobile && !locked && item.pro && (
          <Crown className="w-3 h-3 text-[#d4af37] ml-auto flex-shrink-0" />
        )}
      </Link>
    );
  };

  const renderSuperAdminLink = (mobile = false) => {
    if (!isSuperAdmin) return null;
    const base = mobile
      ? 'flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[10px]'
      : 'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors mt-2';
    return (
      <Link
        href="/superadmin"
        prefetch={true}
        onClick={() => mobile && setDrawerOpen(false)}
        className={`${base} text-amber-700 bg-amber-100 hover:bg-amber-200 hover:text-amber-900 border border-amber-300`}
      >
        <Shield className={mobile ? 'w-5 h-5' : 'w-4 h-4'} />
        <span className={mobile ? '' : 'flex-1'}>Super Admin</span>
      </Link>
    );
  };

  const renderUserBlock = () => (
    <div className="border-t border-border pt-4 space-y-3">
      <div className="px-3 space-y-1">
        <div className="text-sm text-foreground/80 truncate">{user.email}</div>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
            plan.id === 'free' ? 'bg-muted/50 text-muted-foreground' : ''
          }`}
          style={
            plan.id !== 'free'
              ? {
                  background: `${plan.color}20`,
                  color: plan.color,
                  border: `1px solid ${plan.color}40`,
                }
              : undefined
          }
        >
          {plan.name}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/60"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar sesión
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-sidebar p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <Link href="/" className="hover:opacity-90 transition">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center font-bold text-white">
              C
            </div>
          </Link>
          <Link href="/" className="font-bold hover:text-[#0ea5e9] transition">
            CitasPro
          </Link>
        </div>

        <div className="px-2 mb-4 text-xs text-muted-foreground/70 truncate">
          🏥 {clinicName}
        </div>

        {/* Usage mini-badge en sidebar desktop */}
        <div className="px-2 mb-4 space-y-1.5">
          <PlanUsageBadge resource="appointments" label="Citas / mes" variant="compact" />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => renderItem(item))}
          {renderSuperAdminLink()}
        </nav>

        {renderUserBlock()}
      </aside>

      {/* Mobile drawer — legacy, kept as fallback if BottomNav fails */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-64 bg-sidebar p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="font-bold">
                CitasPro
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="px-2 mb-4 text-xs text-muted-foreground/70 truncate">
              🏥 {clinicName}
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map(item => renderItem(item, true))}
              {renderSuperAdminLink(true)}
            </nav>
            {renderUserBlock()}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-sidebar">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center font-bold text-white text-xs">
              C
            </div>
            <span className="font-bold text-sm">CitasPro</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link href="/dashboard/billing" className="ml-1" aria-label="Mejorar plan">
              <Crown className="w-5 h-5 text-[#d4af37]" />
            </Link>
          </div>
        </header>

        {/* Desktop top bar — minimal, contains theme toggle */}
        <header className="hidden lg:flex items-center justify-end px-6 py-2 border-b border-border bg-background/60 backdrop-blur-sm">
          <ThemeToggle />
        </header>

        {/* Padding bottom en mobile para que el bottom nav no tape contenido */}
        <main className="flex-1 overflow-x-hidden pb-20 lg:pb-0">{children}</main>
      </div>

      {/* Bottom nav mobile */}
      <BottomNav plan={plan} isSuperAdmin={isSuperAdmin} userEmail={user.email} />
    </div>
  );
}
