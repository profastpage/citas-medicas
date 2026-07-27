'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import type { Plan } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Lock, TrendingUp, TrendingDown, Plus, Crown, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

interface CashSession {
  id: string;
  openingAmount: number;
  closingAmount: number | null;
  openedAt: string;
  closedAt: string | null;
  status: string;
  notes: string | null;
  expenses: Array<{ id: string; description: string; amount: number }>;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  patientName: string;
  paymentDate: string;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  clinicName: string;
  isSuperAdmin?: boolean;
  locked: boolean;
  sessions: CashSession[];
  paymentsToday: Payment[];
}

export function CajaClient(props: Props) {
  const { user, plan, clinicName, isSuperAdmin, locked, sessions, paymentsToday } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openingAmount, setOpeningAmount] = useState('0');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const activeSession = sessions.find(s => s.status === 'abierta');

  const totalToday = paymentsToday.reduce((sum, p) => sum + p.amount, 0);
  const totalExpensesToday = activeSession?.expenses.reduce((sum, e) => sum + e.amount, 0) ?? 0;

  if (locked) {
    return (
      <DashboardShell user={user} plan={plan} clinicName={clinicName} isSuperAdmin={isSuperAdmin}>
        <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold">Caja y pagos es una función Pro</h2>
            <p className="text-muted-foreground">
              Gestiona cobros, apertura/cierre de caja, gastos del día y reportes de ingresos.
              Disponible desde el plan Pro (S/ 50/mes).
            </p>
            <Link href="/dashboard/billing">
              <Button className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                <Crown className="w-4 h-4 mr-2" />
                Mejorar a Pro
              </Button>
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  const openSession = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/cash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          openingAmount: Number(openingAmount) || 0,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error');
        return;
      }
      toast.success('Caja abierta');
      setDialogOpen(false);
      setNotes('');
      setTimeout(() => window.location.reload(), 600);
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell user={user} plan={plan} clinicName={clinicName} isSuperAdmin={isSuperAdmin}>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Caja</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gestión de cobros y sesión de caja
            </p>
          </div>
          {!activeSession && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                  <Plus className="w-4 h-4 mr-2" />
                  Abrir caja
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-sidebar border-border">
                <DialogHeader>
                  <DialogTitle>Abrir caja</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Monto de apertura (S/)</Label>
                    <Input type="number" value={openingAmount} onChange={e => setOpeningAmount(e.target.value)} className="bg-muted/50 border-border" />
                  </div>
                  <div>
                    <Label>Notas</Label>
                    <Textarea value={notes} onChange={e => setNotes(e.target.value)} className="bg-muted/50 border-border" />
                  </div>
                  <Button onClick={openSession} disabled={submitting} className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                    {submitting ? 'Abriendo...' : 'Abrir caja'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-muted/50 border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground/70">Ingresos hoy</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">S/ {totalToday.toFixed(2)}</div>
          </div>
          <div className="bg-muted/50 border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground/70">Gastos hoy</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-bold text-red-400">S/ {totalExpensesToday.toFixed(2)}</div>
          </div>
          <div className="bg-muted/50 border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground/70">Saldo</span>
              <DollarSign className="w-4 h-4 text-[#d4af37]" />
            </div>
            <div className="text-2xl font-bold text-[#d4af37]">
              S/ {(totalToday - totalExpensesToday + (activeSession?.openingAmount ?? 0)).toFixed(2)}
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground/70">Cobros hoy</span>
              <DollarSign className="w-4 h-4 text-[#0ea5e9]" />
            </div>
            <div className="text-2xl font-bold">{paymentsToday.length}</div>
          </div>
        </div>

        {/* Sesión activa */}
        {activeSession && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-emerald-500 text-white">CAJA ABIERTA</Badge>
                <div className="text-sm text-muted-foreground mt-2">
                  Abierta: {format(new Date(activeSession.openedAt), "dd/MM/yyyy HH:mm", { locale: es })}
                </div>
                <div className="text-xs text-muted-foreground/70 mt-1">
                  Monto apertura: S/ {activeSession.openingAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cobros de hoy */}
        <div className="bg-muted/50 border border-border rounded-2xl p-4">
          <h2 className="font-bold mb-3">Cobros de hoy</h2>
          {paymentsToday.length === 0 ? (
            <p className="text-sm text-muted-foreground/70 py-6 text-center">Sin cobros registrados hoy</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {paymentsToday.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <div>
                    <div className="text-sm">{p.patientName}</div>
                    <div className="text-xs text-muted-foreground/70">
                      {format(new Date(p.paymentDate), 'HH:mm', { locale: es })} · {p.method}
                    </div>
                  </div>
                  <span className="text-emerald-400 font-bold">S/ {p.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historial de sesiones */}
        <div className="bg-muted/50 border border-border rounded-2xl p-4">
          <h2 className="font-bold mb-3">Historial de sesiones</h2>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground/70 py-6 text-center">Sin sesiones previas</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {sessions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <div>
                    <div className="text-sm">
                      {format(new Date(s.openedAt), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                      Apertura: S/ {s.openingAmount.toFixed(2)}
                      {s.closingAmount && ` · Cierre: S/ ${s.closingAmount.toFixed(2)}`}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={s.status === 'abierta'
                      ? 'border-emerald-500/30 text-emerald-300'
                      : 'border-border text-muted-foreground'
                    }
                  >
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
