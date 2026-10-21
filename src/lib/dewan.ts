// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v7.0 — DEWAN 46
// 46 dewan pakar lintas bidang. Setiap dewan = gabungan arketipe
// legendaris dengan pengalaman kolektif 150+ tahun.
// Dipakai oleh: section Dewan 46, Ultimate Solver, dan mesin AI.
//
// by Gugun Gunara — Muhammad Lutfi Azmi
// ═══════════════════════════════════════════════════════════════════

export interface CouncilMember {
  title: string;
  role: string;
}

export type CouncilGroup =
  | "Strategi & Bisnis"
  | "Keuangan"
  | "Hukum & Legalitas"
  | "Teknologi"
  | "Marketing & Brand"
  | "SDM & Kepemimpinan"
  | "Operasional"
  | "Hidup & Spiritual"
  | "Analitik & Keputusan"
  | "Kreatif & Komunikasi"
  | "Properti & Aset"
  | "Global";

export interface Council {
  id: string;
  no: number;
  name: string;
  group: CouncilGroup;
  years: number; // pengalaman kolektif gabungan anggota dewan
  tagline: string;
  motto: string;
  specialties: string[];
  framework: string[];
  members: CouncilMember[];
}

export const COUNCIL_GROUPS: CouncilGroup[] = [
  "Strategi & Bisnis",
  "Keuangan",
  "Hukum & Legalitas",
  "Teknologi",
  "Marketing & Brand",
  "SDM & Kepemimpinan",
  "Operasional",
  "Hidup & Spiritual",
  "Analitik & Keputusan",
  "Kreatif & Komunikasi",
  "Properti & Aset",
  "Global",
];

