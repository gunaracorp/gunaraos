#!/usr/bin/env node
/**
 * 🗄️ db-snapshot.mjs — Snapshot SQLite aman + hitung baris per tabel (Langkah 6)
 * Jalankan: node scripts/db-snapshot.mjs <dest.db> <manifest.json>
 * Memakai better-sqlite3 `db.backup()` (online-safe wal copy) + integrity_check.
 */
import Database from "better-sqlite3";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [destDb, manifestPath] = process.argv.slice(2);
if (!destDb || !manifestPath) {
  console.error("Pemakaian: node scripts/db-snapshot.mjs <dest.db> <manifest.json>");
  process.exit(1);
}

const DB_PATH = process.env.DATABASE_URL?.replace(/^file:/, "") || path.join(ROOT, "db", "custom.db");
const src = new Database(DB_PATH, { readonly: true });

const integrity = src.pragma("integrity_check", { simple: true });
if (integrity !== "ok") {
  console.error("❌ integrity_check gagal:", integrity);
  process.exit(1);
}

const tables = src
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma%'")
  .all()
  .map((r) => r.name)
  .sort();

const counts = {};
for (const t of tables) counts[t] = src.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get().n;

// Salinan online-safe ke tujuan (bukan cp file mentah — aman saat WAL aktif)
src.backup(destDb).then(() => {
  src.close();
  const restored = new Database(destDb, { readonly: true });
  const recheck = restored.pragma("integrity_check", { simple: true });
  const restoredCounts = tables.map((t) => restored.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get().n);
  restored.close();
  const match = tables.every((t, i) => restoredCounts[i] === counts[t]);
  const manifest = {
    timestamp: new Date().toISOString(),
    source: DB_PATH,
    dest: destDb,
    integritySource: integrity,
    integrityRestoreCopy: recheck,
    tableCount: tables.length,
    totalRows: Object.values(counts).reduce((a, b) => a + b, 0),
    counts,
    rowMatchAfterBackup: match,
  };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ Snapshot ${tables.length} tabel · ${manifest.totalRows} baris · integritas ${recheck} · baris cocok: ${match}`);
  if (!match || recheck !== "ok") process.exit(1);
});
