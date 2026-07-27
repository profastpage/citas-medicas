-- ============================================================
-- MenuPro — Image Optimization: Storage Cache & Lifecycle Policy
-- ============================================================
--
-- Este script configura Supabase Storage para que las imágenes
-- optimizadas (WebP multi-size) se sirvan con cache de 1 año y
-- tengan una política de lifecycle adecuada.
--
-- IMPORTANTE: Este script NO es necesario ejecutarlo para que las
-- imágenes funcionen. La aplicación ya envía `cacheControl: '31536000'`
-- en cada upload. Pero si quieres configurar el bucket a nivel de
-- Supabase (recomendado para producción), ejecuta esto una vez.
--
-- Ejecutar en: Supabase → SQL Editor
-- ============================================================

-- 1. Verificar que el bucket "menus" existe (debería ya existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'menus',
  'menus',
  true,                                -- público (lectura sin auth)
  15728640,                            -- 15MB límite por archivo
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'image/bmp'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 15728640,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'image/bmp'
  ];

-- 2. Política RLS: el bucket es público para lectura, pero solo
--    usuarios autenticados pueden escribir en su propia carpeta.
--    (Estas políticas suelen estar ya configuradas, pero las
--     dejamos idempotentes por si acaso.)

-- Lectura pública (cualquiera puede ver las imágenes)
DROP POLICY IF EXISTS "menus_public_read" ON storage.objects;
CREATE POLICY "menus_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'menus');

-- Escritura: solo el owner puede subir a su carpeta {user_id}/...
DROP POLICY IF EXISTS "menus_owner_write" ON storage.objects;
CREATE POLICY "menus_owner_write" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'menus'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Update: solo el owner puede modificar sus archivos
DROP POLICY IF EXISTS "menus_owner_update" ON storage.objects;
CREATE POLICY "menus_owner_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'menus'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Delete: solo el owner puede borrar sus archivos
DROP POLICY IF EXISTS "menus_owner_delete" ON storage.objects;
CREATE POLICY "menus_owner_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'menus'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. Nota sobre Cache-Control:
--    La API ya envía `cacheControl: '31536000'` (1 año) en cada upload.
--    Supabase Storage respeta este header y lo sirve en la respuesta HTTP
--    como `Cache-Control: max-age=31536000, public`.
--
--    Esto significa que los navegadores y CDNs cachearán las imágenes
--    por 1 año. Como las URLs son inmutables (cada upload genera un
--    timestamp+random único), no hay riesgo de servir contenido obsoleto.
--
-- 4. Verificación final
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════════════════';
  RAISE NOTICE '✅ Storage bucket "menus" configurado correctamente';
  RAISE NOTICE '   - Público para lectura (sin auth)';
  RAISE NOTICE '   - Solo owner puede escribir/modificar/borrar';
  RAISE NOTICE '   - Límite: 15MB por archivo';
  RAISE NOTICE '   - Formatos: JPEG, PNG, WebP, AVIF, GIF, BMP';
  RAISE NOTICE '   - Cache-Control: 1 año (inmutable)';
  RAISE NOTICE '═══════════════════════════════════════════════════';
END $$;
