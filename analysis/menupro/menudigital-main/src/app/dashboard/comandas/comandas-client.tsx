'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus, RefreshCw, Trash2, X, ClipboardList, Send, ChefHat,
  Check, Utensils, Printer, Clock, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { PremiumGate } from '@/components/dashboard/premium-gate';
import type { Plan, PlanId } from '@/lib/plans';

interface Dish {
  id: string; name: string; price: number; description?: string; image_url?: string;
}
interface Category {
  id: string; name: string; dishes: Dish[];
}
interface Menu {
  id: string; name: string; slug: string; categories: Category[];
}
interface OrderItem {
  id: string; menu_item_id: string | null; menu_item_name: string;
  menu_item_price: number; quantity: number; notes: string | null;
  status: 'pendiente' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';
}
interface Order {
  id: string; order_number: string; status: string; order_type: string;
  customer_name: string | null; customer_phone: string | null;
  party_size: number | null; notes: string | null;
  subtotal: number; tax: number; tip: number; total: number; currency: string;
  created_at: string; sent_at: string | null; ready_at: string | null;
  table: { id: string; number: number; name: string | null } | null;
  waiter: { id: string; full_name: string } | null;
  items: OrderItem[];
}
interface Mesa {
  id: string; number: number; name: string | null; status: string;
}
interface Waiter {
  id: string; full_name: string; qr_token?: string | null;
}

interface Props {
  user: { email: string; name: string };
  plan: Plan;
  isSuperAdmin: boolean;
  menus: Menu[];
}

const STATUS_FLOW = [
  { id: 'borrador', label: 'Borrador', color: '#6b7280', icon: ClipboardList },
  { id: 'enviada', label: 'Enviada', color: '#118ab2', icon: Send },
  { id: 'en_preparacion', label: 'En preparación', color: '#d4af37', icon: ChefHat },
  { id: 'lista', label: 'Lista', color: '#06d6a0', icon: Check },
  { id: 'entregada', label: 'Entregada', color: '#9d4edd', icon: Utensils },
  { id: 'facturada', label: 'Facturada', color: '#e63946', icon: Check },
];

