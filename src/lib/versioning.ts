// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — VERSIONING REGISTRY (Registry Rilis Terstruktur)
// ═══════════════════════════════════════════════════════════════════
// Data rilis machine-readable — dipakai oleh:
//   · Section "Release Center" (timeline + statistik + anatomi SemVer)
//   · GET /api/version (manifest runtime)
//   · scripts/version.ts (CLI — validasi & generasi public/version.json)
//
// Standar: SemVer 2.0.0 · Keep a Changelog 1.1.0 · Conventional Commits
// Kebijakan lengkap: VERSIONING.md · Changelog human-readable: CHANGELOG.md
//
// by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon
// ═══════════════════════════════════════════════════════════════════

import { BRAND } from "./branding";

export type ReleaseChannel = "stable" | "rc" | "beta" | "alpha";

/** Entri satu rilis — mirror dari CHANGELOG.md, dalam bentuk data. */
export interface ReleaseEntry {
  version: string;
  /** Tanggal rilis (YYYY-MM-DD, zona Asia/Jakarta). */
  date: string;
  codename: string;
  title: string;
  channel: ReleaseChannel;
  summary: string;
  added?: string[];
  changed?: string[];
  deprecated?: string[];
  removed?: string[];
  fixed?: string[];
  security?: string[];
}

/** Nomor versi aplikasi — mengikuti single source of truth di branding.ts (di-sync oleh scripts/version.ts). */
export const APP_VERSION: string = BRAND.version;

/** Channel rilis aktif. */
export const APP_CHANNEL: ReleaseChannel = "stable";

