import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanId } from '@/lib/plans';

/**
 * GET /api/vouchers/[orderId]
 * Genera un voucher imprimible para la comanda dada.
 * Query: ?format=pos_80mm | a4 | a5
 *
 * Devuelve HTML listo para imprimir (window.print()).
 *
 * Requiere plan Full (hasVoucherPrinting=true).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, full_name, email')
    .eq('id', user.id)
    .single();

  const plan = PLANS[(profile?.plan as PlanId) || 'free'] || PLANS.free;
  if (!plan.limits.hasVoucherPrinting) {
    return NextResponse.json(
      { error: 'Requiere plan Full para voucher printing', upgradeRequired: true },
      { status: 403 }
    );
  }

  const { orderId } = await params;
  const url = new URL(req.url);
  const format = url.searchParams.get('format') || 'pos_80mm';

  // Cargar comanda con items
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      table:tables(number, name),
      waiter:waiters(full_name),
      items:order_items(*)
    `)
    .eq('id', orderId)
    .eq('owner_id', user.id)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: 'Comanda no encontrada' }, { status: 404 });
  }

  // Generar número de voucher
  const { data: voucherNumber } = await supabase.rpc('get_next_voucher_number', {
    p_owner: user.id,
  });

  // Registrar la impresión
  await supabase.from('voucher_prints').insert({
    owner_id: user.id,
    order_id: orderId,
    voucher_number: voucherNumber || 'V-0001',
    printed_by: profile?.email || 'unknown',
    print_format: format,
  });

  // Cargar datos del restaurante desde el primer menú del usuario
  const { data: menu } = await supabase
    .from('menus')
    .select('name, logo_url, slug')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const restaurantName = menu?.name || profile?.full_name || 'Restaurante';
  const logoUrl = menu?.logo_url;

  // Generar HTML
  const html = generateVoucherHTML({
    format,
    restaurantName,
    logoUrl,
    order,
    voucherNumber: voucherNumber || 'V-0001',
  });

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

interface VoucherData {
  format: string;
  restaurantName: string;
  logoUrl: string | null;
  order: any;
  voucherNumber: string;
}

function generateVoucherHTML({ format, restaurantName, logoUrl, order, voucherNumber }: VoucherData): string {
  const date = new Date(order.created_at).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const isPOS = format === 'pos_80mm';
  const width = isPOS ? '320px' : format === 'a5' ? '148mm' : '210mm';
  const padding = isPOS ? '12px' : '24px';
  const fontSize = isPOS ? '12px' : '14px';

  const itemsRows = (order.items || [])
    .filter((i: any) => i.status !== 'cancelado')
    .map((item: any) => `
      <tr>
        <td style="padding:3px 0;vertical-align:top;">${item.quantity}x</td>
        <td style="padding:3px 4px;vertical-align:top;">${escapeHtml(item.menu_item_name)}${item.notes ? `<br><span style="color:#666;font-size:10px;">↳ ${escapeHtml(item.notes)}</span>` : ''}</td>
        <td style="padding:3px 0;text-align:right;vertical-align:top;white-space:nowrap;">${order.currency} ${(item.menu_item_price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Voucher ${voucherNumber} — ${escapeHtml(restaurantName)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Courier New', 'Monaco', monospace;
    font-size: ${fontSize};
    color: #000;
    background: #fff;
    padding: 8px;
  }
  .voucher {
    width: ${width};
    margin: 0 auto;
    padding: ${padding};
    border: 1px dashed #999;
  }
  .header {
    text-align: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #999;
  }
  .logo { max-width: 80px; max-height: 80px; margin: 0 auto 8px; display: block; }
  .restaurant-name { font-size: ${isPOS ? '14px' : '18px'}; font-weight: bold; }
  .meta {
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px dashed #999;
    font-size: ${isPOS ? '11px' : '12px'};
  }
  .meta-row { display: flex; justify-content: space-between; margin: 2px 0; }
  .items { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  .items td { font-size: ${isPOS ? '11px' : '13px'}; }
  .totals {
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px dashed #999;
    font-size: ${isPOS ? '12px' : '14px'};
  }
  .total-row { display: flex; justify-content: space-between; margin: 4px 0; }
  .total-final {
    font-size: ${isPOS ? '16px' : '20px'};
    font-weight: bold;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 2px solid #000;
  }
  .footer {
    margin-top: 16px;
    text-align: center;
    font-size: 10px;
    color: #666;
    padding-top: 8px;
    border-top: 1px dashed #999;
  }
  .status-badge {
    display: inline-block;
    padding: 2px 8px;
    border: 1px solid #000;
    border-radius: 3px;
    font-size: 10px;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .no-print { margin: 20px 0; text-align: center; }
  .no-print button {
    padding: 10px 20px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    margin: 0 4px;
  }
  @media print {
    .no-print { display: none !important; }
    body { padding: 0; }
    .voucher { border: none; width: 100%; padding: 0; }
  }
</style>
</head>
<body>
<div class="voucher">
  <div class="header">
    ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" class="logo" alt="logo"/>` : ''}
    <div class="restaurant-name">${escapeHtml(restaurantName)}</div>
    <div class="status-badge">${escapeHtml(order.status)}</div>
  </div>

  <div class="meta">
    <div class="meta-row"><span>Voucher:</span><strong>${escapeHtml(voucherNumber)}</strong></div>
    <div class="meta-row"><span>Comanda:</span><strong>${escapeHtml(order.order_number)}</strong></div>
    ${order.table ? `<div class="meta-row"><span>Mesa:</span><strong>${escapeHtml(String(order.table.number))}${order.table.name ? ' — ' + escapeHtml(order.table.name) : ''}</strong></div>` : ''}
    ${order.waiter ? `<div class="meta-row"><span>Mozo:</span><strong>${escapeHtml(order.waiter.full_name)}</strong></div>` : ''}
    ${order.customer_name ? `<div class="meta-row"><span>Cliente:</span><strong>${escapeHtml(order.customer_name)}</strong></div>` : ''}
    <div class="meta-row"><span>Fecha:</span><strong>${date}</strong></div>
    ${order.party_size ? `<div class="meta-row"><span>Comensales:</span><strong>${order.party_size}</strong></div>` : ''}
  </div>

  <table class="items">
    <thead>
      <tr style="border-bottom:1px solid #000;">
        <th style="text-align:left;padding:4px 0;">Cant</th>
        <th style="text-align:left;padding:4px;">Descripción</th>
        <th style="text-align:right;padding:4px 0;">Importe</th>
      </tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <div class="totals">
    <div class="total-row"><span>Subtotal:</span><span>${order.currency} ${(order.subtotal || 0).toFixed(2)}</span></div>
    ${order.tax > 0 ? `<div class="total-row"><span>IGV (10%):</span><span>${order.currency} ${(order.tax || 0).toFixed(2)}</span></div>` : ''}
    ${order.tip > 0 ? `<div class="total-row"><span>Propina:</span><span>${order.currency} ${(order.tip || 0).toFixed(2)}</span></div>` : ''}
    <div class="total-row total-final"><span>TOTAL:</span><span>${order.currency} ${(order.total || 0).toFixed(2)}</span></div>
  </div>

  ${order.notes ? `<div style="margin-top:12px;padding:8px;border:1px dashed #999;font-size:11px;"><strong>Notas:</strong> ${escapeHtml(order.notes)}</div>` : ''}

  <div class="footer">
    ¡Gracias por su preferencia!<br>
    Generado por MenuPro · ${new Date().toLocaleDateString('es-PE')}
  </div>
</div>

<div class="no-print">
  <button onclick="window.print()">🖨️ Imprimir</button>
  <button onclick="window.close()">Cerrar</button>
</div>

<script>
  // Auto-print después de 500ms
  setTimeout(() => { try { window.print(); } catch(e) {} }, 500);
</script>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
