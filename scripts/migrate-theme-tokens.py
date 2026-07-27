#!/usr/bin/env python3
"""
migrate-theme-tokens.py
------------------------
Migrates hardcoded dark-theme Tailwind classes to semantic tokens that work
in both light and dark mode (driven by CSS variables in globals.css).

Safe rules — only replaces unambiguous dark-only class names:
  - bg-[#07070b]            -> bg-background
  - bg-[#07070b]/80         -> bg-background/80
  - bg-[#0a0a14]            -> bg-sidebar
  - text-white/90           -> text-foreground/90
  - text-white/80           -> text-foreground/80
  - text-white/70           -> text-muted-foreground
  - text-white/60           -> text-muted-foreground
  - text-white/50           -> text-muted-foreground/80
  - text-white/40           -> text-muted-foreground/70
  - text-white/30           -> text-muted-foreground/60
  - bg-white/[0.02]         -> bg-muted/30
  - bg-white/[0.03]         -> bg-muted/50
  - bg-white/[0.04]         -> bg-muted/60
  - bg-white/[0.05]         -> bg-muted/70
  - bg-white/5              -> bg-muted/50
  - bg-white/10             -> bg-muted
  - border-white/5          -> border-border/60
  - border-white/10         -> border-border
  - border-white/20         -> border-border
  - hover:bg-white/5        -> hover:bg-muted/60
  - hover:bg-white/10       -> hover:bg-muted
  - hover:text-white        -> hover:text-foreground

DOES NOT touch:
  - bare `text-white` (used on gradient buttons — must remain white in both modes)
  - `bg-black/XX` (overlay for mobile drawer — fine in both modes)
  - amber/sky/blue/emerald explicit colors (brand & status accents)

Skips: node_modules, .next, .git, scripts/, tests/, examples/, mini-services/
"""

import re
import sys
from pathlib import Path

ROOT = Path("/home/z/my-project/src")

# Ordered replacements (apply in order; some patterns overlap)
REPLACEMENTS = [
    # Compound hover: hover:text-white -> hover:text-foreground
    (r"hover:text-white\b(?!/)", "hover:text-foreground"),

    # Hover bg with white opacity
    (r"hover:bg-white/5\b", "hover:bg-muted/60"),
    (r"hover:bg-white/10\b", "hover:bg-muted"),
    (r"hover:bg-white/20\b", "hover:bg-muted"),

    # Sidebar explicit background
    (r"bg-\[#0a0a14\]/?(\d*)", lambda m: f"bg-sidebar/{m.group(1)}" if m.group(1) else "bg-sidebar"),

    # Main dark background
    (r"bg-\[#07070b\]/?(\d*)", lambda m: f"bg-background/{m.group(1)}" if m.group(1) else "bg-background"),

    # bg-white/[0.0X] arbitrary opacity
    (r"bg-white/\[0\.02\]", "bg-muted/30"),
    (r"bg-white/\[0\.03\]", "bg-muted/50"),
    (r"bg-white/\[0\.04\]", "bg-muted/60"),
    (r"bg-white/\[0\.05\]", "bg-muted/70"),

    # bg-white/XX
    (r"bg-white/5\b", "bg-muted/50"),
    (r"bg-white/10\b", "bg-muted"),
    (r"bg-white/20\b", "bg-muted"),
    (r"bg-white/40\b", "bg-muted"),
    (r"bg-white/80\b", "bg-background"),

    # border-white/XX
    (r"border-white/5\b", "border-border/60"),
    (r"border-white/10\b", "border-border"),
    (r"border-white/20\b", "border-border"),
    (r"border-white/40\b", "border-border"),

    # text-white/XX
    (r"text-white/90\b", "text-foreground/90"),
    (r"text-white/80\b", "text-foreground/80"),
    (r"text-white/70\b", "text-muted-foreground"),
    (r"text-white/60\b", "text-muted-foreground"),
    (r"text-white/50\b", "text-muted-foreground/80"),
    (r"text-white/40\b", "text-muted-foreground/70"),
    (r"text-white/30\b", "text-muted-foreground/60"),
]

SKIP_DIRS = {".next", "node_modules", ".git", "scripts", "tests", "examples", "mini-services"}

def migrate_file(path: Path) -> tuple[int, list[str]]:
    """Returns (num_changes, list_of_diffs)."""
    original = path.read_text(encoding="utf-8")
    diffs = []
    new = original

    for pattern, replacement in REPLACEMENTS:
        if callable(replacement):
            new2, n = re.subn(pattern, replacement, new)
        else:
            new2, n = re.subn(pattern, replacement, new)
        if n > 0:
            diffs.append(f"  {pattern} -> {replacement if not callable(replacement) else '(callable)'}: {n} match(es)")
            new = new2

    if new != original:
        path.write_text(new, encoding="utf-8")
        return sum(int(re.search(r": (\d+) match", d).group(1)) for d in diffs), diffs
    return 0, []


def main():
    if not ROOT.exists():
        print(f"ERROR: root not found: {ROOT}", file=sys.stderr)
        sys.exit(1)

    total_files = 0
    total_changes = 0

    for tsx in ROOT.rglob("*.tsx"):
        if any(part in SKIP_DIRS for part in tsx.parts):
            continue
        n, diffs = migrate_file(tsx)
        if n > 0:
            total_files += 1
            total_changes += n
            print(f"\n[OK] {tsx.relative_to(ROOT.parent)}  ({n} change(s))")
            for d in diffs:
                print(d)

    print(f"\n{'=' * 60}")
    print(f"Total files modified: {total_files}")
    print(f"Total class replacements: {total_changes}")


if __name__ == "__main__":
    main()
