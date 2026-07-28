'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Shield, Users, Building2, Calendar, DollarSign, Search,
  LogOut, ArrowLeft, Crown, Power, Edit3, TrendingUp, Activity, AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PLANS, PLAN_ORDER, type PlanId } from '@/lib/plans';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface UserRow {
  id: string;
  email: string;
  fullName: string;
  role: string;
  plan: string;
  mpStatus: string | null;
  isActive: boolean;
  createdAt: string;
  supabaseUid: string;
  clinics: Array<{ id: string; name: string; slug: string; patients: number; appointments: number; doctors: number }>;
}

interface ClinicRow {
  id: string;
  name: string;
  slug: string;
  currency: string;
  themeColor: string;
  isWhiteLabel: boolean;
  createdAt: string;
  owner: { id: string; email: string; fullName: string; plan: string } | null;
  patients: number;
  appointments: number;
  doctors: number;
}

interface Stats {
  totalUsers: number;
  totalClinics: number;
  totalAppointments: number;
  totalRevenue: number;
  activeUsers: number;
  payingUsers: number;
}

export function SuperadminClient(props: {
  user: { email: string; name: string };
  initialStats: Stats;
  initialUsers: UserRow[];
  initialClinics: ClinicRow[];
}) {
  const { user, initialStats, initialUsers, initialClinics } = props;
  const [tab, setTab] = useState<'overview' | 'users' | 'clinics'>('overview');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [clinics, setClinics] = useState<ClinicRow[]>(initialClinics);
  const [stats] = useState<Stats>(initialStats);
  const [busy, setBusy] = useState(false);

  // Modal for plan change
  const [planModal, setPlanModal] = useState<{ open: boolean; userId?: string; currentPlan?: string; userName?: string }>({ open: false });

  const filteredUsers = users.filter(u =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredClinics = clinics.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.owner?.email ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      const [u, c] = await Promise.all([
        fetch('/api/superadmin/users').then(r => r.json()),
        fetch('/api/superadmin/clinics').then(r => r.json()),
      ]);
      if (u.users) setUsers(u.users);
      if (c.clinics) setClinics(c.clinics);
      toast.success('Datos actualizados');
    } catch {
      toast.error('Error al actualizar');
    } finally {
      setBusy(false);
    }
  }, []);

  const patchUser = async (userId: string, action: string, plan?: PlanId) => {
    setBusy(true);
    try {
      const res = await fetch('/api/superadmin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error');
      } else {
        toast.success(data.message || 'Actualizado');
        await refresh();
      }
    } catch {
      toast.error('Error de conexión');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-amber-500/20 bg-sidebar sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm sm:text-base truncate">Panel Super Admin</div>
              <div className="text-xs text-amber-600 hidden sm:block">CitasPro SaaS · Acceso total</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={busy}
              className="text-xs sm:text-sm"
            >
              <Activity className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
            <a href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                <ArrowLeft className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </a>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Kpi icon={Users} label="Usuarios" value={stats.totalUsers} color="#0ea5e9" sub={`${stats.activeUsers} activos`} />
          <Kpi icon={Building2} label="Clínicas" value={stats.totalClinics} color="#a855f7" />
          <Kpi icon={Calendar} label="Citas totales" value={stats.totalAppointments} color="#10b981" />
          <Kpi icon={DollarSign} label="Ingresos" value={`S/ ${stats.totalRevenue.toFixed(0)}`} color="#d4af37" sub={`${stats.payingUsers} pagan`} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          {[
            { id: 'overview', label: 'Resumen', icon: TrendingUp },
            { id: 'users', label: 'Usuarios', icon: Users },
            { id: 'clinics', label: 'Clínicas', icon: Building2 },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-3 sm:px-4 py-2 text-sm font-medium whitespace-nowrap flex items-center gap-1.5 ${
                tab === t.id
                  ? 'text-foreground border-b-2 border-amber-500'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab !== 'overview' && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email o clínica..."
              className="bg-background border-border pl-9"
            />
          </div>
        )}

        {/* Tabla de usuarios */}
        {tab === 'users' && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60">
                  <tr className="text-muted-foreground text-xs uppercase border-b border-border">
                    <th className="text-left p-3 font-medium">Usuario</th>
                    <th className="text-left p-3 font-medium hidden sm:table-cell">Plan</th>
                    <th className="text-center p-3 font-medium">Estado</th>
                    <th className="text-left p-3 font-medium hidden md:table-cell">Clínica</th>
                    <th className="text-left p-3 font-medium hidden lg:table-cell">Registro</th>
                    <th className="text-right p-3 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="p-3">
                        <div className="font-medium text-foreground">{u.fullName}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-none">{u.email}</div>
                        {u.role === 'super_admin' && (
                          <Badge className="mt-1 bg-amber-100 text-amber-700 border-amber-300 text-[10px] px-1.5">
                            <Crown className="w-3 h-3 mr-1" />SUPER ADMIN
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <Badge variant="outline" style={{ color: PLANS[u.plan as PlanId]?.color ?? '#64748b', borderColor: `${PLANS[u.plan as PlanId]?.color ?? '#64748b'}40` }}>
                          {PLANS[u.plan as PlanId]?.name ?? u.plan}
                        </Badge>
                      </td>
                      <td className="p-3 text-center">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-red-500" />Inactivo
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground hidden md:table-cell">
                        {u.clinics.length > 0 ? u.clinics.map(c => c.name).join(', ') : '—'}
                      </td>
                      <td className="p-3 text-xs text-muted-foreground hidden lg:table-cell">
                        {format(new Date(u.createdAt), 'dd/MM/yy', { locale: es })}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPlanModal({ open: true, userId: u.id, currentPlan: u.plan, userName: u.fullName })}
                            disabled={busy}
                            className="h-8 px-2 text-xs"
                            title="Cambiar plan"
                          >
                            <Edit3 className="w-3.5 h-3.5 sm:mr-1" />
                            <span className="hidden sm:inline">Plan</span>
                          </Button>
                          {u.isActive ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => patchUser(u.id, 'deactivate')}
                              disabled={busy}
                              className="h-8 px-2 text-xs text-red-600 hover:bg-red-50"
                              title="Desactivar"
                            >
                              <Power className="w-3.5 h-3.5" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => patchUser(u.id, 'activate')}
                              disabled={busy}
                              className="h-8 px-2 text-xs text-emerald-600 hover:bg-emerald-50"
                              title="Activar"
                            >
                              <Power className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {u.role !== 'super_admin' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => patchUser(u.id, 'make_super_admin')}
                              disabled={busy}
                              className="h-8 px-2 text-xs text-amber-600 hover:bg-amber-50"
                              title="Hacer super admin"
                            >
                              <Crown className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">
                        No hay usuarios que mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla de clínicas */}
        {tab === 'clinics' && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/60">
                  <tr className="text-muted-foreground text-xs uppercase border-b border-border">
                    <th className="text-left p-3 font-medium">Clínica</th>
                    <th className="text-left p-3 font-medium hidden sm:table-cell">Owner</th>
                    <th className="text-center p-3 font-medium">Plan</th>
                    <th className="text-center p-3 font-medium hidden md:table-cell">Médicos</th>
                    <th className="text-center p-3 font-medium hidden md:table-cell">Pacientes</th>
                    <th className="text-center p-3 font-medium">Citas</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClinics.map(c => (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="p-3">
                        <div className="font-medium text-foreground">{c.name}</div>
                        <div className="text-xs text-muted-foreground">/{c.slug}</div>
                      </td>
                      <td className="p-3 text-xs hidden sm:table-cell">
                        {c.owner ? (
                          <>
                            <div className="text-foreground">{c.owner.fullName}</div>
                            <div className="text-muted-foreground">{c.owner.email}</div>
                          </>
                        ) : '—'}
                      </td>
                      <td className="p-3 text-center">
                        <Badge variant="outline" style={{ color: PLANS[c.owner?.plan as PlanId]?.color ?? '#64748b', borderColor: `${PLANS[c.owner?.plan as PlanId]?.color ?? '#64748b'}40` }}>
                          {PLANS[c.owner?.plan as PlanId]?.name ?? 'free'}
                        </Badge>
                      </td>
                      <td className="p-3 text-center hidden md:table-cell">{c.doctors}</td>
                      <td className="p-3 text-center hidden md:table-cell">{c.patients}</td>
                      <td className="p-3 text-center font-medium">{c.appointments}</td>
                    </tr>
                  ))}
                  {filteredClinics.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground text-sm">
                        No hay clínicas que mostrar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
              <h3 className="font-bold mb-4 text-foreground">Distribución por plan</h3>
              <div className="space-y-3">
                {Object.values(PLANS).map(p => {
                  const count = users.filter(u => u.plan === p.id).length;
                  const pct = users.length > 0 ? (count / users.length) * 100 : 0;
                  return (
                    <div key={p.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium" style={{ color: p.color }}>{p.name}</span>
                        <span className="text-muted-foreground">{count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: p.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
              <h3 className="font-bold mb-4 text-foreground">Top 5 clínicas por citas</h3>
              <div className="space-y-2">
                {[...clinics].sort((a, b) => b.appointments - a.appointments).slice(0, 5).map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs w-6">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{c.owner?.email}</div>
                    </div>
                    <span className="text-xs font-medium text-foreground">{c.appointments} citas</span>
                  </div>
                ))}
                {clinics.length === 0 && (
                  <p className="text-muted-foreground text-sm text-center py-4">Sin clínicas registradas</p>
                )}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-6 md:col-span-2">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900">
                  <strong>Modo super administrador activo.</strong> Tienes control total sobre
                  todos los usuarios, clínicas y datos de la plataforma. Cualquier acción se
                  registra en el log de auditoría. Usa este poder con responsabilidad.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal para cambiar plan */}
      <Dialog open={planModal.open} onOpenChange={open => setPlanModal({ ...planModal, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar plan de usuario</DialogTitle>
            <DialogDescription>
              {planModal.userName} — Esto cambia el plan inmediatamente, sin pasar por MercadoPago.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label>Plan actual</Label>
            <div className="text-sm text-muted-foreground">
              {PLANS[planModal.currentPlan as PlanId]?.name ?? planModal.currentPlan}
            </div>
            <Label>Nuevo plan</Label>
            <Select
              onValueChange={(v: PlanId) => {
                patchUser(planModal.userId!, 'change_plan', v);
                setPlanModal({ open: false });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un plan" />
              </SelectTrigger>
              <SelectContent>
                {PLAN_ORDER.map(p => (
                  <SelectItem key={p} value={p}>
                    {PLANS[p].name} — S/ {PLANS[p].priceMonthly}/mes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlanModal({ open: false })}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, color, sub }: { icon: typeof Users; label: string; value: string | number; color: string; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, color }}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}