export function ComandasClient({ user, plan, isSuperAdmin, menus }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Nuevo comanda form
  const [form, setForm] = useState({
    table_id: '',
    waiter_id: '',
    customer_name: '',
    party_size: '',
    notes: '',
  });
  const [cart, setCart] = useState<{ dish: Dish; quantity: number; notes: string }[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, mesasRes, waitersRes] = await Promise.all([
        fetch('/api/comandas?limit=50'),
        fetch('/api/mesas'),
        fetch('/api/waiters'),
      ]);
      if (ordersRes.ok) {
        const d = await ordersRes.json();
        setOrders(d.orders || []);
      }
      if (mesasRes.ok) {
        const d = await mesasRes.json();
        setMesas(d.tables || []);
      }
      if (waitersRes.ok) {
        const d = await waitersRes.json();
        setWaiters(d.waiters || []);
      }
    } catch (err) {
      toast.error('Error cargando datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (plan.limits.hasComandas) load();
  }, [plan.limits.hasComandas, load]);

  if (!plan.limits.hasComandas) {
    return (
      <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
        <PremiumGate
          requiredPlan="premium"
          userPlan={plan.id as PlanId}
          featureName="Sistema de Comandas"
          featureIcon={<ClipboardList className="w-8 h-8 text-[#9d4edd]" />}
          description="Crea comandas desde cualquier mesa, envíalas a cocina, sigue el estado en tiempo real y factura al final. Las mesas se vinculan automáticamente."
        />
      </DashboardShell>
    );
  }

  function addToCart(dish: Dish) {
    setCart(prev => {
      const existing = prev.find(i => i.dish.id === dish.id && !i.notes);
      if (existing) {
        return prev.map(i => i.dish.id === dish.id && !i.notes ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { dish, quantity: 1, notes: '' }];
    });
  }

  function removeFromCart(idx: number) {
    setCart(prev => prev.filter((_, i) => i !== idx));
  }

  function updateQty(idx: number, delta: number) {
    setCart(prev => prev.map((item, i) =>
      i === idx ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  }

  async function handleCreateOrder() {
    if (cart.length === 0) {
      toast.error('Agrega al menos un plato');
      return;
    }
    try {
      const items = cart.map(c => ({
        menu_item_id: c.dish.id,
        menu_item_name: c.dish.name,
        menu_item_price: c.dish.price,
        quantity: c.quantity,
        notes: c.notes || undefined,
      }));

      const res = await fetch('/api/comandas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_id: form.table_id || undefined,
          waiter_id: form.waiter_id || undefined,
          customer_name: form.customer_name || undefined,
          party_size: form.party_size ? parseInt(form.party_size) : undefined,
          notes: form.notes || undefined,
          order_type: form.table_id ? 'mesa' : 'para_llevar',
          items,
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Comanda creada');
      setShowNew(false);
      setCart([]);
      setForm({ table_id: '', waiter_id: '', customer_name: '', party_size: '', notes: '' });
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/comandas/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success(`Estado: ${newStatus}`);
      load();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleCancel(orderId: string) {
    if (!confirm('¿Cancelar esta comanda?')) return;
    try {
      const res = await fetch(`/api/comandas/${orderId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelada desde dashboard' }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      toast.success('Comanda cancelada');
      setSelectedOrder(null);
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handlePrintVoucher(orderId: string) {
    // Plan Full: abrir voucher en nueva ventana
    if (!plan.limits.hasVoucherPrinting) {
      toast.error('Voucher printing requiere plan Full. Upgrade para imprimir vouchers POS.');
      return;
    }
    window.open(`/api/vouchers/${orderId}?format=pos_80mm`, '_blank', 'width=400,height=600');
  }

  // Plano de todos los dishes del menú
  const allDishes: Dish[] = menus.flatMap(m => m.categories.flatMap(c => c.dishes));

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  return (
    <DashboardShell user={user} plan={plan} isSuperAdmin={isSuperAdmin}>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Comandas</h1>
          <p className="text-white/60 text-sm">
            Crea comandas, envíalas a cocina, sigue el estado y factura.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refrescar
          </Button>
          <Button
            size="sm"
            onClick={() => setShowNew(true)}
            style={{ background: 'linear-gradient(to right, #9d4edd, #c77dff)', color: 'white' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva comanda
          </Button>
        </div>
      </div>

      {/* Filtros de estado */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
            filterStatus === 'all' ? 'bg-white/15 text-white' : 'bg-white/5 text-white/60'
          }`}
        >
          Todas ({orders.length})
        </button>
        {STATUS_FLOW.map(s => {
          const count = orders.filter(o => o.status === s.id).length;
          if (count === 0) return null;
          return (
            <button
              key={s.id}
              onClick={() => setFilterStatus(s.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                filterStatus === s.id ? 'text-white' : 'bg-white/5 text-white/60'
              }`}
              style={filterStatus === s.id ? { background: s.color } : undefined}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista de comandas */}
      {loading ? (
        <div className="text-center py-12 text-white/40">Cargando comandas…</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <ClipboardList className="w-12 h-12 mx-auto text-white/20 mb-3" />
          <p className="text-white/60 mb-2">No hay comandas {filterStatus !== 'all' ? `con estado "${filterStatus}"` : ''}</p>
          <Button onClick={() => setShowNew(true)} style={{ background: '#9d4edd', color: 'white' }}>
            <Plus className="w-4 h-4 mr-2" />
            Crear primera comanda
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredOrders.map(order => {
            const status = STATUS_FLOW.find(s => s.id === order.status);
            return (
              <div
                key={order.id}
                className="rounded-2xl border p-4 cursor-pointer hover:scale-[1.02] transition"
                style={{ borderColor: `${status?.color || '#666'}40`, background: `${status?.color || '#666'}10` }}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-lg font-bold">{order.order_number}</div>
                    {order.table && (
                      <div className="text-xs text-white/60">Mesa {order.table.number}{order.table.name ? ` — ${order.table.name}` : ''}</div>
                    )}
                    {order.waiter && (
                      <div className="text-xs text-white/60">Mozo: {order.waiter.full_name}</div>
                    )}
                  </div>
                  <span
                    className="text-[10px] px-2 py-1 rounded-full font-bold uppercase"
                    style={{ background: status?.color, color: '#0a0a14' }}
                  >
                    {status?.label}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.filter(i => i.status !== 'cancelado').slice(0, 3).map(item => (
                    <div key={item.id} className="text-xs text-white/80 flex justify-between">
                      <span>{item.quantity}x {item.menu_item_name}</span>
                      <span className="text-white/60">{order.currency} {(item.menu_item_price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items.filter(i => i.status !== 'cancelado').length > 3 && (
                    <div className="text-xs text-white/40">
                      +{order.items.filter(i => i.status !== 'cancelado').length - 3} más…
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="text-xs text-white/60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(order.created_at).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-lg font-bold" style={{ color: status?.color }}>
                    {order.currency} {order.total.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────── Panel móvil de mozos ───────── */}
      {waiters.length > 0 && (
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="min-w-0">
              <h3 className="text-white font-semibold flex items-center gap-2 text-base sm:text-lg">
                <span>📱</span> Panel móvil de mozos
              </h3>
              <p className="text-xs sm:text-sm text-white/50 mt-1 leading-relaxed">
                Comparte estos enlaces con tus mozos. Lo abren desde su celular y toman comandas sin login.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {waiters.map(w => {
              const url = w.qr_token ? `${typeof window !== 'undefined' ? window.location.origin : ''}/mozo/${w.qr_token}` : null;
              return (
                <div key={w.id} className="bg-white/5 rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/15 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm sm:text-base text-white font-semibold truncate leading-tight">{w.full_name}</div>
                      <a
                        href={url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[11px] sm:text-xs text-[#c77dff] hover:text-[#e0aaff] truncate font-mono underline-offset-2 hover:underline mt-1 break-all"
                        title={url || 'Sin token'}
                      >
                        {url ? `/mozo/${w.qr_token}` : 'Sin token (ejecuta add-waiter-qr-token.sql)'}
                      </a>
                    </div>
                  </div>
                  {url && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(url);
                          toast.success('Enlace copiado');
                        }}
                        className="flex-1 px-3 py-2.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/15 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.121 2.122" />
                        </svg>
                        Copiar
                      </button>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-2.5 rounded-lg bg-[#9d4edd] hover:bg-[#7b2cbf] text-white text-xs font-semibold active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        Abrir
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal nueva comanda */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f0f1a] border-r border-white/15 w-full max-w-4xl m-auto max-h-[95vh] overflow-hidden rounded-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-lg font-bold">Nueva comanda</h3>
              <button onClick={() => { setShowNew(false); setCart([]); }} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-5 overflow-y-auto">
              {/* Izquierda: menú */}
              <div>
                <div className="text-sm font-semibold mb-3">Selecciona platos</div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  {menus.flatMap(m => m.categories).map(cat => (
                    <div key={cat.id}>
                      <div className="text-xs text-white/50 uppercase tracking-wider mb-2">{cat.name}</div>
                      <div className="space-y-1.5">
                        {cat.dishes.map(dish => (
                          <button
                            key={dish.id}
                            onClick={() => addToCart(dish)}
                            className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-between"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{dish.name}</div>
                              {dish.description && (
                                <div className="text-[11px] text-white/50 truncate">{dish.description}</div>
                              )}
                            </div>
                            <div className="text-sm font-semibold text-[#9d4edd] ml-2">S/ {dish.price.toFixed(2)}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {allDishes.length === 0 && (
                    <div className="text-center py-8 text-white/40 text-sm">
                      No tienes platos en tu menú. Crea platos primero.
                    </div>
                  )}
                </div>
              </div>

              {/* Derecha: carrito + datos */}
              <div className="flex flex-col">
                <div className="text-sm font-semibold mb-3">Pedido</div>
                <div className="space-y-3 flex-1">
                  <div>
                    <Label>Mesa</Label>
                    <select
                      value={form.table_id}
                      onChange={(e) => setForm({ ...form, table_id: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="">Para llevar (sin mesa)</option>
                      {mesas.filter(m => m.status === 'libre' || m.status === 'reservada').map(m => (
                        <option key={m.id} value={m.id}>
                          Mesa {m.number}{m.name ? ` — ${m.name}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Mozo</Label>
                      <select
                        value={form.waiter_id}
                        onChange={(e) => setForm({ ...form, waiter_id: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="">Sin asignar</option>
                        {waiters.map(w => (
                          <option key={w.id} value={w.id}>{w.full_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Comensales</Label>
                      <Input
                        type="number"
                        min="1"
                        value={form.party_size}
                        onChange={(e) => setForm({ ...form, party_size: e.target.value })}
                        className="bg-white/5 border-white/10"
                        placeholder="—"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Cliente (opcional)</Label>
                    <Input
                      value={form.customer_name}
                      onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                      className="bg-white/5 border-white/10"
                      placeholder="Nombre del cliente"
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-white/10 mt-3 pt-3">
                  <div className="text-xs text-white/60 mb-2">Items ({cart.length})</div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="text-xs text-white/40 text-center py-4">Selecciona platos del menú →</div>
                    ) : cart.map((item, idx) => (
                      <div key={idx} className="bg-white/5 rounded-lg p-2 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium flex-1 truncate">{item.dish.name}</span>
                          <button onClick={() => removeFromCart(idx)} className="text-red-400 ml-2">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQty(idx, -1)} className="w-6 h-6 rounded bg-white/10">−</button>
                            <span className="font-semibold">{item.quantity}</span>
                            <button onClick={() => updateQty(idx, 1)} className="w-6 h-6 rounded bg-white/10">+</button>
                          </div>
                          <span className="text-[#9d4edd] font-semibold">S/ {(item.dish.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <Input
                          value={item.notes}
                          onChange={(e) => setCart(prev => prev.map((it, i) => i === idx ? { ...it, notes: e.target.value } : it))}
                          placeholder="Notas: sin cebolla, extra picante…"
                          className="bg-white/5 border-white/10 mt-2 text-xs h-7"
                        />
                      </div>
                    ))}
                  </div>
                  {cart.length > 0 && (
                    <div className="border-t border-white/10 mt-2 pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span className="text-[#9d4edd]">S/ {cart.reduce((s, i) => s + i.dish.price * i.quantity, 0).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 flex gap-2">
              <Button variant="outline" onClick={() => { setShowNew(false); setCart([]); }} className="flex-1 bg-transparent border-white/20">
                Cancelar
              </Button>
              <Button onClick={handleCreateOrder} disabled={cart.length === 0} className="flex-1" style={{ background: '#9d4edd', color: 'white' }}>
                Crear comanda ({cart.length} items)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle de comanda */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0f0f1a] border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#0f0f1a] border-b border-white/10 p-5 flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">{selectedOrder.order_number}</div>
                <div className="text-xs text-white/60">
                  {selectedOrder.table ? `Mesa ${selectedOrder.table.number}` : 'Para llevar'} ·{' '}
                  {new Date(selectedOrder.created_at).toLocaleString('es-PE')}
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Estado actual */}
              <div>
                <Label>Estado actual</Label>
                <div className="flex gap-2 flex-wrap">
                  {STATUS_FLOW.map(s => {
                    const isCurrent = selectedOrder.status === s.id;
                    const currentIdx = STATUS_FLOW.findIndex(x => x.id === selectedOrder.status);
                    const idx = STATUS_FLOW.findIndex(x => x.id === s.id);
                    const isPast = idx < currentIdx;
                    const isAllowed = idx === currentIdx + 1;
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => isAllowed && handleStatusChange(selectedOrder.id, s.id)}
                        disabled={!isAllowed}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                          isCurrent ? 'text-white' : isPast ? 'text-white/40' : isAllowed ? 'border border-white/30 text-white hover:bg-white/10' : 'text-white/30 cursor-not-allowed'
                        }`}
                        style={isCurrent ? { background: s.color } : undefined}
                      >
                        <Icon className="w-3 h-3" />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Items */}
              <div>
                <Label>Items</Label>
                <div className="space-y-2">
                  {selectedOrder.items.filter(i => i.status !== 'cancelado').map(item => (
                    <div key={item.id} className="bg-white/5 rounded-lg p-3 flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.quantity}x {item.menu_item_name}</div>
                        {item.notes && <div className="text-xs text-white/50 mt-1">↳ {item.notes}</div>}
                      </div>
                      <div className="text-sm font-semibold">{selectedOrder.currency} {(item.menu_item_price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="bg-white/5 rounded-xl p-4 space-y-1">
                <div className="flex justify-between text-sm"><span className="text-white/60">Subtotal</span><span>{selectedOrder.currency} {selectedOrder.subtotal.toFixed(2)}</span></div>
                {selectedOrder.tax > 0 && <div className="flex justify-between text-sm"><span className="text-white/60">IGV</span><span>{selectedOrder.currency} {selectedOrder.tax.toFixed(2)}</span></div>}
                {selectedOrder.tip > 0 && <div className="flex justify-between text-sm"><span className="text-white/60">Propina</span><span>{selectedOrder.currency} {selectedOrder.tip.toFixed(2)}</span></div>}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10"><span>Total</span><span className="text-[#9d4edd]">{selectedOrder.currency} {selectedOrder.total.toFixed(2)}</span></div>
              </div>

              {selectedOrder.notes && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
                  <div className="text-xs text-amber-400 font-semibold mb-1">Notas</div>
                  <div className="text-sm text-white/80">{selectedOrder.notes}</div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-2 pt-2">
                {plan.limits.hasVoucherPrinting && selectedOrder.status === 'entregada' && (
                  <Button onClick={() => handlePrintVoucher(selectedOrder.id)} variant="outline" className="bg-transparent border-white/20">
                    <Printer className="w-4 h-4 mr-2" /> Imprimir voucher
                  </Button>
                )}
                {selectedOrder.status !== 'facturada' && selectedOrder.status !== 'cancelada' && (
                  <Button
                    onClick={() => handleCancel(selectedOrder.id)}
                    variant="outline"
                    className="bg-transparent border-red-500/40 text-red-400 hover:bg-red-500/10 ml-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Cancelar comanda
                  </Button>
                )}
              </div>

              {!plan.limits.hasVoucherPrinting && (
                <div className="text-xs text-white/40 text-center pt-2 border-t border-white/10 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Voucher printing disponible en plan Full
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
