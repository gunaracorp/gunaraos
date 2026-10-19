// ═══════════════════════════════════════════════════════
// GUNARA OS — Katalog Layanan (hasil audit gunara.web.id)
// 46 layanan · 11 kategori · instansi resmi · harga & durasi
// ═══════════════════════════════════════════════════════

export interface ServiceDef {
  kode: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  instansi: string;
  durasiMin: number; // hari kalender (approx)
  durasiMaks: number;
  hargaMulai: number;
}

export const KATEGORI_LAYANAN = [
  "Izin Usaha & Badan Hukum",
  "Perizinan Lingkungan",
  "Konstruksi & Bangunan",
  "Perdagangan & Impor",
  "Pangan, Obat & BPOM",
  "Perizinan Kesehatan",
  "Pariwisata & Perjalanan",
  "Pertambangan & Energi",
  "PMA & Investasi Asing",
  "Ketenagakerjaan",
  "Sertifikasi & HKI",
] as const;

export const SERVICES: ServiceDef[] = [
  // ── Izin Usaha & Badan Hukum ──
  { kode: "NIB", nama: "NIB — Nomor Induk Berusaha (OSS RBA)", kategori: "Izin Usaha & Badan Hukum", deskripsi: "Legalitas dasar wajib setiap pelaku usaha — sekaligus SIUP, izin impor, dan akses fasilitas pemerintah.", instansi: "OSS RBA", durasiMin: 1, durasiMaks: 3, hargaMulai: 500_000 },
  { kode: "PT", nama: "Pendirian PT (Perseroan Terbatas)", kategori: "Izin Usaha & Badan Hukum", deskripsi: "Badan usaha paling kredibel untuk menarik investor & proyek besar — akta notaris, SK Kemenkumham, NPWP korporat.", instansi: "Kemenkumham RI", durasiMin: 5, durasiMaks: 10, hargaMulai: 2_500_000 },
  { kode: "CV", nama: "Pendirian CV (Commanditaire Vennootschap)", kategori: "Izin Usaha & Badan Hukum", deskripsi: "Pilihan tepat bisnis keluarga/kongsi dengan modal fleksibel — proses lebih cepat & ringan dibanding PT.", instansi: "Kemenkumham RI", durasiMin: 3, durasiMaks: 7, hargaMulai: 1_500_000 },
  { kode: "PO-UPTA", nama: "Badan Usaha Perseorangan (PO/UPTA)", kategori: "Izin Usaha & Badan Hukum", deskripsi: "Legalitas resmi usaha dikelola sendiri — tanpa notaris, cepat, memberi badan hukum bagi UMKM individu.", instansi: "OSS RBA", durasiMin: 2, durasiMaks: 4, hargaMulai: 750_000 },
  { kode: "AKTA-UBAH", nama: "Perubahan Data & Akta Badan Usaha", kategori: "Izin Usaha & Badan Hukum", deskripsi: "Ganti nama, alamat, pengurus, pemegang saham, modal, KBLI — amandemen akta hingga update OSS.", instansi: "Kemenkumham RI", durasiMin: 5, durasiMaks: 8, hargaMulai: 1_250_000 },

  // ── Perizinan Lingkungan ──
  { kode: "AMDAL", nama: "AMDAL — Analisis Mengenai Dampak Lingkungan", kategori: "Perizinan Lingkungan", deskripsi: "Kewajiban usaha berisiko tinggi — studi kelayakan hingga persetujuan lingkungan terbit.", instansi: "DLH / KLHK", durasiMin: 90, durasiMaks: 360, hargaMulai: 25_000_000 },
  { kode: "UKL-UPL", nama: "UKL-UPL — Upaya Pengelolaan & Pemantauan Lingkungan", kategori: "Perizinan Lingkungan", deskripsi: "Dokumen lingkungan usaha menengah berisiko menengah — lebih ringkas dari AMDAL, tetap sah.", instansi: "DLH", durasiMin: 14, durasiMaks: 42, hargaMulai: 3_500_000 },
  { kode: "SPPL", nama: "SPPL — Surat Pernyataan Pengelolaan Lingkungan", kategori: "Perizinan Lingkungan", deskripsi: "Pernyataan mandiri untuk usaha kecil berisiko rendah — cepat, murah, sah di mata hukum.", instansi: "DLH", durasiMin: 1, durasiMaks: 5, hargaMulai: 750_000 },
  { kode: "PKL", nama: "Persetujuan Lingkungan (PKL)", kategori: "Perizinan Lingkungan", deskripsi: "Dokumen resmi hasil AMDAL/UKL-UPL yang menempel pada perizinan berusaha di OSS.", instansi: "DLH / KLHK", durasiMin: 14, durasiMaks: 56, hargaMulai: 2_500_000 },

  // ── Konstruksi & Bangunan ──
  { kode: "PBG", nama: "PBG — Persetujuan Bangunan Gedung (eks-IMB)", kategori: "Konstruksi & Bangunan", deskripsi: "Izin wajib sebelum membangun/merenovasi gedung — pengecekan gambar teknis hingga terbit di SIMBG.", instansi: "SIMBG / PUPR", durasiMin: 14, durasiMaks: 56, hargaMulai: 2_000_000 },
  { kode: "SLF", nama: "SLF — Sertifikat Laik Fungsi", kategori: "Konstruksi & Bangunan", deskripsi: "Bukti bangunan layak digunakan — wajib untuk operasional kantor, hotel, pabrik, dan syarat kredit bank.", instansi: "SIMBG / PUPR", durasiMin: 21, durasiMaks: 70, hargaMulai: 3_000_000 },
  { kode: "SBU", nama: "SBU — Sertifikat Badan Usaha Konstruksi", kategori: "Konstruksi & Bangunan", deskripsi: "Kualifikasi resmi kontraktor/jasa konstruksi untuk tender & proyek besar — termasuk proses LPJK.", instansi: "LPJK", durasiMin: 21, durasiMaks: 56, hargaMulai: 5_000_000 },
  { kode: "KKPR", nama: "KKPR — Kesesuaian Kegiatan Pemanfaatan Ruang", kategori: "Konstruksi & Bangunan", deskripsi: "Dokumen tata ruang dasar sebelum semua perizinan bangunan dan usaha di lahan tertentu.", instansi: "ATR / BPN", durasiMin: 7, durasiMaks: 28, hargaMulai: 1_500_000 },

  // ── Perdagangan & Impor ──
  { kode: "API-U", nama: "API-U — Angka Pengenal Impor Umum", kategori: "Perdagangan & Impor", deskripsi: "Izin impor untuk keperluan sendiri (bukan dijual) — wajib saat mengimpor mesin, bahan, atau aset.", instansi: "Kemendag", durasiMin: 2, durasiMaks: 5, hargaMulai: 1_500_000 },
  { kode: "API-P", nama: "API-P — Angka Pengenal Impor Produsen", kategori: "Perdagangan & Impor", deskripsi: "Untuk perusahaan dagang yang mengimpor barang untuk dijual kembali — kuncinya KBLI perdagangan yang benar.", instansi: "Kemendag", durasiMin: 2, durasiMaks: 5, hargaMulai: 1_750_000 },
  { kode: "ITBT", nama: "Izin Perdagangan Barang Tertentu", kategori: "Perdagangan & Impor", deskripsi: "Izin tambahan untuk barang diatur khusus: LPG, gula, beras, elektronik, hingga barang prekurzor.", instansi: "Kemendag", durasiMin: 7, durasiMaks: 28, hargaMulai: 2_500_000 },
  { kode: "TPS-GUDANG", nama: "Izin TPS & Gudang (Tempat Penyimpanan)", kategori: "Perdagangan & Impor", deskripsi: "Izin tempat penimbunan sementara (TPS) & gudang untuk kelancaran distribusi dan bea cukai.", instansi: "Bea Cukai", durasiMin: 30, durasiMaks: 90, hargaMulai: 7_500_000 },

  // ── Pangan, Obat & BPOM ──
  { kode: "BPOM-MD", nama: "Izin Edar BPOM (MD) Pangan Olahan", kategori: "Pangan, Obat & BPOM", deskripsi: "Kunci masuk ritel modern & marketplace — nomor MD resmi BPOM untuk produk pangan olahan Anda.", instansi: "BPOM", durasiMin: 30, durasiMaks: 120, hargaMulai: 4_500_000 },
  { kode: "HALAL", nama: "Sertifikasi Halal BPJPH (Label Halal Indonesia)", kategori: "Pangan, Obat & BPOM", deskripsi: "Wajib hukum bagi produk pangan, minuman, dan jasa — dari PPH hingga label halal resmi.", instansi: "BPJPH", durasiMin: 30, durasiMaks: 120, hargaMulai: 2_750_000 },
  { kode: "SNI", nama: "Sertifikasi SNI / SPPT-SNI", kategori: "Pangan, Obat & BPOM", deskripsi: "Standar Nasional Indonesia — wajib untuk banyak produk sekaligus penanda kualitas premium.", instansi: "BSN", durasiMin: 60, durasiMaks: 120, hargaMulai: 8_500_000 },
  { kode: "PIRT", nama: "PIRT — Pangan Industri Rumah Tangga", kategori: "Pangan, Obat & BPOM", deskripsi: "Jalur tercepat melegalkan produk pangan UMKM rumahan untuk dijual luas secara legal.", instansi: "Dinkes", durasiMin: 14, durasiMaks: 28, hargaMulai: 950_000 },
  { kode: "BPOM-SUP", nama: "Registrasi BPOM Suplemen & Notifikasi Kosmetik", kategori: "Pangan, Obat & BPOM", deskripsi: "Legalitas produk kecantikan & kesehatan — notifikasi kosmetik dan registrasi suplemen di BPOM.", instansi: "BPOM", durasiMin: 14, durasiMaks: 90, hargaMulai: 3_000_000 },

  // ── Perizinan Kesehatan ──
  { kode: "SIP", nama: "SIP — Surat Izin Praktik Dokter", kategori: "Perizinan Kesehatan", deskripsi: "Izin resmi dokter untuk praktik di klinik, rumah sakit, atau fasilitas kesehatan lainnya.", instansi: "Dinkes", durasiMin: 7, durasiMaks: 21, hargaMulai: 1_250_000 },
  { kode: "KLINIK", nama: "Izin Usaha Klinik", kategori: "Perizinan Kesehatan", deskripsi: "Legalitas operasional klinik pratama/utama — perizinan berusaha hingga izin klinik dari dinas.", instansi: "Dinkes", durasiMin: 30, durasiMaks: 60, hargaMulai: 3_500_000 },
  { kode: "APOTEK", nama: "Izin Apotek & Apotek Cabang", kategori: "Perizinan Kesehatan", deskripsi: "Izin operasional apotek dengan apoteker penanggung jawab — termasuk SIA, SIPA, dan perizinan berusaha.", instansi: "Dinkes", durasiMin: 30, durasiMaks: 60, hargaMulai: 3_000_000 },
  { kode: "AKL-AKD", nama: "Izin Distribusi Alat Kesehatan (AKL/AKD)", kategori: "Perizinan Kesehatan", deskripsi: "AKL untuk alat kesehatan, AKD untuk alat diagnostik in vitro — syarat jual alkes legal di Indonesia.", instansi: "Kemenkes", durasiMin: 30, durasiMaks: 120, hargaMulai: 5_000_000 },

  // ── Pariwisata & Perjalanan ──
  { kode: "HPI", nama: "Kartu Identitas Pramuwisata (HPI)", kategori: "Pariwisata & Perjalanan", deskripsi: "Kartu resmi pramuwisata dari Himpunan Pramuwisata Indonesia — wajib membawa wisatawan.", instansi: "HPI", durasiMin: 14, durasiMaks: 42, hargaMulai: 2_500_000 },
  { kode: "BIRO-TRAVEL", nama: "Izin Biro Perjalanan Wisata (PUPU/BP)", kategori: "Pariwisata & Perjalanan", deskripsi: "Laporan usaha biro perjalanan agar agen perjalanan Anda legal mengemas & menjual tour.", instansi: "Kemenpar", durasiMin: 14, durasiMaks: 28, hargaMulai: 2_000_000 },
  { kode: "SHR", nama: "SHR — Pengesahan Hotel & Restoran", kategori: "Pariwisata & Perjalanan", deskripsi: "Sertifikat resmi kelayakan hotel/resto dari Kemenpar — syarat ikut BCF, OTA besar, dan MICE.", instansi: "Kemenpar", durasiMin: 30, durasiMaks: 90, hargaMulai: 4_000_000 },
  { kode: "TWA-PPA", nama: "Izin Usaha Wisata Alam (TWA/PPA)", kategori: "Pariwisata & Perjalanan", deskripsi: "Izin mengoperasikan wisata di kawasan konservasi (Taman Wisata Alam) dari KLHK.", instansi: "KLHK", durasiMin: 90, durasiMaks: 270, hargaMulai: 15_000_000 },

  // ── Pertambangan & Energi ──
  { kode: "IUP", nama: "IUP — Izin Usaha Pertambangan", kategori: "Pertambangan & Energi", deskripsi: "Izin utama eksplorasi/operasi produksi mineral & batubara dari pemerintah daerah/provinsi.", instansi: "ESDM / Pemprov", durasiMin: 180, durasiMaks: 540, hargaMulai: 50_000_000 },
  { kode: "IUPK", nama: "IUPK — Izin Usaha Pertambangan Khusus", kategori: "Pertambangan & Energi", deskripsi: "Izin tambang skala besar/khusus yang diterbitkan Kementerian ESDM pusat.", instansi: "ESDM", durasiMin: 360, durasiMaks: 1080, hargaMulai: 150_000_000 },
  { kode: "IUJP", nama: "IUJP — Izin Usaha Jasa Penunjang Pertambangan", kategori: "Pertambangan & Energi", deskripsi: "Izin jasa penunjang: kontraktor tambang, hauling, drilling, survey, hingga pengujian.", instansi: "ESDM", durasiMin: 60, durasiMaks: 120, hargaMulai: 12_000_000 },
  { kode: "EBT-PLTS", nama: "Izin EBT & PLTS (IUPTLU Terbarukan)", kategori: "Pertambangan & Energi", deskripsi: "Perizinan usaha pembangkit/listrik terbarukan: PLTS, PLTMH, biomassa, hingga energi baru.", instansi: "ESDM", durasiMin: 120, durasiMaks: 360, hargaMulai: 25_000_000 },

  // ── PMA & Investasi Asing ──
  { kode: "PMA", nama: "Pendirian PT PMA (Investasi Asing)", kategori: "PMA & Investasi Asing", deskripsi: "Badan hukum resmi untuk investor asing beroperasi di Indonesia — akta hingga perizinan berusaha OSS.", instansi: "BKPM / Kemenkumham", durasiMin: 14, durasiMaks: 28, hargaMulai: 7_500_000 },
  { kode: "KITAS", nama: "KITAS & KITAP (Izin Tinggal Indonesia)", kategori: "PMA & Investasi Asing", deskripsi: "Izin tinggal terbatas & tetap untuk investor, pekerja asing, dan pasangan warga Indonesia.", instansi: "Imigrasi", durasiMin: 14, durasiMaks: 42, hargaMulai: 4_500_000 },
  { kode: "BKPM-PI", nama: "Persetujuan Investasi BKPM", kategori: "PMA & Investasi Asing", deskripsi: "Persetujuan investasi berbasis risiko di OSS-BKPM — pintu utama seluruh perizinan investasi.", instansi: "BKPM", durasiMin: 7, durasiMaks: 21, hargaMulai: 3_500_000 },
  { kode: "KPPA", nama: "Kantor Perwakilan Asing (KPPA)", kategori: "PMA & Investasi Asing", deskripsi: "Menjajakan pasar & koordinasi tanpa badan hukum — izin dari KemenInvest/BKPM.", instansi: "Kemeninvest / BKPM", durasiMin: 14, durasiMaks: 28, hargaMulai: 5_000_000 },
  { kode: "RPTKA", nama: "RPTKA & Izin Kerja Asing (IMTA)", kategori: "PMA & Investasi Asing", deskripsi: "Legalitas merekrut tenaga kerja asing — dari rencana penggunaan hingga izin kerja terbit.", instansi: "Kemenaker", durasiMin: 14, durasiMaks: 42, hargaMulai: 5_000_000 },

  // ── Ketenagakerjaan ──
  { kode: "WLP", nama: "Wajib Lapor Perusahaan (Kemenaker)", kategori: "Ketenagakerjaan", deskripsi: "Kewajiban hukum setiap perusahaan mempekerjakan pekerja — syarat izin kerja asing & penempatan.", instansi: "Kemenaker", durasiMin: 2, durasiMaks: 5, hargaMulai: 750_000 },
  { kode: "BPJS", nama: "Pendaftaran BPJS Ketenagakerjaan & Kesehatan", kategori: "Ketenagakerjaan", deskripsi: "Kewajiban JKK-JKM-JHT dan jaminan kesehatan seluruh pekerja — lengkap premi & pembayaran.", instansi: "BPJS", durasiMin: 7, durasiMaks: 14, hargaMulai: 850_000 },
  { kode: "SMK3", nama: "Sertifikasi SMK3 (K3)", kategori: "Ketenagakerjaan", deskripsi: "Sistem Manajemen Keselamatan & Kesehatan Kerja — wajib perusahaan berisiko tinggi, nilai plus tender.", instansi: "Kemenaker", durasiMin: 30, durasiMaks: 90, hargaMulai: 7_500_000 },

  // ── Sertifikasi & HKI ──
  { kode: "ISO9001", nama: "Sertifikasi ISO 9001:2015 (Manajemen Mutu)", kategori: "Sertifikasi & HKI", deskripsi: "Standar manajemen mutu global — menaikkan kredibilitas, syarat tender, dan efisiensi internal.", instansi: "Badan Sertifikasi", durasiMin: 60, durasiMaks: 150, hargaMulai: 12_000_000 },
  { kode: "ISO-X", nama: "ISO 14001 / 45001 / 27001 (Lingkungan, K3, Keamanan Informasi)", kategori: "Sertifikasi & HKI", deskripsi: "Keluarga ISO lanjutan untuk keunggulan kompetitif: lingkungan, keselamatan kerja, keamanan data.", instansi: "Badan Sertifikasi", durasiMin: 90, durasiMaks: 180, hargaMulai: 15_000_000 },
  { kode: "HKI", nama: "HKI — Merek, Hak Cipta & Paten (DJKI)", kategori: "Sertifikasi & HKI", deskripsi: "Lindungi brand, karya, dan inovasi Anda — merek, ciptaan, desain industri, dan paten di DJKI.", instansi: "DJKI Kemenkumham", durasiMin: 60, durasiMaks: 270, hargaMulai: 1_800_000 },
  { kode: "BNSP", nama: "Sertifikasi Kompetensi BNSP", kategori: "Sertifikasi & HKI", deskripsi: "Sertifikat kompetensi resmi untuk SDM & tenaga teknis — syarat SBU, SMK3, kredibilitas profesional.", instansi: "BNSP", durasiMin: 14, durasiMaks: 42, hargaMulai: 1_500_000 },
];

export const serviceByKode = (kode: string) => SERVICES.find((s) => s.kode === kode);

export const fmtDurasi = (min: number, maks: number) => {
  const f = (d: number) => (d >= 60 ? `${Math.round(d / 30)} bln` : d >= 14 ? `${Math.round(d / 7)} mgg` : `${d} hari`);
  return `${f(min)} – ${f(maks)}`;
};
