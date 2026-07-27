#!/usr/bin/env python3
"""
Add @map("snake_case") annotations to every camelCase field in prisma/schema.prisma.

Rules:
- For each field declaration line inside a `model { ... }` block:
  - If the field name is multi-word camelCase (e.g. supabaseUid, fullName),
    add @map("snake_case_name") to the END of the attribute list, BEFORE any
    trailing comments.
- Single-word lowercase fields (id, email, phone, role, plan, slug, ruc, etc.)
  are skipped — they match the DB column already.
- Skip lines that are relations (field type is a Model name, e.g. `clinic  Clinic @relation(...)`).
  We detect relation fields by looking for `@relation(`.
- Skip `@@index`, `@@unique`, `@@map` block-level directives.
- Skip the `id` field (single word).
"""
import re
from pathlib import Path

SCHEMA_PATH = Path('/home/z/my-project/prisma/schema.prisma')

def camel_to_snake(name: str) -> str:
    """supabaseUid -> supabase_uid, fullName -> full_name"""
    result = []
    for i, ch in enumerate(name):
        if ch.isupper() and i > 0:
            result.append('_')
            result.append(ch.lower())
        else:
            result.append(ch)
    return ''.join(result)

def needs_map(field_name: str) -> bool:
    """True if the field name has an uppercase letter (camelCase multi-word)."""
    return any(c.isupper() for c in field_name)

# Regex to match a field declaration line.
# Examples it should match:
#   supabaseUid     String   @unique
#   fullName        String
#   createdAt       DateTime @default(now()) @db.Timestamptz
#   clinic          Clinic   @relation(fields: [clinicId], references: [id], onDelete: Cascade)
#   @@index([email])
#
# Capture groups: (field_name)(rest_of_line)
FIELD_RE = re.compile(
    r'^(\s+)([a-zA-Z_][a-zA-Z0-9_]*)\s+([A-Z][a-zA-Z0-9_]*\??)(\s.*)?$'
)

def process_line(line: str, in_model: bool) -> tuple[str, bool]:
    """Process a single line. Returns (new_line, is_model_boundary)."""
    # Detect model block start/end
    if line.strip().startswith('model '):
        return line, True
    if line.strip() == '}':
        return line, False

    if not in_model:
        return line, False

    # Skip block-level directives
    stripped = line.lstrip()
    if stripped.startswith('@@'):
        return line, False
    if stripped.startswith('//') or stripped.startswith('///'):
        return line, False

    m = FIELD_RE.match(line.rstrip('\n'))
    if not m:
        return line, False

    indent, field_name, type_name, rest = m.groups()
    rest = rest or ''

    # Skip relation fields (type starts with uppercase Model name and has @relation)
    if '@relation(' in rest:
        return line, False

    # Skip if it's a relation field without @relation (just `clinic  Clinic`)
    # — these are "back-relation" fields like `ownedClinics Clinic[]`
    # Detect: type is PascalCase (not a Prisma scalar) and no @-attributes
    SCALAR_TYPES = {
        'String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json',
        'BigInt', 'Decimal', 'Bytes',
    }
    base_type = type_name.rstrip('?').replace('[]', '')
    if base_type not in SCALAR_TYPES and '@' not in rest:
        # Relation field like `ownedClinics Clinic[]`
        return line, False

    if not needs_map(field_name):
        return line, False

    snake = camel_to_snake(field_name)

    # If @map already present, skip
    if '@map(' in rest:
        return line, False

    # Append @map("snake") before any trailing // comment
    # Find comment position
    comment_pos = rest.find('//')
    if comment_pos == -1:
        new_rest = rest.rstrip() + f' @map("{snake}")'
    else:
        before = rest[:comment_pos].rstrip()
        after = rest[comment_pos:]
        new_rest = before + f' @map("{snake}") ' + after

    return f'{indent}{field_name} {type_name}{new_rest}\n', False

def main():
    src = SCHEMA_PATH.read_text()
    out_lines = []
    in_model = False
    for line in src.splitlines(keepends=True):
        new_line, model_started = process_line(line, in_model)
        if model_started:
            in_model = True
        elif line.strip() == '}':
            in_model = False
        out_lines.append(new_line)

    SCHEMA_PATH.write_text(''.join(out_lines))
    print(f'✅ Updated {SCHEMA_PATH}')

    # Count @map additions
    new_text = ''.join(out_lines)
    count = new_text.count('@map("')
    print(f'   Added {count} @map annotations')

if __name__ == '__main__':
    main()
