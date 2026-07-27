'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Users,
  LayoutDashboard,
  Globe,
  Crown,
  Shield,
  Trash2,
  Search,
  Loader2,
  Eye,
  Menu,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  plan: string;
  is_super_admin: boolean;
  mp_status: string | null;
  current_period_end: string | null;
  created_at: string;
  menus_count: number;
}

interface DomainRow {
  id: string;
  domain: string;
  is_verified: boolean;
  ssl_status: string;
  user_id: string;
  menu_id: string | null;
  created_at: string;
  profiles: { email: string; full_name: string | null; plan: string } | null;
  menus: { name: string; slug: string } | null;
}

interface Stats {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalMenus: number;
  publishedMenus: number;
  totalCategories: number;
  totalDishes: number;
  totalDomains: number;
  verifiedDomains: number;
  totalViews: number;
  recentSignups: number;
}

type Tab = 'users' | 'stats' | 'domains';

export function AdminClient() {
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [domains, setDomains] = useState<DomainRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ tab: activeTab });
      if (activeTab === 'users') {
        params.set('search', search);
        params.set('page', String(page));
      }
      const res = await fetch(`/api/admin?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');

      if (activeTab === 'stats') {
        setStats(data.stats);
      } else if (activeTab === 'users') {
        setUsers(data.users || []);
        setTotalPages(Math.ceil((data.total || 0) / 20));
      } else if (activeTab === 'domains') {
        setDomains(data.domains || []);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleAction(action: string, userId: string, extra?: Record<string, string>) {
    setActionLoading(`${action}-${userId}`);
    try {
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      toast.success(data.newPlan ? `Plan cambiado a ${data.newPlan}` : data.is_super_admin !== undefined ? `Super admin: ${data.is_super_admin ? 'activado' : 'desactivado'}` : 'Acción completada');
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteUser(userId: string, email: string) {
    if (!confirm(`¿Eliminar usuario ${email} y todos sus menús? Esta acción no se puede deshacer.`)) return;
    await handleAction('delete_user', userId);
  }

  const statCards = stats
    ? [
        { label: 'Total usuarios', value: stats.totalUsers, icon: Users, color: '#d4af37' },
        { label: 'Usuarios Pro', value: stats.proUsers, icon: Crown, color: '#22c55e' },
        { label: 'Registros esta semana', value: stats.recentSignups, icon: TrendingUp, color: '#3b82f6' },
        { label: 'Total menús', value: stats.totalMenus, icon: Menu, color: '#f97316' },
        { label: 'Menús publicados', value: stats.publishedMenus, icon: Eye, color: '#06d6a0' },
        { label: 'Total platos', value: stats.totalDishes, icon: LayoutDashboard, color: '#a855f7' },
        { label: 'Vistas totales', value: stats.totalViews, icon: TrendingUp, color: '#ec4899' },
        { label: 'Dominios', value: `${stats.verifiedDomains}/${stats.totalDomains}`, icon: Globe, color: '#14b8a6' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a14]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="text-white/60 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-lg">Super Admin</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 text-xs font-semibold">
                Carta Digital Pro
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="text-white/60 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/10 bg-[#0a0a14]/80">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          {([
            { key: 'stats' as Tab, label: 'Estadísticas', icon: LayoutDashboard },
            { key: 'users' as Tab, label: 'Usuarios', icon: Users },
            { key: 'domains' as Tab, label: 'Dominios', icon: Globe },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-white/50 hover:text-white/80'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          loading && !stats ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className="bg-white/[0.03] border border-white/10 rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <card.icon className="w-4 h-4" style={{ color: card.color }} />
                      <span className="text-xs text-white/50">{card.label}</span>
                    </div>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </div>
                ))}
              </div>

              {/* Revenue estimate */}
              {stats && (
                <div className="bg-gradient-to-r from-amber-400/10 to-transparent border border-amber-400/30 rounded-2xl p-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    Ingresos estimados mensuales
                  </h3>
                  <div className="text-3xl font-bold text-amber-400">
                    S/ {stats.proUsers * 35}
                    <span className="text-sm text-white/40 ml-2">
                      ≈ ${stats.proUsers * 9} USD
                    </span>
                  </div>
                  <p className="text-sm text-white/50 mt-2">
                    Basado en {stats.proUsers} suscriptores Pro × S/35/mes
                  </p>
                </div>
              )}
            </>
          )
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            {/* Search */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Buscar por email o nombre..."
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
              <span className="text-sm text-white/40">
                {users.length} usuarios
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sin usuarios</h3>
                <p className="text-white/50">No se encontraron usuarios.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden"
                    >
                      {/* User row */}
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02]"
                        onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-sm font-bold text-white/60 flex-shrink-0">
                            {(u.full_name || u.email)[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">
                              {u.full_name || 'Sin nombre'}
                              {u.is_super_admin && (
                                <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 text-[10px] font-bold">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-white/50 truncate">{u.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.plan === 'pro'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-white/5 text-white/60'
                          }`}>
                            {u.plan === 'pro' ? 'Pro' : 'Free'}
                          </span>
                          <span className="text-xs text-white/40">
                            {u.menus_count} menú{u.menus_count !== 1 ? 's' : ''}
                          </span>
                          <span className="text-xs text-white/30">
                            {new Date(u.created_at).toLocaleDateString('es-PE')}
                          </span>
                        </div>
                      </div>

                      {/* Expanded actions */}
                      {expandedUser === u.id && (
                        <div className="border-t border-white/10 p-4 bg-white/[0.02]">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                            <div>
                              <span className="text-white/40">Plan:</span>{' '}
                              <span className="font-medium">{u.plan}</span>
                            </div>
                            <div>
                              <span className="text-white/40">MP Status:</span>{' '}
                              <span className="font-medium">{u.mp_status || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-white/40">Menús:</span>{' '}
                              <span className="font-medium">{u.menus_count}</span>
                            </div>
                            <div>
                              <span className="text-white/40">Registro:</span>{' '}
                              <span className="font-medium">
                                {new Date(u.created_at).toLocaleDateString('es-PE')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction('toggle_plan', u.id)}
                              disabled={actionLoading === `toggle_plan-${u.id}`}
                              className={`border-amber-400/40 text-amber-400 hover:bg-amber-400/10 ${
                                u.plan === 'pro' ? '' : 'bg-amber-400/10'
                              }`}
                            >
                              {actionLoading === `toggle_plan-${u.id}` ? (
                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <Crown className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              {u.plan === 'pro' ? 'Cambiar a Free' : 'Dar Pro'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction('toggle_super_admin', u.id)}
                              disabled={actionLoading === `toggle_super_admin-${u.id}`}
                              className={`border-amber-400/40 text-amber-400 hover:bg-amber-400/10 ${
                                u.is_super_admin ? 'bg-amber-400/10' : ''
                              }`}
                            >
                              {actionLoading === `toggle_super_admin-${u.id}` ? (
                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <Shield className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              {u.is_super_admin ? 'Quitar Admin' : 'Dar Admin'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              disabled={actionLoading === `delete_user-${u.id}`}
                              className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                            >
                              {actionLoading === `delete_user-${u.id}` ? (
                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="text-white/60"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-white/50">
                      Página {page} de {totalPages}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="text-white/60"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Domains Tab */}
        {activeTab === 'domains' && (
          loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            </div>
          ) : domains.length === 0 ? (
            <div className="text-center py-16">
              <Globe className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin dominios personalizados</h3>
              <p className="text-white/50">Ningún usuario ha configurado dominios aún.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-white/50">
                    <th className="pb-3 pr-4">Dominio</th>
                    <th className="pb-3 pr-4">Usuario</th>
                    <th className="pb-3 pr-4">Menú</th>
                    <th className="pb-3 pr-4">Estado</th>
                    <th className="pb-3 pr-4">SSL</th>
                    <th className="pb-3">Creado</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map((d) => (
                    <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 pr-4 font-medium">{d.domain}</td>
                      <td className="py-3 pr-4">
                        <div>{d.profiles?.full_name || '—'}</div>
                        <div className="text-xs text-white/40">{d.profiles?.email}</div>
                      </td>
                      <td className="py-3 pr-4">
                        {d.menus?.name || '—'}
                      </td>
                      <td className="py-3 pr-4">
                        {d.is_verified ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-400">
                            <XCircle className="w-3.5 h-3.5" /> Pendiente
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          d.ssl_status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : d.ssl_status === 'failed'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-white/5 text-white/60'
                        }`}>
                          {d.ssl_status}
                        </span>
                      </td>
                      <td className="py-3 text-white/50">
                        {new Date(d.created_at).toLocaleDateString('es-PE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </main>
    </div>
  );
}
