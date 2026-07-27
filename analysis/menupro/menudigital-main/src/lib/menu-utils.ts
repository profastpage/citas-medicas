// Tipos compartidos
export interface MenuData {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  slogan: string | null;
  description: string | null;
  whatsapp: string;
  logo_url: string | null;
  color: string;
  currency: string;
  branding_text: string | null;
  is_published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  // Tema personalizables (plan Pro desbloquea todo)
  theme_color_secondary?: string;
  theme_font?: string;
  theme_layout?: 'single' | 'double' | 'grid';
  theme_image_size?: 'none' | 'small' | 'medium' | 'large' | 'hero';
  theme_card_style?: 'compact' | 'expanded' | 'minimal';
  theme_cover_url?: string | null;
  theme_show_search?: boolean;
  theme_show_category_icons?: boolean;
  theme_rounded_corners?: boolean;
  theme_dark_mode?: boolean;
  theme_dish_gallery?: boolean;
  theme_preset_id?: string | null;
  // Estilo Carta (PedidosYa/Rappi horizontal carousel)
  theme_carta_style?: boolean;        // default false — modo carrusel horizontal
  theme_carta_list_style?: boolean;   // default false — modo lista Rappi (texto izq, imagen der)
  theme_carta_autoscroll?: boolean;   // default false — auto-scroll del carrusel Destacados
  theme_carta_scroll_speed?: number;  // default 30 — px/seg del auto-scroll
  // Redes sociales
  social_facebook?: string | null;
  social_instagram?: string | null;
  social_whatsapp?: string | null;
  social_tiktok?: string | null;
  social_twitter?: string | null;
  social_youtube?: string | null;
  social_web?: string | null;
  categories?: CategoryData[];
}

export interface CategoryData {
  id: string;
  menu_id: string;
  name: string;
  sort_order: number;
  dishes?: DishData[];
}

export interface DishOptionItem {
  id: string;
  name: string;
  price: number;
}

export interface DishOptionGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  max?: number;
  items: DishOptionItem[];
}

export interface DishData {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  gallery?: string[] | null;
  options?: DishOptionGroup[] | null;
  sort_order: number;
}

export interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'pro' | 'premium' | 'full';
  mp_preapproval_id: string | null;
  mp_status: string | null;
  current_period_end: string | null;
  bg_removals_used: number | null;
  bg_removals_reset_at: string | null;
}

// Generar slug desde nombre
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s\-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

// Formatear precio según moneda
export function formatPrice(amount: number, currency: string = 'S/'): string {
  return `${currency} ${Number(amount).toFixed(2)}`;
}

// Hex → RGB string (para CSS variables)
export function hexToRgbStr(hex: string): string {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return `${r}, ${g}, ${b}`;
}

// Escape HTML
export function escapeHtml(s: unknown): string {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
