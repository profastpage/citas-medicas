// =============================================================
// MenuPro — Import / Export Menús (JSON, CSV, Excel/HTML)
// =============================================================

export interface ImportCategory {
  name: string;
  dishes: ImportDish[];
}

export interface ImportDish {
  name: string;
  description?: string;
  price: number | string;
  image_url?: string;
}

export interface ExportData {
  menu_name: string;
  slogan: string;
  description: string;
  whatsapp: string;
  currency: string;
  categories: ImportCategory[];
  exported_at: string;
  version: string;
}

// ── EXPORT ──────────────────────────────────────────────────────

export function exportToJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

export function exportToCSV(data: ExportData): string {
  const lines: string[] = [];
  lines.push('Categoría,Plato,Descripción,Precio,Imagen');

  for (const cat of data.categories) {
    for (const dish of cat.dishes) {
      const desc = (dish.description || '').replace(/"/g, '""');
      const name = dish.name.replace(/"/g, '""');
      const catName = cat.name.replace(/"/g, '""');
      lines.push(`"${catName}","${name}","${desc}","${dish.price}","${dish.image_url || ''}"`);
    }
    if (cat.dishes.length === 0) {
      const catName = cat.name.replace(/"/g, '""');
      lines.push(`"${catName}","","","",""`);
    }
  }

  return lines.join('\n');
}

export function exportToExcelHTML(data: ExportData): string {
  const rows = data.categories.flatMap((cat) =>
    cat.dishes.map((dish) => [
      cat.name,
      dish.name,
      dish.description || '',
      `${data.currency} ${Number(dish.price).toFixed(2)}`,
      dish.image_url || '',
    ])
  );

  const tableRows = rows
    .map(
      (r) =>
        `<tr>${r.map((c) => `<td style="border:1px solid #ddd;padding:6px 10px;">${escapeXML(c)}</td>`).join('')}</tr>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8">
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${escapeXML(data.menu_name)}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
<style>td{mso-number-format:"\@";}</style>
</head>
<body>
<h2>${escapeXML(data.menu_name)}${data.slogan ? ' — ' + escapeXML(data.slogan) : ''}</h2>
<p>WhatsApp: ${escapeXML(data.whatsapp)} · Moneda: ${escapeXML(data.currency)}</p>
<table border="1" cellpadding="4" cellspacing="0">
<thead><tr style="background:#d4af37;color:#1a1a2e;font-weight:bold;"><th>Categoría</th><th>Plato</th><th>Descripción</th><th>Precio</th><th>Imagen</th></tr></thead>
<tbody>${tableRows}</tbody>
</table>
<p style="color:#999;font-size:11px;margin-top:20px;">Exportado desde MenuPro · ${data.exported_at}</p>
</body></html>`;
}

export function exportToWordHTML(data: ExportData): string {
  const categoryBlocks = data.categories
    .map(
      (cat) => `
      <h3 style="color:${data.currency ? '#333' : '#333'};border-bottom:2px solid #d4af37;padding-bottom:4px;">${escapeXML(cat.name)}</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr style="background:#f5f5f5;font-weight:bold;"><td style="border:1px solid #ddd;padding:6px;">Plato</td><td style="border:1px solid #ddd;padding:6px;">Descripción</td><td style="border:1px solid #ddd;padding:6px;text-align:right;">Precio</td></tr>
        ${cat.dishes
          .map(
            (d) => `<tr><td style="border:1px solid #ddd;padding:6px;font-weight:600;">${escapeXML(d.name)}</td><td style="border:1px solid #ddd;padding:6px;color:#555;">${escapeXML(d.description || '')}</td><td style="border:1px solid #ddd;padding:6px;text-align:right;font-weight:600;">${data.currency} ${Number(d.price).toFixed(2)}</td></tr>`
          )
          .join('')}
      </table>`
    )
    .join('');

  return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><title>${escapeXML(data.menu_name)}</title></head>
<body style="font-family:Calibri,sans-serif;color:#222;max-width:700px;margin:0 auto;padding:20px;">
  <h1 style="text-align:center;color:#1a1a2e;">${escapeXML(data.menu_name)}</h1>
  ${data.slogan ? `<p style="text-align:center;color:#666;font-style:italic;">${escapeXML(data.slogan)}</p>` : ''}
  ${data.description ? `<p style="text-align:center;color:#888;">${escapeXML(data.description)}</p>` : ''}
  <p style="text-align:center;color:#999;font-size:12px;">Pedidos al WhatsApp: ${escapeXML(data.whatsapp)}</p>
  <hr style="border:1px solid #eee;margin:20px 0;"/>
  ${categoryBlocks}
  <p style="color:#bbb;font-size:10px;text-align:center;margin-top:30px;">Generado por MenuPro · ${data.exported_at}</p>
</body></html>`;
}

// ── IMPORT ──────────────────────────────────────────────────────

export function importFromJSON(text: string): ImportCategory[] {
  try {
    const data = JSON.parse(text);
    // Soporta formato directo { categories: [...] } o anidado
    const cats = data.categories || (Array.isArray(data) ? data : []);
    return cats.map(normalizeCategory);
  } catch {
    throw new Error('JSON inválido. Verifica el formato del archivo.');
  }
}

export function importFromCSV(text: string): ImportCategory[] {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV vacío o sin datos. Mínimo necesita encabezado + 1 fila.');
  }

  // Detectar si primera línea es encabezado
  const firstLine = lines[0].toLowerCase();
  const hasHeader =
    firstLine.includes('categor') ||
    firstLine.includes('categoría') ||
    firstLine.includes('plato') ||
    firstLine.includes('nombre') ||
    firstLine.includes('precio');

  const dataLines = hasHeader ? lines.slice(1) : lines;
  const catMap = new Map<string, ImportCategory>();

  for (const line of dataLines) {
    const cols = parseCSVLine(line);
    if (cols.length < 2) continue;

    const catName = (cols[0] || 'Sin categoría').trim();
    const dishName = (cols[1] || '').trim();
    if (!dishName) continue;

    if (!catMap.has(catName)) {
      catMap.set(catName, { name: catName, dishes: [] });
    }

    catMap.get(catName)!.dishes.push({
      name: dishName,
      description: (cols[2] || '').trim(),
      price: parsePrice(cols[3] || '0'),
      image_url: (cols[4] || '').trim() || undefined,
    });
  }

  const result = Array.from(catMap.values());
  if (result.length === 0) {
    throw new Error('No se encontraron platos en el CSV.');
  }
  return result;
}

export function importFromExcelXML(text: string): ImportCategory[] {
  // Los archivos .xls exportados como HTML tienen tablas
  const catMap = new Map<string, ImportCategory>();

  // Simple regex para extraer filas de tabla
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch: RegExpExecArray | null;
  let isFirstRow = true;

  while ((trMatch = trRegex.exec(text)) !== null) {
    const rowHtml = trMatch[1];
    const tdRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
    const cols: string[] = [];
    let tdMatch: RegExpExecArray | null;

    while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
      cols.push(stripHTML(tdMatch[1]).trim());
    }

    if (cols.length < 2) continue;
    if (isFirstRow) {
      isFirstRow = false;
      const header = cols[0].toLowerCase();
      if (header.includes('categor') || header.includes('plato') || header.includes('nombre')) {
        continue; // skip header
      }
    }

    const catName = cols[0] || 'Sin categoría';
 const dishName = cols[1] || '';
    if (!dishName) continue;

    if (!catMap.has(catName)) {
      catMap.set(catName, { name: catName, dishes: [] });
    }

    catMap.get(catName)!.dishes.push({
      name: dishName,
      description: cols[2] || '',
      price: parsePrice(cols[3] || '0'),
    });
  }

  const result = Array.from(catMap.values());
  if (result.length === 0) {
    throw new Error('No se encontraron platos en el archivo Excel.');
  }
  return result;
}

// ── HELPERS ─────────────────────────────────────────────────────

function normalizeCategory(cat: unknown): ImportCategory {
  const c = cat as Record<string, unknown>;
  const dishes = Array.isArray(c.dishes)
    ? c.dishes.map((d: unknown) => {
        const dish = d as Record<string, unknown>;
        return {
          name: String(dish.name || ''),
          description: String(dish.description || ''),
          price: parsePrice(dish.price),
          image_url: String(dish.image_url || dish.image || ''),
        };
      })
    : [];
  return { name: String(c.name || 'Sin categoría'), dishes };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

function parsePrice(val: unknown): number {
  if (typeof val === 'number') return val;
  const str = String(val || '0')
    .replace(/[^0-9.,]/g, '')
    .replace(/,/g, '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}

function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function escapeXML(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Detectar tipo de archivo desde nombre o contenido
export function detectFileType(
  filename: string,
  content: string
): 'json' | 'csv' | 'excel' | 'unknown' {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (ext === 'json') return 'json';
  if (ext === 'csv') return 'csv';
  if (['xls', 'xlsx', 'html'].includes(ext)) return 'excel';

  // Auto-detect from content
  const trimmed = content.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  if (trimmed.includes('<table') || trimmed.includes('<tr')) return 'excel';
  if (trimmed.includes(',') && trimmed.includes('\n')) return 'csv';

  return 'unknown';
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}