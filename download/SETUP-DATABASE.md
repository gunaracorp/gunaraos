# 🗄️ SETUP-DATABASE — GUNARA OS

> *"Di mana database ini nanti disimpan?"* — Ini jawaban lengkapnya, Pak Gugun.

---

## 1. Jawaban Singkat

| Mode | Database disimpan di | Status |
|---|---|---|
| **LOKAL** (aktif sekarang) | **File SQLite** di dalam proyek: `db/custom.db` — tersimpan di server/komputer tempat aplikasi jalan. Satu file, mudah dibackup (tinggal copy filenya). | ✅ Jalan sekarang |
| **CLOUD** (siap kapan saja) | **Prisma Postgres** di **prisma.io** (free tier) — data tersimpan di cloud terenkripsi, bisa diakses dari mana saja, ikut aplikasi saat deploy. | 🔜 Tinggal aktifkan |

**Aplikasinya cerdas**: begitu variabel `PRISMA_POSTGRES_URL` diisi di file `.env`, seluruh aplikasi otomatis pindah ke cloud prisma.io. Hapus lagi → kembali ke SQLite lokal. **Tanpa mengubah kode satu baris pun.**

---

## 2. Mode LOKAL — yang aktif sekarang

- File: `db/custom.db` (SQLite) — seluruh data Gunara OS ada di sini.
- Sudah teruji: 49 domain, 15 agent Dewan 46, 45 dokumen UsahaSiap, hutang/piutang, win log, dll. semua utuh.
- Kelebihan: nol biaya, nol konfigurasi, cepat, cocok untuk preview & development.
- Kekurangan: data hanya hidup di satu mesin — kalau mesin mati tanpa backup, data ikut hilang.

> 💡 Kebiasaan baik: sesekali jalankan `node scripts/db-export.mjs` — seluruh database ikut ter-backup ke `db/export-cloud.json`.

---

## 3. Mode CLOUD — aktivasi prisma.io FREE

Free tier **Prisma Postgres** resmi dari [prisma.io/pricing](https://www.prisma.io/pricing):

- 💰 **Gratis selamanya** — tanpa kartu kredit
- 💾 **2 GB storage** (data Gunara OS sekarang: < 1 MB — cukup untuk bertahun-tahun)
- ⚡ **200.000 operations/bulan** (~6.600 query/hari — pemakaian personal jauh di bawah ini)
- 🗂️ **50 database** — bisa dipakai untuk aplikasi lain juga
- 😴 Database idle otomatis "tidur" (scale to zero) → tidak makan kuota

### Aktivasi + migrasi data (5 langkah, satu perintah migrasi):

1. **Daftar akun** → buka [console.prisma.io](https://console.prisma.io) → login dengan GitHub (gratis, tanpa kartu kredit).
2. **Buat database** → *New project → Prisma Postgres* → pilih region terdekat (pilih yang di Asia jika tersedia) → plan **Free**.
3. **Copy connection string** → muncul seperti ini:
   ```
   postgres://user:password@db.prisma.io:5432/postgres?sslmode=require
   ```
4. **Paste ke file `.env`** di proyek — buang tanda `#` di depan barisnya:
   ```env
   PRISMA_POSTGRES_URL="postgres://user:password@db.prisma.io:5432/postgres?sslmode=require"
   ```
5. **Jalankan migrasi satu perintah**:
   ```bash
   bun run db:migrate-cloud
   ```
   Yang dilakukannya otomatis: (1) export seluruh data SQLite → JSON, (2) membuat **semua 44 tabel** di cloud, (3) memindahkan semua data ke cloud + verifikasi hitung baris, (4) merapikan client ke mode Postgres.

✅ Selesai. Restart aplikasi → **seluruh data kini tersimpan di prisma.io**, dan aplikasi otomatis terhubung ke cloud.

### ⏪ Kembali ke mode LOKAL:

1. Komentari/hapus baris `PRISMA_POSTGRES_URL` di `.env`.
2. Jalankan `bun run db:cloud:off` (regenerate client ke SQLite).
3. Restart aplikasi — data lokal `db/custom.db` tidak pernah tersentuh saat migrasi, jadi tetap utuh.

---

## 4. Perintah Database (cheat sheet)

| Perintah | Fungsi |
|---|---|
| `bun run db:push` | Sinkronkan schema → SQLite lokal |
| `bun run db:generate` | Regenerate client (mode lokal) |
| `bun run db:migrate-cloud` | **MIGRASI PENUH: export → buat tabel cloud → pindahkan data → verifikasi** |
| `bun run db:cloud:push` | Buat semua tabel di prisma.io (tanpa isi data) + regenerate client Postgres |
| `bun run db:cloud:studio` | Buka Prisma Studio (browser data) untuk cloud |
| `bun run db:cloud:off` | Kembali penuh ke mode lokal |
| `node scripts/db-export.mjs` | Backup seluruh database → `db/export-cloud.json` |
| `bunx prisma studio` | Buka Prisma Studio untuk SQLite lokal |

---

## 5. Catatan versi Prisma (kenapa 7.10.1, bukan 8?)

- **Prisma 8 saat ini masih RC** (release candidate) — CLI `8.0.0-rc.29` sudah terbit di npm, tetapi **client stabilnya belum** (`@prisma/client` terbaru stabil: `7.10.1`).
- Yang terpasang sekarang: **Prisma 7.10.1** — generasi rust-free terbaru yang stabil, dengan arsitektur yang **100% sama dengan Prisma 8** (generator `prisma-client` + driver adapter + `prisma.config.ts`).
- Begitu Prisma 8 stabil rilis, upgrade-nya satu perintah tanpa refactor:
  ```bash
  bun add prisma@8 @prisma/client@8 @prisma/adapter-better-sqlite3@8 @prisma/adapter-pg@8
  ```

---

## 6. Troubleshooting

| Gejala | Penyebab & solusi |
|---|---|
| `Environment variable not found: PRISMA_POSTGRES_URL` | Baris di `.env` masih berkomentar / belum diisi — lengkapi langkah 4. |
| `Environment variable not found: DATABASE_URL` | File `.env` hilang — copy dari `.env.example` lalu sesuaikan. |
| `'better-sqlite3' is not yet supported in Bun` | Jangan jalankan script database lewat runtime `bun` langsung sebagai server — gunakan `bun run dev` (Next.js jalan di Node) atau `bun run start` (sudah pakai Node). Script export/import aman di bun. |
| Gagal koneksi saat `db:cloud:push` | Cek connection string lengkap dengan `?sslmode=require`, dan pastikan database di console.prisma.io statusnya aktif. |
| Aplikasi error setelah ganti mode | Client harus di-regenerate sesuai mode: lokal → `bun run db:cloud:off`, cloud → `bun run db:cloud:generate`. |
| Selisih baris saat verifikasi import | Jalankan `bun run db:migrate-cloud` sekali lagi — pipeline bisa diulang aman (skipDuplicates). |

---

*Dikelola oleh GUNARA OS v10.2.0 — PUSAT-DATA · by Gugun Gunara — Muhammad Lutfi Azmi · PT Top Konsultan Internasional · PT Digital Bisnis Manajemen*
