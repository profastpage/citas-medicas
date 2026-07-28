#!/usr/bin/env python3
"""
Split seed-demo-mozos-org.sql into smaller per-restaurant files
so they can be pasted into Supabase SQL Editor without size limits.
"""
import re
from pathlib import Path

SRC = Path("/home/z/my-project/supabase/seed-demo-mozos-org.sql")
DST_DIR = Path("/home/z/my-project/download/seed-mozos-parts")
DST_DIR.mkdir(parents=True, exist_ok=True)

content = SRC.read_text()
lines = content.split("\n")

# Markers where each restaurant section starts
# Format: -- ════════════════════════════════════════════════════════════
#          -- RESTAURANTE N: <name>
#          -- ════════════════════════════════════════════════════════════
section_starts = []
for i, line in enumerate(lines):
    if re.match(r"^-- RESTAURANTE \d+:", line):
        section_starts.append(i)

# Find verification section at end
verif_start = None
for i, line in enumerate(lines):
    if line.strip() == "-- VERIFICACIÓN":
        verif_start = i - 1  # include separator line before
        break

# Build parts:
# Part 0 = lines 1 to (section_starts[0] - 1)  -> header + verification of user
# Part 1..5 = each restaurant section
# Part 6 = verification

parts = []

# Part 0: header + user verification (lines 1..section_starts[0]-1)
part0_end = section_starts[0]
# But we want to include the separator line just before RESTAURANTE 1, so subtract 1
parts.append(("00_header.sql", lines[:part0_end]))

# Parts 1..5: each restaurant
for idx in range(len(section_starts)):
    start = section_starts[idx]
    if idx + 1 < len(section_starts):
        end = section_starts[idx + 1]
    else:
        # Last restaurant — end before verification section
        end = verif_start
    # Extract restaurant number from marker line
    marker = lines[start]
    m = re.search(r"RESTAURANTE (\d+):", marker)
    num = m.group(1) if m else str(idx + 1)
    parts.append((f"0{num}_restaurante_{num}.sql", lines[start:end]))

# Part 6: verification
parts.append(("06_verificacion.sql", lines[verif_start:]))

# Write all parts
written = []
for filename, part_lines in parts:
    out = DST_DIR / filename
    out.write_text("\n".join(part_lines) + "\n")
    size_kb = out.stat().st_size / 1024
    line_count = len(part_lines)
    written.append((filename, line_count, size_kb))
    print(f"✅ {filename:30s} {line_count:>6} lines  {size_kb:>7.1f} KB")

print(f"\nTotal: {len(written)} files in {DST_DIR}")
print(f"Original was {len(lines)} lines / {SRC.stat().st_size / 1024:.1f} KB")
