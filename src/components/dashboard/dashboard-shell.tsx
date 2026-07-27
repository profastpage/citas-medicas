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
  { href: '/dashboard', label: 'Resumen', icon: LayoutDashboard },
  { href: '/dashboard/citas', label: 'Citas', icon: Calendar },
  { href: '/dashboard/pacientes', label: 'Pacientes', icon: Users },
  { href: '/dashboard/medicos', label: 'Médicos', icon: Stethoscope },
  { href: '/dashboard/servicios', label: 'Servicios', icon: FileText },
  { href: '/dashboard/caja', label: 'Caja', icon: DollarSign, pro: true },
  { href: '/dashboard/inventario', label: 'Inventario', icon: Pill, pro: true },
  { href: '/dashboard/reportes', label: 'Reportes', icon: BarChart3, premium: true },
  { href: '/dashboard/auditoria', label: 'Auditoría', icon: Shield, pro: true },
  { href: '/dashboard/clinica', label: 'Clínica', icon: Building2 },
  { href: '/dashboard/equipo', label: 'Equipo', icon: UserCog, premium: true },
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
    const activeCls = mobile
      ? 'bg-white/5 text-white font-medium'
      : 'bg-white/5 border border-white/10 text-white font-medium';
    const idleCls = mobile
      ? 'text-white/50 hover:bg-white/5'
      : 'text-white/60 hover:text-white hover:bg-white/5';

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
        className={`${base} text-amber-400/90 hover:text-amber-400 hover:bg-amber-400/5 border border-amber-400/20`}
      >
        <Shield className={mobile ? 'w-5 h-5' : 'w-4 h-4'} />
        <span className={mobile ? '' : 'flex-1'}>Super Admin</span>
      </Link>
    );
  };

  const renderUserBlock = () => (
    <div className="border-t border-white/10 pt-4 space-y-3">
      <div className="px-3 space-y-1">
        <div className="text-sm text-white/80 truncate">{user.email}</div>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
            plan.id === 'free' ? 'bg-white/5 text-white/60' : ''
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
        className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar sesión
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#07070b] text-white flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-white/10 bg-[#0a0a14] p-4 flex-shrink-0">
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

        <div className="px-2 mb-4 text-xs text-white/40 truncate">
          🏥 {clinicName}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => renderItem(item))}
          {renderSuperAdminLink()}
        </nav>

        {renderUserBlock()}
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-64 bg-[#0a0a14] p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="font-bold">
                CitasPro
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDrawerOpen(false)}
                className="text-white/60"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="px-2 mb-4 text-xs text-white/40 truncate">
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
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a0a14]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="text-white"
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
          <span className="font-bold">CitasPro</span>
          <Link href="/dashboard/billing">
            <Crown className="w-5 h-5 text-[#d4af37]" />
          </Link>
        </header>

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
