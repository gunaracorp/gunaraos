# ADR-002 — Database Dual-Mode: SQLite Lokal ⇄ Prisma Postgres Cloud

- **Status:** Diterima · 2026-11-01
- **Konteks:** Sistem harus bisa berjalan di laptop tanpa akun cloud apa pun, namun siap pindah ke database terkelola (free tier prisma.io: 2 GB · 200 ribu operasi/bulan) tanpa mengubah kode. Prisma 7 menuntut driver adapter dan menghapus `url` dari datasource.
- **Keputusan:** `src/lib/db.ts` adalah satu-satunya pabrik client: jika `PRISMA_POSTGRES_URL` terisi → `PrismaPg({ connectionString })`; jika kosong → `PrismaBetterSqlite3({ url: DATABASE_URL ?? "file:./db/custom.db" })`. Schema cloud `prisma/schema.postgres.prisma` digenerate otomatis dari schema utama oleh `scripts/sync-pg-schema.sh` (anti-drift), dan pipeline migrasi data: `db-export.mjs` → `db:cloud:push` → `db-import-cloud.ts` → verifikasi hitung baris.
- **Konsekuensi:** Tidak boleh ada file lain yang membuat `PrismaClient` (selain skrip administrasi dengan pola yang sama). Produksi memakai Node (better-sqlite3 belum mendukung Bun). Perpindahan mode cukup ubah `.env` + regenerate client.
