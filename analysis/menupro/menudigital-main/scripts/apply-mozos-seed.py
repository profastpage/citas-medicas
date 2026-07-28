#!/usr/bin/env python3
"""
Execute SQL files against Supabase database.
Logs progress to stdout, errors to stderr.
"""
import os
import sys
import psycopg2
from psycopg2 import sql
from pathlib import Path

PASSWORD = os.environ.get("SUPABASE_DB_PASSWORD")
if not PASSWORD:
    print("ERROR: SUPABASE_DB_PASSWORD not set", file=sys.stderr)
    sys.exit(1)

HOST = "aws-0-sa-east-1.pooler.supabase.com"
PORT = 5432
DATABASE = "postgres"
USER = "postgres.bkxtploibraiovgrjtwn"

DEMO_USER_ID = "2f2a30d8-bea6-5a5c-9787-040fe0ba1f15"

def log(msg, level="INFO"):
    print(f"[{level}] {msg}", flush=True)

def run_sql_file(conn, filepath):
    """Execute a SQL file. Returns (success, notices, error)."""
    content = Path(filepath).read_text()
    cur = conn.cursor()
    try:
        # Capture notices
        conn.autocommit = False
        cur.execute(content)
        conn.commit()
        notices = list(conn.notices) if hasattr(conn, 'notices') else []
        conn.notices = [] if hasattr(conn, 'notices') else None
        return True, notices, None
    except Exception as e:
        conn.rollback()
        return False, [], str(e)
    finally:
        cur.close()

def run_sql_query(conn, query, params=None):
    """Execute a SELECT and return rows."""
    cur = conn.cursor()
    try:
        cur.execute(query, params)
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description] if cur.description else []
        return cols, rows
    finally:
        cur.close()

