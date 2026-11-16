#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# GUNARA OS — release-check.sh · Tahap 0–3 pipeline rilis (Langkah 4)
# Gerbang mutu satu perintah: tsc → lint → vitest → version:check → build
# Keluar 1 pada kegagalan pertama — commit rilis dilarang bila ini merah.
# ═══════════════════════════════════════════════════════════════
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▶ 1/5  tsc --noEmit"
npx tsc --noEmit

echo "▶ 2/5  eslint"
npm run --silent lint

echo "▶ 3/5  vitest (cakupan >= 70% modul murni)"
npm run --silent test

echo "▶ 4/5  version:check"
bun run version:check

echo "▶ 5/5  next build"
npm run build

echo
echo "✅ GERBANG MUTU HIJAU — siap version:patch|minor|major + tag (RELEASE-PROCESS.md §2)"
