#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# 🌩️  Sinkronkan prisma/schema.postgres.prisma dari prisma/schema.prisma
#     Hanya blok generator + datasource yang diganti → Postgres (prisma.io)
#     Semua model dijamin selalu identik dengan schema utama.
# ═══════════════════════════════════════════════════════════════
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="prisma/schema.prisma"
DST="prisma/schema.postgres.prisma"

# Ambil semua baris mulai dari komentar banner pertama ("// ═══")
awk 'BEGIN{found=0} !found && /^\/\//{found=1} found{print}' "$SRC" > "$DST.tmp"

cat > "$DST.head" <<'EOF'
// ═══════════════════════════════════════════════════════════════
// 🌩️  SCHEMA CLOUD — Prisma Postgres (prisma.io, free tier)
//     AUTO-GENERATED dari prisma/schema.prisma — jangan edit manual!
//     Sinkronkan ulang: bun run db:cloud:sync
// ═══════════════════════════════════════════════════════════════

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

EOF

cat "$DST.head" "$DST.tmp" > "$DST"
rm -f "$DST.head" "$DST.tmp"
echo "✅ prisma/schema.postgres.prisma tersinkron dari schema.prisma (model 100% identik)"
