'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  Users,
  LayoutDashboard,
  Globe,
  Crown,
  Shield,
  Trash2,
  Search,
  Loader2,
  Eye,
  Menu as MenuIcon,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  XCircle,
  UserCog,
  Ban,
  UserCheck,
  DollarSign,
  Activity,
  X,
  ExternalLink,
  Phone,
  Hash,
  Home,
  Camera,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AdminInfo {
  email: string;
  name: string;
  avatar_url: string | null;
}

interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: string;
  is_super_admin: boolean;
  is_active: boolean;
  banned_at: string | null;
  banned_reason: string | null;
  mp_status: string | null;
  mp_preapproval_id: string | null;
  current_period_end: string | null;
  bg_removals_used: number;
  bg_removals_reset_at: string;
  created_at: string;
  updated_at: string;
  menus_count: number;
  views_total: number;
  published_menus: number;
  dishes_count: number;
}

interface Stats {
  total_users: number;
  active_users: number;
  banned_users: number;
  pro_users: number;
  free_users: number;
  super_admins: number;
  total_menus: number;
  published_menus: number;
  total_categories: number;
  total_dishes: number;
  total_views: number;
  total_domains: number;
  verified_domains: number;
  recent_signups_7d: number;
  recent_signups_30d: number;
  revenue_estimate_pen: number;
  revenue_estimate_usd: number;
  top_menus_by_views: Array<{
    id: string;
    name: string;
    slug: string;
    views_count: number;
    owner_email: string;
    owner_name: string | null;
  }>;
}

interface UserDetail {
  profile: UserRow;
  menus: Array<any>;
  domains: Array<any>;
  recent_views: Array<any>;
}

type Tab = 'stats' | 'users' | 'domains';

