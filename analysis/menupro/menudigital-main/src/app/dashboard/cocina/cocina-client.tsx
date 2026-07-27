'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ChefHat, Check, Clock, AlertCircle, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PremiumGate } from '@/components/dashboard/premium-gate';
import type { Plan, PlanId } from '@/lib/plans';

interface OrderItem {
  id: string; menu_item_name: string; menu_item_price: number;
  quantity: number; notes: string | null;
  status: 'pendiente' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';
  prepared_at: string | null;
}
interface Order {
  id: string; order_number: string; status: string;
  created_at: string; sent_at: string | null;
  table: { number: number; name: string | null } | null;
  waiter: { full_name: string } | null;
  items: OrderItem[];
  notes: string | null;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  isSuperAdmin: boolean;
}

export function CocinaClient({ user, plan, isSuperAdmin }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const load = useCallback(async () => {
    try {
      // Cargar comandas activas: enviada, en_preparacion, lista
      const res = await fetch('/api/comandas?limit=100');
      if (!res.ok) return;
      const data = await res.json();
      const active = (data.orders || []).filter((o: Order) =>
        ['enviada', 'en_preparacion', 'lista'].includes(o.status)
      );
      setOrders(active);
      setLastRefresh(new Date());
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (plan.limits.hasKitchenDisplay) load();
  }, [plan.limits.hasKitchenDisplay, load]);

  // Auto-refresh cada 15s
  useEffect(() => {
    if (!autoRefresh || !plan.limits.hasKitchenDisplay) return;
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, plan.limits.hasKitchenDisplay, load]);

  if (!plan.limits.hasKitchenDisplay) {
    return (
      <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
        <PremiumGate
          requiredPlan="premium"
          userPlan={plan.id as PlanId}
          featureName="Cocina Display"
          featureIcon={<ChefHat className="w-8 h-8 text-[#9d4edd]" />}
          description="Pantalla de cocina en tiempo real: ve las comandas entrantes, marca items como listos y entrega al cliente. Se actualiza automáticamente cada 15 segundos."
        />
      </DashboardShell>
    );
  }

  async function updateItemStatus(orderId: string, itemId: string, status: OrderItem['status']) {
    try {
      const res = await fetch(`/api/comandas/${orderId}/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      // Actualizar localmente
      setOrders(prev => prev.map(o =>
        o.id === orderId
          ? { ...o, items: o.items.map(i => i.id === itemId ? { ...i, status, prepared_at: status === 'listo' ? new Date().toISOString() : i.prepared_at } : i) }
          : o
      ));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function advanceOrderStatus(orderId: string, currentStatus: string) {
    const next: Record<string, string> = {
      'enviada': 'en_preparacion',
      'en_preparacion': 'lista',
      'lista': 'entregada',
    };
    const nextStatus = next[currentStatus];
    if (!nextStatus) return;

    try {
      const res = await fetch(`/api/comandas/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success(`Comanda → ${nextStatus}`);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  // Función para calcular tiempo transcurrido
  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'ahora';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  }

  // Función para colorear por urgencia
  function getUrgency(sentAt: string | null, createdAt: string): 'normal' | 'warning' | 'critical' {
    const ref = sentAt || createdAt;
    const mins = (Date.now() - new Date(ref).getTime()) / 60000;
    if (mins > 20) return 'critical';
    if (mins > 10) return 'warning';
    return 'normal';
  }

  // Agrupar por estado
  const enviadas = orders.filter(o => o.status === 'enviada');
  const enPreparacion = orders.filter(o => o.status === 'en_preparacion');
  const listas = orders.filter(o => o.status === 'lista');

  return (
    <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2">
            Cocina Display
            {orders.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold animate-pulse">
                <Bell className="w-3 h-3" /> {orders.length} activas
              </span>
            )}
          </h1>
          <p className="text-white/60 text-sm">
            Pantalla de cocina en tiempo real · Auto-refresh cada 15s · Última: {lastRefresh.toLocaleTimeString('es-PE')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-[#9d4edd]/20 border-[#9d4edd]/40 text-[#9d4edd]' : 'bg-transparent border-white/20'}
          >
            {autoRefresh ? '⏸️ Auto ON' : '▶️ Auto OFF'}
          </Button>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refrescar
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-white/40">Cargando cocina…</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <ChefHat className="w-12 h-12 mx-auto text-white/20 mb-3" />
          <p className="text-white/60">No hay comandas activas en cocina 🎉</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Columna: Enviadas */}
          <Column
            title="📋 Por iniciar"
            count={enviadas.length}
            color="#118ab2"
            orders={enviadas}
            getUrgency={getUrgency}
            timeAgo={timeAgo}
            onAdvance={(id) => advanceOrderStatus(id, 'enviada')}
            onItemUpdate={updateItemStatus}
            advanceLabel="Iniciar preparación"
          />
          {/* Columna: En preparación */}
          <Column
            title="🔥 En preparación"
            count={enPreparacion.length}
            color="#d4af37"
            orders={enPreparacion}
            getUrgency={getUrgency}
            timeAgo={timeAgo}
            onAdvance={(id) => advanceOrderStatus(id, 'en_preparacion')}
            onItemUpdate={updateItemStatus}
            advanceLabel="Marcar como lista"
          />
          {/* Columna: Listas */}
          <Column
            title="✅ Listas para entregar"
            count={listas.length}
            color="#06d6a0"
            orders={listas}
            getUrgency={getUrgency}
            timeAgo={timeAgo}
            onAdvance={(id) => advanceOrderStatus(id, 'lista')}
            onItemUpdate={updateItemStatus}
            advanceLabel="Entregar (liberar mesa)"
          />
        </div>
      )}
    </DashboardShell>
  );
}

function Column({
  title, count, color, orders, getUrgency, timeAgo, onAdvance, onItemUpdate, advanceLabel,
}: {
  title: string; count: number; color: string;
  orders: Order[];
  getUrgency: (sentAt: string | null, createdAt: string) => 'normal' | 'warning' | 'critical';
  timeAgo: (dateStr: string) => string;
  onAdvance: (id: string) => void;
  onItemUpdate: (orderId: string, itemId: string, status: OrderItem['status']) => void;
  advanceLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div
        className="rounded-xl p-3 flex items-center justify-between"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        <h3 className="font-semibold" style={{ color }}>{title}</h3>
        <span
          className="px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: color, color: '#0a0a14' }}
        >
          {count}
        </span>
      </div>

      <div className="space-y-3">
        {orders.map(order => {
          const urgency = getUrgency(order.sent_at, order.created_at);
          const urgencyColor = urgency === 'critical' ? '#e63946' : urgency === 'warning' ? '#d4af37' : color;
          const activeItems = order.items.filter(i => i.status !== 'cancelado' && i.status !== 'entregado');

          return (
            <div
              key={order.id}
              className="rounded-2xl border-2 p-4 bg-[#0f0f1a]"
              style={{ borderColor: `${urgencyColor}60` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-lg font-bold">{order.order_number}</div>
                  {order.table && (
                    <div className="text-xs text-white/60">Mesa {order.table.number}</div>
                  )}
                  {order.waiter && (
                    <div className="text-[10px] text-white/40">Mozo: {order.waiter.full_name}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs" style={{ color: urgencyColor }}>
                    <Clock className="w-3 h-3" />
                    {timeAgo(order.sent_at || order.created_at)}
                  </div>
                  {urgency === 'critical' && (
                    <div className="text-[10px] text-red-400 font-bold mt-1">¡URGENTE!</div>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1.5 mb-3">
                {activeItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2 p-2 rounded-lg bg-white/5"
                  >
                    <button
                      onClick={() => onItemUpdate(order.id, item.id, item.status === 'listo' ? 'pendiente' : 'listo')}
                      className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                        item.status === 'listo'
                          ? 'bg-[#06d6a0] text-[#0a0a14]'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      title={item.status === 'listo' ? 'Marcar como pendiente' : 'Marcar como listo'}
                    >
                      {item.status === 'listo' && <Check className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${item.status === 'listo' ? 'line-through text-white/40' : ''}`}>
                        {item.quantity}x {item.menu_item_name}
                      </div>
                      {item.notes && (
                        <div className="text-xs text-amber-400 mt-0.5">↳ {item.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2 mb-3 text-xs text-amber-300">
                  <strong>Notas:</strong> {order.notes}
                </div>
              )}

              {/* Acción */}
              <Button
                onClick={() => onAdvance(order.id)}
                className="w-full text-xs"
                size="sm"
                style={{ background: color, color: '#0a0a14' }}
              >
                {advanceLabel}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
