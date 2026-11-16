# ADR-003 — SemVer + Nama Sandi Rilis dengan Gerbang `version:check`

- **Status:** Diterima · 2026-11-01 (dipertajam 2026-11-16)
- **Konteks:** Rilis awal sewaktu-waktu melenceng: versi terduplikasi di banyak file, changelog terlewat, tag tidak konsisten. Sistem yang hendak jadi acuan dunia butuh disiplin rilis yang bisa diaudit.
- **Keputusan:** SemVer 2.0.0 dengan nama sandi huruf-kapital-sambung-garis per rilis (contoh: `10.2.1 GERBANG-MUTU`, `11.0.0 TANAH-SUCI`). `src/lib/branding.ts` memegang `VERSION` tunggal; `scripts/version.ts` memvalidasi & menyinkronkan 7 titik (package.json, branding.ts, public/version.json, RELEASES di `versioning.ts`, heading CHANGELOG.md, urutan RELEASES). Rilis baru: `bun run version:patch|minor|major` → isi entri `RELEASES` + heading CHANGELOG → `version:check` SEMUA OK → commit `chore(release): vX.Y.Z` → tag `vX.Y.Z`.
- **Konsekuensi:** Setiap rilis wajib punya entri `ReleaseEntry` (added/changed/fixed/verified) dan heading CHANGELOG — `version:check` menolak jika tidak. Angka versi yang di-hardcode di file lain dilarang. Tag GitHub dibuat hanya setelah seluruh gerbang mutu hijau.