export function SuperAdminClient({ admin }: { admin: AdminInfo }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(admin.avatar_url);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Handle admin avatar upload (own profile)
  const handleAvatarUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar 5MB');
      return;
    }
    setAvatarUploading(true);
    try {
      // 1. Upload to /api/upload (handles sharp + Supabase storage)
      const formData = new FormData();
      formData.append('file', file);
      const upRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const upData = await upRes.json();
      if (!upRes.ok) throw new Error(upData.error || 'Error al subir');
      const avatarUrl = upData.url;

      // 2. Update profiles.avatar_url via /api/admin (action: update_avatar)
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_avatar', userId: '', avatarUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar');
      setCurrentAvatar(avatarUrl);
      toast.success('Foto de perfil actualizada');
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar avatar');
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  }, []);

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

  async function handleAction(action: string, userId: string, extra?: Record<string, any>) {
    setActionLoading(`${action}-${userId}`);
    try {
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');

      if (action === 'toggle_plan') {
        toast.success(`Plan cambiado a ${data.newPlan}`);
      } else if (action === 'set_plan') {
        toast.success(`Plan actualizado a ${data.newPlan?.toUpperCase()}`);
      } else if (action === 'toggle_super_admin') {
        toast.success(`Super admin: ${data.is_super_admin ? 'activado' : 'desactivado'}`);
      } else if (action === 'toggle_active') {
        toast.success(data.is_active ? 'Usuario reactivado' : 'Usuario desactivado');
      } else {
        toast.success('Acción completada');
      }
      fetchData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleViewUserDetail(userId: string) {
    setDetailLoading(true);
    setDetailModalOpen(true);
    try {
      const res = await fetch(`/api/admin?tab=user_detail&userId=${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setUserDetail(data.detail);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
      setUserDetail(null);
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleDeleteUser(userId: string, email: string) {
    if (!confirm(`¿Eliminar usuario ${email} y TODOS sus menús, categorías, platos, dominios y vistas? Esta acción es IRREVERSIBLE.`)) return;
    await handleAction('delete_user', userId);
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      router.push('/login');
    }
  }

  const statCards = stats
    ? [
        { label: 'Total usuarios', value: stats.total_users, icon: Users, color: '#d4af37', sub: `${stats.active_users} activos · ${stats.banned_users} baneados` },
        { label: 'Usuarios Pro', value: stats.pro_users, icon: Crown, color: '#22c55e', sub: `${stats.free_users} gratis` },
        { label: 'Registros 7 días', value: stats.recent_signups_7d, icon: TrendingUp, color: '#3b82f6', sub: `${stats.recent_signups_30d} en 30 días` },
        { label: 'Total menús', value: stats.total_menus, icon: MenuIcon, color: '#f97316', sub: `${stats.published_menus} publicados` },
        { label: 'Total platos', value: stats.total_dishes, icon: Hash, color: '#a855f7', sub: `${stats.total_categories} categorías` },
        { label: 'Vistas totales', value: stats.total_views, icon: Eye, color: '#ec4899', sub: 'Acumulado global' },
        { label: 'Dominios', value: `${stats.verified_domains}/${stats.total_domains}`, icon: Globe, color: '#14b8a6', sub: 'verificados/total' },
        { label: 'Super admins', value: stats.super_admins, icon: Shield, color: '#ef4444', sub: 'con acceso total' },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* TOP NAV */}
      <header className="border-b border-amber-500/20 bg-gradient-to-r from-[#0a0a14] via-[#0f0a1a] to-[#0a0a14] sticky top-0 z-40 safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src="/logo.png"
                alt="MenuPro"
                width={40}
                height={40}
                className="rounded-xl shadow-lg shadow-amber-500/30 sm:w-10 sm:h-10"
                style={{ width: 36, height: 36 }}
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border-2 border-[#0a0a14] flex items-center justify-center">
                <Shield className="w-2 h-2 text-black" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm sm:text-base leading-tight flex items-center gap-2 flex-wrap">
                <span className="truncate">MenuPro · Super Admin</span>
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[9px] sm:text-[10px] font-bold border border-amber-500/30 flex-shrink-0">
                  MODO DIOS
                </span>
              </div>
              <div className="text-[10px] sm:text-xs text-white/40 leading-tight hidden xs:block">Panel interno · Solo administración</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              {/* Avatar with upload overlay — click to upload new photo */}
              <div className="relative group">
                {currentAvatar ? (
                  <img src={currentAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-[10px] font-bold text-black">
                    {admin.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Cambiar foto de perfil"
                  aria-label="Cambiar foto de perfil"
                >
                  {avatarUploading ? (
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                  ) : (
                    <Camera className="w-2.5 h-2.5" />
                  )}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarUpload(file);
                  }}
                />
              </div>
              <span className="text-xs text-white/70 hidden md:inline">{admin.email}</span>
            </div>
            <a
              href="/dashboard"
              className="text-[11px] sm:text-xs text-white/60 hover:text-white px-2 sm:px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition whitespace-nowrap"
              title="Ir al dashboard de usuario normal"
            >
              <span className="hidden sm:inline">Ver dashboard</span>
              <span className="sm:hidden">Dash</span>
            </a>
            <a
              href="/"
              className="text-[11px] sm:text-xs text-white/60 hover:text-white px-2 sm:px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition whitespace-nowrap"
              title="Volver a inicio"
            >
              <Home className="w-3.5 h-3.5 sm:mr-1.5 inline" />
              <span className="hidden sm:inline">Inicio</span>
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10 h-9 px-2 sm:px-3"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* TABS — Mobile horizontal scroll */}
      <div className="border-b border-white/10 bg-[#070710]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex gap-1 overflow-x-auto scrollbar-none">
          {([
            { key: 'stats' as Tab, label: 'Estadísticas', icon: LayoutDashboard },
            { key: 'users' as Tab, label: 'Usuarios', icon: Users },
            { key: 'domains' as Tab, label: 'Dominios', icon: Globe },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              className={`flex items-center gap-2 px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.key
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-white/50 hover:text-white/80'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 lg:pb-8">
        {/* STATS TAB */}
        {activeTab === 'stats' && (
          loading && !stats ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            </div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {statCards.map((card) => (
                  <div
                    key={card.label}
                    className="bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <card.icon className="w-4 h-4 flex-shrink-0" style={{ color: card.color }} />
                      <span className="text-[10px] sm:text-xs text-white/50 truncate">{card.label}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold truncate">{card.value}</div>
                    <div className="text-[9px] sm:text-[10px] text-white/30 mt-1 truncate">{card.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                    Ingresos estimados
                  </h3>
                  <div className="text-3xl sm:text-4xl font-bold text-amber-400">
                    S/ {stats.revenue_estimate_pen}
                    <span className="text-sm sm:text-base text-white/40 ml-2 block sm:inline">
                      ≈ ${stats.revenue_estimate_usd} USD
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mt-2">
                    {stats.pro_users} suscriptores Pro × S/35/mes
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    Actividad reciente
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/60 text-xs sm:text-sm">Registros esta semana</span>
                      <span className="font-bold text-emerald-400 text-sm sm:text-base">{stats.recent_signups_7d}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 text-xs sm:text-sm">Registros este mes</span>
                      <span className="font-bold text-emerald-400 text-sm sm:text-base">{stats.recent_signups_30d}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60 text-xs sm:text-sm">Vistas totales</span>
                      <span className="font-bold text-emerald-400 text-sm sm:text-base">{stats.total_views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  Top 10 menús más vistos
                </h3>
                {stats.top_menus_by_views && stats.top_menus_by_views.length > 0 ? (
                  <div className="space-y-2">
                    {stats.top_menus_by_views.map((m, idx) => (
                      <div key={m.id} className="flex items-center justify-between p-2 sm:p-3 bg-white/[0.02] rounded-lg hover:bg-white/[0.04] transition-colors gap-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0 ${
                            idx === 0 ? 'bg-amber-500/30 text-amber-300' :
                            idx === 1 ? 'bg-gray-400/20 text-gray-300' :
                            idx === 2 ? 'bg-orange-700/30 text-orange-300' :
                            'bg-white/5 text-white/40'
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium text-xs sm:text-sm truncate">{m.name}</div>
                            <div className="text-[10px] sm:text-xs text-white/40 truncate">{m.owner_email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                          <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-bold whitespace-nowrap">
                            {m.views_count.toLocaleString()}
                          </span>
                          <a
                            href={`/r/${m.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white/40 hover:text-white hidden sm:inline"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/40 text-center py-6">No hay datos aún</p>
                )}
              </div>
            </>
          ) : null
        )}

        {/* USERS TAB — Desktop table + Mobile cards */}
        {activeTab === 'users' && (
          <>
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 flex-wrap">
              <div className="relative flex-1 min-w-0 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Buscar por email o nombre..."
                  className="pl-10 bg-white/5 border-white/10 text-white h-10"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchData}
                disabled={loading}
                className="text-white/60 h-10 flex-shrink-0"
              >
                <RefreshCw className={`w-4 h-4 sm:mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
              <span className="text-xs sm:text-sm text-white/40 sm:ml-auto w-full sm:w-auto text-center sm:text-right">
                {users.length} usuario{users.length !== 1 ? 's' : ''} · página {page}
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
                <p className="text-white/50">No se encontraron usuarios con ese criterio.</p>
              </div>
            ) : (
              <>
                {/* ───────── DESKTOP TABLE ───────── */}
                <div className="hidden lg:block bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-white/[0.03] border-b border-white/10">
                      <tr className="text-left text-xs text-white/50 uppercase tracking-wider">
                        <th className="px-5 py-3 font-medium">Usuario</th>
                        <th className="px-5 py-3 font-medium">Plan</th>
                        <th className="px-5 py-3 font-medium text-center">Menús</th>
                        <th className="px-5 py-3 font-medium text-center">Vistas</th>
                        <th className="px-5 py-3 font-medium">Estado</th>
                        <th className="px-5 py-3 font-medium">Registro</th>
                        <th className="px-5 py-3 font-medium text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr
                          key={u.id}
                          className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${
                            u.is_active === false ? 'bg-red-500/[0.03]' : ''
                          }`}
                        >
                          {/* User cell */}
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                u.is_super_admin
                                  ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-black'
                                  : u.avatar_url ? '' : 'bg-white/10 text-white/60'
                              }`}>
                                {u.avatar_url ? (
                                  <img src={u.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                                ) : (
                                  (u.full_name || u.email)[0].toUpperCase()
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="font-medium text-sm truncate flex items-center gap-2">
                                  <span className="truncate">{u.full_name || 'Sin nombre'}</span>
                                  {u.is_super_admin && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold border border-amber-500/30 flex-shrink-0">
                                      SUPER ADMIN
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-white/40 truncate">{u.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Plan */}
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.plan === 'pro'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-white/10 text-white/60'
                            }`}>
                              {u.plan?.toUpperCase()}
                            </span>
                          </td>

                          {/* Menus */}
                          <td className="px-5 py-3 text-center">
                            <span className="font-semibold">{u.menus_count}</span>
                            <span className="text-xs text-white/40 ml-1">({u.published_menus} pub.)</span>
                          </td>

                          {/* Views */}
                          <td className="px-5 py-3 text-center">
                            <span className="font-semibold">{u.views_total}</span>
                          </td>

                          {/* Estado */}
                          <td className="px-5 py-3">
                            {u.is_active === false ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
                                <Ban className="w-3 h-3" /> BANEADO
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3" /> ACTIVO
                              </span>
                            )}
                          </td>

                          {/* Fecha */}
                          <td className="px-5 py-3 text-white/50 text-xs">
                            {new Date(u.created_at).toLocaleDateString('es-PE')}
                          </td>

                          {/* Acciones */}
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleViewUserDetail(u.id)}
                                className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition"
                                title="Ver detalle"
                                aria-label="Ver detalle"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    disabled={actionLoading === `set_plan-${u.id}`}
                                    className={`p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition disabled:opacity-50 inline-flex items-center gap-1 ${
                                      u.plan !== 'free' ? 'bg-amber-500/10' : ''
                                    }`}
                                    title="Cambiar plan"
                                    aria-label="Cambiar plan"
                                  >
                                    {actionLoading === `set_plan-${u.id}` ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Crown className="w-4 h-4" />
                                    )}
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuLabel className="text-xs text-white/50">
                                    Cambiar plan
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {(['free', 'pro', 'premium', 'full'] as const).map((plan) => (
                                    <DropdownMenuItem
                                      key={plan}
                                      onClick={() => handleAction('set_plan', u.id, { plan })}
                                      disabled={u.plan === plan}
                                      className={`flex items-center justify-between cursor-pointer ${
                                        u.plan === plan ? 'opacity-50 cursor-default' : ''
                                      }`}
                                    >
                                      <span className="flex items-center gap-2">
                                        <Crown className={`w-3.5 h-3.5 ${
                                          plan === 'free' ? 'text-white/40' :
                                          plan === 'pro' ? 'text-emerald-400' :
                                          plan === 'premium' ? 'text-blue-400' :
                                          'text-amber-400'
                                        }`} />
                                        <span className="font-semibold uppercase text-xs">{plan}</span>
                                      </span>
                                      {u.plan === plan && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                      )}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              {!u.is_super_admin && (
                                <button
                                  onClick={() => handleAction('toggle_super_admin', u.id)}
                                  disabled={actionLoading === `toggle_super_admin-${u.id}`}
                                  className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-500/10 transition disabled:opacity-50"
                                  title="Hacer Super Admin"
                                  aria-label="Hacer Super Admin"
                                >
                                  {actionLoading === `toggle_super_admin-${u.id}` ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <UserCog className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                              {!u.is_super_admin && (
                                <button
                                  onClick={() => handleAction('toggle_active', u.id, u.is_active === false ? undefined : { reason: 'Desactivado por admin' })}
                                  disabled={actionLoading === `toggle_active-${u.id}`}
                                  className={`p-1.5 rounded-lg transition disabled:opacity-50 ${
                                    u.is_active === false
                                      ? 'text-emerald-400 hover:bg-emerald-500/10'
                                      : 'text-orange-400 hover:bg-orange-500/10'
                                  }`}
                                  title={u.is_active === false ? 'Reactivar' : 'Banear'}
                                  aria-label={u.is_active === false ? 'Reactivar' : 'Banear'}
                                >
                                  {actionLoading === `toggle_active-${u.id}` ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : u.is_active === false ? (
                                    <UserCheck className="w-4 h-4" />
                                  ) : (
                                    <Ban className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                              {!u.is_super_admin && (
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.email)}
                                  disabled={actionLoading === `delete_user-${u.id}`}
                                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                                  title="Eliminar usuario"
                                  aria-label="Eliminar usuario"
                                >
                                  {actionLoading === `delete_user-${u.id}` ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* ───────── MOBILE CARDS ───────── */}
                <div className="lg:hidden space-y-3">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className={`bg-white/[0.03] border rounded-2xl p-4 ${
                        u.is_active === false ? 'border-red-500/40' : 'border-white/10'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          u.is_super_admin
                            ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-black'
                            : u.avatar_url ? '' : 'bg-white/10 text-white/60'
                        }`}>
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                          ) : (
                            (u.full_name || u.email)[0].toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm truncate flex items-center gap-1.5 flex-wrap">
                            <span className="truncate">{u.full_name || 'Sin nombre'}</span>
                          </div>
                          <div className="text-xs text-white/50 truncate">{u.email}</div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {u.is_super_admin && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold border border-amber-500/30">
                                SUPER ADMIN
                              </span>
                            )}
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              u.plan === 'pro'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-white/10 text-white/60'
                            }`}>
                              {u.plan?.toUpperCase()}
                            </span>
                            {u.is_active === false ? (
                              <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold">
                                BANEADO
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                                ACTIVO
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stats inline */}
                      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                        <div className="bg-white/[0.03] rounded-lg p-2">
                          <div className="text-base font-bold">{u.menus_count}</div>
                          <div className="text-[10px] text-white/40 uppercase">Menús</div>
                        </div>
                        <div className="bg-white/[0.03] rounded-lg p-2">
                          <div className="text-base font-bold text-pink-400">{u.views_total}</div>
                          <div className="text-[10px] text-white/40 uppercase">Vistas</div>
                        </div>
                        <div className="bg-white/[0.03] rounded-lg p-2">
                          <div className="text-base font-bold text-purple-400">{u.dishes_count}</div>
                          <div className="text-[10px] text-white/40 uppercase">Platos</div>
                        </div>
                      </div>

                      {/* Action grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewUserDetail(u.id)}
                          className="border-blue-500/40 text-blue-400 hover:bg-blue-500/10 h-9 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          Detalle
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={actionLoading === `set_plan-${u.id}`}
                              className={`border-amber-500/40 text-amber-400 hover:bg-amber-500/10 h-9 text-xs justify-between ${
                                u.plan !== 'free' ? 'bg-amber-500/10' : ''
                              }`}
                            >
                              {actionLoading === `set_plan-${u.id}` ? (
                                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <Crown className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              <span className="uppercase">{u.plan || 'free'}</span>
                              <ChevronDown className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuLabel className="text-xs text-white/50">
                              Cambiar plan
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {(['free', 'pro', 'premium', 'full'] as const).map((plan) => (
                              <DropdownMenuItem
                                key={plan}
                                onClick={() => handleAction('set_plan', u.id, { plan })}
                                disabled={u.plan === plan}
                                className={`flex items-center justify-between cursor-pointer ${
                                  u.plan === plan ? 'opacity-50 cursor-default' : ''
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <Crown className={`w-3.5 h-3.5 ${
                                    plan === 'free' ? 'text-white/40' :
                                    plan === 'pro' ? 'text-emerald-400' :
                                    plan === 'premium' ? 'text-blue-400' :
                                    'text-amber-400'
                                  }`} />
                                  <span className="font-semibold uppercase text-xs">{plan}</span>
                                </span>
                                {u.plan === plan && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {!u.is_super_admin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction('toggle_super_admin', u.id)}
                            disabled={actionLoading === `toggle_super_admin-${u.id}`}
                            className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 h-9 text-xs"
                          >
                            {actionLoading === `toggle_super_admin-${u.id}` ? (
                              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            ) : (
                              <UserCog className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            Super Admin
                          </Button>
                        )}
                        {!u.is_super_admin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction('toggle_active', u.id, u.is_active === false ? undefined : { reason: 'Desactivado por admin' })}
                            disabled={actionLoading === `toggle_active-${u.id}`}
                            className={`h-9 text-xs ${
                              u.is_active === false
                                ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                                : 'border-orange-500/40 text-orange-400 hover:bg-orange-500/10'
                            }`}
                          >
                            {actionLoading === `toggle_active-${u.id}` ? (
                              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            ) : u.is_active === false ? (
                              <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                            ) : (
                              <Ban className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            {u.is_active === false ? 'Reactivar' : 'Banear'}
                          </Button>
                        )}
                        {!u.is_super_admin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            disabled={actionLoading === `delete_user-${u.id}`}
                            className="col-span-2 border-red-500/40 text-red-400 hover:bg-red-500/10 h-9 text-xs"
                          >
                            {actionLoading === `delete_user-${u.id}` ? (
                              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            Eliminar usuario
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="text-white/60 h-9 w-9 p-0">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-white/50">Página {page} de {totalPages}</span>
                    <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="text-white/60 h-9 w-9 p-0">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* DOMAINS TAB — Mobile cards, desktop table */}
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
            <>
              <div className="md:hidden space-y-3">
                {domains.map((d) => (
                  <div key={d.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm truncate">{d.domain}</div>
                      {d.is_verified ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-[10px] flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Verificado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-400 text-[10px] flex-shrink-0">
                          <XCircle className="w-3 h-3" /> Pendiente
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/60 mb-1">
                      {d.profiles?.full_name || '—'} · {d.profiles?.email}
                    </div>
                    <div className="text-xs text-white/40">
                      Menú: {d.menus?.name || '—'}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-white/40">SSL</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        d.ssl_status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                        d.ssl_status === 'failed' ? 'bg-red-500/20 text-red-400' :
                        'bg-white/5 text-white/60'
                      }`}>
                        {d.ssl_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden md:block overflow-x-auto bg-white/[0.03] border border-white/10 rounded-2xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-white/50 text-xs">
                      <th className="p-4">Dominio</th>
                      <th className="p-4">Usuario</th>
                      <th className="p-4">Menú</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">SSL</th>
                      <th className="p-4">Creado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domains.map((d) => (
                      <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-4 font-medium">{d.domain}</td>
                        <td className="p-4">
                          <div>{d.profiles?.full_name || '—'}</div>
                          <div className="text-xs text-white/40">{d.profiles?.email}</div>
                        </td>
                        <td className="p-4">{d.menus?.name || '—'}</td>
                        <td className="p-4">
                          {d.is_verified ? (
                            <span className="flex items-center gap-1 text-emerald-400 text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verificado
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-400 text-xs">
                              <XCircle className="w-3.5 h-3.5" /> Pendiente
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            d.ssl_status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                            d.ssl_status === 'failed' ? 'bg-red-500/20 text-red-400' :
                            'bg-white/5 text-white/60'
                          }`}>
                            {d.ssl_status}
                          </span>
                        </td>
                        <td className="p-4 text-white/50">{new Date(d.created_at).toLocaleDateString('es-PE')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )
        )}
      </main>

      {/* USER DETAIL MODAL — Mobile-first ultra-pro responsive */}
      {detailModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setDetailModalOpen(false)}
        >
          <div
            className="bg-[#0a0a14] border border-amber-500/30 rounded-t-3xl sm:rounded-2xl max-w-4xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[#0a0a14]/95 backdrop-blur border-b border-white/10 px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between z-10">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 min-w-0">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
                <span className="truncate">Detalle del usuario</span>
              </h2>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition flex-shrink-0"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              {detailLoading || !userDetail ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
                </div>
              ) : (
                <>
                  {/* Profile card */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xl font-bold text-black flex-shrink-0 mx-auto sm:mx-0">
                        {userDetail.profile.full_name?.[0]?.toUpperCase() ||
                          userDetail.profile.email?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="text-center sm:text-left min-w-0 flex-1">
                        <div className="font-bold text-base sm:text-lg break-words">
                          {userDetail.profile.full_name || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-white/60 break-words">{userDetail.profile.email}</div>
                        <div className="flex flex-wrap gap-1.5 mt-2 justify-center sm:justify-start">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                            userDetail.profile.plan === 'pro'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-white/10 text-white/60'
                          }`}>
                            {userDetail.profile.plan?.toUpperCase()}
                          </span>
                          {userDetail.profile.is_super_admin && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] sm:text-xs font-bold">
                              SUPER ADMIN
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                            userDetail.profile.is_active === false
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {userDetail.profile.is_active === false ? 'BANEADO' : 'ACTIVO'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm pt-3 border-t border-white/5">
                      <div className="min-w-0">
                        <div className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">ID</div>
                        <div className="font-mono text-xs truncate">{userDetail.profile.id?.slice(0, 8) || '—'}...</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Registro</div>
                        <div className="text-xs sm:text-sm">{new Date(userDetail.profile.created_at).toLocaleDateString('es-PE')}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">MP Status</div>
                        <div className="text-xs sm:text-sm">{userDetail.profile.mp_status || '—'}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">BG removals</div>
                        <div className="text-xs sm:text-sm">{userDetail.profile.bg_removals_used}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Renovación</div>
                        <div className="text-xs sm:text-sm">{userDetail.profile.current_period_end
                          ? new Date(userDetail.profile.current_period_end).toLocaleDateString('es-PE')
                          : '—'}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Última act.</div>
                        <div className="text-xs sm:text-sm">{new Date(userDetail.profile.updated_at).toLocaleDateString('es-PE')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-amber-400">{userDetail.profile.menus_count || 0}</div>
                      <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Menús</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-emerald-400">{userDetail.profile.published_menus || 0}</div>
                      <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Publicados</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-pink-400">{userDetail.profile.views_total || 0}</div>
                      <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Vistas</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-400">{userDetail.profile.dishes_count || 0}</div>
                      <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">Platos</div>
                    </div>
                  </div>

                  {/* Menus list */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <MenuIcon className="w-4 h-4 text-amber-400" />
                      Menús ({userDetail.menus?.length || 0})
                    </h3>
                    {(userDetail.menus?.length || 0) === 0 ? (
                      <p className="text-sm text-white/40 py-3 text-center">Sin menús creados</p>
                    ) : (
                      <div className="space-y-2.5">
                        {userDetail.menus.map((m: any) => (
                          <div key={m.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm flex items-center gap-2 flex-wrap">
                                  <span className="truncate">{m.name}</span>
                                  {m.is_published ? (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold flex-shrink-0">PUBLICADO</span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/40 text-[9px] font-bold flex-shrink-0">BORRADOR</span>
                                  )}
                                </div>
                                <div className="text-xs text-white/40 truncate">/{m.slug}</div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-bold whitespace-nowrap">
                                  {m.views_count} vistas
                                </span>
                                <a
                                  href={`/r/${m.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-white/40 hover:text-white p-1"
                                  aria-label="Ver menú público"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                            {m.color && (
                              <div className="flex items-center gap-2 text-[11px] text-white/50 mb-2 flex-wrap">
                                <div className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0" style={{ background: m.color }} />
                                <span className="font-mono">{m.color}</span>
                                {m.currency && <span>· {m.currency}</span>}
                                {m.whatsapp && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> {m.whatsapp}
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="text-[11px] text-white/40">
                              {(m.categories?.length || 0)} categorías · {(m.categories || []).reduce((sum: number, c: any) => sum + (c.dishes?.length || 0), 0)} platos
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent views */}
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Eye className="w-4 h-4 text-amber-400" />
                      Últimas vistas
                      <span className="text-xs text-white/40 font-normal">({userDetail.recent_views?.length || 0})</span>
                    </h3>
                    {(userDetail.recent_views?.length || 0) === 0 ? (
                      <p className="text-sm text-white/40 py-3 text-center">Sin vistas registradas</p>
                    ) : (
                      <div className="max-h-60 overflow-y-auto space-y-1.5 overscroll-contain">
                        {userDetail.recent_views.map((v: any) => (
                          <div key={v.id} className="flex items-center justify-between gap-2 text-xs bg-white/[0.02] rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className="text-white/70 truncate">{v.menu_name}</span>
                              <span className="text-white/40 font-mono text-[10px] hidden sm:inline">{v.ip || '—'}</span>
                            </div>
                            <span className="text-white/40 text-[10px] whitespace-nowrap">{new Date(v.created_at).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="sticky bottom-0 bg-[#0a0a14]/95 backdrop-blur border-t border-white/10 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 px-4 sm:px-5 py-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDetailModalOpen(false)}
                      className="flex-1 text-white/70 hover:text-white hover:bg-white/5 h-10"
                    >
                      Cerrar
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
