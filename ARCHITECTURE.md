# 🗺️ ARCHITECTURE.md — Peta Arsitektur Gunara OS (v1)

**Fase 1 TANAH-SUCI · Langkah 2 Roadmap 99 Langkah · Diratifikasi 16 November 2026**
Peta resmi seluruh modul Gunara OS: 44 model data, 16 API route, 44 seksi navigasi, 33 komponen aplikasi, 49 domain pengetahuan, 15 agen pintar, Dewan 46, dan kontrak antarmodul yang mengikat semuanya. Peta ini wajib diperbarui setiap ada modul baru; keputusan yang melahirkan arsitektur tercatat di `docs/adr/`.

by Gugun Gunara — Muhammad Lutfi Azmi · PT Top Konsultan Internasional · PT Digital Bisnis Manajemen

---

## 1. Prinsip Arsitektur

1. **Hulu → Mesin → Hilir.** Segala informasi mengalir satu arah yang jelas: ritual & piagam (hulu, diisi sekali) memandu mesin (dirawat mingguan) yang menghasilkan bukti & cerita (hilir, dijalankan harian).
2. **Satu sumber kebenaran per fakta.** Versi di `branding.ts`, riwayat rilis di `versioning.ts`, skema di `prisma/schema.prisma`, katalog layanan di `service-catalog.ts`. Tidak ada duplikasi yang bisa drift — yang berulang di-sync oleh script.
3. **Kontrak eksplisit antarmodul.** Modul berbicara melalui kontrak tertulis di §3, bukan lewat import liar lintas lapisan.
4. **Database-first.** Model Prisma adalah kebenaran data; API generik membawakannya; komponen mengonsumsinya lewat satu hook yang sama.

## 2. Tumpukan Teknologi (Realitas Produksi)

| Lapisan | Teknologi | Catatan Kontrak |
|---|---|---|
| Framework | Next.js 16.1.3 (App Router) + React 19 | Produksi memakai output `standalone`, dijalankan **Node** (bukan Bun) |
| Bahasa | TypeScript 5, `strict: true`, `noImplicitAny: false` | `tsc --noEmit` wajib nol error |
| UI | Tailwind CSS 4 + shadcn/ui + lucide-react | Ikon hanya dari lucide-react yang valid |
| Data | Prisma 7.10.1, generator `prisma-client` → `src/generated/prisma` | Bukan `@prisma/client` lama; import selalu dari hasil generate |
| Database | SQLite lokal (`db/custom.db`, adapter `@prisma/adapter-better-sqlite3`) ⇄ Prisma Postgres prisma.io (adapter `@prisma/adapter-pg`) | Auto-switch via env — Kontrak A |
| AI | `z-ai-web-dev-sdk` (chat, ASR, TTS, VLM, gambar) | Semua panggilan AI lewat route handler server |
| Runtime kunci | `GUNARA_VAULT_KEY`, `DATABASE_URL`, `PRISMA_POSTGRES_URL` | Rahasia hanya di env — Kontrak A & F |

## 3. Kontrak Antarmodul (Yang Mengikat)

**Kontrak A — Data Layer (`src/lib/db.ts`)**: satu ekspor `db` berlaku global. Jika `PRISMA_POSTGRES_URL` terisi → adapter `PrismaPg`; jika kosong → `PrismaBetterSqlite3` dengan `DATABASE_URL` (default `file:./db/custom.db`). Kode apa pun tidak boleh membuat `PrismaClient` sendiri, kecuali skrip administrasi di `scripts/` yang memakai pola import + adapter yang sama.

**Kontrak B — API Generik**: `/api/data/[resource]` (GET list + POST create, filter `whereKey`/`whereVal`) dan `/api/data/[resource]/[id]` (GET/PATCH/DELETE) membawakan **seluruh 44 model** secara seragam: validasi nama resource terhadap skema, auto-seed `usaDocument` (45 dokumen) bila tabel kosong, `idWhere` khusus untuk UsaDocument (PATCH/DELETE by kode `USA-01..45`). Komponen tidak menulis query Prisma langsung.

