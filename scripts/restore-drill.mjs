#!/usr/bin/env node
/**
 * 🔁 restore-drill.mjs — Latihan pemulihan cadangan (Langkah 6)
 * Jalankan: node scripts/restore-drill.mjs [path-snapshot.db]
 * Default: snapshot terbaru di backups/. Memulihkan ke direktori latihan,
 * memverifikasi integritas + mencocokkan hitungan baris vs DB hidup.
 * Laporan ditulis ke backups/drill-report-<stamp>.txt
 */
import Database from "better-sqlite3";
import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync, cpSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BACKUP_DIR = path.join(ROOT, "backups");
const DB_PATH = process.env.DATABASE_URL?.replace(/^file:/, "") || path.join(ROOT, "db", "custom.db");

const wanted = process.argv[2];
if (!wanted) {
  const snaps = readdirSync(BACKUP_DIR).filter((f) => f.startsWith("gunara-backup-") && f.endsWith(".tar.gz")).sort().reverse();
  if (!snaps.length) { console.error("❌ Tidak ada arsip cadangan di backups/"); process.exit(1); }
  console.error("Pemakaian: node scripts/restore-drill.mjs backups/" + snaps[0].replace(".tar.gz", ".db") + "\n(catatan: ekstrak dulu arsip .tar.gz)");
  process.exit(1);
}

const STAMP = new Date().toISOString().replace(/[:.]/g, "-");
const drillDir = path.join(BACKUP_DIR, `drill-${STAMP}`);
mkdirSync(drillDir, { recursive: true });
const restoredPath = path.join(drillDir, "restored.db");
cpSync(path.resolve(ROOT, wanted), restoredPath);

const lines = [];
const log = (s) => { console.log(s); lines.push(s); };

const live = new Database(DB_PATH, { readonly: true });
const restored = new Database(restoredPath, { readonly: true });

const integrity = restored.pragma("integrity_check", { simple: true });
log(`Integritas salinan pulih: ${integrity}`);

const tables = live
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma%'")
  .all().map((r) => r.name).sort();

let mismatches = 0, liveTotal = 0, restoredTotal = 0;
for (const t of tables) {
  const a = live.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get().n;
  const b = restored.prepare(`SELECT COUNT(*) AS n FROM "${t}"`).get().n;
  liveTotal += a; restoredTotal += b;
  const ok = a === b;
  if (!ok) mismatches++;
  log(`${ok ? "✓" : "✗"} ${t.padEnd(22)} hidup=${a} pulih=${b}`);
}
log(`\nTotal: hidup=${liveTotal} · pulih=${restoredTotal} · tabel=${tables.length} · tidak cocok=${mismatches}`);
const pass = integrity === "ok" && mismatches === 0 && liveTotal === restoredTotal;
log(pass ? "🟢 LATIHAN PEMULIHAN: LULUS — data pulih 100%." : "🔴 LATIHAN PEMULIHAN: GAGAL — wajib diinvestigasi.");

// Baca terhadap mantik baca Prisma? Cukup: buat ulang indeks? Tidak perlu. Uji baca 1 baris Setting
try {
  const s = restored.prepare('SELECT "key" FROM Setting LIMIT 1').get();
  log(`Uji baca Setting: ${s ? "ok" : "kosong (masih lulus jika memang kosong)"}`);
} catch { /* tabel boleh kosong */ }

live.close(); restored.close();
writeFileSync(path.join(BACKUP_DIR, `drill-report-${STAMP}.txt`), lines.join("\n") + "\n");
rmSync(drillDir, { recursive: true, force: true });
process.exit(pass ? 0 : 1);
