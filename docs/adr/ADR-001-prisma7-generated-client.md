# ADR-001 — Generator Prisma `prisma-client` dengan Output Eksplisit

- **Status:** Diterima · 2026-11-01 (dipratifikasi dalam dokumen 2026-11-16)
- **Konteks:** Upgrade Prisma 6.11.1 → 7.10.1. Di Prisma 7, generator lama `prisma-client-js` digantikan `prisma-client`; package `@prisma/client` tidak lagi mengekspor `PrismaClient`, dan lokasi hasil generate harus dideklarasikan eksplisit. Tiga skrip seed lama sempat gagal type-check karena masih mengimpor dari `@prisma/client`.
- **Keputusan:** `prisma/schema.prisma` memakai `generator client { provider = "prisma-client"; output = "../src/generated/prisma" }`. Seluruh aplikasi mengimpor dari `@/generated/prisma/client`; skrip administrasi di `scripts/` memakai import relatif `../src/generated/prisma/client`. Konstruksi `new PrismaClient()` wajib menerima adapter.
- **Konsekuensi:** `src/generated/` adalah artefak generate — dilarang diedit manusia; wajib `prisma generate` setelah clone dan setelah mengubah skema; direktori di-exclude dari tsc/eslint dan tidak di-refactor. Pemilihan nama field kini terikat skema (kesalahan nama = error tipe, bukan bug senyap).
