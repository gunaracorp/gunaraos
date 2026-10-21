#!/usr/bin/env bun
// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — VERSION CONTROL CLI
// ═══════════════════════════════════════════════════════════════════
// Satu perintah untuk naikkan & sinkronkan versi di SELURUH proyek:
//
//   bun run version:show              → tampilkan info versi saat ini
//   bun run version:check             → validasi konsistensi 7 titik
//   bun run version:patch             → 9.2.0 → 9.2.1 (fix bug)
//   bun run version:minor             → 9.2.0 → 9.3.0 (fitur baru)
//   bun run version:major             → 9.2.0 → 10.0.0 (breaking)
//   bun scripts/version.ts bump beta  → prerelease 9.3.0-beta.1
//   bun scripts/version.ts set 9.3.0  → set versi persis
//   bun run version:sync              → regenerasi version.json + rapikan drift
//
// File yang di-sync otomatis: VERSION · package.json · src/lib/branding.ts
// (export const VERSION) · public/version.json.
// Data catatan rilis ditulis manual di src/lib/versioning.ts (RELEASES)
// + CHANGELOG.md — lalu divalidasi oleh `version:check`.
// Kebijakan lengkap: VERSIONING.md
// ═══════════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type * as Versioning from "../src/lib/versioning";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const F_VERSION = path.join(ROOT, "VERSION");
const F_PKG = path.join(ROOT, "package.json");
const F_BRANDING = path.join(ROOT, "src/lib/branding.ts");
const F_MANIFEST = path.join(ROOT, "public/version.json");
const F_CHANGELOG = path.join(ROOT, "CHANGELOG.md");

const BRAND_RE = /export const VERSION = "([^"]+)";/

/** Muat modul versioning (dynamic import — setiap CLI run = proses baru = data terfresh). */
async function loadVersioning(): Promise<typeof Versioning> {
  return import("../src/lib/versioning");
}

