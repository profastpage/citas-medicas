-- ============================================================
-- MenuPro — Migración inicial
-- Generada para: supabase db push
-- Project ref: bkxtploibraiovgrjtwn
-- ============================================================

-- 1) ENUM para planes
CREATE TYPE user_plan AS ENUM ('free', 'pro');

-- 2) Tabla profiles (1:1 con auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan user_plan NOT NULL DEFAULT 'free',
  mp_preapproval_id TEXT,
  mp_status TEXT,
  current_period_end TIMESTAMPTZ,
  bg_removals_used INTEGER NOT NULL DEFAULT 0,
  bg_removals_reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_self" ON profiles;
CREATE POLICY "profiles_select_self" ON profiles
  FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_self" ON profiles;
CREATE POLICY "profiles_update_self" ON profiles
  FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_insert_self" ON profiles;
CREATE POLICY "profiles_insert_self" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3) Trigger: crear profile automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4) Tabla menus
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  slogan TEXT,
  description TEXT,
  whatsapp TEXT NOT NULL,
  logo_url TEXT,
  color TEXT NOT NULL DEFAULT '#ff6b35',
  currency TEXT NOT NULL DEFAULT 'S/',
  branding_text TEXT DEFAULT 'Creado con MenuPro',
  is_published BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_menus_user_id ON menus(user_id);
CREATE INDEX IF NOT EXISTS idx_menus_slug ON menus(slug);
CREATE UNIQUE INDEX IF NOT EXISTS menus_user_slug_unique ON menus(user_id, slug);

DROP POLICY IF EXISTS "menus_select_own" ON menus;
CREATE POLICY "menus_select_own" ON menus
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "menus_insert_own" ON menus;
CREATE POLICY "menus_insert_own" ON menus
  FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "menus_update_own" ON menus;
CREATE POLICY "menus_update_own" ON menus
  FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "menus_delete_own" ON menus;
CREATE POLICY "menus_delete_own" ON menus
  FOR DELETE USING (auth.uid() = user_id);

-- 5) Tabla categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_categories_menu_id ON categories(menu_id);

DROP POLICY IF EXISTS "categories_select_own" ON categories;
CREATE POLICY "categories_select_own" ON categories
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM menus WHERE menus.id = categories.menu_id AND menus.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "categories_insert_own" ON categories;
CREATE POLICY "categories_insert_own" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM menus WHERE menus.id = categories.menu_id AND menus.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "categories_update_own" ON categories;
CREATE POLICY "categories_update_own" ON categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM menus WHERE menus.id = categories.menu_id AND menus.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "categories_delete_own" ON categories;
CREATE POLICY "categories_delete_own" ON categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM menus WHERE menus.id = categories.menu_id AND menus.user_id = auth.uid())
  );

-- 6) Tabla dishes
CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_dishes_category_id ON dishes(category_id);

DROP POLICY IF EXISTS "dishes_select_own" ON dishes;
CREATE POLICY "dishes_select_own" ON dishes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM categories
      JOIN menus ON menus.id = categories.menu_id
      WHERE categories.id = dishes.category_id AND menus.user_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "dishes_insert_own" ON dishes;
CREATE POLICY "dishes_insert_own" ON dishes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM categories
      JOIN menus ON menus.id = categories.menu_id
      WHERE categories.id = dishes.category_id AND menus.user_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "dishes_update_own" ON dishes;
CREATE POLICY "dishes_update_own" ON dishes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM categories
      JOIN menus ON menus.id = categories.menu_id
      WHERE categories.id = dishes.category_id AND menus.user_id = auth.uid()
    )
  );
DROP POLICY IF EXISTS "dishes_delete_own" ON dishes;
CREATE POLICY "dishes_delete_own" ON dishes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM categories
      JOIN menus ON menus.id = categories.menu_id
      WHERE categories.id = dishes.category_id AND menus.user_id = auth.uid()
    )
  );

-- 7) Tabla menu_views (analytics)
CREATE TABLE IF NOT EXISTS menu_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES menus(id) ON DELETE CASCADE,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE menu_views ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_menu_views_menu_id ON menu_views(menu_id);

DROP POLICY IF EXISTS "menu_views_select_own" ON menu_views;
CREATE POLICY "menu_views_select_own" ON menu_views
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM menus WHERE menus.id = menu_views.menu_id AND menus.user_id = auth.uid())
  );
DROP POLICY IF EXISTS "menu_views_insert_any" ON menu_views;
CREATE POLICY "menu_views_insert_any" ON menu_views
  FOR INSERT WITH CHECK (true);

-- 8) Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('menus', 'menus', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "menus_storage_select_all" ON storage.objects;
CREATE POLICY "menus_storage_select_all" ON storage.objects
  FOR SELECT USING (bucket_id = 'menus');

DROP POLICY IF EXISTS "menus_storage_insert_own" ON storage.objects;
CREATE POLICY "menus_storage_insert_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'menus' AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "menus_storage_update_own" ON storage.objects;
CREATE POLICY "menus_storage_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'menus' AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "menus_storage_delete_own" ON storage.objects;
CREATE POLICY "menus_storage_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'menus' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 9) Trigger updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS touch_profiles ON profiles;
CREATE TRIGGER touch_profiles BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS touch_menus ON menus;
CREATE TRIGGER touch_menus BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 10) RPC: incrementar vistas
CREATE OR REPLACE FUNCTION public.increment_menu_views(menu_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE menus SET views_count = views_count + 1 WHERE id = menu_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11) RPC: incrementar "Quitar fondo" con reset mensual automático
CREATE OR REPLACE FUNCTION public.increment_bg_removals(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  current_used INTEGER;
  current_reset TIMESTAMPTZ;
  new_value INTEGER;
BEGIN
  SELECT bg_removals_used, bg_removals_reset_at
    INTO current_used, current_reset
  FROM profiles WHERE id = user_uuid;

  IF current_reset IS NULL OR NOW() - current_reset >= INTERVAL '30 days' THEN
    new_value := 1;
    UPDATE profiles
      SET bg_removals_used = 1, bg_removals_reset_at = NOW()
      WHERE id = user_uuid;
  ELSE
    new_value := current_used + 1;
    UPDATE profiles
      SET bg_removals_used = current_used + 1
      WHERE id = user_uuid;
  END IF;

  RETURN new_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12) RPC: obtener cuota disponible de "Quitar fondo"
CREATE OR REPLACE FUNCTION public.get_bg_removals_quota(user_uuid UUID, monthly_limit INTEGER)
RETURNS JSON AS $$
DECLARE
  current_used INTEGER;
  current_reset TIMESTAMPTZ;
  effective_used INTEGER;
  effective_reset TIMESTAMPTZ;
BEGIN
  SELECT bg_removals_used, bg_removals_reset_at
    INTO current_used, current_reset
  FROM profiles WHERE id = user_uuid;

  IF current_reset IS NULL OR NOW() - current_reset >= INTERVAL '30 days' THEN
    effective_used := 0;
    effective_reset := NOW();
  ELSE
    effective_used := COALESCE(current_used, 0);
    effective_reset := current_reset;
  END IF;

  RETURN json_build_object(
    'used', effective_used,
    'limit', monthly_limit,
    'remaining', GREATEST(monthly_limit - effective_used, 0),
    'reset_at', effective_reset
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