// ─────────────────────────────────────────────────────────────────────
// RIWAYAT RILIS — urut terbaru dulu.
// WAJIB: entri versi APP_VERSION (non-prerelease) selalu ada di sini;
// `bun run version:check` menolak rilis tanpa entri + catatan lengkap.
// Template entri baru: lihat VERSIONING.md §5 langkah 4.
// ─────────────────────────────────────────────────────────────────────
export const RELEASES: ReleaseEntry[] = [
  {
    version: "9.3.0",
    date: "2026-10-22",
    codename: "Domain Money Engine",
    title: "49 Domain · 49 Mesin Uang — Portfolio Monetisasi Penuh",
    channel: "stable",
    summary:
      "Seluruh portfolio domain (48 dari registrar + prabudanling.web.id) kini terdata lengkap dengan status registrar asli, tanggal kedaluwarsa, biaya perpanjangan, dan BLUEPRINT 'apa isi website & cara menghasilkan uang' per domain — potensi gabungan Rp 266,5 juta/bulan dengan biaya Rp 3,96 juta/tahun (ROI ×806).",
    added: [
      "Skema Domain diperluas: regStatus (AKTIF/MENUNGGU/REDEMPTION), berakhir, jatuhTempo, hargaPerpanjangan, autoKredit, kategori (7 cluster bisnis), isiWebsite, monetisasi, potensiRp",
      "Seed Domain Money Engine (scripts/seed-domains-money.ts) — 49 domain upsert dengan data registrar asli + blueprint konten + strategi monetisasi + estimasi revenue per domain",
      "Section Domain Money Engine total baru: hero + 6 KPI live (Total, Aktif, Perlu Bayar, Biaya/Tahun, Potensi/Bulan, ROI tahunan), alert aksi segera (REDEMPTION + tagihan menunggu + kedaluwarsa ≤90 hari), 3 tab (Blueprint Uang / Dewan Monetisasi / Kelola Data)",
      "Tab Blueprint Uang: kartu per domain dalam 7 kelompok bisnis dengan subtotal potensi + dialog blueprint lengkap (isi website, cara menghasilkan uang, angka, countdown kedaluwarsa, tombol salin)",
      "Tab Dewan Monetisasi: 7 sistem uang lintas domain (Mesin Leads Konsultan, Agency Chain, AdSense Media Network, Kuartal Umrah, Jasa Lokal WA-Landing, Produk & F&B, Personal Brand) + Aturan Emas + checklist Aksi Cepat Minggu Ini",
      "Tab Kelola Data: tabel kelola 49 domain dengan 10 kolom (kategori, status registrar, berakhir, jatuh tempo, biaya, potensi) — semua editable via form",
      "Kolom 'apa isi website ini' menjawab langsung kebutuhan monetisasi maksimal tiap domain",
    ],
    changed: [
      "DOMAIN_CONFIG di-upgrade: +9 field form & 10 kolom tabel dengan format rupiah/tanggal/badge berwarna",
      "Semua label '43 Domain' di seluruh aplikasi (nav, i18n EN, vault, guide, app-shell, brand signature) → '49 Domain Money Engine'",
    ],
    fixed: [
      "Data portfolio tidak sinkron dengan registrar: 6 domain hilang (bambuwater, degerasia, gohajj, gopijat, gorefleksi, juragankompresor) kini terdata; status riil 3 tagihan MENUNGGU + 1 REDEMPTION (pppbisnis.com) terlihat jelas di UI",
    ],
  },
  {
    version: "9.2.0",
    date: "2026-10-22",
    codename: "Version Control",
    title: "Sistem Kontrol Versi Berstandar Internasional",
    channel: "stable",
    summary:
      "Seluruh proyek kini punya sistem version control penuh — SemVer 2.0.0 + Keep a Changelog + Conventional Commits — dengan CLI satu perintah, API manifest, Release Center di dalam aplikasi, dan single source of truth anti-drift.",
    added: [
      "VERSIONING.md — kebijakan versioning internasional (aturan MAJOR/MINOR/PATCH, alur rilis 7 langkah, mapping Conventional Commits, Definition of Done)",
      "CHANGELOG.md — changelog terstruktur format Keep a Changelog + rekonstruksi seluruh riwayat versi (7.0.0 → sekarang)",
      "File VERSION di root — nomor versi tunggal untuk tooling",
      "scripts/version.ts — CLI version control: show · check · bump major/minor/patch/alpha/beta/rc · set · sync (alias: bun run version:*)",
      "public/version.json — manifest machine-readable untuk tooling deploy/CI eksternal",
      "API GET /api/version — metadata versi runtime (SemVer breakdown, codename, channel, riwayat, tautan)",
      "Section Release Center (grup nav baru VERSION) — anatomi SemVer interaktif (contoh v9.1.2), timeline seluruh rilis per kategori, panduan merilis siap-copy, penampil manifest API",
      "Banner Release Center di Command Center dashboard",
      "Auto-sync satu perintah: VERSION · package.json · branding.ts · version.json tetap seragam, anti-drift",
    ],
    changed: [
      "Refactor single source of truth: src/lib/branding.ts → VERSION; footer, sidebar, i18n, BRAND_DESCRIPTION/TITLE kini di-derive otomatis (string hardcode v9.x dihapus)",
      "i18n.ts — string versi basi diganti derive dinamis dari BRAND.version",
      "Validasi version:check kini menolak rilis tanpa ReleaseEntry + heading CHANGELOG (disiplin catatan wajib)",
    ],
    fixed: [
      "String versi basi \"v9.0\" pada sidebar badge i18n yang tidak ikut ter-update sejak v9.1",
    ],
  },
  {
    version: "9.1.0",
    date: "2026-10-22",
    codename: "Full Responsive",
    title: "Sempurna di Semua Perangkat",
    channel: "stable",
    summary:
      "Audit & upgrade responsivitas total — 35 section lolos 4 viewport (360/768/1024/1440px), dari Android kecil sampai desktop, termasuk browser Android & tablet.",
    added: [
      "Responsive Foundation CSS permanen — .grid>* min-width 0 + guard flex + pengecualian tab-pill",
      "Safe-area utilities (.pt-safe/.pb-safe/.footer-safe) untuk perangkat notch",
      "Tipografi fluid (clamp) + text-wrap balance/pretty",
      "Mobile top bar kontekstual — ikon + judul section aktif + toggle tema/bahasa",
      "Bottom quick-nav satu jempol (Beranda · SEO Hub · Solver · Vault · Lainnya)",
      "Scroll-to-top FAB semua perangkat",
      "Utilities .scrollbar-hide + .scroll-x-snap",
    ],
    changed: [
      "viewportFit=cover + interactiveWidget=resizes-content (keyboard Android tak menutupi input)",
      "Semua dialog max-h dvh + scroll — tak pernah terpotong di layar pendek",
      "Input ≥16px di perangkat sentuh — anti auto-zoom iOS/Android",
      "3 kontainer tabel → overflow-auto (scroll horizontal aman di HP)",
      ".card-lift dimatikan di layar sentuh; sidebar h-dvh anti dynamic-toolbar",
    ],
    fixed: [
      "Bug grid min-width: konten 748px meluarkan halaman di viewport 360px",
      "Bug kontainer margin-auto jadi fit-content (halaman menyempit salah)",
      "Teks tab-trigger meluap 8–28px (regresi guard flex)",
      "7 error TypeScript lama (crm.tsx, hilir.tsx)",
    ],
  },
  {
    version: "9.0.0",
    date: "2026-10-21",
    codename: "Data Vault",
    title: "Data Aman · Metadata Lengkap · Standar Internasional",
    channel: "stable",
    summary:
      "Data tersimpan permanen (SQLite + Backup/Restore), audit seluruh link sehat 100%, metadata super lengkap berstandar internasional, dua bahasa ID/EN, dan desain naik kelas.",
    added: [
      "Section Data Vault & Diagnostik (Backup · Restore · Health Check · Panduan Deploy)",
      "GET/POST /api/backup — ekspor & impor 38 tabel (merge/replace, round-trip 168 baris)",
      "GET /api/health — diagnostik DB, 38 tabel, memori, uptime, latency",
      "Dua bahasa ID/EN persist (i18n) + LangToggle + <html lang> sinkron",
      "Metadata super lengkap: hreflang, OG/Twitter images, appleWebApp, dual themeColor, skip-link WCAG",
      "robots.txt 30+ user-agent (termasuk AI crawlers) + sitemap hreflang + webmanifest 4 shortcuts",
      "JSON-LD SoftwareApplication + FAQPage (6 Q&A brand)",
    ],
    changed: [
      "Desain polish global: scrollbar kustom, .text-gradient-gold, .card-lift, .gunara-prose, .fade-in",
      "Footer kini sticky benar (mt-auto) + konten naik kelas",
    ],
    fixed: [
      "Sticky footer bermasalah saat konten pendek",
      "Path import vault + PK restore natural-key (setting/serviceCatalog)",
      "Audit link: 42 endpoint 200, nol orphan nav↔shell, semua fetch↔route cocok",
    ],
  },
  {
    version: "8.0.0",
    date: "2026-10-21",
    codename: "SEO Mastery",
    title: "Arsenal Konsultan SEO #1",
    channel: "stable",
    summary:
      "11 modul SEO lengkap — audit 40+ sinyal, riset keyword AI, rank tracker, backlink monitor, optimizer konten, kalender editorial, radar kompetitor, meta forge, proposal AI, dan akademi.",
    added: [
      "SEO Command Center dengan KPI live",
      "Audit Engine — 40+ sinyal, skor 4 pilar, rekomendasi AI berbasis metrik nyata",
      "Keyword Studio — 30 keyword AI, cluster, intent, ekspor CSV",
      "Rank Tracker — posisi harian + delta naik/turun",
      "Backlink Monitor — dofollow, DA, kualitas, status",
      "Content Optimizer AI — skor, keterbacaan, meta title/description siap pakai",
      "Content Calendar — kanban 5 tahap dengan deteksi terlambat otomatis",
      "Competitor Radar — gap analysis AI 7 seksi",
      "Meta & Schema Forge — SERP/OG/Twitter preview + 8 builder JSON-LD",
      "Klien & Proposal AI — proposal lengkap satu klik",
      "SEO Academy — masterclass 12 bab + checklist 100 langkah persist",
      "5 API AI: /api/seo/audit · keywords · optimize · competitor · proposal",
      "9 model database baru (SeoProject s/d SeoProposal)",
    ],
    changed: [
      "Navigasi: grup SEO MASTERY di posisi teratas (11 item) + banner SEO live di dashboard",
    ],
  },
  {
    version: "7.0.0",
    date: "2026-10-21",
    codename: "Fondasi",
    title: "Hulu → Mesin → Hilir · God Mode · Dewan 46",
    channel: "stable",
    summary:
      "Integrasi repo gunara-os penuh — 24 modul hasil evolusi v1.0→v7.0: sistem operasi hidup & bisnis dengan kecerdasan kolektif Dewan 46 dan God Mode AI.",
    added: [
      "HULU: Piagam · Visi · OKR",
      "MESIN: Keuangan · CRM · Relasi & Politik · Belajar · Dokumentasi",
      "HILIR: Ritual Harian · Review Mingguan · Backlog · Decisions Log",
      "ARSENAL: 43 Domain · 15 AI Agents · Sistem · Roadmap 90 Hari",
      "GOD MODE: Arena Debat Dewan · Sage Console",
      "DEWAN: Ultimate Solver · Dewan 46 (46 dewan pakar · 150+ tahun/dewan)",
      "BISNIS HUB: Database Bisnis · Perizinan · Aset Digital",
      "PANDUAN: Tutorial lengkap semua fitur",
      "Kerangka: Command Center, ⌘K palette, dark/light, scroll progress, jam WIB",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────
// ATURAN SEMVER — dipakai UI Release Center (anatomi versi)
// ─────────────────────────────────────────────────────────────────────
export const SEMVER_RULES: {
  part: "MAJOR" | "MINOR" | "PATCH";
  when: string;
  example: string;
  exampleWhen: string;
}[] = [
  {
    part: "MAJOR",
    when: "Perubahan besar / breaking — data lama tak kompatibel, modul utama dihapus, cara pakai berubah total.",
    example: "v8 → v9",
    exampleWhen: "Arsitektur data & metadata dirombak (Data Vault, i18n, metadata lengkap).",
  },
  {
    part: "MINOR",
    when: "Fitur baru yang kompatibel ke belakang — section baru, API baru, integrasi baru.",
    example: "v9.0 → v9.1",
    exampleWhen: "Bottom-nav, FAB, safe-area, dialog anti-potong (Full Responsive).",
  },
  {
    part: "PATCH",
    when: "Perbaikan bug / polish tanpa fitur baru, tanpa breaking change.",
    example: "v9.1.0 → v9.1.2",
    exampleWhen: "Fix overflow tabel, fix lint, polish kecil UI.",
  },
];

/** Kategori changelog (Keep a Changelog) — urutan tampil resmi. */
export const CHANGELOG_CATEGORIES = [
  "added",
  "changed",
  "deprecated",
  "removed",
  "fixed",
  "security",
] as const;
export type ChangelogCategory = (typeof CHANGELOG_CATEGORIES)[number];

// ─────────────────────────────────────────────────────────────────────
// HELPER SEMVER 2.0.0
// ─────────────────────────────────────────────────────────────────────

/** Regex resmi SemVer 2.0.0 (semver.org). */
export const SEMVER_RE =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
  build: string | null;
}

/** Parse string versi SemVer → komponen; null bila tidak valid. */
export function parseVersion(v: string): ParsedVersion | null {
  const m = SEMVER_RE.exec(v.trim());
  if (!m) return null;
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease: m[4] ?? null,
    build: m[5] ?? null,
  };
}

/** Validasi string versi terhadap SemVer 2.0.0. */
export function isValidVersion(v: string): boolean {
  return SEMVER_RE.test(v.trim());
}

/** Bandingkan dua versi SemVer: -1 (a<b) · 0 (sama) · 1 (a>b). Mengikuti aturan precedence resmi. */
export function compareVersions(a: string, b: string): number {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) throw new Error(`Versi tidak valid: ${!pa ? a : b}`);
  for (const k of ["major", "minor", "patch"] as const) {
    if (pa[k] !== pb[k]) return pa[k] < pb[k] ? -1 : 1;
  }
  // Sama-sama release tanpa prerelease
  if (!pa.prerelease && !pb.prerelease) return 0;
  // Yang punya prerelease lebih rendah dari yang stabil
  if (pa.prerelease && !pb.prerelease) return -1;
  if (!pa.prerelease && pb.prerelease) return 1;
  const ia = pa.prerelease!.split(".");
  const ib = pb.prerelease!.split(".");
  for (let i = 0; i < Math.max(ia.length, ib.length); i++) {
    const xa = ia[i];
    const xb = ib[i];
    if (xa === undefined) return -1; // set lebih pendek = lebih rendah
    if (xb === undefined) return 1;
    const na = /^\d+$/.test(xa);
    const nb = /^\d+$/.test(xb);
    if (na && nb) {
      const d = Number(xa) - Number(xb);
      if (d !== 0) return d < 0 ? -1 : 1;
    } else if (na !== nb) {
      return na ? -1 : 1; // numerik < alfanumerik
    } else if (xa !== xb) {
      return xa < xb ? -1 : 1;
    }
  }
  return 0;
}

