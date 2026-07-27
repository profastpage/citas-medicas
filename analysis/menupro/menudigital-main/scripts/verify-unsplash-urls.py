#!/usr/bin/env python3
"""
Verifica TODAS las URLs de Unsplash en el SQL y devuelve:
- Cuáles están rotas (HTTP 404)
- Lista de photo IDs que necesitan reemplazo
"""
import re
import urllib.request
import concurrent.futures

with open("/home/z/my-project/supabase/seed-demo-account.sql", "r") as f:
    content = f.read()

# Extraer todos los photo IDs únicos
photo_ids = sorted(set(re.findall(r'photo-(\d+-[a-z0-9]+)', content)))
print(f"Total photo IDs únicos: {len(photo_ids)}")

def check(photo_id):
    url = f"https://images.unsplash.com/photo-{photo_id}?w=400&h=400&fit=crop&q=80&fm=webp"
    try:
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=10) as r:
            return photo_id, r.status
    except urllib.error.HTTPError as e:
        return photo_id, f"HTTP {e.code}"
    except Exception as e:
        return photo_id, f"ERR {e}"

ok = []
bad = []
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as ex:
    for photo_id, status in ex.map(check, photo_ids):
        if status == 200:
            ok.append(photo_id)
        else:
            bad.append((photo_id, status))

print(f"\n✅ OK: {len(ok)}")
print(f"❌ BAD: {len(bad)}")
print("\nIDs rotos:")
for pid, st in bad:
    print(f"  {st}  photo-{pid}")

# Escribir lista de IDs rotos a archivo para el siguiente paso
with open("/tmp/bad-photo-ids.txt", "w") as f:
    for pid, _ in bad:
        f.write(pid + "\n")
print(f"\nLista guardada en /tmp/bad-photo-ids.txt")
