// ═══════════════════════════════════════════════════
// GUNARA OS — Types & Konfigurasi Resource
// ═══════════════════════════════════════════════════

export type FieldType = "text" | "textarea" | "number" | "money" | "date" | "select" | "checkbox";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  full?: boolean; // full width di form grid
  rows?: number;
}

export interface ColumnConfig {
  name: string;
  label: string;
  type?: FieldType;
   
  render?: (row: Record<string, any>) => React.ReactNode;
  hideOnMobile?: boolean;
}

export interface ResourceConfig {
  key: string;
  title: string;
  subtitle?: string;
  icon?: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
   
  defaults?: Record<string, any>;
  emptyText?: string;
}

// ── Helpers format ──
export const rupiah = (n: number | null | undefined) =>
  "Rp " + (n || 0).toLocaleString("id-ID", { maximumFractionDigits: 0 });

export const rupiahShort = (n: number | null | undefined) => {
  const v = n || 0;
  if (Math.abs(v) >= 1_000_000_000) return `Rp ${(v / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2 })} M`;
  if (Math.abs(v) >= 1_000_000) return `Rp ${(v / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  if (Math.abs(v) >= 1_000) return `Rp ${(v / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} rb`;
  return rupiah(v);
};

/** Konversi Date → ISO tanggal (yyyy-mm-dd) memakai waktu LOKAL, bukan UTC.
 *  Penting: pengguna berada di WIB (UTC+7) — toISOString() akan salah tanggal
 *  antara jam 00.00–07.00 WIB. */
export const isoFrom = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

export const todayISO = () => isoFrom(new Date());

export const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

export const dayName = (d: Date) =>
  ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][d.getDay()];

export const fmtDateFull = (d: Date) =>
  `${dayName(d)}, ${d.getDate()} ${d.toLocaleDateString("id-ID", { month: "long" })} ${d.getFullYear()}`;

// ── Badge styling util ──
export function statusTone(s: string): "default" | "green" | "amber" | "red" | "gray" {
  const green = ["LUNAS", "SELESAI", "KLIEN", "RETAINER", "LIVE", "MASUK", "TERBIT", "AKTIF", "KUAT", "SANGAT KUAT"];
  const amber = ["NEGOSIASI", "MENUNGGU", "TERJADWAL", "PIPIN", "CEK", "REDIRECT", "PLAN", "PROSPEK", "PENAWARAN", "KONTRAK", "PROSES", "LEAD", "DORMAN", "SEDANG", "UNDANGAN", "DITANGGUHKAN"];
  const red = ["TERLAMBAT", "MACET", "TELAT", "MASA TENGGANG", "AKTIF-HUTANG", "GAGAL", "BATAL", "CHURN", "KOMPROMI", "TERKUNCI", "LEMAH", "DIJUAL", "DITUTUP", "NONAKTIF"];
  if (green.includes(s)) return "green";
  if (amber.includes(s)) return "amber";
  if (red.includes(s)) return "red";
  return "default";
}

// ═══════════════════════════════════════════════════
// KONFIGURASI RESOURCE (form + kolom tabel)
// ═══════════════════════════════════════════════════

const PRIORITAS_HUTANG = [
  { value: "BUNGA-TINGGI", label: "Bunga Tinggi" },
  { value: "TENGGAT-DEKAT", label: "Tenggat Dekat" },
  { value: "RINGAN", label: "Ringan" },
];

export const DEBT_CONFIG: ResourceConfig = {
  key: "debt",
  title: "Hutang Saya",
  subtitle: "Uang yang kupinjam — sisa dihitung otomatis dari pembayaran",
  fields: [
    { name: "kepada", label: "Kepada (siapa)", type: "text", required: true, placeholder: "Bank X / Teman Y" },
    { name: "tanggal", label: "Tanggal terjadi", type: "date" },
    { name: "nilaiAwal", label: "Nilai awal", type: "money", required: true },
    { name: "cicilanPerBulan", label: "Cicilan / bulan (yang mampu)", type: "money" },
    { name: "tenggat", label: "Tenggat (contoh: 2027-03)", type: "text", placeholder: "2027-03" },
    { name: "prioritas", label: "Prioritas", type: "select", options: PRIORITAS_HUTANG },
    { name: "status", label: "Status", type: "select", options: [
      { value: "AKTIF", label: "Aktif" }, { value: "LUNAS", label: "Lunas" }, { value: "NEGOSIASI", label: "Negosiasi" },
    ] },
    { name: "catatan", label: "Catatan (kesepakatan verbal, dll)", type: "textarea", full: true },
  ],
  columns: [
    { name: "kepada", label: "Kepada" },
    { name: "nilaiAwal", label: "Nilai Awal", type: "money", render: (r) => rupiah(r.nilaiAwal), hideOnMobile: true },
    { name: "sisa", label: "Sisa", render: (r) => rupiah(r.nilaiAwal - (r.payments || []).reduce((a: number, p: { jumlah: number }) => a + p.jumlah, 0)) },
    { name: "cicilanPerBulan", label: "Cicilan/Bln", render: (r) => rupiah(r.cicilanPerBulan), hideOnMobile: true },
    { name: "prioritas", label: "Prioritas", render: (r) => <BadgeMini text={r.prioritas} />, hideOnMobile: true },
    { name: "status", label: "Status", render: (r) => <BadgeStatus value={r.status} /> },
  ],
};

export const RECEIVABLE_CONFIG: ResourceConfig = {
  key: "receivable",
  title: "Piutang Klien",
  subtitle: "Klien yang belum lunas membayar — sisa = kontrak − DP",
  fields: [
    { name: "klien", label: "Klien", type: "text", required: true },
    { name: "proyek", label: "Proyek", type: "text", full: true, placeholder: "Website company profile — Toko A" },
    { name: "nilaiKontrak", label: "Nilai kontrak", type: "money", required: true },
    { name: "dpDiterima", label: "DP diterima", type: "money" },
    { name: "jatuhTempo", label: "Jatuh tempo", type: "date" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "MENUNGGU", label: "Menunggu" }, { value: "TERLAMBAT", label: "Terlambat" },
      { value: "MACET", label: "Macet" }, { value: "LUNAS", label: "Lunas" },
    ] },
    { name: "catatan", label: "Catatan", type: "textarea", full: true },
  ],
  columns: [
    { name: "klien", label: "Klien" },
    { name: "proyek", label: "Proyek", hideOnMobile: true },
    { name: "sisa", label: "Sisa Tagihan", render: (r) => rupiah(r.nilaiKontrak - r.dpDiterima) },
    { name: "jatuhTempo", label: "Jatuh Tempo", type: "date", render: (r) => fmtDate(r.jatuhTempo), hideOnMobile: true },
    { name: "status", label: "Status", render: (r) => <BadgeStatus value={r.status} /> },
  ],
};

export const CASHFLOW_CONFIG: ResourceConfig = {
  key: "cashflow",
  title: "Arus Kas",
  subtitle: "Masuk-keluar harian — 2 menit per transaksi",
  fields: [
    { name: "tanggal", label: "Tanggal", type: "date" },
    { name: "jenis", label: "Jenis", type: "select", options: [
      { value: "MASUK", label: "Masuk" }, { value: "KELUAR", label: "Keluar" },
    ] },
    { name: "pt", label: "PT mana", type: "select", options: [
      { value: "TKI", label: "PT Top Konsultan" }, { value: "DIGIMAN", label: "PT Digiman" }, { value: "PRIBADI", label: "Pribadi" },
    ] },
    { name: "kategori", label: "Kategori", type: "text", placeholder: "closing / retainer / operasional / anak" },
    { name: "nilai", label: "Nilai", type: "money", required: true },
    { name: "keterangan", label: "Keterangan", type: "text", full: true },
  ],
  columns: [
    { name: "tanggal", label: "Tanggal", type: "date", render: (r) => fmtDate(r.tanggal) },
    { name: "jenis", label: "Jenis", render: (r) => <BadgeMini text={r.jenis} tone={r.jenis === "MASUK" ? "green" : "red"} /> },
    { name: "pt", label: "PT", render: (r) => <BadgeMini text={r.pt} />, hideOnMobile: true },
    { name: "kategori", label: "Kategori", hideOnMobile: true },
    { name: "nilai", label: "Nilai", render: (r) => (
      <span className={r.jenis === "MASUK" ? "text-emerald-700 font-semibold" : "text-rose-700 font-semibold"}>
        {r.jenis === "KELUAR" ? "−" : "+"}{rupiah(r.nilai)}
      </span>
    ) },
    { name: "keterangan", label: "Keterangan", hideOnMobile: true },
  ],
  defaults: { tanggal: "", jenis: "MASUK", pt: "DIGIMAN" },
};

export const CHILD_SAVING_CONFIG: ResourceConfig = {
  key: "childSaving",
  title: "Rekening Anak",
  subtitle: "Bukan keuangan — ini janji. 20% dari setiap income.",
  fields: [
    { name: "tanggal", label: "Tanggal", type: "date" },
    { name: "nilai", label: "Nilai (20% income)", type: "money", required: true },
    { name: "catatan", label: "Catatan", type: "text", full: true },
  ],
  columns: [
    { name: "tanggal", label: "Tanggal", type: "date", render: (r) => fmtDate(r.tanggal) },
    { name: "nilai", label: "Nilai", render: (r) => rupiah(r.nilai) },
    { name: "catatan", label: "Catatan", hideOnMobile: true },
  ],
};

export const CLIENT_CONFIG: ResourceConfig = {
  key: "client",
  title: "Master Klien",
  subtitle: "1 baris = 1 manusia. Dirancang untuk ratusan klien.",
  fields: [
    { name: "nama", label: "Nama", type: "text", required: true },
    { name: "kontak", label: "WA / Email", type: "text" },
    { name: "segmen", label: "Segmen", type: "select", options: [
      { value: "UMKM", label: "UMKM" }, { value: "PRODUSEN", label: "Produsen" },
      { value: "PMA", label: "PMA" }, { value: "BIRO", label: "Biro" }, { value: "LAINNYA", label: "Lainnya" },
    ] },
    { name: "layanan", label: "Layanan diambil", type: "text", placeholder: "P1–P6 / Website / Bundle" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "PIPIN", label: "Pipin (baru)" }, { value: "NEGOSIASI", label: "Negosiasi" },
      { value: "KLIEN", label: "Klien" }, { value: "RETAINER", label: "Retainer" }, { value: "ARSIP", label: "Arsip" },
    ] },
    { name: "nilaiTotal", label: "Nilai total (Rp)", type: "money" },
    { name: "sumber", label: "Sumber (dari mana dia tahu kita)", type: "text", full: true, placeholder: "SEO / PPP / referral / iklan" },
    { name: "tglKontakTerakhir", label: "Kontak terakhir", type: "date" },
    { name: "catatan", label: "Catatan penting (anaknya SMA, suka dihubungi sore)", type: "textarea", full: true },
  ],
  columns: [
    { name: "nama", label: "Nama" },
    { name: "segmen", label: "Segmen", render: (r) => <BadgeMini text={r.segmen} />, hideOnMobile: true },
    { name: "status", label: "Status", render: (r) => <BadgeStatus value={r.status} /> },
    { name: "nilaiTotal", label: "Nilai", render: (r) => rupiahShort(r.nilaiTotal) },
    { name: "sumber", label: "Sumber", hideOnMobile: true },
    { name: "tglKontakTerakhir", label: "Kontak Trakhir", type: "date", render: (r) => fmtDate(r.tglKontakTerakhir), hideOnMobile: true },
  ],
};

export const FOLLOWUP_CONFIG: ResourceConfig = {
  key: "followUp",
  title: "Follow-Up",
  subtitle: "Uang ada di follow-up, bukan di leads baru. Telat >3 hari = merah.",
  fields: [
    { name: "tindakan", label: "Tindakan", type: "text", required: true, full: true, placeholder: "WA follow-up proposal" },
    { name: "tenggat", label: "Tenggat", type: "date" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "TERJADWAL", label: "Terjadwal" }, { value: "SELESAI", label: "Selesai" }, { value: "TELAT", label: "Telat" },
    ] },
    { name: "hasil", label: "Hasil", type: "textarea", full: true },
  ],
  columns: [
    { name: "tindakan", label: "Tindakan" },
    { name: "tenggat", label: "Tenggat", type: "date", render: (r) => fmtDate(r.tenggat) },
    { name: "status", label: "Status", render: (r) => <BadgeStatus value={r.status} /> },
    { name: "hasil", label: "Hasil", hideOnMobile: true },
  ],
};

export const RELATION_CONFIG: ResourceConfig = {
  key: "relation",
  title: "Master Relasi",
  subtitle: "Politik itu ledger kepercayaan — lebih dari 3 bulan tanpa kabar = wajib sapa",
  fields: [
    { name: "nama", label: "Nama", type: "text", required: true },
    { name: "domainRelasi", label: "Domain", type: "select", options: [
      { value: "PPP", label: "PPP" }, { value: "Bisnis", label: "Bisnis" }, { value: "Pemerintahan", label: "Pemerintahan" },
      { value: "Media", label: "Media" }, { value: "Agama", label: "Agama" },
    ] },
    { name: "kekuatan", label: "Kekuatan", type: "select", options: [
      { value: "TOKOH", label: "Tokoh" }, { value: "PENGARUH", label: "Pengaruh" },
      { value: "AKTIVIS", label: "Aktivis" }, { value: "CALON KLIEN", label: "Calon Klien" },
    ] },
    { name: "prioritas", label: "Prioritas", type: "select", options: [
      { value: "A", label: "A — jaga tiap bulan" }, { value: "B", label: "B — triwulan" }, { value: "C", label: "C — tahunan" },
    ] },
    { name: "kontakTerakhir", label: "Kontak terakhir", type: "date" },
    { name: "sayaBantu", label: "Saya pernah bantu", type: "textarea", full: true, placeholder: "bikinkan website gratis, antar dokumen…" },
    { name: "diaBantu", label: "Dia pernah bantu", type: "textarea", full: true, placeholder: "jangan lupa utang budi = modal relasi" },
    { name: "catatan", label: "Catatan", type: "textarea", full: true },
  ],
  columns: [
    { name: "nama", label: "Nama" },
    { name: "domainRelasi", label: "Domain", render: (r) => <BadgeMini text={r.domainRelasi} />, hideOnMobile: true },
    { name: "prioritas", label: "Prio", render: (r) => <BadgeMini text={r.prioritas} tone={r.prioritas === "A" ? "amber" : "gray"} /> },
    { name: "kontakTerakhir", label: "Kontak Trakhir", type: "date", render: (r) => fmtDate(r.kontakTerakhir) },
    { name: "sayaBantu", label: "Saya Bantu", hideOnMobile: true },
  ],
};

export const POLITICAL_CONFIG: ResourceConfig = {
  key: "politicalActivity",
  title: "Aktivitas Politik",
  subtitle: "Boundary rule: bantuan = investasi relasi ATAU proyek PT resmi dengan invoice. Tidak ada zona abu-abu.",
  fields: [
    { name: "tanggal", label: "Tanggal", type: "date" },
    { name: "kegiatan", label: "Kegiatan PPP", type: "text", required: true, full: true },
    { name: "peran", label: "Peranku", type: "text" },
    { name: "relasiBaru", label: "Relasi baru", type: "text" },
    { name: "peluang", label: "Peluang bisnis/reputasi", type: "textarea", full: true },
  ],
  columns: [
    { name: "tanggal", label: "Tanggal", type: "date", render: (r) => fmtDate(r.tanggal) },
    { name: "kegiatan", label: "Kegiatan" },
    { name: "peran", label: "Peran", hideOnMobile: true },
    { name: "relasiBaru", label: "Relasi Baru", hideOnMobile: true },
    { name: "peluang", label: "Peluang", hideOnMobile: true },
  ],
};

export const LEARNING_CONFIG: ResourceConfig = {
  key: "learningJournal",
  title: "Jurnal Belajar",
  subtitle: "1 entri = warisan keahlian. Setahun = 250 entri = BUKU ILMU.",
  fields: [
    { name: "tanggal", label: "Tanggal", type: "date" },
    { name: "judul", label: "Judul materi", type: "text", required: true, full: true },
    { name: "dipelajari", label: "Yang kupelajari (3 poin)", type: "textarea", full: true, rows: 3 },
    { name: "mengejutkan", label: "Yang mengejutkan (1 poin)", type: "textarea", rows: 2 },
    { name: "bisaDipakai", label: "Bisa kupakai untuk: klien/proyek mana?", type: "textarea", rows: 2 },
    { name: "jadiKonten", label: "Sudah jadi konten? (link reels/artikel)", type: "text", full: true },
  ],
  columns: [
    { name: "tanggal", label: "Tanggal", type: "date", render: (r) => fmtDate(r.tanggal) },
    { name: "judul", label: "Judul Materi" },
    { name: "bisaDipakai", label: "Bisa Dipakai Untuk", hideOnMobile: true },
    { name: "jadiKonten", label: "Jadi Konten?", hideOnMobile: true },
  ],
};

export const WINLOG_CONFIG: ResourceConfig = {
  key: "winLog",
  title: "Win Log",
  subtitle: "Tidak ada kemenangan yang terlalu kecil. Hari buruk? Buka file ini — obat paling murah.",
  fields: [
    { name: "tanggal", label: "Tanggal", type: "date" },
    { name: "kemenangan", label: "Kemenangan", type: "text", required: true, full: true },
    { name: "bukti", label: "Bukti", type: "text", placeholder: "akta / invoice / screenshot" },
    { name: "jadiKonten", label: "Jadi konten?", type: "text", placeholder: "cerita founder / case study" },
  ],
  columns: [
    { name: "tanggal", label: "Tanggal", type: "date", render: (r) => fmtDate(r.tanggal) },
    { name: "kemenangan", label: "Kemenangan" },
    { name: "bukti", label: "Bukti", hideOnMobile: true },
    { name: "jadiKonten", label: "Jadi Konten?", hideOnMobile: true },
  ],
};

export const CASESTUDY_CONFIG: ResourceConfig = {
  key: "caseStudy",
  title: "Studi Kasus",
  subtitle: "1 proyek selesai = amunisi penjualan selamanya.",
  fields: [
    { name: "judul", label: "Judul (nama proyek/klien)", type: "text", required: true, full: true },
    { name: "klien", label: "Klien & kebutuhan awal", type: "text", full: true },
    { name: "masalah", label: "Masalah sebenarnya", type: "textarea", full: true, rows: 3 },
    { name: "langkah", label: "Apa yang kami lakukan (langkah)", type: "textarea", full: true, rows: 3 },
    { name: "hasil", label: "Hasil (angka bila bisa)", type: "textarea", rows: 2 },
    { name: "testimoni", label: "Testimoni (kutip asli)", type: "textarea", rows: 2 },
    { name: "buktiLink", label: "Dokumen bukti (link foto/invoice)", type: "text", full: true },
  ],
  columns: [
    { name: "judul", label: "Judul" },
    { name: "klien", label: "Klien", hideOnMobile: true },
    { name: "hasil", label: "Hasil", hideOnMobile: true },
  ],
};

export const WEEKLY_CONFIG: ResourceConfig = {
  key: "weeklyReview",
  title: "Weekly Review",
  subtitle: "Minggu malam, 30 menit, setelah anak-anak tidur — rapat dengan manager.",
  fields: [
    { name: "minggu", label: "Label minggu", type: "text", required: true, full: true, placeholder: "Minggu ke-42 (13–19 Okt)" },
    { name: "mitSelesai", label: "MIT selesai", type: "number" },
    { name: "mitTotal", label: "dari total MIT", type: "number" },
    { name: "leads", label: "Leads masuk", type: "number" },
    { name: "ditindak", label: "Ditindak", type: "number" },
    { name: "closing", label: "Closing", type: "number" },
    { name: "energi", label: "Energi rata-rata (1-10)", type: "number" },
    { name: "progres", label: "Progres project (FORTRESS/DIGIMAN)", type: "textarea", full: true, rows: 2 },
    { name: "hentikan", label: "Apa yang harus saya HENTIKAN minggu ini?", type: "textarea", full: true, rows: 2 },
    { name: "janji", label: "Janji yang belum kutepati?", type: "textarea", full: true, rows: 2 },
    { name: "target", label: "Target hasil minggu depan (bukan target usaha!)", type: "textarea", full: true, rows: 2 },
    { name: "fokus1", label: "Fokus 1", type: "text" },
    { name: "fokus2", label: "Fokus 2", type: "text" },
    { name: "fokus3", label: "Fokus 3", type: "text" },
    { name: "jadwalAnak", label: "Jadwal anak minggu ini", type: "text", full: true },
  ],
  columns: [
    { name: "minggu", label: "Minggu" },
    { name: "mit", label: "MIT", render: (r) => `${r.mitSelesai}/${r.mitTotal}` },
    { name: "leads", label: "Leads", hideOnMobile: true },
    { name: "closing", label: "Closing", hideOnMobile: true },
    { name: "energi", label: "Energi", render: (r) => `${r.energi}/10`, hideOnMobile: true },
  ],
};

export const BACKLOG_CONFIG: ResourceConfig = {
  key: "backlogItem",
  title: "Backlog — Penjara Ide",
  subtitle: "Ide masuk sini = lega, kepala bersih. Ide TIDAK BOLEH dieksekusi di minggu yang sama ia lahir.",
  fields: [
    { name: "tanggal", label: "Tanggal lahir ide", type: "date" },
    { name: "ide", label: "Ide", type: "text", required: true, full: true },
    { name: "kenapa", label: "Kenapa menarik", type: "textarea", full: true, rows: 2 },
    { name: "ditinjau", label: "Kapan ditinjau", type: "text", placeholder: "Review Q2 / setelah omzet stabil" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "MENUNGGU", label: "Menunggu (30 hari)" }, { value: "NAIK PRIORITAS", label: "Naik prioritas" }, { value: "CORET", label: "Dicoret" },
    ] },
  ],
  columns: [
    { name: "tanggal", label: "Tanggal", type: "date", render: (r) => fmtDate(r.tanggal) },
    { name: "ide", label: "Ide" },
    { name: "ditinjau", label: "Ditinjau Kapan", hideOnMobile: true },
    { name: "status", label: "Status", render: (r) => <BadgeStatus value={r.status} /> },
  ],
};

export const DECISION_CONFIG: ResourceConfig = {
  key: "decisionLog",
  title: "Decisions Log",
  subtitle: "3 bulan lagi kamu akan lupa kenapa memilih sesuatu. Manager yang baik membuka catatan, bukan menuduh.",
  fields: [
    { name: "tanggal", label: "Tanggal", type: "date" },
    { name: "keputusan", label: "Keputusan", type: "text", required: true, full: true },
    { name: "alasan", label: "Alasan saat itu", type: "textarea", full: true, rows: 2 },
    { name: "hasil", label: "Hasil (isi 3 bln kemudian)", type: "textarea", full: true, rows: 2 },
  ],
  columns: [
    { name: "tanggal", label: "Tanggal", type: "date", render: (r) => fmtDate(r.tanggal) },
    { name: "keputusan", label: "Keputusan" },
    { name: "alasan", label: "Alasan", hideOnMobile: true },
    { name: "hasil", label: "Hasil", hideOnMobile: true },
  ],
};

export const DOMAIN_CONFIG: ResourceConfig = {
  key: "domain",
  title: "Kelola Domain & Blueprint Uang",
  subtitle: "49 domain — setiap domain punya misi, isi website, dan mesin uangnya sendiri.",
  fields: [
    { name: "nama", label: "Domain", type: "text", required: true },
    { name: "tier", label: "Tier", type: "select", options: [
      { value: "INTI", label: "Inti" }, { value: "GATEWAY", label: "Gateway" },
      { value: "FUTURE", label: "Future" }, { value: "PARKED", label: "Parked" },
    ] },
    { name: "status", label: "Status", type: "select", options: [
      { value: "LIVE", label: "Live" }, { value: "PRIORITAS", label: "Prioritas" }, { value: "PLAN", label: "Rencana" },
      { value: "PARK", label: "Park" }, { value: "REDIRECT", label: "Redirect" }, { value: "CEK", label: "Perlu cek" },
      { value: "MASA TENGGANG", label: "Masa Tenggang" }, { value: "LEPAS", label: "Dilepas" },
    ] },
    { name: "regStatus", label: "Status Registrar", type: "select", options: [
      { value: "AKTIF", label: "Aktif" }, { value: "MENUNGGU", label: "Menunggu" }, { value: "REDEMPTION", label: "Redemption" },
    ] },
    { name: "kategori", label: "Kategori", type: "select", options: [
      { value: "KONSULTAN", label: "Konsultan" }, { value: "AGENCY", label: "Agency" }, { value: "UMRAH", label: "Umrah" },
      { value: "MEDIA", label: "Media" }, { value: "JASA", label: "Jasa" }, { value: "PRODUK", label: "Produk" },
      { value: "PERSONAL", label: "Personal" },
    ] },
    { name: "berakhir", label: "Berakhir", type: "date" },
    { name: "jatuhTempo", label: "Jatuh Tempo", type: "date" },
    { name: "hargaPerpanjangan", label: "Perpanjangan / Tahun (Rp)", type: "money" },
    { name: "potensiRp", label: "Potensi Revenue / Bulan (Rp)", type: "money" },
    { name: "autoKredit", label: "Auto Kredit", type: "checkbox" },
    { name: "peran", label: "Peran", type: "text", full: true },
    { name: "isiWebsite", label: "Isi Website (blueprint)", type: "textarea", rows: 3, full: true },
    { name: "monetisasi", label: "Strategi Monetisasi (blueprint)", type: "textarea", rows: 3, full: true },
    { name: "catatan", label: "Catatan", type: "textarea", full: true },
  ],
  columns: [
    { name: "nama", label: "Domain" },
    { name: "kategori", label: "Kategori", render: (r) => (
      <BadgeMini text={r.kategori || "—"} tone={r.kategori === "KONSULTAN" || r.kategori === "AGENCY" ? "green" : r.kategori === "JASA" || r.kategori === "PRODUK" ? "amber" : "gray"} />
    ), hideOnMobile: true },
    { name: "tier", label: "Tier", render: (r) => <BadgeMini text={r.tier} tone={r.tier === "INTI" ? "green" : r.tier === "GATEWAY" ? "amber" : "gray"} />, hideOnMobile: true },
    { name: "status", label: "Status", render: (r) => <BadgeStatus value={r.status} />, hideOnMobile: true },
    { name: "regStatus", label: "Status Registrar", render: (r) => (
      <BadgeMini text={r.regStatus || "—"} tone={r.regStatus === "AKTIF" ? "green" : r.regStatus === "MENUNGGU" ? "amber" : "red"} />
    ) },
    { name: "berakhir", label: "Berakhir", type: "date", render: (r) => fmtDate(r.berakhir), hideOnMobile: true },
    { name: "jatuhTempo", label: "Jatuh Tempo", type: "date", render: (r) => fmtDate(r.jatuhTempo), hideOnMobile: true },
    { name: "hargaPerpanjangan", label: "Biaya/Thn", render: (r) => rupiahShort(r.hargaPerpanjangan), hideOnMobile: true },
    { name: "potensiRp", label: "Potensi/Bln", render: (r) => rupiahShort(r.potensiRp) },
    { name: "peran", label: "Peran", hideOnMobile: true },
  ],
};

// ── Komponen kecil untuk render kolom (didefinisikan di lib agar config bisa pakai) ──
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════
// BISNIS HUB — Metadata Terlengkap
// ═══════════════════════════════════════════════════

const SUMBER_LEAD = [
  { value: "WA", label: "WhatsApp" }, { value: "IG", label: "Instagram" }, { value: "FB", label: "Facebook" },
  { value: "TIKTOK", label: "TikTok" }, { value: "WEB", label: "Website" }, { value: "SEO", label: "SEO/Google" },
  { value: "REFERRAL", label: "Referral" }, { value: "OFFLINE", label: "Offline/Event" },
];

export const CUSTOMER_CONFIG: ResourceConfig = {
  key: "customer",
  title: "Database Pelanggan",
  subtitle: "Metadata 360° per manusia — identitas, kontak, alamat, perilaku, preferensi. Satu sumber kebenaran.",
  emptyText: "Belum ada pelanggan. Tambahkan lead pertama — setiap baris adalah potensi kontrak.",
  fields: [
    { name: "nama", label: "Nama lengkap", type: "text", required: true },
    { name: "jenis", label: "Jenis", type: "select", options: [
      { value: "INDIVIDU", label: "Individu" }, { value: "BADAN_USAHA", label: "Badan Usaha" },
    ] },
    { name: "phone", label: "Telepon", type: "text", placeholder: "0812…" },
    { name: "waPhone", label: "WhatsApp", type: "text", placeholder: "62812… (format WA)" },
    { name: "email", label: "Email", type: "text" },
    { name: "googleEmail", label: "Email Google (akun terhubung)", type: "text" },
    { name: "ktpNo", label: "No. KTP", type: "text" },
    { name: "npwpNo", label: "No. NPWP", type: "text" },
    { name: "birthDate", label: "Tanggal lahir", type: "date" },
    { name: "gender", label: "Gender", type: "select", options: [
      { value: "L", label: "Laki-laki" }, { value: "P", label: "Perempuan" }, { value: "-", label: "—" },
    ] },
    { name: "pekerjaan", label: "Pekerjaan / jabatan", type: "text" },
    { name: "address", label: "Alamat", type: "textarea", full: true, rows: 2 },
    { name: "city", label: "Kota", type: "text" },
    { name: "province", label: "Provinsi", type: "text" },
    { name: "postalCode", label: "Kode pos", type: "text" },
    { name: "sumber", label: "Sumber lead", type: "select", options: SUMBER_LEAD },
    { name: "referralBy", label: "Direferensikan oleh", type: "text" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "LEAD", label: "Lead" }, { value: "PROSPEK", label: "Prospek" }, { value: "KLIEN", label: "Klien" },
      { value: "RETAINER", label: "Retainer" }, { value: "LAPSED", label: "Lapsed" }, { value: "CHURN", label: "Churn" },
    ] },
    { name: "preferensi", label: "Preferensi kontak", type: "select", options: [
      { value: "WA", label: "WhatsApp" }, { value: "EMAIL", label: "Email" },
      { value: "TELEPON", label: "Telepon" }, { value: "KUNJUNGAN", label: "Kunjungan" },
    ] },
    { name: "waktuKontak", label: "Waktu nyaman dihubungi", type: "text", placeholder: "sore / malam / lunch" },
    { name: "totalBelanja", label: "Total belanja (Rp)", type: "money" },
    { name: "lastDealAt", label: "Deal terakhir", type: "date" },
    { name: "companyId", label: "Perusahaan (ID Company bila ada)", type: "text" },
    { name: "tags", label: "Tag (pisah koma)", type: "text", placeholder: "potensial, umroh, konstruksi" },
    { name: "notes", label: "Catatan", type: "textarea", full: true, rows: 2 },
  ],
  columns: [
    { name: "nama", label: "Nama", render: (r) => (
      <div><p className="font-medium">{r.nama}</p><p className="text-xs text-muted-foreground">{r.city || r.province || "—"}</p></div>
    ) },
    { name: "jenis", label: "Jenis", render: (r) => <BadgeMini text={r.jenis} />, hideOnMobile: true },
    { name: "waPhone", label: "Kontak", render: (r) => r.waPhone || r.phone || r.email || "—", hideOnMobile: true },
    { name: "status", label: "Status", render: (r) => <BadgeStatus value={r.status} /> },
    { name: "totalBelanja", label: "Belanja", render: (r) => rupiahShort(r.totalBelanja) },
    { name: "sumber", label: "Sumber", render: (r) => <BadgeMini text={r.sumber || "—"} tone="gray" />, hideOnMobile: true },
  ],
};

export const COMPANY_CONFIG: ResourceConfig = {
  key: "company",
  title: "Database Perusahaan",
  subtitle: "Badan usaha klien & grup sendiri — NIB, NPWP, SK AHU, KBLI, modal, pengurus. Satu baris = satu entitas legal.",
  emptyText: "Belum ada perusahaan. Mulai dari perusahaan grup sendiri, lalu klien badan usaha.",
  fields: [
    { name: "nama", label: "Nama dagang", type: "text", required: true },
    { name: "legalName", label: "Nama resmi (di akta)", type: "text" },
    { name: "entityType", label: "Bentuk badan", type: "select", options: [
      { value: "PT", label: "PT" }, { value: "CV", label: "CV" }, { value: "PMA", label: "PT PMA" },
      { value: "PO-UPTA", label: "PO/UPTA" }, { value: "FIRMA", label: "Firma" }, { value: "KOPERASI", label: "Koperasi" },
      { value: "YAYASAN", label: "Yayasan" }, { value: "PERSEORANGAN", label: "Perseorangan" },
    ] },
    { name: "nib", label: "NIB", type: "text" },
    { name: "npwp", label: "NPWP", type: "text" },
    { name: "skAhu", label: "SK Kemenkumham (AHU)", type: "text", placeholder: "AHU-038293.AH.01.30.Tahun 2024" },
    { name: "sbuNo", label: "No. SBU (bila konstruksi)", type: "text" },
    { name: "kblis", label: "KBLI (pisah koma)", type: "text", full: true, placeholder: "69201, 70201, 63122" },
    { name: "bidangUsaha", label: "Bidang usaha utama", type: "text" },
    { name: "deskripsi", label: "Deskripsi", type: "textarea", full: true, rows: 2 },
    { name: "directorName", label: "Direktur / pemilik", type: "text" },
    { name: "shareholders", label: "Pemegang saham", type: "text" },
    { name: "modalDasar", label: "Modal dasar (Rp)", type: "money" },
    { name: "modalDisetor", label: "Modal disetor (Rp)", type: "money" },
    { name: "omzetTahunan", label: "Omzet tahunan (Rp)", type: "money" },
    { name: "employeeCount", label: "Jumlah karyawan", type: "number" },
    { name: "address", label: "Alamat kantor", type: "textarea", full: true, rows: 2 },
    { name: "city", label: "Kota", type: "text" },
    { name: "province", label: "Provinsi", type: "text" },
    { name: "website", label: "Website", type: "text" },
    { name: "email", label: "Email resmi", type: "text" },
    { name: "phone", label: "Telepon", type: "text" },
    { name: "establishedAt", label: "Tanggal berdiri", type: "date" },
    { name: "customerId", label: "Pemilik (ID Pelanggan)", type: "text" },
    { name: "isGrupSendiri", label: "Perusahaan grup sendiri", type: "checkbox" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "PROSPEK", label: "Prospek" }, { value: "AKTIF", label: "Aktif" },
      { value: "SELESAI", label: "Selesai" }, { value: "NONAKTIF", label: "Nonaktif" },
    ] },
    { name: "notes", label: "Catatan", type: "textarea", full: true, rows: 2 },
  ],
  columns: [
    { name: "nama", label: "Perusahaan", render: (r) => (
      <div className="flex items-center gap-1.5">
        <span className="font-medium">{r.nama}</span>
        {r.isGrupSendiri && <BadgeMini text="GRUP" tone="green" />}
      </div>
    ) },
    { name: "entityType", label: "Badan", render: (r) => <BadgeMini text={r.entityType} tone={r.entityType === "PT" ? "green" : "gray"} /> },
    { name: "city", label: "Kota", hideOnMobile: true },
    { name: "nib", label: "NIB", hideOnMobile: true, render: (r) => (r.nib ? <span className="font-mono text-xs">{r.nib}</span> : "—") },
    { name: "status", label: "Status", render: (r) => <BadgeStatus value={r.status} /> },
    { name: "website", label: "Website", hideOnMobile: true },
  ],
};

export const PERMIT_CONFIG: ResourceConfig = {
  key: "permitApplication",
  title: "Tracker Pengurusan Izin",
  subtitle: "Alur 5 langkah ISO 9001:2015: Konsultasi → Penawaran → Kontrak → Proses → Garansi. Posisi setiap berkas selalu terlihat.",
  emptyText: "Belum ada pengurusan berjalan. Buat dari Katalog Layanan atau Pencari Izin.",
  fields: [
    { name: "namaLayanan", label: "Nama layanan", type: "text", required: true },
    { name: "layananKode", label: "Kode layanan", type: "text", placeholder: "NIB / PT / AMDAL…" },
    { name: "customerName", label: "Pelanggan", type: "text" },
    { name: "companyName", label: "Perusahaan klien", type: "text" },
    { name: "tahap", label: "Tahap (1-5)", type: "number" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "PENAWARAN", label: "Penawaran" }, { value: "KONTRAK", label: "Kontrak" }, { value: "PROSES", label: "Proses" },
      { value: "TERBIT", label: "Terbit" }, { value: "GAGAL", label: "Gagal" }, { value: "BATAL", label: "Batal" },
    ] },
    { name: "instansi", label: "Instansi tujuan", type: "text", placeholder: "OSS RBA / Kemenkumham / BPOM…" },
    { name: "harga", label: "Nilai deal (Rp)", type: "money" },
    { name: "biayaPemerintah", label: "Biaya pemerintah (Rp)", type: "money" },
    { name: "dpDiterima", label: "DP diterima (Rp)", type: "money" },
    { name: "tanggalMasuk", label: "Tanggal masuk", type: "date" },
    { name: "targetSelesai", label: "Target selesai", type: "date" },
    { name: "tanggalTerbit", label: "Tanggal terbit", type: "date" },
    { name: "dokumenUrl", label: "Link dokumen (Drive/folder)", type: "text", full: true },
    { name: "notes", label: "Catatan progres", type: "textarea", full: true, rows: 2 },
  ],
  columns: [
    { name: "namaLayanan", label: "Layanan", render: (r) => (
      <div><p className="font-medium">{r.namaLayanan}</p><p className="text-xs text-muted-foreground">{r.customerName || r.companyName || "—"}</p></div>
    ) },
    { name: "tahap", label: "Tahap", render: (r) => <BadgeMini text={`T${r.tahap} · ${TAHAP_NAMA[r.tahap] || "?"}`} tone={r.tahap >= 5 ? "green" : "amber"} /> },
    { name: "harga", label: "Deal", render: (r) => rupiahShort(r.harga) },
    { name: "status", label: "Status", render: (r) => <BadgeStatus value={r.status} /> },
    { name: "targetSelesai", label: "Target", type: "date", render: (r) => fmtDate(r.targetSelesai), hideOnMobile: true },
  ],
};

export const SOCIAL_CONFIG: ResourceConfig = {
  key: "socialAccount",
  title: "Database Sosial Media",
  subtitle: "Aset digital Gunara Group — akun, kredensial terenkripsi, jangkauan, ritme konten. Password disimpan AES-256-GCM.",
  emptyText: "Belum ada akun sosial media tercatat. Daftarkan semua akun bisnis — aset digital adalah nyawa marketing.",
  fields: [
    { name: "platform", label: "Platform", type: "select", options: [
      { value: "INSTAGRAM", label: "Instagram" }, { value: "FACEBOOK", label: "Facebook" }, { value: "TIKTOK", label: "TikTok" },
      { value: "YOUTUBE", label: "YouTube" }, { value: "X", label: "X (Twitter)" }, { value: "LINKEDIN", label: "LinkedIn" },
      { value: "WA_BUSINESS", label: "WhatsApp Business" }, { value: "GOOGLE_BISNIS", label: "Google Bisnisku" },
      { value: "SHOPEE", label: "Shopee" }, { value: "TOKOPEDIA", label: "Tokopedia" }, { value: "TELEGRAM", label: "Telegram" },
      { value: "LAINNYA", label: "Lainnya" },
    ] },
    { name: "handle", label: "Username / handle", type: "text", required: true, placeholder: "@pusatperizinan" },
    { name: "displayName", label: "Nama tampilan", type: "text" },
    { name: "url", label: "URL profil", type: "text", full: true },
    { name: "kategori", label: "Kategori akun", type: "select", options: [
      { value: "BISNIS", label: "Bisnis" }, { value: "PRIBADI", label: "Pribadi" },
      { value: "PORTFOLIO", label: "Portfolio" }, { value: "KOMUNITAS", label: "Komunitas" },
    ] },
    { name: "emailUsed", label: "Email login", type: "text" },
    { name: "phoneUsed", label: "Nomor login", type: "text" },
    { name: "password", label: "Password (AES-256-GCM — kosongkan bila tak diubah)", type: "text" },
    { name: "recoveryEmail", label: "Email pemulihan", type: "text" },
    { name: "recoveryPhone", label: "Nomor pemulihan", type: "text" },
    { name: "twoFactor", label: "2FA aktif?", type: "checkbox" },
    { name: "followers", label: "Followers", type: "number" },
    { name: "following", label: "Following", type: "number" },
    { name: "postCount", label: "Jumlah post", type: "number" },
    { name: "engagementPct", label: "Engagement (%)", type: "number" },
    { name: "niche", label: "Niche / topik", type: "text" },
    { name: "cadencePerWeek", label: "Target post/minggu", type: "number" },
    { name: "lastPostAt", label: "Post terakhir", type: "date" },
    { name: "linkedCompanyId", label: "Perusahaan terkait", type: "text" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "AKTIF", label: "Aktif" }, { value: "DORMAN", label: "Dorman" }, { value: "DITANGGUHKAN", label: "Ditangguhkan" },
      { value: "DIJUAL", label: "Dijual" }, { value: "KOMPROMI", label: "Kompromi/hack" }, { value: "DITUTUP", label: "Ditutup" },
    ] },
    { name: "tags", label: "Tag (pisah koma)", type: "text" },
    { name: "notes", label: "Catatan", type: "textarea", full: true, rows: 2 },
  ],
  columns: [
    { name: "handle", label: "Akun", render: (r) => (
      <div><p className="font-medium font-mono text-xs">{r.handle}</p><p className="text-xs text-muted-foreground">{r.displayName || r.platform}</p></div>
    ) },
    { name: "platform", label: "Platform", render: (r) => <BadgeMini text={r.platform} /> },
    { name: "followers", label: "Followers", render: (r) => (r.followers || 0).toLocaleString("id-ID") },
    { name: "twoFactor", label: "2FA", render: (r) => <BadgeMini text={r.twoFactor ? "AKTIF" : "BELUM"} tone={r.twoFactor ? "green" : "red"} />, hideOnMobile: true },
    { name: "status", label: "Status", render: (r) => <BadgeStatus value={r.status} /> },
  ],
};

export const VAULT_CONFIG: ResourceConfig = {
  key: "vaultEntry",
  title: "Brankas Kredensial",
  subtitle: "Satu brankas untuk semua: email Google, OSS, pajak, bank, marketplace. Enkripsi AES-256-GCM — kunci tidak pernah keluar server.",
  emptyText: "Brankas masih kosong. Masukkan akun pertama — mulai dari email Google utama grup.",
  fields: [
    { name: "label", label: "Nama akun", type: "text", required: true, full: true, placeholder: "Google Workspace — pusatperizinan.com" },
    { name: "category", label: "Kategori", type: "select", options: [
      { value: "EMAIL_GOOGLE", label: "Email Google" }, { value: "EMAIL_LAIN", label: "Email Lain" }, { value: "SOSMED", label: "Sosial Media" },
      { value: "MARKETPLACE", label: "Marketplace" }, { value: "BANK", label: "Bank" }, { value: "PAYMENT", label: "Payment Gateway" },
      { value: "OSS", label: "OSS / Pemerintah" }, { value: "PAJAK", label: "Pajak (Coretax/DJP)" }, { value: "HOSTING", label: "Hosting & Domain" },
      { value: "AI_TOOLS", label: "AI Tools" }, { value: "LAINNYA", label: "Lainnya" },
    ] },
    { name: "identifier", label: "Email / username", type: "text" },
    { name: "password", label: "Password (dienkripsi — kosongkan bila tak diubah)", type: "text" },
    { name: "pin", label: "PIN (bila perlu — dienkripsi)", type: "text" },
    { name: "backupCodes", label: "Kode cadangan 2FA (pisah koma — dienkripsi)", type: "textarea", rows: 2 },
    { name: "url", label: "URL login", type: "text" },
    { name: "recoveryEmail", label: "Email pemulihan", type: "text" },
    { name: "recoveryPhone", label: "Nomor pemulihan", type: "text" },
    { name: "twoFactorType", label: "Jenis 2FA", type: "select", options: [
      { value: "NONE", label: "Tidak ada" }, { value: "APP", label: "Authenticator App" }, { value: "SMS", label: "SMS" },
      { value: "EMAIL", label: "Email" }, { value: "HARDWARE", label: "Hardware Key" },
    ] },
    { name: "ownerName", label: "A.n. (pemilik akun)", type: "text" },
    { name: "linkedCompanyId", label: "Perusahaan terkait", type: "text" },
    { name: "lastRotatedAt", label: "Terakhir ganti password", type: "date" },
    { name: "status", label: "Status", type: "select", options: [
      { value: "AKTIF", label: "Aktif" }, { value: "DINONAKTIFKAN", label: "Dinonaktifkan" }, { value: "KOMPROMI", label: "Kompromi" },
    ] },
    { name: "tags", label: "Tag (pisah koma)", type: "text" },
    { name: "notes", label: "Catatan aman (JANGAN tulis password di sini)", type: "textarea", full: true, rows: 2 },
  ],
  columns: [
    { name: "label", label: "Akun" },
    { name: "category", label: "Kategori", render: (r) => <BadgeMini text={r.category} tone={r.category === "EMAIL_GOOGLE" ? "amber" : "gray"} />, hideOnMobile: true },
    { name: "identifier", label: "Username", hideOnMobile: true, render: (r) => <span className="font-mono text-xs">{r.identifier || "—"}</span> },
    { name: "strength", label: "Kekuatan", render: (r) => r.strength ? <BadgeStatus value={r.strength} /> : "—" },
    { name: "twoFactorType", label: "2FA", render: (r) => <BadgeMini text={r.twoFactorType === "NONE" ? "TANPA 2FA" : r.twoFactorType} tone={r.twoFactorType === "NONE" ? "red" : "green"} />, hideOnMobile: true },
  ],
};

export const APPUSER_CONFIG: ResourceConfig = {
  key: "appUser",
  title: "Pengguna & Akses",
  subtitle: "User ID, email, password (scrypt), email Google, role & status akses — standar OWASP: hash tidak pernah dikirim ke browser.",
  emptyText: "Belum ada pengguna. Daftarkan pemilik sistem terlebih dahulu (role OWNER).",
  fields: [
    { name: "nama", label: "Nama lengkap", type: "text", required: true },
    { name: "email", label: "Email login (user id)", type: "text", required: true },
    { name: "password", label: "Password (scrypt — kosongkan bila tak diubah)", type: "text" },
    { name: "googleEmail", label: "Email Google terhubung", type: "text" },
    { name: "phone", label: "Telepon", type: "text" },
    { name: "jabatan", label: "Jabatan", type: "text" },
    { name: "role", label: "Role", type: "select", options: [
      { value: "OWNER", label: "Owner" }, { value: "ADMIN", label: "Admin" }, { value: "KONSULTAN", label: "Konsultan" },
      { value: "STAFF", label: "Staff" }, { value: "VIEWER", label: "Viewer" },
    ] },
    { name: "status", label: "Status", type: "select", options: [
      { value: "AKTIF", label: "Aktif" }, { value: "UNDANGAN", label: "Undangan" },
      { value: "DINONAKTIFKAN", label: "Dinonaktifkan" }, { value: "TERKUNCI", label: "Terkunci" },
    ] },
    { name: "twoFactorType", label: "2FA", type: "select", options: [
      { value: "NONE", label: "Tidak ada" }, { value: "APP", label: "Authenticator App" }, { value: "SMS", label: "SMS" },
      { value: "EMAIL", label: "Email" }, { value: "HARDWARE", label: "Hardware Key" },
    ] },
    { name: "passwordHint", label: "Pengingat password (JANGAN password asli)", type: "text" },
    { name: "companyId", label: "Perusahaan", type: "text" },
    { name: "notes", label: "Catatan", type: "textarea", full: true, rows: 2 },
  ],
  columns: [
    { name: "nama", label: "Nama", render: (r) => (
      <div><p className="font-medium">{r.nama}</p><p className="text-xs text-muted-foreground">{r.jabatan || "—"}</p></div>
    ) },
    { name: "email", label: "Email", render: (r) => <span className="font-mono text-xs">{r.email}</span> },
    { name: "googleEmail", label: "Google", hideOnMobile: true, render: (r) => <span className="font-mono text-xs">{r.googleEmail || "—"}</span> },
    { name: "role", label: "Role", render: (r) => <BadgeMini text={r.role} tone={r.role === "OWNER" ? "green" : "gray"} /> },
    { name: "passwordStrength", label: "Password", render: (r) => r.passwordStrength ? <BadgeStatus value={r.passwordStrength} /> : "—" },
    { name: "status", label: "Status", render: (r) => <BadgeStatus value={r.status} /> },
  ],
};

export const TAHAP_NAMA: Record<number, string> = {
  1: "Konsultasi", 2: "Penawaran", 3: "Kontrak", 4: "Proses", 5: "Garansi",
};

export const PERMIT_STAGE_META = [
  { tahap: 1, nama: "Konsultasi", desc: "Ceritakan rencana bisnis — pemetaan izin wajib & opsional" },
  { tahap: 2, nama: "Penawaran", desc: "Analisis kebutuhan, rincian biaya transparan, estimasi waktu" },
  { tahap: 3, nama: "Kontrak", desc: "Kontrak resmi ditandatangani, pembayaran ke rekening resmi" },
  { tahap: 4, nama: "Proses", desc: "Pengurusan penuh ke instansi — progres dilaporkan rutin" },
  { tahap: 5, nama: "Garansi", desc: "Penyerahan dokumen legal + garansi proses ulang" },
] as const;

export function BadgeMini({ text, tone }: { text: string; tone?: "green" | "amber" | "red" | "gray" }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
      tone === "green" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
      tone === "amber" && "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300",
      tone === "red" && "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
      (!tone || tone === "gray") && "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
    )}>{text}</span>
  );
}

export function BadgeStatus({ value }: { value: string }) {
  const tone = statusTone(value);
  return <BadgeMini text={value} tone={tone === "default" ? "gray" : tone} />;
}
