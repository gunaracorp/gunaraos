# Changelog — GUNARA OS

Semua perubahan penting pada proyek ini tercatat di sini.

Format mengikuti [Keep a Changelog 1.1.0](https://keepachangelog.com/id-ID/1.1.0/),
versioning mengikuti [Semantic Versioning 2.0.0](https://semver.org/id/).
Kebijakan lengkap: lihat [VERSIONING.md](./VERSIONING.md).

Kategori: **Added** (ditambah) · **Changed** (disempurnakan) · **Deprecated** · **Removed** (dihapus) · **Fixed** (diperbaiki) · **Security**

---

## [Unreleased]

## [11.0.0] - 2026-11-16 — TANAH-SUCI

> Penutup Fase 1 (Langkah 1–9) Roadmap 99 Langkah: konstitusi, arsitektur, standar mutu, keamanan, cadangan, dokumentasi, dan CI — fondasi yang tak tergoyahkan sebelum fase apa pun yang lebih besar.

### Added
- **Konstitusi ratifikasi** (`PIAGAM.md`): visi menjadi acuan dunia, lima misi, lima nilai amanah (Amanah · Tertib · Transparan · Berjeak · Berbuah), tata kelola gerbang mutu yang tidak bisa dinegosiasikan, dan ratifikasi tertanda — mengikat seluruh modul & rilis mulai v11.0.0.
- **Peta arsitektur v1** (`ARCHITECTURE.md`): 100% modul terpetakan dari data nyata — 44 model Prisma per domain, 16 API route, 44 seksi navigasi (8 grup), 33 komponen, 15 AI Agents bernama, Dewan 46, 49 domain engine, UsahaSiap 45 dokumen, 46 layanan — plus **8 kontrak antarmodul** (Data Layer, API Generik, API Khusus, Registri Versi, Navigasi & i18n, Kriptografi, CRUD Klien) dan batasan konstitusi (Node produksi, server-only crypto, WIB).
- **Standar kode & keputusan arsitektur** (`CONTRIBUTING.md` + `docs/adr/ADR-001..005`): 7 aturan kode wajib (field = skema Prisma, satu sumber kebenaran, kontrak Prisma 7 + adapter, server-only, tanggal WIB), Conventional Commits, pola uji, gerbang mutu; lima ADR: generator prisma-client Prisma 7, database dual-mode adapter, SemVer + nama sandi rilis, lingkup tsc/eslint (skills/examples/generated excluded), lingkup cakupan uji (9 modul murni).
- **Pipeline rilis terpadu** (`RELEASE-PROCESS.md` + `scripts/release-check.sh`): 9 tahap dengan titik gagal eksplisit (tsc → lint → uji → version:check → build → naik versi → catatan → tag → verifikasi runtime), aturan codename KAPITAL-SAMBUNG-GARIS sejak ADR-003, aturan bertag, prosedur rollback.
- **Kebijakan keamanan** (`SECURITY.md`): rahasia hanya di `.env` + vault AES-256-GCM; rotasi token wajib; **bukti scan nol kredensial di kode sumber**; audit dependensi `npm audit` **27 → 13 kerentanan** (2 critical & 12 high bertasih via `audit fix` non-breaking); sisa 2 high (`js-yaml` 4.x tanpa backport, `sharp` menunggu rilis tetap libvips) dicatat sebagai **accepted risk** dengan alasan & rencana.
- **Cadangan 3-2-1 teruji** (`scripts/db-snapshot.mjs`, `scripts/backup.sh`, `scripts/restore-drill.mjs`, `BACKUP.md`): snapshot SQLite online-safe (`db.backup()` + `integrity_check` ganda), export JSON 44 tabel, bundel tar.gz + sha256, retensi 14 arsip, salinan offsite via git push/perintah eksternal; **latihan pemulihan #1 LULUS — 220/220 baris cocok di 44/44 tabel**; jadwal harian + sebelum setiap rilis/migrasi.
- **Uji unit invarian sistem** (vitest + `@vitest/coverage-v8`, 53 tes di `src/lib/__tests__/`): Dewan 46 tepat 46 anggota bernomor 1–46, UsahaSiap USA-01..45 unik berstatus sah, 46 layanan + rules engine 10 sektor, versi sinkron 7 titik (parse/compare/bump/manifest), kripto AES-256-GCM roundtrip + kunci salah ditolak + scrypt + strength NIST + strip/reveal secrets, i18n dua bahasa lengkap. **Cakupan ≥70% dipaksakan** (threshold global): stmts **87,3%** · branch **71,9%** · funcs **95,7%** · lines **89,0%** (`vitest.config.ts` + ADR-005).
- **CI GitHub Actions** (`.github/workflows/ci.yml`): gerbang mutu otomatis di setiap push/PR — npm ci → prisma generate → tsc → lint → **scan nol kredensial** → vitest cakupan → next build. Indikator Langkah 3 & 8 (CI hijau) aktif.
- `package-lock.json` + devDependencies vitest/@vitest/coverage-v8 — lockfile terkunci untuk `npm ci` & audit.

### Fixed
- `scripts/restore-drill.mjs`: `path.join` menelan path absolut argumen → `path.resolve` — latihan pemulihan kini bisa dijalankan dari lokasi mana pun.

### Verified
- `npx tsc --noEmit` 0 error · `bun run lint` 0 error 0 warning · `bun run version:check` SEMUA OK · `npm run build` sukses (20 route) 🚀
- `npm test` — 53/53 lulus, cakupan 4 dimensi ≥ 70% · scan kredensial nol kecocokan · `npm audit` 27→13
- Latihan pemulihan 3-2-1 LULUS (220/220 baris · 44 tabel) · runtime: `/api/health` ok+dbOk, `POST /api/briefing` menghasilkan briefing WIB nyata, homepage 200

## [10.2.1] - 2026-11-16 — GERBANG-MUTU

### Fixed
- **Bug runtime senyap Analytics Engine**: seluruh statistik arus kas (masuk/keluar bulan ini, pembanding bulan lalu, chart 6 bulan) selalu bernilai nol karena agregasi memakai field `c.jumlah` yang tidak ada pada model `Cashflow` — diperbaiki menjadi `c.nilai` (`src/components/app/analytics-engine.tsx`).
- **Bug data yang sama di AI Morning Briefing**: `POST /api/briefing` mengagregasi `c.jumlah` → diperbaiki ke `c.nilai`; ringkasan MIT memakai `mitPagi`/`malam` yang tidak ada pada skema `DailyLog` → kini menampilkan `mit1..mit3` lengkap dengan status selesai/belum plus refleksi (`src/app/api/briefing/route.ts`).
- **3 skrip seed lolos Prisma 7**: `scripts/seed.ts`, `seed-bisnis.ts`, `seed-domains-money.ts` mengimpor `PrismaClient` dari `@prisma/client` yang tidak lagi mengekspornya (Prisma 7 memancarkan client ke `src/generated/prisma`) — kini memakai import relatif `../src/generated/prisma/client` + adapter `PrismaBetterSqlite3` pada konstruktor, konsisten dengan `src/lib/db.ts` dan `scripts/db-import-cloud.ts`.
- **Tipe tuple `WINS` di `scripts/seed.ts`**: anotasi 3 elemen pada data 4 elemen (tanggal, kemenangan, bukti, jadiKonten) — diperbaiki menjadi tuple 4 elemen sehingga destrukturisasi `jadiKonten` sah.
- **Interface `ReleaseEntry`** (`src/lib/versioning.ts`) kini mendeklarasikan `verified?: string[]` — entri rilis v10.2.0 yang memuat bukti verifikasi tidak lagi gagal type-check.
- **`tsconfig.json`**: `skills` dan `examples` masuk `exclude` (selaras `eslint.config.mjs`) — berkas demo/socket.io dan skrip skill tidak lagi mengotoriti hasil type-check proyek; `src/generated` ikut dikecualikan karena hasil generate.

### Verified
- `npx tsc --noEmit` — **0 error** (sebelumnya 17 error TypeScript) 🚀
- `bun run lint` — 0 error, 0 warning
- `bun run version:check` — SEMUA OK (7 titik konsistensi versi)
- `npm run build` — sukses, 20 route terbangun tanpa cacat
- Runtime: `/api/health` ok+dbOk (38 tabel · 174 baris), `POST /api/briefing` menghasilkan briefing WIB dari data nyata, homepage 200

## [10.2.0] - 2026-11-01 — PUSAT-DATA

### Added
- **Arsitektur database dual-mode LOKAL ⇄ CLOUD**: `src/lib/db.ts` kini database client pintar — otomatis memakai **Prisma Postgres prisma.io** begitu `PRISMA_POSTGRES_URL` diisi di `.env`, dan kembali ke **SQLite lokal** (`db/custom.db`) bila tidak. Tanpa mengubah satu baris kode aplikasi.
- **Pipeline migrasi data otomatis**: `scripts/db-export.mjs` (export seluruh tabel SQLite → JSON), `scripts/db-import-cloud.ts` (import ke Prisma Postgres: hapus terbalik lalu createMany skipDuplicates), `scripts/db-migrate-cloud.sh` (orkestrator satu perintah: export → push tabel → import → verifikasi hitung baris).
- **Schema cloud `prisma/schema.postgres.prisma`** (provider `postgresql`) yang di-auto-generate dari schema utama oleh `scripts/sync-pg-schema.sh` — semua model dijamin 100% identik, tidak bisa "drift".
- **Config cloud `prisma/cloud.config.ts`** (standar Prisma 7) + **7 script npm baru**: `db:cloud:sync`, `db:cloud:push` (buat semua tabel di cloud), `db:cloud:generate`, `db:cloud:studio`, `db:cloud:off` (kembali ke lokal), `db:migrate-cloud`.
- **`.env.example`** berbahasa Indonesia berisi contoh kedua mode, dan **panduan lengkap `SETUP-DATABASE.md`**: langkah aktivasi free tier prisma.io (2 GB storage · 200.000 operations/bulan · 50 database · tanpa kartu kredit) dari daftar akun hingga data terpindah.
- **`prisma.config.ts`** — file konfigurasi resmi Prisma 7+ (menggantikan konfigurasi di `package.json`), memuat `.env` via dotenv untuk CLI.
- **Restorasi penuh pasca-reset lingkungan kerja**: Brand & Social Hub (v9.4.0), enam mesin kognitif OMNISCIENT (v10.0.0), dan UsahaSiap OS Register Explorer 45 dokumen (v10.1.0) dibangun ulang di atas riwayat git v9.3.0; `src/lib/usahasiap.ts` di-generate terprogram dari USMR-001 v1.0 via `scripts/gen-usahasiap-data.py`.
- **API baru**: `POST /api/brain` (AI Ringkasan Second Brain) dan `GET`/`POST /api/briefing` (AI Morning Briefing — upsert satu per hari WIB dari agregasi seluruh database).
- Auto-seed 45 dokumen `UsaDocument` saat tabel kosong; upsert `habitLog` per habit×tanggal; PATCH/DELETE `usaDocument` via kode.

### Changed
- **Upgrade Prisma 6.11.1 → 7.10.1** (generasi rust-free) beserta driver adapter resmi: `@prisma/adapter-better-sqlite3` (SQLite lokal) dan `@prisma/adapter-pg` (Postgres cloud).
- `prisma/schema.prisma`: generator `prisma-client-js` → **`prisma-client`** dengan output eksplisit `src/generated/prisma`; datasource tanpa properti `url` (wajib Prisma 7 — URL pindah ke `prisma.config.ts`).
- `next.config.ts`: `serverExternalPackages` untuk modul native database (tidak di-bundle).
- `package.json` version 9.3.0 → 10.2.0 (major + 2 minor); `.gitignore` mengecualikan `!.env.example`; ESLint mengabaikan folder hasil generate `src/generated/**` dan folder referensi `usahasiap-src/**`.
- Navigasi: grup 👑 BRAND, 🏭 USAHASIAP, dan 🧠 OMNISCIENT (6 item) ditambahkan setelah grup SEO MASTERY.

### Fixed
- Script produksi `start` kini berjalan di **Node** (bukan Bun) — modul native `better-sqlite3` belum didukung runtime Bun (oven-sh/bun#4290); dev server Next.js sudah berjalan di Node sehingga tidak terdampak.
- Ikon `Hole` tidak valid pada lucide-react (diganti `TrendingDown`); field `domainNama` disisihkan saat auto-seed; probe SEO brand-hub didedarkan agar tidak setState sinkron dalam effect.

## [10.1.0] - 2026-11-01 — USAHASIAP

### Added
- **🏭 UsahaSiap OS — Compliance-to-Revenue OS** (grup navigasi baru setelah 👑 BRAND): integrasi repo `github.com/gunaracorp/usahasiap-compliance-to-revenue-os` ke dalam Gunara OS, dengan konten bersumber dari **USMR-001 Master Document Register v1.0** (baseline 31 Oktober 2026) + USM-00..04.
  - Hero visi (USA-01 DRAFT v0.3), positioning, thesis produk, tombol repo GitHub, dan jangkar "by Gugun Gunara — Muhammad Lutfi Azmi · didukung PT Top Konsultan Internasional + PT Digital Bisnis Manajemen".
  - **Statistik live** dari database: jumlah dokumen, domain, master volume, dan progres penulisan berbobot (Approved 100% · Review 70% · Draft 40% · Terdaftar 0%).
  - **Pipeline Compliance → Revenue** 5 tahap: Kepatuhan → Dokumen & Bukti → Kesiapan Usaha → Profil Pemasok → Revenue.
  - **5 Master Volume** (USM-00..04) + kartu Register USMR-001.
  - **Register Explorer interaktif** — 45 controlled documents (USA-01..45) tersimpan di SQLite: pencarian (kode/nama/PGA/owner/output), filter domain A–I, filter gelombang 1–5, filter status 8 nilai; klik baris membuka detail (owner-role, reviewer, dependensi, referensi PGA165, keluaran minimum USMR-001 §6); **ubah status langsung** (PATCH → toast → tersimpan permanen) dan **catatan progres** per dokumen.
  - **9 Domain cards** dengan progress bar live (klik kartu = filter explorer).
  - **5 Stage Gates** (Problem Evidence → Paid Pilot → MVP Release → Repeatability → Expansion) dan **5 Gelombang Pengerjaan** dengan progres live per gelombang.
  - **Guardrail janji** (boleh/tidak boleh), **6 risiko utama**, **prioritas 14 hari pertama**, dan catatan sumber kebenaran + batas tanggung jawab (bukan pengganti OSS/regulator/nasihat hukum).
- **Skema Prisma baru**: `UsaDocument` (@id `kode` USA-01..45, domain, pgaRef, ownerRole, reviewer, dependensi, gelombang, status, output, catatan).
- **Resource CRUD baru** di API generik `/api/data`: `usaDocument` — dengan **auto-seed 45 dokumen** saat tabel kosong, sorting `kode`, dan dukungan PATCH/DELETE via `kode` (helper `idWhere`).
- 15 keyword SEO baru untuk entitas UsahaSiap tertanam di metadata.
- i18n EN untuk grup 🏭 USAHASIAP dan item UsahaSiap OS.

### Changed
- Versi 10.0.0 → 10.1.0 (minor — satu section baru dengan register database interaktif).

## [10.0.0] - 2026-11-01 — OMNISCIENT

### Added
- **Enam mesin kognitif baru** dalam grup navigasi 🧠 OMNISCIENT:
  - **AI Morning Briefing** — staf presiden pribadi: sistem membaca seluruh database (MIT hari ini, hutang & tenggat, follow-up, arus kas bulan ini, kebiasaan, ide dampak tertinggi) lalu menyusun briefing pagi markdown yang tersimpan satu per hari (API `/api/briefing`, model `Briefing`).
  - **Second Brain** — otak kedua polimatik: catatan dengan kategori (IDE/INSIGHT/KUTIPAN/RENCANA/BELAJAR/LAIN), tags, pin, pencarian instan, filter tag, plus **AI Ringkasan** per catatan (ringkasan 1 kalimat, 3 poin kunci, saran kategori & tags, 2 koneksi lintas-bidang) via API `/api/brain`; saran AI dapat diterapkan sekali klik.
  - **Idea Matrix** — peta prioritas visual Dampak × Usaha dengan 4 kuadran: ⚡ Quick Wins, 🏔️ Big Bets, 🍬 Fill-Ins, 🕳️ Money Pits; titik ide interaktif, status AKTIF → DIEKSEKUSI → SELESAI/CORET.
  - **Habit Streaks** — mesin bunga majemuk disiplin: grid 14 hari yang bisa diklik (zona WIB), streak berjalan + rekor terbaik, progres mingguan vs target, ProgressRing harian.
  - **Analytics Engine** — agregasi data nyata: 6 KPI (kas masuk/keluar, net, piutang, hutang, klien aktif) dengan animasi CountUp, BarChart arus kas 6 bulan, dan funnel pipeline klien berbasis nilai kontrak.
  - **Kalkulator Bisnis** — 5 kalkulator instan sisi klien: Break-Even Point, Margin & Harga Jual (memisahkan margin vs markup), ROI + payback period, Cicilan Anuitas (metode bank), Proyeksi Tabungan (Future Value).
- **Skema Prisma baru**: `BrainNote`, `IdeaItem`, `Habit` + `HabitLog` (unik per habit×tanggal), `Briefing` (satu per hari WIB).
- **Resource CRUD baru** di API generik `/api/data`: `brainNote`, `ideaItem`, `habit`, `habitLog`, `briefing`.
- i18n EN lengkap untuk seluruh item navigasi baru.

### Changed
- Versi 9.3.0 → 10.0.0 (major — enam modul baru + satu section brand).
- Navigasi: grup 🧠 OMNISCIENT (6 item) ditambahkan setelah grup 👑 BRAND.

## [9.3.0] - 2026-10-22 — Domain Money Engine

### Added
- **Portfolio Domain Lengkap (49 domain)** — seluruh domain registrar (48) + `prabudanling.web.id` (domain utama, LIVE) kini terdata satu per satu dengan data asli: status registrar, tanggal kedaluwarsa, jatuh tempo tagihan, biaya perpanjangan/tahun, dan auto-kredit.
  - 45 AKTIF · 3 MENUNGGU pembayaran (mehudi.or.id, juragankompresor.web.id, gopijat.web.id) · 1 REDEMPTION (pppbisnis.com — ⚠️ tebus Rp 215rb sekarang atau hilang).
  - 6 domain yang sebelumnya hilang dari sistem kini terdata: bambuwater.web.id, degerasia.web.id, gohajj.web.id, gopijat.web.id, gorefleksi.web.id, juragankompresor.web.id.
- **Kolom "Apa Isi Website Ini" + Strategi Monetisasi** (blueprint uang per domain) — setiap domain kini punya: blueprint konten (halaman, fitur, konten apa yang diisi), strategi cara menghasilkan uang, dan estimasi potensi revenue/bulan. Total potensi gabungan **Rp 266,5 juta/bulan** vs biaya perawatan **Rp 3,96 juta/tahun** (ROI tahunan ×806).
- **Skema Prisma Domain diperluas** — field baru: `regStatus`, `berakhir`, `jatuhTempo`, `hargaPerpanjangan`, `autoKredit`, `kategori` (7 cluster bisnis), `isiWebsite`, `monetisasi`, `potensiRp`.
- **Seed `scripts/seed-domains-money.ts`** — penanam 49 domain + blueprint (aman diulang, opsi `--force`).
- **Section "Domain Money Engine"** (grup Arsenal) — antarmuka monetisasi portofolio total baru:
  - Hero + **6 KPI live** dari database: Total Domain, Aktif, Perlu Bayar, Biaya/Tahun, Potensi/Bulan, ROI Tahunan.
  - **Alert Aksi Segera**: chip REDEMPTION (tebus pppbisnis.com), chip tagihan menunggu (total Rp 165rb), chip kedaluwarsa ≤90 hari.
  - Tab **💰 Blueprint Uang**: kartu per domain dalam 7 kelompok bisnis (Konsultan & Perizinan, Agency Digital, Jasa & Otomotif, Produk & F&B, Media & Portal, Umrah & Spiritual, Personal Brand) dengan subtotal potensi per cluster + dialog blueprint lengkap (angka, countdown kedaluwarsa, blok "apa isi website", blok "cara menghasilkan uang", tombol salin).
  - Tab **💡 Dewan Monetisasi**: 7 sistem uang lintas domain — Mesin Leads Konsultan, Agency Chain, AdSense Media Network, Kuartal Umrah, Jasa Lokal WA-Landing, Produk & F&B, Personal Brand — plus kartu Aturan Emas dan checklist **Aksi Cepat Minggu Ini**.
  - Tab **📋 Kelola Data**: tabel 49 domain 10 kolom (kategori, status registrar, berakhir, jatuh tempo, biaya, potensi) — semua field editable via form.
- **Kalkulasi live anti-hydration**: KPI & countdown dihitung dari data DB dengan pola mounted-safe (aman SSR + semua perangkat).

### Changed
- `DOMAIN_CONFIG` di-upgrade: +9 field form dan 10 kolom tabel dengan format rupiah, tanggal, dan badge berwarna (AKTIF hijau / MENUNGGU amber / REDEMPTION merah).
- Semua label "43 Domain" di seluruh aplikasi diperbarui menjadi "49 Domain Money Engine" (nav, i18n EN, vault, guide, app-shell header, brand signature).

### Fixed
- Data portofolio tidak sinkron dengan registrar (6 domain hilang, status tagihan tidak terlihat) — kini 100% terdata dan status kritis tampil di UI dengan instruksi aksi.

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
