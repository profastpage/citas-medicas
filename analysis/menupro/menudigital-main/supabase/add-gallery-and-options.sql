-- ============================================================
-- MenuPro: Agregar galería (hasta 5 imágenes) + opciones (extras) a los platos
-- Ejecutar en: Supabase SQL Editor
-- ============================================================

-- 1. Agregar columna gallery (array de URLs, hasta 5 imágenes)
ALTER TABLE dishes
  ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';

-- 2. Agregar columna options (JSONB con grupos de extras/salsas/personalizaciones)
ALTER TABLE dishes
  ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::jsonb;

-- 3. Comentario para documentación
COMMENT ON COLUMN dishes.gallery IS 'Array de URLs de imágenes adicionales (máx 5). La primera imagen también debe estar en image_url para compatibilidad.';
COMMENT ON COLUMN dishes.options IS 'Array de grupos de opciones para personalizar el plato. Estructura: [{id, name, type:single|multiple, required, max, items:[{id, name, price}]}]';

-- 4. RLS: las policies existentes en dishes ya cubren gallery y options
-- (no se necesita nueva policy porque gallery y options son columnas de dishes)

-- 5. Ejemplo de estructura JSON para la columna options:
-- [
--   {
--     "id": "salsas",
--     "name": "Salsas",
--     "type": "single",
--     "required": false,
--     "max": 1,
--     "items": [
--       {"id": "aji", "name": "Ají de la casa", "price": 0},
--       {"id": "mayo", "name": "Mayonesa", "price": 0},
--       {"id": "ketchup", "name": "Ketchup", "price": 0}
--     ]
--   },
--   {
--     "id": "extras",
--     "name": "Extras",
--     "type": "multiple",
--     "required": false,
--     "max": 3,
--     "items": [
--       {"id": "papas", "name": "Papas extra", "price": 3.00},
--       {"id": "ensalada", "name": "Ensalada extra", "price": 2.50},
--       {"id": "huevo", "name": "Huevo frito", "price": 1.50}
--     ]
--   }
-- ]

-- 6. (Opcional) Para platos existentes, copiar image_url a gallery[0] si está vacío
UPDATE dishes
SET gallery = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND image_url != ''
  AND (gallery IS NULL OR array_length(gallery, 1) IS NULL OR array_length(gallery, 1) = 0);

-- ============================================================
-- FIN — NO borrar columnas existentes, solo agregar nuevas
-- ============================================================
