# 💾 BACKUP — Kebijakan Cadangan Data 3-2-1 Gunara OS

**Fase 1 TANAH-SUCI · Langkah 6 Roadmap 99 Langkah · v1.0 (16 November 2026)**
Indikator selesai Langkah 6: **jadwal cadangan teruji + latihan pemulihan berhasil satu kali** — keduanya terpenuhi (lihat §4).

---

## 1. Pola 3-2-1

| Prinsip | Implementasi Nyata |
|---|---|
| **3 salinan** | (1) DB hidup `db/custom.db` yang dipakai aplikasi; (2) arsip cadangan di `backups/` (snapshot SQLite + export JSON dalam satu `.tar.gz`); (3) salinan offsite — repositori GitHub (`git push` membawa `backups/`) dan/atau perintah eksternal (`rclone`/`rsync`/drive cloud) via argumen `--offsite` |
| **2 media** | File SQLite (biner, pulih instan) + export JSON seluruh 44 tabel (platform-agnostik, pulih ke SQLite maupun Postgres cloud) |
| **1 offsite** | `git push origin` (GitHub gunaracorp/gunaraos) — otomatis setiap rilis; opsional `bash scripts/backup.sh "rclone copy backups remote:gunara-os"` untuk media ketiga yang benar-benar terpisah |

## 2. Menjalankan Cadangan

```bash
bash scripts/backup.sh                        # lokal: snapshot + JSON + tar.gz + sha256 + retensi 14
bash scripts/backup.sh "<perintah offsite>"   # sekaligus salinan offsite
```

Alur dalam `scripts/backup.sh`:
1. `node scripts/db-snapshot.mjs` — snapshot online-safe (`db.backup()` bawaan better-sqlite3, aman saat WAL aktif), `integrity_check` ganda (sumber & salinan), manifest hitung baris per tabel.
2. `node scripts/db-export.mjs` — export JSON 44 tabel (media kedua).
3. Bundel `.tar.gz` + checksum `.sha256`; file antara dibersihkan.
4. Offsite (bila diberi perintah) + retensi: 14 arsip terakhir disimpan.

**Jadwal yang disepakati:** harian (cron/otomasi lingkungan kerja), plus wajib sebelum setiap rilis bertag dan sebelum setiap migrasi skema (`db:push`/`db:migrate-cloud`).

## 3. Runbook Pemulihan (Bencana Nyata)

1. `sha256sum -c backups/<arsip>.sha256` — verifikasi arsip utuh.
2. `tar -xzf backups/<arsip>.tar.gz -C /tmp/restore` — ekstrak snapshot `.db`.
3. `node scripts/restore-drill.mjs /tmp/restore/gunara-snapshot-*.db` — uji integritas + kecocokan 44 tabel.
4. Bila data pulih divalidasi: hentikan aplikasi → ganti `db/custom.db` dengan snapshot → `npm run start` → `GET /api/health` → `dbOk: true` + `totalRows` cocok.
5. Bila mode cloud: jalankan pipeline `db:migrate-cloud` (export JSON → push tabel → import + verifikasi).
6. Catat insiden + durasi pemulihan di `worklog.md` (target RTO ≤ 1 jam — Fase 7 menuntaskan infrastrukturnya).

## 4. Log Latihan Pemulihan (Bukti)

**Latihan #1 — 16 November 2026, 18:06 WIB (pertama, Langkah 6):**

- Arsip: `backups/gunara-backup-20261116-180646.tar.gz` (113 KB, checksum terlampir)
- Snapshot: 44 tabel · **220 baris** · `integrity_check` sumber `ok` · salinan `ok` · baris cocok: `true`
- Export JSON: 220 baris dari 44 tabel (`Setting` 8 · `Domain` 49 · `Agent` 15 · `ServiceCatalog` 46 · `UsaDocument` 45 · `WinLog` 5 · dst.)
- Pemulihan: ekstrak → buka `better-sqlite3` readonly → integritas `ok` → **220/220 baris cocok di 44/44 tabel → LULUS**
- Uji baca kembali tabel `Setting`: ok
- Laporan tersimpan: `backups/drill-report-*.txt`

**Kesimpulan:** latihan pemulihan berhasil — cadangan terbukti bisa dipulihkan, bukan sekadar dibuat. Latihan diulang setiap bulan dan setiap sebelum rilis mayor.
