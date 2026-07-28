'use client';

import { useState } from 'react';
import { UserPlus, Mail, Clock, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePlanUsage, PlanLimitBanner } from './plan-usage-badge';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  invitedAt: string;
  acceptedAt: string | null;
}

interface Props {
  members: Member[];
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Dueño',
  admin: 'Administrador',
  doctor: 'Médico',
  receptionist: 'Recepcionista',
};

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
  admin: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
  doctor: 'bg-sky-500/10 text-sky-700 border-sky-500/30',
  receptionist: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
};

export function TeamInvite({ members }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    role: 'doctor' as 'admin' | 'doctor' | 'receptionist',
  });

  const { atLimit } = usePlanUsage();
  const isAtLimit = atLimit('team');

  const submit = async () => {
    if (!form.email || !form.fullName) {
      toast.error('Email y nombre son obligatorios');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al invitar');
        return;
      }
      toast.success(`Invitación enviada a ${form.email}`);
      setOpen(false);
      setForm({ email: '', fullName: '', role: 'doctor' });
      setTimeout(() => window.location.reload(), 800);
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PlanLimitBanner resource="team" label="Miembros del equipo" />

      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-base sm:text-lg">Invitar miembro</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Invita a tu equipo con roles diferenciados
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={isAtLimit}
                className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-sm"
                title={isAtLimit ? 'Límite de usuarios alcanzado' : 'Invitar miembro'}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Invitar miembro</span>
                <span className="sm:hidden">Invitar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-sidebar border-border">
              <DialogHeader>
                <DialogTitle>Invitar miembro al equipo</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Nombre completo *</Label>
                  <Input
                    value={form.fullName}
                    onChange={e => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Dra. María García"
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="maria@clinica.pe"
                    className="bg-muted/50 border-border"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Recibirá una invitación para unirse a la clínica
                  </p>
                </div>
                <div>
                  <Label>Rol</Label>
                  <Select
                    value={form.role}
                    onValueChange={v => setForm({ ...form, role: v as typeof form.role })}
                  >
                    <SelectTrigger className="bg-muted/50 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-sidebar border-border">
                      <SelectItem value="admin">Administrador — acceso total excepto billing</SelectItem>
                      <SelectItem value="doctor">Médico — ve sus citas y pacientes</SelectItem>
                      <SelectItem value="receptionist">Recepcionista — agenda y caja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={submit}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]"
                >
                  {submitting ? 'Enviando...' : 'Enviar invitación'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de miembros */}
        <div className="space-y-2">
          {members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground/70 text-sm">
              Aún no hay miembros invitados
            </div>
          ) : (
            members.map(m => {
              const isPending = !m.acceptedAt;
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                    {m.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{m.name}</div>
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {m.email}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] border ${ROLE_COLORS[m.role] ?? ROLE_COLORS.receptionist}`}
                  >
                    {ROLE_LABELS[m.role] ?? m.role}
                  </Badge>
                  {isPending ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] border-amber-500/30 text-amber-600 whitespace-nowrap"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Pendiente
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] border-emerald-500/30 text-emerald-600 whitespace-nowrap"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Activo
                    </Badge>
                  )}
                </div>
              );
            })
          )}
        </div>

        {isAtLimit && (
          <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-400">
            <strong>Límite alcanzado:</strong> Has llegado al máximo de usuarios de tu plan.{' '}
            <a href="/dashboard/billing" className="underline font-bold">Mejora tu plan →</a>
          </div>
        )}
      </div>
    </div>
  );
}
