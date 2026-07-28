'use client';

import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import type { Plan } from '@/lib/plans';
import { UserCog, Lock, Crown } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlanUsageBadge } from '@/components/dashboard/plan-usage-badge';
import { TeamInvite } from '@/components/dashboard/team-invite';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  invitedAt: string;
  acceptedAt: string | null;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  clinicName: string;
  isSuperAdmin?: boolean;
  locked: boolean;
  members: Member[];
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Dueño',
  admin: 'Administrador',
  doctor: 'Médico',
  receptionist: 'Recepcionista',
};

export function EquipoClient(props: Props) {
  const { user, plan, clinicName, isSuperAdmin, locked, members } = props;

  if (locked) {
    return (
      <DashboardShell user={user} plan={plan} clinicName={clinicName} isSuperAdmin={isSuperAdmin}>
        <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold">Gestión de equipo es una función Pro</h2>
            <p className="text-muted-foreground">
              Invita médicos, recepcionistas y administradores con roles diferenciados.
              Disponible desde el plan Pro (S/ 50/mes) con hasta 3 usuarios.
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
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl lg:text-3xl font-bold">Equipo</h1>
          <p className="text-muted-foreground text-sm">
            {members.length} miembros en la clínica
          </p>
          <PlanUsageBadge resource="team" label="Usuarios del equipo" />
        </div>

        <div className="bg-muted/50 border border-border rounded-2xl overflow-hidden">
          {members.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground/70">
              <UserCog className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Sin miembros registrados</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {members.map(m => (
                <div key={m.id} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center font-bold">
                    {m.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground/70">{m.email}</div>
                  </div>
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {ROLE_LABELS[m.role] || m.role}
                  </Badge>
                  {m.acceptedAt ? (
                    <span className="text-xs text-muted-foreground/70">
                      Desde {format(new Date(m.acceptedAt), 'dd/MM/yy', { locale: es })}
                    </span>
                  ) : (
                    <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
                      Pendiente
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reemplazo del bloque "Próximamente" por TeamInvite real */}
        <TeamInvite members={members.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email,
          role: m.role,
          invitedAt: m.invitedAt,
          acceptedAt: m.acceptedAt,
        }))} />
      </div>
    </DashboardShell>
  );
}
