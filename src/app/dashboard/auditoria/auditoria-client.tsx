'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import type { Plan } from '@/lib/plans';
import { Shield, Lock, Crown, Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Log {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  description: string;
  userName: string;
  ipAddress: string;
  createdAt: string;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  clinicName: string;
  isSuperAdmin?: boolean;
  locked: boolean;
  logs: Log[];
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  UPDATE: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  DELETE: 'bg-red-500/10 text-red-300 border-red-500/30',
  LOGIN: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  LOGOUT: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
};

export function AuditoriaClient(props: Props) {
  const { user, plan, clinicName, isSuperAdmin, locked, logs } = props;
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return logs;
    const q = search.toLowerCase();
    return logs.filter(l =>
      l.description.toLowerCase().includes(q) ||
      l.userName.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.entity.toLowerCase().includes(q)
    );
  }, [logs, search]);

  if (locked) {
    return (
      <DashboardShell user={user} plan={plan} clinicName={clinicName} isSuperAdmin={isSuperAdmin}>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold">Auditoría es una función Pro</h2>
            <p className="text-muted-foreground">
              Bitácora completa de cambios: quién, qué y cuándo.
              Disponible desde el plan Pro (S/ 50/mes).
            </p>
            <Link href="/dashboard/billing">
              <button className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90">
                <Crown className="w-4 h-4 inline mr-2" />
                Mejorar a Pro
              </button>
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user} plan={plan} clinicName={clinicName} isSuperAdmin={isSuperAdmin}>
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Auditoría</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {logs.length} eventos registrados
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por acción, usuario, descripción..."
            className="bg-muted/50 border-border pl-9"
          />
        </div>

        <div className="bg-muted/50 border border-border rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground/70">
              <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Sin eventos para mostrar</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
              {filtered.map(l => (
                <div key={l.id} className="p-4 flex items-start gap-4">
                  <Badge
                    variant="outline"
                    className={ACTION_COLORS[l.action] || 'border-border text-muted-foreground'}
                  >
                    {l.action}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{l.description}</div>
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      {l.userName} · {l.entity} · {format(new Date(l.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}
                      {l.ipAddress && ` · ${l.ipAddress}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
