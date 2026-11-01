#!/usr/bin/env node
/**
 * 📤 db-export.mjs — Export seluruh tabel SQLite → JSON (backup & siap migrasi cloud)
 * Jalankan: node scripts/db-export.mjs   (pakai node — better-sqlite3 native)
 * Output  : db/export-cloud.json
 * Catatan : membaca SQLite secara langsung (raw SQL) — tipe BOOLEAN dinormalkan
 *           ke true/false sesuai deklarasi kolom, tanggal tetap ISO string.
 */
import Database from "better-sqlite3";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DB_PATH = process.env.DATABASE_URL?.replace(/^file:/, "") || path.join(ROOT, "db", "custom.db");

// Urutan = schema.prisma (induk sebelum anak). Nama tabel = nama model (default Prisma).
const TABLES = [
  "Setting", "Debt", "DebtPayment", "Receivable", "Cashflow", "ChildSaving",
  "Client", "FollowUp", "Relation", "PoliticalActivity", "LearningJournal",
  "WinLog", "CaseStudy", "DailyLog", "WeeklyReview", "BacklogItem",
  "DecisionLog", "Domain", "Agent", "AppUser", "Customer", "Company",
  "SocialAccount", "VaultEntry", "PermitApplication", "ServiceCatalog",
  "Consultation", "Debate", "SageChat",
  "SeoProject", "SeoAudit", "KeywordRank", "KeywordIdea", "ContentPlan",
  "Backlink", "CompetitorReport", "MetaPreset", "SeoProposal",
  "BrainNote", "IdeaItem", "Habit", "HabitLog", "Briefing", "UsaDocument",
];

if (!existsSync(DB_PATH)) {
  console.error(`❌ Database tidak ditemukan: ${DB_PATH}`);
  process.exit(1);
}

const db = new Database(DB_PATH, { readonly: true });
console.log(`📤 Export SQLite → db/export-cloud.json\n   (${DB_PATH})\n`);

const data = {};
let total = 0;
for (const t of TABLES) {
  const info = db.pragma(`table_info("${t}")`);
  if (!info.length) {
    console.log(`  ${t.padEnd(20)} (tabel tidak ada — lewati)`);
    continue;
  }
  const boolCols = info.filter((c) => /BOOL/i.test(c.type)).map((c) => c.name);
  const rows = db.prepare(`SELECT * FROM "${t}"`).all().map((row) => {
    for (const c of boolCols) row[c] = row[c] === 1 ? true : row[c] === 0 ? false : row[c];
    return row;
  });
  data[t] = rows;
  total += rows.length;
  console.log(`  ${t.padEnd(20)} ${String(rows.length).padStart(4)} baris`);
}

mkdirSync(path.join(ROOT, "db"), { recursive: true });
writeFileSync(
  path.join(ROOT, "db", "export-cloud.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), source: "sqlite-local", total, data }, null, 1),
);
console.log(`\n✅ Selesai — ${total} baris dari ${Object.keys(data).length} tabel → db/export-cloud.json`);
