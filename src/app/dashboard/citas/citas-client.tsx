'use client';

import { useState, useMemo } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import type { Plan } from '@/lib/plans';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Search, Clock, User, Stethoscope, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { addDays, format, isSameDay, startOfDay, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  clinicName: string;
  isSuperAdmin?: boolean;
  patients: Array<{ id: string; name: string; phone: string | null }>;
  doctors: Array<{ id: string; name: string; specialty: string }>;
  services: Array<{ id: string; name: string; price: number; durationMin: number }>;
  appointments: Array<{
    id: string;
    date: string;
    durationMin: number;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    specialty: string;
    serviceId: string | null;
    serviceName: string | null;
    servicePrice: number | null;
    reason: string | null;
    status: string;
    notes: string | null;
  }>;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' },
  confirmada: { label: 'Confirmada', color: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
  en_atencion: { label: 'En atención', color: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
  finalizada: { label: 'Finalizada', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  cancelada: { label: 'Cancelada', color: 'bg-red-500/10 text-red-300 border-red-500/30' },
  no_asistio: { label: 'No asistió', color: 'bg-gray-500/10 text-gray-300 border-gray-500/30' },
};

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8am - 7pm

export function CitasClient(props: Props) {
  const { user, plan, clinicName, isSuperAdmin, patients, doctors, services, appointments } = props;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'list'>('day');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  // Form state
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    serviceId: '',
    date: '',
    time: '',
    reason: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const filteredAppointments = useMemo(() => {
    let list = appointments;
    if (doctorFilter !== 'all') {
      list = list.filter(a => a.doctorId === doctorFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.patientName.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        (a.serviceName ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [appointments, doctorFilter, search]);

  const dayAppointments = useMemo(() => {
    return filteredAppointments
      .filter(a => isSameDay(new Date(a.date), selectedDate))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredAppointments, selectedDate]);

  const handleNewAppointment = async () => {
    if (!form.patientId || !form.doctorId || !form.date || !form.time) {
      toast.error('Completa los campos obligatorios');
      return;
    }

    setSubmitting(true);
    try {
      const iso = new Date(`${form.date}T${form.time}`);
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: form.patientId,
          doctorId: form.doctorId,
          serviceId: form.serviceId || undefined,
          appointmentDate: iso.toISOString(),
          reason: form.reason,
          notes: form.notes,
          status: 'pendiente',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Error al crear cita');
        return;
      }

      toast.success('Cita creada correctamente');
      setDialogOpen(false);
      setForm({ patientId: '', doctorId: '', serviceId: '', date: '', time: '', reason: '', notes: '' });
      setTimeout(() => window.location.reload(), 600);
    } catch {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Error al actualizar');
        return;
      }
      toast.success('Estado actualizado');
      setTimeout(() => window.location.reload(), 400);
    } catch {
      toast.error('Error de conexión');
    }
  };

  const prevDay = () => setSelectedDate(d => addDays(d, -1));
  const nextDay = () => setSelectedDate(d => addDays(d, 1));
  const today = () => setSelectedDate(new Date());

  return (
    <DashboardShell user={user} plan={plan} clinicName={clinicName} isSuperAdmin={isSuperAdmin}>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Citas</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gestiona el calendario de tu clínica
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]">
                <Plus className="w-4 h-4 mr-2" />
                Nueva cita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg bg-sidebar border-border">
              <DialogHeader>
                <DialogTitle>Nueva cita</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Paciente *</Label>
                  <Select value={form.patientId} onValueChange={v => setForm({ ...form, patientId: v })}>
                    <SelectTrigger className="bg-muted/50 border-border">
                      <SelectValue placeholder="Selecciona paciente" />
                    </SelectTrigger>
                    <SelectContent className="bg-sidebar border-border max-h-60">
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Médico *</Label>
                    <Select value={form.doctorId} onValueChange={v => setForm({ ...form, doctorId: v })}>
                      <SelectTrigger className="bg-muted/50 border-border">
                        <SelectValue placeholder="Médico" />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar border-border max-h-60">
                        {doctors.map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.name} — {d.specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Servicio</Label>
                    <Select value={form.serviceId} onValueChange={v => setForm({ ...form, serviceId: v })}>
                      <SelectTrigger className="bg-muted/50 border-border">
                        <SelectValue placeholder="Servicio" />
                      </SelectTrigger>
                      <SelectContent className="bg-sidebar border-border max-h-60">
                        {services.map(s => (
                          <SelectItem key={s.id} value={s.id}>{s.name} — S/ {s.price}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Fecha *</Label>
                    <Input
                      type="date"
                      required
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div>
                    <Label>Hora *</Label>
                    <Input
                      type="time"
                      required
                      value={form.time}
                      onChange={e => setForm({ ...form, time: e.target.value })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                </div>

                <div>
                  <Label>Motivo de consulta</Label>
                  <Textarea
                    value={form.reason}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                    placeholder="Motivo de la cita..."
                    className="bg-muted/50 border-border"
                  />
                </div>

                <Button
                  onClick={handleNewAppointment}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#0ea5e9] to-[#2563eb]"
                >
                  {submitting ? 'Guardando...' : 'Crear cita'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Controles */}
        <div className="bg-muted/50 border border-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={prevDay} className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={today} className="text-white">
              Hoy
            </Button>
            <Button variant="ghost" size="sm" onClick={nextDay} className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="ml-2 text-sm font-medium capitalize">
              {format(selectedDate, "EEEE d 'de' MMMM yyyy", { locale: es })}
            </span>
          </div>

          <div className="md:ml-auto flex flex-col sm:flex-row gap-2">
            <Select value={doctorFilter} onValueChange={setDoctorFilter}>
              <SelectTrigger className="bg-muted/50 border-border w-full sm:w-48">
                <Filter className="w-3 h-3 mr-1" />
                <SelectValue placeholder="Médico" />
              </SelectTrigger>
              <SelectContent className="bg-sidebar border-border">
                <SelectItem value="all">Todos los médicos</SelectItem>
                {doctors.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar paciente, médico..."
                className="bg-muted/50 border-border pl-8 w-full sm:w-64"
              />
            </div>

            <div className="flex gap-1 border border-border rounded-lg p-1">
              <Button
                size="sm"
                variant={view === 'day' ? 'default' : 'ghost'}
                onClick={() => setView('day')}
                className={view === 'day' ? 'bg-[#0ea5e9]' : 'text-muted-foreground'}
              >
                Día
              </Button>
              <Button
                size="sm"
                variant={view === 'list' ? 'default' : 'ghost'}
                onClick={() => setView('list')}
                className={view === 'list' ? 'bg-[#0ea5e9]' : 'text-muted-foreground'}
              >
                Lista
              </Button>
            </div>
          </div>
        </div>

        {/* Vista Día */}
        {view === 'day' && (
          <div className="bg-muted/50 border border-border rounded-2xl p-4">
            <div className="grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-2">
              {HOURS.map(hour => {
                const hourAppts = dayAppointments.filter(a => {
                  const d = new Date(a.date);
                  return d.getHours() === hour;
                });
                return (
                  <div key={hour} className="contents">
                    <div className="text-right pr-2 text-xs text-muted-foreground/70 py-2 border-t border-border/60">
                      {hour}:00
                    </div>
                    <div className="border-t border-border/60 py-2 min-h-[60px]">
                      <div className="space-y-1">
                        {hourAppts.map(a => {
                          const status = STATUS_LABELS[a.status] ?? STATUS_LABELS.pendiente;
                          const d = new Date(a.date);
                          return (
                            <div
                              key={a.id}
                              className="bg-muted/60 border border-border rounded-lg p-2 flex items-center gap-3"
                            >
                              <div className="text-xs font-mono text-[#0ea5e9] w-12">
                                {format(d, 'HH:mm')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">{a.patientName}</div>
                                <div className="text-xs text-muted-foreground/70 truncate">
                                  {a.doctorName} · {a.serviceName ?? 'Sin servicio'}
                                </div>
                              </div>
                              <Select
                                value={a.status}
                                onValueChange={v => changeStatus(a.id, v)}
                              >
                                <SelectTrigger className="h-7 w-32 text-xs bg-muted/50 border-border">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-sidebar border-border text-xs">
                                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vista Lista */}
        {view === 'list' && (
          <div className="bg-muted/50 border border-border rounded-2xl p-4">
            {filteredAppointments.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground/70">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No hay citas que mostrar</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredAppointments.map(a => {
                  const status = STATUS_LABELS[a.status] ?? STATUS_LABELS.pendiente;
                  const d = new Date(a.date);
                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/60 hover:border-border transition"
                    >
                      <div className="text-center min-w-[70px]">
                        <div className="text-xs text-muted-foreground/70">
                          {format(d, 'dd MMM', { locale: es })}
                        </div>
                        <div className="text-lg font-bold text-[#0ea5e9]">
                          {format(d, 'HH:mm')}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{a.patientName}</div>
                        <div className="text-xs text-muted-foreground/70 truncate">
                          {a.doctorName} · {a.serviceName ?? 'Sin servicio'}
                          {a.servicePrice ? ` · S/ ${a.servicePrice}` : ''}
                        </div>
                        {a.reason && (
                          <div className="text-xs text-muted-foreground/60 truncate mt-1">
                            📝 {a.reason}
                          </div>
                        )}
                      </div>
                      <Select
                        value={a.status}
                        onValueChange={v => changeStatus(a.id, v)}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs bg-muted/50 border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-sidebar border-border">
                          {Object.entries(STATUS_LABELS).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