/** Tanggal hari ini di zona Asia/Jakarta (YYYY-MM-DD). */
function todayJakarta(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

function readVersionFile(): string {
  if (!existsSync(F_VERSION)) fail("File VERSION tidak ditemukan di root proyek.");
  return readFileSync(F_VERSION, "utf8").trim();
}

function readBrandingVersion(): string {
  const src = readFileSync(F_BRANDING, "utf8");
  const m = BRAND_RE.exec(src);
  if (!m) fail('Tidak menemukan "export const VERSION = \\"...\\";" di src/lib/branding.ts');
  return m[1];
}

function writeBrandingVersion(v: string): void {
  const src = readFileSync(F_BRANDING, "utf8");
  let hit = 0;
  const out = src.replace(BRAND_RE, () => {
    hit++;
    return `export const VERSION = "${v}";`;
  });
  if (hit !== 1) fail(`branding.ts: pola VERSION ditemukan ${hit}× (harus tepat 1×) — batal untuk keamanan.`);
  writeFileSync(F_BRANDING, out, "utf8");
}

function readPkgVersion(): string {
  const pkg = JSON.parse(readFileSync(F_PKG, "utf8")) as { version?: string };
  return pkg.version ?? "";
}

/** Bangun manifest public/version.json dari data RELEASES + argumen. */
function buildManifest(
  V: typeof Versioning,
  v: string,
  codename?: string,
  date?: string,
  channel = "stable",
): string {
  const p = V.parseVersion(v)!;
  const entry = V.RELEASES.find((r) => r.version === v);
  const prevLatest = V.sortedReleases()[0];
  const latest = entry
    ? { version: entry.version, date: entry.date, codename: entry.codename, title: entry.title, summary: entry.summary }
    : prevLatest
      ? { version: prevLatest.version, date: prevLatest.date, codename: prevLatest.codename, title: prevLatest.title, summary: prevLatest.summary }
      : null;
  const full = {
    name: "GUNARA OS",
    version: v,
    versionShort: `v${p.major}.${p.minor}`,
    codename: entry?.codename ?? codename ?? latest?.codename ?? null,
    channel: entry?.channel ?? channel,
    releaseDate: entry?.date ?? date ?? latest?.date ?? null,
    generatedAt: new Date().toISOString(),
    semver: { major: p.major, minor: p.minor, patch: p.patch, prerelease: p.prerelease, build: p.build },
    releaseCount: V.RELEASES.length,
    latestRelease: latest,
    notesComplete: Boolean(entry && ((entry.added?.length ?? 0) + (entry.changed?.length ?? 0) + (entry.fixed?.length ?? 0) > 0)),
    standards: ["SemVer 2.0.0", "Keep a Changelog 1.1.0", "Conventional Commits 1.0.0"],
    links: {
      api: "/api/version",
      staticManifest: "/version.json",
      changelog: "/CHANGELOG.md",
      policy: "/VERSIONING.md",
      ui: "ARSENAL → Release Center",
    },
  };
  return JSON.stringify(full, null, 2) + "\n";
}

function writeAll(V: typeof Versioning, v: string, opts: { codename?: string; date?: string }): void {
  // 1. VERSION
  writeFileSync(F_VERSION, v + "\n", "utf8");
  // 2. package.json (pertahankan format 2-spasi)
  const pkg = JSON.parse(readFileSync(F_PKG, "utf8")) as Record<string, unknown> & { version: string };
  pkg.version = v;
  writeFileSync(F_PKG, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  // 3. branding.ts — single source of truth runtime
  writeBrandingVersion(v);
  // 4. public/version.json
  writeFileSync(F_MANIFEST, buildManifest(V, v, opts.codename, opts.date), "utf8");
}

function fail(msg: string): never {
  console.error(`\n✗ GAGAL: ${msg}\n`);
  process.exit(1);
}

function parseArgs(argv: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--codename") out.codename = argv[++i] ?? "";
    else if (a === "--date") out.date = argv[++i] ?? "";
    else if (a === "--channel") out.channel = argv[++i] ?? "";
  }
  return out;
}

// ───────────────────────────── perintah ─────────────────────────────

async function cmdShow(): Promise<void> {
  const V = await loadVersioning();
  const v = readVersionFile();
  const p = V.parseVersion(v);
  if (!p) fail(`Isi VERSION bukan SemVer valid: "${v}"`);
  const entry = V.RELEASES.find((r) => r.version === v);
  const stats = V.releaseStats();
  console.log(`
GUNARA OS — Version Control
────────────────────────────────────────
  Versi          : v${v}  (${p.major}.${p.minor}.${p.patch}${p.prerelease ? `-${p.prerelease}` : ""})
  Codename       : ${entry?.codename ?? "—"}
  Judul          : ${entry?.title ?? "—"}
  Channel        : stable
  Tanggal rilis  : ${entry?.date ?? "—"}
  Total rilis    : ${stats.totalReleases} (${stats.added} added · ${stats.changed} changed · ${stats.fixed} fixed)
  package.json   : ${readPkgVersion()}
  branding.ts    : ${readBrandingVersion()}
────────────────────────────────────────
  Detail lengkap : buka aplikasi → VERSION → Release Center
`);
}

async function cmdCheck(): Promise<void> {
  const V = await loadVersioning();
  const v = readVersionFile();
  const p = V.parseVersion(v);
  if (!p) fail(`Isi VERSION bukan SemVer valid: "${v}"`);
  const results: { ok: boolean; msg: string }[] = [];

  // 1. SemVer valid
  results.push({ ok: true, msg: `SemVer 2.0.0 valid: ${v} (major=${p.major} minor=${p.minor} patch=${p.patch}${p.prerelease ? ` pre=${p.prerelease}` : ""})` });

  // 2. package.json sinkron
  const pv = readPkgVersion();
  results.push({ ok: pv === v, msg: pv === v ? `package.json sinkron (${pv})` : `package.json BEDA: "${pv}" ≠ "${v}" — jalankan bun run version:sync` });

  // 3. branding.ts sinkron
  const bv = readBrandingVersion();
  results.push({ ok: bv === v, msg: bv === v ? `branding.ts sinkron (${bv})` : `branding.ts BEDA: "${bv}" ≠ "${v}" — jalankan bun run version:sync` });

  // 4. version.json sinkron
  if (existsSync(F_MANIFEST)) {
    const m = JSON.parse(readFileSync(F_MANIFEST, "utf8")) as { version?: string };
    results.push({ ok: m.version === v, msg: m.version === v ? `public/version.json sinkron (${m.version})` : `public/version.json BEDA: "${m.version}" ≠ "${v}" — jalankan bun run version:sync` });
  } else {
    results.push({ ok: false, msg: "public/version.json tidak ada — jalankan bun run version:sync" });
  }

  // 5. ReleaseEntry untuk versi stabil
  const entry = V.RELEASES.find((r) => r.version === v);
  if (p.prerelease) {
    results.push({ ok: true, msg: `Prerelease ${v} — entri RELEASES opsional (ditemukan: ${entry ? "ya" : "belum"})` });
  } else {
    results.push({
      ok: Boolean(entry),
      msg: entry ? `ReleaseEntry v${v} ada di versioning.ts` : `ReleaseEntry v${v} BELUM ADA di src/lib/versioning.ts — wajib dicatat (VERSIONING.md §5 langkah 4)`,
    });
  }

  // 6. CHANGELOG heading
  const cl = existsSync(F_CHANGELOG) ? readFileSync(F_CHANGELOG, "utf8") : "";
  const hasHeading = cl.includes(`## [${v}]`);
  if (p.prerelease) {
    results.push({ ok: true, msg: `Prerelease — heading CHANGELOG opsional (ditemukan: ${hasHeading ? "ya" : "belum"})` });
  } else {
    results.push({
      ok: hasHeading,
      msg: hasHeading ? `CHANGELOG.md punya heading "## [${v}]"` : `CHANGELOG.md TIDAK punya heading "## [${v}]" — ubah [Unreleased] menjadi rilis resmi`,
    });
  }

  // 7. Urutan RELEASES terbaru dulu
  const versions = V.RELEASES.map((r) => r.version);
  let ordered = true;
  for (let i = 1; i < versions.length; i++) {
    if (V.compareVersions(versions[i - 1]!, versions[i]!) < 0) { ordered = false; break; }
  }
  results.push({ ok: ordered, msg: ordered ? "RELEASES terurut benar (terbaru dulu)" : "RELEASES tidak terurut terbaru-dulu — perbaiki urutan di versioning.ts" });

  console.log(`\nGUNARA OS — version:check (v${v})`);
  console.log("─".repeat(56));
  for (const r of results) console.log(`${r.ok ? "✓" : "✗"} ${r.msg}`);
  console.log("─".repeat(56));
  const allOk = results.every((r) => r.ok);
  console.log(allOk ? "✓ SEMUA OK — sistem versi konsisten. Siap commit + tag!\n" : "✗ ADA MASALAH — perbaiki di atas, lalu jalankan ulang.\n");
  process.exit(allOk ? 0 : 1);
}

async function cmdBump(kindRaw: string): Promise<void> {
  const V = await loadVersioning();
  const kinds = ["major", "minor", "patch", "alpha", "beta", "rc"] as const;
  const kind = kindRaw as (typeof kinds)[number];
  if (!kinds.includes(kind as never)) fail(`Jenis bump tidak dikenal: "${kindRaw}". Gunakan: ${kinds.join(" · ")}`);
  const cur = readVersionFile();
  const next = V.bumpVersion(cur, kind);
  const args = parseArgs(process.argv.slice(3));
  const date = args.date || todayJakarta();

  writeAll(V, next, { codename: args.codename, date });

  console.log(`
✓ Naik versi ${kind.toUpperCase()}: v${cur} → v${next}
✓ Tersinkron 4 file:
    · VERSION
    · package.json ("version": "${next}")
    · src/lib/branding.ts (export const VERSION)
    · public/version.json (manifest)
`);

  if (kind === "alpha" || kind === "beta" || kind === "rc") {
    console.log("Prerelease aktif. Saat stabil nanti: bun run version:patch|minor|major akan melepas prerelease.\n");
    return;
  }

  console.log(`SEKARANG catat perubahannya (WAJIB — biar setiap perubahan jelas):
  1. src/lib/versioning.ts → tambah ReleaseEntry v${next} di paling ATAS array RELEASES:
       {
         version: "${next}",
         date: "${date}",
         codename: ${args.codename ? `"${args.codename}"` : '"NamaRilis"'},
         title: "Judul singkat",
         channel: "stable",
         summary: "Ringkasan 1-2 kalimat",
         added: ["fitur baru ..."],
         changed: ["penyempurnaan ..."],
         fixed: ["bug diperbaiki ..."],
       }
  2. CHANGELOG.md → ubah "## [Unreleased]" menjadi "## [${next}] - ${date}${args.codename ? ` — ${args.codename}` : ""}"
     (sisakan "## [Unreleased]" kosong di atasnya untuk siklus berikutnya).
  3. worklog.md → append Work Log terstruktur (template VERSIONING.md §7).
  4. Validasi: bun run version:check  → harus SEMUA OK.
  5. Kunci di git:
       git add -A
       git commit -m "chore(release): v${next}${args.codename ? ` — ${args.codename}` : ""}"
       git tag -a v${next} -m "GUNARA OS v${next}${args.codename ? ` — ${args.codename}` : ""}"
  6. Deploy + cek /api/version & section Release Center.
`);
}

async function cmdSet(target: string): Promise<void> {
  const V = await loadVersioning();
  if (!V.isValidVersion(target)) fail(`"${target}" bukan SemVer valid (contoh: 9.2.0 · 9.3.0-beta.1)`);
  const cur = readVersionFile();
  const args = parseArgs(process.argv.slice(3));
  const date = args.date || todayJakarta();
  writeAll(V, target, { codename: args.codename, date });
  console.log(`✓ Versi diset: v${cur} → v${target} (4 file tersinkron). Lanjutkan dengan catatan rilis + version:check.\n`);
}

async function cmdSync(): Promise<void> {
  const V = await loadVersioning();
  const v = readVersionFile();
  if (!V.isValidVersion(v)) fail(`Isi VERSION bukan SemVer valid: "${v}"`);
  const args = parseArgs(process.argv.slice(3));
  const pv = readPkgVersion();
  const bv = readBrandingVersion();
  let fixed = 0;
  if (pv !== v) {
    const pkg = JSON.parse(readFileSync(F_PKG, "utf8")) as Record<string, unknown> & { version: string };
    pkg.version = v;
    writeFileSync(F_PKG, JSON.stringify(pkg, null, 2) + "\n", "utf8");
    fixed++;
  }
  if (bv !== v) { writeBrandingVersion(v); fixed++; }
  writeFileSync(F_MANIFEST, buildManifest(V, v, args.codename, args.date), "utf8");
  console.log(`✓ Sync selesai: VERSION=${v} · package.json=${v} · branding.ts=${v} · version.json digenerate (${fixed} drift diperbaiki).\n`);
}

// ───────────────────────────── router ───────────────────────────────

const [, , cmd, ...rest] = process.argv;
switch (cmd) {
  case "show": void cmdShow(); break;
  case "check": void cmdCheck(); break;
  case "bump": void cmdBump(rest[0] ?? ""); break;
  case "set": void cmdSet(rest[0] ?? ""); break;
  case "sync": void cmdSync(); break;
  default:
    console.log(`
GUNARA OS — Version Control CLI

  bun scripts/version.ts show                     info versi saat ini
  bun scripts/version.ts check                    validasi konsistensi seluruh sistem versi
  bun scripts/version.ts bump <major|minor|patch|alpha|beta|rc>
                                                  naikkan versi + sync 4 file otomatis
                                                  [--codename "Nama"] [--date YYYY-MM-DD]
  bun scripts/version.ts set <X.Y.Z>              set versi persis + sync
  bun scripts/version.ts sync                     perbaiki drift + regenerasi public/version.json

Alias package.json: bun run version:show|check|patch|minor|major|sync
Kebijakan lengkap: VERSIONING.md
`);
}
