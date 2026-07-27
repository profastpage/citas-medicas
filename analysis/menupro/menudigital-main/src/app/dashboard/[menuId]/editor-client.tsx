'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Eye,
  ExternalLink,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Images,
  Settings2,
  CheckCircle2,
  Download,
  Palette,
  Share2,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Sparkles,
} from 'lucide-react';
import { COLORS, CURRENCIES, type Plan } from '@/lib/plans';
import type { MenuData, ProfileData } from '@/lib/menu-utils';
import { deriveVariantUrl } from '@/lib/image-utils';
import { buildMenuHTML } from './menu-html-builder';
import { ImageUploader } from './image-uploader';

interface Props {
  initialMenu: MenuData;
  plan: Plan;
  profile: ProfileData;
  imagesCount: number;
}

interface LocalCategory {
  id: string;
  name: string;
  dishes: LocalDish[];
}

interface LocalOptionItem {
  id: string;
  name: string;
  price: string;
}

interface LocalOptionGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  max: number;
  items: LocalOptionItem[];
}

interface LocalDish {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  gallery: string[];
  options: LocalOptionGroup[];
}

export function EditorClient({ initialMenu, plan, profile, imagesCount }: Props) {
  const router = useRouter();
  const [menu, setMenu] = useState({
    name: initialMenu.name || '',
    slogan: initialMenu.slogan || '',
    description: initialMenu.description || '',
    whatsapp: initialMenu.whatsapp || '',
    logo: initialMenu.logo_url || '',
    color: initialMenu.color || '#ff6b35',
    currency: initialMenu.currency || 'S/',
    is_published: initialMenu.is_published || false,
  });
  // Estado de tema (plan Pro desbloquea todo; Free solo color)
  const [theme, setTheme] = useState({
    color_secondary: (initialMenu as any).theme_color_secondary || '#1a1a2e',
    font: (initialMenu as any).theme_font || 'Inter',
    layout: (initialMenu as any).theme_layout || 'single',
    image_size: (initialMenu as any).theme_image_size || 'medium',
    card_style: (initialMenu as any).theme_card_style || 'expanded',
    cover_url: (initialMenu as any).theme_cover_url || '',
    show_search: (initialMenu as any).theme_show_search !== false,
    show_category_icons: (initialMenu as any).theme_show_category_icons !== false,
    rounded_corners: (initialMenu as any).theme_rounded_corners !== false,
    dark_mode: (initialMenu as any).theme_dark_mode !== false,
    dish_gallery: (initialMenu as any).theme_dish_gallery !== false,
    preset_slug: null as string | null,
    // Estilo Carta (PedidosYa/Rappi horizontal carousel)
    carta_style: (initialMenu as any).theme_carta_style === true,
    carta_list_style: (initialMenu as any).theme_carta_list_style === true,
    carta_autoscroll: (initialMenu as any).theme_carta_autoscroll === true,
    carta_scroll_speed: (initialMenu as any).theme_carta_scroll_speed || 30,
  });
  // Estado de redes sociales
  const [socials, setSocials] = useState({
    facebook: (initialMenu as any).social_facebook || '',
    instagram: (initialMenu as any).social_instagram || '',
    whatsapp: (initialMenu as any).social_whatsapp || '',
    tiktok: (initialMenu as any).social_tiktok || '',
    twitter: (initialMenu as any).social_twitter || '',
    youtube: (initialMenu as any).social_youtube || '',
    web: (initialMenu as any).social_web || '',
  });
  const [coverUploading, setCoverUploading] = useState(false);
  const [showAppearancePanel, setShowAppearancePanel] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [categories, setCategories] = useState<LocalCategory[]>(
    initialMenu.categories?.map((c) => ({
      id: c.id,
      name: c.name,
      dishes: c.dishes?.map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description || '',
        price: String(d.price),
        image: d.image_url || '',
        gallery: Array.isArray((d as any).gallery) ? (d as any).gallery.filter(Boolean) : [],
        options: Array.isArray((d as any).options) ? (d as any).options.map((g: any) => ({
          id: g.id || `og-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: g.name || '',
          type: g.type === 'single' ? 'single' : 'multiple',
          required: !!g.required,
          max: Number(g.max) || 5,
          items: Array.isArray(g.items) ? g.items.map((it: any) => ({
            id: it.id || `oi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: it.name || '',
            price: String(it.price || '0'),
          })) : [],
        })) : [],
      })) || [],
    })) || [{ id: 'new-1', name: '', dishes: [{ id: 'd-1', name: '', description: '', price: '', image: '', gallery: [], options: [] }] }]
  );
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [coverDragOver, setCoverDragOver] = useState(false);
  const dirtyRef = useRef(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const importFileRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Marcar como dirty cuando cambia algo
  useEffect(() => {
    dirtyRef.current = true;
  }, [menu, categories, theme, socials]);

  // Auto-guardado cada 3s si hay cambios
  const save = useCallback(async (silent = true) => {
    if (!dirtyRef.current) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/menus/${initialMenu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // ⚠️ FIX: enviar logo_url (no `logo`) — el API espera `logo_url`
          name: menu.name,
          slogan: menu.slogan,
          description: menu.description,
          whatsapp: menu.whatsapp,
          logo_url: menu.logo, // ← clave: mapear `menu.logo` → `logo_url`
          color: menu.color,
          currency: menu.currency,
          is_published: menu.is_published,
          // Campos de tema (todos opcionales, se persisten si están presentes)
          theme_color_secondary: theme.color_secondary,
          theme_font: theme.font,
          theme_layout: theme.layout,
          theme_image_size: theme.image_size,
          theme_card_style: theme.card_style,
          theme_cover_url: theme.cover_url || null,
          theme_show_search: theme.show_search,
          theme_show_category_icons: theme.show_category_icons,
          theme_rounded_corners: theme.rounded_corners,
          theme_dark_mode: theme.dark_mode,
          theme_dish_gallery: theme.dish_gallery,
          theme_carta_style: theme.carta_style,
          theme_carta_list_style: theme.carta_list_style,
          theme_carta_autoscroll: theme.carta_autoscroll,
          theme_carta_scroll_speed: theme.carta_scroll_speed,
          // Redes sociales
          social_facebook: socials.facebook,
          social_instagram: socials.instagram,
          social_whatsapp: socials.whatsapp,
          social_tiktok: socials.tiktok,
          social_twitter: socials.twitter,
          social_youtube: socials.youtube,
          social_web: socials.web,
          categories: categories.map((c) => ({
            name: c.name,
            dishes: c.dishes.map((d) => ({
              name: d.name,
              description: d.description,
              price: d.price,
              image_url: d.image,
              gallery: (d.gallery || []).filter(Boolean).slice(0, 5),
              options: (d.options || []).map((g) => ({
                id: g.id,
                name: g.name,
                type: g.type,
                required: g.required,
                max: g.max,
                items: (g.items || []).map((it) => ({ id: it.id, name: it.name, price: Number(it.price) || 0 })),
              })),
            })),
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error');
      }
      dirtyRef.current = false;
      setSavedAt(new Date());
    } catch (err) {
      if (!silent) {
        toast.error(err instanceof Error ? err.message : 'Error al guardar');
      }
    } finally {
      setSaving(false);
    }
  }, [menu, categories, theme, socials, initialMenu.id]);

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => save(true), 1500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [menu, categories, theme, socials, save]);

  // Vista previa en vivo (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const data = {
        id: initialMenu.id,
        user_id: profile.id,
        name: menu.name || 'Mi Restaurante',
        slug: initialMenu.slug,
        slogan: menu.slogan || null,
        description: menu.description || null,
        whatsapp: menu.whatsapp || '0000000000',
        logo_url: menu.logo || null,
        color: menu.color,
        currency: menu.currency,
        branding_text: plan.limits.hasBranding ? 'Creado con MenuPro' : null,
        is_published: menu.is_published,
        views_count: 0,
        created_at: '',
        updated_at: '',
        // Tema para preview en vivo
        theme_color_secondary: theme.color_secondary,
        theme_font: theme.font,
        theme_layout: theme.layout as any,
        theme_image_size: theme.image_size as any,
        theme_card_style: theme.card_style as any,
        theme_cover_url: theme.cover_url || null,
        theme_show_search: theme.show_search,
        theme_show_category_icons: theme.show_category_icons,
        theme_rounded_corners: theme.rounded_corners,
        theme_dark_mode: theme.dark_mode,
        theme_dish_gallery: theme.dish_gallery,
        theme_carta_style: theme.carta_style,
        theme_carta_list_style: theme.carta_list_style,
        theme_carta_autoscroll: theme.carta_autoscroll,
        theme_carta_scroll_speed: theme.carta_scroll_speed,
        // Redes sociales
        social_facebook: socials.facebook || null,
        social_instagram: socials.instagram || null,
        social_whatsapp: socials.whatsapp || null,
        social_tiktok: socials.tiktok || null,
        social_twitter: socials.twitter || null,
        social_youtube: socials.youtube || null,
        social_web: socials.web || null,
        categories: categories.map((c) => ({
          id: c.id,
          menu_id: initialMenu.id,
          name: c.name || 'Sin nombre',
          sort_order: 0,
          dishes: c.dishes.map((d) => ({
            id: d.id,
            category_id: c.id,
            name: d.name || 'Plato',
            description: d.description || null,
            price: Number(d.price) || 0,
            image_url: d.image || null,
            gallery: (d.gallery || []).filter(Boolean).slice(0, 5),
            options: (d.options || []).map((g) => ({
              id: g.id,
              name: g.name,
              type: g.type,
              required: g.required,
              max: g.max,
              items: (g.items || []).map((it) => ({ id: it.id, name: it.name, price: Number(it.price) || 0 })),
            })),
            sort_order: 0,
          })),
        })),
      };
      setPreviewHtml(buildMenuHTML(data, { isPreview: true }));
    }, 400);
    return () => clearTimeout(timer);
  }, [menu, categories, theme, socials, plan, initialMenu.id, initialMenu.slug, profile.id]);

  async function handlePublish() {
    setPublishing(true);
    try {
      // Validaciones
      if (!menu.name.trim()) {
        toast.error('Ingresa el nombre del restaurante');
        return;
      }
      if (!menu.whatsapp.trim() || !/^\d{8,15}$/.test(menu.whatsapp)) {
        toast.error('WhatsApp inválido. 8-15 dígitos sin + ni espacios');
        return;
      }
      const validCats = categories.filter((c) => c.name.trim());
      if (validCats.length === 0) {
        toast.error('Agrega al menos una categoría con nombre');
        return;
      }
      for (const c of validCats) {
        const validDishes = c.dishes.filter((d) => d.name.trim());
        if (validDishes.length === 0) {
          toast.error(`La categoría "${c.name}" necesita al menos un plato`);
          return;
        }
        for (const d of validDishes) {
          if (!d.price || isNaN(Number(d.price)) || Number(d.price) < 0) {
            toast.error(`Precio inválido en: ${d.name}`);
            return;
          }
        }
      }

      // Guardar primero
      const res = await fetch(`/api/menus/${initialMenu.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // ⚠️ FIX: enviar logo_url (no `logo`) — el API espera `logo_url`
          name: menu.name,
          slogan: menu.slogan,
          description: menu.description,
          whatsapp: menu.whatsapp,
          logo_url: menu.logo, // ← clave: mapear `menu.logo` → `logo_url`
          color: menu.color,
          currency: menu.currency,
          is_published: true,
          // Tema
          theme_color_secondary: theme.color_secondary,
          theme_font: theme.font,
          theme_layout: theme.layout,
          theme_image_size: theme.image_size,
          theme_card_style: theme.card_style,
          theme_cover_url: theme.cover_url || null,
          theme_show_search: theme.show_search,
          theme_show_category_icons: theme.show_category_icons,
          theme_rounded_corners: theme.rounded_corners,
          theme_dark_mode: theme.dark_mode,
          theme_dish_gallery: theme.dish_gallery,
          theme_carta_style: theme.carta_style,
          theme_carta_list_style: theme.carta_list_style,
          theme_carta_autoscroll: theme.carta_autoscroll,
          theme_carta_scroll_speed: theme.carta_scroll_speed,
          // Redes sociales
          social_facebook: socials.facebook,
          social_instagram: socials.instagram,
          social_whatsapp: socials.whatsapp,
          social_tiktok: socials.tiktok,
          social_twitter: socials.twitter,
          social_youtube: socials.youtube,
          social_web: socials.web,
          categories: categories.map((c) => ({
            name: c.name,
            dishes: c.dishes.map((d) => ({
              name: d.name,
              description: d.description,
              price: d.price,
              image_url: d.image,
              gallery: (d.gallery || []).filter(Boolean).slice(0, 5),
              options: (d.options || []).map((g) => ({
                id: g.id,
                name: g.name,
                type: g.type,
                required: g.required,
                max: g.max,
                items: (g.items || []).map((it) => ({ id: it.id, name: it.name, price: Number(it.price) || 0 })),
              })),
            })),
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error');
      }
      setMenu((m) => ({ ...m, is_published: true }));
      dirtyRef.current = false;
      toast.success('¡Menú publicado! Ya es visible públicamente.');
      window.open(`/r/${initialMenu.slug}`, '_blank');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error');
    } finally {
      setPublishing(false);
    }
  }

  function addCategory() {
    setCategories((cs) => [
      ...cs,
      {
        id: `new-${Date.now()}`,
        name: '',
        dishes: [{ id: `d-${Date.now()}`, name: '', description: '', price: '', image: '', gallery: [], options: [] }],
      },
    ]);
  }

  function addDish(catId: string) {
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? {
              ...c,
              dishes: [...c.dishes, { id: `d-${Date.now()}`, name: '', description: '', price: '', image: '', gallery: [], options: [] }],
            }
          : c
      )
    );
  }

  function removeCategory(catId: string) {
    setCategories((cs) => cs.filter((c) => c.id !== catId));
  }

  function removeDish(catId: string, dishId: string) {
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? { ...c, dishes: c.dishes.filter((d) => d.id !== dishId) }
          : c
      )
    );
  }

  function updateCategory(catId: string, name: string) {
    setCategories((cs) => cs.map((c) => (c.id === catId ? { ...c, name } : c)));
  }

  function updateDish(catId: string, dishId: string, field: keyof LocalDish, value: string) {
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? { ...c, dishes: c.dishes.map((d) => (d.id === dishId ? { ...d, [field]: value } : d)) }
          : c
      )
    );
  }

  // Helpers para gallery (imágenes por plato según plan) y options (extras/salsas)
  function addDishGalleryImage(catId: string, dishId: string, url: string) {
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? {
              ...c,
              dishes: c.dishes.map((d) => {
                if (d.id !== dishId) return d;
                const gallery = [...(d.gallery || [])];
                // Límite de imágenes por plato según plan: Free 1, Pro 3, Premium 5, Full 10
                const maxImagesPerDish = plan.limits.maxImagesPerDish;
                if (gallery.length >= maxImagesPerDish) return d;
                // Si la primera imagen no está seteada, también la guardamos como image_url principal
                if (!d.image && gallery.length === 0) {
                  return { ...d, image: url, gallery: [url] };
                }
                return { ...d, gallery: [...gallery, url] };
              }),
            }
          : c
      )
    );
  }

  function removeDishGalleryImage(catId: string, dishId: string, index: number) {
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? {
              ...c,
              dishes: c.dishes.map((d) => {
                if (d.id !== dishId) return d;
                const gallery = [...(d.gallery || [])];
                gallery.splice(index, 1);
                // Si se elimina la primera, actualizar image_url
                const newImage = gallery[0] || '';
                return { ...d, image: newImage, gallery };
              }),
            }
          : c
      )
    );
  }

  function addOptionGroup(catId: string, dishId: string) {
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? {
              ...c,
              dishes: c.dishes.map((d) => {
                if (d.id !== dishId) return d;
                return {
                  ...d,
                  options: [
                    ...(d.options || []),
                    {
                      id: `og-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                      name: '',
                      type: 'multiple' as const,
                      required: false,
                      max: 5,
                      items: [],
                    },
                  ],
                };
              }),
            }
          : c
      )
    );
  }

  function updateOptionGroup(catId: string, dishId: string, groupId: string, field: keyof LocalOptionGroup, value: string | boolean | number) {
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? {
              ...c,
              dishes: c.dishes.map((d) => {
                if (d.id !== dishId) return d;
                return {
                  ...d,
                  options: (d.options || []).map((g) => (g.id === groupId ? { ...g, [field]: value } : g)),
                };
              }),
            }
          : c
      )
    );
  }

  function removeOptionGroup(catId: string, dishId: string, groupId: string) {
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? {
              ...c,
              dishes: c.dishes.map((d) => {
                if (d.id !== dishId) return d;
                return { ...d, options: (d.options || []).filter((g) => g.id !== groupId) };
              }),
            }
          : c
      )
    );
  }

  function addOptionItem(catId: string, dishId: string, groupId: string) {
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? {
              ...c,
              dishes: c.dishes.map((d) => {
                if (d.id !== dishId) return d;
                return {
                  ...d,
                  options: (d.options || []).map((g) =>
                    g.id === groupId
                      ? {
                          ...g,
                          items: [
                            ...g.items,
                            {
                              id: `oi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                              name: '',
                              price: '0',
                            },
                          ],
                        }
                      : g
                  ),
                };
              }),
            }
          : c
      )
    );
  }

  function updateOptionItem(catId: string, dishId: string, groupId: string, itemId: string, field: keyof LocalOptionItem, value: string) {
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? {
              ...c,
              dishes: c.dishes.map((d) => {
                if (d.id !== dishId) return d;
                return {
                  ...d,
                  options: (d.options || []).map((g) =>
                    g.id === groupId
                      ? { ...g, items: g.items.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)) }
                      : g
                  ),
                };
              }),
            }
          : c
      )
    );
  }

  function removeOptionItem(catId: string, dishId: string, groupId: string, itemId: string) {
    setCategories((cs) =>
      cs.map((c) =>
        c.id === catId
          ? {
              ...c,
              dishes: c.dishes.map((d) => {
                if (d.id !== dishId) return d;
                return {
                  ...d,
                  options: (d.options || []).map((g) =>
                    g.id === groupId ? { ...g, items: g.items.filter((it) => it.id !== itemId) } : g
                  ),
                };
              }),
            }
          : c
      )
    );
  }

  function handleLogoUploaded(url: string) {
    setMenu((m) => ({ ...m, logo: url }));
  }

  async function handleCoverFile(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Máximo 5MB por imagen');
      return;
    }
    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setTheme((t) => ({ ...t, cover_url: data.url }));
      toast.success('Portada subida');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al subir portada');
    } finally {
      setCoverUploading(false);
    }
  }

  function handleDishImageUploaded(catId: string, dishId: string, url: string) {
    updateDish(catId, dishId, 'image', url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/menus/${initialMenu.id}/import`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error importando');
      toast.success(data.message || `Importados: ${data.imported?.categories} categorías, ${data.imported?.dishes} platos`);
      router.refresh();
      // Reload menu data from server
      const menuRes = await fetch(`/api/menus/${initialMenu.id}`);
      const menuData = await menuRes.json();
      if (menuData.menu) {
        const m = menuData.menu;
        setMenu({
          name: m.name || '',
          slogan: m.slogan || '',
          description: m.description || '',
          whatsapp: m.whatsapp || '',
          logo: m.logo_url || '',
          color: m.color || '#ff6b35',
          currency: m.currency || 'S/',
          is_published: m.is_published || false,
        });
        setCategories(
          (m.categories || []).map((c: { id: string; name: string; dishes?: Array<{ id: string; name: string; description: string; price: number; image_url: string }> }) => ({
            id: c.id,
            name: c.name,
            dishes: (c.dishes || []).map((d) => ({
              id: d.id,
              name: d.name,
              description: d.description || '',
              price: String(d.price),
              image: d.image_url || '',
              gallery: Array.isArray((d as any).gallery) ? (d as any).gallery.filter(Boolean) : [],
              options: Array.isArray((d as any).options) ? (d as any).options.map((g: any) => ({
                id: g.id || `og-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                name: g.name || '',
                type: g.type === 'single' ? 'single' : 'multiple',
                required: !!g.required,
                max: Number(g.max) || 5,
                items: Array.isArray(g.items) ? g.items.map((it: any) => ({
                  id: it.id || `oi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                  name: it.name || '',
                  price: String(it.price || '0'),
                })) : [],
              })) : [],
            })),
          }))
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al importar');
    } finally {
      setImporting(false);
      if (importFileRef.current) importFileRef.current.value = '';
    }
  }

  async function handleExportMenu(format: string) {
    try {
      const res = await fetch(`/api/menus/${initialMenu.id}/export?format=${format}`);
      if (!res.ok) throw new Error('Error exportando');
      const blob = await res.blob();
      const ext = format === 'excel' ? 'xls' : format === 'word' ? 'doc' : format;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (menu.name || 'menu').replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '').replace(/\s+/g, '-');
      a.download = `${safeName}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exportado como .${ext}`);
    } catch {
      toast.error('Error al exportar');
    }
  }

  return (
    <div className="min-h-screen bg-[#07070b] text-white">
      {/* Top bar — mobile responsive */}
      <header className="border-b border-white/10 bg-[#0a0a14] backdrop-blur sticky top-0 z-40 safe-top">
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <a href="/dashboard" className="text-white/60 hover:text-white flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/5">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="min-w-0 flex-1">
              <div className="font-semibold truncate text-sm sm:text-base">{menu.name || 'Sin nombre'}</div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/40">
                {saving ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Guardando...</>
                ) : savedAt ? (
                  <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {savedAt.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</>
                ) : (
                  'Auto-guardado'
                )}
                {menu.is_published && (
                  <span className="text-emerald-400">· Publicado</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => save(false)}
              disabled={saving}
              className="text-white/70 hover:text-white hover:bg-white/5 h-9 px-2 sm:px-3"
            >
              <Save className="w-4 h-4" />
              <span className="hidden md:inline ml-1">Guardar</span>
            </Button>
            {menu.is_published && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-white/70 hover:text-white hover:bg-white/5 h-9 px-2 sm:px-3"
              >
                <a href={`/r/${initialMenu.slug}`} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden md:inline ml-1">Ver público</span>
                </a>
              </Button>
            )}
            <Button
              onClick={handlePublish}
              disabled={publishing}
              className="bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] hover:opacity-90 h-9 px-3 sm:px-4 text-xs sm:text-sm"
            >
              {publishing ? <Loader2 className="w-4 h-4 mr-1 sm:mr-2 animate-spin" /> : null}
              {menu.is_published ? 'Actualizar' : 'Publicar'}
            </Button>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-0 max-w-[1600px] mx-auto">
        {/* Form pane — mobile: full width with padding */}
        <section className="p-4 sm:p-6 space-y-4 sm:space-y-6 lg:max-h-[calc(100vh-65px)] lg:overflow-y-auto pb-32 lg:pb-6">
          {/* Info card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#f4d35e] flex items-center justify-center text-sm font-bold text-[#1a1a2e]">
                1
              </div>
              <h2 className="font-semibold text-sm sm:text-base">Información del restaurante</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre del restaurante *</Label>
                <Input
                  value={menu.name}
                  onChange={(e) => setMenu({ ...menu, name: e.target.value })}
                  placeholder="Ej: La Parrilla del Chef"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Slogan</Label>
                <Input
                  value={menu.slogan}
                  onChange={(e) => setMenu({ ...menu, slogan: e.target.value })}
                  placeholder="Ej: Cocina de autor desde 1998"
                  maxLength={60}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={menu.description}
                  onChange={(e) => setMenu({ ...menu, description: e.target.value })}
                  placeholder="Ej: Auténtica cocina peruana con ingredientes frescos"
                  className="bg-white/5 border-white/10 text-white min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label>WhatsApp con código de país *</Label>
                <Input
                  value={menu.whatsapp}
                  onChange={(e) => setMenu({ ...menu, whatsapp: e.target.value.replace(/\D/g, '') })}
                  placeholder="51987654321"
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-white/40">
                  Solo dígitos. 51=Perú, 52=México, 57=Colombia, 54=Argentina
                </p>
              </div>

              <div className="space-y-2">
                <Label>Logo del restaurante</Label>
                <ImageUploader
                  initialUrl={menu.logo}
                  onUploaded={handleLogoUploaded}
                  plan={plan}
                  imagesCount={imagesCount}
                  shape="circle"
                  size={120}
                />
              </div>

              {/* Cover / Portada (opcional) */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Imagen de portada (cover)
                  <span className="text-[10px] font-normal text-white/40">
                    — se muestra detrás del perfil
                  </span>
                </Label>
                <div className="space-y-2">
                  <div
                    onClick={() => !coverUploading && coverInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setCoverDragOver(true);
                    }}
                    onDragLeave={() => setCoverDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setCoverDragOver(false);
                      const f = e.dataTransfer.files?.[0];
                      if (f) handleCoverFile(f);
                    }}
                    className={`relative cursor-pointer transition-all rounded-xl overflow-hidden border-2 border-dashed ${
                      coverDragOver
                        ? 'border-[#d4af37] bg-[#d4af37]/10 scale-[1.01]'
                        : 'border-white/15 hover:border-[#d4af37]/60 hover:bg-white/5'
                    }`}
                    style={{ aspectRatio: '3 / 1', minHeight: '90px' }}
                  >
                    {theme.cover_url ? (
                      <>
                        <img
                          src={deriveVariantUrl(theme.cover_url, 'medium')}
                          srcSet={`${deriveVariantUrl(theme.cover_url, 'thumb')} 400w, ${deriveVariantUrl(theme.cover_url, 'medium')} 800w, ${deriveVariantUrl(theme.cover_url, 'large')} 1200w`}
                          sizes="(max-width: 768px) 100vw, 600px"
                          alt="Cover"
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTheme({ ...theme, cover_url: '' });
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-500 z-10"
                          aria-label="Quitar cover"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-2 left-3 text-[10px] text-white/80 font-medium tracking-wide">
                          Cover activo
                        </div>
                      </>
                    ) : coverUploading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-[#d4af37] animate-spin" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <Upload className="w-5 h-5 text-white/40 mb-1.5" />
                        <div className="text-xs text-white/60 font-medium">
                          Sube una imagen wide (3:1)
                        </div>
                        <div className="text-[10px] text-white/40 mt-0.5">
                          Click o arrastra — se mostrará detrás del perfil
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleCoverFile(f);
                      if (coverInputRef.current) coverInputRef.current.value = '';
                    }}
                  />
                  <Input
                    value={theme.cover_url}
                    onChange={(e) => setTheme({ ...theme, cover_url: e.target.value })}
                    placeholder="...o pega una URL de imagen"
                    disabled={plan.id === 'free'}
                    className="bg-white/5 border-white/10 text-white text-xs h-9 disabled:opacity-40"
                  />
                  {plan.id === 'free' && (
                    <p className="text-xs text-white/40">
                      Cover personalizado requiere plan Pro.
                    </p>
                  )}
                </div>
              </div>

              {/* Redes sociales */}
              <div className="space-y-2.5">
                <Label className="flex items-center gap-2">
                  <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />
                  Redes sociales
                  <span className="text-[10px] font-normal text-white/40">
                    — se muestran con iconos premium en el menú
                  </span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <SocialInput
                    icon={<Facebook className="w-3.5 h-3.5" />}
                    placeholder="Facebook (URL o @user)"
                    value={socials.facebook}
                    onChange={(v) => setSocials({ ...socials, facebook: v })}
                  />
                  <SocialInput
                    icon={<Instagram className="w-3.5 h-3.5" />}
                    placeholder="Instagram (URL o @user)"
                    value={socials.instagram}
                    onChange={(v) => setSocials({ ...socials, instagram: v })}
                  />
                  <SocialInput
                    icon={<span className="text-[11px] font-bold">WA</span>}
                    placeholder="WhatsApp (opcional, default = principal)"
                    value={socials.whatsapp}
                    onChange={(v) => setSocials({ ...socials, whatsapp: v.replace(/\D/g, '') })}
                  />
                  <SocialInput
                    icon={<span className="text-[11px] font-bold">TT</span>}
                    placeholder="TikTok (URL o @user)"
                    value={socials.tiktok}
                    onChange={(v) => setSocials({ ...socials, tiktok: v })}
                  />
                  <SocialInput
                    icon={<span className="text-[11px] font-bold">X</span>}
                    placeholder="Twitter/X (URL o @user)"
                    value={socials.twitter}
                    onChange={(v) => setSocials({ ...socials, twitter: v })}
                  />
                  <SocialInput
                    icon={<Youtube className="w-3.5 h-3.5" />}
                    placeholder="YouTube (URL o @user)"
                    value={socials.youtube}
                    onChange={(v) => setSocials({ ...socials, youtube: v })}
                  />
                  <div className="sm:col-span-2">
                    <SocialInput
                      icon={<Globe className="w-3.5 h-3.5" />}
                      placeholder="Sitio web (https://...)"
                      value={socials.web}
                      onChange={(v) => setSocials({ ...socials, web: v })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Moneda</Label>
                  <Select
                    value={menu.currency}
                    onValueChange={(v) => setMenu({ ...menu, currency: v })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#15152a] border-white/10">
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.value} value={c.value} className="text-white">
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color principal</Label>
                  <div className="grid grid-cols-6 gap-1.5">
                    {COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setMenu({ ...menu, color: c.hex })}
                        className={`aspect-square rounded-lg transition-all ${
                          menu.color === c.hex
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-[#07070b] scale-105'
                            : 'hover:scale-110'
                        }`}
                        style={{ background: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Botón Apariencia (Pro) */}
                <div className="space-y-2 sm:col-span-2">
                  <Label className="flex items-center gap-2">
                    Apariencia avanzada
                    {plan.id === 'free' && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-semibold">
                        PRO
                      </span>
                    )}
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAppearancePanel(true)}
                    className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 justify-start"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Tema, layout, imágenes y más
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ───────── Panel de Apariencia (Dialog) ───────── */}
          <Dialog open={showAppearancePanel} onOpenChange={setShowAppearancePanel}>
            <DialogContent className="bg-[#15152a] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#d4af37]" />
                  Apariencia avanzada
                  {plan.id === 'free' && (
                    <span className="text-xs font-normal text-white/50">
                      (Algunas opciones requieren Pro)
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 py-4">
                {/* Theme presets — Pro highlight feature */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    Temas pre-diseñados (Pro)
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-[10px] font-semibold">
                      PREMIUM
                    </span>
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { slug: 'elegante-oscuro', name: 'Elegante Oscuro', color: '#d4af37', dark: true },
                      { slug: 'moderno-claro', name: 'Moderno Claro', color: '#f5f5f0', dark: false },
                      { slug: 'picante-mexicano', name: 'Picante', color: '#ff6b35', dark: true },
                      { slug: 'fresco-verde', name: 'Fresco', color: '#06d6a0', dark: false },
                      { slug: 'premium-gold', name: 'Premium Gold', color: '#d4af37', dark: true },
                      { slug: 'grid-completo', name: 'Grid', color: '#9d4edd', dark: true },
                      { slug: 'parrilla-rustica', name: 'Parrilla', color: '#c0392b', dark: true },
                      { slug: 'libre-pro', name: 'Libre', color: '#ffffff', dark: true },
                    ].map((p) => {
                      const isActive = theme.preset_slug === p.slug;
                      const locked = plan.id === 'free';
                      return (
                        <button
                          key={p.slug}
                          type="button"
                          disabled={locked}
                          onClick={async () => {
                            if (locked) return;
                            // Aplicar preset via RPC
                            try {
                              const res = await fetch(`/api/menus/${initialMenu.id}/preset`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ preset_slug: p.slug }),
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.error || 'Error');
                              // Recargar tema desde data
                              if (data.theme) {
                                setTheme({
                                  color_secondary: data.theme.theme_color_secondary || '#1a1a2e',
                                  font: data.theme.theme_font || 'Inter',
                                  layout: data.theme.theme_layout || 'single',
                                  image_size: data.theme.theme_image_size || 'medium',
                                  card_style: data.theme.theme_card_style || 'expanded',
                                  cover_url: data.theme.theme_cover_url || '',
                                  show_search: data.theme.theme_show_search !== false,
                                  show_category_icons: data.theme.theme_show_category_icons !== false,
                                  rounded_corners: data.theme.theme_rounded_corners !== false,
                                  dark_mode: data.theme.theme_dark_mode !== false,
                                  preset_slug: p.slug,
                                } as any);
                              }
                              toast.success(`Tema "${p.name}" aplicado`);
                            } catch (err) {
                              toast.error(err instanceof Error ? err.message : 'Error al aplicar tema');
                            }
                          }}
                          className={`relative p-2 rounded-lg border text-xs transition overflow-hidden ${
                            isActive
                              ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40'
                              : 'border-white/10 hover:border-white/20'
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                          style={{
                            background: p.dark
                              ? `linear-gradient(135deg, ${p.color}33, #0a0a14)`
                              : `linear-gradient(135deg, ${p.color}, #ffffff)`,
                            color: p.dark ? '#fff' : '#1a1a2e',
                          }}
                        >
                          <div className="font-medium truncate">{p.name}</div>
                          <div
                            className="w-full h-1.5 rounded-full mt-1.5"
                            style={{ background: p.color }}
                          />
                          {locked && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-[9px] font-bold text-[#d4af37]">PRO</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {plan.id === 'free' && (
                    <p className="text-xs text-white/40">
                      Upgrade a Pro para aplicar temas pre-diseñados con 1 clic.
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-5">
                  <div className="text-xs uppercase tracking-wider text-white/40 mb-3">Personalización manual</div>
                </div>

                {/* Layout */}
                <div className="space-y-2">
                  <Label>Layout de platos</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { v: 'single', label: '1 columna', icon: '▮' },
                      { v: 'double', label: '2 columnas', icon: '▮▮' },
                      { v: 'grid', label: 'Grid 3 col', icon: '▮▮▮' },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        disabled={plan.id === 'free' && opt.v !== 'single'}
                        onClick={() => setTheme({ ...theme, layout: opt.v as any })}
                        className={`p-3 rounded-lg border text-sm transition ${
                          theme.layout === opt.v
                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        <div className="text-base mb-1">{opt.icon}</div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {plan.id === 'free' && (
                    <p className="text-xs text-white/40">2 columnas y grid requieren plan Pro.</p>
                  )}
                </div>

                {/* Tamaño de imagen */}
                <div className="space-y-2">
                  <Label>Tamaño de imagen del plato</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { v: 'none', label: 'Sin img' },
                      { v: 'small', label: 'Pequeña' },
                      { v: 'medium', label: 'Media' },
                      { v: 'large', label: 'Grande' },
                      { v: 'hero', label: 'Hero' },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        disabled={plan.id === 'free' && opt.v !== 'medium'}
                        onClick={() => setTheme({ ...theme, image_size: opt.v as any })}
                        className={`p-2 rounded-lg border text-xs transition ${
                          theme.image_size === opt.v
                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Estilo de tarjeta */}
                <div className="space-y-2">
                  <Label>Estilo de tarjeta</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { v: 'compact', label: 'Compacta' },
                      { v: 'expanded', label: 'Expandida' },
                      { v: 'minimal', label: 'Minimal' },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        disabled={plan.id === 'free' && opt.v !== 'expanded'}
                        onClick={() => setTheme({ ...theme, card_style: opt.v as any })}
                        className={`p-2 rounded-lg border text-xs transition ${
                          theme.card_style === opt.v
                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuente */}
                <div className="space-y-2">
                  <Label>Fuente tipográfica</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {['Inter', 'Poppins', 'Montserrat', 'Playfair Display', 'Lora', 'Roboto', 'Open Sans', 'Nunito'].map((font) => (
                      <button
                        key={font}
                        type="button"
                        disabled={plan.id === 'free' && font !== 'Inter'}
                        onClick={() => setTheme({ ...theme, font })}
                        style={{ fontFamily: font }}
                        className={`p-2 rounded-lg border text-sm transition ${
                          theme.font === font
                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        } disabled:opacity-40 disabled:cursor-not-allowed`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color secundario */}
                <div className="space-y-2">
                  <Label>Color secundario (fondo)</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={theme.color_secondary}
                      onChange={(e) => setTheme({ ...theme, color_secondary: e.target.value })}
                      disabled={plan.id === 'free'}
                      className="w-12 h-10 rounded cursor-pointer disabled:opacity-40"
                    />
                    <Input
                      value={theme.color_secondary}
                      onChange={(e) => setTheme({ ...theme, color_secondary: e.target.value })}
                      disabled={plan.id === 'free'}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-40"
                    />
                  </div>
                </div>

                {/* URL Cover */}
                <div className="space-y-2">
                  <Label>Imagen de portada (cover)</Label>
                  <Input
                    value={theme.cover_url}
                    onChange={(e) => setTheme({ ...theme, cover_url: e.target.value })}
                    placeholder="https://..."
                    disabled={plan.id === 'free'}
                    className="bg-white/5 border-white/10 text-white disabled:opacity-40"
                  />
                  {plan.id === 'free' && (
                    <p className="text-xs text-white/40">Cover personalizado requiere Pro.</p>
                  )}
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-2 gap-3">
                  <ToggleRow
                    label="Modo claro"
                    desc="Cambia fondo oscuro a claro"
                    value={!theme.dark_mode}
                    disabled={plan.id === 'free'}
                    onChange={(v) => setTheme({ ...theme, dark_mode: !v })}
                  />
                  <ToggleRow
                    label="Buscar platos"
                    desc="Barra de búsqueda en el menú"
                    value={theme.show_search}
                    disabled={plan.id === 'free'}
                    onChange={(v) => setTheme({ ...theme, show_search: v })}
                  />
                  <ToggleRow
                    label="Iconos de categoría"
                    desc="Emojis automáticos por categoría"
                    value={theme.show_category_icons}
                    disabled={plan.id === 'free'}
                    onChange={(v) => setTheme({ ...theme, show_category_icons: v })}
                  />
                  <ToggleRow
                    label="Esquinas redondeadas"
                    desc="Cards y botones con border-radius"
                    value={theme.rounded_corners}
                    disabled={plan.id === 'free'}
                    onChange={(v) => setTheme({ ...theme, rounded_corners: v })}
                  />
                  <ToggleRow
                    label="Lightbox de platos"
                    desc="Clic en plato abre galería grande con detalle"
                    value={theme.dish_gallery}
                    onChange={(v) => setTheme({ ...theme, dish_gallery: v })}
                  />
                </div>

                {/* ─── Estilo Carta (PedidosYa/Rappi horizontal carousel) ─── */}
                <div className="mt-5 pt-5 border-t border-white/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <h3 className="text-sm font-semibold text-white/90">Estilo Carta (PedidosYa/Rappi)</h3>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Cambia el layout del menú público a carruseles horizontales estilo PedidosYa/Rappi.
                    "Destacados" arriba + cada categoría deslizable hacia la derecha. Opcionalmente
                    con auto-scroll configurable.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <ToggleRow
                      label="Carrusel horizontal"
                      desc="Categorías como carrusel scrollear →"
                      value={theme.carta_style}
                      disabled={plan.id === 'free'}
                      onChange={(v) => {
                        // Si activamos carta_style, desactivamos carta_list_style (mutuamente excluyentes)
                        setTheme({ ...theme, carta_style: v, carta_list_style: v ? false : theme.carta_list_style });
                      }}
                    />
                    <ToggleRow
                      label="Lista Rappi"
                      desc="Texto izq + imagen pequeña der"
                      value={theme.carta_list_style}
                      disabled={plan.id === 'free'}
                      onChange={(v) => {
                        // Si activamos carta_list_style, desactivamos carta_style
                        setTheme({ ...theme, carta_list_style: v, carta_style: v ? false : theme.carta_style });
                      }}
                    />
                  </div>
                  {/* Auto-scroll (solo visible si carta_style está activo) */}
                  {theme.carta_style && (
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3">
                      <ToggleRow
                        label="Auto-scroll del Destacados"
                        desc="Carrusel se mueve solo; pausa al tocar"
                        value={theme.carta_autoscroll}
                        onChange={(v) => setTheme({ ...theme, carta_autoscroll: v })}
                      />
                      {theme.carta_autoscroll && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/70">Velocidad del scroll</span>
                            <span className="text-[#d4af37] font-mono font-semibold">
                              {theme.carta_scroll_speed} px/seg
                            </span>
                          </div>
                          <input
                            type="range"
                            min={10}
                            max={120}
                            step={5}
                            value={theme.carta_scroll_speed}
                            onChange={(e) =>
                              setTheme({ ...theme, carta_scroll_speed: parseInt(e.target.value) })
                            }
                            className="w-full accent-[#d4af37] cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-white/40">
                            <span>Lento (10)</span>
                            <span>Rápido (120)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAppearancePanel(false)}
                    className="text-white/60 hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      // Forzar guardado con tema
                      dirtyRef.current = true;
                      save(false).then(() => {
                        setShowAppearancePanel(false);
                        toast.success('Apariencia guardada');
                      });
                    }}
                    className="bg-gradient-to-r from-[#d4af37] to-[#f4d35e] text-[#1a1a2e]"
                  >
                    Guardar cambios
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Categories card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4 sm:mb-5 flex-wrap">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#f4d35e] flex items-center justify-center text-sm font-bold text-[#1a1a2e]">
                2
              </div>
              <h2 className="font-semibold text-sm sm:text-base flex-1 min-w-0">Categorías y platos</h2>
              <div className="ml-auto flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <input ref={importFileRef} type="file" accept=".json,.csv,.xls,.xlsx" className="hidden" onChange={handleImport} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => importFileRef.current?.click()}
                  disabled={importing}
                  className="text-white/60 hover:text-white hover:bg-white/5 text-xs h-9 px-2 sm:px-3"
                >
                  {importing ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Upload className="w-3.5 h-3.5 mr-1" />}
                  <span className="hidden sm:inline">Importar</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5 text-xs h-9 px-2 sm:px-3">
                      <Download className="w-3.5 h-3.5 mr-1" />
                      <span className="hidden sm:inline">Exportar</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#15152a] border-white/10">
                    <DropdownMenuItem onClick={() => handleExportMenu('json')} className="text-white focus:bg-white/5">JSON</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportMenu('csv')} className="text-white focus:bg-white/5">CSV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportMenu('excel')} className="text-white focus:bg-white/5">Excel (.xls)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportMenu('word')} className="text-white focus:bg-white/5">Word (.doc)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {importing && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-sm text-[#d4af37]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Importando platos desde archivo...
              </div>
            )}

            <div className="space-y-4">
              {categories.map((cat, ci) => (
                <div
                  key={cat.id}
                  className="bg-white/[0.02] border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Input
                      value={cat.name}
                      onChange={(e) => updateCategory(cat.id, e.target.value)}
                      placeholder={`Categoría ${ci + 1} (Ej: Entradas)`}
                      className="bg-white/5 border-white/10 text-white font-semibold"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(cat.id)}
                      className="text-white/40 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {cat.dishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="flex flex-col sm:grid sm:grid-cols-[64px_1fr] gap-3 p-3 bg-white/[0.02] border border-white/10 rounded-lg"
                      >
                        <div className="flex items-start gap-3 sm:block">
                          <ImageUploader
                            initialUrl={dish.image}
                            onUploaded={(url) => handleDishImageUploaded(cat.id, dish.id, url)}
                            plan={plan}
                            imagesCount={imagesCount}
                            shape="square"
                            size={64}
                          />
                        </div>
                        <div className="space-y-2 min-w-0 flex-1">
                          <Input
                            value={dish.name}
                            onChange={(e) => updateDish(cat.id, dish.id, 'name', e.target.value)}
                            placeholder="Nombre del plato"
                            className="bg-white/5 border-white/10 text-white h-9"
                          />
                          <Input
                            value={dish.description}
                            onChange={(e) => updateDish(cat.id, dish.id, 'description', e.target.value)}
                            placeholder="Descripción (opcional)"
                            className="bg-white/5 border-white/10 text-white h-9"
                          />
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40 font-semibold">
                                {menu.currency}
                              </span>
                              <Input
                                type="number"
                                step="0.10"
                                min="0"
                                value={dish.price}
                                onChange={(e) => updateDish(cat.id, dish.id, 'price', e.target.value)}
                                placeholder="0.00"
                                className="bg-white/5 border-white/10 text-white h-9 pl-10"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDish(cat.id, dish.id)}
                              className="text-white/40 hover:text-red-400 hover:bg-red-500/10 h-9 w-9"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Galería — imágenes según plan (Free 1, Pro 3, Premium 5, Full 10) */}
                          <details className="bg-white/[0.02] border border-white/10 rounded-md p-2">
                            <summary className="text-xs font-semibold text-white/70 cursor-pointer hover:text-white flex items-center gap-1.5 select-none">
                              <Images className="w-3.5 h-3.5" />
                              Galería ({(dish.gallery || []).length}/{plan.limits.maxImagesPerDish})
                              <span className="text-white/40 font-normal">· carrusel en la carta</span>
                              {plan.id !== 'full' && (dish.gallery || []).length >= plan.limits.maxImagesPerDish && (
                                <span className="ml-auto text-[10px] text-amber-400">
                                  ⚡ Sube de plan para más imágenes
                                </span>
                              )}
                            </summary>
                            <div className="mt-2 space-y-2">
                              <div className="flex flex-wrap gap-2">
                                {(dish.gallery || []).map((img, idx) => (
                                  <div key={idx} className="relative group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={deriveVariantUrl(img, 'thumb')}
                                      alt={`Imagen ${idx + 1}`}
                                      className="w-14 h-14 object-cover rounded-md border border-white/10"
                                      loading="lazy"
                                      decoding="async"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeDishGalleryImage(cat.id, dish.id, idx)}
                                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                {(dish.gallery || []).length < plan.limits.maxImagesPerDish && (
                                  <ImageUploader
                                    initialUrl=""
                                    onUploaded={(url) => addDishGalleryImage(cat.id, dish.id, url)}
                                    plan={plan}
                                    imagesCount={imagesCount}
                                    shape="square"
                                    size={56}
                                  />
                                )}
                              </div>
                              <p className="text-[10px] text-white/40 leading-relaxed">
                                La primera imagen es la principal. Agrega hasta 5 para que los clientes deslicen el carrusel.
                              </p>
                              {/* Demo button — fill gallery with sample food images (only shows if gallery is empty) */}
                              {(dish.gallery || []).length === 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Sample CC0 food images from Unsplash (stable URLs)
                                    const demo = [
                                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
                                      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop',
                                      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80&auto=format&fit=crop',
                                    ];
                                    demo.forEach((url) => addDishGalleryImage(cat.id, dish.id, url));
                                  }}
                                  className="text-[10px] text-amber-400 hover:text-amber-300 underline underline-offset-2"
                                >
                                  + Agregar 3 imágenes demo (probar carrusel)
                                </button>
                              )}
                            </div>
                          </details>

                          {/* Opciones / Extras / Salsas — personalización del cliente */}
                          <details className="bg-white/[0.02] border border-white/10 rounded-md p-2">
                            <summary className="text-xs font-semibold text-white/70 cursor-pointer hover:text-white flex items-center gap-1.5 select-none">
                              <Settings2 className="w-3.5 h-3.5" />
                              Opciones y extras ({(dish.options || []).length})
                              <span className="text-white/40 font-normal">· salsas, toppings, extras</span>
                            </summary>
                            <div className="mt-2 space-y-2">
                              {(dish.options || []).map((grp) => (
                                <div key={grp.id} className="bg-white/[0.02] border border-white/10 rounded-md p-2 space-y-2">
                                  <div className="flex gap-1.5 items-center">
                                    <Input
                                      value={grp.name}
                                      onChange={(e) => updateOptionGroup(cat.id, dish.id, grp.id, 'name', e.target.value)}
                                      placeholder="Nombre del grupo (ej: Salsas, Extras)"
                                      className="bg-white/5 border-white/10 text-white h-8 text-xs flex-1"
                                    />
                                    <select
                                      value={grp.type}
                                      onChange={(e) => updateOptionGroup(cat.id, dish.id, grp.id, 'type', e.target.value)}
                                      className="bg-white/5 border border-white/10 text-white h-8 text-xs rounded-md px-1.5"
                                    >
                                      <option value="single">Elige 1</option>
                                      <option value="multiple">Múltiple</option>
                                    </select>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeOptionGroup(cat.id, dish.id, grp.id)}
                                      className="text-white/40 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 shrink-0"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </Button>
                                  </div>
                                  <div className="flex gap-2 items-center text-[11px] text-white/50 pl-1">
                                    <label className="flex items-center gap-1 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={grp.required}
                                        onChange={(e) => updateOptionGroup(cat.id, dish.id, grp.id, 'required', e.target.checked)}
                                        className="accent-[#d4af37]"
                                      />
                                      Obligatorio
                                    </label>
                                    {grp.type === 'multiple' && (
                                      <label className="flex items-center gap-1">
                                        Máx:
                                        <input
                                          type="number"
                                          min="1"
                                          max="20"
                                          value={grp.max}
                                          onChange={(e) => updateOptionGroup(cat.id, dish.id, grp.id, 'max', Number(e.target.value))}
                                          className="bg-white/5 border border-white/10 text-white w-12 h-6 rounded text-center"
                                        />
                                      </label>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    {grp.items.map((it) => (
                                      <div key={it.id} className="flex gap-1.5 items-center">
                                        <Input
                                          value={it.name}
                                          onChange={(e) => updateOptionItem(cat.id, dish.id, grp.id, it.id, 'name', e.target.value)}
                                          placeholder="Nombre (ej: Ají, Papas extra)"
                                          className="bg-white/5 border-white/10 text-white h-7 text-xs flex-1"
                                        />
                                        <div className="relative w-20">
                                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-white/40 font-semibold">
                                            {menu.currency}
                                          </span>
                                          <Input
                                            type="number"
                                            step="0.10"
                                            min="0"
                                            value={it.price}
                                            onChange={(e) => updateOptionItem(cat.id, dish.id, grp.id, it.id, 'price', e.target.value)}
                                            placeholder="0.00"
                                            className="bg-white/5 border-white/10 text-white h-7 text-xs pl-7"
                                          />
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeOptionItem(cat.id, dish.id, grp.id, it.id)}
                                          className="text-white/40 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 shrink-0"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ))}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => addOptionItem(cat.id, dish.id, grp.id)}
                                      className="h-7 text-[11px] text-white/60 hover:text-white hover:bg-white/5"
                                    >
                                      <Plus className="w-3 h-3" /> Agregar opción
                                    </Button>
                                  </div>
                                </div>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addOptionGroup(cat.id, dish.id)}
                                className="w-full h-7 text-[11px] text-[#d4af37] hover:text-[#d4af37] hover:bg-[#d4af37]/10 border border-dashed border-[#d4af37]/40"
                              >
                                <Plus className="w-3 h-3" /> Agregar grupo de opciones
                              </Button>
                            </div>
                          </details>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addDish(cat.id)}
                      className="w-full text-[#d4af37] hover:text-[#d4af37] hover:bg-[#d4af37]/10 border border-dashed border-[#d4af37]/40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Agregar plato
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={addCategory}
                className="w-full text-[#d4af37] hover:text-[#d4af37] hover:bg-[#d4af37]/10 border border-dashed border-[#d4af37]/40"
              >
                <Plus className="w-3.5 h-3.5" />
                Agregar categoría
              </Button>
            </div>
          </div>
        </section>

        {/* Preview pane — desktop: sidebar, mobile: collapsible floating button */}
        <aside className="border-l border-white/10 bg-[#0a0a14] lg:sticky lg:top-[65px] lg:h-[calc(100vh-65px)] p-4 flex-col hidden lg:flex">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white/70">Vista previa</span>
            </div>
            <span className="text-xs text-white/40">Mobile</span>
          </div>
          <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-white/10 relative">
            <iframe
              srcDoc={previewHtml}
              title="Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          {plan.limits.hasBranding && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs text-[#d4af37] text-center">
              {plan.id === 'free'
                ? 'Marca "Creado con MenuPro" visible · Sube a Premium (S/ 99/mes) para quitarla (white label)'
                : 'Marca "Creado con MenuPro" visible · Sube a Premium (S/ 99/mes) para white label completo'}
            </div>
          )}
        </aside>
      </main>

      {/* Mobile preview FAB + bottom sheet */}
      <button
        onClick={() => setShowPreviewMobile(!showPreviewMobile)}
        className="lg:hidden fixed bottom-4 right-4 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37] to-[#f4d35e] text-[#1a1a2e] shadow-2xl shadow-[#d4af37]/40 flex items-center justify-center font-bold text-xs safe-bottom"
        aria-label="Ver preview"
      >
        {showPreviewMobile ? <X className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>

      {showPreviewMobile && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-end"
          onClick={() => setShowPreviewMobile(false)}
        >
          <div
            className="bg-[#0a0a14] border-t border-white/10 rounded-t-3xl w-full h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-white/70 font-medium">Vista previa mobile</span>
              </div>
              <button
                onClick={() => setShowPreviewMobile(false)}
                className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                aria-label="Cerrar preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-black overflow-hidden p-2">
              <iframe
                srcDoc={previewHtml}
                title="Preview mobile"
                className="w-full h-full border-0 rounded-xl"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────── Componente ToggleRow para el panel de Apariencia ─────────
function ToggleRow({
  label,
  desc,
  value,
  onChange,
  disabled,
}: {
  label: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!value)}
      className={`text-left p-3 rounded-lg border transition ${
        value
          ? 'border-[#d4af37]/40 bg-[#d4af37]/5'
          : 'border-white/10 bg-white/5'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span
          className={`w-8 h-4 rounded-full relative transition ${
            value ? 'bg-[#d4af37]' : 'bg-white/15'
          }`}
        >
          <span
            className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
              value ? 'left-4' : 'left-0.5'
            }`}
          />
        </span>
      </div>
      <div className="text-xs text-white/50">{desc}</div>
    </button>
  );
}

// ───────── Componente SocialInput para redes sociales ─────────
function SocialInput({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-white/50">
        {icon}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white/5 border-white/10 text-white h-9 pl-10 text-sm"
      />
    </div>
  );
}
