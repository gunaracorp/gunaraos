import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// 🗄️ Konfigurasi Prisma 7+ (standar baru, menggantikan config di package.json)
// - MODE LOKAL: URL SQLite diambil dari DATABASE_URL (.env)
// - Runtime PrismaClient memakai driver adapter (lihat src/lib/db.ts)
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
