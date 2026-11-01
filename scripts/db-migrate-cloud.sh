#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# 🌩️  db-migrate-cloud.sh — MIGRASI SATU PERINTAH ke prisma.io
#     SQLite lokal → Prisma Postgres (free tier)
#
#     Prasyarat (lihat SETUP-DATABASE.md):
#     1. Akun console.prisma.io + database Prisma Postgres dibuat
#     2. .env berisi PRISMA_POSTGRES_URL="postgres://...@db.prisma.io:5432/..."
#
#     Jalankan: bun run db:migrate-cloud
# ═══════════════════════════════════════════════════════════════
set -euo pipefail
cd "$(dirname "$0")/.."

if ! grep -q "^PRISMA_POSTGRES_URL=" .env 2>/dev/null; then
  echo "❌ PRISMA_POSTGRES_URL belum diisi di .env"
  echo "   1. Buka https://console.prisma.io → Prisma Postgres → copy connection string"
  echo "   2. Paste ke .env :  PRISMA_POSTGRES_URL=\"postgres://...\""
  echo "   3. Jalankan lagi :  bun run db:migrate-cloud"
  exit 1
fi

echo "── LANGKAH 1/4: Export data dari SQLite lokal ──"
bun scripts/db-export.ts

echo ""
echo "── LANGKAH 2/4: Membuat semua tabel di Prisma Postgres ──"
bun run db:cloud:push

echo ""
echo "── LANGKAH 3/4: Memindahkan data ke cloud ──"
bun scripts/db-import-cloud.ts

echo ""
echo "── LANGKAH 4/4: Selesai ──"
echo "✅ Database cloud prisma.io kini berisi seluruh data Gunara OS."
echo "   · Restart aplikasi → otomatis terhubung ke cloud"
echo "   · Kembali ke lokal : hapus PRISMA_POSTGRES_URL dari .env lalu 'bun run db:cloud:off'"
