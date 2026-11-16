# 🚢 RELEASE-PROCESS — Pipeline Rilis Terpadu Gunara OS

**Fase 1 TANAH-SUCI · Langkah 4 Roadmap 99 Langkah · v1.0 (16 November 2026)**
Standar SemVer 2.0.0 + nama sandi rilis (kebijakan lengkap di `VERSIONING.md`, keputusan di `ADR-003`). Pipeline ini satu-satunya cara sah mengeluarkan rilis bertag.

---

## 1. Prinsip Pipeline

Rilis tidak pernah "dibuat mendadak": ia adalah puncak dari gerbang mutu yang hijau. Otomatisasi yang sudah berjalan:

| Tahap | Alat | Titik Gagal |
|---|---|---|
| 1. Mutu kode | `npx tsc --noEmit`, `npm run lint` | Ada 1 error → berhenti |
| 2. Uji unit | `npm test` (vitest, cakupan ≥ 70% modul murni) | Cakupan turun → berhenti |
| 3. Konsistensi versi | `bun run version:check` (7 titik) | Ada titik tidak sinkron → berhenti |
| 4. Build produksi | `npm run build` (20 route) | Build gagal → berhenti |
| 5. Naik versi | `bun run version:patch\|minor\|major` | — |
| 6. Catatan rilis | isi `RELEASES` (`versioning.ts`) + heading `CHANGELOG.md` | Entri kosong → version:check gagal |
| 7. Commit & tag | `chore(release): vX.Y.Z` + tag `vX.Y.Z` | — |
| 8. Terbitkan | push `main` + tag → GitHub Release | — |
| 9. Verifikasi runtime | `GET /api/version` + `/api/health` di build baru | Manifest tidak cocok → rollback |

## 2. Prosedur Resmi (Perintah Nyata)

```bash
# 0) Pastikan gerbang mutu hijau (lihat CONTRIBUTING.md §5)
# 1) Naikkan versi sesuai bobot perubahan
bun run version:patch    # fix  -> 10.2.1
bun run version:minor    # fitur -> 10.3.0
bun run version:major    # fase roadmap -> 11.0.0
# 2) Tulis entri ReleaseEntry (versioning.ts) + heading CHANGELOG.md — wajib berisi
#    summary, added/changed/fixed, dan bukti verified (hasil gerbang mutu nyata)
# 3) Kunci
bun run version:check    # SEMUA OK
git add -A && git commit -m "chore(release): vX.Y.Z" && git tag -a vX.Y.Z -m "GUNARA OS vX.Y.Z NAMA-SANDI"
git push origin main vX.Y.Z
# 4) Terbitkan GitHub Release dari tag (release notes = entri CHANGELOG)
```

Atau satu perintah untuk tahap 0–3: `bash scripts/release-check.sh`.

## 3. Penamaan Nama Sandi (Codename)

- Huruf kapital sambung-garis, satu kata sandi yang membawa makna fase: `PUSAT-DATA`, `USAHASIAP`, `OMNISCIENT`, `GERBANG-MUTU`, `TANAH-SUCI`, `PUSAT-DATA-MAX`, `DEWAN-MAX`, …
- Rilis penutup fase mengikuti nama fase di `ROADMAP.md`; rilis penengah bebas selama bermakna.
- Nama sandi tercatat di `ReleaseEntry.codename` — tampil di Release Center dan `/api/version`.

## 4. Aturan Bertag

1. Tag beranotasi (`git tag -a`) dengan pesan `GUNARA OS vX.Y.Z NAMA-SANDI`.
2. Tag hanya dibuat di commit `chore(release)` — tidak pernah di commit biasa.
3. Tag yang sudah di-push tidak boleh dihapus/diganti; salah tag = versi baru.
4. Rilis mayor penutup fase (v11, v12, …) wajib memuat daftar langkah roadmap yang ditutupnya di `verified`.

## 5. Rollback

Bila `/api/version` atau `/api/health` tidak hijau di produksi: kembalikan deploy ke tag stabil terakhir, catat insiden di `worklog.md`, buka rilis patch berikutnya (`version:patch` + `fixed`). Tag tidak pernah dipindah mundur.
