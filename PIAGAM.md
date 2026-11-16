# ⚜️ PIAGAM GUNARA OS — KONSTITUSI SISTEM

**Dokumen v1.0 · Diratifikasi 16 November 2026 (Kuartal IV 2026) · Bagian dari Fase 1 TANAH-SUCI (Langkah 1 Roadmap 99 Langkah)**

Piagam ini adalah konstitusi Gunara OS: sumber tertinggi arah, batasan, dan nilai seluruh keputusan teknis maupun non-teknis pada sistem. Setiap modul, skema database, rilis, dan kontribusi wajib tunduk pada piagam ini; perubahan isi piagam hanya sah melalui log keputusan (ADR) dengan alasan tertulis dan disetujui pemilik amanah.

by **Gugun Gunara — Muhammad Lutfi Azmi** · prabudanling · Santri Angon
PT Top Konsultan Internasional (topkonsultan.web.id) · PT Digital Bisnis Manajemen (digiman.id)

---

## 1. Visi

Menjadi **sistem operasi hidup & bisnis yang dijadikan acuan dunia** — sebuah arsitektur terbuka yang membuktikan bahwa satu orang berdisiplin, dibantu dewan kecerdasan buatan yang terstruktur, dapat membangun institusi digital yang berjejak panjang: dari stabilisasi penghasilan, pendataan yang tak pernah hilang, kecerdasan yang beretika, hingga legitimasi standar dunia (ISO 27001 & ISO 9001) dan warisan yang melebihi usia penciptanya.

Bukti visi diukur, bukan diklaim: sebelas fase Roadmap 99 Langkah ditutup satu per satu dengan rilis mayor bertag, dari `v11.0.0 TANAH-SUCI` hingga `v100.0.0 ACUAN-DUNIA`.

## 2. Misi

1. **Mengorganisasi seluruh kehidupan & bisnis ke dalam satu sistem** — hulu (ritual, piagam, refleksi), mesin (keuangan, domain, usaha, SEO, legalitas), hilir (cerita, studi kasus, kontribusi) — sehingga tidak ada satu pun aset pengetahuan yang hilang.
2. **Menjaga data sebagai amanah** — setiap baris di 44 tabel data bisa dipertanggungjawabkan, dicadangkan pola 3-2-1, dan dipulihkan kapan pun; nol kehilangan data pada setiap migrasi.
3. **Membangun kecerdasan yang bisa diwariskan** — Dewan 46 (46 persona pakar lintas bidang), 15 agen pintar, dan 49 domain pengetahuan bekerja di atas guardrail etika dan regulasi Indonesia, bukan di atas improvisasi.
4. **Menjanjikan kepatuhan → pendapatan** kepada UMKM Indonesia melalui UsahaSiap OS (register 45 dokumen controlled) — dari belum legal menjadi siap menghasilkan.
5. **Menerbitkan standar, bukan sekadar produk** — dokumentasi hidup, design system, metodologi Gunara Method (compliance to revenue), dan sumber terbuka modul inti.

## 3. Nilai Amanah (Konstitusi Nilai)

| Nilai | Makna Operasional | Bukti di Dalam Sistem |
|---|---|---|
| **Amanah** | Segala yang dipercaya (data, dana, rahasia, waktu) dijaga lebih baik daripada saat diterima | Vault AES-256-GCM, cadangan 3-2-1, audit trail, nol kredensial di kode sumber |
| **Tertib** | Urutan dan disiplin mengalahkan dorongan; tidak ada jalan pintas di gerbang mutu | Gerbang mutu (lint, tipe, uji unit, version:check) wajib hijau sebelum rilis |
| **Transparan** | Keputusan meninggalkan jejak yang bisa dibaca orang lain | ADR, CHANGELOG, worklog, release notes bertag |
| **Berjejak** | Output sistem adalah bukti yang bisa diverifikasi, bukan klaim | Win Log, studi kasus, indeks SEO terukur, laporan keuangan standar |
| **Berbuah** | Teknologi wajib menghidupi dirinya dan umatnya | UsahaSiap compliance-to-revenue, katalog 46 layanan konsultasi, dasbor pendapatan |

## 4. Tata Kelola (Cara Keputusan Diambil)

1. **Roadmap 99 Langkah** (`ROADMAP.md`) adalah acuan tunggal urutan pekerjaan — 11 fase, masing-masing ditutup satu rilis mayor bertag dengan nama sandi.
2. **Gerbang mutu** tidak dapat dinegosiasikan: `tsc --noEmit` nol error, `eslint` nol pelanggaran, uji unit cakupan ≥ 70% (modul murni), `version:check` SEMUA OK, dan `next build` sukses — semuanya hijau sebelum tag rilis dibuat.
3. **Versi & nama sandi**: SemVer 2.0.0 dengan nama sandi huruf-kapital-sambung-garis untuk setiap rilis (`GERBANG-MUTU`, `TANAH-SUCI`, …); satu sumber kebenaran di `src/lib/branding.ts`, dipaksa konsisten oleh `scripts/version.ts`.
4. **Keputusan arsitektur** dicatat sebagai ADR (`docs/adr/`) bernomor berurutan dengan konteks, keputusan, dan konsekuensi — sebelum kode ditulis, bukan setelah.
5. **Rahasia tidak pernah masuk kode**: kredensial hidup di `.env` (tidak di-commit) dan vault terenkripsi; token akun layanan dirotasi dan tidak pernah ditempel di percakapan atau log.
6. **Dewan 46** menjadi pengatur laju: fitur baru melewati deliberasi singkat (naikkan nilai, jaga tata kelola, jangan menyebar tanpa arah) sebelum masuk roadmap kuartal.

## 5. Ratifikasi

Dengan membaca sholawat dan niat yang benar, piagam ini **disahkan sebagai konstitusi Gunara OS** dan mengikat seluruh modul, kontributor, dan rilis mulai v11.0.0 TANAH-SUCI. Dokumen piagam diri pribadi (Setting `piagam` di dalam database, dibaca setiap Senin pagi) berlaku sebagai lampiran pribadi di bawah konstitusi ini — keduanya tidak saling menggantikan.

**Ditandatangani secara digital,**

**Gugun Gunara — Muhammad Lutfi Azmi**
Pemilik Amanah Gunara OS · prabudanling · Santri Angon
Jakarta, 16 November 2026 (Kuartal IV 2026)