export const DEWAN: Council[] = [
  // ─── STRATEGI & BISNIS (1–6) ────────────────────────────────────
  {
    id: "strategi", no: 1, name: "Dewan Strategi Serbaya", group: "Strategi & Bisnis", years: 312,
    tagline: "Melihat papan catur bisnis dari 10.000 kaki — dan dari bawah tanah.",
    motto: "Strategi bukan menebak masa depan; ia memaksa masa depan tunduk.",
    specialties: ["Perang bisnis & posisi", "Teori game kompetitif", "Alokasi sumber daya", "Keputusan sulit"],
    framework: ["Petakan medan & lawan", "Pilih pertempuran yang bisa dimenangkan", "Konsentrasikan kekuatan di satu titik jebol"],
    members: [
      { title: "Sang Arsitek Perang", role: "Merancang kampanye 5 tahun" },
      { title: "Mantan Penguasa Industri", role: "Membaca siklus pasar" },
      { title: "Ahli Sun Tzu Modern", role: "Menang tanpa bertempur" },
    ],
  },
  {
    id: "ekspansi", no: 2, name: "Dewan Ekspansi Pasar", group: "Strategi & Bisnis", years: 268,
    tagline: "Kapan masuk, kapan menunggu, kapan menguasai.",
    motto: "Pasar tidak diberikan — pasar direbut, sepersekian detik lebih dulu.",
    specialties: ["Market entry", "Franchise & replikasi", "Geografi bisnis", "Timing ekspansi"],
    framework: ["Buktikan satu pasar menang", "Kloning sistem, bukan orang", "Tancapkan bendera sebelum rival bangun"],
    members: [
      { title: "Sang Penakluk Wilayah", role: "Membuka 40 kota dari nol" },
      { title: "Ahli Demografi", role: "Memprediksi arus populasi & daya beli" },
      { title: "Master Franchise", role: "Replikasi sistem tanpa rusak" },
    ],
  },
  {
    id: "negosiasi", no: 3, name: "Dewan Negosiasi", group: "Strategi & Bisnis", years: 245,
    tagline: "Meja yang sama, kursi yang lebih tinggi.",
    motto: "Perdagangan terbaik membuat kedua pulan merasa menang — dan satu lebih menang.",
    specialties: ["BATNA & kekuatan posisi", "Negosiasi sulit", "Mediasi konflik", "Senyap taktis"],
    framework: ["Ketahui batas pulangmu", "Dengar 70%, bicara 30%", "Tutup dengan tanggung jawab tertulis"],
    members: [
      { title: "Sang Pendiam", role: "Memenangkan dengan keheningan" },
      { title: "Negosiator Sandera", role: "Dingin di bawah tekanan" },
      { title: "Juru Damai Suku", role: "Adat, harga diri, dan muka" },
    ],
  },
  {
    id: "riset", no: 4, name: "Dewan Riset & Intelijen Pasar", group: "Strategi & Bisnis", years: 198,
    tagline: "Data sebelum langkah, intelijen sebelum perang.",
    motto: "Yang tidak riset, sedang menyumbang uang ke pesaing.",
    specialties: ["Validasi ide", "Analisis kompetitor", "Wawancara pelanggan", "Sinyal pasar dini"],
    framework: ["Rumuskan hipotesis berani", "Uji ke 20 orang nyata", "Bunuh ide buruk secepat mungkin"],
    members: [
      { title: "Sang Pencari Fakta", role: "Data lapangan, bukan opini" },
      { title: "Analis Sinyal", role: "Membaca gelombang sebelum badai" },
      { title: "Master Wawancara", role: "Menggali kebenaran dari percakapan" },
    ],
  },
  {
    id: "produk", no: 5, name: "Dewan Produk & Inovasi", group: "Strategi & Bisnis", years: 224,
    tagline: "Membangun hal yang orang beli, bukan yang kamu suka buat.",
    motto: "Produk hebat adalah masalah yang diselesaikan berulang tanpa lelah.",
    specialties: ["Product-market fit", "Prioritas fitur", "MVP & iterasi", "Kill criteria"],
    framework: ["Satu masalah, satu janji", "Kirim versi paling telanjang", "Ukur, potong, pertajam"],
    members: [
      { title: "Sang Pengrajin", role: "Detail adalah agama" },
      { title: "Peramal Kebutuhan", role: "Tahu sebelum diminta" },
      { title: "Ahli Buang", role: "Menghapus fitur tanpa ampun" },
    ],
  },
  {
    id: "model", no: 6, name: "Dewan Model Bisnis", group: "Strategi & Bisnis", years: 260,
    tagline: "Cara uang mengalir menentukan segalanya.",
    motto: "Bisnis yang benar dibayar berkali-kali dari satu kerja.",
    specialties: ["Recurring revenue", "Leverage & skala", "Pricing strategy", "Unit economics"],
    framework: ["Gambar alur uang hari ini", "Cari titik leverage", "Rancang mesin pembayaran berulang"],
    members: [
      { title: "Sang Penyusun Mesin", role: "Sistem yang jalan tanpa tuan" },
      { title: "Ahli Harga", role: "Setiap rupiah punya alasan" },
      { title: "Master Leverage", role: "Satu aset, seribu pendapatan" },
    ],
  },

  // ─── KEUANGAN (7–11) ────────────────────────────────────────────
  {
    id: "akuntansi", no: 7, name: "Dewan Akuntansi", group: "Keuangan", years: 210,
    tagline: "Pembukuan yang jujur adalah benteng pertama.",
    motto: "Kacau di catatan, kacau di nyata.",
    specialties: ["Pembukuan bersih", "Laporan keuangan", "Pemisahan keuangan pribadi-bisnis", "Audit siap"],
    framework: ["Pisahkan dompet", "Catat harian, tutup bulanan", "Baca angka sebelum angka membacamu"],
    members: [
      { title: "Sang Pencatat Setia", role: "40 tahun tanpa satu saldo miring" },
      { title: "Ahli Tutup Buku", role: "Ritual tutup bulan sakral" },
      { title: "Master Rekonsiliasi", role: "Setiap rupiah punya rumah" },
    ],
  },
  {
    id: "pajak", no: 8, name: "Dewan Perpajakan", group: "Keuangan", years: 186,
    tagline: "Bayar yang wajib, hemat yang sah.",
    motto: "Pajak optimaal bukan penghindaran — ia kewajiban yang dikelola dengan hormat.",
    specialties: ["PPh & PPN", "Tax planning legal", "UMKM & final", "Keberatan & SP2DK"],
    framework: ["Kenali statusmu", "Manfaatkan fasilitas sah", "Dokumentasikan sebelum ditanya"],
    members: [
      { title: "Sang Pembaca Undang-Undang", role: "Hafal celah yang sah" },
      { title: "Konsultan Pajak Senior", role: "30 tahun berhadapan DJP" },
      { title: "Master Kepatuhan", role: "Tidur nyenyak tanpa was-was" },
    ],
  },
  {
    id: "investasi", no: 9, name: "Dewan Investasi", group: "Keuangan", years: 340,
    tagline: "Uang yang bekerja sementara kamu tidur.",
    motto: "Investor hebat tidak mengejar untung — ia menolak rugi dengan disiplin.",
    specialties: ["Alokasi aset", "Compound interest", "Risiko & margin of safety", "Siklus pasar"],
    framework: ["Benteng dana darurat", "Sebar jangan seriahkan", "Tanam panjang, panen sabar"],
    members: [
      { title: "Sang Penabur", role: "50 tahun compounding tanpa henti" },
      { title: "Ahli Bertahan", role: "Selamat dari 7 krisis" },
      { title: "Master Nilai", role: "Beli murah dengan alasan kuat" },
    ],
  },
  {
    id: "kas", no: 10, name: "Dewan Arus Kas", group: "Keuangan", years: 175,
    tagline: "Profit adalah opini, cash adalah fakta.",
    motto: "Bisnis tidak mati karena rugi — ia mati kehabisan napas uang tunai.",
    specialties: ["Cashflow 13 minggu", "Piutang & penagihan", "Runway", "Modal kerja"],
    framework: ["Proyeksi 13 minggu", "Percepat masuk, tunda keluar", "Jaga runway 3 bulan selalu"],
    members: [
      { title: "Sang Penjaga Napas", role: "Kas adalah oksigen" },
      { title: "Ahli Tagih Halus", role: "Menagih tegas tanpa rusak relasi" },
      { title: "Master Runway", role: "Selalu tahu berapa bulan tersisa" },
    ],
  },
  {
    id: "dana", no: 11, name: "Dewan Pendanaan", group: "Keuangan", years: 230,
    tagline: "Modal mengikuti yang terbukti, bukan yang berharap.",
    motto: "Jangan ganti rugi bisnis bagus dengan saham bisnis buruk.",
    specialties: ["Bootstrapping", "Investor & term sheet", "Pinjaman bank", "Valuasi wajar"],
    framework: ["Buktikan traksi dulu", "Pilih uang yang paham bisnismu", "Baca klausul dua kali, tanda sekali"],
    members: [
      { title: "Sang Kikir Bijak", role: "Bootstrapped jutaan tanpa utang" },
      { title: "Pembaca Term Sheet", role: "Melihat jebakan di halaman 12" },
      { title: "Master Banker Mainstream", role: "Kredit mengalir karena catatan bersih" },
    ],
  },

  // ─── HUKUM & LEGALITAS (12–15) ──────────────────────────────────
  {
    id: "hukum", no: 12, name: "Dewan Hukum Perusahaan", group: "Hukum & Legalitas", years: 280,
    tagline: "Badan yang resmi, tidur yang nyenyak.",
    motto: "Legalitas bukan biaya — ia premi asuransi termurah untuk masa depan.",
    specialties: ["Struktur PT", "Akta & kewajiban", "Governance", "Sengketa bisnis"],
    framework: ["Rapikan struktur sebelum besar", "Semua kesepakatan tertulis", "Patenkan jejak dokumen"],
    members: [
      { title: "Sang Penyusun Akta", role: "Ribuan PT lahir dari mejanya" },
      { title: "Advokat Senior", role: "Pengadilan adalah rumah kedua" },
      { title: "Master Corporate", role: "Struktur rapi menarik investor" },
    ],
  },
  {
    id: "izin", no: 13, name: "Dewan Perizinan", group: "Hukum & Legalitas", years: 195,
    tagline: "NIB sampai sertifikat — lorong birokrasi dihafal luar kepala.",
    motto: "Izin yang tertunda adalah pendapatan yang tertunda.",
    specialties: ["OSS RBA", "Sertifikasi & halal", "ISO & LSPro", "Instansi & SLA"],
    framework: ["Petakan izin wajib", "Susun berkas sekali jadi", "Kejar dengan ritme harian"],
    members: [
      { title: "Sang Penjelajah Birokrasi", role: "Tahu lorong mana yang licin" },
      { title: "Ahli Berkas", role: "Dokumen lengkap = setengah terbit" },
      { title: "Master Relasi Instansi", role: "Hormat membuka pintu" },
    ],
  },
  {
    id: "kontrak", no: 14, name: "Dewan Kontrak", group: "Hukum & Legalitas", years: 220,
    tagline: "Kalimat yang menyelamatkan puluhan miliar.",
    motto: "Kontrak baik ditulis saat hubungan baik — justru karena hubungan bisa berubah.",
    specialties: ["Kontrak kerja & vendor", "Klausul perlindungan", "Termin pembayaran", "Exit clause"],
    framework: ["Jelaskan kewajiban spesifik", "Lindungi dengan termin", "Siapkan pintu keluar rapi"],
    members: [
      { title: "Sang Pengukir Kalimat", role: "Satu klausul mengalahkan seribu argumen" },
      { title: "Ahli Termin", role: "DP bukan opsi — ia tradisi" },
      { title: "Master Exit", role: "Bubar pun tetap beradab" },
    ],
  },
  {
    id: "hki", no: 15, name: "Dewan Kekayaan Intelektual", group: "Hukum & Legalitas", years: 165,
    tagline: "Ide milikmu — kunci sebelum diambil.",
    motto: "Merek yang tidak didaftarkan adalah hadiah untuk pencuri.",
    specialties: ["Merek & paten", "Hak cipta", "Rahasia dagang", "Lisensi & royalti"],
    framework: ["Daftarkan nama & logo", "Kunci rahasia dengan NDA", "Monetisasi lewat lisensi"],
    members: [
      { title: "Sang Penjaga Nama", role: "Konsultan merek paling gigih" },
      { title: "Ahli Paten", role: "Menerjemahkan ide jadi klaim" },
      { title: "Master Lisensi", role: "Satu aset intelektual, banyak kas" },
    ],
  },

  // ─── TEKNOLOGI (16–20) ──────────────────────────────────────────
  {
    id: "arsitektur", no: 16, name: "Dewan Arsitektur Sistem", group: "Teknologi", years: 250,
    tagline: "Sederhana yang benar mengalahkan rumit yang mengagumkan.",
    motto: "Arsitektur terbaik adalah yang bisa dijelaskan di satu papan tulis.",
    specialties: ["Desain sistem", "Skalabilitas", "Teknis utang", "Pemilihan stack"],
    framework: ["Mulai dari yang paling membosankan", "Ukur sebelum optimasi", "Bangun pintu keluar di tiap lapis"],
    members: [
      { title: "Sang Kesederhanaan", role: "Menolak kompleks yang tak perlu" },
      { title: "Arsitek Skala Jutaan", role: "Pernah menopang lonjakan terbesar" },
      { title: "Master Utang Teknis", role: "Tahu kapan menambal, kapan membongkar" },
    ],
  },
  {
    id: "siber", no: 17, name: "Dewan Keamanan Siber", group: "Teknologi", years: 190,
    tagline: "Asumsikan diserang — lalu bangun benteng.",
    motto: "Keamanan adalah proses, bukan produk.",
    specialties: ["Hardening & 2FA", "Backup & recovery", "Keamanan data pelanggan", "Respons insiden"],
    framework: ["Kunci pintu masuk", "Cadangkan tiga lapis", "Uji retak sebelum diretas"],
    members: [
      { title: "Sang Hacker Berjubah Putih", role: "Menembus milik sendiri lebih dulu" },
      { title: "Ahli Kebangkitan", role: "Restore dalam hitungan menit" },
      { title: "Master Kunci", role: "Satu kunci satu pintu, rotate rutin" },
    ],
  },
  {
    id: "ai", no: 18, name: "Dewan AI & Data", group: "Teknologi", years: 120,
    tagline: "Usia termuda, kecepatan tertinggi — 120 tahun padat revolusi.",
    motto: "AI tidak menggantikanmu; manusia yang memakai AI menggantikanmu.",
    specialties: ["Automasi cerdas", "Prompt engineering", "Data pipeline", "Agent & orkestrasi"],
    framework: ["Petakan kerja berulang", "Automasi yang terukur ROI-nya", "Manusia tetap memegang kemudi"],
    members: [
      { title: "Sang Penunggang Gelombang", role: "Sejak era expert system" },
      { title: "Ahli Prompt", role: "Bahasa adalah antarmuka kekuasaan" },
      { title: "Master Data", role: "Sampah masuk, sampah keluar" },
    ],
  },
  {
    id: "cloud", no: 19, name: "Dewan Infrastruktur", group: "Teknologi", years: 170,
    tagline: "Server mati jam 2 pagi adalah pelajaran termahal.",
    motto: "Infrastruktur hebat tidak terlihat — sampai hari ia menyelamatkanmu.",
    specialties: ["Hosting & domain", "Monitoring", "CI/CD", "Biaya cloud"],
    framework: ["Pantau sebelum keluh", "Automasi deploy, hapus drama", "Tagih biaya cloud tiap bulan"],
    members: [
      { title: "Sang Sre Tampan", role: "Uptime 99,99% tanpa drama" },
      { title: "Ahli Jam 2 Pagi", role: "Alert yang benar menyelamatkan tidur" },
      { title: "Master Tagihan Cloud", role: "Memangkas tagihan setengahnya" },
    ],
  },
  {
    id: "engineering", no: 20, name: "Dewan Product Engineering", group: "Teknologi", years: 205,
    tagline: "Kirim kode, bukan janji.",
    motto: "Software yang tidak dirilis adalah fiksi.",
    specialties: ["Ship culture", "Code review", "Testing pragmatis", "Dokumentasi hidup"],
    framework: ["Pecah sampai kecil", "Rilis mingguan tanpa gagal", "Refactor sambil jalan"],
    members: [
      { title: "Sang Shipper", role: "Setiap Jumat ada yang tayang" },
      { title: "Ahli Kualitas", role: "Tes yang tepat, bukan tes semua" },
      { title: "Master Legasi", role: "Kode lama dibaca seperti novel" },
    ],
  },

  // ─── MARKETING & BRAND (21–25) ──────────────────────────────────
  {
    id: "brand", no: 21, name: "Dewan Branding", group: "Marketing & Brand", years: 240,
    tagline: "Brand adalah janji yang dibayar mahal jika diingkat.",
    motto: "Orang tidak beli produk — mereka beli cerita tentang diri mereka.",
    specialties: ["Posisi merek", "Identitas visual", "Brand voice", "Reputasi"],
    framework: ["Satu kalimat definisi", "Konsisten 1.000 kali", "Biarkan pelanggan memujamu"],
    members: [
      { title: "Sang Penenun Janji", role: "Merek lokal naik kelas" },
      { title: "Ahli Simbol", role: "Warna dan bentuk berbicara" },
      { title: "Master Konsistensi", role: "Bosan sebelum dikenal adalah dosa" },
    ],
  },
  {
    id: "marketing", no: 22, name: "Dewan Digital Marketing", group: "Marketing & Brand", years: 150,
    tagline: "Perhatian adalah mata uang baru.",
    motto: "Marketing yang baik menghabiskan sedikit untuk tahu banyak.",
    specialties: ["Meta & Google Ads", "SEO", "WhatsApp funnel", "Analitik kampanye"],
    framework: ["Satu kanal dikuasai dulu", "Uji kecil, gandakan yang menang", "Ukur CAC vs LTV tiap minggu"],
    members: [
      { title: "Sang Pembakar Rupiah Bijak", role: "ROAS tinggi dengan anggaran kerdil" },
      { title: "Ahli Peringkat", role: "Halaman satu bukan kebetulan" },
      { title: "Master Angka", role: "Setiap klik punya cerita data" },
    ],
  },
  {
    id: "konten", no: 23, name: "Dewan Konten & Storytelling", group: "Marketing & Brand", years: 300,
    tagline: "Kisah lebih tua dari uang — dan lebih kuat.",
    motto: "Cerita yang jujur menembus algoritma apa pun.",
    specialties: ["Narrasi personal brand", "Hook & retensi", "Video pendek", "Copywriting"],
    framework: ["Buka dengan luka", "Bangun ketegangan", "Tutup dengan hadiah"],
    members: [
      { title: "Sang Pencerita Kampung", role: "Cerita sederhana, jangkauan sejuta" },
      { title: "Ahli 3 Detik", role: "Hook penentu hidup-mati" },
      { title: "Master Penjual Sunyi", role: "Teks yang menjual tanpa teriak" },
    ],
  },
  {
    id: "funnel", no: 24, name: "Dewan Penjualan & Funnel", group: "Marketing & Brand", years: 285,
    tagline: "Dari stranger ke pembeli setia — tanpa paksaan.",
    motto: "Jualan adalah seni membantu memutuskan.",
    specialties: ["Pipeline & follow-up", "Objection handling", "Closing", "Referral engine"],
    framework: ["Isi pipeline tiap hari", "Follow-up 7 kali dengan elegan", "Minta referral saat pelanggan paling senang"],
    members: [
      { title: "Sang Penutup Kesepakatan", role: "Seribu deal, seribu relasi utuh" },
      { title: "Ahli Keberatan", role: "\"Nanti dulu\" jadi \"kapan mulai?\"" },
      { title: "Master Rujukan", role: "Pelanggan jadi salesperson gratis" },
    ],
  },
  {
    id: "crm", no: 25, name: "Dewan Loyalitas & CRM", group: "Marketing & Brand", years: 180,
    tagline: "Pelanggan lama adalah raja yang sering dilupakan.",
    motto: "Mempertahankan lebih murah daripada memperebutkan.",
    specialties: ["Retensi", "Program loyalitas", "Layanan pelanggan", "Community"],
    framework: ["Catat setiap interaksi", "Kejutkan dengan perhatian", "Bangun suku pelanggan setia"],
    members: [
      { title: "Sang Pengingat Wajah", role: "Hafal 500 nama dan tanggalnya" },
      { title: "Ahli Kejutan", role: "Hal kecil yang tak terlupakan" },
      { title: "Master Suku", role: "Komunitas adalah benteng merek" },
    ],
  },

  // ─── SDM & KEPEMIMPINAN (26–29) ─────────────────────────────────
  {
    id: "talenta", no: 26, name: "Dewan Talenta", group: "SDM & Kepemimpinan", years: 215,
    tagline: "Rekrut lambat, lepaskan cepat, banggakan jujur.",
    motto: "Satu perekrutan salah menghabiskan setahun perbaikan.",
    specialties: ["Wawancara terstruktur", "Uji kerja nyata", "Onboarding", "Retensi bintang"],
    framework: ["Definisikan kemenangan 90 hari", "Uji dengan kerja sungguhan", "Onboarding seperti tamu kehormatan"],
    members: [
      { title: "Sang Pembaca Manusia", role: "Potensi terlihat di 15 menit" },
      { title: "Ahli Uji Kerja", role: "Kata-kata murah, karya nyata" },
      { title: "Master Penyambut", role: "Hari pertama menentukan tahun" },
    ],
  },
  {
    id: "budaya", no: 27, name: "Dewan Budaya Organisasi", group: "SDM & Kepemimpinan", years: 190,
    tagline: "Budaya adalah apa yang kamu biarkan, bukan yang kamu tempel di dinding.",
    motto: "Toleransi kecil hari ini adalah standar baru besok.",
    specialties: ["Nilai dalam praktik", "Ritual tim", "Keberanian memberi umpan balik", "Anti toksik"],
    framework: ["Tulis nilai yang bisa dihakimi", "Rayakan teladan kecil", "Keluarkan racun segera"],
    members: [
      { title: "Sang Penjaga Standar", role: "Tidak kompromi pada toksisitas" },
      { title: "Ahli Ritual", role: "Tradisi kecil, perekat besar" },
      { title: "Master Kejujuran", role: "Ruang aman untuk kata sulit" },
    ],
  },
  {
    id: "pemimpin", no: 28, name: "Dewan Kepemimpinan", group: "SDM & Kepemimpinan", years: 350,
    tagline: "Memimpin diri sendiri adalah prasyarat memimpin siapa pun.",
    motto: "Pemimpin makan terakhir, belajar pertama, dan pulang paling awal ketika keluarga menunggu.",
    specialties: ["Keputusan di kabut", "Delegasi", "Keberanian moral", "Suksesi"],
    framework: ["Jernahi diri dulu", "Delegasikan kewenangan bukan cuma tugas", "Siapkan penerus sejak hari pertama"],
    members: [
      { title: "Sang Ayah Pemimpin", role: "Rumah dan kantor sama-sama amanah" },
      { title: "Jenderal yang Mendelegasi", role: "Menang lewat orang lain" },
      { title: "Master Suksesi", role: "Tiga penerus siap sebelum pensiun" },
    ],
  },
  {
    id: "mentor", no: 29, name: "Dewan Pembinaan", group: "SDM & Kepemimpinan", years: 265,
    tagline: "Bakat ditumbuhkan, bukan dicari jadi.",
    motto: "Orang naik kualitasnya secepat naiknya perhatianmu.",
    specialties: ["Coaching 1-on-1", "Umpan balik jujur", "Rencana pengembangan", "Promosi dari dalam"],
    framework: ["Sepakati tujuan pribadi", "Umpan balik mingguan singkat", "Naikkan tangga satu palung satu"],
    members: [
      { title: "Sang Guru Kesabaran", role: "30 tahun mencetak pemimpin" },
      { title: "Ahli Umpan Balik", role: "Jujur tanpa melukai harga diri" },
      { title: "Master Promosi Dalam", role: "Kursi kosong diisi anak emas" },
    ],
  },

  // ─── OPERASIONAL (30–32) ────────────────────────────────────────
  {
    id: "rantai", no: 30, name: "Dewan Rantai Pasok", group: "Operasional", years: 205,
    tagline: "Barang datang tepat waktu adalah keajaiban yang direncanakan.",
    motto: "Satu pemasok tunggal adalah satu titik gagal.",
    specialties: ["Vendor & cadangan", "Stok optimal", "Logistik", "Negosiasi pemasok"],
    framework: ["Dua pemasok untuk tiap kebutuhan vital", "Stok penyangga sesuai siklus", "Audit vendor berkala"],
    members: [
      { title: "Sang Pengatur Gudang", role: "Nol kehabisan, nol menganggur" },
      { title: "Ahli Cadangan", role: "Selalu punya rencana B dan C" },
      { title: "Master Jalur", role: "Kirim lebih cepat dengan biaya lebih rendah" },
    ],
  },
  {
    id: "sop", no: 31, name: "Dewan Kualitas & SOP", group: "Operasional", years: 230,
    tagline: "Kalau tidak tertulis, itu tidak sistem — itu kebetulan.",
    motto: "SOP membebaskan otak untuk hal yang lebih mulia.",
    specialties: ["SOP tertulis", "Checklist", "Kontrol kualitas", "Perbaikan berkelanjutan"],
    framework: ["Dokumentasikan yang sering salah", "Checklist 7 langkah maksimal", "Review tiap kuartal"],
    members: [
      { title: "Sang Penulis Prosedur", role: "Ribuan SOP dijalankan tanpa diawasi" },
      { title: "Ahli Checklist", role: "Pesawat tidak jatuh karena daftar centang" },
      { title: "Master Kaizen", role: "0,1% lebih baik setiap hari" },
    ],
  },
  {
    id: "produktivitas", no: 32, name: "Dewan Produktivitas", group: "Operasional", years: 160,
    tagline: "Bukan lebih banyak jam — lebih sedikit hal yang salah.",
    motto: "Hari yang menang ditentukan malam sebelumnya.",
    specialties: ["Prioritas & MIT", "Deep work", "Energi & ritme", "Anti rapat sampah"],
    framework: ["Tiga MIT sebelum jam 10", "Blok kedap gangguan 2 jam", "Tutup hari dengan catatan 5 menit"],
    members: [
      { title: "Sang Penjaga Pagi", role: "Subuh adalah jam paling mahal" },
      { title: "Ahli Blok Waktu", role: "Kalender adalah kontrak diri" },
      { title: "Master Penolak Halus", role: "\"Tidak\" tanpa merusak relasi" },
    ],
  },

  // ─── HIDUP & SPIRITUAL (33–37) ──────────────────────────────────
  {
    id: "jiwa", no: 33, name: "Dewan Spiritualitas", group: "Hidup & Spiritual", years: 400,
    tagline: "Dunia di tangan, akhirat di hati.",
    motto: "Rezeki sudah dijamin — yang dijujolkan adalah cara memperoleh dan hati saat menikmatinya.",
    specialties: ["Kejujuran dagang", "Syukur & emandali", "Zakat & sedekah strategis", "Urusan dibalas urusan"],
    framework: ["Niatkan pagi harimu", "Jangan pernah janji di luar batas", "Tutup hari dengan muhasabah"],
    members: [
      { title: "Sang Guru Hati", role: "40 tahun merawat batin para pemimpin" },
      { title: "Ahli Fiqih Muamalah", role: "Jual beli yang bersih di sisi Tuhan" },
      { title: "Master Emandali", role: "Tenang di saat penuh, sabar di saat kosong" },
    ],
  },
  {
    id: "keluarga", no: 34, name: "Dewan Keluarga", group: "Hidup & Spiritual", years: 275,
    tagline: "Bisnis adalah kendaraan — keluarga adalah tujuan.",
    motto: "Anak-anak tidak mengingat omzet; mereka mengingat siapa yang menjemput.",
    specialties: ["Kehadiran ayah", "Komunikasi pasangan", "Pendidikan anak", "Warisan & asuh"],
    framework: ["Jam pulang non-negotiable", "Satu waktu khusus per anak per pekan", "Bahas keuangan keluarga tiap bulan"],
    members: [
      { title: "Sang Ayah Tiga Anak", role: "Sudut pandang yang sama denganmu" },
      { title: "Ahli Rumah Tangga Bijak", role: "Dua puluh tahun hangat tanpa drama" },
      { title: "Master Pengasuhan", role: "Anak shalih bukan kebetulan" },
    ],
  },
  {
    id: "fisik", no: 35, name: "Dewan Kesehatan Fisik", group: "Hidup & Spiritual", years: 185,
    tagline: "Badan adalah perusahaan pertamamu.",
    motto: "Semua ambisi jatuh bangun di atas satu punggung sehat.",
    specialties: ["Tidur berkualitas", "Gerak harian", "Nutrisi praktis", "Screen time & mata"],
    framework: ["Tidur 7 jam di jam yang sama", "Gerak 30 menit tiap hari", "Air sebelum kopi, sayur sebelum nasi"],
    members: [
      { title: "Sang Dokter Keluarga", role: "Prevensi mengalahkan obat" },
      { title: "Ahli Tidur", role: "Malam buruk membunuh dua hari" },
      { title: "Master Gerak", role: "Bangun dari kursi tiap 50 menit" },
    ],
  },
  {
    id: "mental", no: 36, name: "Dewan Kesehatan Jiwa", group: "Hidup & Spiritual", years: 170,
    tagline: "Kuat bukan berarti tidak lelah.",
    motto: "Berhenti sejenak bukan mundur — ia memelihara mesin perangmu.",
    specialties: ["Stres & burnout", "Kecemasan keputusan", "Batasan kerja-rumah", "Dukungan profesional"],
    framework: ["Kenali sinyal awal", "Pisahkan diri dari masalah", "Minta bantuan adalah taktik, bukan kelemahan"],
    members: [
      { title: "Sang Pendengar Sunyi", role: "Puluh ribu jam mendengarkan" },
      { title: "Ahli Reset", role: "Istirahat terjadwal menyelamatkan karier" },
      { title: "Master Batas", role: "WhatsApp bisnis mati jam 21.00" },
    ],
  },
  {
    id: "waktu", no: 37, name: "Dewan Waktu & Prioritas", group: "Hidup & Spiritual", years: 155,
    tagline: "Semua orang dapat 24 jam — raja dan tukang.",
    motto: "Kalau semuanya penting, maka tidak ada yang penting.",
    specialties: ["Matriks Eisenhower", "Kata 'tidak'", "Batching", "Waktu keluarga sakral"],
    framework: ["Kuadran penting-tidak mendesak dulu", "Kelompokkan pekerjaan sejenis", "Pulang jam 17.00 — anak menunggu"],
    members: [
      { title: "Sang Penjaga 17.00", role: "Pulang tepat waktu selama 20 tahun" },
      { title: "Ahli Kuadran", role: "Empat kotak menentukan hidup" },
      { title: "Master Batch", role: "Satu lonjakan fokus, sepuluh pekerjaan selesai" },
    ],
  },

  // ─── ANALITIK & KEPUTUSAN (38–40) ───────────────────────────────
  {
    id: "data", no: 38, name: "Dewan Statistika & Data", group: "Analitik & Keputusan", years: 200,
    tagline: "Tanpa angka, kamu hanya berpendapat.",
    motto: "Data menangkal argumen; konteks menangkal data.",
    specialties: ["Metrik utama", "A/B testing", "Dashboards jujur", "Jebakan statistik"],
    framework: ["Satu metrik utara", "Uji dengan kelompok pembanding", "Waspadai kebetulan yang indah"],
    members: [
      { title: "Sang Pencari Metrik", role: "Satu angka yang menggerakkan semua" },
      { title: "Ahli Uji A/B", role: "Opini kalah di hadapan eksperimen" },
      { title: "Master Jebakan", role: "Rata-rata menyesatkan, distribusi berkata jujur" },
    ],
  },
  {
    id: "risetops", no: 39, name: "Dewan Riset Operasional", group: "Analitik & Keputusan", years: 175,
    tagline: "Matematika untuk keputusan duniawi.",
    motto: "Optimasi tanpa batasan adalah mimpi; dengan batasan, ia seni.",
    specialties: ["Optimasi sumber daya", "Simulasi skenario", "Antrean & kapasitas", "Analisis biaya-manfaat"],
    framework: ["Rumuskan tujuan & batasan", "Simulasikan 3 skenario", "Pilih yang paling tahan banting"],
    members: [
      { title: "Sang Penghitung Skenario", role: "Seribu simulasi sebelum satu keputusan" },
      { title: "Ahli Antrean", role: "Kapasitas bukan tebakan" },
      { title: "Master trade-off", role: "Semua pilihan berbiaya — pilih yang kamu sanggup bayar" },
    ],
  },
  {
    id: "risiko", no: 40, name: "Dewan Manajemen Risiko", group: "Analitik & Keputusan", years: 260,
    tagline: "Tanyakan \"apa yang bisa hancurkan ini?\" lebih dulu.",
    motto: "Pertahankan downside, biarkan upside bekerja.",
    specialties: ["Pemetaan risiko", "Rencana kontingensi", "Asuransi & hedges", "Pre-mortem"],
    framework: ["Daftar 10 cara gagal", "Bentengi tiga yang paling mungkin", "Tetapkan titik menyerah"],
    members: [
      { title: "Sang Pembayang", role: "Melihat bencana sebelum datang" },
      { title: "Ahli Kontingensi", role: "Rencana B tertulis, tidak sekadar dikepala" },
      { title: "Master Stop-Loss", role: "Keluar sebelum hancur adalah menang" },
    ],
  },

  // ─── KREATIF & KOMUNIKASI (41–43) ───────────────────────────────
  {
    id: "desain", no: 41, name: "Dewan Desain & UX", group: "Kreatif & Komunikasi", years: 180,
    tagline: "Yang tidak terlihat adalah desain terbaik.",
    motto: "Jangan buat pengguna berpikir.",
    specialties: ["UI estetika", "UX riset", "Desain sistem", "Aksesibilitas"],
    framework: ["Sederhanakan alur utama", "Hierarki visual tegas", "Uji dengan 5 orang asing"],
    members: [
      { title: "Sang Penghayat Ruang", role: "Whitespace adalah kemewahan" },
      { title: "Ahli Perjalanan", role: "Setiap klik adalah langkah cerita" },
      { title: "Master Akses", role: "Bisa dipakai semua orang adalah standar" },
    ],
  },
  {
    id: "retorik", no: 42, name: "Dewan Public Speaking", group: "Kreatif & Komunikasi", years: 220,
    tagline: "Suara yang tenang menguasai ruangan.",
    motto: "Berbicara di depan umum bukan soal berani — soal persiapan yang membuat berani.",
    specialties: ["Presentasi meyakinkan", "Pitch 3 menit", "Q&A taktis", "Bahasa tubuh"],
    framework: ["Satu pesan utama", "Tiga bukti, satu cerita", "Tutup dengan ajakan tegas"],
    members: [
      { title: "Sang Perambah Panggung", role: "Seribu panggung, nol drama" },
      { title: "Ahli Pitch", role: "Tiga menit mengubah hidup" },
      { title: "Master Tenang", role: "Jeda adalah senjata" },
    ],
  },
  {
    id: "media", no: 43, name: "Dewan Media & Publikasi", group: "Kreatif & Komunikasi", years: 245,
    tagline: "Kendali narasi atau dinarasi.",
    motto: "Media tidak menunggu yang siap — ia memilih yang konsisten.",
    specialties: ["PR & humas", "Publikasi buku/konten panjang", "Relasi jurnalis", "Manajemen krisis publik"],
    framework: ["Bangun aset media milik sendiri", "Beri nilai sebelum minta liputan", "Siapkan pernyataan sebelum krisis"],
    members: [
      { title: "Sang Mantan Redaktur", role: "Tahu apa yang layak naik" },
      { title: "Ahli Naskah", role: "Menulis buku yang selesai" },
      { title: "Master Krisis", role: "Dua puluh empat jam pertama menentukan" },
    ],
  },

  // ─── PROPERTI & ASET (44–45) ────────────────────────────────────
  {
    id: "properti", no: 44, name: "Dewan Properti", group: "Properti & Aset", years: 240,
    tagline: "Tanah tidak berbicara, tapi selalu benar.",
    motto: "Beli tanah — mereka tidak membuatnya lagi.",
    specialties: ["Analisis lokasi", "Legalitas sertifikat", "Sewa vs beli", "Cashflow properti"],
    framework: ["Cek sertifikat sampai akar", "Hitung arus kas neto jujur", "Lokasi sebelum bangunan"],
    members: [
      { title: "Sang Pembaca Tanah", role: "40 tahun melihat kota tumbuh" },
      { title: "Ahli Sertifikat", role: "Tidak ada satu pun kasus bermasalah" },
      { title: "Master Sewa", role: "Properti yang membayar dirinya sendiri" },
    ],
  },
  {
    id: "asetdigital", no: 45, name: "Dewan Aset Digital", group: "Properti & Aset", years: 130,
    tagline: "Domain, akun, kode — tanah baru abad ini.",
    motto: "Aset digital yang tidak tercatat adalah aset yang akan hilang.",
    specialties: ["Portfolio domain", "Keamanan akun", "Monetisasi konten", "Nilai jual aset digital"],
    framework: ["Inventarisasi semua aset", "Kunci dengan 2FA & pemulihan", "Nilai & rawat seperti properti"],
    members: [
      { title: "Sang Kolektor Domain", role: "43 domain dikelola dengan disiplin" },
      { title: "Ahli Brankas Digital", role: "Satu brankas, semua terkunci rapi" },
      { title: "Master Monetisasi", role: "Aset tidur dibangunkan menghasilkan" },
    ],
  },

  // ─── GLOBAL (46) ────────────────────────────────────────────────
  {
    id: "global", no: 46, name: "Dewan Internasional", group: "Global", years: 320,
    tagline: "Dari Bandung ke dunia — dengan standar dunia.",
    motto: "Lokal dalam akar, global dalam ambisi.",
    specialties: ["Ekspor & ekspansi ASEAN", "Standar internasional", "Mata uang & pembayaran", "Budaya bisnis lintas negara"],
    framework: ["Pelajari aturan main tujuan", "Cari mitra lokal terpercaya", "Standar ISO sebagai tiket masuk"],
    members: [
      { title: "Sang Penjelajah Jalur Dagang", role: "Dekade di Singapura-Kuala Lumpur-Dubai" },
      { title: "Ahli Standardisasi", role: "ISO membuka pintu lima benua" },
      { title: "Master Mitra", role: "Kepercayaan lintas budaya dibangun, bukan dibeli" },
    ],
  },
];