def main():
    log(f"🔌 Conectando a {HOST}:{PORT}/{DATABASE} como {USER}...")
    try:
        conn = psycopg2.connect(
            host=HOST, port=PORT, dbname=DATABASE, user=USER,
            password=PASSWORD, connect_timeout=15
        )
        log("✅ Conectado")
    except Exception as e:
        log(f"❌ Error de conexión: {e}", "ERROR")
        sys.exit(2)
    
    # === STEP 1: Apply UNIQUE constraint fixes ===
    log("\n" + "="*60)
    log("STEP 1: Aplicar fixes de restricciones UNIQUE (tables + inventory_items)")
    log("="*60)
    
    for fix_file in [
        "/home/z/my-project/supabase/fix-tables-unique-constraint.sql",
        "/home/z/my-project/supabase/fix-inventory-unique-constraint.sql",
    ]:
        log(f"\n▶ Aplicando {Path(fix_file).name}...")
        ok, notices, err = run_sql_file(conn, fix_file)
        if not ok:
            log(f"❌ Error en fix: {err}", "ERROR")
            sys.exit(3)
        for n in notices[-7:]:
            log(f"  📝 {n.strip()}")
        log(f"✅ {Path(fix_file).name} OK")
    
    # Verify constraints
    cols, rows = run_sql_query(conn, """
        SELECT conname FROM pg_constraint
        WHERE conrelid = 'tables'::regclass AND contype = 'u'
        ORDER BY conname;
    """)
    log(f"\n  Restricciones UNIQUE en tables: {[r[0] for r in rows]}")
    cols, rows = run_sql_query(conn, """
        SELECT conname FROM pg_constraint
        WHERE conrelid = 'inventory_items'::regclass AND contype = 'u'
        ORDER BY conname;
    """)
    log(f"  Restricciones UNIQUE en inventory_items: {[r[0] for r in rows]}")
    
    # === STEP 2: Clean up manually-created demo data ===
    log("\n" + "="*60)
    log("STEP 2: Limpiar datos manuales previos del usuario demo")
    log("="*60)
    cleanup_queries = [
        ("order_items", "DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE owner_id = %s::uuid)"),
        ("order_status_history", "DELETE FROM order_status_history WHERE order_id IN (SELECT id FROM orders WHERE owner_id = %s::uuid)"),
        ("orders", "DELETE FROM orders WHERE owner_id = %s::uuid"),
        ("voucher_prints", "DELETE FROM voucher_prints WHERE owner_id = %s::uuid"),
        ("inventory_movements", "DELETE FROM inventory_movements WHERE owner_id = %s::uuid"),
        ("product_recipes", "DELETE FROM product_recipes WHERE owner_id = %s::uuid"),
        ("inventory_items", "DELETE FROM inventory_items WHERE owner_id = %s::uuid"),
        ("waiters", "DELETE FROM waiters WHERE owner_id = %s::uuid"),
        ("tables", "DELETE FROM tables WHERE owner_id = %s::uuid"),
        ("branches", "DELETE FROM branches WHERE owner_id = %s::uuid"),
    ]
    for table, q in cleanup_queries:
        cur = conn.cursor()
        cur.execute(q, (DEMO_USER_ID,))
        deleted = cur.rowcount
        conn.commit()
        cur.close()
        if deleted > 0:
            log(f"  🗑️  {table}: {deleted} registros eliminados")
        else:
            log(f"  ✓ {table}: ya estaba limpio")
    
    # === STEP 3: Execute the mozos seed in order ===
    log("\n" + "="*60)
    log("STEP 3: Ejecutar seed-demo-mozos-org.sql (9798 líneas, 325 KB)")
    log("="*60)
    
    # Try the full file first; if it fails, run parts
    seed_file = "/home/z/my-project/supabase/seed-demo-mozos-org.sql"
    log(f"Ejecutando {seed_file}...")
    ok, notices, err = run_sql_file(conn, seed_file)
    if not ok:
        log(f"❌ Error ejecutando seed completo: {err[:200]}", "ERROR")
        log("Intentando ejecutar por partes...", "WARN")
        
        parts_dir = Path("/home/z/my-project/download/seed-mozos-parts")
        parts = sorted(parts_dir.glob("*.sql"))
        for part in parts:
            log(f"\n▶ Ejecutando {part.name}...")
            ok, notices, err = run_sql_file(conn, str(part))
            if not ok:
                log(f"❌ Error en {part.name}: {err[:300]}", "ERROR")
                sys.exit(4)
            for n in notices[-3:]:  # last 3 notices
                log(f"  📝 {n.strip()}")
            log(f"✅ {part.name} OK")
    else:
        for n in notices[-10:]:  # last 10 notices
            log(f"  📝 {n.strip()}")
        log("✅ Seed completo ejecutado en una sola pasada")
    
    # === STEP 4: Final verification ===
    log("\n" + "="*60)
    log("STEP 4: Verificación final")
    log("="*60)
    cols, rows = run_sql_query(conn, """
        SELECT 'sucursales' AS tabla, COUNT(*) AS total FROM branches WHERE owner_id = %s::uuid
        UNION ALL SELECT 'mesas', COUNT(*) FROM tables WHERE owner_id = %s::uuid
        UNION ALL SELECT 'mozos', COUNT(*) FROM waiters WHERE owner_id = %s::uuid
        UNION ALL SELECT 'insumos', COUNT(*) FROM inventory_items WHERE owner_id = %s::uuid
        UNION ALL SELECT 'recetas', COUNT(*) FROM product_recipes WHERE owner_id = %s::uuid
        UNION ALL SELECT 'comandas', COUNT(*) FROM orders WHERE owner_id = %s::uuid
        UNION ALL SELECT 'items', COUNT(*) FROM order_items oi JOIN orders o ON o.id=oi.order_id WHERE o.owner_id=%s::uuid
        UNION ALL SELECT 'movimientos', COUNT(*) FROM inventory_movements WHERE owner_id = %s::uuid
        UNION ALL SELECT 'vouchers', COUNT(*) FROM voucher_prints WHERE owner_id = %s::uuid
    """, (DEMO_USER_ID,)*9)
    
    print(f"\n{'Tabla':<15} {'Esperado':<10} {'Actual':<10} {'OK?':<5}")
    print("-" * 45)
    expected = {
        'sucursales': 5, 'mesas': 59, 'mozos': 22,
        'insumos': 64, 'recetas': 71, 'comandas': 27,
        'items': 75, 'movimientos': 64, 'vouchers': 5
    }
    all_ok = True
    for tabla, count in rows:
        exp = expected.get(tabla, '?')
        ok = "✅" if count == exp else "❌"
        if count != exp:
            all_ok = False
        print(f"{tabla:<15} {exp:<10} {count:<10} {ok:<5}")
    
    # Sample some waiters to show their QR tokens
    log("\n📊 Muestra de mozos con QR tokens (primeros 5):")
    cols, rows = run_sql_query(conn, """
        SELECT w.full_name, w.qr_token, b.name AS branch
        FROM waiters w
        LEFT JOIN branches b ON b.id = w.branch_id
        WHERE w.owner_id = %s::uuid
        ORDER BY w.full_name
        LIMIT 5
    """, (DEMO_USER_ID,))
    print(f"\n{'Nombre':<25} {'Sucursal':<40} {'QR Token':<50}")
    print("-" * 115)
    for name, token, branch in rows:
        print(f"{name:<25} {(branch or '-')[:38]:<40} {token[:48]:<50}")
    
    log("\n" + "="*60)
    if all_ok:
        log("🎉 ¡TODO LISTO! Cuenta demo completamente poblada para producción")
    else:
        log("⚠️  Algunos conteos no coinciden — revisar logs arriba", "WARN")
    log("="*60)
    
    conn.close()

if __name__ == "__main__":
    main()