**Kontrak C — API Khusus**: `/api/health` (kesehatan DB + integritas tabel), `/api/version` (manifest rilis dari `RELEASES`), `/api/backup` (export data), `/api/brain` & `/api/briefing` (agregasi lintas-tabel → AI → simpan), `/api/sage` (tanya-jawab data), `/api/arena` & `/api/solver` (mesin Dewan 46), `/api/seo/*` (audit, keywords, optimize, proposal, competitor). Khusus briefing: agregasi memakai field skema yang sah (`Cashflow.nilai`, `DailyLog.mit1..mit3`) — dilarang mengarang nama field.

**Kontrak D — Registri Versi & Rilis**: `branding.ts` memegang `VERSION` tunggal; `scripts/version.ts` menyinkronkan 7 titik (package.json, branding.ts, version.json, RELEASES, CHANGELOG) dan `version:check` menolak rilis yang tidak konsisten; `versioning.ts` mengekspos `APP_VERSION`, `APP_CHANNEL`, dan `RELEASES: ReleaseEntry[]` (added/changed/fixed/verified) untuk Release Center & manifest runtime.

**Kontrak E — Navigasi & i18n**: `src/components/app/nav.ts` adalah registri tunggal 44 seksi (id, label, ikon, grup) — dipakai AppShell dan Command Palette; `i18n.ts` menyimpan pilihan bahasa (localStorage `gunara-lang`) dan menandai `<html lang>`.

**Kontrak F — Kriptografi (`src/lib/crypto.ts`, server-only)**: brankas memakai AES-256-GCM (`v1:<iv>:<tag>:<cipher>`, standar NIST SP 800-38D), password akun memakai scrypt (N=16384, salt 16B). Kunci berasal dari `GUNARA_VAULT_KEY`; fallback kunci dev dilarang dipakai di produksi.

**Kontrak G — Pola CRUD Klien**: hook `use-records.ts` menyatukan fetch state (list, create, patch, delete) terhadap Kontrak B; `record-table.tsx` merender tabel generic; komponen fitur tidak menulis fetch mentah sendiri untuk resource yang sudah terbawakan.

## 4. Peta Modul Antarmuka (44 Seksi · 33 Komponen)

| Grup | Seksi (id) | Komponen |
|---|---|---|
| 🚀 SEO MASTERY (11) | seo-hub, seo-audit, seo-keywords, seo-ranks, seo-content, seo-calendar, seo-backlinks, seo-competitor, seo-forge, seo-clients, seo-academy | `seo/` (folder khusus) |
| 👑 BRAND (1) | brand | `brand-hub.tsx` |
| 🏭 USAHASIAP (1) | usahasiap | `usahasiap.tsx` |
| 🧠 OMNISCIENT (6) | secondbrain, ideamatrix, habits, analytics, briefing, kalkulator | `second-brain.tsx`, `idea-matrix.tsx`, `habit-streaks.tsx`, `analytics-engine.tsx`, `briefing.tsx`, `kalkulator.tsx` |
| 🌊 HULU (1) | hulu | `hulu.tsx` |
| ⚙️ MESIN (5) | keuangan, klien, relasi, belajar, dokumentasi | `finance.tsx`, `crm.tsx`, `arena.tsx`(relasi), `arsenal.tsx`, `guide.tsx` |
| 🏃 HILIR (4) | harian, mingguan, backlog, keputusan | `record-table.tsx` via `use-records` |
| 🛡️ ARSENAL (3) | domain, agents, sistem | `aset-digital.tsx`, `mesin-lain.tsx`, `brand-hub.tsx` |
| 🧰 Lainnya (13) | vault, release, arena, sage, solver, dewan46, bisnis, perizinan, asetdigital, tutorial, dashboard, … | `vault.tsx`, `release-center.tsx`, `arena.tsx`, `sage.tsx`, `solver.tsx`, `dewan.tsx`, `bisnis.tsx`, `perizinan.tsx`, `dashboard.tsx`, `command-palette.tsx` |

