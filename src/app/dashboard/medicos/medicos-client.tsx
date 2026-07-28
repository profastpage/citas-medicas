'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import type { Plan } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Plus, Phone, Mail, Award, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  fullName: string;
  specialtyId: string;
  specialtyName: string;
  colegiatura: string | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  consultationPrice: number | null;
  isActive: boolean;
  appointmentsCount: number;
  schedulesCount: number;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  clinicName: string;
  isSuperAdmin?: boolean;
  specialties: Array<{ id: string; name: string }>;
  doctors: Doctor[];
}

export function MedicosClient(props: Props) {
  const { user, plan, clinicName, isSuperAdmin, specialties, doctors } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    specialtyId: '',
    colegiatura: '',
    phone: '',
    email: '',
    bio: '',
    consultationPrice: '',
  });

  const submit = async () => {
    if (!form.fullName || !form.specialtyId) {
      toast.error('Nombre y especialidad son obligatorios');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          consultationPrice: form.consultationPrice ? Number(form.consultationPrice) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al crear médico');
        return;
      }
      toast.success('Médico creado');
      setDialogOpen(false);
      setForm({ fullName: '', specialtyId: '', colegiatura: '', phone: '', email: '', bio: '', consultationPrice: '' });
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
            <h1 className="text-2xl lg:text-3xl font-bold">Médicos</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {doctors.length} profesionales · {specialties.length} especialidades
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo médico
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-sidebar border-border">
              <DialogHeader>
                <DialogTitle>Nuevo médico</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Nombre completo *</Label>
                  <Input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="bg-muted/50 border-border" placeholder="Dr. Juan Pérez" />
                </div>
                <div>
                  <Label>Especialidad *</Label>
                  <Select value={form.specialtyId} onValueChange={v => setForm({ ...form, specialtyId: v })}>
                    <SelectTrigger className="bg-muted/50 border-border"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                    <SelectContent className="bg-sidebar border-border">
                      {specialties.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Colegiatura</Label>
                    <Input value={form.colegiatura} onChange={e => setForm({ ...form, colegiatura: e.target.value })} className="bg-muted/50 border-border" placeholder="CMP 12345" />
                  </div>
                  <div>
                    <Label>Precio consulta (S/)</Label>
                    <Input type="number" value={form.consultationPrice} onChange={e => setForm({ ...form, consultationPrice: e.target.value })} className="bg-muted/50 border-border" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Teléfono</Label>
                    <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-muted/50 border-border" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-muted/50 border-border" />
                  </div>
                </div>
                <div>
                  <Label>Bio / descripción</Label>
                  <Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="bg-muted/50 border-border" />
                </div>
                <Button onClick={submit} disabled={submitting} className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                  {submitting ? 'Guardando...' : 'Crear médico'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid de médicos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground/70 bg-muted/50 border border-border rounded-2xl">
              <Stethoscope className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay médicos registrados</p>
            </div>
          ) : (
            doctors.map(d => (
              <div key={d.id} className="bg-muted/50 border border-border rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] flex items-center justify-center font-bold flex-shrink-0">
                    {d.fullName.split(' ').slice(0, 2).map(w => w[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate">{d.fullName}</div>
                    <div className="text-xs text-[#0ea5e9]">{d.specialtyName}</div>
                  </div>
                </div>
                {d.bio && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{d.bio}</p>}
                <div className="space-y-1 text-xs text-muted-foreground/70">
                  {d.colegiatura && (
                    <div className="flex items-center gap-2"><Award className="w-3 h-3" />CMP: {d.colegiatura}</div>
                  )}
                  {d.phone && (
                    <div className="flex items-center gap-2"><Phone className="w-3 h-3" />{d.phone}</div>
                  )}
                  {d.email && (
                    <div className="flex items-center gap-2"><Mail className="w-3 h-3" />{d.email}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  <Badge variant="outline" className="text-muted-foreground border-border text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {d.appointmentsCount} citas
                  </Badge>
                  {d.consultationPrice && (
                    <Badge variant="outline" className="text-[#d4af37] border-[#d4af37]/30 text-xs ml-auto">
                      S/ {d.consultationPrice}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