export type BumpKind = "major" | "minor" | "patch" | "alpha" | "beta" | "rc";

/**
 * Hitung versi berikutnya.
 * · major/minor/patch: dari versi stabil → naik sesuai kind; dari prerelease → finalisasi (lepas prerelease).
 * · alpha/beta/rc: keluarkan/naikkan prerelease pada basis M.m.p.
 */
export function bumpVersion(v: string, kind: BumpKind): string {
  const p = parseVersion(v);
  if (!p) throw new Error(`Versi tidak valid: ${v}`);
  if (kind === "major") return `${p.major + 1}.0.0`;
  if (kind === "minor") return `${p.major}.${p.minor + 1}.0`;
  if (kind === "patch") return `${p.major}.${p.minor}.${p.patch + 1}`;
  // Prerelease kinds — basis = M.m.p tanpa prerelease/build
  if (p.prerelease) {
    const ids = p.prerelease.split(".");
    if (ids.length === 2 && ids[0] === kind && /^\d+$/.test(ids[1])) {
      return `${p.major}.${p.minor}.${p.patch}-${kind}.${Number(ids[1]) + 1}`;
    }
  }
  return `${p.major}.${p.minor}.${p.patch}-${kind}.1`;
}

/** Format display: "v9.2.0" (+ channel bila bukan stable). */
export function formatVersion(v: string = APP_VERSION, withChannel = false): string {
  const base = `v${v}`;
  if (withChannel && APP_CHANNEL !== "stable") return `${base}-${APP_CHANNEL}`;
  return base;
}

