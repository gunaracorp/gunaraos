/**
 * GUNARA OS v3.0 — Seed Bisnis Hub
 * Sumber: audit langsung pusatperizinan.com + gunara.web.id
 * Mengisi: 46 layanan katalog, 2 perusahaan grup, pelanggan contoh,
 *          pengurusan izin contoh, sosmed, brankas, pengguna OWNER.
 * Idempoten: data yang sudah ada dilewati.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Katalog 46 layanan (sinkron dengan src/lib/service-catalog.ts) ──
const SERVICES: { kode: string; nama: string; kategori: string; deskripsi: string; instansi: string; durasiMin: number; durasiMaks: number; hargaMulai: number }[] = [
  ["NIB", "NIB — Nomor Induk Berusaha (OSS RBA)", "Izin Usaha & Badan Hukum", "Legalitas dasar wajib setiap pelaku usaha — sekaligus SIUP, izin impor, akses fasilitas pemerintah.", "OSS RBA", 1, 3, 500000],
  ["PT", "Pendirian PT (Perseroan Terbatas)", "Izin Usaha & Badan Hukum", "Badan usaha paling kredibel — akta notaris, SK Kemenkumham, NPWP korporat.", "Kemenkumham RI", 5, 10, 2500000],
  ["CV", "Pendirian CV (Commanditaire Vennootschap)", "Izin Usaha & Badan Hukum", "Pilihan tepat bisnis keluarga/kongsi — cepat dan ringan dibanding PT.", "Kemenkumham RI", 3, 7, 1500000],
  ["PO-UPTA", "Badan Usaha Perseorangan (PO/UPTA)", "Izin Usaha & Badan Hukum", "Legalitas resmi usaha dikelola sendiri — tanpa notaris, untuk UMKM individu.", "OSS RBA", 2, 4, 750000],
  ["AKTA-UBAH", "Perubahan Data & Akta Badan Usaha", "Izin Usaha & Badan Hukum", "Ganti nama, alamat, pengurus, saham, modal, KBLI — akta hingga update OSS.", "Kemenkumham RI", 5, 8, 1250000],
  ["AMDAL", "AMDAL — Analisis Mengenai Dampak Lingkungan", "Perizinan Lingkungan", "Kewajiban usaha berisiko tinggi — studi kelayakan hingga persetujuan lingkungan.", "DLH / KLHK", 90, 360, 25000000],
  ["UKL-UPL", "UKL-UPL — Upaya Pengelolaan & Pemantauan Lingkungan", "Perizinan Lingkungan", "Dokumen lingkungan usaha menengah — lebih ringkas dari AMDAL, tetap sah.", "DLH", 14, 42, 3500000],
  ["SPPL", "SPPL — Surat Pernyataan Pengelolaan Lingkungan", "Perizinan Lingkungan", "Pernyataan mandiri usaha kecil berisiko rendah — cepat, murah, sah.", "DLH", 1, 5, 750000],
  ["PKL", "Persetujuan Lingkungan (PKL)", "Perizinan Lingkungan", "Dokumen resmi hasil AMDAL/UKL-UPL yang menempel di OSS.", "DLH / KLHK", 14, 56, 2500000],
  ["PBG", "PBG — Persetujuan Bangunan Gedung (eks-IMB)", "Konstruksi & Bangunan", "Izin wajib sebelum membangun/renovasi — hingga terbit di SIMBG.", "SIMBG / PUPR", 14, 56, 2000000],
  ["SLF", "SLF — Sertifikat Laik Fungsi", "Konstruksi & Bangunan", "Bukti bangunan layak pakai — wajib operasional & syarat kredit bank.", "SIMBG / PUPR", 21, 70, 3000000],
  ["SBU", "SBU — Sertifikat Badan Usaha Konstruksi", "Konstruksi & Bangunan", "Kualifikasi resmi kontraktor untuk tender & proyek besar — proses LPJK.", "LPJK", 21, 56, 5000000],
  ["KKPR", "KKPR — Kesesuaian Kegiatan Pemanfaatan Ruang", "Konstruksi & Bangunan", "Dokumen tata ruang dasar sebelum semua izin bangunan & usaha.", "ATR / BPN", 7, 28, 1500000],
  ["API-U", "API-U — Angka Pengenal Impor Umum", "Perdagangan & Impor", "Izin impor keperluan sendiri — wajib saat impor mesin/bahan/aset.", "Kemendag", 2, 5, 1500000],
  ["API-P", "API-P — Angka Pengenal Impor Produsen", "Perdagangan & Impor", "Impor barang untuk dijual kembali — kuncinya KBLI perdagangan benar.", "Kemendag", 2, 5, 1750000],
  ["ITBT", "Izin Perdagangan Barang Tertentu", "Perdagangan & Impor", "Barang diatur khusus: LPG, gula, beras, elektronik, prekurzor.", "Kemendag", 7, 28, 2500000],
  ["TPS-GUDANG", "Izin TPS & Gudang (Tempat Penyimpanan)", "Perdagangan & Impor", "Tempat penimbunan sementara & gudang — bea cukai lancar.", "Bea Cukai", 30, 90, 7500000],
  ["BPOM-MD", "Izin Edar BPOM (MD) Pangan Olahan", "Pangan, Obat & BPOM", "Kunci masuk ritel modern & marketplace — nomor MD resmi.", "BPOM", 30, 120, 4500000],
  ["HALAL", "Sertifikasi Halal BPJPH (Label Halal Indonesia)", "Pangan, Obat & BPOM", "Wajib hukum pangan/minuman/jasa — dari PPH hingga label resmi.", "BPJPH", 30, 120, 2750000],
  ["SNI", "Sertifikasi SNI / SPPT-SNI", "Pangan, Obat & BPOM", "Standar Nasional Indonesia — wajib banyak produk, penanda premium.", "BSN", 60, 120, 8500000],
  ["PIRT", "PIRT — Pangan Industri Rumah Tangga", "Pangan, Obat & BPOM", "Jalur tercepat melegalkan produk pangan UMKM rumahan.", "Dinkes", 14, 28, 950000],
  ["BPOM-SUP", "Registrasi BPOM Suplemen & Notifikasi Kosmetik", "Pangan, Obat & BPOM", "Legalitas kecantikan & kesehatan — notifikasi + registrasi.", "BPOM", 14, 90, 3000000],
  ["SIP", "SIP — Surat Izin Praktik Dokter", "Perizinan Kesehatan", "Izin resmi dokter praktik di klinik/RS/faskes.", "Dinkes", 7, 21, 1250000],
  ["KLINIK", "Izin Usaha Klinik", "Perizinan Kesehatan", "Legalitas klinik pratama/utama — perizinan usaha hingga izin dinas.", "Dinkes", 30, 60, 3500000],
  ["APOTEK", "Izin Apotek & Apotek Cabang", "Perizinan Kesehatan", "Apotek dengan apoteker penanggung jawab — SIA, SIPA, perizinan usaha.", "Dinkes", 30, 60, 3000000],
  ["AKL-AKD", "Izin Distribusi Alat Kesehatan (AKL/AKD)", "Perizinan Kesehatan", "Syarat jual alkes legal — AKL & AKD in vitro.", "Kemenkes", 30, 120, 5000000],
  ["HPI", "Kartu Identitas Pramuwisata (HPI)", "Pariwisata & Perjalanan", "Kartu resmi pramuwisata — wajib membawa wisatawan.", "HPI", 14, 42, 2500000],
  ["BIRO-TRAVEL", "Izin Biro Perjalanan Wisata (PUPU/BP)", "Pariwisata & Perjalanan", "Legal mengemas & menjual paket tour.", "Kemenpar", 14, 28, 2000000],
  ["SHR", "SHR — Pengesahan Hotel & Restoran", "Pariwisata & Perjalanan", "Syarat BCF, OTA besar, dan MICE.", "Kemenpar", 30, 90, 4000000],
  ["TWA-PPA", "Izin Usaha Wisata Alam (TWA/PPA)", "Pariwisata & Perjalanan", "Operasikan wisata kawasan konservasi dari KLHK.", "KLHK", 90, 270, 15000000],
  ["IUP", "IUP — Izin Usaha Pertambangan", "Pertambangan & Energi", "Izin utama eksplorasi/op produksi minerba.", "ESDM / Pemprov", 180, 540, 50000000],
  ["IUPK", "IUPK — Izin Usaha Pertambangan Khusus", "Pertambangan & Energi", "Tambang skala besar/khusus terbitan ESDM pusat.", "ESDM", 360, 1080, 150000000],
  ["IUJP", "IUJP — Izin Usaha Jasa Penunjang Pertambangan", "Pertambangan & Energi", "Jasa penunjang: kontraktor, hauling, drilling, survey, uji.", "ESDM", 60, 120, 12000000],
  ["EBT-PLTS", "Izin EBT & PLTS (IUPTLU Terbarukan)", "Pertambangan & Energi", "Pembangkit terbarukan: PLTS, PLTMH, biomassa, energi baru.", "ESDM", 120, 360, 25000000],
  ["PMA", "Pendirian PT PMA (Investasi Asing)", "PMA & Investasi Asing", "Badan hukum resmi investor asing — akta hingga izin OSS.", "BKPM / Kemenkumham", 14, 28, 7500000],
  ["KITAS", "KITAS & KITAP (Izin Tinggal Indonesia)", "PMA & Investasi Asing", "Izin tinggal investor, pekerja asing, pasangan WNI.", "Imigrasi", 14, 42, 4500000],
  ["BKPM-PI", "Persetujuan Investasi BKPM", "PMA & Investasi Asing", "Persetujuan investasi berbasis risiko — pintu utama investasi.", "BKPM", 7, 21, 3500000],
  ["KPPA", "Kantor Perwakilan Asing (KPPA)", "PMA & Investasi Asing", "Menjajakan pasar tanpa badan hukum — izin KemenInvest.", "Kemeninvest / BKPM", 14, 28, 5000000],
  ["RPTKA", "RPTKA & Izin Kerja Asing (IMTA)", "PMA & Investasi Asing", "Legal merekrut TKA — rencana penggunaan hingga izin kerja.", "Kemenaker", 14, 42, 5000000],
  ["WLP", "Wajib Lapor Perusahaan (Kemenaker)", "Ketenagakerjaan", "Kewajiban hukum tiap perusahaan — syarat izin kerja asing.", "Kemenaker", 2, 5, 750000],
  ["BPJS", "Pendaftaran BPJS Ketenagakerjaan & Kesehatan", "Ketenagakerjaan", "JKK-JKM-JHT + jaminan kesehatan pekerja, lengkap premi.", "BPJS", 7, 14, 850000],
  ["SMK3", "Sertifikasi SMK3 (K3)", "Ketenagakerjaan", "Wajib perusahaan risiko tinggi — nilai plus tender.", "Kemenaker", 30, 90, 7500000],
  ["ISO9001", "Sertifikasi ISO 9001:2015 (Manajemen Mutu)", "Sertifikasi & HKI", "Mutu global — kredibilitas, syarat tender, efisiensi.", "Badan Sertifikasi", 60, 150, 12000000],
  ["ISO-X", "ISO 14001 / 45001 / 27001", "Sertifikasi & HKI", "Lingkungan, K3, keamanan informasi — keunggulan kompetitif.", "Badan Sertifikasi", 90, 180, 15000000],
  ["HKI", "HKI — Merek, Hak Cipta & Paten (DJKI)", "Sertifikasi & HKI", "Lindungi brand, karya, inovasi — merek hingga paten.", "DJKI Kemenkumham", 60, 270, 1800000],
  ["BNSP", "Sertifikasi Kompetensi BNSP", "Sertifikasi & HKI", "Kompetensi resmi SDM — syarat SBU, SMK3, kredibilitas.", "BNSP", 14, 42, 1500000],
].map(([kode, nama, kategori, deskripsi, instansi, durasiMin, durasiMaks, hargaMulai]) => ({
  kode: kode as string, nama: nama as string, kategori: kategori as string,
  deskripsi: deskripsi as string, instansi: instansi as string,
  durasiMin: durasiMin as number, durasiMaks: durasiMaks as number, hargaMulai: hargaMulai as number,
}));

async function main() {
  console.log("🌱 Seeding Bisnis Hub…");

  // 1. Katalog 46 layanan (upsert by kode)
  for (const s of SERVICES) {
    await prisma.serviceCatalog.upsert({ where: { kode: s.kode }, update: {}, create: s });
  }
  console.log(`  ✓ ${SERVICES.length} layanan katalog`);

  // 2. Perusahaan grup sendiri (dari audit kedua website)
  const grup = [
    {
      nama: "Gunara Consultant", legalName: "PT Gunara Consultant",
      entityType: "PT", skAhu: "AHU-038293.AH.01.30.Tahun 2024",
      kblis: "70201, 69201, 69101", bidangUsaha: "Konsultan perizinan & legalitas bisnis",
      deskripsi: "Pusat perizinan terlengkap di Asia — 500+ jenis perizinan, 38 provinsi, ISO 9001:2015, berakar Mic Kinsey sejak 2009.",
      directorName: "Gugun Gunara", modalDasar: 5_000_000_000,
      city: "Tasikmalaya", province: "Jawa Barat",
      address: "Andalusia Garden Cluster Granada No.11, Jln. Abdi Negara II, Kota Tasikmalaya, Jawa Barat 46115",
      website: "https://gunara.web.id", email: "halo@gunaraconsultant.com", phone: "+62 813-1651-6524",
      establishedAt: "2024-01-01", isGrupSendiri: true, status: "AKTIF",
      notes: "Kantor perwakilan: IDX Tower 1 Lt.3 Unit 304, Jl. Sudirman Kav 52-53, Jakarta Selatan. Rekening resmi TUNGGAL: BCA 0860742187 a.n. Gugun Gunara.",
    },
    {
      nama: "PusatPerizinan.com", legalName: "PT Gunara Consultant — Portal PusatPerizinan.com",
      entityType: "PT", kblis: "70201, 63122, 73100",
      bidangUsaha: "Portal perizinan digital (group portal)",
      deskripsi: "Indonesia's #1 Business Licensing Consultant — AI license finder, kalkulator biaya, 1.247+ bisnis dilayani, kepuasan 98%.",
      directorName: "Gugun Gunara",
      city: "Jakarta Selatan", province: "DKI Jakarta",
      website: "https://pusatperizinan.com", email: "halo@pusatperizinan.com", phone: "0812-6999-9910",
      isGrupSendiri: true, status: "AKTIF",
      notes: "Portal grup gunara.web.id. Layanan unggulan: NIB, PT/CV/PMA, Halal, BPOM, SNI, ISO, AMDAL, PBG/SLF, PPU PPIU/PPIH, tenaga kerja ke 17 negara, virtual office, PSE.",
    },
  ];
  for (const c of grup) {
    const exists = await prisma.company.findFirst({ where: { nama: c.nama, isGrupSendiri: true } });
    if (!exists) await prisma.company.create({ data: c });
  }
  console.log("  ✓ 2 perusahaan grup (Gunara Consultant + PusatPerizinan.com)");

  // 3. Pengguna OWNER (password contoh: hash scrypt — lihat crypto.ts)
  if ((await prisma.appUser.count()) === 0) {
    const { hashPassword, passwordStrength } = await import("../src/lib/crypto");
    const pw = "Gunara#2026!kuat";
    await prisma.appUser.create({
      data: {
        nama: "Gugun Gunara", email: "gugun@gunaraconsultant.com",
        googleEmail: "gugungunara@gmail.com", phone: "+62 813-1651-6524",
        jabatan: "Pendiri & Direktur Utama",
        passwordHash: hashPassword(pw), passwordStrength: passwordStrength(pw),
        passwordChangedAt: new Date().toISOString().slice(0, 10),
        role: "OWNER", status: "AKTIF", twoFactorType: "APP",
        notes: "Akun pemilik sistem. Password contoh: Gunara#2026!kuat — GANTI setelah login pertama.",
      },
    });
    console.log("  ✓ 1 pengguna OWNER (Gugun Gunara)");
  }

  // 4. Brankas: email Google utama (contoh — password terenkripsi)
  if ((await prisma.vaultEntry.count()) === 0) {
    const { encrypt, passwordStrength } = await import("../src/lib/crypto");
    const companies = await prisma.company.findMany({ where: { isGrupSendiri: true } });
    const gunaraId = companies.find((c) => c.nama === "Gunara Consultant")?.id || "";
    const ppId = companies.find((c) => c.nama === "PusatPerizinan.com")?.id || "";
    const pw = "ContohVault#2026!Ganti";
    await prisma.vaultEntry.create({
      data: {
        label: "Google Workspace — halo@gunaraconsultant.com", category: "EMAIL_GOOGLE",
        identifier: "halo@gunaraconsultant.com", passwordEnc: encrypt(pw),
        strength: passwordStrength(pw), lastRotatedAt: new Date().toISOString().slice(0, 10),
        url: "https://accounts.google.com", recoveryEmail: "gugungunara@gmail.com",
        recoveryPhone: "+62 813-1651-6524", twoFactorType: "APP",
        ownerName: "Gugun Gunara", linkedCompanyId: gunaraId,
        notes: "Email resmi kantor pusat. 2FA Authenticator. GANTI password contoh setelah seed.",
      },
    });
    await prisma.vaultEntry.create({
      data: {
        label: "OSS RBA — akses pusatperizinan.com", category: "OSS",
        identifier: "admin@pusatperizinan.com",
        url: "https://oss.go.com", recoveryEmail: "halo@gunaraconsultant.com",
        twoFactorType: "NONE", ownerName: "Tim Perizinan", linkedCompanyId: ppId,
        notes: "Belum ada 2FA & password lemah — contoh untuk uji panel Kesehatan Brankas. Segera perbaiki!",
      },
    });
    console.log("  ✓ 2 kredensial brankas (1 Google + 1 OSS)");
  }

  // 5. Sosial media contoh
  if ((await prisma.socialAccount.count()) === 0) {
    const { encrypt } = await import("../src/lib/crypto");
    const companies = await prisma.company.findMany({ where: { isGrupSendiri: true } });
    const ppId = companies.find((c) => c.nama === "PusatPerizinan.com")?.id || "";
    await prisma.socialAccount.createMany({
      data: [
        {
          platform: "INSTAGRAM", handle: "@pusatperizinan", displayName: "PusatPerizinan.com",
          url: "https://instagram.com/pusatperizinan", kategori: "BISNIS",
          emailUsed: "social@pusatperizinan.com", passwordEnc: encrypt("ContohIG#2026!"),
          recoveryEmail: "halo@gunaraconsultant.com", twoFactor: false,
          followers: 12500, following: 180, postCount: 340, engagementPct: 4.2,
          niche: "Perizinan & legalitas bisnis", cadencePerWeek: 5,
          linkedCompanyId: ppId, status: "AKTIF", tags: "utama, edukasi",
        },
        {
          platform: "TIKTOK", handle: "@pusatperizinan", displayName: "PusatPerizinan.com",
          url: "https://tiktok.com/@pusatperizinan", kategori: "BISNIS",
          emailUsed: "social@pusatperizinan.com", twoFactor: false,
          followers: 8400, postCount: 120, engagementPct: 7.8,
          niche: "Legalitas UMKM", cadencePerWeek: 4,
          linkedCompanyId: ppId, status: "AKTIF", tags: "growth",
        },
        {
          platform: "WA_BUSINESS", handle: "+62 813-1651-6524", displayName: "Gunara Consultant",
          kategori: "BISNIS", emailUsed: "halo@gunaraconsultant.com", twoFactor: true,
          followers: 0, cadencePerWeek: 0, niche: "Konsultasi & closing",
          status: "AKTIF", tags: "resmi, closing",
          notes: "Nomor WhatsApp resmi satu-satunya. Waspadai penipuan rekening lain.",
        },
      ],
    });
    console.log("  ✓ 3 akun sosial media contoh");
  }

  // 6. Pelanggan contoh (inspirasi testimoni asli gunara.web.id)
  if ((await prisma.customer.count()) === 0) {
    await prisma.customer.createMany({
      data: [
        { nama: "Budi Santoso", jenis: "INDIVIDU", waPhone: "6281200000001", city: "Bandung", province: "Jawa Barat", sumber: "IG", status: "RETAINER", preferensi: "WA", waktuKontak: "sore", pekerjaan: "Owner Restoran", totalBelanja: 12500000, tags: "restoran, halal, SHR", notes: "Testimoni: 'progres selalu dilaporkan tanpa ditanya'." },
        { nama: "Sari Wijaya", jenis: "INDIVIDU", waPhone: "6281200000002", city: "Jakarta", province: "DKI Jakarta", sumber: "SEO", status: "KLIEN", preferensi: "WA", pekerjaan: "Founder Brand Skincare", totalBelanja: 9800000, tags: "BPOM, kosmetik", notes: "Kasus penyelamatan notifikasi BPOM — kandidat studi kasus." },
        { nama: "PT Konstruksi Fauzi", jenis: "BADAN_USAHA", waPhone: "6281200000003", city: "Balikpapan", province: "Kalimantan Timur", sumber: "REFERRAL", referralBy: "Budi Santoso", status: "KLIEN", preferensi: "TELEPON", pekerjaan: "Direktur PT Konstruksi", totalBelanja: 27500000, tags: "SBU, SMK3, tender BUMN" },
        { nama: "Maria Marpaung", jenis: "INDIVIDU", waPhone: "6281200000004", city: "Ubud", province: "Bali", sumber: "WEB", status: "KLIEN", preferensi: "EMAIL", pekerjaan: "Owner Villa", totalBelanja: 7200000, tags: "PBG, SLF, OTA" },
        { nama: "David Chen", jenis: "INDIVIDU", waPhone: "6281200000005", city: "Surabaya", province: "Jawa Timur", sumber: "REFERRAL", status: "PROSPEK", preferensi: "WA", pekerjaan: "CEO PT PMA", tags: "PMA, KITAS, investor asing", notes: "Butuh penjelasan tiap langkah — kirim ringkasan visual." },
      ],
    });
    console.log("  ✓ 5 pelanggan contoh");
  }

  // 7. Pengurusan izin contoh (5 tahap terisi)
  if ((await prisma.permitApplication.count()) === 0) {
    await prisma.permitApplication.createMany({
      data: [
        { namaLayanan: "Sertifikasi Halal BPJPH", layananKode: "HALAL", kategori: "Pangan, Obat & BPOM", customerName: "Budi Santoso", tahap: 4, status: "PROSES", instansi: "BPJPH", harga: 3500000, biayaPemerintah: 850000, dpDiterima: 1750000, tanggalMasuk: "2026-10-01", targetSelesai: "2026-12-15", notes: "PPH tahap 2 — audit fasilitas minggu depan." },
        { namaLayanan: "Izin Edar BPOM (MD)", layananKode: "BPOM-MD", kategori: "Pangan, Obat & BPOM", customerName: "Sari Wijaya", tahap: 5, status: "TERBIT", instansi: "BPOM", harga: 5800000, biayaPemerintah: 1200000, dpDiterima: 5800000, tanggalMasuk: "2026-08-12", tanggalTerbit: "2026-10-05", notes: "Selesai — testimoni sudah masuk Win Log." },
        { namaLayanan: "SBU — Sertifikat Badan Usaha", layananKode: "SBU", kategori: "Konstruksi & Bangunan", customerName: "PT Konstruksi Fauzi", tahap: 3, status: "KONTRAK", instansi: "LPJK", harga: 8500000, biayaPemerintah: 2500000, dpDiterima: 4250000, tanggalMasuk: "2026-10-12", targetSelesai: "2026-12-20", notes: "Dokumen tenaga teknis dikumpulkan." },
        { namaLayanan: "Pendirian PT PMA", layananKode: "PMA", kategori: "PMA & Investasi Asing", customerName: "David Chen", tahap: 1, status: "PENAWARAN", instansi: "BKPM / Kemenkumham", harga: 12000000, tanggalMasuk: "2026-10-19", targetSelesai: "2026-11-30", notes: "Konsultasi awal via WhatsApp — kirim penawaran besok." },
      ],
    });
    console.log("  ✓ 4 pengurusan izin contoh (tahap 1-5)");
  }

  const counts = {
    serviceCatalog: await prisma.serviceCatalog.count(),
    company: await prisma.company.count(),
    appUser: await prisma.appUser.count(),
    vaultEntry: await prisma.vaultEntry.count(),
    socialAccount: await prisma.socialAccount.count(),
    customer: await prisma.customer.count(),
    permitApplication: await prisma.permitApplication.count(),
  };
  console.log("✅ Selesai!", counts);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
