-- ════════════════════════════════════════════════════════════
-- VERIFICACIÓN
-- ════════════════════════════════════════════════════════════
DO $$ BEGIN
  RAISE NOTICE '✅ Organización de mozos creada para cuenta demo';
  RAISE NOTICE '📊 Resumen: 5 restaurantes, 5 sucursales, 59 mesas, 22 mozos';
  RAISE NOTICE '📊 Inventario: 64 insumos, 71 recetas, 64 movimientos';
  RAISE NOTICE '📊 Comandas: 27 comandas, 75 ítems, 5 vouchers';
END $$;

SELECT 'sucursales' AS tabla, COUNT(*) AS total FROM branches WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'mesas', COUNT(*) FROM tables WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'mozos', COUNT(*) FROM waiters WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'insumos', COUNT(*) FROM inventory_items WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'recetas', COUNT(*) FROM product_recipes WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'comandas', COUNT(*) FROM orders WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'items', COUNT(*) FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'movimientos', COUNT(*) FROM inventory_movements WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
UNION ALL SELECT 'vouchers', COUNT(*) FROM voucher_prints WHERE owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid;

-- ════════════════════════════════════════════════════════════
-- FIN DEL SCRIPT
-- ════════════════════════════════════════════════════════════

