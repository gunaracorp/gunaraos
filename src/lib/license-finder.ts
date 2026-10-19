// ═══════════════════════════════════════════════════════
// GUNARA OS — Pencari Izin (Rules Engine)
// Replikasi tools "AI license finder" pusatperizinan.com
// Deterministik, transparan, tanpa API eksternal.
// ═══════════════════════════════════════════════════════

export type Prioritas = "WAJIB" | "SANGAT DISARANKAN" | "DISARANKAN" | "OPSIONAL";

export interface FinderInput {
  sektor: string;
  skala: "UMKM" | "MENENGAH" | "BESAR";
  badanUsaha: boolean;   // sudah punya legalitas badan usaha
  online: boolean;       // jual online / marketplace
  eksporImpor: boolean;
  gedungSendiri: boolean; // punya/kantrak bangunan usaha
  karyawan: boolean;
  pangan: boolean;        // produk pangan/minuman
  merek: boolean;         // perlu lindungi merek
  asing: boolean;         // melibatkan investor/pekerja asing
  tender: boolean;        // ikut tender/proyek BUMN
}

export interface Rekomendasi {
  kode: string;
  alasan: string;
  prioritas: Prioritas;
}

export const SEKTOR_FINDER = [
  { value: "KULINER", label: "Kuliner / Restoran / Café" },
  { value: "PANGAN", label: "Produk Pangan Kemasan" },
  { value: "KESEHATAN", label: "Kesehatan / Klinik / Apotek" },
  { value: "KONSTRUKSI", label: "Konstruksi / Properti" },
  { value: "PARIWISATA", label: "Pariwisata / Travel / Hotel" },
  { value: "PERDAGANGAN", label: "Perdagangan / Impor" },
  { value: "TEKNOLOGI", label: "Teknologi / Platform Digital" },
  { value: "JASA", label: "Jasa Profesional" },
  { value: "MANUFAKTUR", label: "Manufaktur" },
  { value: "TAMBANG", label: "Pertambangan / Energi" },
] as const;

const RULE = (kode: string, alasan: string, prioritas: Prioritas): Rekomendasi => ({ kode, alasan, prioritas });

