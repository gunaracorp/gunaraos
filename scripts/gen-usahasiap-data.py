#!/usr/bin/env python3
# Generator src/lib/usahasiap.ts dari USMR-001 (sumber kebenaran resmi repo gunaracorp)
import re, pathlib

SRC = pathlib.Path("/home/z/my-project/usahasiap-src/00-governance/00_UsahaSiap_Master_Document_Register_v1.0.md")
OUT = pathlib.Path("/home/z/my-project/src/lib/usahasiap.ts")
md = SRC.read_text(encoding="utf-8")

DOMAINS = [
    ("A", "Identity & Foundation", "USA-01–USA-03", 3),
    ("B", "Strategy & Business Architecture", "USA-04–USA-09", 6),
    ("C", "Governance & Legal", "USA-10–USA-14", 5),
    ("D", "Product, AI & Technology", "USA-15–USA-23", 9),
    ("E", "Operations & Service Delivery", "USA-24–USA-28", 5),
    ("F", "Finance, Revenue & Risk", "USA-29–USA-33", 5),
    ("G", "People, Culture & Ethics", "USA-34–USA-36", 3),
    ("H", "Brand, Marketing & Growth", "USA-37–USA-39", 3),
    ("I", "Data, Intelligence & Compliance", "USA-40–USA-45", 6),
]
DOMAIN_NAME = {k: n for k, n, _, _ in DOMAINS}

def rows(section_header: str, ncols: int):
    """Ambil baris tabel pipe di bawah heading, dengan jumlah kolom pas."""
    sec = md.split(section_header, 1)[1]
    out = []
    for line in sec.splitlines():
        line = line.strip()
        if line.startswith("|") and not re.match(r"^\|[\s:-]+\|", line.replace("-", " ")):
            cells = [c.strip() for c in line.strip("|").split("|")]
            if len(cells) == ncols and re.match(r"USA-\d\d", cells[0]):
                out.append(cells)
        if line.startswith("## ") and out:
            break
    return out

# Tabel §5: ID | Domain | Nama | PGA | Owner | Reviewer | Dependensi | Gelombang | Status
docs = rows("## 5. Master Document Register", 9)
# Tabel §6: ID | Keluaran minimum
outs = {r[0]: r[1] for r in rows("## 6. Tujuan keluaran", 2)}
assert len(docs) == 45, f"Dokumen terparse: {len(docs)} (harus 45)"
assert len(outs) == 45, f"Keluaran terparse: {len(outs)} (harus 45)"

def esc(s): return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

lines = []
lines.append('''// ═══════════════════════════════════════════════════════════════
// 🏭 USAHASIAP — Compliance to Revenue OS (Data Register)
// Sumber kebenaran: USMR-001 Master Document Register v1.0
// (baseline 31 Oktober 2026 · repo gunaracorp/usahasiap-compliance-to-revenue-os)
// Di-generate oleh scripts/gen-usahasiap-data.py — jangan edit manual.
// by Gugun Gunara — Muhammad Lutfi Azmi · PT Top Konsultan Internasional
// ═══════════════════════════════════════════════════════════════

export interface UsaDoc {
  kode: string; nama: string; domain: string; domainNama: string;
  pgaRef: string; ownerRole: string; reviewer: string; dependensi: string;
  gelombang: number; status: string; output: string; catatan: string;
}

export const USA_DOCUMENTS: UsaDoc[] = [''')
for d in docs:
    kid, dom, nama, pga, owner, rev, dep, wave, status = d
    lines.append(
        '  { kode: "%s", nama: "%s", domain: "%s", domainNama: "%s", pgaRef: "%s", '
        'ownerRole: "%s", reviewer: "%s", dependensi: "%s", gelombang: %s, status: "%s", '
        'output: "%s", catatan: "" },' % (
            esc(kid), esc(nama), esc(dom), esc(DOMAIN_NAME[dom]), esc(pga),
            esc(owner), esc(rev), esc(dep), wave, esc(status), esc(outs[kid])
        ))
lines.append("];\n")

dom_block = ",\n".join(
    '  { kode: "%s", nama: "%s", rentang: "%s", jumlah: %d }' % (k, n, r, j)
    for k, n, r, j in DOMAINS
)

