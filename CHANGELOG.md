# Changelog — GUNARA OS

Semua perubahan penting pada proyek ini tercatat di sini.

Format mengikuti [Keep a Changelog 1.1.0](https://keepachangelog.com/id-ID/1.1.0/),
versioning mengikuti [Semantic Versioning 2.0.0](https://semver.org/id/).
Kebijakan lengkap: lihat [VERSIONING.md](./VERSIONING.md).

Kategori: **Added** (ditambah) · **Changed** (disempurnakan) · **Deprecated** · **Removed** (dihapus) · **Fixed** (diperbaiki) · **Security**

---

## [Unreleased]

## [9.2.0] - 2026-10-22 — Version Control

### Added
- **Sistem Version Control Terpadu** — GUNARA OS kini punya sistem kontrol versi berstandar internasional (SemVer 2.0.0 + Keep a Changelog 1.1.0 + Conventional Commits 1.0.0):
  - `VERSIONING.md` — kebijakan versioning lengkap (aturan naik MAJOR/MINOR/PATCH, alur rilis 7 langkah, mapping commit, Definition of Done).
  - `CHANGELOG.md` — changelog terstruktur (file ini) dengan rekonstruksi seluruh riwayat versi.
  - File `VERSION` di root — nomor versi tunggal untuk tooling.
  - `scripts/version.ts` — CLI version control: `version:check` · `version:patch` · `version:minor` · `version:major` · `version:set` · `version:sync` — men-sync otomatis VERSION + package.json + branding.ts + version.json.
  - `public/version.json` — manifest machine-readable untuk tooling eksternal/deploy/CI.
  - `GET /api/version` — endpoint metadata versi runtime (SemVer, codename, channel, riwayat, tautan).
  - Section **Release Center** — pusat kendali versi di dalam aplikasi: anatomi SemVer interaktif (contoh v9.1.2), timeline seluruh rilis per kategori Added/Changed/Fixed/Removed, panduan merilis dengan perintah siap-copy, dan penampil manifest API.
  - Refactor **single source of truth**: semua string versi (footer, sidebar, i18n, JSON-LD) kini di-derive otomatis dari `src/lib/branding.ts` → `VERSION`; string hardcode dihapus (anti-drift).
  - Riwayat kerja `worklog.md` (Task ID terstruktur) kini terhubung formal ke CHANGELOG + RELEASES + git tag.

## [9.1.0] - 2026-10-22 — Full Responsive

### Added
- **Responsive Foundation CSS** permanen: `.grid > * { min-width: 0 }`, guard flex interaktif dengan pengecualian tab-pill, `-webkit-text-size-adjust`, `touch-action: manipulation`.
- Safe-area utilities (`.pt-safe`, `.pb-safe`, `.footer-safe`) untuk perangkat notch (iPhone/Android modern).
- Tipografi fluid `.text-fluid-hero` / `.text-fluid-title` (clamp) + `text-wrap: balance/pretty`.
- **Mobile top bar kontekstual** — ikon + judul section aktif selalu terlihat, dengan Theme/Lang toggle.
- **Bottom quick-nav satu jempol** (Beranda · SEO Hub · Solver · Vault · Lainnya) dengan pill aktif beranimasi.
- **Scroll-to-top FAB** semua perangkat, aman dari bottom-nav.
- Utilities `.scrollbar-hide` + `.scroll-x-snap` untuk strip chip/tab mobile.

### Changed
- Viewport: `viewportFit=cover` + `interactiveWidget=resizes-content` (keyboard Android mengecilkan konten, input dialog tetap terlihat).
- Semua dialog/alert-dialog: `max-h-[calc(100dvh-2rem)]` + `overflow-y-auto` — tak pernah terpotong di layar pendek/landscape; tombol close diperbesar (touch target).
- Input/textarea/select ≥16px pada perangkat sentuh — anti auto-zoom iOS/Android (terverifikasi computed 16px).
- 3 kontainer tabel (Data Vault, Riwayat Audit, hasil Keyword Studio) → `overflow-auto` (scroll horizontal aman di HP).
- `.card-lift` dimatikan pada layar sentuh (`hover: none`) — anti sticky-hover.
- Sidebar `h-dvh` + root `min-h-dvh` — anti dynamic-toolbar mobile.

### Fixed
- Bug klasik grid `min-width: 0`: konten 748px memaksa halaman melebar di viewport 360px (akar: `.truncate` di dalam grid item).
- Bug kontainer `max-w-6xl mx-auto` sebagai flex item: `margin: auto` menonaktifkan stretch → width jadi `fit-content`; ditambah `w-full`.
- Teks tab-trigger meluap 8–28px setelah guard flex (regresi — diberi pengecualian `min-width: max-content`).
- 7 error TypeScript lama (crm.tsx `useRecords<any>`, hilir.tsx signature).
- Verifikasi akhir: **35/35 section lolos 4 viewport (360/768/1024/1440px)** — `scrollWidth` persis 360px, nol overflow nyata; console & page errors bersih.

## [9.0.0] - 2026-10-21 — Data Vault · Standar Internasional

### Added
- **Data Vault & Diagnostik** (section baru, 3 tab): Backup & Restore (unduh/impor JSON dengan preview counts + mode Gabung/Timpa), Diagnostik (health check 1 klik + probe 14 endpoint + tabel isi 38 tabel), Panduan Deploy.
- `GET /api/backup` — ekspor 38 tabel (format `gunara-os-backup-v1`, meta version/counts).
- `POST /api/backup` — restore mode merge/replace dengan urutan dependensi FK, cap 200k baris; uji round-trip 168/168 baris.
- `GET /api/health` — ping DB, count 38 tabel, memori/uptime/versi, latency.
- **Standar internasional dua bahasa (ID/EN)**: `src/lib/i18n.ts` (persist localStorage `gunara-lang`), terjemahan 35 nav item + 9 grup + string kerangka, LangToggle di header desktop & sidebar mobile, `<html lang>` tersinkron.
- **Metadata super lengkap**: referrer policy, formatDetection, appleWebApp, alternates hreflang (id-ID/en/x-default), OG + Twitter images dengan alt, classification, viewport dual themeColor + colorScheme, skip-link WCAG.
- `robots.txt` 30+ user-agent (mesin cari, social preview bots, AI crawlers GPTBot/PerplexityBot/ClaudeBot) + sitemap + host.
- `sitemap.ts` (daily + alternates hreflang), `site.webmanifest` (display_override, launch_handler, 4 shortcuts).
- `BRAND_FAQ` 6 Q&A → JSON-LD `FAQPage`; JSON-LD `SoftwareApplication` featureList + offers.

### Changed
- Desain polish global: scrollbar tipis kustom (webkit+firefox), font-feature Jakarta Sans, `.text-gradient-gold`, `.card-lift`, tabel markdown `.gunara-prose` (light+dark), `.fade-in`, tap-highlight transparent.
- Footer kini sticky benar (main flex-col + mt-auto) dan naik kelas konten.

### Fixed
- Bug sticky footer (gap mengambang saat konten pendek).
- Bug path import `motion` di vault; bug PK restore natural-key (setting/serviceCatalog).
- Audit link menyeluruh: 18 pemanggilan fetch ↔ 11 route cocok semua, 42 endpoint GET 200, nol orphan nav↔shell (34↔34).

## [8.0.0] - 2026-10-21 — SEO Mastery

### Added
- **11 modul arsenal SEO**: SEO Command Center (KPI live), Audit Engine (40+ sinyal + skor 4 pilar + rekomendasi AI), Keyword Studio (30 keyword AI · cluster · intent · ekspor CSV), Rank Tracker (posisi harian + delta), Backlink Monitor (dofollow/DA/kualitas), Content Optimizer AI (skor + keterbacaan + meta siap pakai), Content Calendar (kanban 5 tahap), Competitor Radar (gap analysis AI), Meta & Schema Forge (SERP/OG/Twitter/JSON-LD · 8 builder schema), Klien & Proposal AI (proposal lengkap satu klik), SEO Academy (masterclass 12 bab + checklist 100 langkah persist).
- **5 API AI**: `POST /api/seo/audit` · `keywords` · `optimize` · `competitor` · `proposal` (semua dengan fallback tahan output AI rusak).
- **9 model database baru**: SeoProject, SeoAudit, KeywordRank, KeywordIdea, ContentPlan, Backlink, CompetitorReport, MetaPreset, SeoProposal.
- Seed data 2 proyek SEO + 6 keyword + 4 backlink + 5 ide + 3 konten.

### Changed
- Navigasi & dashboard: grup "🚀 SEO MASTERY" di posisi teratas (11 item), banner SEO live di Command Center.
- Verifikasi end-to-end via browser: audit nyata example.com (skor 25, 14 temuan), 30 keyword AI, SERP preview, kanban terlambat otomatis, proposal lengkap.

## [7.0.0] - 2026-10-21 — Fondasi (integrasi repo gunara-os)

> Titik awal dokumentasi terstruktur. Modul di bawah adalah hasil evolusi **v1.0 → v7.0** dari repo `github.com/prabudanling/gunara-os` yang kini terintegrasi penuh dengan worklog + database.

### Added
- **HULU (diisi sekali)**: Piagam · Visi · OKR.
- **MESIN (dirawat mingguan)**: Keuangan (hutang · piutang · kas · tabungan anak), Klien/CRM (master + follow-up), Relasi & Politik (ledger kepercayaan), Belajar (jurnal mesin ganda), Dokumentasi (win log + studi kasus).
- **HILIR (dijalankan harian)**: Ritual Harian (3 MIT pagi & malam), Review Mingguan, Backlog ("penjara ide"), Decisions Log.
- **ARSENAL**: Portfolio 43 Domain, 15 AI Agents (role activation siap copy), Sistem (aturan · ritual · stack), Roadmap 90 Hari.
- **GOD MODE**: Arena Debat Dewan (46 dewan saling berdebat lalu diarbitrase), Sage Console (3 wajah kebijaksanaan).
- **DEWAN**: Ultimate Solver (sidang Dewan 46 via AI), Dewan 46 (46 dewan pakar · 150+ tahun pengalaman per dewan).
- **BISNIS HUB**: Database Bisnis (pelanggan · perusahaan), Perizinan (tracker ISO · katalog · finder), Aset Digital (sosmed · brankas · pengguna).
- **PANDUAN**: Tutorial lengkap semua fitur.
- Kerangka aplikasi: Command Center, command palette ⌘K, dark/light theme, scroll progress, jam WIB live, transisi antar-section.

[Semua versi lama sebelum 7.0.0 tidak tercatat per rilis — riwayatnya melebur dalam fondasi v7.0.0 di atas.]
