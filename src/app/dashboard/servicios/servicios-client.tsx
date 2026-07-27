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
import { FileText, Plus, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMin: number;
  isActive: boolean;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  clinicName: string;
  isSuperAdmin?: boolean;
  services: Service[];
}

export function ServiciosClient(props: Props) {
  const { user, plan, clinicName, isSuperAdmin, services } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    durationMin: '30',
  });

  const submit = async () => {
    if (!form.name || !form.price) {
      toast.error('Nombre y precio son obligatorios');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          durationMin: Number(form.durationMin),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al crear servicio');
        return;
      }
      toast.success('Servicio creado');
      setDialogOpen(false);
      setForm({ name: '', description: '', price: '', durationMin: '30' });
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
            <h1 className="text-2xl lg:text-3xl font-bold">Servicios</h1>
            <p className="text-white/60 text-sm mt-1">
              {services.length} servicios médicos con precios
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo servicio
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-[#0a0a14] border-white/10">
              <DialogHeader>
                <DialogTitle>Nuevo servicio</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Nombre *</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-white/5 border-white/10" placeholder="Consulta médica general" />
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="bg-white/5 border-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Precio (S/) *</Label>
                    <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="bg-white/5 border-white/10" />
                  </div>
                  <div>
                    <Label>Duración (min)</Label>
                    <Input type="number" value={form.durationMin} onChange={e => setForm({ ...form, durationMin: e.target.value })} className="bg-white/5 border-white/10" />
                  </div>
                </div>
                <Button onClick={submit} disabled={submitting} className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                  {submitting ? 'Guardando...' : 'Crear servicio'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.length === 0 ? (
            <div className="col-span-full py-16 text-center text-white/40 bg-white/[0.03] border border-white/10 rounded-2xl">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay servicios registrados</p>
            </div>
          ) : (
            services.map(s => (
              <div key={s.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold">{s.name}</h3>
                  <Badge variant="outline" className="text-[#d4af37] border-[#d4af37]/30">
                    S/ {s.price}
                  </Badge>
                </div>
                {s.description && (
                  <p className="text-sm text-white/60 mb-3 line-clamp-2">{s.description}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Clock className="w-3 h-3" />
                  {s.durationMin} minutos
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
