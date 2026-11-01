import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * 🗄️ GUNARA OS — Database Client Pintar (auto-switch)
 *
 * Mode LOKAL (default) : SQLite file      → DATABASE_URL           (db/custom.db)
 * Mode CLOUD (prisma.io): Prisma Postgres → PRISMA_POSTGRES_URL
 *
 * Kalau PRISMA_POSTGRES_URL terisi di .env, otomatis pindah ke cloud prisma.io.
 * Client-nya harus di-generate sesuai mode:
 *   - Lokal  : bun run db:generate
 *   - Cloud  : bun run db:cloud:push   (sekalian membuat semua tabel di cloud)
 *   - Balik  : bun run db:cloud:off    (setelah menghapus PRISMA_POSTGRES_URL)
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const cloudUrl = process.env.PRISMA_POSTGRES_URL?.trim()

  if (cloudUrl) {
    // 🌩️ CLOUD — Prisma Postgres (prisma.io, free tier)
    const adapter = new PrismaPg({ connectionString: cloudUrl })
    return new PrismaClient({ adapter, log: ["query"] })
  }

  // 📁 LOKAL — SQLite file
  const url = process.env.DATABASE_URL ?? "file:./db/custom.db"
  const adapter = new PrismaBetterSqlite3({ url })
  return new PrismaClient({ adapter, log: ["query"] })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