Pustaka inti `src/lib/` (11 modul): `branding.ts`, `versioning.ts`, `db.ts`, `crypto.ts`, `dewan.ts` (Dewan 46), `usahasiap.ts` (data generate dari USMR-001), `service-catalog.ts` (46 layanan), `i18n.ts`, `license-finder.ts`, `utils.ts`, `gunara.tsx`.

## 5. Model Data (44 Tabel Prisma — 100% Terpetakan)

- **Hulu**: Setting, DailyLog, WeeklyReview
- **Keuangan**: Debt, DebtPayment, Receivable, Cashflow, ChildSaving
- **Bisnis**: Client, Customer, Company, ServiceCatalog, Consultation, PermitApplication, FollowUp, Relation, PoliticalActivity
- **Kecerdasan**: Agent, Debate, SageChat, BrainNote, IdeaItem, Habit, HabitLog, Briefing, DecisionLog, BacklogItem, LearningJournal, WinLog, CaseStudy
- **Arsenal**: Domain, AppUser, SocialAccount, VaultEntry
- **SEO (11)**: SeoProject, SeoAudit, KeywordRank, KeywordIdea, ContentPlan, Backlink, CompetitorReport, MetaPreset, SeoProposal
- **UsahaSiap**: UsaDocument

## 6. Aset Kecerdasan Terinventaris

**15 AI Agents** (tabel `agent`, nomor 1–15): CEO-Chief, Finance-Guardian, CRM-Manager, Content-Alchemist, Spirit-Guide, Legal-Eagle, Code-Smith, Social-Maestro, Research-Sage, LinkedIn-Strategist, Video-Editor, Design-Virtuoso, Wikipedia-Architect, Domain-Orchestrator, Learning-Companion — masing-masing dengan platform, gelombang, tupoksi, dan prompt sistem.

**Dewan 46** (`dewan.ts`): 46 persona pakar dalam 12 kelompok (Strategi & Bisnis, Keuangan, Hukum & Legalitas, Teknologi, Marketing & Brand, SDM & Kepemimpinan, Operasional, Hidup & Spiritual, Analitik & Keputusan, Kreatif & Komunikasi, Properti & Aset, Global) — dipakai section Dewan 46, Ultimate Solver, dan Arena.

**49 Domain Money Engine** (tabel `domain`): tier INTI/GATEWAY/FUTURE/PARKED dengan blueprint penghasilan per domain. **UsahaSiap 45 dokumen** (`UsaDocument`, kode USA-01..45) dan **46 layanan katalog** (`ServiceCatalog`) — keduanya di-auto-seed bila kosong.

## 7. Alur Data Contoh (Bukti Kontrak Bekerja)

`POST /api/briefing`: kumpulkan 10 denyut paralel (dailyLog, debt AKTIF, followUp, cashflow 60 terakhir, habit+logs, habitLog hari ini, idea AKTIF, backlog, domain, winLog) → rakit `ringkasanData` dari field skema sah → `zai.chat.completions.create` dengan prompt staf presiden → markdown ≤220 kata → upsert `Briefing` unik per tanggal WIB (`Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" })`). Ini pola acuan bagi modul AI berikutnya (Langkah 19–27).

## 8. Batasan yang Terikat Konstitusi

1. Produksi memakai Node + `standalone` (better-sqlite3 belum mendukung Bun) — `npm start`.
2. `crypto.ts` server-only; tidak boleh diimpor komponen klien.
3. `src/generated/` hasil generate — tidak di-edit manusia, di-exclude dari tsc/eslint, wajib di-`prisma generate` setelah clone.
4. Modul native database masuk `serverExternalPackages` (tidak di-bundle).
5. `skills/`, `examples/`, `src/generated/` di-exclude dari tsc dan eslint (keputusan ADR-004).
6. Semua tanggal operasional zona WIB (`Asia/Jakarta`) — hari sistem berganti pukul 00:00 WIB, bukan UTC.

**Status peta: 44 model · 16 API · 44 seksi · 33 komponen · 11 modul lib — 100% terpetakan.** (Indikator selesai Langkah 2 terpenuhi.)
