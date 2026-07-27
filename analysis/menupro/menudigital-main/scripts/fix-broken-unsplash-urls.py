#!/usr/bin/env python3
"""
Reemplaza los 14 photo IDs rotos en el SQL generado con IDs alternativos que sí funcionan.
Operación directa sobre el archivo SQL (más simple que editar el generador).
"""
import re
import shutil

SRC = "/home/z/my-project/supabase/seed-demo-account.sql"
DST_DOWNLOAD = "/home/z/my-project/download/seed-demo-account.sql"

# Mapeo: photo ID roto → photo ID alternativo OK (verificado)
REPLACEMENTS = {
    # Pollo picante → pollo alternativo OK
    "1598527945057-3f8c3c2c7c7e": "1555939594-58d7cb561ad1",
    # Cuarto de pollo extra → pollo OK
    "1608039829572-78524f79c4c4": "1606756790138-261d2b21cd75",
    # Medio pollo broaster (placeholder roto) → pollo OK
    "1626647586-to-be-replaced-1": "1555939594-58d7cb561ad1",
    # Alitas broaster → alitas OK
    "1567620832903-9fcdbdecb854": "1598103442097-8b74394b95c6",
    # Inca kola → drink OK
    "1620210053792-8f9e9d6c7e6e": "1437418747212-8d9709afab22",
    # Sopa wantán → food genérico OK
    "1569731335424-53d6a6a3c8e0": "1504674900247-0877df9cc836",
    # Fettuccine alfredo → lasagna OK
    "1572420289077-64aaa7421f6c": "1574894709920-11b28e7367e3",
    # Bruschetta → antipasto OK
    "1572695155646-55e6c2c3c7c8": "1544025162-d76694265947",
    # Caprese → antipasto OK
    "1565299585323-94d3e0c9d2e3": "1544025162-d76694265947",
    # Pizza diavola + pizza parma → pizzas OK
    "1590947132387-155f0408d5e5": "1574071318508-1cdbab80d002",
    # Hot dogs → calamari OK (estilo food empanizado)
    "1612392062798-2ac9b1a1e0d0": "1599487488170-d11ec9c172f0",
    # Spaghetti carbonara → spaghetti bolognese OK
    "1612874742237-652622158871": "1551183053-bf91a1d81141",
    # Ceviche de camarón → calamari OK
    "1563897539633-7964b1d54c7e": "1599487488170-d11ec9c172f0",
    # Pescados/mariscos (usado MASIVAMENTE en cevichería) → ceviche OK
    "1615144564660-989e8d4d70c3": "1559847844-5315695dadae",
}

with open(SRC, "r", encoding="utf-8") as f:
    sql = f.read()

original_sql = sql
replacements_made = 0

for bad, good in REPLACEMENTS.items():
    # Reemplazar todas las ocurrencias del photo ID en el SQL
    # El formato en SQL es: photo-XXXX?w=...
    pattern = f"photo-{re.escape(bad)}"
    new_text = f"photo-{good}"
    count = len(re.findall(pattern, sql))
    if count > 0:
        sql = sql.replace(f"photo-{bad}", new_text)
        replacements_made += count
        print(f"  ✅ Reemplazado photo-{bad} → photo-{good} ({count} ocurrencias)")
    else:
        print(f"  ⚠️ No encontrado: photo-{bad}")

# Guardar
with open(SRC, "w", encoding="utf-8") as f:
    f.write(sql)
shutil.copyfile(SRC, DST_DOWNLOAD)

print(f"\n📊 Total reemplazos: {replacements_made}")
print(f"✅ SQL actualizado en {SRC}")
print(f"✅ Copia en {DST_DOWNLOAD}")
