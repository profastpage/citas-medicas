import { escapeHtml, hexToRgbStr, type MenuData } from '@/lib/menu-utils';

/**
 * Construye el HTML completo autocontenido del menú público.
 * Usa concatenación de strings (no template literals anidados) para evitar
 * problemas de escape. Inyecta los datos via JSON.stringify().
 *
 * Soporta tema personalizables (plan Pro): layout, image_size, card_style,
 * font, secondary color, dark mode, cover image, search, etc.
 *
 * NOVEDADES:
 *  - Cover image como fondo detrás del header de perfil (efecto ultra pro)
 *  - Redes sociales con iconos SVG premium (Facebook, Instagram, WhatsApp,
 *    TikTok, Twitter/X, YouTube, Web)
 *  - Lightbox carrusel: al hacer clic en un plato se abre un overlay con
 *    imagen grande + info detallada. Si el plato no tiene imagen, se muestra
 *    un placeholder elegante.
 *  - Fix del bug "sans is not defined" (property CSS sin comillas)
 */
export function buildMenuHTML(data: MenuData, opts?: { isPreview?: boolean }): string {
  const isPreview = opts?.isPreview === true;
  // Defaults seguros (plan Free = single col, medium img, expanded card, dark)
  const layout = data.theme_layout || 'single';
  const imageSize = data.theme_image_size || 'medium';
  const cardStyle = data.theme_card_style || 'expanded';
  const font = data.theme_font || 'Inter';
  const darkMode = data.theme_dark_mode !== false; // default true
  const showSearch = data.theme_show_search !== false;
  const showCatIcons = data.theme_show_category_icons !== false;
  const rounded = data.theme_rounded_corners !== false;
  const coverUrl = data.theme_cover_url || null;
  const secondary = data.theme_color_secondary || '#1a1a2e';
  const showGallery = data.theme_dish_gallery !== false; // default true
  // Estilo Carta (PedidosYa/Rappi horizontal carousel)
  const cartaStyle = data.theme_carta_style === true;
  const cartaListStyle = data.theme_carta_list_style === true;
  const cartaAutoscroll = data.theme_carta_autoscroll === true;
  const cartaScrollSpeed = data.theme_carta_scroll_speed || 30;

  const css = buildCSS({ layout, imageSize, cardStyle, font, darkMode, showSearch, showCatIcons, rounded, coverUrl, secondary, showGallery, cartaStyle, cartaListStyle });
  const js = buildJS({ layout, imageSize, cardStyle, showSearch, showGallery, isPreview, darkMode, cartaStyle, cartaListStyle, cartaAutoscroll, cartaScrollSpeed });
  const colorRgb = hexToRgbStr(data.color);
  const secondaryRgb = hexToRgbStr(secondary);

  // Font CDN (solo si no es Inter/system)
  const fontImport = ['Inter', 'system-ui', '-apple-system'].includes(font)
    ? ''
    : `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

  // ⚠️ FIX CRITICAL: el valor de la property CSS debe ser un JS string completo
  // y CORRECTAMENTE ESCAPADO. Antes generábamos "Inter, "Inter", sans-serif"
  // lo que rompía el parser JS y mataba todo el script (ReferenceError: sans).
  // Usamos JSON.stringify para escapar comillas internas correctamente.
  const fontMainJs = JSON.stringify(font + ', "Inter", sans-serif');

  let html = '';
  html += '<!DOCTYPE html>\n';
  html += '<html lang="es">\n';
  html += '<head>\n';
  html += '<meta charset="UTF-8">\n';
  html += '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n';
  html += '<meta name="theme-color" content="' + data.color + '">\n';
  html += '<meta name="description" content="' + escapeHtml(data.description || data.name) + '">\n';
  html += '<title>' + escapeHtml(data.name) + '</title>\n';
  html += fontImport + '\n';
  // Swiper carousel CDN (para galería multi-imagen de platos)
  html += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" referrerpolicy="no-referrer">\n';
  html += '<style>' + css + '</style>\n';
  html += '</head>\n';
  html += '<body>\n';
  html += '<div id="app"></div>\n';
  // Mobile bottom nav (Inicio/Buscar/Favoritos/Carrito) — solo visible en mobile via CSS
  html += '<nav class="mobile-bottom-nav" id="mobileBottomNav" aria-label="Navegación móvil">\n';
  html += '  <button class="mbn-item active" data-action="home" aria-label="Inicio">\n';
  html += '    <span class="mbn-icon-wrap"><span class="mbn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span></span>\n';
  html += '    <span>Inicio</span>\n';
  html += '  </button>\n';
  html += '  <button class="mbn-item" data-action="search" aria-label="Buscar">\n';
  html += '    <span class="mbn-icon-wrap"><span class="mbn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span></span>\n';
  html += '    <span>Buscar</span>\n';
  html += '  </button>\n';
  html += '  <button class="mbn-item" data-action="favorites" aria-label="Favoritos">\n';
  html += '    <span class="mbn-icon-wrap"><span class="mbn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span><span class="mbn-badge" id="mbnFavCount" style="display:none;">0</span></span>\n';
  html += '    <span>Favoritos</span>\n';
  html += '  </button>\n';
  html += '  <button class="mbn-item" data-action="cart" aria-label="Carrito">\n';
  html += '    <span class="mbn-icon-wrap"><span class="mbn-cart-total" id="mbnCartTotal"></span><span class="mbn-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></span><span class="mbn-badge" id="mbnCartCount" style="display:none;">0</span></span>\n';
  html += '    <span>Pedido</span>\n';
  html += '  </button>\n';
  html += '</nav>\n';
  // Floating "scroll to top" button — aparece tras scroll > 600px (mobile-first)
  // Solo visible en mobile (<640px) — en desktop el nav chip "Inicio" cumple la misma función
  html += '<button class="scroll-top-btn" id="scrollTopBtn" aria-label="Volver arriba">\n';
  html += '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>\n';
  html += '</button>\n';
  // Floating theme toggle button — siempre visible (top-right, below .nav)
  // Permite al cliente alternar dark/light theme. Persistencia en localStorage.
  // En preview del dashboard NO se muestra (el dueño controla theme_dark_mode desde el editor)
  if (!isPreview) {
    html += '<button class="theme-toggle-btn" id="themeToggleBtn" aria-label="Cambiar tema" title="Cambiar tema">\n';
    html += '  <svg class="theme-toggle-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>\n';
    html += '  <svg class="theme-toggle-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>\n';
    html += '</button>\n';
  }
  html += '<script>\n';
  // Anti-FOUC: aplicar tema guardado ANTES de que el browser renderice el body
  // Esto evita un flash del tema por defecto si el usuario había elegido otro
  html += 'try{var saved=localStorage.getItem("menupro-theme");if(saved==="light"||saved==="dark"){document.documentElement.setAttribute("data-theme",saved);}}catch(e){}\n';
  html += 'var RESTAURANT = ' + JSON.stringify(data) + ';\n';
  html += 'var SHOW_BRANDING = ' + (!!data.branding_text) + ';\n';
  html += 'var BRANDING_TEXT = ' + JSON.stringify(data.branding_text || '') + ';\n';
  html += 'var THEME = ' + JSON.stringify({ layout, imageSize, cardStyle, showSearch, showGallery, cartaStyle, cartaListStyle, cartaAutoscroll, cartaScrollSpeed }) + ';\n';
  html += 'var IS_PREVIEW = ' + JSON.stringify(isPreview) + ';\n';
  html += 'document.documentElement.style.setProperty("--accent", "' + data.color + '");\n';
  html += 'document.documentElement.style.setProperty("--accent-rgb", "' + colorRgb + '");\n';
  html += 'document.documentElement.style.setProperty("--secondary", "' + secondary + '");\n';
  html += 'document.documentElement.style.setProperty("--secondary-rgb", "' + secondaryRgb + '");\n';
  // ⚠️ FIX: property CSS value debe ser un string COMPLETO entre comillas
  html += 'document.documentElement.style.setProperty("--font-main", ' + fontMainJs + ');\n';
  html += js + '\n';
  html += '</scr' + 'ipt>\n';
  // Swiper JS bundle (carga async para no bloquear el render del menú)
  html += '<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" referrerpolicy="no-referrer" defer></scr' + 'ipt>\n';
  html += '</body>\n';
  html += '</html>';
  return html;
}

interface ThemeOpts {
  layout: 'single' | 'double' | 'grid';
  imageSize: 'none' | 'small' | 'medium' | 'large' | 'hero';
  cardStyle: 'compact' | 'expanded' | 'minimal';
  font: string;
  darkMode: boolean;
  showSearch: boolean;
  showCatIcons: boolean;
  rounded: boolean;
  coverUrl: string | null;
  secondary: string;
  showGallery: boolean;
  cartaStyle: boolean;
  cartaListStyle: boolean;
}

function buildCSS(opts: ThemeOpts): string {
  const { layout, imageSize, cardStyle, font, darkMode, showSearch, showCatIcons, rounded, coverUrl, showGallery, cartaStyle, cartaListStyle } = opts;
  const radius = rounded ? '16px' : '4px';
  const radiusSm = rounded ? '12px' : '2px';
  const radiusLg = rounded ? '24px' : '8px';

  // Colores según dark/light — light mode usa beige/cream suave (no blanco puro)
  // para dar calidez tipo PedidosYa/Rappi light theme.
  // --accent-text es la versión oscurecida del accent para texto sobre fondo claro
  // (garantiza contraste incluso si el usuario elige un accent muy claro como amarillo).
  const darkColors = {
    bg0: '#07070b', bg1: '#0f0f1a',
    text: '#f4f4fa', textMuted: '#8a8a9a', textSoft: '#b8b8c8',
    glass: 'rgba(255,255,255,0.035)', glassStrong: 'rgba(255,255,255,0.07)',
    border: 'rgba(255,255,255,0.08)', borderStrong: 'rgba(255,255,255,0.14)',
    accentText: 'var(--accent)',
    // Extras para toggle de tema runtime
    navBg: 'rgba(7,7,11,0.78)',
    bottomNavBg: 'rgba(20,20,31,0.98)',
    lightboxBg: '#14141f',
    modalGradient: 'linear-gradient(180deg,#1c1c2e,#14141f)',
    optionBg: 'rgba(255,255,255,0.035)',
    optionItemBg: 'rgba(255,255,255,0.045)',
    optionCounterBg: 'rgba(255,255,255,0.06)',
    optionBorderDashed: 'rgba(255,255,255,0.15)',
    handleBg: 'rgba(255,255,255,0.18)'
  };
  const lightColors = {
    bg0: '#fefcf7', bg1: '#ffffff',
    text: '#1a1a2e', textMuted: '#6a6a7a', textSoft: '#3a3a4a',
    glass: 'rgba(0,0,0,0.025)', glassStrong: 'rgba(0,0,0,0.05)',
    border: 'rgba(0,0,0,0.08)', borderStrong: 'rgba(0,0,0,0.14)',
    accentText: 'color-mix(in srgb, var(--accent) 78%, #000)',
    navBg: 'rgba(250,250,250,0.85)',
    bottomNavBg: 'rgba(255,255,255,0.98)',
    lightboxBg: '#ffffff',
    modalGradient: 'linear-gradient(180deg,#fff,#f5f5f5)',
    optionBg: 'rgba(0,0,0,0.025)',
    optionItemBg: 'rgba(0,0,0,0.035)',
    optionCounterBg: 'rgba(0,0,0,0.05)',
    optionBorderDashed: 'rgba(0,0,0,0.15)',
    handleBg: 'rgba(0,0,0,0.12)'
  };
  // El tema por defecto del dueño (darkMode) se aplica en :root sin data-theme.
  // El cliente puede sobrescribirlo con el toggle → data-theme="light"|"dark" persiste en localStorage.
  const defaultColors = darkMode ? darkColors : lightColors;
  const oppositeColors = darkMode ? lightColors : darkColors;
  const defaultName = darkMode ? 'dark' : 'light';
  const oppositeName = darkMode ? 'light' : 'dark';

  let c = '';
  // Build a string of all color variables for a given color set
  const colorVars = (cl: typeof darkColors) => `--bg-0:${cl.bg0};--bg-1:${cl.bg1};--glass:${cl.glass};--glass-strong:${cl.glassStrong};--border:${cl.border};--border-strong:${cl.borderStrong};--text:${cl.text};--text-muted:${cl.textMuted};--text-soft:${cl.textSoft};--accent-text:${cl.accentText};--nav-bg:${cl.navBg};--bottom-nav-bg:${cl.bottomNavBg};--lightbox-bg:${cl.lightboxBg};--modal-gradient:${cl.modalGradient};--option-bg:${cl.optionBg};--option-item-bg:${cl.optionItemBg};--option-counter-bg:${cl.optionCounterBg};--option-border-dashed:${cl.optionBorderDashed};--handle-bg:${cl.handleBg};`;
  // :root = tema por defecto del dueño (sin data-theme attribute)
  c += `:root{--accent:#ff6b35;--accent-rgb:255,107,53;--secondary:#1a1a2e;--gold:#d4af37;${colorVars(defaultColors)}--font-main:${font},"Inter",sans-serif;--radius:${radius};--radius-sm:${radiusSm};--radius-lg:${radiusLg};}`;
  // Override explícito para data-theme="dark"
  c += `:root[data-theme="dark"]{${colorVars(darkColors)}}`;
  // Override explícito para data-theme="light"
  c += `:root[data-theme="light"]{${colorVars(lightColors)}}`;
  // Override para fondos hardcodeados en CSS (cuando darkMode=true se generan estilos extra)
  // El body::before/after solo se renderiza en dark mode original — lo mostramos siempre
  // pero con opacidad reducida en light mode para no romper el cálido del cream.
  c += '*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}';
  c += 'html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}';
  c += `body{font-family:var(--font-main);background:var(--bg-0);color:var(--text);min-height:100vh;padding-bottom:calc(110px + env(safe-area-inset-bottom, 0px));position:relative;overflow-x:hidden;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch;}`;
  // En desktop (>=640px) la bottom-nav está oculta → no necesita padding extra
  c += '@media(min-width:640px){body{padding-bottom:0;}}';
  // Orbes decorativos (orbs) — visibles en ambos temas, pero con menor opacidad en light mode
  c += 'body::before,body::after{content:"";position:fixed;width:500px;height:500px;border-radius:50%;filter:blur(140px);opacity:0.18;z-index:0;pointer-events:none;transition:opacity 0.4s;}';
  c += 'body::before{background:var(--accent);top:-200px;right:-150px;}';
  c += 'body::after{background:var(--gold);bottom:-200px;left:-150px;}';
  // En light mode, los orbs son muy invasivos → reducir opacidad
  c += ':root[data-theme="light"] body::before,:root[data-theme="light"] body::after{opacity:0.07;}';
  // Si el tema por defecto del dueño ES light, también reducir
  if (!darkMode) {
    c += ':root:not([data-theme]) body::before,:root:not([data-theme]) body::after{opacity:0.07;}';
  }
  c += '#app{position:relative;z-index:1;}';

  // ─── HERO / COVER (con efecto blur detrás del header) ───
  if (coverUrl) {
    c += '.hero{position:relative;width:100%;height:340px;overflow:hidden;background:var(--bg-1);}';
    c += '.hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.1);}';
    c += '@media(min-width:600px){.hero{height:420px;}}';
    // Overlay gradient para legibilidad
    c += '.hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.25) 0%,rgba(0,0,0,0.55) 60%,var(--bg-0) 100%);}';
  }

  // Header — cuando hay cover, se superpone encima con efecto glass
  if (coverUrl) {
    c += `.header{position:relative;z-index:2;margin-top:-180px;padding:0 24px 30px;text-align:center;}`;
    c += '@media(min-width:600px){.header{margin-top:-220px;}}';
  } else {
    c += `.header{padding:38px 24px 30px;text-align:center;position:relative;background:linear-gradient(180deg,rgba(255,255,255,0.03) 0%,transparent 100%);border-bottom:1px solid var(--border);}`;
    c += '.header::after{content:"";position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:140px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);}';
  }
  c += '.logo-wrap{position:relative;display:inline-block;margin-bottom:18px;width:140px;height:140px;}';
  c += '.logo-wrap::before{content:"";position:absolute;inset:-8px;border-radius:50%;background:conic-gradient(from 0deg,var(--accent),var(--gold),var(--accent));filter:blur(14px);opacity:0.55;z-index:0;animation:rotate 8s linear infinite;}';
  c += '@keyframes rotate{to{transform:rotate(360deg);}}';
  c += '.logo{width:140px;height:140px;border-radius:50%;object-fit:cover;border:4px solid rgba(255,255,255,0.2);box-shadow:0 16px 48px rgba(0,0,0,0.6);background:var(--glass);position:absolute;inset:0;z-index:2;}';
  c += '.logo-placeholder{width:140px;height:140px;border-radius:50%;background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.6));display:flex;align-items:center;justify-content:center;font-size:54px;font-weight:800;color:#fff;position:absolute;inset:0;z-index:1;border:4px solid rgba(255,255,255,0.2);box-shadow:0 16px 48px rgba(0,0,0,0.6);backdrop-filter:blur(8px);}';
  c += '@media(min-width:600px){.logo-wrap{width:168px;height:168px;margin-bottom:22px;}.logo,.logo-placeholder{width:168px;height:168px;font-size:64px;}}';
  c += '@media(min-width:900px){.logo-wrap{width:184px;height:184px;}.logo,.logo-placeholder{width:184px;height:184px;font-size:72px;}}';
  c += '.restaurant-name{font-size:28px;font-weight:800;margin-bottom:6px;letter-spacing:-0.5px;color:var(--text);text-shadow:' + (coverUrl ? '0 2px 12px rgba(0,0,0,0.6)' : 'none') + ';}';
  c += '.slogan{font-size:11px;color:var(--gold);letter-spacing:4px;text-transform:uppercase;font-weight:600;margin-bottom:8px;}';
  c += '.restaurant-desc{color:' + (coverUrl && darkMode ? 'rgba(255,255,255,0.85)' : 'var(--text-soft)') + ';font-size:14px;margin-bottom:18px;max-width:440px;margin-left:auto;margin-right:auto;line-height:1.5;}';
  c += '.open-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(6,214,160,0.12);color:#06d6a0;padding:6px 14px;border-radius:20px;font-size:11.5px;font-weight:600;border:1px solid rgba(6,214,160,0.25);letter-spacing:0.5px;text-transform:uppercase;}';
  c += '.open-badge::before{content:"";width:6px;height:6px;border-radius:50%;background:#06d6a0;box-shadow:0 0 8px #06d6a0;animation:pulse 2s infinite;}';
  c += '@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(1.3);}}';

  // ─── Redes sociales ───
  c += '.socials{display:flex;justify-content:center;align-items:center;gap:10px;margin-top:16px;flex-wrap:wrap;}';
  c += '.social-link{width:38px;height:38px;border-radius:50%;background:var(--glass);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text-soft);transition:all 0.25s cubic-bezier(0.4,0,0.2,1);cursor:pointer;text-decoration:none;}';
  c += '.social-link:hover{background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.85));color:#fff;border-color:transparent;transform:translateY(-3px);box-shadow:0 8px 20px rgba(var(--accent-rgb),0.4);}';
  c += '.social-link svg{width:18px;height:18px;}';

  // Search bar (opcional, Pro)
  if (showSearch) {
    c += '.search-wrap{padding:12px 20px 0;max-width:620px;margin:0 auto;position:relative;}';
    c += '.search-input{width:100%;padding:12px 16px 12px 44px;border-radius:var(--radius-sm);background:var(--glass);border:1px solid var(--border);color:var(--text);font-size:15px;font-family:var(--font-main);outline:none;transition:border 0.2s;}';
    c += '.search-input:focus{border-color:rgba(var(--accent-rgb),0.5);background:var(--glass-strong);}';
    c += '.search-input::placeholder{color:var(--text-muted);}';
    c += '.search-icon{position:absolute;left:36px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:var(--text-muted);pointer-events:none;}';
  }

  // Nav
  c += '.nav{position:sticky;top:0;background:var(--nav-bg);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border-bottom:1px solid var(--border);z-index:100;padding:12px 0;overflow-x:auto;scrollbar-width:none;}';
  c += '.nav::-webkit-scrollbar{display:none;}';
  c += '.nav-inner{display:flex;gap:8px;padding:0 20px;min-width:max-content;}';
  // Tap target ≥44px (Apple HIG / Material spec) — touch-friendly mobile-first
  c += '.nav-item{white-space:nowrap;padding:11px 18px;background:var(--glass);border:1px solid var(--border);border-radius:24px;color:var(--text-soft);font-size:13.5px;font-weight:500;cursor:pointer;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);display:flex;align-items:center;gap:6px;min-height:44px;}';
  // Hover solo en dispositivos con hover real (desktop) — evita sticky hover en mobile
  c += '@media(hover:hover){.nav-item:hover{background:var(--glass-strong);color:var(--text);transform:translateY(-1px);}}';
  c += '.nav-item:active{transform:scale(0.96);}';
  c += '.nav-item.active{background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.85));color:#fff;border-color:transparent;box-shadow:0 4px 16px rgba(var(--accent-rgb),0.4);}';
  if (showCatIcons) {
    c += '.nav-item-icon{font-size:16px;line-height:1;}';
  }

  // Section
  const sectionMaxW = layout === 'single' ? '640px' : '1100px';
  // scroll-margin-top: compensa el header sticky (.nav ~58px) al hacer click en chip de categoría
  c += `.section{padding:24px 20px 8px;max-width:${sectionMaxW};margin:0 auto;width:100%;scroll-margin-top:70px;}`;
  // En desktop: single layout usa 2 columnas para aprovechar mejor el espacio
  c += '@media(min-width:880px){.section.single-layout{max-width:920px;}.section.single-layout .dish-grid{grid-template-columns:repeat(2,1fr);gap:18px;}}';
  c += '.section-title{font-size:21px;font-weight:700;margin-bottom:18px;display:flex;align-items:center;gap:12px;letter-spacing:-0.3px;}';
  c += '.section-title::before{content:"";width:4px;height:22px;background:linear-gradient(180deg,var(--accent),var(--gold));border-radius:2px;}';

  // ─── Layout: contenedor de platos ───
  // PedidosYa/Rappi style: cards con imagen grande arriba → grid responsivo
  if (layout === 'double') {
    c += '.dishes-grid{display:grid;grid-template-columns:1fr;gap:14px;}';
    c += '@media(min-width:640px){.dishes-grid{grid-template-columns:1fr 1fr;}}';
  } else if (layout === 'grid') {
    c += '.dishes-grid{display:grid;grid-template-columns:1fr;gap:14px;}';
    c += '@media(min-width:480px){.dishes-grid{grid-template-columns:1fr 1fr;}}';
    c += '@media(min-width:1024px){.dishes-grid{grid-template-columns:1fr 1fr 1fr;}}';
  } else {
    // single = 1 col mobile, 2 col tablet+ (mejor aprovechamiento, estilo PedidosYa)
    c += '.dishes-grid{display:grid;grid-template-columns:1fr;gap:14px;}';
    c += '@media(min-width:640px){.dishes-grid{grid-template-columns:1fr 1fr;}}';
  }

  // ─── DISH CARD — PedidosYa/Rappi style universal ───
  // Siempre: imagen grande arriba (160px mobile, 180px desktop) + info abajo.
  // Si no hay imagen, placeholder con inicial del plato (gradient accent).
  // imageSize solo controla si se muestra la imagen o no (none = sin imagen).
  const showImg = imageSize !== 'none';

  // Base dish — columna siempre (imagen arriba, info abajo)
  c += '.dish{background:var(--bg-1);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;cursor:pointer;position:relative;transition:transform 0.3s cubic-bezier(0.4,0,0.2,1),box-shadow 0.3s,border-color 0.3s;opacity:0;transform:translateY(20px);display:flex;flex-direction:column;}';
  c += '.dish.revealed{opacity:1;transform:translateY(0);}';
  // Hover solo en desktop (hover:hover) — en mobile se queda sticky después del tap
  c += '@media(hover:hover){.dish:hover{transform:translateY(-4px);box-shadow:0 14px 32px rgba(0,0,0,0.18);border-color:rgba(var(--accent-rgb),0.35);}}';
  c += '.dish:active{transform:translateY(-1px) scale(0.997);}';

  // HERO IMAGE WRAPPER (siempre 16/10 aspect, overflow hidden para zoom hover)
  if (showImg) {
    c += '.dish-img-wrap{position:relative;width:100%;aspect-ratio:16/10;overflow:hidden;background:linear-gradient(135deg,var(--glass),var(--glass-strong));flex-shrink:0;}';
    c += '.dish-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.55s cubic-bezier(0.2,0,0.2,1);}';
    c += '.dish:hover .dish-img{transform:scale(1.06);}';
    // Placeholder cuando no hay image_url — gradient con inicial del plato
    c += '.dish-img-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.55));color:#fff;font-size:54px;font-weight:900;letter-spacing:-2px;text-shadow:0 4px 14px rgba(0,0,0,0.18);}';
    // Pequeño badge de categoría opcional encima de la imagen (esquina sup-izq)
    c += '.dish-cat-badge{position:absolute;top:10px;left:10px;background:rgba(0,0,0,0.62);color:#fff;font-size:10.5px;font-weight:700;padding:4px 9px;border-radius:14px;letter-spacing:0.4px;text-transform:uppercase;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);z-index:2;}';
  }

  // INFO area (debajo de la imagen)
  c += '.dish-info{padding:14px 16px 16px;display:flex;flex-direction:column;flex:1;min-height:0;}';
  c += '.dish-name{font-size:16px;font-weight:700;color:var(--text);letter-spacing:-0.2px;line-height:1.3;margin:0 0 4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}';
  c += '.dish-desc{font-size:13px;color:var(--text-muted);line-height:1.5;margin:0 0 10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:39px;}';
  c += '.dish-bottom{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:auto;padding-top:6px;}';
  c += '.dish-price{font-size:19px;font-weight:800;color:var(--accent-text);letter-spacing:-0.5px;line-height:1;}';
  c += '.add-btn{background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.82));color:#fff;border:none;padding:11px 18px;border-radius:24px;font-size:13.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;box-shadow:0 4px 14px rgba(var(--accent-rgb),0.35);transition:all 0.22s;line-height:1;flex-shrink:0;min-height:40px;}';
  c += '@media(hover:hover){.add-btn:hover{transform:scale(1.06);box-shadow:0 6px 20px rgba(var(--accent-rgb),0.55);}}';
  c += '.add-btn:active{transform:scale(0.96);}';

  // Card style variants (afectan padding y borde, mantienen PedidosYa/Rappi layout)
  if (cardStyle === 'compact') {
    c += '.dish-info{padding:10px 12px 12px;}';
    c += '.dish-name{font-size:15px;}';
    c += '.dish-desc{font-size:12.5px;min-height:36px;}';
  } else if (cardStyle === 'minimal') {
    c += '.dish{background:transparent;border-color:transparent;}';
    c += '.dish:hover{box-shadow:0 8px 22px rgba(0,0,0,0.10);border-color:rgba(var(--accent-rgb),0.18);}';
  }

  c += '.added-flash{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);background:#06d6a0;color:#fff;padding:8px 18px;border-radius:24px;font-size:12px;font-weight:700;pointer-events:none;z-index:5;box-shadow:0 6px 18px rgba(6,214,160,0.5);animation:flashAdd 0.9s ease forwards;letter-spacing:0.3px;}';
  c += '@keyframes flashAdd{0%{transform:translate(-50%,-50%) scale(0);opacity:0;}25%{transform:translate(-50%,-50%) scale(1);opacity:1;}75%{transform:translate(-50%,-90%) scale(1);opacity:1;}100%{transform:translate(-50%,-130%) scale(0.8);opacity:0;}}';

  // ─── Lightbox de plato (estilo PedidosYa/Rappi — mobile-first ultra pro) ───
  if (showGallery) {
    // Overlay full-screen en mobile (modal llena TODA la pantalla, sin gap negro)
    // En desktop: card centrada con padding
    c += '.dish-lightbox{position:fixed;inset:0;background:rgba(0,0,0,0.94);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);z-index:300;display:none;align-items:stretch;justify-content:center;padding:0;animation:dlbFadeIn 0.2s ease;overflow-y:auto;}';
    c += '.dish-lightbox.visible{display:flex;}';
    c += '@keyframes dlbFadeIn{from{opacity:0;}to{opacity:1;}}';
    c += '@media(min-width:640px){.dish-lightbox{align-items:center;padding:24px;}}';
    // Inner: FULL-SCREEN en mobile (min-height:100dvh — elimina el gap negro superior)
    // En desktop: card centrada con border-radius y max-height
    c += '.dish-lightbox-inner{background:var(--lightbox-bg);width:100%;max-width:560px;min-height:100dvh;max-height:100dvh;overflow:hidden;position:relative;color:var(--text);border-radius:0;animation:dlbSlideUp 0.32s cubic-bezier(0.32,0.72,0,1);box-shadow:none;display:flex;flex-direction:column;}';
    c += '@media(min-width:640px){.dish-lightbox-inner{border-radius:28px;min-height:auto;max-height:92vh;animation:dlbZoomIn 0.3s cubic-bezier(0.32,0.72,0,1);box-shadow:0 30px 80px rgba(0,0,0,0.6);}}';
    c += '@keyframes dlbSlideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}';
    c += '@keyframes dlbZoomIn{from{transform:scale(0.95);opacity:0;}to{transform:scale(1);opacity:1;}}';
    // Handle bar oculto en mobile (modal full-screen, no necesita handle)
    // Visible solo en desktop como element decorativo (pero ahí también lo ocultamos)
    c += '.dish-lightbox-handle{display:none;width:40px;height:4px;background:var(--handle-bg);border-radius:4px;margin:8px auto 0;flex-shrink:0;}';
    c += '@media(min-width:640px){.dish-lightbox-handle{display:none;}}';
    // Close button — flota sobre la imagen (estilo Rappi)
    c += '.dish-lightbox-close{position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:50%;background:rgba(0,0,0,0.55);color:#fff;border:none;cursor:pointer;font-size:22px;line-height:1;display:flex;align-items:center;justify-content:center;z-index:10;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:all 0.2s;box-shadow:0 4px 12px rgba(0,0,0,0.3);}';
    c += '.dish-lightbox-close:hover{background:rgba(0,0,0,0.78);transform:scale(1.05);}';
    c += '.dish-lightbox-close:active{transform:scale(0.95);}';
    // HERO IMAGE — wider hero on mobile (full-screen modal), 16/9 on desktop
    // Background gradient fills any transparent area (e.g. PNG logos) — no more "black gap"
    c += '.dish-lightbox-hero{position:relative;width:100%;aspect-ratio:4/3;max-height:48vh;overflow:hidden;background:linear-gradient(135deg,rgba(var(--accent-rgb),0.85) 0%,var(--accent) 50%,rgba(var(--accent-rgb),0.85) 100%);flex-shrink:0;}';
    c += '@media(min-width:640px){.dish-lightbox-hero{aspect-ratio:16/9;border-radius:28px 28px 0 0;max-height:50vh;}}';
    c += '.dish-lightbox-img{width:100%;height:100%;object-fit:cover;display:block;}';
    // Gradient overlay para legibilidad del close button
    c += '.dish-lightbox-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 70%,rgba(0,0,0,0.25) 100%);pointer-events:none;}';
    // Placeholder cuando no hay imagen — diseño premium
    c += '.dish-lightbox-img-placeholder{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.6));color:#fff;}';
    c += '.dish-lightbox-img-placeholder .ph-letter{font-size:120px;font-weight:900;line-height:1;text-shadow:0 4px 16px rgba(0,0,0,0.25);}';
    c += '@media(min-width:640px){.dish-lightbox-img-placeholder .ph-letter{font-size:140px;}}';
    c += '.dish-lightbox-img-placeholder .ph-label{font-size:13px;opacity:0.9;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;}';
    // Content area — padding generoso, mobile-first, scrolls if content too long
    c += '.dish-lightbox-content{padding:20px 20px 16px;flex:1 1 auto;overflow-y:auto;-webkit-overflow-scrolling:touch;}';
    c += '@media(min-width:640px){.dish-lightbox-content{padding:28px 32px 20px;}}';
    // Category badge (pequeño, encima del título)
    c += '.dish-lightbox-cat{display:inline-block;font-size:11px;font-weight:700;color:var(--accent);background:rgba(var(--accent-rgb),0.12);padding:4px 10px;border-radius:20px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:10px;}';
    // Title — grande, bold
    c += '.dish-lightbox-name{font-size:24px;font-weight:800;letter-spacing:-0.5px;color:var(--text);margin:0 0 6px;line-height:1.2;}';
    c += '@media(min-width:640px){.dish-lightbox-name{font-size:28px;}}';
    // Price row — destacado debajo del título (estilo Rappi)
    c += '.dish-lightbox-price-row{display:flex;align-items:baseline;gap:8px;margin:4px 0 18px;flex-wrap:wrap;}';
    c += '.dish-lightbox-price{font-size:26px;font-weight:800;color:var(--accent);letter-spacing:-0.5px;line-height:1;}';
    c += '@media(min-width:640px){.dish-lightbox-price{font-size:30px;}}';
    c += '.dish-lightbox-currency{font-size:14px;font-weight:600;color:var(--text-soft);opacity:0.7;}';
    // Description
    c += '.dish-lightbox-desc-label{font-size:11px;font-weight:700;color:var(--text-soft);opacity:0.6;letter-spacing:0.8px;text-transform:uppercase;margin:0 0 6px;}';
    c += '.dish-lightbox-desc{font-size:15px;color:var(--text-soft);line-height:1.6;margin:0 0 22px;}';
    c += '@media(min-width:640px){.dish-lightbox-desc{font-size:16px;line-height:1.65;}}';
    // Sticky CTA bar — siempre visible en la parte inferior del modal (no se mueve con scroll)
    c += '.dish-lightbox-cta{flex-shrink:0;padding:14px 20px calc(18px + env(safe-area-inset-bottom, 0px));background:var(--lightbox-bg);border-top:1px solid var(--border);box-shadow:0 -4px 16px rgba(0,0,0,0.15);}';
    c += '.dish-lightbox-add{width:100%;background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.85));color:#fff;border:none;padding:16px 22px;border-radius:var(--radius);font-size:16px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all 0.2s;box-shadow:0 8px 24px rgba(var(--accent-rgb),0.45);-webkit-tap-highlight-color:transparent;}';
    c += '.dish-lightbox-add:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(var(--accent-rgb),0.6);}';
    c += '.dish-lightbox-add:active{transform:translateY(0);}';
    c += '.dish-lightbox-add.added{background:linear-gradient(135deg,#22c55e,#16a34a);box-shadow:0 8px 24px rgba(34,197,94,0.4);}';
  }

  // Cart floating bar — visible en DESKTOP. En mobile el bottom-nav maneja el carrito.
  c += '.cart{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(140px);width:calc(100% - 32px);max-width:480px;background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.9));color:#fff;border-radius:var(--radius);padding:16px 22px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 14px 40px rgba(var(--accent-rgb),0.45),0 4px 12px rgba(0,0,0,0.4);cursor:pointer;transition:transform 0.4s cubic-bezier(0.4,0,0.2,1);z-index:90;border:1px solid rgba(255,255,255,0.18);margin-bottom:env(safe-area-inset-bottom,0px);}';
  c += '.cart.visible{transform:translateX(-50%) translateY(0);}';
  // En mobile (<640px) ocultamos la barra flotante .cart porque el bottom-nav ya tiene
  // el tab "Pedido" con badge + total. Evita overlap y duplicación.
  c += '@media(max-width:639px){.cart{display:none !important;}}';
  c += '.cart-left{display:flex;align-items:center;gap:10px;font-weight:600;font-size:15px;}';
  c += '.cart-count{background:rgba(255,255,255,0.25);padding:3px 10px;border-radius:12px;font-size:13px;font-weight:700;min-width:28px;text-align:center;}';
  c += '.cart-count.pulse{animation:countPulse 0.4s ease;}';
  c += '@keyframes countPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.4);background:rgba(255,255,255,0.4);}}';
  c += '.cart-total{font-size:18px;font-weight:800;letter-spacing:-0.3px;}';
  // Modal
  c += '.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:200;display:none;align-items:flex-end;justify-content:center;padding-bottom:env(safe-area-inset-bottom,0px);}';
  c += '.modal-overlay.visible{display:flex;}';
  c += `.modal{background:var(--modal-gradient);width:100%;max-width:500px;border-radius:24px 24px 0 0;padding:28px 24px;max-height:85vh;overflow-y:auto;animation:slideUp 0.4s cubic-bezier(0.4,0,0.2,1);border:1px solid var(--border);border-bottom:none;box-shadow:0 -16px 48px rgba(0,0,0,0.5);color:var(--text);}`;
  c += '.modal-title{font-size:22px;font-weight:700;margin-bottom:4px;text-align:center;letter-spacing:-0.3px;color:var(--text);}';
  c += '.modal-subtitle{text-align:center;font-size:12.5px;color:var(--text-muted);margin-bottom:22px;letter-spacing:0.3px;}';
  c += '.modal-divider{height:1px;background:linear-gradient(90deg,transparent,var(--border-strong),transparent);margin:0 -24px 20px;}';
  c += '.cart-item{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--border);gap:10px;animation:itemIn 0.3s ease;}';
  c += '@keyframes itemIn{from{opacity:0;transform:translateX(-10px);}to{opacity:1;transform:translateX(0);}}';
  c += '.cart-item-info{flex:1;min-width:0;}';
  c += '.cart-item-name{font-weight:600;font-size:15px;margin-bottom:2px;color:var(--text);}';
  c += '.cart-item-extras{color:var(--accent);font-size:11.5px;font-weight:500;margin-bottom:2px;opacity:0.85;line-height:1.3;}';
  c += '.cart-item-note{color:var(--text-soft);font-size:11.5px;font-style:italic;margin-bottom:2px;opacity:0.75;line-height:1.3;}';
  c += '.cart-item-price{color:var(--text-muted);font-size:12.5px;}';
  c += '.qty-control{display:flex;align-items:center;gap:10px;background:var(--glass);padding:4px;border-radius:24px;border:1px solid var(--border);}';
  c += '.qty-btn{width:28px;height:28px;border-radius:50%;background:var(--glass-strong);color:var(--text);border:none;cursor:pointer;font-size:16px;line-height:1;transition:all 0.2s;display:flex;align-items:center;justify-content:center;}';
  c += '.qty-btn:hover{background:var(--accent);color:#fff;transform:scale(1.1);}';
  c += '.qty{min-width:24px;text-align:center;font-weight:600;font-size:14px;color:var(--text);}';
  c += '.cart-item-total{font-weight:700;color:var(--accent);min-width:75px;text-align:right;font-size:15px;}';
  c += '.cart-empty{text-align:center;padding:50px 0;color:var(--text-muted);font-size:14px;}';
  c += '.cart-summary{margin-top:20px;padding-top:20px;border-top:2px solid var(--border);}';
  c += '.summary-row{display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px;color:var(--text-soft);}';
  c += '.summary-total{font-size:18px;font-weight:700;margin-top:12px;color:var(--text);display:flex;justify-content:space-between;align-items:center;}';
  c += '.summary-total .amount{color:var(--accent);font-size:24px;font-weight:800;letter-spacing:-0.5px;}';
  c += '.wa-btn{width:100%;background:linear-gradient(135deg,#25d366,#1da851);color:#fff;border:none;padding:16px;border-radius:var(--radius);font-size:15px;font-weight:700;cursor:pointer;margin-top:22px;display:flex;align-items:center;justify-content:center;gap:10px;transition:all 0.2s;box-shadow:0 6px 20px rgba(37,211,102,0.35);letter-spacing:0.2px;}';
  c += '.wa-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(37,211,102,0.5);}';
  c += '.wa-btn:active{transform:translateY(0);}';
  c += '.wa-icon{width:18px;height:18px;fill:currentColor;}';
  c += '.close-btn{width:100%;background:var(--glass);color:var(--text-soft);border:1px solid var(--border);padding:13px;border-radius:var(--radius-sm);font-size:14px;cursor:pointer;margin-top:10px;transition:all 0.2s;font-weight:500;}';
  c += '.close-btn:hover{background:var(--glass-strong);color:var(--text);}';
  c += '.menu-footer{text-align:center;padding:30px 20px;color:var(--text-muted);font-size:11.5px;border-top:1px solid var(--border);margin-top:20px;padding-bottom:calc(30px + env(safe-area-inset-bottom, 0px));}';
  c += '.menu-footer a{color:var(--gold);text-decoration:none;font-weight:600;letter-spacing:1px;}';
  c += '.no-results{text-align:center;padding:40px 20px;color:var(--text-muted);font-size:14px;}';

  // ─── Swiper carousel (galería multi-imagen en lightbox) ───
  if (showGallery) {
    c += '.dish-swiper{width:100%;height:100%;}';
    c += '.dish-swiper .swiper-slide{width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;}';
    c += '.dish-swiper .swiper-slide img{width:100%;height:100%;object-fit:cover;display:block;}';
    c += '.dish-swiper .swiper-slide .dish-lightbox-img-placeholder{width:100%;height:100%;}';
    c += '.dish-swiper .swiper-pagination-bullet{background:#fff;opacity:0.5;}';
    c += '.dish-swiper .swiper-pagination-bullet-active{background:#fff;opacity:1;width:20px;border-radius:4px;transition:all 0.2s;}';
    c += '.dish-swiper .swiper-button-next,.dish-swiper .swiper-button-prev{background:rgba(0,0,0,0.45);color:#fff;width:38px;height:38px;border-radius:50%;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:0 4px 12px rgba(0,0,0,0.3);}';
    c += '.dish-swiper .swiper-button-next:after,.dish-swiper .swiper-button-prev:after{font-size:18px;font-weight:700;}';
    c += '.dish-img-count{position:absolute;bottom:12px;right:12px;background:rgba(0,0,0,0.55);color:#fff;font-size:11px;font-weight:600;padding:4px 10px;border-radius:12px;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:5;pointer-events:none;}';
    // Gradient overlay encima del hero (para legibilidad del close button)
    c += '.dish-lightbox-hero.has-gallery::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0.35) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0) 70%,rgba(0,0,0,0.25) 100%);pointer-events:none;z-index:5;}';
  }

  // ─── Product options (extras/salsas/personalizaciones) ───
  if (showGallery) {
    c += '.dish-options{margin:0 0 22px;padding:0;}';
    c += '.dish-options-title{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:var(--text);letter-spacing:-0.2px;margin:0 0 10px;}';
    c += '.dish-options-title svg{color:var(--accent);}';
    c += '.dish-options-empty{padding:16px;background:var(--option-bg);border:1px dashed var(--option-border-dashed);border-radius:14px;}';
    c += '.dish-options-hint{font-size:12.5px;color:var(--text-soft);opacity:0.7;line-height:1.5;}';
    c += '.dish-note-wrap{margin:0 0 20px;}';
    c += '.dish-note-input{width:100%;background:var(--option-item-bg);border:1px solid var(--border);border-radius:12px;padding:12px 14px;font-size:13.5px;color:var(--text);font-family:inherit;resize:none;outline:none;transition:border-color 0.15s;line-height:1.5;}';
    c += '.dish-note-input:focus{border-color:var(--accent);}';
    c += '.dish-note-input::placeholder{color:var(--text-soft);opacity:0.55;}';
    c += '.dish-option-group{margin:0 0 18px;padding:14px;background:var(--option-bg);border:1px solid var(--border);border-radius:14px;}';
    c += '.dish-option-group-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}';
    c += '.dish-option-group-name{font-size:14px;font-weight:700;color:var(--text);letter-spacing:-0.2px;}';
    c += '.dish-option-group-hint{font-size:11px;color:var(--text-soft);opacity:0.7;font-weight:500;}';
    c += '.dish-option-group-hint.required{color:var(--accent);font-weight:600;}';
    c += '.dish-option-items{display:flex;flex-direction:column;gap:6px;}';
    c += '.dish-option-item{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--option-item-bg);border:1px solid var(--border);border-radius:10px;transition:all 0.15s;cursor:pointer;}';
    c += '.dish-option-item:hover{border-color:var(--accent);background:rgba(var(--accent-rgb),0.06);}';
    c += '.dish-option-item.selected{border-color:var(--accent);background:rgba(var(--accent-rgb),0.12);}';
    c += '.dish-option-item-info{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}';
    c += '.dish-option-name{font-size:13.5px;color:var(--text);font-weight:500;}';
    c += '.dish-option-price{font-size:12.5px;color:var(--accent);font-weight:700;margin-left:auto;margin-right:10px;}';
    c += '.dish-option-price.free{color:var(--text-soft);opacity:0.6;}';
    // Single choice radio circle
    c += '.dish-option-radio{width:20px;height:20px;border:2px solid var(--border-strong);border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}';
    c += '.dish-option-radio.checked{border-color:var(--accent);}';
    c += '.dish-option-radio.checked::after{content:"";width:10px;height:10px;border-radius:50%;background:var(--accent);}';
    // Multiple choice +/- counter
    c += '.dish-option-counter{display:flex;align-items:center;gap:8px;background:var(--option-counter-bg);border-radius:18px;padding:3px;flex-shrink:0;}';
    c += '.dish-option-counter button{width:26px;height:26px;border-radius:50%;background:var(--glass-strong);color:var(--text);border:none;cursor:pointer;font-size:16px;line-height:1;display:flex;align-items:center;justify-content:center;transition:all 0.15s;-webkit-tap-highlight-color:transparent;}';
    c += '.dish-option-counter button:hover{background:var(--accent);color:#fff;}';
    c += '.dish-option-counter button:disabled{opacity:0.4;cursor:not-allowed;background:var(--glass-strong);color:var(--text-soft);}';
    c += '.dish-option-counter .count{min-width:22px;text-align:center;font-size:13px;font-weight:700;color:var(--text);}';
  }

  // ─── Mobile bottom navigation bar (Inicio/Buscar/Favoritos/Carrito) ───
  // z-index:95 = stays below modal (200) and lightbox (300), above content
  c += '.mobile-bottom-nav{position:fixed;bottom:0;left:0;right:0;background:var(--bottom-nav-bg);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid var(--border);display:flex;justify-content:space-around;align-items:stretch;padding:6px 4px calc(6px + env(safe-area-inset-bottom, 0px));z-index:95;box-shadow:0 -4px 20px rgba(0,0,0,0.18);transform:translateY(110%);transition:transform 0.35s cubic-bezier(0.32,0.72,0,1);}';
  c += '.mobile-bottom-nav.visible{transform:translateY(0);}';
  c += '@media(min-width:640px){.mobile-bottom-nav{display:none;}}';
  c += '.mbn-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:8px 4px calc(4px + env(safe-area-inset-bottom, 0px));background:transparent;border:none;color:var(--text-soft);cursor:pointer;font-size:10.5px;font-weight:600;letter-spacing:0.2px;position:relative;transition:all 0.2s;-webkit-tap-highlight-color:transparent;border-radius:10px;min-height:54px;overflow:visible;}';
  c += '.mbn-item.active{color:var(--accent);}';
  c += '.mbn-item:active{transform:scale(0.92);}';
  c += '.mbn-icon-wrap{position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;}';
  c += '.mbn-icon{width:22px;height:22px;display:flex;align-items:center;justify-content:center;}';
  c += '.mbn-icon svg{width:22px;height:22px;}';
  // Badge count (item count) — small circle on top-right of icon
  c += '.mbn-badge{position:absolute;top:-4px;right:-8px;min-width:16px;height:16px;border-radius:8px;background:var(--accent);color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 4px;box-shadow:0 2px 6px rgba(var(--accent-rgb),0.5);z-index:2;}';
  // Cart total pill — displayed ABOVE the icon, full price visible (no truncation)
  c += '.mbn-cart-total{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;font-size:10px;font-weight:800;padding:3px 8px;border-radius:10px;white-space:nowrap;box-shadow:0 3px 8px rgba(var(--accent-rgb),0.5);z-index:2;max-width:90px;overflow:hidden;text-overflow:ellipsis;}';
  c += '.mbn-cart-total:empty{display:none;}';
  // Add bottom padding so content isn't hidden behind bottom nav (mobile only)
  // FIX: usar #app (id) no .app (class) — el div es <div id="app">
  // 110px = nav height (~66px) + safe-area + extra breathing room
  c += '@media(max-width:639px){#app{padding-bottom:calc(110px + env(safe-area-inset-bottom, 0px));}.menu-footer{padding-bottom:calc(20px + env(safe-area-inset-bottom, 0px));}}';
  // Hide bottom nav when modal/lightbox/cart-modal is open (UX: el usuario está en un sub-flujo)
  // Triggers: .dish-lightbox.visible, .modal-overlay.visible (cart modal)
  c += '@media(max-width:639px){.mobile-bottom-nav{transition:transform 0.3s cubic-bezier(0.32,0.72,0,1),opacity 0.25s;}body:has(.dish-lightbox.visible) .mobile-bottom-nav,body:has(.modal-overlay.visible) .mobile-bottom-nav{transform:translateY(110%);opacity:0;pointer-events:none;}}';
  // Floating "scroll to top" button — mobile only, aparece tras 600px scroll
  // Posicionado arriba de la bottom-nav (bottom:84px) para no pisar el nav
  c += '.scroll-top-btn{position:fixed;right:16px;bottom:calc(84px + env(safe-area-inset-bottom, 0px));width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.85));color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(var(--accent-rgb),0.4),0 2px 8px rgba(0,0,0,0.25);z-index:94;opacity:0;transform:translateY(20px) scale(0.85);pointer-events:none;transition:all 0.3s cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;}';
  c += '.scroll-top-btn svg{width:20px;height:20px;}';
  c += '.scroll-top-btn.visible{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}';
  c += '.scroll-top-btn:active{transform:scale(0.9);}';
  c += '@media(min-width:640px){.scroll-top-btn{display:none;}}';
  // Theme toggle button — visible siempre (mobile + desktop), top-right abajo del .nav sticky
  // Diseño glassmorphism que combina con el nav. Muestra sol o luna según tema actual.
  c += '.theme-toggle-btn{position:fixed;top:calc(12px + 56px);right:14px;width:40px;height:40px;border-radius:50%;background:var(--glass-strong);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--border-strong);color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:99;box-shadow:0 4px 14px rgba(0,0,0,0.18);transition:all 0.25s cubic-bezier(0.32,0.72,0,1);-webkit-tap-highlight-color:transparent;opacity:0.9;}';
  c += '@media(hover:hover){.theme-toggle-btn:hover{transform:scale(1.08);opacity:1;background:var(--accent);color:#fff;border-color:var(--accent);}}';
  c += '.theme-toggle-btn:active{transform:scale(0.92);}';
  c += '.theme-toggle-btn svg{width:18px;height:18px;}';
  // Mostrar solo el icono del tema OPUESTO al actual (indicar a qué va a cambiar)
  // Por defecto (sin data-theme), el tema es el del dueño → mostrar icono del opuesto
  c += '.theme-toggle-icon-sun{display:none;}';
  c += '.theme-toggle-icon-moon{display:block;}';
  // Si el tema activo es dark → mostrar sol (para cambiar a light)
  c += ':root[data-theme="dark"] .theme-toggle-icon-sun{display:block;}';
  c += ':root[data-theme="dark"] .theme-toggle-icon-moon{display:none;}';
  // Si el tema activo es light → mostrar luna (para cambiar a dark)
  c += ':root[data-theme="light"] .theme-toggle-icon-sun{display:none;}';
  c += ':root[data-theme="light"] .theme-toggle-icon-moon{display:block;}';
  // Si el tema por defecto del dueño ES dark, mostrar sol por defecto
  if (darkMode) {
    c += ':root:not([data-theme]) .theme-toggle-icon-sun{display:block;}';
    c += ':root:not([data-theme]) .theme-toggle-icon-moon{display:none;}';
  }
  // En mobile, mover el botón para no chocar con scroll-top-btn (right:14px ya está ok, son verticales)

  // ─── MODO CARTA (PedidosYa/Rappi horizontal carousel) ───
  // Solo se activa cuando THEME.cartaStyle=true.
  // Estructura:
  //   .carta-destacados (sección sticky destacados)
  //     .carta-section-title (titulo "Destacados")
  //     .carta-track (horizontal scroll, snap-x mandatory)
  //       .carta-card (imagen grande + nombre + precio)
  //   .carta-category (cada categoría)
  //     .carta-section-title
  //     .carta-track (horizontal scroll, snap-x mandatory)
  //       .carta-card
  if (cartaStyle || cartaListStyle) {
    // Layout contenedor del modo Carta: padding inferior para no chocar con bottom nav
    c += '.carta-wrapper{padding:8px 0 24px;}';
    // Título de sección (estilo PedidosYa: bold + accent left-bar)
    c += '.carta-section-title{font-size:18px;font-weight:700;margin:18px 16px 12px;display:flex;align-items:center;gap:10px;letter-spacing:-0.3px;}';
    c += '.carta-section-title::before{content:"";width:4px;height:20px;background:linear-gradient(180deg,var(--accent),var(--gold));border-radius:2px;}';
    c += '.carta-section-title .cat-count{font-size:12px;color:var(--text-muted);font-weight:500;}';
    // Track horizontal con scroll-snap
    c += '.carta-track{display:flex;gap:12px;padding:4px 16px 12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;scroll-behavior:smooth;}';
    c += '.carta-track::-webkit-scrollbar{display:none;}';
    c += '.carta-track.paused{scroll-behavior:auto;}';
    // Cada card del carrusel (aspect 1/1, snap-start)
    c += '.carta-card{flex:0 0 160px;scroll-snap-align:start;background:var(--bg-1);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;cursor:pointer;position:relative;transition:transform 0.25s,border-color 0.25s;opacity:0;transform:translateY(15px);}';
    c += '.carta-card.revealed{opacity:1;transform:translateY(0);}';
    c += '@media(min-width:480px){.carta-card{flex:0 0 180px;}}';
    c += '@media(min-width:640px){.carta-card{flex:0 0 200px;}}';
    c += '@media(hover:hover){.carta-card:hover{transform:translateY(-3px);border-color:rgba(var(--accent-rgb),0.4);box-shadow:0 10px 24px rgba(0,0,0,0.16);}}';
    // Imagen del card (cuadrada, 1/1 aspect)
    c += '.carta-card-img-wrap{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;background:linear-gradient(135deg,var(--glass),var(--glass-strong));}';
    c += '.carta-card-img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.5s cubic-bezier(0.2,0,0.2,1);}';
    c += '@media(hover:hover){.carta-card:hover .carta-card-img{transform:scale(1.07);}}';
    c += '.carta-card-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.55));color:#fff;font-size:46px;font-weight:900;letter-spacing:-2px;}';
    // Precio overlay (top-right, fondo translúcido accent)
    c += '.carta-card-price-overlay{position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;padding:4px 8px;border-radius:10px;font-size:11px;font-weight:700;}';
    // Add btn overlay (bottom-right de la imagen)
    c += '.carta-card-add{position:absolute;bottom:8px;right:8px;width:36px;height:36px;border-radius:50%;background:var(--accent);color:#fff;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(var(--accent-rgb),0.4);transition:transform 0.2s;}';
    c += '.carta-card-add:active{transform:scale(0.92);}';
    c += '.carta-card-add svg{width:16px;height:16px;}';
    // Info debajo de la imagen (nombre + descripción pequeña)
    c += '.carta-card-info{padding:10px 12px 12px;}';
    c += '.carta-card-name{font-size:14px;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:36px;}';
    c += '.carta-card-desc{font-size:11px;color:var(--text-muted);line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}';
    // Featured badge (top-left del card destacado)
    c += '.carta-card-featured{position:absolute;top:8px;left:8px;background:linear-gradient(135deg,var(--gold),#b8860b);color:#1a1a1a;padding:3px 8px;border-radius:8px;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;}';
    // Pausa indicator (cuando auto-scroll está pausado por interacción)
    c += '.carta-pause-indicator{position:absolute;top:8px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);color:#fff;padding:4px 12px;border-radius:12px;font-size:11px;font-weight:600;opacity:0;transition:opacity 0.3s;pointer-events:none;z-index:5;}';
    c += '.carta-track.paused + .carta-pause-indicator{opacity:1;}';
  }

  // ─── MODO LISTA Rappi (texto izquierda, imagen pequeña derecha) ───
  if (cartaListStyle) {
    c += '.rappi-list{display:flex;flex-direction:column;gap:12px;padding:8px 16px;}';
    c += '.rappi-item{display:flex;gap:12px;background:var(--bg-1);border:1px solid var(--border);border-radius:var(--radius);padding:12px;cursor:pointer;position:relative;transition:transform 0.2s,border-color 0.2s;opacity:0;transform:translateY(10px);}';
    c += '.rappi-item.revealed{opacity:1;transform:translateY(0);}';
    c += '@media(hover:hover){.rappi-item:hover{border-color:rgba(var(--accent-rgb),0.35);}}';
    c += '.rappi-item:active{transform:scale(0.997);}';
    // Info izquierda (flex:1)
    c += '.rappi-item-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;}';
    c += '.rappi-item-name{font-size:15px;font-weight:600;color:var(--text);line-height:1.3;}';
    c += '.rappi-item-desc{font-size:12px;color:var(--text-muted);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}';
    c += '.rappi-item-price{font-size:15px;font-weight:700;color:var(--accent-text);margin-top:auto;}';
    // Imagen derecha (cuadrada 88px)
    c += '.rappi-item-img-wrap{position:relative;flex:0 0 88px;width:88px;height:88px;border-radius:var(--radius-sm);overflow:hidden;background:linear-gradient(135deg,var(--glass),var(--glass-strong));}';
    c += '.rappi-item-img{width:100%;height:100%;object-fit:cover;display:block;}';
    c += '.rappi-item-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--accent),rgba(var(--accent-rgb),0.55));color:#fff;font-size:32px;font-weight:900;}';
    // Add btn overlay (bottom-right de la imagen)
    c += '.rappi-item-add{position:absolute;bottom:-6px;right:-6px;width:32px;height:32px;border-radius:50%;background:var(--accent);color:#fff;border:2px solid var(--bg-1);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 10px rgba(var(--accent-rgb),0.4);transition:transform 0.2s;}';
    c += '.rappi-item-add:active{transform:scale(0.92);}';
    c += '.rappi-item-add svg{width:14px;height:14px;}';
  }

  return c;
}

interface JSOpts {
  layout: 'single' | 'double' | 'grid';
  imageSize: 'none' | 'small' | 'medium' | 'large' | 'hero';
  cardStyle: 'compact' | 'expanded' | 'minimal';
  showSearch: boolean;
  showGallery: boolean;
  isPreview?: boolean;
  darkMode?: boolean;
  cartaStyle?: boolean;
  cartaListStyle?: boolean;
  cartaAutoscroll?: boolean;
  cartaScrollSpeed?: number;
}

function buildJS(opts: JSOpts): string {
  const { showSearch, showGallery } = opts;
  const isPreview = opts.isPreview === true;
  const darkMode = opts.darkMode !== false; // default true
  const cartaStyle = opts.cartaStyle === true;
  const cartaListStyle = opts.cartaListStyle === true;
  const cartaAutoscroll = opts.cartaAutoscroll === true;
  const cartaScrollSpeed = opts.cartaScrollSpeed || 30;
  let s = '';
  s += 'var cart = [];\n';
  s += 'var searchQuery = "";\n';
  s += 'function escapeHtml(s){if(s==null)return "";return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\'/g,"&#39;");}\n';
  s += 'function formatPrice(n){return (RESTAURANT.currency||"S/")+" "+Number(n).toFixed(2);}\n';
  // Helper: si la URL es de una imagen optimizada por MenuPro (tiene sufijo "-large-wNNNN.webp"),
  // genera un atributo srcset con 3 tamaños (thumb 400w, medium 800w, large 1200w) para que el
  // navegador cargue el tamaño óptimo según el viewport. Si la URL no sigue el patrón (imagen
  // externa o subida antes de la optimización), devuelve string vacío (sin srcset).
  s += 'function imgSrcset(url){if(!url)return "";var m=String(url).match(/^(.*?)-(thumb|medium|large)-w\\d+\\.(webp|avif)$/);if(!m)return "";var base=m[1],ext=m[3];return base+"-thumb-w400."+ext+" 400w, "+base+"-medium-w800."+ext+" 800w, "+base+"-large-w1200."+ext+" 1200w";}\n';
  // Helper: si la URL es optimizada, deriva la versión "medium" (800w) para usar como src por defecto.
  // Es un balance óptimo para móvil (~50KB) y desktop (~120KB). El navegador puede subir al large vía srcset.
  s += 'function imgMedium(url){if(!url)return url;var m=String(url).match(/^(.*?)-(thumb|medium|large)-w\\d+\\.(webp|avif)$/);if(!m)return url;return m[1]+"-medium-w800."+m[3];}\n';
  s += 'function dishMatches(dish,q){if(!q)return true;var n=(dish.name||"").toLowerCase();var d=(dish.description||"").toLowerCase();return n.indexOf(q)>=0||d.indexOf(q)>=0;}\n';

  // SVG icons inline para redes sociales (premium, sin dependencias)
  s += 'function svgIcon(name){var icons={' + "\n";
  s += 'facebook:"<svg viewBox=\\"0 0 24 24\\" fill=\\"currentColor\\"><path d=\\"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z\\"/></svg>",' + "\n";
  s += 'instagram:"<svg viewBox=\\"0 0 24 24\\" fill=\\"currentColor\\"><path d=\\"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z\\"/></svg>",' + "\n";
  s += 'whatsapp:"<svg viewBox=\\"0 0 24 24\\" fill=\\"currentColor\\"><path d=\\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z\\"/></svg>",' + "\n";
  s += 'tiktok:"<svg viewBox=\\"0 0 24 24\\" fill=\\"currentColor\\"><path d=\\"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z\\"/></svg>",' + "\n";
  s += 'twitter:"<svg viewBox=\\"0 0 24 24\\" fill=\\"currentColor\\"><path d=\\"M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z\\"/></svg>",' + "\n";
  s += 'youtube:"<svg viewBox=\\"0 0 24 24\\" fill=\\"currentColor\\"><path d=\\"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z\\"/></svg>",' + "\n";
  s += 'web:"<svg viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/><path d=\\"M2 12h20\\"/><path d=\\"M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z\\"/></svg>"' + "\n";
  s += '};return icons[name]||"";}\n';

  // Normalizar URL de red social
  s += 'function normalizeSocialUrl(value, type){if(!value)return "";var v=String(value).trim();if(!v)return "";if(v.indexOf("http")!==0){if(type==="instagram")return "https://instagram.com/"+v.replace(/^@/,"");if(type==="facebook")return "https://facebook.com/"+v;if(type==="tiktok")return "https://tiktok.com/@"+v.replace(/^@/,"");if(type==="twitter")return "https://x.com/"+v.replace(/^@/,"");if(type==="youtube")return "https://youtube.com/@"+v.replace(/^@/,"");if(type==="whatsapp")return "https://wa.me/"+v.replace(/\\D/g,"");}return v;}\n';

  s += 'function renderApp(){\n';
  s += '  var app=document.getElementById("app");\n';
  s += '  var html="";\n';
  // Cover image — fondo HERO detrás del header (con srcset si la URL está optimizada)
  s += '  if(RESTAURANT.theme_cover_url){var _csrc=imgMedium(RESTAURANT.theme_cover_url),_css=imgSrcset(RESTAURANT.theme_cover_url);html+="<div class=\\"hero\\"><img src=\\""+escapeHtml(_csrc)+"\\" "+(_css?"srcset=\\""+escapeHtml(_css)+"\\" sizes=\\"100vw\\" ":"")+"alt=\\"cover\\" onerror=\\"this.remove()\\"/></div>";}\n';
  // Header
  s += '  html+="<header class=\\"header\\">";\n';
  s += '  html+="<div class=\\"logo-wrap\\">";\n';
  s += '  html+="<div class=\\"logo-placeholder\\">"+escapeHtml(RESTAURANT.name.charAt(0).toUpperCase())+"</div>";\n';
  s += '  if(RESTAURANT.logo_url){html+="<img src=\\""+escapeHtml(RESTAURANT.logo_url)+"\\" class=\\"logo\\" alt=\\"logo\\" onerror=\\"this.remove()\\"/>";}\n';
  s += '  html+="</div>";\n';
  s += '  html+="<h1 class=\\"restaurant-name\\">"+escapeHtml(RESTAURANT.name)+"</h1>";\n';
  s += '  if(RESTAURANT.slogan){html+="<div class=\\"slogan\\">"+escapeHtml(RESTAURANT.slogan)+"</div>";}\n';
  s += '  if(RESTAURANT.description){html+="<p class=\\"restaurant-desc\\">"+escapeHtml(RESTAURANT.description)+"</p>";}\n';
  s += '  html+="<span class=\\"open-badge\\">Abierto ahora</span>";\n';
  // Redes sociales
  s += '  var socials=[];\n';
  s += '  if(RESTAURANT.social_facebook)socials.push({type:"facebook",value:RESTAURANT.social_facebook});\n';
  s += '  if(RESTAURANT.social_instagram)socials.push({type:"instagram",value:RESTAURANT.social_instagram});\n';
  s += '  if(RESTAURANT.social_whatsapp)socials.push({type:"whatsapp",value:RESTAURANT.social_whatsapp});else if(RESTAURANT.whatsapp)socials.push({type:"whatsapp",value:RESTAURANT.whatsapp});\n';
  s += '  if(RESTAURANT.social_tiktok)socials.push({type:"tiktok",value:RESTAURANT.social_tiktok});\n';
  s += '  if(RESTAURANT.social_twitter)socials.push({type:"twitter",value:RESTAURANT.social_twitter});\n';
  s += '  if(RESTAURANT.social_youtube)socials.push({type:"youtube",value:RESTAURANT.social_youtube});\n';
  s += '  if(RESTAURANT.social_web)socials.push({type:"web",value:RESTAURANT.social_web});\n';
  s += '  if(socials.length>0){\n';
  s += '    html+="<div class=\\"socials\\">";\n';
  s += '    socials.forEach(function(s){var url=normalizeSocialUrl(s.value,s.type);html+="<a class=\\"social-link\\" href=\\""+escapeHtml(url)+"\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\" aria-label=\\""+escapeHtml(s.type)+"\\">"+svgIcon(s.type)+"</a>";});\n';
  s += '    html+="</div>";\n';
  s += '  }\n';
  s += '  html+="</header>";\n';
  // Search bar (opcional)
  if (showSearch) {
    s += '  html+="<div class=\\"search-wrap\\"><svg class=\\"search-icon\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\"><circle cx=\\"11\\" cy=\\"11\\" r=\\"8\\"/><path d=\\"m21 21-4.3-4.3\\"/></svg><input type=\\"text\\" class=\\"search-input\\" id=\\"searchInput\\" placeholder=\\"Buscar plato...\\"/></div>";\n';
  }
  // Nav
  s += '  html+="<nav class=\\"nav\\"><div class=\\"nav-inner\\" id=\\"navInner\\">";\n';
  s += '  RESTAURANT.categories.forEach(function(cat,i){\n';
  s += '    var icon=THEME.showSearch? getCategoryIcon(cat.name):"";\n';
  s += '    html+="<div class=\\"nav-item"+(i===0?" active":"")+"\\" data-idx=\\""+i+"\\">"+(icon?"<span class=\\"nav-item-icon\\">"+icon+"</span>":"")+escapeHtml(cat.name)+"</div>";\n';
  s += '  });\n';
  s += '  html+="</div></nav>";\n';
  // ─── MODO CARTA (PedidosYa/Rappi horizontal carousel) ───
  // Si THEME.cartaStyle=true: secciones con scroll horizontal (Destacados + cada categoría)
  // Si THEME.cartaListStyle=true: lista estilo Rappi (texto izq, imagen pequeña der)
  // Si ambos false: layout original (grid de cards verticales)
  if (cartaStyle || cartaListStyle) {
    // Iniciar wrapper del modo Carta
    s += '  html+="<div class=\\"carta-wrapper\\">";\n';
    // Construir "Destacados": tomar hasta 10 platos (con o sin imagen) de todas las categorías
    if (cartaStyle) {
      s += '  var destacados=[];\n';
      s += '  RESTAURANT.categories.forEach(function(cat,ci){(cat.dishes||[]).forEach(function(dish,di){if(destacados.length<10){destacados.push({catIdx:ci,dishIdx:di,dishObj:dish,catName:cat.name});}});});\n';
      s += '  if(destacados.length>0){\n';
      s += '    html+="<section class=\\"carta-destacados\\" id=\\"cat-destacados\\">";\n';
      s += '    html+="<h2 class=\\"carta-section-title\\">⭐ Destacados <span class=\\"cat-count\\">"+destacados.length+" platos</span></h2>";\n';
      s += '    html+="<div class=\\"carta-track\\" id=\\"destacadosTrack\\">";\n';
      s += '    destacados.forEach(function(it,idx){\n';
      s += '      var d=it.dishObj;var letter=(d.name||"P").charAt(0).toUpperCase();\n';
      s += '      html+="<div class=\\"carta-card\\" data-cat=\\""+it.catIdx+"\\" data-dish=\\""+it.dishIdx+"\\" data-name=\\""+escapeHtml((d.name||"").toLowerCase())+"\\" data-desc=\\""+escapeHtml((d.description||"").toLowerCase())+"\\" style=\\"transition-delay:"+(idx*40)+"ms\\">";\n';
      s += '      html+="<div class=\\"carta-card-img-wrap\\">";\n';
      s += '      if(idx<3){html+="<span class=\\"carta-card-featured\\">Top</span>";}\n';
      s += '      html+="<span class=\\"carta-card-price-overlay\\">"+formatPrice(d.price)+"</span>";\n';
      s += '      if(d.image_url){var _src=imgMedium(d.image_url),_ss=imgSrcset(d.image_url);html+="<img src=\\""+escapeHtml(_src)+"\\" "+(_ss?"srcset=\\""+escapeHtml(_ss)+"\\" sizes=\\"(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 300px\\" ":"")+"class=\\"carta-card-img\\" alt=\\""+escapeHtml(d.name||"Plato")+"\\" data-letter=\\""+escapeHtml(letter)+"\\" loading=\\"lazy\\" decoding=\\"async\\"/>";}\n';
      s += '      else{html+="<div class=\\"carta-card-placeholder\\">"+escapeHtml(letter)+"</div>";}\n';
      s += '      html+="<button class=\\"carta-card-add\\" data-cat=\\""+it.catIdx+"\\" data-dish=\\""+it.dishIdx+"\\" title=\\"Agregar\\"><svg viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"3\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M12 5v14M5 12h14\\"/></svg></button>";\n';
      s += '      html+="</div>";\n';
      s += '      html+="<div class=\\"carta-card-info\\"><div class=\\"carta-card-name\\">"+escapeHtml(d.name||"Plato")+"</div>";\n';
      s += '      if(d.description){html+="<div class=\\"carta-card-desc\\">"+escapeHtml(d.description)+"</div>";}\n';
      s += '      html+="</div></div>";\n';
      s += '    });\n';
      s += '    html+="</section>";\n';
      s += '  }\n';
    }
    // Cada categoría como carrusel horizontal (solo si cartaStyle) o lista Rappi (si cartaListStyle)
    s += '  RESTAURANT.categories.forEach(function(cat,i){\n';
    s += '    var catDishes=cat.dishes||[];\n';
    s += '    if(catDishes.length===0)return;\n';
    s += '    html+="<section class=\\"carta-category\\" id=\\"cat-"+i+"\\">";\n';
    s += '    html+="<h2 class=\\"carta-section-title\\">"+escapeHtml(cat.name)+" <span class=\\"cat-count\\">"+catDishes.length+" platos</span></h2>";\n';
    if (cartaStyle) {
      // Carrusel horizontal
      s += '    html+="<div class=\\"carta-track\\" id=\\"track-"+i+"\\">";\n';
      s += '    catDishes.forEach(function(dish,j){\n';
      s += '      var letter=(dish.name||"P").charAt(0).toUpperCase();\n';
      s += '      html+="<div class=\\"carta-card\\" data-cat=\\""+i+"\\" data-dish=\\""+j+"\\" data-name=\\""+escapeHtml((dish.name||"").toLowerCase())+"\\" data-desc=\\""+escapeHtml((dish.description||"").toLowerCase())+"\\" style=\\"transition-delay:"+(j*40)+"ms\\">";\n';
      s += '      html+="<div class=\\"carta-card-img-wrap\\">";\n';
      s += '      html+="<span class=\\"carta-card-price-overlay\\">"+formatPrice(dish.price)+"</span>";\n';
      s += '      if(dish.image_url){var _src=imgMedium(dish.image_url),_ss=imgSrcset(dish.image_url);html+="<img src=\\""+escapeHtml(_src)+"\\" "+(_ss?"srcset=\\""+escapeHtml(_ss)+"\\" sizes=\\"(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 300px\\" ":"")+"class=\\"carta-card-img\\" alt=\\""+escapeHtml(dish.name||"Plato")+"\\" data-letter=\\""+escapeHtml(letter)+"\\" loading=\\"lazy\\" decoding=\\"async\\"/>";}\n';
      s += '      else{html+="<div class=\\"carta-card-placeholder\\">"+escapeHtml(letter)+"</div>";}\n';
      s += '      html+="<button class=\\"carta-card-add\\" data-cat=\\""+i+"\\" data-dish=\\""+j+"\\" title=\\"Agregar\\"><svg viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"3\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M12 5v14M5 12h14\\"/></svg></button>";\n';
      s += '      html+="</div>";\n';
      s += '      html+="<div class=\\"carta-card-info\\"><div class=\\"carta-card-name\\">"+escapeHtml(dish.name||"Plato")+"</div>";\n';
      s += '      if(dish.description){html+="<div class=\\"carta-card-desc\\">"+escapeHtml(dish.description)+"</div>";}\n';
      s += '      html+="</div></div>";\n';
      s += '    });\n';
      s += '    html+="</div>";\n';
    } else {
      // Lista Rappi (texto izq, imagen pequeña der)
      s += '    html+="<div class=\\"rappi-list\\">";\n';
      s += '    catDishes.forEach(function(dish,j){\n';
      s += '      var letter=(dish.name||"P").charAt(0).toUpperCase();\n';
      s += '      html+="<div class=\\"rappi-item\\" data-cat=\\""+i+"\\" data-dish=\\""+j+"\\" data-name=\\""+escapeHtml((dish.name||"").toLowerCase())+"\\" data-desc=\\""+escapeHtml((dish.description||"").toLowerCase())+"\\" style=\\"transition-delay:"+(j*40)+"ms\\">";\n';
      s += '      html+="<div class=\\"rappi-item-info\\"><div class=\\"rappi-item-name\\">"+escapeHtml(dish.name||"Plato")+"</div>";\n';
      s += '      if(dish.description){html+="<div class=\\"rappi-item-desc\\">"+escapeHtml(dish.description)+"</div>";}\n';
      s += '      else{html+="<div class=\\"rappi-item-desc\\">Delicioso plato preparado con ingredientes frescos.</div>";}\n';
      s += '      html+="<div class=\\"rappi-item-price\\">"+formatPrice(dish.price)+"</div></div>";\n';
      s += '      html+="<div class=\\"rappi-item-img-wrap\\">";\n';
      s += '      if(dish.image_url){var _src=imgMedium(dish.image_url),_ss=imgSrcset(dish.image_url);html+="<img src=\\""+escapeHtml(_src)+"\\" "+(_ss?"srcset=\\""+escapeHtml(_ss)+"\\" sizes=\\"(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 300px\\" ":"")+"class=\\"rappi-item-img\\" alt=\\""+escapeHtml(dish.name||"Plato")+"\\" data-letter=\\""+escapeHtml(letter)+"\\" loading=\\"lazy\\" decoding=\\"async\\"/>";}\n';
      s += '      else{html+="<div class=\\"rappi-item-placeholder\\">"+escapeHtml(letter)+"</div>";}\n';
      s += '      html+="<button class=\\"rappi-item-add\\" data-cat=\\""+i+"\\" data-dish=\\""+j+"\\" title=\\"Agregar\\"><svg viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"3\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M12 5v14M5 12h14\\"/></svg></button>";\n';
      s += '      html+="</div></div>";\n';
      s += '    });\n';
      s += '    html+="</div>";\n';
    }
    s += '    html+="</section>";\n';
    s += '  });\n';
    s += '  html+="</div>";\n'; // close carta-wrapper
  } else {
    // Layout original: sections con dishes-grid (PedidosYa vertical cards)
    s += '  RESTAURANT.categories.forEach(function(cat,i){\n';
    s += '    html+="<section class=\\"section ' + (opts.layout === 'single' ? 'single-layout' : 'two-layout') + '\\" id=\\"cat-"+i+"\\">";\n';
    s += '    html+="<h2 class=\\"section-title\\">"+escapeHtml(cat.name)+"</h2>";\n';
    s += '    html+="<div class=\\"dishes-grid\\">";\n';
    s += '    cat.dishes.forEach(function(dish,j){\n';
    s += '      html+="<div class=\\"dish\\" data-cat=\\""+i+"\\" data-dish=\\""+j+"\\" data-name=\\""+escapeHtml((dish.name||"").toLowerCase())+"\\" data-desc=\\""+escapeHtml((dish.description||"").toLowerCase())+"\\" style=\\"transition-delay:"+(j*40)+"ms\\">";\n';
    s += '      if(THEME.imageSize!=="none"){\n';
    s += '        html+="<div class=\\"dish-img-wrap\\">";\n';
    s += '        html+="<span class=\\"dish-cat-badge\\">"+escapeHtml(cat.name||"Plato")+"</span>";\n';
    s += '        if(dish.image_url){var _src=imgMedium(dish.image_url),_ss=imgSrcset(dish.image_url);html+="<img src=\\""+escapeHtml(_src)+"\\" "+(_ss?"srcset=\\""+escapeHtml(_ss)+"\\" sizes=\\"(max-width: 600px) 90vw, (max-width: 1024px) 45vw, 400px\\" ":"")+"class=\\"dish-img\\" alt=\\""+escapeHtml(dish.name||"Plato")+"\\" data-letter=\\""+escapeHtml((dish.name||"P").charAt(0).toUpperCase())+"\\" loading=\\"lazy\\" decoding=\\"async\\"/>";}\n';
    s += '        else{html+="<div class=\\"dish-img-placeholder\\">"+escapeHtml((dish.name||"P").charAt(0).toUpperCase())+"</div>";}\n';
    s += '        html+="</div>";\n';
    s += '      }\n';
    s += '      html+="<div class=\\"dish-info\\">";\n';
    s += '      html+="<div class=\\"dish-name\\">"+escapeHtml(dish.name||"Plato")+"</div>";\n';
    s += '      if(dish.description){html+="<div class=\\"dish-desc\\">"+escapeHtml(dish.description)+"</div>";}\n';
    s += '      else{html+="<div class=\\"dish-desc\\">Delicioso plato preparado con ingredientes frescos.</div>";}\n';
    s += '      html+="<div class=\\"dish-bottom\\">";\n';
    s += '      html+="<div class=\\"dish-price\\">"+formatPrice(dish.price)+"</div>";\n';
    s += '      html+="<button class=\\"add-btn\\" data-cat=\\""+i+"\\" data-dish=\\""+j+"\\" title=\\"Agregar\\"><svg width=\\"14\\" height=\\"14\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"3\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M12 5v14M5 12h14\\"/></svg>Agregar</button>";\n';
    s += '      html+="</div></div></div>";\n';
    s += '    });\n';
    s += '    html+="</div></section>";\n';
    s += '  });\n';
  }
  // Footer
  s += '  html+="<div class=\\"menu-footer\\"><span>"+escapeHtml(RESTAURANT.name)+"</span>";\n';
  s += '  if(SHOW_BRANDING){html+=" · <a href=\\"https://menudigital-pro.vercel.app/\\" target=\\"_blank\\" rel=\\"noopener\\" style=\\"color:inherit;text-decoration:underline;\\" title=\\"Crea tu menú digital con MenuPro\\">"+escapeHtml(BRANDING_TEXT||"Creado con MenuPro")+"</a>";}\n';
  s += '  html+="</div>";\n';
  // Cart
  s += '  html+="<div class=\\"cart\\" id=\\"cartBar\\">";\n';
  s += '  html+="<div class=\\"cart-left\\"><span>Ver pedido</span><span class=\\"cart-count\\" id=\\"cartCount\\">0</span></div>";\n';
  s += '  html+="<div class=\\"cart-total\\" id=\\"cartTotal\\">"+formatPrice(0)+"</div>";\n';
  s += '  html+="</div>";\n';
  // Modal
  s += '  html+="<div class=\\"modal-overlay\\" id=\\"modal\\"><div class=\\"modal\\">";\n';
  s += '  html+="<h2 class=\\"modal-title\\">Tu Pedido</h2>";\n';
  s += '  html+="<p class=\\"modal-subtitle\\">Revisa tu orden antes de enviar por WhatsApp</p>";\n';
  s += '  html+="<div class=\\"modal-divider\\"></div>";\n';
  s += '  html+="<div id=\\"cartItems\\"></div>";\n';
  s += '  html+="<div class=\\"cart-summary\\" id=\\"cartSummary\\"></div>";\n';
  s += '  html+="<button class=\\"wa-btn\\" id=\\"waBtn\\"><svg class=\\"wa-icon\\" viewBox=\\"0 0 24 24\\"><path d=\\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z\\"/></svg>Enviar Pedido por WhatsApp</button>";\n';
  s += '  html+="<button class=\\"close-btn\\" id=\\"closeBtn\\">Seguir agregando</button>";\n';
  s += '  html+="</div></div>";\n';
  // Lightbox contenedor (vacío, se rellena al hacer clic)
  if (showGallery) {
    s += '  html+="<div class=\\"dish-lightbox\\" id=\\"dishLightbox\\"></div>";\n';
  }
  s += '  app.innerHTML=html;\n';
  s += '  attachEvents();\n';
  s += '  setupReveal();\n';
  s += '  setupMobileBottomNav();\n';
  s += '  loadFavorites();\n';
  s += '  updateFavBadge();\n';
  s += '  showMobileNavOnMobile();\n';
  s += '  if(typeof restoreDishFromURL==="function"){restoreDishFromURL();}\n';

  // Helper getCategoryIcon
  s += 'function getCategoryIcon(name){var n=(name||"").toLowerCase();if(n.indexOf("entr")>=0||n.indexOf("aperit")>=0)return "🥗";if(n.indexOf("sopa")>=0||n.indexOf("caldo")>=0)return "🍜";if(n.indexOf("pasta")>=0)return "🍝";if(n.indexOf("parrilla")>=0||n.indexOf("grill")>=0||n.indexOf("carne")>=0)return "🥩";if(n.indexOf("pollo")>=0)return "🍗";if(n.indexOf("pesca")>=0||n.indexOf("maris")>=0)return "🐟";if(n.indexOf("postre")>=0)return "🍰";if(n.indexOf("bebida")>=0||n.indexOf("drink")>=0)return "🥤";if(n.indexOf("trago")>=0||n.indexOf("cocktail")>=0||n.indexOf("bar")>=0)return "🍸";if(n.indexOf("desay")>=0)return "🍳";if(n.indexOf("pizza")>=0)return "🍕";if(n.indexOf("burger")>=0||n.indexOf("hambur")>=0)return "🍔";if(n.indexOf("ensal")>=0)return "🥗";if(n.indexOf("sushi")>=0)return "🍣";if(n.indexOf("taco")>=0||n.indexOf("mexic")>=0)return "🌮";if(n.indexOf(" asia")>=0||n.indexOf("chino")>=0||n.indexOf("wok")>=0)return "🥡";if(n.indexOf("vegan")>=0||n.indexOf("veggie")>=0)return "🌱";if(n.indexOf("cafe")>=0||n.indexOf("coffee")>=0)return "☕";return "🍴";}\n';

  // searchInput event listener (si showSearch)
  if (showSearch) {
    s += 'var searchInput=document.getElementById("searchInput");\n';
    s += 'if(searchInput){searchInput.addEventListener("input",function(e){searchQuery=e.target.value.toLowerCase();filterDishes();});}\n';
    s += 'function filterDishes(){var dishes=document.querySelectorAll(".dish, .carta-card, .rappi-item");var anyVisible=false;dishes.forEach(function(d){var n=d.getAttribute("data-name")||"";var desc=d.getAttribute("data-desc")||"";var visible=n.indexOf(searchQuery)>=0||desc.indexOf(searchQuery)>=0;d.style.display=visible?"":"none";if(visible)anyVisible=true;});document.querySelectorAll(".no-results").forEach(function(n){n.remove();});if(!anyVisible&&searchQuery){var sections=document.querySelectorAll(".section, .carta-category");if(sections.length){var last=sections[sections.length-1];last.insertAdjacentHTML("afterend","<div class=\\"no-results\\">No se encontraron platos</div>");}}}\n';
  }

  s += '  updateCart();\n';
  s += '}\n';
  // ─── Auto-scroll del carrusel Destacados (solo si cartaStyle + cartaAutoscroll) ───
  // Implementación: requestAnimationFrame loop que hace scrollLeft += speed/60 cada frame.
  // Al llegar al final, rebota (cambia dirección).
  // Cuando el usuario interactúa (touchstart, mousedown, wheel):
  //   - pausa el auto-scroll durante 3s
  //   - tras 3s sin interacción, reanuda automáticamente
  //
  // IMPORTANTE: cuando auto-scroll está activo, desactivamos scroll-snap-type
  // porque el snap resetea scrollLeft al snap point más cercano y rompe el
  // movimiento suave del auto-scroll.
  if (cartaStyle && cartaAutoscroll) {
    // CSS runtime: cuando auto-scroll está activo, el track #destacadosTrack
    // no debe tener scroll-snap-type (se lo quitamos via clase .autoscroll-active)
    s += 'var __cartaAutoscrollActive=true;\n';
    s += 'function setupCartaAutoscroll(){\n';
    s += '  var track=document.getElementById("destacadosTrack");\n';
    s += '  if(!track)return;\n';
    s += '  // Desactivar scroll-snap para que el auto-scroll funcione suavemente\n';
    s += '  track.style.scrollSnapType="none";\n';
    s += '  var speed=' + cartaScrollSpeed + ';\n'; // px/seg
    s += '  var paused=false;\n';
    s += '  var pauseTimer=null;\n';
    s += '  var dir=1;\n'; // 1=right, -1=left (para bounce)
    s += '  var lastTs=0;\n';
    s += '  function tick(ts){\n';
    s += '    if(!paused){\n';
    s += '      if(!lastTs)lastTs=ts;\n';
    s += '      var dt=(ts-lastTs)/1000;lastTs=ts;\n';
    s += '      var delta=dir*speed*dt;\n';
    s += '      var maxScroll=track.scrollWidth-track.clientWidth;\n';
    s += '      if(maxScroll<=0){requestAnimationFrame(tick);return;}\n';
    s += '      var newLeft=track.scrollLeft+delta;\n';
    s += '      if(newLeft>=maxScroll){newLeft=maxScroll;dir=-1;}\n';
    s += '      if(newLeft<=0){newLeft=0;dir=1;}\n';
    s += '      track.scrollLeft=newLeft;\n';
    s += '    }else{lastTs=0;}\n';
    s += '    requestAnimationFrame(tick);\n';
    s += '  }\n';
    s += '  function pauseTemporarily(){\n';
    s += '    paused=true;\n';
    s += '    track.classList.add("paused");\n';
    s += '    if(pauseTimer)clearTimeout(pauseTimer);\n';
    s += '    pauseTimer=setTimeout(function(){paused=false;track.classList.remove("paused");},3000);\n';
    s += '  }\n';
    s += '  // Pausar en interacciones del usuario\n';
    s += '  track.addEventListener("touchstart",pauseTemporarily,{passive:true});\n';
    s += '  track.addEventListener("mousedown",pauseTemporarily);\n';
    s += '  track.addEventListener("wheel",pauseTemporarily,{passive:true});\n';
    s += '  // Pausar si el track no está visible (IntersectionObserver)\n';
    s += '  if("IntersectionObserver" in window){\n';
    s += '    var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(!e.isIntersecting){paused=true;}else{paused=false;lastTs=0;}});},{threshold:0.3});\n';
    s += '    io.observe(track);\n';
    s += '  }\n';
    s += '  // Iniciar\n';
    s += '  requestAnimationFrame(tick);\n';
    s += '}\n';
    // NOTA: setupCartaAutoscroll() se llama al final del script, después de renderApp(),
    // porque necesita que #destacadosTrack exista en el DOM.
  }
  // Reveal
  s += 'function setupReveal(){\n';
  s += '  var dishes=document.querySelectorAll(".dish, .carta-card, .rappi-item");\n';
  s += '  if(!("IntersectionObserver" in window)){dishes.forEach(function(d){d.classList.add("revealed");});return;}\n';
  s += '  var io=new IntersectionObserver(function(entries){\n';
  s += '    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add("revealed");io.unobserve(e.target);}});\n';
  s += '  },{threshold:0.05,rootMargin:"0px 0px -30px 0px"});\n';
  s += '  dishes.forEach(function(d){io.observe(d);});\n';
  s += '}\n';
  // Events
  s += 'function attachEvents(){\n';
  // Add buttons: incluyen .add-btn (layout original) + .carta-card-add + .rappi-item-add
  s += '  document.querySelectorAll(".add-btn, .carta-card-add, .rappi-item-add").forEach(function(btn){\n';
  s += '    btn.addEventListener("click",function(e){\n';
  s += '      e.stopPropagation();\n';
  s += '      var catIdx=parseInt(this.dataset.cat);\n';
  s += '      var dishIdx=parseInt(this.dataset.dish);\n';
  s += '      addToCart(catIdx,dishIdx,this);\n';
  s += '    });\n';
  s += '  });\n';
  // Dish click → abrir lightbox (si está activado) o agregar al carrito
  // Selectores combinados: .dish (original) + .carta-card + .rappi-item
  if (showGallery) {
    s += '  document.querySelectorAll(".dish, .carta-card, .rappi-item").forEach(function(d){\n';
    s += '    d.addEventListener("click",function(e){\n';
    s += '      if(e.target.classList.contains("add-btn")||e.target.classList.contains("carta-card-add")||e.target.classList.contains("rappi-item-add"))return;\n';
    s += '      if(e.target.closest(".carta-card-add")||e.target.closest(".rappi-item-add")||e.target.closest(".add-btn"))return;\n';
    s += '      var catIdx=parseInt(this.dataset.cat);\n';
    s += '      var dishIdx=parseInt(this.dataset.dish);\n';
    s += '      openDishLightbox(catIdx,dishIdx);\n';
    s += '    });\n';
    s += '  });\n';
  } else {
    s += '  document.querySelectorAll(".dish, .carta-card, .rappi-item").forEach(function(d){\n';
    s += '    d.addEventListener("click",function(e){\n';
    s += '      if(e.target.closest(".carta-card-add")||e.target.closest(".rappi-item-add")||e.target.closest(".add-btn"))return;\n';
    s += '      var catIdx=parseInt(this.dataset.cat);\n';
    s += '      var dishIdx=parseInt(this.dataset.dish);\n';
    s += '      addToCart(catIdx,dishIdx);\n';
    s += '    });\n';
    s += '  });\n';
  }
  s += '  document.querySelectorAll(".nav-item").forEach(function(item){\n';
  s += '    item.addEventListener("click",function(){\n';
  s += '      document.querySelectorAll(".nav-item").forEach(function(n){n.classList.remove("active");});\n';
  s += '      this.classList.add("active");\n';
  s += '      var idx=parseInt(this.dataset.idx);\n';
  s += '      var el=document.getElementById("cat-"+idx);\n';
  s += '      if(el){var top=el.getBoundingClientRect().top+window.pageYOffset-70;window.scrollTo({top:top,behavior:"smooth"});}\n';
  s += '    });\n';
  s += '  });\n';
  s += '  document.getElementById("cartBar").addEventListener("click",openModal);\n';
  s += '  document.getElementById("closeBtn").addEventListener("click",closeModal);\n';
  s += '  document.getElementById("waBtn").addEventListener("click",sendWhatsApp);\n';
  s += '  document.getElementById("modal").addEventListener("click",function(e){if(e.target===this)closeModal();});\n';
  s += '  window.addEventListener("scroll",updateActiveNav,{passive:true});\n';
  // Scroll-to-top button: show after 600px scroll, hide when modal is open (via CSS :has)
  s += '  var scrollTopBtn=document.getElementById("scrollTopBtn");\n';
  s += '  if(scrollTopBtn){\n';
  s += '    var updateScrollTop=function(){if(window.pageYOffset>600){scrollTopBtn.classList.add("visible");}else{scrollTopBtn.classList.remove("visible");}};\n';
  s += '    window.addEventListener("scroll",updateScrollTop,{passive:true});\n';
  s += '    scrollTopBtn.addEventListener("click",function(){window.scrollTo({top:0,behavior:"smooth"});});\n';
  s += '    updateScrollTop();\n';
  s += '  }\n';
  // Theme toggle: cycle dark↔light, persist in localStorage (key: menupro-theme)
  // Si el usuario resetea (clear localStorage) vuelve al tema por defecto del dueño
  s += '  var themeToggleBtn=document.getElementById("themeToggleBtn");\n';
  s += '  if(themeToggleBtn){\n';
  s += '    themeToggleBtn.addEventListener("click",function(){\n';
  s += '      var current="default";\n';
  s += '      var attr=document.documentElement.getAttribute("data-theme");\n';
  s += '      if(attr==="light"||attr==="dark"){current=attr;}\n';
  s += '      var next;\n';
  s += '      if(current==="default"){next=' + (darkMode ? '"light"' : '"dark"') + ';}\n';
  s += '      else if(current==="dark"){next="light";}\n';
  s += '      else{next="dark";}\n';
  s += '      document.documentElement.setAttribute("data-theme",next);\n';
  s += '      try{localStorage.setItem("menupro-theme",next);}catch(e){}\n';
  s += '    });\n';
  s += '  }\n';
  // Dish image error handler — uses event delegation (clean, no nested escapes)
  // Si la imagen del plato falla al cargar, se reemplaza por un placeholder con la letra inicial
  // Cubre: .dish-img (original) + .carta-card-img (carta carousel) + .rappi-item-img (lista Rappi)
  s += '  document.addEventListener("error",function(e){\n';
  s += '    var el=e.target;\n';
  s += '    if(!el||!el.classList)return;\n';
  s += '    var letter=el.getAttribute("data-letter")||"P";\n';
  s += '    var div=document.createElement("div");\n';
  s += '    if(el.classList.contains("dish-img")){div.className="dish-img-placeholder";div.textContent=letter;if(el.parentNode){el.parentNode.replaceChild(div,el);}}\n';
  s += '    else if(el.classList.contains("carta-card-img")){div.className="carta-card-placeholder";div.textContent=letter;if(el.parentNode){el.parentNode.replaceChild(div,el);}}\n';
  s += '    else if(el.classList.contains("rappi-item-img")){div.className="rappi-item-placeholder";div.textContent=letter;if(el.parentNode){el.parentNode.replaceChild(div,el);}}\n';
  s += '  },true);\n';
  s += '}\n';

  // ─── Lightbox de plato (estilo PedidosYa/Rappi — clean rewrite sin nested escapes) ───
  if (showGallery) {
    // Helper: genera placeholder (letra inicial + cat name) como elemento DOM
    s += 'function buildPlaceholderEl(letter,catName){var div=document.createElement("div");div.className="dish-lightbox-img-placeholder";div.innerHTML="<div class=\\"ph-letter\\">"+escapeHtml(letter)+"</div><div class=\\"ph-label\\">"+escapeHtml(catName)+"</div>";return div;}\n';
    s += 'function buildImgEl(src,name){var img=document.createElement("img");img.className="dish-lightbox-img";img.alt=escapeHtml(name||"Plato");img.src=src;img.loading="lazy";img.decoding="async";var ss=imgSrcset(src);if(ss){img.srcset=ss;img.sizes="(max-width: 600px) 100vw, 800px";}return img;}\n';
    // Construye el hero: Swiper si gallery>1, img simple si solo 1
    s += 'function buildDishHero(dish,catName){\n';
    s += '  var hero=document.createElement("div");hero.className="dish-lightbox-hero";\n';
    s += '  var imgs=[];\n';
    s += '  if(dish.image_url)imgs.push(dish.image_url);\n';
    s += '  if(dish.gallery&&Array.isArray(dish.gallery)){dish.gallery.forEach(function(g){if(g&&imgs.indexOf(g)<0)imgs.push(g);});}\n';
    s += '  var letter=(dish.name||"P").charAt(0).toUpperCase();\n';
    s += '  if(imgs.length===0){hero.appendChild(buildPlaceholderEl(letter,catName));return hero;}\n';
    s += '  if(imgs.length===1){hero.appendChild(buildImgEl(imgs[0],dish.name));return hero;}\n';
    s += '  hero.classList.add("has-gallery");\n';
    s += '  var swiperDiv=document.createElement("div");swiperDiv.className="swiper dish-swiper";\n';
    s += '  var wrapper=document.createElement("div");wrapper.className="swiper-wrapper";\n';
    s += '  imgs.forEach(function(src){var slide=document.createElement("div");slide.className="swiper-slide";slide.appendChild(buildImgEl(src,dish.name));wrapper.appendChild(slide);});\n';
    s += '  swiperDiv.appendChild(wrapper);\n';
    s += '  var pag=document.createElement("div");pag.className="swiper-pagination";swiperDiv.appendChild(pag);\n';
    s += '  var next=document.createElement("div");next.className="swiper-button-next";swiperDiv.appendChild(next);\n';
    s += '  var prev=document.createElement("div");prev.className="swiper-button-prev";swiperDiv.appendChild(prev);\n';
    s += '  hero.appendChild(swiperDiv);\n';
    s += '  var count=document.createElement("div");count.className="dish-img-count";count.textContent="1 / "+imgs.length;hero.appendChild(count);\n';
    s += '  setTimeout(function(){if(window.Swiper){new Swiper(swiperDiv,{pagination:{el:pag,clickable:true},navigation:{nextEl:next,prevEl:prev},loop:true,on:{slideChange:function(){count.textContent=(this.realIndex+1)+" / "+imgs.length;}}});}},50);\n';
    s += '  return hero;\n';
    s += '}\n';
    // Construye las opciones (extras/salsas) del plato
    // En carta pública: si no hay options → NO mostrar nada (UX limpia para cliente)
    // En preview dashboard: mostrar placeholder para que el dueño sepa que la función existe
    s += 'var currentDishOptionsState={};\n';
    s += 'function buildDishOptions(dish){\n';
    s += '  if(!dish.options||!Array.isArray(dish.options)||dish.options.length===0){\n';
    s += '    if(typeof IS_PREVIEW!=="undefined"&&IS_PREVIEW){\n';
    s += '      var empty=document.createElement("div");empty.className="dish-options dish-options-empty";\n';
    s += '      var title=document.createElement("div");title.className="dish-options-title";title.innerHTML="<svg width=\\\"18\\\" height=\\\"18\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"2\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"><path d=\\\"M12 5v14M5 12h14\\\"/></svg>Personaliza tu pedido";\n';
    s += '      var hint=document.createElement("div");hint.className="dish-options-hint";hint.textContent="Este plato no tiene extras configurados. Agrega salsas, toppings u opciones desde el editor para personalizar el pedido de tus clientes.";\n';
    s += '      empty.appendChild(title);empty.appendChild(hint);\n';
    s += '      return empty;\n';
    s += '    }\n';
    s += '    return null;\n';
    s += '  }\n';
    s += '  var wrap=document.createElement("div");wrap.className="dish-options";\n';
    s += '  currentDishOptionsState={};\n';
    s += '  dish.options.forEach(function(grp){\n';
    s += '    var g=document.createElement("div");g.className="dish-option-group";\n';
    s += '    var title=document.createElement("div");title.className="dish-option-group-title";\n';
    s += '    var nameEl=document.createElement("div");nameEl.className="dish-option-group-name";nameEl.textContent=grp.name||"";\n';
    s += '    var hint=document.createElement("div");hint.className="dish-option-group-hint"+(grp.required?" required":"");\n';
    s += '    hint.textContent=grp.required?"Obligatorio":(grp.type==="single"?"Elige 1":"Elige hasta "+(grp.max||5));\n';
    s += '    title.appendChild(nameEl);title.appendChild(hint);g.appendChild(title);\n';
    s += '    var items=document.createElement("div");items.className="dish-option-items";\n';
    s += '    currentDishOptionsState[grp.id]={type:grp.type,items:{}};\n';
    s += '    grp.items.forEach(function(it){\n';
    s += '      var row=document.createElement("div");row.className="dish-option-item";\n';
    s += '      var info=document.createElement("div");info.className="dish-option-item-info";\n';
    s += '      var nm=document.createElement("div");nm.className="dish-option-name";nm.textContent=it.name;\n';
    s += '      var pr=document.createElement("div");pr.className="dish-option-price"+(it.price>0?"":" free");pr.textContent=it.price>0?"+"+formatPrice(it.price):"Gratis";\n';
    s += '      info.appendChild(nm);info.appendChild(pr);\n';
    s += '      if(grp.type==="single"){\n';
    s += '        var radio=document.createElement("div");radio.className="dish-option-radio";info.appendChild(radio);\n';
    s += '        row.addEventListener("click",function(){items.querySelectorAll(".dish-option-item").forEach(function(r){r.classList.remove("selected");r.querySelector(".dish-option-radio").classList.remove("checked");});row.classList.add("selected");radio.classList.add("checked");currentDishOptionsState[grp.id].items={};currentDishOptionsState[grp.id].items[it.id]={name:it.name,price:it.price,qty:1};updateDishTotal();});\n';
    s += '      } else {\n';
    s += '        var counter=document.createElement("div");counter.className="dish-option-counter";\n';
    s += '        var decBtn=document.createElement("button");decBtn.innerHTML="&minus;";decBtn.disabled=true;\n';
    s += '        var countSpan=document.createElement("span");countSpan.className="count";countSpan.textContent="0";\n';
    s += '        var incBtn=document.createElement("button");incBtn.innerHTML="&plus;";\n';
    s += '        counter.appendChild(decBtn);counter.appendChild(countSpan);counter.appendChild(incBtn);\n';
    s += '        decBtn.addEventListener("click",function(e){e.stopPropagation();var cur=currentDishOptionsState[grp.id].items[it.id]||{qty:0};if(cur.qty>0){cur.qty--;countSpan.textContent=cur.qty;if(cur.qty===0){delete currentDishOptionsState[grp.id].items[it.id];row.classList.remove("selected");decBtn.disabled=true;}else{currentDishOptionsState[grp.id].items[it.id]={name:it.name,price:it.price,qty:cur.qty};}updateDishTotal();}});\n';
    s += '        incBtn.addEventListener("click",function(e){e.stopPropagation();var cur=currentDishOptionsState[grp.id].items[it.id]||{qty:0};var max=grp.max||5;var count=0;for(var k in currentDishOptionsState[grp.id].items){count+=currentDishOptionsState[grp.id].items[k].qty;}if(count>=max){return;}cur.qty++;countSpan.textContent=cur.qty;decBtn.disabled=false;row.classList.add("selected");currentDishOptionsState[grp.id].items[it.id]={name:it.name,price:it.price,qty:cur.qty};updateDishTotal();});\n';
    s += '        row.appendChild(info);row.appendChild(counter);\n';
    s += '      }\n';
    s += '      if(grp.type==="single"){row.appendChild(info);}\n';
    s += '      items.appendChild(row);\n';
    s += '    });\n';
    s += '    g.appendChild(items);wrap.appendChild(g);\n';
    s += '  });\n';
    s += '  return wrap;\n';
    s += '}\n';
    // Calcula el total dinámico del plato (base + extras seleccionados)
    s += 'function getDishCurrentTotal(dish){var total=dish.price||0;for(var gid in currentDishOptionsState){for(var iid in currentDishOptionsState[gid].items){var it=currentDishOptionsState[gid].items[iid];total+=(it.price||0)*it.qty;}}return total;}\n';
    s += 'function updateDishTotal(){var priceEl=document.getElementById("dishLightboxPrice");if(!priceEl)return;var dish=window.__currentDish;var total=getDishCurrentTotal(dish);priceEl.textContent=formatPrice(total);}\n';
    // Abre el lightbox
    s += 'function openDishLightbox(catIdx,dishIdx){\n';
    s += '  var dish=RESTAURANT.categories[catIdx].dishes[dishIdx];\n';
    s += '  var catName=RESTAURANT.categories[catIdx].name||"Plato";\n';
    s += '  window.__currentDish=dish;\n';
    s += '  window.__currentCatIdx=catIdx;window.__currentDishIdx=dishIdx;\n';
    s += '  var lightbox=document.getElementById("dishLightbox");\n';
    s += '  lightbox.innerHTML="";\n';
    s += '  var inner=document.createElement("div");inner.className="dish-lightbox-inner";\n';
    s += '  var handle=document.createElement("div");handle.className="dish-lightbox-handle";inner.appendChild(handle);\n';
    s += '  var closeBtn=document.createElement("button");closeBtn.className="dish-lightbox-close";closeBtn.id="dishLightboxClose";closeBtn.setAttribute("aria-label","Cerrar");closeBtn.innerHTML="&times;";inner.appendChild(closeBtn);\n';
    s += '  inner.appendChild(buildDishHero(dish,catName));\n';
    s += '  var content=document.createElement("div");content.className="dish-lightbox-content";\n';
    s += '  var cat=document.createElement("span");cat.className="dish-lightbox-cat";cat.textContent=catName;content.appendChild(cat);\n';
    s += '  var name=document.createElement("h3");name.className="dish-lightbox-name";name.textContent=dish.name||"Plato";content.appendChild(name);\n';
    s += '  var priceRow=document.createElement("div");priceRow.className="dish-lightbox-price-row";\n';
    s += '  var price=document.createElement("span");price.className="dish-lightbox-price";price.id="dishLightboxPrice";price.textContent=formatPrice(dish.price);priceRow.appendChild(price);\n';
    s += '  content.appendChild(priceRow);\n';
    s += '  var descLabel=document.createElement("div");descLabel.className="dish-lightbox-desc-label";descLabel.textContent="Descripción";content.appendChild(descLabel);\n';
    s += '  var desc=document.createElement("p");desc.className="dish-lightbox-desc";desc.textContent=dish.description||"Plato delicioso preparado con ingredientes frescos y de la mejor calidad. Pídelo ahora mismo por WhatsApp.";content.appendChild(desc);\n';
    s += '  var opts=buildDishOptions(dish);if(opts)content.appendChild(opts);\n';
    s += '  // Add a small "note" textarea for special instructions (always visible, ultra-pro)\n';
    s += '  var noteWrap=document.createElement("div");noteWrap.className="dish-note-wrap";\n';
    s += '  var noteLabel=document.createElement("div");noteLabel.className="dish-options-title";noteLabel.innerHTML="<svg width=\\\"18\\\" height=\\\"18\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"2\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"><path d=\\\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z\\\"/></svg>Notas del pedido";\n';
    s += '  var noteInput=document.createElement("textarea");noteInput.className="dish-note-input";noteInput.placeholder="Ej: Sin cebolla, cocido término medio, salsa aparte...";noteInput.rows=2;noteInput.maxLength=200;\n';
    s += '  noteWrap.appendChild(noteLabel);noteWrap.appendChild(noteInput);\n';
    s += '  content.appendChild(noteWrap);\n';
    s += '  inner.appendChild(content);\n';
    s += '  var cta=document.createElement("div");cta.className="dish-lightbox-cta";\n';
    s += '  var addBtn=document.createElement("button");addBtn.className="dish-lightbox-add";\n';
    s += '  addBtn.innerHTML="<svg width=\\"20\\" height=\\"20\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2.5\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M12 5v14M5 12h14\\"/></svg>Agregar al pedido";\n';
    s += '  addBtn.addEventListener("click",function(){var opts=getSelectedOptionsSnapshot();var noteEl=document.querySelector(".dish-note-input");var noteVal=noteEl?noteEl.value.trim():"";addToCart(catIdx,dishIdx,null,opts,noteVal);addBtn.classList.add("added");addBtn.innerHTML="<svg width=\\\"20\\\" height=\\\"20\\\" viewBox=\\\"0 0 24 24\\\" fill=\\\"none\\\" stroke=\\\"currentColor\\\" stroke-width=\\\"3\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"><polyline points=\\\"20 6 9 17 4 12\\\"/></svg> Agregado";setTimeout(closeDishLightbox,900);});\n';
    s += '  cta.appendChild(addBtn);\n';
    s += '  inner.appendChild(cta);\n';
    s += '  lightbox.appendChild(inner);\n';
    s += '  lightbox.classList.add("visible");\n';
    s += '  document.body.style.overflow="hidden";\n';
    s += '  closeBtn.addEventListener("click",closeDishLightbox);\n';
    s += '  lightbox.addEventListener("click",function(e){if(e.target===lightbox)closeDishLightbox();});\n';
    s += '  syncDishURL(catIdx,dishIdx);\n';
    s += '}\n';
    // Snapshot de opciones seleccionadas (deep clone del estado)
    s += 'function getSelectedOptionsSnapshot(){var out=[];for(var gid in currentDishOptionsState){var grp=currentDishOptionsState[gid];for(var iid in grp.items){var it=grp.items[iid];out.push({groupId:gid,itemId:iid,name:it.name,price:it.price,qty:it.qty});}}return out;}\n';
    // URL sync via History API
    s += 'function syncDishURL(catIdx,dishIdx){try{var slug=RESTAURANT.slug||"";var newURL=slug?("/r/"+slug+"/p/"+catIdx+"-"+dishIdx):("/p/"+catIdx+"-"+dishIdx);window.history.pushState({dishLightbox:true,catIdx:catIdx,dishIdx:dishIdx},"",newURL);}catch(e){}}\n';
    s += 'function restoreDishFromURL(){try{var m=window.location.pathname.match(/\\/p\\/(\\d+)-(\\d+)$/);if(m){var ci=parseInt(m[1]);var di=parseInt(m[2]);if(RESTAURANT.categories[ci]&&RESTAURANT.categories[ci].dishes[di]){openDishLightbox(ci,di);}}}catch(e){}}\n';
    s += 'window.addEventListener("popstate",function(e){if(!e.state||!e.state.dishLightbox){var lb=document.getElementById("dishLightbox");if(lb&&lb.classList.contains("visible")){closeDishLightbox(true);}}});\n';
    s += 'function closeDishLightbox(skipHistory){var lightbox=document.getElementById("dishLightbox");if(lightbox){lightbox.classList.remove("visible");lightbox.innerHTML="";document.body.style.overflow="";}if(!skipHistory&&window.location.pathname.match(/\\/p\\/\\d+-\\d+$/)){window.history.back();}}\n';
  }

  // Update active nav
  s += 'function updateActiveNav(){\n';
  s += '  var scrollPos=window.pageYOffset+100;\n';
  s += '  var sections=document.querySelectorAll(".section");\n';
  s += '  var activeIdx=0;\n';
  s += '  for(var i=0;i<sections.length;i++){if(sections[i].offsetTop<=scrollPos)activeIdx=i;}\n';
  s += '  document.querySelectorAll(".nav-item").forEach(function(n,i){n.classList.toggle("active",i===activeIdx);});\n';
  s += '}\n';
  // Add to cart
  s += 'function addToCart(catIdx,dishIdx,btn,options,note){\n';
  s += '  var dish=RESTAURANT.categories[catIdx].dishes[dishIdx];\n';
  s += '  options=options||[];\n';
  s += '  note=note||"";\n';
  s += '  var extrasTotal=0;options.forEach(function(o){extrasTotal+=(o.price||0)*o.qty;});\n';
  s += '  var unitPrice=dish.price+extrasTotal;\n';
  s += '  var signature=catIdx+"-"+dishIdx+"-"+JSON.stringify(options)+(note?"|"+note:"");\n';
  s += '  var existing=null;\n';
  s += '  for(var i=0;i<cart.length;i++){if(cart[i].signature===signature){existing=cart[i];break;}}\n';
  s += '  if(existing){existing.qty++;}\n';
  s += '  else{cart.push({catIdx:catIdx,dishIdx:dishIdx,signature:signature,name:dish.name,price:unitPrice,basePrice:dish.price,extrasPrice:extrasTotal,options:options,note:note,qty:1});}\n';
  s += '  if(btn){showAddedFlash(btn.closest(".dish"));}\n';
  s += '  updateCart(true);\n';
  s += '}\n';
  // Show flash
  s += 'function showAddedFlash(dishEl){\n';
  s += '  if(!dishEl)return;\n';
  s += '  var flash=document.createElement("div");\n';
  s += '  flash.className="added-flash";\n';
  s += '  flash.textContent="AGREGADO";\n';
  s += '  dishEl.appendChild(flash);\n';
  s += '  setTimeout(function(){if(flash.parentNode)flash.parentNode.removeChild(flash);},900);\n';
  s += '}\n';
  // Update cart
  s += 'function updateCart(pulse){\n';
  s += '  var count=0,total=0;\n';
  s += '  cart.forEach(function(c){count+=c.qty;total+=c.price*c.qty;});\n';
  s += '  var countEl=document.getElementById("cartCount");\n';
  s += '  countEl.textContent=count;\n';
  s += '  document.getElementById("cartTotal").textContent=formatPrice(total);\n';
  s += '  var cartBar=document.getElementById("cartBar");\n';
  s += '  if(count>0){cartBar.classList.add("visible");}else{cartBar.classList.remove("visible");}\n';
  s += '  if(pulse){countEl.classList.remove("pulse");void countEl.offsetWidth;countEl.classList.add("pulse");}\n';
  s += '  updateMobileBottomNav(count,total);\n';
  s += '  renderCartItems();\n';
  s += '}\n';
  // Update mobile bottom nav cart badge + total
  s += 'function updateMobileBottomNav(count,total){\n';
  s += '  var badge=document.getElementById("mbnCartCount");\n';
  s += '  var totalEl=document.getElementById("mbnCartTotal");\n';
  s += '  var nav=document.getElementById("mobileBottomNav");\n';
  s += '  if(!badge||!totalEl||!nav)return;\n';
  s += '  if(count>0){badge.style.display="flex";badge.textContent=count;nav.classList.add("visible");}else{badge.style.display="none";nav.classList.remove("visible");}\n';
  s += '  totalEl.textContent=count>0?formatPrice(total):"";\n';
  s += '}\n';
  // Show mobile bottom nav after small scroll on mobile
  s += 'function showMobileNavOnMobile(){if(window.innerWidth<640){var nav=document.getElementById("mobileBottomNav");if(nav)nav.classList.add("visible");}}\n';
  // Mobile bottom nav actions
  s += 'function setupMobileBottomNav(){\n';
  s += '  document.querySelectorAll(".mbn-item").forEach(function(btn){\n';
  s += '    btn.addEventListener("click",function(){\n';
  s += '      var action=this.dataset.action;\n';
  s += '      document.querySelectorAll(".mbn-item").forEach(function(b){b.classList.remove("active");});this.classList.add("active");\n';
  s += '      if(action==="home"){window.scrollTo({top:0,behavior:"smooth"});}\n';
  s += '      else if(action==="search"){var si=document.getElementById("searchInput");if(si){si.focus();si.scrollIntoView({behavior:"smooth",block:"center"});}}\n';
  s += '      else if(action==="cart"){openModal();}\n';
  s += '      else if(action==="favorites"){toggleFavoritesModal();}\n';
  s += '    });\n';
  s += '  });\n';
  s += '}\n';
  // Favorites (saved in localStorage)
  s += 'var favorites=[];\n';
  s += 'function loadFavorites(){try{favorites=JSON.parse(localStorage.getItem("mp_favs")||"[]");}catch(e){favorites=[];}}\n';
  s += 'function saveFavorites(){try{localStorage.setItem("mp_favs",JSON.stringify(favorites));}catch(e){}}\n';
  s += 'function toggleFav(catIdx,dishIdx){var k=catIdx+"-"+dishIdx;var i=favorites.indexOf(k);if(i>=0){favorites.splice(i,1);}else{favorites.push(k);}saveFavorites();updateFavBadge();}\n';
  s += 'function updateFavBadge(){var b=document.getElementById("mbnFavCount");if(!b)return;if(favorites.length>0){b.style.display="flex";b.textContent=favorites.length;}else{b.style.display="none";}}\n';
  s += 'function toggleFavoritesModal(){alert("Favoritos: "+favorites.length+" plato(s) guardado(s). Próximamente vista de favoritos dedicada.");}\n';
  // Render cart items
  s += 'function renderCartItems(){\n';
  s += '  var container=document.getElementById("cartItems");\n';
  s += '  var summary=document.getElementById("cartSummary");\n';
  s += '  if(cart.length===0){\n';
  s += '    container.innerHTML="<div class=\\"cart-empty\\">Tu carrito esta vacio</div>";\n';
  s += '    summary.innerHTML="";\n';
  s += '    return;\n';
  s += '  }\n';
  s += '  var html="";\n';
  s += '  cart.forEach(function(item,i){\n';
  s += '    html+="<div class=\\"cart-item\\">";\n';
  s += '    html+="<div class=\\"cart-item-info\\">";\n';
  s += '    html+="<div class=\\"cart-item-name\\">"+escapeHtml(item.name)+"</div>";\n';
  s += '    if(item.options&&item.options.length>0){html+="<div class=\\"cart-item-extras\\">"+item.options.map(function(o){return "+"+escapeHtml(o.name)+(o.qty>1?" x"+o.qty:"");}).join(", ")+"</div>";}\n';
  s += '    if(item.note){html+="<div class=\\"cart-item-note\\">📝 "+escapeHtml(item.note)+"</div>";}\n';
  s += '    html+="<div class=\\"cart-item-price\\">"+formatPrice(item.price)+" c/u</div>";\n';
  s += '    html+="</div>";\n';
  s += '    html+="<div class=\\"qty-control\\">";\n';
  s += '    html+="<button class=\\"qty-btn\\" data-action=\\"dec\\" data-idx=\\""+i+"\\">−</button>";\n';
  s += '    html+="<span class=\\"qty\\">"+item.qty+"</span>";\n';
  s += '    html+="<button class=\\"qty-btn\\" data-action=\\"inc\\" data-idx=\\""+i+"\\">+</button>";\n';
  s += '    html+="</div>";\n';
  s += '    html+="<div class=\\"cart-item-total\\">"+formatPrice(item.price*item.qty)+"</div>";\n';
  s += '    html+="</div>";\n';
  s += '  });\n';
  s += '  container.innerHTML=html;\n';
  s += '  var total=0;cart.forEach(function(c){total+=c.price*c.qty;});\n';
  s += '  summary.innerHTML="<div class=\\"summary-row\\"><span>Subtotal</span><span>"+formatPrice(total)+"</span></div>";\n';
  s += '  summary.innerHTML+="<div class=\\"summary-total\\"><span>Total</span><span class=\\"amount\\">"+formatPrice(total)+"</span></div>";\n';
  s += '  container.querySelectorAll(".qty-btn").forEach(function(btn){\n';
  s += '    btn.addEventListener("click",function(){\n';
  s += '      var idx=parseInt(this.dataset.idx);\n';
  s += '      if(this.dataset.action==="inc"){cart[idx].qty++;}\n';
  s += '      else{cart[idx].qty--;if(cart[idx].qty<=0)cart.splice(idx,1);}\n';
  s += '      updateCart();\n';
  s += '    });\n';
  s += '  });\n';
  s += '}\n';
  // Modal
  s += 'function openModal(){\n';
  s += '  if(cart.length===0)return;\n';
  s += '  document.getElementById("modal").classList.add("visible");\n';
  s += '}\n';
  s += 'function closeModal(){document.getElementById("modal").classList.remove("visible");}\n';
  // WhatsApp
  s += 'function sendWhatsApp(){\n';
  s += '  if(cart.length===0)return;\n';
  s += '  var msg="*"+RESTAURANT.name+"*\\n";\n';
  s += '  if(RESTAURANT.slogan){msg+="_"+RESTAURANT.slogan+"_\\n";}\n';
  s += '  msg+="\\n*PEDIDO*\\n\\n";\n';
  s += '  cart.forEach(function(item){\n';
  s += '    msg+="• "+item.qty+"x "+item.name+" — "+formatPrice(item.price*item.qty)+"\\n";\n';
  s += '    if(item.options&&item.options.length>0){msg+="   Extras: "+item.options.map(function(o){return o.name+(o.qty>1?" x"+o.qty:"");}).join(", ")+"\\n";}\n';
  s += '    if(item.note){msg+="   📝 "+item.note+"\\n";}\n';
  s += '  });\n';
  s += '  var total=0;cart.forEach(function(c){total+=c.price*c.qty;});\n';
  s += '  msg+="\\n*TOTAL: "+formatPrice(total)+"*\\n\\n";\n';
  s += '  msg+="Hola, quisiera confirmar este pedido por favor.";\n';
  s += '  var url="https://wa.me/"+RESTAURANT.whatsapp+"?text="+encodeURIComponent(msg);\n';
  s += '  window.open(url,"_blank");\n';
  s += '}\n';
  s += 'renderApp();\n';
  // Inicializar auto-scroll del carrusel Destacados DESPUÉS de renderApp
  // (necesita que #destacadosTrack exista en el DOM)
  if (cartaStyle && cartaAutoscroll) {
    s += 'if(typeof setupCartaAutoscroll==="function"){setupCartaAutoscroll();}\n';
  }
  return s;
}
