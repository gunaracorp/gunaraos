# 🔐 SECURITY — Kebijakan Keamanan Dasar Gunara OS

**Fase 1 TANAH-SUCI · Langkah 5 Roadmap 99 Langkah · v1.0 (16 November 2026)**
Indikator selesai Langkah 5: **nol kredensial di dalam kode sumber** — terbukti oleh scan §3 dan berlaku berkelanjutan.

by Gugun Gunara — Muhammad Lutfi Azmi · PT Top Konsultan Internasional · PT Digital Bisnis Manajemen

---

## 1. Kebijakan Rahasia (Secrets)

1. **Rahasia hanya hidup di dua tempat**: file `.env` (tidak pernah di-commit; `.gitignore` melindungi `.env*` dan hanya membuka `!.env.example`) dan vault terenkripsi di database (model `VaultEntry`, AES-256-GCM via `src/lib/crypto.ts`).
2. **Kunci vault**: env `GUNARA_VAULT_KEY` (min. 32 karakter acak). Fallback kunci dev hanya boleh di lingkungan pengembangan; produksi wajib set kunci sendiri (`/api/health` menandainya bila memakai kunci dev).
3. **Token akun layanan (GitHub, dll) dirotasi berkala** dan tidak pernah ditempel di percakapan, log, tangkapan layar, atau kode. Token yang sudah pernah terlihat publik dianggap bocor dan wajib dicabut (revoke) seketika, lalu dibuat baru dengan scope minimum yang dibutuhkan (mis. `repo` saja untuk push).
4. **Contoh aman**: `.env.example` memuat nama variabel tanpa nilai nyata. SK-PDF 45 dokumen UsahaSiap tidak memuat kredensial.

## 2. Vault Kredensial (Dalam Sistem)

Brankas Gunara OS menyimpan kredensial sosmed/domain dalam bentuk `v1:<iv>:<tag>:<cipher>` (AES-256-GCM, NIST SP 800-38D; IV acak 12 byte per entri; tag autentikasi terverifikasi saat dekripsi; payload korup → string kosong, bukan error). Password akun memakai scrypt (memory-hard, N=16384, salt 16 byte, verifikasi timing-safe). Standar acuan: OWASP ASVS v4 Level 2.

## 3. Bukti Nol Kredensial di Kode Sumber (Teruji 2026-11-16)

Scan pola kredensial terhadap seluruh tree (tanpa `node_modules`, `.next`, `src/generated`, `skills`):

```bash
grep -rInE "ghp_[A-Za-z0-9]{20,}|github_pat_|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY" \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=src/generated --exclude-dir=skills .
```

**Hasil: nol kecocokan.** Pemindaian ini dijalankan ulang setiap rilis (masuk pipeline `scripts/release-check.sh` melalui dokumentasi ini dan akan ditambahkan ke CI).

## 4. Audit Dependensi (npm audit, 2026-11-16)

| Keadaan | Jumlah | Rincian |
|---|---|---|
| Sebelum `npm audit fix` | 27 | 2 critical · 14 high · 9 moderate · 2 low |
| Setelah `npm audit fix` (non-breaking) | 13 | 2 high · 11 moderate |

Perbaikan aman diterapkan pada versi yang tersedia tanpa perubahan breaking; `tsc` + `lint` terverifikasi tetap hijau setelahnya. **Risiko tersisa yang diterima (accepted risk), dengan alasan tertulis:**

| Paket | Severity | Kenapa diterima | Rencana |
|---|---|---|---|
| `js-yaml@4.1.1` (via `@mdxeditor/editor`, `@eslint/eslintrc`) | high (DoS kuadratik) | Perbaikan tidak di-backport ke 4.x; dependen menuntut mayor 4.x; pemakaian hanya di dev-tooling (lint) & editor konten internal, bukan permukaan publik | Naik saat dependen mendukung js-yaml 5; pantau tiap kuartal |
| `sharp@0.34.5 / 0.35.5` (via `next` image optimization) | high (warisan libvips) | Belum ada rilis sharp yang memuat perbaikan (≤0.35.5 rentan) — tidak ada pilihan upgrade yang sah | Upgrade begitu sharp menerbitkan versi tetap; sementara: hanya gambar milik sendiri yang dioptimasi, tanpa input gambar pihak ketiga |
| 11 moderate (rantai dev-dependency) | moderate | Tidak menyentuh jalur runtime produksi yang terekspos publik | `npm audit fix` rutin tiap rilis |

Prinsip: risiko yang tidak bisa diperbaiki hari ini **tidak disembunyikan** — dicatat, diukur ulang tiap rilis, dan punya rencana.

## 5. Pelaporan & Insiden

1. Temuan keamanan dilaporkan ke pemilik amanah (Gugun Gunara) dan dicatat di `worklog.md` hari yang sama.
2. Insiden kredensial bocor: revoke token/bagian → rotasi → audit jejak penggunaan → entri `fixed` di rilis berikutnya.
3. Penguatan berlapis (pembatas laju, 2FA admin, pen-test tahunan) dijadwalkan pada Fase 7 BENTENG-KOKOH (Langkah 55–63) sesuai roadmap.

## 6. Larangan Mutlak

- Dilarang commit `.env`, kredensial, atau file database yang memuat kunci vault di jalur publik.
- Dilarang menulis kredensial di dalam kode, komentar, atau pesan commit.
- Dilarang memakai kunci dev fallback (`GUNARA_VAULT_KEY` kosong) di lingkungan produksi.