/** Mesin aturan: input profil usaha → daftar izin rekomendasi (terurut prioritas) */
export function findLicenses(input: FinderInput): Rekomendasi[] {
  const r: Rekomendasi[] = [];
  const add = (x: Rekomendasi) => { if (!r.some((v) => v.kode === x.kode)) r.push(x); };

  // ── Fondasi legalitas ──
  if (!input.badanUsaha) {
    add(RULE("NIB", "Legalitas dasar wajib semua usaha — satu pintu OSS RBA.", "WAJIB"));
    if (input.skala === "UMKM")
      add(RULE("PO-UPTA", "Skala UMKM individu — badan hukum tanpa notaris, paling ringan.", "SANGAT DISARANKAN"));
    if (input.skala === "MENENGAH")
      add(RULE("CV", "Skala menengah dengan mitra/kongsi — CV cepat & modal fleksibel.", "SANGAT DISARANKAN"));
    if (input.skala === "BESAR")
      add(RULE("PT", "Skala besar — PT paling kredibel untuk investor, tender, dan kredit bank.", "WAJIB"));
  } else {
    add(RULE("NIB", "Pastikan NIB OSS RBA aktif & KBLI sesuai kegiatan usaha terbaru.", "WAJIB"));
  }

  // ── Sektor ──
  switch (input.sektor) {
    case "KULINER":
      add(RULE("HALAL", "Wajib hukum untuk makanan/minuman (UU JPH) — segera sebelum penegakan.", "WAJIB"));
      add(RULE("SHR", "Pengesahan hotel/restoran — syarat OTA, BCF & kepercayaan konsumen.", "DISARANKAN"));
      add(RULE("PIRT", "Jika juga menjual produk kemasan rumahan.", "OPSIONAL"));
      break;
    case "PANGAN":
      add(RULE("HALAL", "Wajib hukum untuk produk pangan (UU JPH).", "WAJIB"));
      add(RULE("PIRT", "Produksi rumah tangga skala kecil — jalur tercepat legal.", "SANGAT DISARANKAN"));
      add(RULE("BPOM-MD", "Masuk ritel modern/marketplace besar — nomor MD BPOM wajib.", "DISARANKAN"));
      add(RULE("SNI", "Kategori wajib SNI (mis. gula, air mineral, kabel) menambah kredibilitas premium.", "OPSIONAL"));
      break;
    case "KESEHATAN":
      add(RULE("KLINIK", "Legalitas operasional fasilitas kesehatan.", "WAJIB"));
      add(RULE("SIP", "Dokter penanggung jawab wajib bersurat izin praktik.", "WAJIB"));
      add(RULE("APOTEK", "Bila menyediakan farmasi langsung.", "DISARANKAN"));
      add(RULE("AKL-AKD", "Bila memakai/menjual alat kesehatan.", "DISARANKAN"));
      break;
    case "KONSTRUKSI":
      add(RULE("SBU", "Syarat ikut tender & proyek besar (LPJK).", "WAJIB"));
      add(RULE("SMK3", "Wajib perusahaan berisiko tinggi — nilai plus tender.", "SANGAT DISARANKAN"));
      add(RULE("BNSP", "Sertifikasi kompetensi SDM/tenaga teknis untuk SBU.", "DISARANKAN"));
      break;
    case "PARIWISATA":
      add(RULE("BIRO-TRAVEL", "Legal mengemas & menjual paket tour.", "WAJIB"));
      add(RULE("SHR", "Bila mengelola hotel/restoran — syarat OTA & MICE.", "DISARANKAN"));
      add(RULE("HPI", "Pramuwisata internal agar legal membawa wisatawan.", "OPSIONAL"));
      break;
    case "PERDAGANGAN":
      add(RULE("API-P", "Impor barang untuk dijual kembali.", "SANGAT DISARANKAN"));
      add(RULE("API-U", "Impor untuk keperluan sendiri (mesin/bahan).", "DISARANKAN"));
      add(RULE("ITBT", "Bila memperdagangkan barang diatur khusus.", "OPSIONAL"));
      break;
    case "TEKNOLOGI":
      add(RULE("HKI", "Lindungi nama platform, logo & software (merek + ciptaan DJKI).", "SANGAT DISARANKAN"));
      add(RULE("ISO-X", "ISO 27001 keamanan informasi — pembeda besar saat menang B2B.", "DISARANKAN"));
      add(RULE("PT", "Platform digital dengan investor — PT + BKPM lebih meyakinkan.", "DISARANKAN"));
      break;
    case "JASA":
      add(RULE("WLP", "Kewajiban hukum saat mempekerjakan orang.", "WAJIB"));
      add(RULE("ISO9001", "Standar mutu internasional — senjata penjualan jasa B2B.", "DISARANKAN"));
      break;
    case "MANUFAKTUR":
      add(RULE("UKL-UPL", "Kegiatan produksi wajib dokumen lingkungan (AMDAL bila risiko tinggi).", "WAJIB"));
      add(RULE("SMK3", "Wajib bila risiko keselamatan kerja tinggi.", "SANGAT DISARANKAN"));
      add(RULE("SNI", "Bila produk masuk daftar wajib SNI.", "DISARANKAN"));
      break;
    case "TAMBANG":
      add(RULE("IUP", "Izin utama usaha tambang (wilayah izin dari pemprov).", "WAJIB"));
      add(RULE("IUJP", "Bila menjual jasa penunjang (hauling/drilling/survey).", "DISARANKAN"));
      add(RULE("AMDAL", "Operasi produksi wajib AMDAL.", "WAJIB"));
      break;
  }

  // ── Faktor lintas sektor ──
  if (input.pangan && input.sektor !== "KULINER" && input.sektor !== "PANGAN")
    add(RULE("HALAL", "Produk pangan terdeteksi — sertifikasi halal wajib hukum.", "WAJIB"));

  if (input.gedungSendiri) {
    add(RULE("KKPR", "Dokumen tata ruang dasar sebelum semua izin bangunan.", "WAJIB"));
    add(RULE("PBG", "Wajib sebelum membangun/merenovasi gedung.", "WAJIB"));
    add(RULE("SLF", "Wajib agar bangunan laik fungsi — syarat operasional & kredit bank.", "SANGAT DISARANKAN"));
  }

  if (input.karyawan) {
    add(RULE("WLP", "Wajib lapor perusahaan ke Kemenaker.", "WAJIB"));
    add(RULE("BPJS", "Kewajiban JKK-JKM-JHT + jaminan kesehatan pekerja.", "WAJIB"));
  }

  if (input.merek || input.online)
    add(RULE("HKI", input.merek
      ? "Pendaftaran merek DJKI mencegah pembajakan brand."
      : "Jual online tanpa merek terdaftar = brand rentan diambil orang lain.", "SANGAT DISARANKAN"));

  if (input.eksporImpor)
    add(RULE("API-U", "Aktifkan angka pengenal impor sebelum bertransaksi bea cukai.", "WAJIB"));

  if (input.asing) {
    add(RULE("PMA", "Modal asing terlibat — wajib berbadan PT PMA.", "WAJIB"));
    add(RULE("RPTKA", "Mempekerjakan tenaga asing — RPTKA + IMTA wajib.", "WAJIB"));
    add(RULE("KITAS", "Izin tinggal legal bagi investor/pekerja asing.", "SANGAT DISARANKAN"));
  }

  if (input.tender) {
    add(RULE("SBU", "Sertifikat badan usaha = tiket masuk tender.", "WAJIB"));
    add(RULE("ISO9001", "Mayoritas tender menuntut/kredensial kuat dengan ISO 9001.", "SANGAT DISARANKAN"));
  }

  if (input.skala !== "UMKM")
    add(RULE("ISO9001", "Standar mutu internasional menaikkan kredibilitas & efisiensi internal.", "DISARANKAN"));

  // Urutkan: WAJIB → SANGAT DISARANKAN → DISARANKAN → OPSIONAL
  const order: Record<Prioritas, number> = { "WAJIB": 0, "SANGAT DISARANKAN": 1, "DISARANKAN": 2, "OPSIONAL": 3 };
  return r.sort((a, b) => order[a.prioritas] - order[b.prioritas]);
}
