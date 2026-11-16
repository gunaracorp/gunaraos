# 📘 CONTRIBUTING — Standar Kode & Tata Cara Kontribusi Gunara OS

**Fase 1 TANAH-SUCI · Langkah 3 Roadmap 99 Langkah · v1.0 (16 November 2026)**
Dokumen ini adalah buku panduan gaya resmi. Indikator selesai Langkah 3: **nol pelanggaran lint** dan **nol error tipe** pada setiap commit yang memasuki `main`.

by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon

---

## 1. Sebelum Menulis Kode

1. Baca `PIAGAM.md` (konstitusi) dan `ROADMAP.md` (urutan pekerjaan). Fitur baru wajib punya tempat di roadmap; yang tidak punya, deliberkan ke Dewan 46 dulu.
2. Keputusan arsitektur baru → tulis ADR (`docs/adr/ADR-0XX-*.md`) **sebelum** kode.
3. Setup: `npm install` → `npx prisma generate` → `npm run db:push` (SQLite lokal `db/custom.db`) → `npm run dev` (http://localhost:3000).

## 2. Aturan Kode (Wajib)

1. **TypeScript strict** — `tsc --noEmit` nol error. Dilarang `as any` untuk menghindari error nyata; `any` eksplisit pada batas API hanya jika terdoktrin.
2. **Nama field = skema Prisma.** Contoh yang sudah jadi sejarah: `Cashflow.nilai` (bukan `jumlah`), `DailyLog.mit1..mit3` (bukan `mitPagi`). Tipe yang di-hardcode manual di komponen adalah sumber bug senyap — derive dari hasil API atau tulis interface yang diuji.
3. **Server-only di server.** `crypto.ts`, akses `db` langsung, dan kunci env tidak boleh menyentuh kode klien (`"use client"`).
4. **Satu sumber kebenaran.** Versi → `branding.ts`; riwayat rilis → `versioning.ts`; navigasi → `nav.ts`; katalog → `service-catalog.ts`. Dilarang hardcode "v10.x" di tempat lain.
5. **Prisma 7**: import client dari `src/generated/prisma/client` (atau alias `@/generated/prisma/client`), konstruksi wajib adapter; `@prisma/client` tidak lagi mengekspor `PrismaClient`.
6. **UI**: komponen shadcn/ui + Tailwind; ikon hanya `lucide-react` yang valid (pernah terjadi `Hole` yang tidak eksis — diperbaiki ke `TrendingDown`); tanggal operasional WIB via `Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" })`.
7. **AI**: panggilan `z-ai-web-dev-sdk` hanya di route handler; prompt sistem berbahasa Indonesia; dilarang mengarang angka yang tidak ada di data yang dikirim.

## 3. Konvensi Commit (Conventional Commits 1.0.0)

Format: `tipe(skorop): ringkasan singkat` — bahasa Indonesia disarankan. Tipe yang sah: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore(release)`.

```
feat(briefing): tambah upsert briefing harian WIB
fix(mutu): agregasi cashflow jumlah -> nilai
chore(release): v11.0.0 TANAH-SUCI
```

Satu commit = satu niat. Commit rilis (`chore(release): vX.Y.Z`) hanya dibuat setelah seluruh gerbang mutu hijau (§5).

## 4. Uji (Tests)

1. Unit test memakai **vitest**, ditempatkan di `src/lib/__tests__/` (modul murni: kriptografi, versi, data registri, util).
2. Invarian sistem wajib punya tes: Dewan 46 = 46 anggota, UsahaSiap = 45 dokumen unik USA-01..45, katalog = 46 layanan, 15 agen terdaftar, `APP_VERSION === BRAND.version`, urutan `RELEASES` terbaru dulu, enkripsi-dekripsi vault roundtrip.
3. Cakupan minimum **70%** untuk modul murni yang terdaftar di `vitest.config.ts` — CI menolak PR yang menurunkannya.
4. Kode yang menyentuh DB/AI diuji lewat smoke test runtime (`/api/health`, halaman utama 200) — tidak di-mock sepanjang mungkin.

## 5. Gerbang Mutu Sebelum Push (Wajib Hijau Semua)

```bash
npx tsc --noEmit          # 0 error
npm run lint              # 0 pelanggaran
npm test                  # vitest + cakupan >= 70% (modul murni)
bun run version:check     # SEMUA OK (bila menyentuh versi/rilis)
npm run build             # build produksi sukses
```

## 6. Pull Request

1. Satu PR = satu langkah roadmap / satu perbaikan; judul mengikuti konvensi commit.
2. Deskripsi mencantumkan: apa, kenapa (rujuk langkah roadmap/ADR), bukti gerbang mutu (tempel hasil §5).
3. Dilarang meng-commit: `.env`, file database produksi yang berisi rahasia tanpa sengaja, `node_modules`, kredensial apa pun (lihat `SECURITY.md`).

## 7. Gaya Bahasa

Kode, komentar, dan dokumen dalam Bahasa Indonesia yang bebas tapi tertib; istilah teknis boleh memakai bahasa aslinya. Nama sandi rilis huruf kapital sambung-garis (`TANAH-SUCI`). Emoji di label navigasi dan judul seksi boleh — di kode produksi tidak.
