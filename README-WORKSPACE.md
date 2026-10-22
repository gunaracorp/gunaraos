# 📦 GUNARA OS — Workspace Total v9.3.0 "Domain Money Engine"

Panduan pemulihan (restore) workspace lengkap. by Gugun Gunara — Muhammad Lutfi Azmi.

## 📋 Isi Arsip Ini (TIDAK ada yang tertinggal)

| Bagian | Path | Keterangan |
|---|---|---|
| 💾 **DATABASE** | `db/custom.db` | **SEMUA DATA**: 49 domain + blueprint uang, keuangan, CRM, SEO, dewan, vault — SQLite |
| 🧬 Git history | `.git/` | Seluruh riwayat commit + tag `v9.2.0`, `v9.3.0` (version control) |
| 🎨 Source code | `src/` | Next.js 16 + TypeScript + shadcn/ui — 35+ section |
| ⚙️ Schema DB | `prisma/schema.prisma` | 38+ model (sumber struktur database) |
| 🌱 Seed scripts | `scripts/` | seed.ts, seed-bisnis.ts, **seed-domains-money.ts**, version.ts (CLI versi) |
| 📚 Dokumentasi | `worklog.md`, `CHANGELOG.md`, `VERSIONING.md`, `VERSION`, `README.md` | Worklog terstruktur, changelog SemVer, kebijakan versioning |
| 🌐 Public & meta | `public/` | version.json, favicon, manifest — SEO lengkap |
| 🤖 Skills | `skills/` | Dokumen skill AI (ASR, LLM, TTS, VLM, dll) |
| 🧪 Lainnya | `examples/`, `mini-services/`, `tests/`, `upload/`, `tool-results/` | Demo websocket, service pendukung, test, arsip upload |
| 🔧 Config | `.env`, `Caddyfile`, `package.json`, `bun.lock`, `tsconfig.json`, `tailwind.config.ts`, `components.json`, `eslint.config.mjs`, `next.config.ts` | Konfigurasi penuh |

**Yang TIDAK ikut (regenerable 100%, bukan data):** `node_modules/` (1,2 GB — di-build ulang dengan `bun install`) dan `.next/` (266 MB — cache build).

## 🚀 Cara Menjalankan Kembali (5 langkah)

```bash
# 1. Ekstrak arsip, masuk folder
unzip gunara-os-workspace-v9.3.0-full.zip -d gunara-os && cd gunara-os

# 2. Install dependencies (hasilnya identik karena bun.lock terkunci)
bun install

# 3. (Opsional, jika data hilang/korup) tanam ulang 49 domain + blueprint:
bun run scripts/seed-domains-money.ts

# 4. Jalankan server
bun run dev          # → http://localhost:3000

# 5. Verifikasi
bun run version:check   # harus SEMUA OK (v9.3.0)
```

## 🔒 Jaminan Data

- Database SQLite (`db/custom.db`) **ikut di dalam arsip ini** — buka aplikasi, semua data langsung ada.
- Cadangan data juga bisa diambil kapan saja dari dalam aplikasi: **Data Vault & Diagnostik → Backup** (JSON ekspor 38 tabel).
- Riwayat versi lengkap: `git log --oneline` → tag `v9.2.0` (Version Control) & `v9.3.0` (Domain Money Engine).

## 🗺️ Peta Fitur Utama

- **Command Center** — dashboard utama
- **Mesin 1-5** — Keuangan · CRM · Relasi & Politik · Belajar · Dokumentasi Kemenangan
- **Arsenal** — 💰 Domain Money Engine (49 domain) · AI Agent Army (15 agents) · Sistem · Roadmap 90 Hari
- **Bisnis Hub** — Database Bisnis · Perizinan · Aset Digital
- **God Mode** — Arena Debat · Sage Console · Ultimate Solver · Dewan 46
- **SEO Mastery** — 11 mesin SEO (Audit, Keywords, Ranks, Content, Calendar, Backlinks, Competitor, Forge, Clients, Academy)
- **Data Vault** — Backup/Restore/Health Check
- **Release Center** — kontrol versi SemVer berstandar internasional

---
GUNARA OS v9.3.0 · SemVer 2.0.0 · Keep a Changelog · Conventional Commits
Prak burukeun — segerakan kesadaran. 🌾