lines.append('''export const USA_DOMAINS = [
%s
] as const;

export const USA_VOLUMES = [
  { id: "USM-00", nama: "UsahaSiap Master Blueprint", peran: "Arsitektur, prinsip, stage gate, keputusan, dan peta dokumen", cakupan: "Semua USA-01–USA-45" },
  { id: "USM-01", nama: "Market, Customer & Revenue Strategy", peran: "Pasar, pelanggan, proposisi nilai, distribusi dan hipotesis pendapatan", cakupan: "USA-01–09 · 29–33 · 37–39 · 42" },
  { id: "USM-02", nama: "Product Requirements & Technical Architecture", peran: "Produk, UX, requirement, AI, arsitektur dan engineering", cakupan: "USA-15–23 · 40–42" },
  { id: "USM-03", nama: "Regulatory Knowledge, Trust & Data Governance", peran: "Ketepatan regulasi, kontrol AI, privasi, keamanan dan kepercayaan", cakupan: "USA-13 · 20 · 22 · 26–28 · 40–41 · 43 · 45" },
  { id: "USM-04", nama: "Operations, Sales, Launch & Metrics", peran: "Delivery, CRM, komersial, SOP, peluncuran dan pengukuran", cakupan: "USA-10–14 · 24–39 · 42–44" },
] as const;

/** Pipeline Compliance → Revenue (5 tahap) — inti produk UsahaSiap. */
export const USA_PIPELINE = [
  { no: 1, nama: "Kepatuhan", desc: "Pahami kewajiban regulasi & perizinan yang berlaku untuk usaha pelanggan" },
  { no: 2, nama: "Dokumen & Bukti", desc: "Susun dokumen, checklist, dan bukti kepatuhan yang bisa diaudit" },
  { no: 3, nama: "Kesiapan Usaha", desc: "SOP, proses, dan standar layanan siap dipakai operasional nyata" },
  { no: 4, nama: "Profil Pemasok", desc: "Kredibilitas & kapabilitas terdokumentasi untuk masuk rantai pasok" },
  { no: 5, nama: "Revenue", desc: "Kontrak, pelanggan, dan pendapatan — kepatuhan berubah jadi uang" },
] as const;

/** 5 Stage Gates — gerbang keputusan USM-00 §8. */
export const USA_GATES = [
  { no: 1, nama: "Problem Evidence", desc: "Wawancara menunjukkan masalah berulang dan bernilai; minimal lima calon pelanggan bersedia membayar atau ikut pilot berbayar" },
  { no: 2, nama: "Paid Pilot", desc: "Alur layanan manual dapat diselesaikan dan hasilnya dinilai bermanfaat oleh pelanggan" },
  { no: 3, nama: "MVP Release", desc: "Alur utama diuji end-to-end; harga, klaim, privasi, akses dokumen, kontak, backup dan pemilik follow-up telah disetujui" },
  { no: 4, nama: "Repeatability", desc: "Pelanggan memakai ulang/berlangganan, waktu delivery membaik, dan margin dapat diukur" },
  { no: 5, nama: "Expansion", desc: "Baru membuka segmen/negara baru jika alur inti dan kontrol kualitas stabil" },
] as const;

/** 5 Gelombang pengerjaan (USMR-001 §7). */
export const USA_WAVES = [
  { no: 1, rentang: "USA-01–14", fokus: "Fondasi, pasar, strategi, governance dan legal", exit: "Arah, segmen awal, model bisnis awal, otoritas keputusan dan batas legal terdokumentasi" },
  { no: 2, rentang: "USA-15–23", fokus: "Produk, UX, AI dan teknologi", exit: "PRD, arsitektur, standar engineering dan acceptance criteria siap pakai tim" },
  { no: 3, rentang: "USA-24–28", fokus: "Operasional dan delivery", exit: "Alur layanan, SOP, incident response dan continuity plan siap pilot" },
  { no: 4, rentang: "USA-29–36", fokus: "Keuangan, risiko, SDM dan etika", exit: "Unit economics, pengendalian uang, risiko dan tanggung jawab tim terdinjau" },
  { no: 5, rentang: "USA-37–45", fokus: "Brand, penjualan, data, knowledge dan regulatory atlas", exit: "Akuisisi, pengukuran, privasi, keamanan, dokumentasi dan regulatory intelligence terkendali" },
] as const;

/** Guardrail janji — boleh & tidak boleh (USM-00). */
export const USA_GUARDRAIL = {
  boleh: [
    "Menilai kesiapan & gap kepatuhan usaha berdasarkan regulasi yang terverifikasi",
    "Menyusun dokumen, checklist, dan bukti yang bisa diaudit",
    "Menstandarkan SOP & proses agar layanan konsisten dan bisa diukur",
  ],
  larang: [
    "Menjanjikan hasil regulasi final di luar kewenangan pemerintah/regulator",
    "Menggantikan nasihat hukum profesional tanpa reviewer kompeten",
    "Mengaku data pelanggan aman tanpa kontrol keamanan yang teruji",
  ],
} as const;

/** 6 risiko utama (USM-00 §9). */
export const USA_RISKS = [
  "Salah klasifikasi kebutuhan karena jawaban otomatis terlalu percaya diri",
  "Regulasi berubah tetapi checklist belum diperbarui",
  "Dokumen pelanggan bocor atau dibagikan tanpa persetujuan",
  "Pemasaran menjanjikan hasil yang berada di luar kendali konsultan/platform",
  "Terlalu banyak fitur dan dokumen sebelum ada bukti kemauan membayar",
  "Bisnis terlihat sibuk tetapi unit economics, retensi dan kualitas layanan tidak terukur",
] as const;

/** Prioritas 14 hari pertama (USM-00 §10). */
export const USA_PRIORITAS_14 = [
  "Tetapkan satu subsegmen pangan dan definisikan profil pelanggan ideal",
  "Wawancarai 30 calon pengguna; catat pekerjaan terakhir yang nyata",
  "Siapkan format asesmen kesiapan awal dan contoh laporan gap",
  "Tawarkan pilot berbayar kepada calon pelanggan yang sesuai",
  "Catat waktu pengerjaan, biaya, sumber, kebingungan pelanggan, dan nilai hasil",
  "Bangun fitur software hanya untuk mengurangi friksi yang berulang pada pilot",
] as const;

/** Status vocabulary (USMR-001 §4). */
export const USA_STATUS = [
  "REGISTERED / NOT STARTED", "DRAFT", "IN REVIEW", "APPROVED / ACTIVE",
  "REVISION REQUIRED", "SUPERSEDED", "N/A CONTROLLED", "BLOCKED",
] as const;''' % dom_block)

OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print("OK —", OUT, "dengan", len(docs), "dokumen")
