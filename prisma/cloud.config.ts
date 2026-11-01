import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// 🌩️ Config CLOUD — Prisma Postgres di prisma.io (free tier)
// Dipakai oleh: bun run db:cloud:push / db:cloud:generate / db:cloud:studio
// Prasyarat: PRISMA_POSTGRES_URL terisi di .env (connection string dari console.prisma.io)
export default defineConfig({
  schema: "schema.postgres.prisma",
  datasource: {
    url: env("PRISMA_POSTGRES_URL"),
  },
});
