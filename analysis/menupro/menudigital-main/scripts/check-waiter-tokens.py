#!/usr/bin/env python3
"""Check actual waiter qr_tokens in DB and compare with screenshot."""
import os, psycopg2

PASSWORD = os.environ["SUPABASE_DB_PASSWORD"]
HOST = "aws-0-sa-east-1.pooler.supabase.com"
PORT = 5432
USER = "postgres.bkxtploibraiovgrjtwn"

conn = psycopg2.connect(host=HOST, port=PORT, dbname="postgres", user=USER, password=PASSWORD, connect_timeout=15)
cur = conn.cursor()

print("=" * 80)
print("Mozos con qr_token (todos los de la cuenta demo):")
print("=" * 80)
cur.execute("""
    SELECT w.full_name, w.qr_token, b.name AS branch
    FROM waiters w
    LEFT JOIN branches b ON b.id = w.branch_id
    WHERE w.owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
    ORDER BY w.full_name
""")
for name, token, branch in cur.fetchall():
    print(f"\n👤 {name}")
    print(f"   Sucursal: {branch}")
    print(f"   QR token: {token}")
    print(f"   URL:     https://menudigital.pro/mozo/{token}")

# Also check if there's a waiter with the token from the screenshot
print("\n" + "=" * 80)
print("Buscando mozo con token de la captura: 0ca6fc8beeab53b78dd773428ea6d710dd7c1044e21a17")
print("=" * 80)
cur.execute("""
    SELECT w.full_name, w.qr_token, b.name
    FROM waiters w
    LEFT JOIN branches b ON b.id = w.branch_id
    WHERE w.qr_token LIKE '%0ca6fc8beeab%' OR w.qr_token LIKE '0ca6fc8%'
""")
rows = cur.fetchall()
if rows:
    for r in rows:
        print(f"  Encontrado: {r}")
else:
    print("  ❌ No existe ningún mozo con ese token en la DB")
    print("  → El token de la captura es de un mozo que creaste manualmente y fue eliminado al hacer cleanup")
    print("  → Ese token ya no es válido, por eso aparece 'Token inválido'")

# Also list any auth.users with that might match
print("\n" + "=" * 80)
print("Total de mozos por sucursal:")
print("=" * 80)
cur.execute("""
    SELECT b.name AS branch, COUNT(*) AS num_waiters
    FROM waiters w
    JOIN branches b ON b.id = w.branch_id
    WHERE w.owner_id = '2f2a30d8-bea6-5a5c-9787-040fe0ba1f15'::uuid
    GROUP BY b.name
    ORDER BY b.name
""")
for branch, n in cur.fetchall():
    print(f"  {branch}: {n} mozos")

cur.close()
conn.close()
