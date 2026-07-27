'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LogOut,
  BarChart3,
  CreditCard,
  Globe,
  LayoutDashboard,
  Crown,
  Shield,
  Home,
  Menu as MenuIcon,
  X,
  HelpCircle,
  Utensils,
  UtensilsCrossed,
  ClipboardList,
  ChefHat,
  Package,
  Lock,
  TrendingUp,
} from 'lucide-react';
import type { Plan } from '@/lib/plans';
import { isPlanAtLeast, type PlanId } from '@/lib/plans';
import { InstallAppButton } from '@/components/pwa/install-app-button';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  pro?: boolean;
  premium?: boolean; // requiere Premium o superior
  full?: boolean; // requiere Full
  superAdmin?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Mis menús', icon: LayoutDashboard },
  { href: '/dashboard/guia', label: 'Guía', icon: HelpCircle },
  { href: '/dashboard/analytics', label: 'Analíticas', icon: BarChart3, pro: true },
  { href: '/dashboard/domains', label: 'Dominios', icon: Globe, pro: true },
  { href: '/dashboard/mesas', label: 'Mesas', icon: Utensils, premium: true },
  { href: '/dashboard/mozos', label: 'Mozos', icon: UtensilsCrossed, premium: true },
  { href: '/dashboard/comandas', label: 'Comandas', icon: ClipboardList, premium: true },
  { href: '/dashboard/cocina', label: 'Cocina', icon: ChefHat, premium: true },
  { href: '/dashboard/inventario', label: 'Inventario', icon: Package, premium: true },
  { href: '/dashboard/reportes', label: 'Reportes', icon: TrendingUp, full: true },
  { href: '/dashboard/billing', label: 'Planes', icon: CreditCard },
];

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  isSuperAdmin?: boolean;
  children: ReactNode;
}

export function DashboardShell({ user, plan, isSuperAdmin = false, children }: Props) {
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

    // ¿Está bloqueado?
    let locked = false;
    let lockReason = '';
    if (item.premium && !isPlanAtLeast(plan.id, 'premium' as PlanId)) {
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
        <span className="flex-1 min-w-0 truncate">{mobile ? item.label.split(' ')[0] : item.label}</span>
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
      {/* ───────── Sidebar desktop (lg+) ───────── */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-white/10 bg-[#0a0a14] p-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <Link
            href="/"
            prefetch={false}
            className="hover:opacity-90 transition"
          >
            <img
              src="/logo.png"
              alt="MenuPro"
              width={36}
              height={36}
              className="rounded-lg"
              style={{ width: 36, height: 36 }}
            />
          </Link>
          <Link
            href="/"
            prefetch={false}
            className="font-bold hover:text-[#d4af37] transition"
          >
            MenuPro
          </Link>
        </div>

        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map((item) => renderItem(item))}
          {renderSuperAdminLink()}
          <Link
            href="/"
            prefetch={false}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 text-sm transition-colors mt-2 border-t border-white/5 pt-3"
          >
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
        </nav>

        {/* Botón instalar app — PWA plan-aware */}
        <div className="border-t border-white/10 pt-3 px-2">
          <InstallAppButton
            variant="dashboard"
            size="sm"
            style="compact"
            planId={plan.id}
            className="w-full justify-center"
          />
          {plan.id === 'free' && (
            <Link
              href="/dashboard/billing"
              className="mt-2 block text-center text-[10px] text-[#d4af37]/80 hover:text-[#d4af37] transition"
            >
              ⚡ Sube a Pro para PWA optimizada →
            </Link>
          )}
        </div>

        {renderUserBlock()}
      </aside>

      {/* ───────── Drawer mobile (overlay) ───────── */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="relative w-72 max-w-[80vw] bg-[#0a0a14] border-r border-white/10 p-4 flex flex-col animate-in slide-in-from-left">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                prefetch={false}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3"
              >
                <img
                  src="/logo.png"
                  alt="MenuPro"
                  width={36}
                  height={36}
                  className="rounded-lg"
                  style={{ width: 36, height: 36 }}
                />
                <span className="font-bold">MenuPro</span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
                aria-label="Cerrar menú"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="space-y-1 flex-1">
              {NAV_ITEMS.map((item) => renderItem(item))}
              {renderSuperAdminLink()}
              <Link
                href="/"
                prefetch={false}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 text-sm mt-2"
              >
                <Home className="w-4 h-4" /> Volver al inicio
              </Link>
            </nav>
            {renderUserBlock()}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-0">
        {/* Mobile header (sticky) */}
        <header className="lg:hidden border-b border-white/10 bg-[#0a0a14] backdrop-blur sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                aria-label="Abrir menú"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <img
                  src="/logo-192.png"
                  alt="MenuPro"
                  width={28}
                  height={28}
                  className="rounded-lg"
                  style={{ width: 28, height: 28 }}
                />
                <span className="font-bold text-sm">MenuPro</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  plan.id === 'free' ? 'bg-white/5 text-white/60' : ''
                }`}
                style={
                  plan.id !== 'free'
                    ? {
                        background: `${plan.color}20`,
                        color: plan.color,
                      }
                    : undefined
                }
              >
                {plan.name}
              </span>
              <InstallAppButton
                variant="dashboard"
                size="sm"
                style="ghost"
                showLabel={false}
                planId={plan.id}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-white/60 h-9 w-9"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full max-w-6xl mx-auto">
          {children}
        </main>

        {/* ───────── Bottom nav mobile (fija) ───────── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a14]/95 backdrop-blur border-t border-white/10 safe-bottom">
          <div className="grid grid-cols-5 gap-1 px-2 py-1.5">
            {/* Items relevantes según plan */}
            {(() => {
              const isPremium = isPlanAtLeast(plan.id, 'premium' as PlanId);
              const isFull = isPlanAtLeast(plan.id, 'full' as PlanId);
              let mobileItems: NavItem[];
              if (isFull) {
                mobileItems = [
                  NAV_ITEMS[0], // Mis menús
                  NAV_ITEMS.find(i => i.href === '/dashboard/comandas')!,
                  NAV_ITEMS.find(i => i.href === '/dashboard/cocina')!,
                  NAV_ITEMS.find(i => i.href === '/dashboard/reportes')!,
                ];
              } else if (isPremium) {
                mobileItems = [
                  NAV_ITEMS[0], // Mis menús
                  NAV_ITEMS.find(i => i.href === '/dashboard/comandas')!,
                  NAV_ITEMS.find(i => i.href === '/dashboard/cocina')!,
                  NAV_ITEMS.find(i => i.href === '/dashboard/billing')!,
                ];
              } else {
                mobileItems = [
                  NAV_ITEMS[0], // Mis menús
                  NAV_ITEMS.find(i => i.href === '/dashboard/guia')!,
                  NAV_ITEMS.find(i => i.href === '/dashboard/analytics')!,
                  NAV_ITEMS.find(i => i.href === '/dashboard/billing')!,
                ];
              }
              return mobileItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[10px] ${
                      active ? 'bg-white/5 text-white font-medium' : 'text-white/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label.split(' ')[0]}
                  </Link>
                );
              });
            })()}
            <Link
              href="/"
              prefetch={false}
              className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-white/50 text-[10px]"
            >
              <Home className="w-5 h-5" />
              Inicio
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
