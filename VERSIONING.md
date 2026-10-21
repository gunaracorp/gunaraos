# GUNARA OS — Versioning & Release Policy (Kebijakan Versioning)

> **Standar internasional yang diikuti:**
> - [Semantic Versioning 2.0.0](https://semver.org) — aturan nomor versi
> - [Keep a Changelog 1.1.0](https://keepachangelog.com) — format catatan perubahan
> - [Conventional Commits 1.0.0](https://conventionalcommits.org) — format pesan commit
>
> by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon
> PT Top Konsultan Internasional (topkonsultan.web.id) · PT Digital Bisnis Manajemen (digiman.id)

---

## 1. Format Versi

Setiap rilis GUNARA OS bernomor:

```
MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]
         └── contoh: v9.1.2
```

| Bagian | Kapan naik | Contoh nyata di GUNARA OS |
|---|---|---|
| **MAJOR** | Perubahan **besar/breaking**: struktur data lama tidak kompatibel, modul utama dihapus, cara pakai berubah total | v8→v9 (arsitektur data & metadata dirombak) |
| **MINOR** | **Fitur baru** yang kompatibel ke belakang: section baru, API baru, integrasi baru | v9.0→v9.1 (bottom-nav, FAB, safe-area) |
| **PATCH** | **Perbaikan bug / polish** tanpa fitur baru, tanpa breaking | v9.1.0→v9.1.1 (fix overflow tabel, fix lint) |

**Contoh membaca `v9.1.2`:**
- `9` — generasi kesembilan arsitektur (super app + SEO Mastery + Data Vault).
- `1` — rilis fitur pertama setelah v9.0 ("Full Responsive").
- `2` — patch kedua dari v9.1: hanya perbaikan bug & penyempurnaan kecil, **nol fitur baru, nol breaking change**.

**Aturan tambahan (SemVer 2.0.0):**
- Nomor dimulai dari `0.1.0` saat proyek lahir; `1.0.0` = pertama kali dianggap stabil.
- Setelah rilis, **dilarang mengubah** isi rilis itu — perubahan masuk versi berikutnya.
- Pre-release: `9.3.0-alpha.1`, `9.3.0-beta.2`, `9.3.0-rc.1` → urutan: alpha < beta < rc < stable.
- Build metadata (opsional, tidak mempengaruhi urutan): `9.3.0+build.20261022`.

## 2. Kode Nama Rilis (Codename)

Setiap rilis **MAJOR/MINOR** wajib punya **codename** + **judul** yang mudah diingat:

| Versi | Codename | Judul |
|---|---|---|
| 7.0.0 | Fondasi | Hulu → Mesin → Hilir + God Mode + Dewan 46 |
| 8.0.0 | SEO Mastery | Arsenal Konsultan SEO #1 |
| 9.0.0 | Data Vault | Data Aman · Metadata Lengkap · Standar Internasional |
| 9.1.0 | Full Responsive | Sempurna di Semua Perangkat |
| 9.2.0 | Version Control | Sistem Kontrol Versi Terpadu |

Rilis **PATCH** tidak wajib codename (cukup judul singkat perbaikan).

## 3. Kategori Perubahan Wajib (Keep a Changelog)

Setiap rilis menjelaskan perubahan **per kategori** — inilah yang membuat "fitur apa yang ditambah/dikurangi/disempurnakan" selalu jelas:

| Kategori | Arti | Warna UI |
|---|---|---|
| **Added** | Fitur/baru yang ditambahkan | 🟢 emerald |
| **Changed** | Perubahan pada fitur yang sudah ada (penyempurnaan) | 🟠 amber |
| **Deprecated** | Fitur yang akan dihapus (masa tenggang) | ⚪ abu |
| **Removed** | Fitur yang dihapus pada rilis ini | 🔴 red |
| **Fixed** | Bug yang diperbaiki | 🔵 sky |
| **Security** | Perbaikan kerentanan keamanan | 🟣 violet |

## 4. File-File Sistem Versioning

| File / Titik | Fungsi | Diubah oleh |
|---|---|---|
| `VERSION` | Nomor versi tunggal (dibaca CLI & tooling) | `scripts/version.ts` (otomatis) |
| `CHANGELOG.md` | Catatan perubahan human-readable (Keep a Changelog) | Manusia (saat rilis) |
| `VERSIONING.md` | Dokumen kebijakan ini | Manusia (bila aturan berubah) |
| `src/lib/branding.ts` → `VERSION` | **Single source of truth** versi untuk runtime | `scripts/version.ts` (otomatis) |
| `src/lib/versioning.ts` → `RELEASES` | Data rilis terstruktur (dipakai UI + API) | Manusia (saat rilis) |
| `package.json` → `version` | Versi ekosistem npm | `scripts/version.ts` (otomatis) |
| `public/version.json` | Manifest machine-readable (tooling eksternal) | `scripts/version.ts` (otomatis) |
| `GET /api/version` | Endpoint metadata versi runtime | Otomatis (baca branding + versioning) |
| Section **Release Center** | Pusat kendali versi di dalam aplikasi | Otomatis (baca data di atas) |
| `worklog.md` | Log kerja teknis per Task ID (level agent) | Manusia/agent (setiap sesi kerja) |
| Git tag `vX.Y.Z` | Penanda rilis di riwayat git | `git tag` saat rilis |

**Prinsip anti-drift:** hanya `scripts/version.ts` yang boleh menyentuh nomor versi di banyak file. Nomor versi di-derive dari `src/lib/branding.ts` → semua titik lain (footer, sidebar, JSON-LD, manifest, API) **otomatis ikut**, tanpa string hardcode.

## 5. Alur Rilis Standar (Release Workflow)

Setiap kali selesai menambah/mengubah/memperbaiki sesuatu, jalankan 7 langkah ini:

```bash
# 1️⃣ Pastikan kode sehat
bun run lint

# 2️⃣ Tentukan jenis naik versi (lihat tabel §1), lalu jalankan SATU perintah:
bun run version:patch    # hanya fix bug          → 9.2.1
bun run version:minor    # ada fitur baru         → 9.3.0
bun run version:major    # ada breaking change    → 10.0.0

# 3️⃣ CLI otomatis men-sync: VERSION · package.json · branding.ts · version.json

# 4️⃣ Catat perubahan (WAJIB — inilah "jelas setiap perubahan"):
#    a. src/lib/versioning.ts → tambah ReleaseEntry versi baru
#       (isi kategori Added/Changed/Fixed/Removed/Security)
#    b. CHANGELOG.md → ubah "## [Unreleased]" menjadi "## [X.Y.Z] - TANGGAL — Codename"
#    c. worklog.md → append Work Log terstruktur (template §7)

# 5️⃣ Validasi konsistensi seluruh sistem versi:
bun run version:check     # ← harus "SEMUA OK"

# 6️⃣ Kunci riwayat di git:
git add -A
git commit -m "chore(release): v9.3.0 — Codename"
git tag -a v9.3.0 -m "GUNARA OS v9.3.0 — Codename"

# 7️⃣ Deploy, lalu verifikasi: buka /api/version & section Release Center
```

## 6. Konvensi Commit → Jenis Naik Versi (Conventional Commits)

| Pesan commit | Arti | Naikkan |
|---|---|---|
| `feat: ...` | Fitur baru | **MINOR** |
| `feat!:` atau footer `BREAKING CHANGE:` | Perubahan merusak kompatibilitas | **MAJOR** |
| `fix: ...` | Perbaikan bug | **PATCH** |
| `perf: ...` | Optimasi performa | PATCH (MINOR bila terasa seperti fitur) |
| `docs: ...` | Dokumentasi saja | tidak menaikkan (tumpuk di rilis berikut) |
| `refactor: ...` | Restrukturisasi tanpa ubah perilaku | tidak menaikkan |
| `style: ...` | Formatting/CSS kosmetik | tidak menaikkan |
| `test:` / `ci:` / `chore: ...` | Pekerjaan teknis | tidak menaikkan |

Contoh: `feat(seo): tambah modul rank tracker harian` → rilis berikutnya wajib **MINOR**.

## 7. Worklog Terstruktur (Level Agent/Kerja)

Setiap sesi kerja (agent maupun manual) **wajib** meng-append `worklog.md` — JANGAN menimpa isi lama. Template baku:

```markdown
---
Task ID: <nomor urut global, sub-tugas pakai akhiran -a/-b>
Agent: <nama agent / "manual">
Task: <ringkasan tugas>

Work Log:
- <langkah konkret 1>
- <langkah konkret 2>

Stage Summary:
- <hasil utama / keputusan penting / artefak yang dihasilkan>
```

**Rantai dokumentasi (semua terhubung):**

```
Kerja selesai → worklog.md (teknis, per Task ID)
            → CHANGELOG.md (user-facing, per rilis & kategori)
            → src/lib/versioning.ts RELEASES (data runtime untuk UI/API)
            → scripts/version.ts bump (sync otomatis 4 file)
            → git tag vX.Y.Z (riwayat permanen)
```

## 8. Definition of Done — Satu Rilis

- [ ] `bun run lint` → 0 error
- [ ] `bunx tsc --noEmit` (atau cek per file) → 0 error
- [ ] `bun run version:check` → **SEMUA OK** (VERSION = package.json = branding = version.json)
- [ ] `RELEASES` berisi entri versi terbaru lengkap dengan kategori perubahan
- [ ] `CHANGELOG.md` punya heading `## [X.Y.Z] - TANGGAL — Codename`
- [ ] `worklog.md` ter-append Work Log terstruktur
- [ ] Verifikasi browser: Release Center menampilkan versi baru + `/api/version` 200
- [ ] Git commit + tag `vX.Y.Z` dibuat

## 9. Integrasi Runtime — Di Mana Versi Muncul Otomatis

1. **Footer & sidebar aplikasi** → `VERSION_SHORT` dari `branding.ts` (contoh: "v9.2").
2. **JSON-LD `SoftwareApplication.softwareVersion`** → `BRAND.version` lengkap (SEO: Google membaca versi).
3. **`GET /api/version`** → manifest JSON (untuk monitoring & integrasi eksternal).
4. **`GET /version.json`** → file statis untuk tooling deploy/CI.
5. **Section Release Center** → timeline seluruh rilis + anatomi SemVer + panduan merilis.
6. **Header API `/api/health`** → ikut membawa `version` dari branding.

## 10. Aturan Emas

1. **Satu sumber kebenaran** — `src/lib/branding.ts` → `VERSION`. Dilarang hardcode "v9.x" di file lain.
2. **Tidak ada rilis tanpa catatan** — `version:check` menolak lolos bila ReleaseEntry/CHANGELOG kosong.
3. **Jangan ubah rilis yang sudah keluar** — tambahkan PATCH baru, jangan edit lama.
4. **Breaking change harus MAJOR** — jangan sembunyikan di MINOR.
5. **Worklog dulu, kode kemudian tetap boleh — tapi worklog jangan pernah bolong.**
