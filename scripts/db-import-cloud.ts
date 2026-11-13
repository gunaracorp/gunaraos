/**
 * 📥 db-import-cloud.ts — Import data export → Prisma Postgres (prisma.io)
 * Prasyarat:
 *   1. PRISMA_POSTGRES_URL sudah diisi di .env
 *   2. Tabel cloud sudah dibuat: bun run db:cloud:push
 *   3. File db/export-cloud.json ada (dari node scripts/db-export.mjs)
 * Jalankan: bun scripts/db-import-cloud.ts
 *
 * Strategi: hapus isi tabel cloud secara TERBALIK (anak dulu) lalu isi
 * berurutan (induk dulu) dengan createMany + skipDuplicates — bisa diulang.
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const MODELS = [
  "setting", "debt", "debtPayment", "receivable", "cashflow", "childSaving",
  "client", "followUp", "relation", "politicalActivity", "learningJournal",
  "winLog", "caseStudy", "dailyLog", "weeklyReview", "backlogItem",
  "decisionLog", "domain", "agent", "appUser", "customer", "company",
  "socialAccount", "vaultEntry", "permitApplication", "serviceCatalog",
  "consultation", "debate", "sageChat",
  "seoProject", "seoAudit", "keywordRank", "keywordIdea", "contentPlan",
  "backlink", "competitorReport", "metaPreset", "seoProposal",
  "brainNote", "ideaItem", "habit", "habitLog", "briefing", "usaDocument",
];

async function main() {
  const url = process.env.PRISMA_POSTGRES_URL?.trim();
  if (!url) {
    console.error("❌ PRISMA_POSTGRES_URL belum diisi di .env");
    console.error("   Ikuti SETUP-DATABASE.md §3 — ambil connection string dari console.prisma.io");
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync("db/export-cloud.json", "utf8"));
  const data = raw.data as Record<string, any[]>;
  console.log(`📥 Import ke Prisma Postgres (export ${raw.generatedAt}, ${raw.total} baris)\n`);

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }), log: ["error"] });

  console.log("🗑️  Mengosongkan tabel cloud (urutan terbalik — anak dulu)…");
  for (const m of [...MODELS].reverse()) {
    await (db as unknown as Record<string, any>)[m].deleteMany();
  }

  console.log("\n📦 Mengisi data (urutan schema — induk dulu, chunk 100)…");
  let total = 0;
  for (const m of MODELS) {
    const rows = data[m] || [];
    if (!rows.length) continue;
    for (let i = 0; i < rows.length; i += 100) {
      await (db as unknown as Record<string, any>)[m].createMany({
        data: rows.slice(i, i + 100),
        skipDuplicates: true,
      });
    }
    total += rows.length;
    console.log(`  ${m.padEnd(20)} ${String(rows.length).padStart(4)} baris ✔`);
  }

  console.log("\n🔍 Verifikasi hitung baris cloud vs export…");
  let beda = 0;
  for (const m of MODELS) {
    const cloud = await (db as unknown as Record<string, any>)[m].count();
    const lokal = (data[m] || []).length;
    if (cloud !== lokal) {
      beda += 1;
      console.log(`  ⚠️  ${m}: cloud ${cloud} ≠ export ${lokal}`);
    }
  }

  console.log(beda === 0
    ? `\n✅ SEMUA COCOK — ${total} baris dari ${MODELS.length} tabel kini tersimpan di Prisma Postgres (prisma.io)`
    : `\n⚠️  Selesai dengan ${beda} selisih — periksa di atas`);
  await db.$disconnect();
  process.exit(beda === 0 ? 0 : 2);
}

main().catch((e) => {
  console.error("❌ Import gagal:", e);
  process.exit(1);
});
