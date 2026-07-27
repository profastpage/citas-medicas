'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, Users, Building2, Calendar, DollarSign, Search, LogOut, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PLANS } from '@/lib/plans';

interface Props {
  user: { email: string; name: string };
  stats: {
    totalUsers: number;
    totalClinics: number;
    totalAppointments: number;
    totalRevenue: number;
  };
  users: Array<{
    id: string;
    email: string;
    fullName: string;
    role: string;
    plan: string;
    mpStatus: string | null;
    isActive: boolean;
    createdAt: string;
    clinics: string[];
  }>;
  clinics: Array<{
    id: string;
    name: string;
    slug: string;
    ownerEmail: string;
    plan: string;
    patients: number;
    appointments: number;
    doctors: number;
    createdAt: string;
  }>;
}

export function SuperadminClient(props: Props) {
  const { user, stats, users, clinics } = props;
  const [tab, setTab] = useState<'overview' | 'users' | 'clinics'>('overview');
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredClinics = clinics.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.ownerEmail.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-amber-500/20 bg-sidebar">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold">Panel Super Admin</div>
              <div className="text-xs text-amber-400/60">CitasPro SaaS · Acceso total</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* KPIs globales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi icon={Users} label="Usuarios" value={stats.totalUsers.toString()} color="#0ea5e9" />
          <Kpi icon={Building2} label="Clínicas" value={stats.totalClinics.toString()} color="#a855f7" />
          <Kpi icon={Calendar} label="Citas totales" value={stats.totalAppointments.toString()} color="#10b981" />
          <Kpi icon={DollarSign} label="Ingresos plataforma" value={`S/ ${stats.totalRevenue.toFixed(0)}`} color="#d4af37" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border">
          {[
            { id: 'overview', label: 'Resumen' },
            { id: 'users', label: 'Usuarios' },
            { id: 'clinics', label: 'Clínicas' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-4 py-2 text-sm font-medium ${
                tab === t.id
                  ? 'text-white border-b-2 border-[#0ea5e9]'
                  : 'text-muted-foreground/70 hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab !== 'overview' && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="bg-muted/50 border-border pl-9"
            />
          </div>
        )}

        {/* Tabla de usuarios */}
        {tab === 'users' && (
          <div className="bg-muted/50 border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground/70 text-xs uppercase">
                    <th className="text-left p-3">Usuario</th>
                    <th className="text-left p-3">Plan</th>
                    <th className="text-center p-3">Estado MP</th>
                    <th className="text-center p-3">Activo</th>
                    <th className="text-left p-3">Clínicas</th>
                    <th className="text-right p-3">Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => {
                    const plan = PLANS[u.plan as keyof typeof PLANS] ?? PLANS.free;
                    return (
                      <tr key={u.id} className="border-b border-border/60">
                        <td className="p-3">
                          <div className="font-medium">{u.fullName}</div>
                          <div className="text-xs text-muted-foreground/70">{u.email}</div>
                        </td>
                        <td className="p-3">
                          <Badge
                            variant="outline"
                            style={{ color: plan.color, borderColor: `${plan.color}40` }}
                          >
                            {plan.name}
                          </Badge>
                        </td>
                        <td className="p-3 text-center text-xs">
                          {u.mpStatus ?? '—'}
                        </td>
                        <td className="p-3 text-center">
                          {u.isActive ? (
                            <span className="text-emerald-400">●</span>
                          ) : (
                            <span className="text-red-400">●</span>
                          )}
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {u.clinics.join(', ') || '—'}
                        </td>
                        <td className="p-3 text-right text-xs text-muted-foreground/70">
                          {format(new Date(u.createdAt), 'dd/MM/yy', { locale: es })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla de clínicas */}
        {tab === 'clinics' && (
          <div className="bg-muted/50 border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground/70 text-xs uppercase">
                    <th className="text-left p-3">Clínica</th>
                    <th className="text-left p-3">Owner</th>
                    <th className="text-center p-3">Plan</th>
                    <th className="text-center p-3">Médicos</th>
                    <th className="text-center p-3">Pacientes</th>
                    <th className="text-center p-3">Citas</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClinics.map(c => {
                    const plan = PLANS[c.plan as keyof typeof PLANS] ?? PLANS.free;
                    return (
                      <tr key={c.id} className="border-b border-border/60">
                        <td className="p-3">
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground/70">/{c.slug}</div>
                        </td>
                        <td className="p-3 text-xs">{c.ownerEmail}</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" style={{ color: plan.color, borderColor: `${plan.color}40` }}>
                            {plan.name}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">{c.doctors}</td>
                        <td className="p-3 text-center">{c.patients}</td>
                        <td className="p-3 text-center">{c.appointments}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overview */}
        {tab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/50 border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-4">Distribución por plan</h3>
              <div className="space-y-3">
                {Object.values(PLANS).map(p => {
                  const count = users.filter(u => u.plan === p.id).length;
                  const pct = users.length > 0 ? (count / users.length) * 100 : 0;
                  return (
                    <div key={p.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: p.color }}>{p.name}</span>
                        <span className="text-muted-foreground">{count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: p.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-muted/50 border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-4">Top 5 clínicas por citas</h3>
              <div className="space-y-2">
                {clinics
                  .sort((a, b) => b.appointments - a.appointments)
                  .slice(0, 5)
                  .map((c, i) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <span className="text-muted-foreground/70 text-xs w-6">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{c.name}</div>
                      </div>
                      <span className="text-xs text-muted-foreground">{c.appointments} citas</span>
                    </div>
                  ))}
                {clinics.length === 0 && (
                  <p className="text-muted-foreground/70 text-sm text-center py-4">Sin clínicas registradas</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: string; color: string }) {
  return (
    <div className="bg-muted/50 border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground/70">{label}</span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20`, color }}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
