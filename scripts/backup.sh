#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# GUNARA OS — backup.sh · Cadangan pola 3-2-1 (Langkah 6 Roadmap)
# Pola: 3 salinan (DB hidup + snapshot lokal + offsite) ·
#       2 media (file SQLite + export JSON) · 1 offsite (--offsite "CMD")
# Jalankan: bash scripts/backup.sh ["perintah offsite opsional"]
# Retensi: 14 snapshot terakhir.
# ═══════════════════════════════════════════════════════════════
set -euo pipefail
cd "$(dirname "$0")/.."

STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR=backups
mkdir -p "$BACKUP_DIR"

# 1) Salinan 1 — snapshot SQLite online-safe + manifest hitung baris
node scripts/db-snapshot.mjs "$BACKUP_DIR/gunara-snapshot-$STAMP.db" "$BACKUP_DIR/gunara-manifest-$STAMP.json"

# 2) Salinan 2 — export JSON seluruh 44 tabel (media kedua, siap migrasi/pulih)
node scripts/db-export.mjs
cp db/export-cloud.json "$BACKUP_DIR/gunara-export-$STAMP.json"

# 3) Bundel arsip + checksum
tar -czf "$BACKUP_DIR/gunara-backup-$STAMP.tar.gz" \
  -C "$BACKUP_DIR" "gunara-snapshot-$STAMP.db" "gunara-manifest-$STAMP.json" "gunara-export-$STAMP.json"
sha256sum "$BACKUP_DIR/gunara-backup-$STAMP.tar.gz" > "$BACKUP_DIR/gunara-backup-$STAMP.sha256"
rm -f "$BACKUP_DIR/gunara-snapshot-$STAMP.db" "$BACKUP_DIR/gunara-manifest-$STAMP.json" "$BACKUP_DIR/gunara-export-$STAMP.json"

# 4) Salinan 3 — offsite (opsional): jalankan perintah eksternal yang diberikan
if [ $# -ge 1 ]; then
  echo "▶ Offsite: $1"
  eval "$1"   # contoh: bash scripts/backup.sh "rclone copy backups remote:gunara-os"
else
  echo "⚠ Salinan 3 (offsite) belum dijalankan — berikan perintah: bash scripts/backup.sh \"<cmd rsync/rclone>\""
fi

# 5) Retensi: simpan 14 arsip terakhir
ls -1t "$BACKUP_DIR"/gunara-backup-*.tar.gz 2>/dev/null | tail -n +15 | xargs -r rm -f
ls -1t "$BACKUP_DIR"/gunara-backup-*.sha256 2>/dev/null | tail -n +15 | xargs -r rm -f

echo "✅ Cadangan selesai: $BACKUP_DIR/gunara-backup-$STAMP.tar.gz"