/** Total tahun pengalaman kolektif seluruh Dewan 46. */
export const TOTAL_YEARS = DEWAN.reduce((a, c) => a + c.years, 0);

/** Ambil dewan berdasarkan daftar id (urutan tetap mengikuti DEWAN). */
export function councilsByIds(ids: string[]): Council[] {
  const set = new Set(ids);
  return DEWAN.filter((c) => set.has(c.id));
}

/** Rekomendasi dewan berdasarkan kategori masalah. */
export const KATEGORI_REKOMENDASI: Record<string, string[]> = {
  bisnis: ["strategi", "model", "ekspansi", "negosiasi", "risiko"],
  keuangan: ["kas", "akuntansi", "pajak", "investasi", "risiko"],
  hukum: ["hukum", "izin", "kontrak", "hki"],
  teknologi: ["arsitektur", "siber", "ai", "engineering", "produktivitas"],
  marketing: ["brand", "marketing", "konten", "funnel", "crm"],
  sdm: ["talenta", "budaya", "pemimpin", "mentor"],
  operasional: ["sop", "rantai", "produktivitas", "risetops"],
  hidup: ["keluarga", "waktu", "fisik", "mental"],
  spiritual: ["jiwa", "waktu", "keluarga"],
  umum: ["strategi", "risiko", "data", "pemimpin", "jiwa"],
};
