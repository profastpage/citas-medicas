#!/usr/bin/env python3
"""
Test connection to Supabase Postgres database.
DO NOT echo the password anywhere.
"""
import os
import sys
import psycopg2

# Read password from env var only — never hardcode
PASSWORD = os.environ.get("SUPABASE_DB_PASSWORD")
if not PASSWORD:
    print("ERROR: SUPABASE_DB_PASSWORD env var not set", file=sys.stderr)
    sys.exit(1)

HOST = "db.bkxtploibraiovgrjtwn.supabase.co"
PORT = 5432
DATABASE = "postgres"
USER = "postgres"

print(f"🔌 Conectando a {HOST}:{PORT}/{DATABASE} como {USER}...")

try:
    conn = psycopg2.connect(
        host=HOST, port=PORT, dbname=DATABASE, user=USER,
        password=PASSWORD, connect_timeout=15
    )
    print("✅ Conexión exitosa!")
    
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()[0]
    print(f"📊 PostgreSQL version: {version[:80]}...")
    
    cur.execute("SELECT current_database(), current_user;")
    db, user = cur.fetchone()
    print(f"📊 DB: {db} | User: {user}")
    
    # Quick state check
    cur.execute("""
        SELECT 'menus' AS t, COUNT(*) FROM menus WHERE user_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
        UNION ALL SELECT 'categories', COUNT(*) FROM categories c JOIN menus m ON m.id=c.menu_id WHERE m.user_id='2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
        UNION ALL SELECT 'dishes', COUNT(*) FROM dishes d JOIN categories c ON c.id=d.category_id JOIN menus m ON m.id=c.menu_id WHERE m.user_id='2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
        UNION ALL SELECT 'branches', COUNT(*) FROM branches WHERE owner_id='2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
        UNION ALL SELECT 'tables', COUNT(*) FROM tables WHERE owner_id='2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
        UNION ALL SELECT 'waiters', COUNT(*) FROM waiters WHERE owner_id='2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
        UNION ALL SELECT 'orders', COUNT(*) FROM orders WHERE owner_id='2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
    """)
    rows = cur.fetchall()
    print("\n📊 Estado actual de la cuenta demo:")
    print(f"{'Tabla':<15} {'Count':<8}")
    print("-" * 25)
    for t, c in rows:
        print(f"{t:<15} {c:<8}")
    
    # Check constraint on tables
    cur.execute("""
        SELECT conname FROM pg_constraint
        WHERE conrelid = 'tables'::regclass AND contype = 'u'
        ORDER BY conname;
    """)
    constraints = [r[0] for r in cur.fetchall()]
    print(f"\n📊 Restricciones UNIQUE en tabla `tables`: {constraints}")
    
    cur.close()
    conn.close()
    print("\n✅ Conexión cerrada correctamente")
    
except psycopg2.OperationalError as e:
    print(f"❌ Error de conexión: {e}", file=sys.stderr)
    sys.exit(2)
except Exception as e:
    print(f"❌ Error: {e}", file=sys.stderr)
    sys.exit(3)
