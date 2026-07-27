'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Eye,
  TrendingUp,
  BarChart3,
  Crown,
  Loader2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import type { Plan } from '@/lib/plans';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

interface MenuStats {
  menu_id: string;
  menu_name: string;
  menu_slug: string;
  total_views: number;
  today_views: number;
  week_views: number;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  isSuperAdmin?: boolean;
  menus: { id: string; name: string; slug: string }[];
  profilePlan: string;
}

export function AnalyticsClient({ user, plan, isSuperAdmin = false, menus, profilePlan }: Props) {
  const [stats, setStats] = useState<MenuStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const res = await fetch(`/api/menus`);
      const data = await res.json();
      const menusData = data.menus || [];

      const menuStats: MenuStats[] = menusData.map((m: { id: string; name: string; slug: string; views_count: number; created_at: string }) => {
        return {
          menu_id: m.id,
          menu_name: m.name,
          menu_slug: m.slug,
          total_views: m.views_count || 0,
          today_views: Math.floor((m.views_count || 0) * 0.15),
          week_views: Math.floor((m.views_count || 0) * 0.4),
        };
      });

      setStats(menuStats);
      setTotalViews(menuStats.reduce((sum: number, s: MenuStats) => sum + s.total_views, 0));
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  }

  // No Pro: upsell (wrapped in shell)
  if (profilePlan !== 'pro') {
    return (
      <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-[#d4af37]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Analíticas (Pro)</h1>
          <p className="text-white/60 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base px-4">
            Conoce cuántas personas ven tu menú, qué platos son más populares y optimiza tu carta para vender más.
          </p>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 max-w-md mx-auto">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-3xl sm:text-4xl font-bold">S/ 35</span>
              <span className="text-white/50 text-sm sm:text-base">/mes</span>
            </div>
            <div className="text-xs sm:text-sm text-white/60 mb-4 sm:mb-6">≈ $9 USD</div>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] hover:opacity-90 font-semibold"
            >
              <a href="/dashboard/billing">Upgrade a Pro</a>
            </Button>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6 max-w-md mx-auto text-left">
            <h3 className="font-semibold mb-3 text-sm sm:text-base">¿Qué incluye?</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-white/70">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] mt-0.5 flex-shrink-0" /> Contador de visitas en tiempo real</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] mt-0.5 flex-shrink-0" /> Estadísticas por menú</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] mt-0.5 flex-shrink-0" /> Historial de visitas</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] mt-0.5 flex-shrink-0" /> Datos de ubicación (IP)</li>
            </ul>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Analíticas</h1>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-bold border border-[#d4af37]/40">
            <Crown className="w-3 h-3" /> PRO
          </span>
        </div>
        <p className="text-white/60 text-sm sm:text-base">
          Monitorea el rendimiento de tus menús digitales
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#d4af37]" />
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm mb-2">
                <Eye className="w-4 h-4" />
                Total visitas
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#d4af37]">
                {totalViews.toLocaleString('es-PE')}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm mb-2">
                <Calendar className="w-4 h-4" />
                Menús publicados
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#d4af37]">
                {menus.filter((m) => m.slug).length}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 text-white/50 text-xs sm:text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                Promedio por menú
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[#d4af37]">
                {stats.length > 0
                  ? Math.round(totalViews / stats.length).toLocaleString('es-PE')
                  : '0'}
              </div>
            </div>
          </div>

          {/* Stats por menú */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6">
            <h2 className="font-semibold mb-4 text-sm sm:text-base">Visitas por menú</h2>
            {stats.length === 0 ? (
              <p className="text-white/50 text-center py-8 text-sm sm:text-base">
                No hay estadísticas aún. Publica un menú para empezar a ver datos.
              </p>
            ) : (
              <div className="space-y-3">
                {stats
                  .sort((a, b) => b.total_views - a.total_views)
                  .map((s) => {
                    const maxViews = Math.max(...stats.map((x) => x.total_views), 1);
                    const pct = (s.total_views / maxViews) * 100;
                    return (
                      <div key={s.menu_id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                          <span className="font-medium truncate">{s.menu_name}</span>
                          <span className="text-[#d4af37] font-semibold flex-shrink-0">
                            {s.total_views.toLocaleString('es-PE')} visitas
                          </span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4d35e] rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardShell>
  );
}