/** Versi pendek untuk display: "v9.2" dari "9.2.0". */
export function shortVersion(v: string = APP_VERSION): string {
  const p = parseVersion(v);
  return p ? `v${p.major}.${p.minor}` : `v${v}`;
}

// ─────────────────────────────────────────────────────────────────────
// AKSES DATA RILIS
// ─────────────────────────────────────────────────────────────────────

/** Ambil entri rilis berdasarkan versi. */
export function getRelease(v: string = APP_VERSION): ReleaseEntry | undefined {
  return RELEASES.find((r) => r.version === v.trim());
}

/** Seluruh rilis terurut terbaru → terlama. */
export function sortedReleases(): ReleaseEntry[] {
  return [...RELEASES].sort((a, b) => compareVersions(b.version, a.version));
}

/** Entri rilis terbaru. */
export function latestRelease(): ReleaseEntry | undefined {
  return sortedReleases()[0];
}

/** Statistik agregat seluruh rilis — untuk kartu statistik Release Center. */
export function releaseStats(): {
  totalReleases: number;
  added: number;
  changed: number;
  fixed: number;
  removed: number;
  deprecated: number;
  security: number;
  totalItems: number;
} {
  const acc = { added: 0, changed: 0, fixed: 0, removed: 0, deprecated: 0, security: 0 };
  for (const r of RELEASES) {
    acc.added += r.added?.length ?? 0;
    acc.changed += r.changed?.length ?? 0;
    acc.fixed += r.fixed?.length ?? 0;
    acc.removed += r.removed?.length ?? 0;
    acc.deprecated += r.deprecated?.length ?? 0;
    acc.security += r.security?.length ?? 0;
  }
  return {
    totalReleases: RELEASES.length,
    ...acc,
    totalItems: Object.values(acc).reduce((s, n) => s + n, 0),
  };
}

/** Metadata versi runtime lengkap — dipakai /api/version & public/version.json. */
export function versionManifest(generatedAt: string) {
  const p = parseVersion(APP_VERSION);
  const latest = getRelease(APP_VERSION) ?? latestRelease();
  return {
    name: BRAND.siteName,
    version: APP_VERSION,
    versionShort: shortVersion(APP_VERSION),
    codename: latest?.codename ?? null,
    channel: APP_CHANNEL,
    releaseDate: latest?.date ?? null,
    generatedAt,
    semver: p
      ? { major: p.major, minor: p.minor, patch: p.patch, prerelease: p.prerelease, build: p.build }
      : null,
    releaseCount: RELEASES.length,
    latestRelease: latest
      ? {
          version: latest.version,
          date: latest.date,
          codename: latest.codename,
          title: latest.title,
          summary: latest.summary,
        }
      : null,
    standards: ["SemVer 2.0.0", "Keep a Changelog 1.1.0", "Conventional Commits 1.0.0"],
    links: {
      api: "/api/version",
      staticManifest: "/version.json",
      changelog: "/CHANGELOG.md",
      policy: "/VERSIONING.md",
      ui: "ARSENAL → Release Center",
    },
  };
}
