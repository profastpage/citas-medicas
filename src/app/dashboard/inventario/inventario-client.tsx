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
import { Pill, Plus, AlertTriangle, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { format, isPast, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface Medication {
  id: string;
  commercialName: string;
  genericName: string;
  presentation: string;
  stock: number;
  minStock: number;
  unitPrice: number | null;
  expiryDate: string | null;
  isActive: boolean;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  clinicName: string;
  isSuperAdmin?: boolean;
  medications: Medication[];
}

export function InventarioClient(props: Props) {
  const { user, plan, clinicName, isSuperAdmin, medications } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    commercialName: '',
    genericName: '',
    presentation: '',
    stock: '0',
    minStock: '5',
    unitPrice: '',
    expiryDate: '',
  });

  const submit = async () => {
    if (!form.commercialName) {
      toast.error('Nombre comercial requerido');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          stock: Number(form.stock),
          minStock: Number(form.minStock),
          unitPrice: form.unitPrice ? Number(form.unitPrice) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al crear');
        return;
      }
      toast.success('Medicamento creado');
      setDialogOpen(false);
      setForm({ commercialName: '', genericName: '', presentation: '', stock: '0', minStock: '5', unitPrice: '', expiryDate: '' });
      setTimeout(() => window.location.reload(), 600);
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  const lowStock = medications.filter(m => m.stock <= m.minStock);
  const expiringSoon = medications.filter(m => {
    if (!m.expiryDate) return false;
    const days = differenceInDays(new Date(m.expiryDate), new Date());
    return days <= 30;
  });

  return (
    <DashboardShell user={user} plan={plan} clinicName={clinicName} isSuperAdmin={isSuperAdmin}>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Inventario</h1>
            <p className="text-white/60 text-sm mt-1">
              {medications.length} medicamentos · {lowStock.length} con stock bajo · {expiringSoon.length} por vencer
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo medicamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-[#0a0a14] border-white/10">
              <DialogHeader>
                <DialogTitle>Nuevo medicamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Nombre comercial *</Label>
                  <Input value={form.commercialName} onChange={e => setForm({ ...form, commercialName: e.target.value })} className="bg-white/5 border-white/10" />
                </div>
                <div>
                  <Label>Nombre genérico</Label>
                  <Input value={form.genericName} onChange={e => setForm({ ...form, genericName: e.target.value })} className="bg-white/5 border-white/10" />
                </div>
                <div>
                  <Label>Presentación</Label>
                  <Input value={form.presentation} onChange={e => setForm({ ...form, presentation: e.target.value })} className="bg-white/5 border-white/10" placeholder="Tableta 500mg" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Stock</Label>
                    <Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="bg-white/5 border-white/10" />
                  </div>
                  <div>
                    <Label>Stock mínimo</Label>
                    <Input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} className="bg-white/5 border-white/10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Precio unitario (S/)</Label>
                    <Input type="number" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} className="bg-white/5 border-white/10" />
                  </div>
                  <div>
                    <Label>Vencimiento</Label>
                    <Input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} className="bg-white/5 border-white/10" />
                  </div>
                </div>
                <Button onClick={submit} disabled={submitting} className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                  {submitting ? 'Guardando...' : 'Crear'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alertas */}
        {(lowStock.length > 0 || expiringSoon.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4">
            {lowStock.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                <div className="text-amber-300 font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Stock bajo ({lowStock.length})
                </div>
                <ul className="text-sm space-y-1">
                  {lowStock.slice(0, 5).map(m => (
                    <li key={m.id} className="text-amber-100">
                      {m.commercialName} — <span className="text-amber-300">{m.stock} unidades</span> (mín: {m.minStock})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {expiringSoon.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
                <div className="text-red-300 font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Por vencer ({expiringSoon.length})
                </div>
                <ul className="text-sm space-y-1">
                  {expiringSoon.slice(0, 5).map(m => (
                    <li key={m.id} className="text-red-100">
                      {m.commercialName} — vence {format(new Date(m.expiryDate!), 'dd MMM yyyy', { locale: es })}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          {medications.length === 0 ? (
            <div className="py-16 text-center text-white/40">
              <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay medicamentos registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs uppercase">
                    <th className="text-left p-3">Nombre</th>
                    <th className="text-left p-3">Presentación</th>
                    <th className="text-center p-3">Stock</th>
                    <th className="text-center p-3">Mín</th>
                    <th className="text-right p-3">Precio</th>
                    <th className="text-center p-3">Vence</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map(m => {
                    const isLow = m.stock <= m.minStock;
                    const expiry = m.expiryDate ? new Date(m.expiryDate) : null;
                    const isExpired = expiry && isPast(expiry);
                    return (
                      <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="p-3">
                          <div className="font-medium">{m.commercialName}</div>
                          {m.genericName && <div className="text-xs text-white/40">{m.genericName}</div>}
                        </td>
                        <td className="p-3 text-white/60">{m.presentation || '—'}</td>
                        <td className="p-3 text-center">
                          <span className={isLow ? 'text-amber-300 font-bold' : ''}>{m.stock}</span>
                        </td>
                        <td className="p-3 text-center text-white/40">{m.minStock}</td>
                        <td className="p-3 text-right">
                          {m.unitPrice ? `S/ ${m.unitPrice.toFixed(2)}` : '—'}
                        </td>
                        <td className="p-3 text-center">
                          {expiry ? (
                            <span className={isExpired ? 'text-red-300' : 'text-white/60'}>
                              {format(expiry, 'dd/MM/yy')}
                            </span>
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
