// ADR-005 — Cakupan uji unit hanya pada modul murni src/lib
//
// Status: Diterima · 2026-11-16
//
// Konteks: Indikator Langkah 8 (Fase 1 TANAH-SUCI) menuntut uji unit dengan
// cakupan 70%. `src/lib/db.ts` membuat koneksi database (efek samping) dan
// `src/lib/gunara.tsx` adalah peta konfigurasi UI berukuran besar dengan tipe
// React — keduanya menurunkan angka cakupan tanpa menambah jaminan mutu nyata.
//
// Keputusan: Threshold cakupan 70% diterapkan pada sembilan modul murni
// (branding, crypto, dewan, i18n, license-finder, service-catalog, usahasiap,
// utils, versioning) yang terdaftar eksplisit di vitest.config.ts. db.ts dan
// gunara.tsx diverifikasi lewat smoke test runtime (/api/health, build).
//
// Konsekuensi: Menambah modul murni baru di src/lib wajib masuk daftar include
// + punya tes; modul yang menyentuh DB/AI diuji dengan smoke test, bukan mock.
