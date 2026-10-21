// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — SEED DOMAIN MONEY ENGINE (v9.3.0)
// ═══════════════════════════════════════════════════════════════════
// Menanam 49 domain (48 dari registrar + prabudanling.web.id) lengkap
// dengan: data registrar asli (status, kedaluwarsa, harga perpanjangan)
// + BLUEPRINT "Apa isi website & cara menghasilkan uang" per domain.
//
// Jalankan: bun run scripts/seed-domains-money.ts
// Aman diulang (upsert by nama) — data blueprint hanya diisi jika kosong
// atau flag --force dipakai.
// ═══════════════════════════════════════════════════════════════════

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const FORCE = process.argv.includes("--force");

interface SeedDomain {
  nama: string;
  tier: "INTI" | "GATEWAY" | "FUTURE" | "PARKED";
  status: string; // LIVE | PRIORITAS | PLAN | PARK | REDIRECT | CEK | MASA TENGGANG | LEPAS
  regStatus: "AKTIF" | "MENUNGGU" | "REDEMPTION";
  berakhir: string;
  jatuhTempo: string;
  hargaPerpanjangan: number;
  autoKredit: boolean;
  kategori: "KONSULTAN" | "AGENCY" | "UMRAH" | "MEDIA" | "JASA" | "PRODUK" | "PERSONAL";
  peran: string;
  isiWebsite: string;
  monetisasi: string;
  potensiRp: number;
  catatan?: string;
  urutan: number;
}

const DATA: SeedDomain[] = [
  // ─── ⭐ INTI — MESIN UANG UTAMA ───
  {
    nama: "prabudanling.web.id", tier: "INTI", status: "LIVE", regStatus: "AKTIF",
    berakhir: "", jatuhTempo: "", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "PERSONAL", peran: "Media personal brand Prabu Danling — puisi, refleksi, catatan perjalanan",
    isiWebsite: "Homepage profil → arsip tulisan (puisi + esai refleksi hidup & bisnis) → galeri foto perjalanan → newsletter mingguan → halaman Tentang + e-book gratis sebagai magnet email.",
    monetisasi: "Google AdSense · affiliate buku & alat tulis · e-book antologi puisi Rp 49rb · donasi penggemar (Saweria) · jasa penulisan konten untuk brand",
    potensiRp: 3000000, catatan: "Domain utama — LIVE. Kelola perpanjangan di registrar lain.",
    urutan: 0,
  },
  {
    nama: "topkonsultan.web.id", tier: "INTI", status: "PRIORITAS", regStatus: "AKTIF",
    berakhir: "2027-09-04", jatuhTempo: "2027-09-04", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "KONSULTAN", peran: "FORTRESS — markas besar PT Top Konsultan Internasional",
    isiWebsite: "12 halaman layanan perizinan (PT, CV, NIB, OSS, AMDAL, HKI, PBG, LPSE) · kalkulator biaya online · 10 studi kasus · blog SEO 100 artikel 'cara mengurus X' · form konsultasi → WA · testimoni & tim",
    monetisasi: "Jasa perizinan (margin Rp 500rb–15jt/klien) · retainer legalitas bulanan Rp 2jt · paket 'Siap Tender' LPSE Rp 7,5jt · referral notaris & konsultan pajak",
    potensiRp: 25000000, urutan: 1,
  },
  {
    nama: "pusatperizinan.web.id", tier: "INTI", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-08-14", jatuhTempo: "2027-08-14", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "KONSULTAN", peran: "Mesin SEO leads perizinan — pabrik calon klien",
    isiWebsite: "200 artikel panduan 'cara mengurus [izin X] di [kota]' · kalkulator NIB gratis (wajib isi email) · landing tiap jenis izin · FAQ · CTA WA ke tim Top Konsultan",
    monetisasi: "Leads panas mengalir ke sales PT Top Konsultan (komisi internal) · AdSense di artikel tutorial · lead magnet checklist izin → email marketing · upsell paket mendirikan PT",
    potensiRp: 15000000, urutan: 2,
  },
  {
    nama: "gunara.web.id", tier: "INTI", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-07-29", jatuhTempo: "2027-07-29", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "PERSONAL", peran: "Istana personal brand Gugun Gunara",
    isiWebsite: "Bio Master Polymath · portofolio 46 keahlian · jadwal speaking · blog strategi bisnis · halaman kelas online · media kit PDF unduh gratis",
    monetisasi: "Kelas online 'Bangun Konsultan Top' Rp 499rb–1,9jt · coaching 1-on-1 Rp 2,5jt/bln · speaking fee Rp 5jt/event · sponsor blog · funnel leads ke PT Top Konsultan",
    potensiRp: 10000000, urutan: 3,
  },
  {
    nama: "juraganwebsite.web.id", tier: "INTI", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-07-08", jatuhTempo: "2027-07-08", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "AGENCY", peran: "Gerbang 'Website Jadi 7 Hari' — mesin proyek UMKM",
    isiWebsite: "Katalog 20 template web UMKM · kalkulator harga instan · portofolio · form pesan + WA · panduan gratis 'website pertama' · testimoni klien",
    monetisasi: "Paket website Rp 1,5–5jt · retainer maintenance Rp 300rb/bln per klien (pasif!) · komisi reseller domain-hosting · upsell logo & copywriting Rp 750rb",
    potensiRp: 12000000, urutan: 5,
  },
  {
    nama: "digiman.id", tier: "INTI", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-08-18", jatuhTempo: "2027-08-18", hargaPerpanjangan: 250000, autoKredit: false,
    kategori: "AGENCY", peran: "Korporat PT Digital Bisnis Manajemen — mesin kedua",
    isiWebsite: "Layanan digital marketing (ads, SEO, sosmed) · studi kasus ROAS · kalkulator anggaran iklan · profil tim · blog · form audit gratis 15 menit",
    monetisasi: "Retainer iklan Rp 3–10jt/bln · jasa SEO bulanan Rp 5jt · setup sosmed sekali Rp 4jt · workshop in-house korporat Rp 7,5jt/hari",
    potensiRp: 20000000, urutan: 4,
  },
  {
    nama: "digiman.web.id", tier: "PARKED", status: "REDIRECT", regStatus: "AKTIF",
    berakhir: "2027-08-16", jatuhTempo: "2027-08-16", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "AGENCY", peran: "Proteksi merek — redirect 301 ke digiman.id",
    isiWebsite: "Redirect 301 permanen ke digiman.id · satu halaman kosong · noindex · tidak butuh hosting berat",
    monetisasi: "Tidak langsung — menjaga traffic salah ketik & konsistensi merek. Aset proteksi, bukan mesin uang.",
    potensiRp: 0, urutan: 22,
  },
  {
    nama: "pppdigital.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-04-07", jatuhTempo: "2027-04-07", hargaPerpanjangan: 250000, autoKredit: false,
    kategori: "AGENCY", peran: "Landing 'Digitalisasi UMKM PPP'",
    isiWebsite: "Satu halaman: masalah UMKM → solusi 3 paket digitalisasi → form WA · countdown promo · 3 testimoni · FAQ singkat",
    monetisasi: "Bundle web+ads Rp 5jt · leads ke Digiman · jual template murah Rp 499rb · komisi kemitraan",
    potensiRp: 8000000, urutan: 6,
  },
  {
    nama: "pppbisnis.com", tier: "GATEWAY", status: "MASA TENGGANG", regStatus: "REDEMPTION",
    berakhir: "2026-09-07", jatuhTempo: "2026-09-07", hargaPerpanjangan: 215000, autoKredit: false,
    kategori: "AGENCY", peran: "⚠️ SEGERA TEBUS — domain authority lama = aset SEO",
    isiWebsite: "Setelah tebus: portal 'solusi bisnis PPP' — indeks artikel bisnis + redirect cerdas ke layanan Digiman & Top Konsultan",
    monetisasi: "Redirect 301 memindahkan kekuatan SEO domain tua ke topkonsultan.web.id · landing layanan bisnis · AdSense indeks artikel",
    potensiRp: 2000000, catatan: "REDEMPTION — biaya tebus Rp 215.000. KEHILANGAN = mati.",
    urutan: 7,
  },
  {
    nama: "kopnusa.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-03-07", jatuhTempo: "2027-03-07", hargaPerpanjangan: 250000, autoKredit: false,
    kategori: "PRODUK", peran: "Kopi Nusantara — marketplace kopi single origin",
    isiWebsite: "Katalog 15 single origin (Aceh, Toraja, Kintamani) · cerita petani · subscription kopi bulanan · paket hampers korporat · blog panduan seduh",
    monetisasi: "Jual biji kopi margin 40% · subscription Rp 150rb/bln · hampers korporat Rp 500rb–5jt · affiliate alat seduh · dropship reseller",
    potensiRp: 8000000, urutan: 8,
  },
  {
    nama: "cektransparan.web.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-08-15", jatuhTempo: "2027-08-16", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "Portal anti-korupsi & transparansi anggaran",
    isiWebsite: "Database proyek publik · grafik anggaran daerah · artikel investigasi ringan · form lapor masyarakat · feed berita terkait",
    monetisasi: "AdSense (CPC topik pemerintahan tinggi) · jasa riset data untuk media/LSM · donasi publik · sponsorship laporan tahunan",
    potensiRp: 3000000, urutan: 9,
  },
  {
    nama: "cekhoax.web.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-07-07", jatuhTempo: "2027-07-07", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "Fact-check hoaks viral Indonesia",
    isiWebsite: "Pencarian hoaks · label benar/salah · kategori (kesehatan, politik, viral) · form submit hoaks · siap Google News & Discover",
    monetisasi: "AdSense volume tinggi (berita viral) · traffic Google News & Discover · kerja sama program literasi digital · donasi",
    potensiRp: 4000000, urutan: 10,
  },
  {
    nama: "visitpessel.web.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-07-17", jatuhTempo: "2027-07-17", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "Portal wisata Pesisir Selatan",
    isiWebsite: "50 destinasi (pantai, danau, budaya) · peta interaktif · kuliner khas · listing homestay · itinerary gratis unduh · galeri drone",
    monetisasi: "AdSense travel · komisi listing homestay 10% · jual paket tour 1 hari · jasa foto wisata · iklan penginapan Rp 250rb/bln",
    potensiRp: 3000000, urutan: 11,
  },
  {
    nama: "nusaparadise.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-04-11", jatuhTempo: "2027-04-11", hargaPerpanjangan: 250000, autoKredit: false,
    kategori: "MEDIA", peran: "Travel premium Nusantara",
    isiWebsite: "Destinasi curated 4–5 bintang · villa & resort · paket honeymoon · artikel 'hidden gems' · form booking inquiry",
    monetisasi: "Affiliate hotel (Traveloka/Agoda 5–8%) · komisi tour operator · artikel sponsored destinasi · AdSense",
    potensiRp: 6000000, urutan: 12,
  },
  {
    nama: "ciamisraya.web.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-07-18", jatuhTempo: "2027-07-18", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "Portal berita lokal Ciamis Raya",
    isiWebsite: "Berita lokal harian · agenda event · iklan baris UMKM · pengumuman desa · direktori bisnis Ciamis",
    monetisasi: "AdSense lokal · iklan UMKM Rp 300rb/bln · jasa paid promote event · banner bisnis lokal · direktori premium Rp 500rb/thn",
    potensiRp: 3000000, urutan: 13,
  },
  {
    nama: "pusatgeely.web.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-09-04", jatuhTempo: "2027-09-04", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "JASA", peran: "Hub informasi Geely Indonesia",
    isiWebsite: "Harga & spesifikasi semua model Geely · simulator cicilan · booking test drive · artikel review · dealer locator",
    monetisasi: "Komisi leads ke dealer (Rp 500rb–2jt/mobil terjual) · AdSense otomotif CPC tinggi · affiliate asuransi & aksesoris · partner detailing",
    potensiRp: 6000000, urutan: 14,
  },
  {
    nama: "berkatpendingin.web.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-08-15", jatuhTempo: "2027-08-15", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "JASA", peran: "Jasa pendingin rumah tangga 'Berkat'",
    isiWebsite: "Layanan cuci AC · servis kulkas & freezer · pasang AC · harga paket jelas · booking WA 1 klik · area layanan · testimoni",
    monetisasi: "Jasa harian Rp 150–500rb/job · kontrak maintenance kantor Rp 1jt/bln · komisi jual AC baru · jual sparepart",
    potensiRp: 4000000, urutan: 15,
  },
  {
    nama: "mandiripendingin.web.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-08-14", jatuhTempo: "2027-08-14", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "JASA", peran: "Spesialis pendingin komersial 'Mandiri'",
    isiWebsite: "Spesialis AC komersial (toko, resto, kantor) · cold storage · kontrak perawatan tahunan · kalkulator BTU online · studi kasus proyek",
    monetisasi: "Kontrak tahunan Rp 6–20jt · proyek pemasangan Rp 5–50jt · leads → WA · konsultasi desain sistem pendingin",
    potensiRp: 5000000, urutan: 16,
  },
  {
    nama: "tirtasejukabadi.web.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-08-16", jatuhTempo: "2027-08-16", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "PRODUK", peran: "Depot AMT Tirta Sejuk Abadi",
    isiWebsite: "Katalog galon & botolan · harga grosir · pemesanan antar online · program mitra depot · jadwal pengiriman",
    monetisasi: "Penjualan galon (margin Rp 3–5rb × 50–200 galon/hari) · langganan kantor · komisi reseller antar-kecamatan",
    potensiRp: 6000000, urutan: 17,
  },
  {
    nama: "medina.web.id", tier: "FUTURE", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-07-07", jatuhTempo: "2027-07-07", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Portal religi Madinah (aktifkan tahun 2–3)",
    isiWebsite: "Wisata ziarah Madinah · sejarah Masjid Nabawi · panduan jamaah · jadwal kajian · paket ziarah",
    monetisasi: "Kolaborasi travel arofahajj.com · AdSense religi · produk perlengkapan ibadah",
    potensiRp: 3000000, urutan: 18,
  },
  {
    nama: "arofahajj.com", tier: "FUTURE", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-03-08", jatuhTempo: "2027-03-08", hargaPerpanjangan: 215000, autoKredit: false,
    kategori: "UMRAH", peran: "Flagship travel umrah — kuartal emas",
    isiWebsite: "Paket umrah reguler & plus (3 tier harga) · itinerary detail · kajian pendamping · galeri jamaah · form daftar + WA · kelas manasik online",
    monetisasi: "Paket umrah Rp 25–35jt/pax (margin 3–5jt) · kelas manasik premium · produk perlengkapan umrah · retainer grup korporat",
    potensiRp: 30000000, urutan: 19,
  },
  {
    nama: "gohajj.web.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-10-20", jatuhTempo: "2027-10-20", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Funnel promo 'Go Hajj' — pintu cepat umrah",
    isiWebsite: "Satu halaman promo umrah: harga spesial terbatas · jadwal keberangkatan · 5 testimoni jamaah · CTA WA langsung → arus ke arofahajj.com",
    monetisasi: "Konversi pendaftaran paket (margin per pax) · follow-up email/WA otomatis · retargeting iklan murah",
    potensiRp: 5000000, urutan: 34,
  },
  {
    nama: "solusibaitullah.web.id", tier: "FUTURE", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-08-02", jatuhTempo: "2027-08-02", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Funnel 'solusi perjalanan ibadah'",
    isiWebsite: "Quiz 'kamu siap umrah?' · kalkulator tabungan umrah · artikel panduan · CTA paket Arofa Hajj",
    monetisasi: "Funnel leads jamaah → Arofa Hajj · e-book persiapan umrah Rp 99rb · affiliate perlengkapan ibadah",
    potensiRp: 5000000, urutan: 20,
  },
  {
    nama: "medinagov.web.id", tier: "FUTURE", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-07-28", jatuhTempo: "2027-07-28", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Direktori layanan jamaah Madinah (tahun 2–3)",
    isiWebsite: "Direktori layanan jamaah di Madinah: hotel halal, makanan Indonesia, transportasi, guide lokal",
    monetisasi: "Listing hotel premium · komisi booking · iklan jasa pendamping jamaah",
    potensiRp: 2500000, urutan: 21,
  },
  {
    nama: "suarasufi.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-07-07", jatuhTempo: "2027-07-07", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Media sufi — wirid, tazkiyah, podcast",
    isiWebsite: "Kumpulan wirid & dzikir · tazkiyatun nafs · podcast sufi (Spotify embed) · kutipan harian · kajian rekaman",
    monetisasi: "AdSense · donasi · kelas spiritual online · affiliate buku tasawuf",
    potensiRp: 2000000, urutan: 41,
  },
  {
    nama: "jiwaabdicinta.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-06-05", jatuhTempo: "2027-06-05", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Sastra spiritual — esai & syair jiwa",
    isiWebsite: "Esai & syair jiwa · kelas menulis spiritual · newsletter mingguan · forum diskusi pembaca",
    monetisasi: "AdSense · e-book antologi Rp 49rb · kelas menulis Rp 250rb · donasi pembaca",
    potensiRp: 1500000, urutan: 39,
  },
  {
    nama: "enya.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-07-07", jatuhTempo: "2027-07-07", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Konten sholawat & lagu rohani",
    isiWebsite: "Katalog sholawat (lirik + audio) · playlist tematik · request lagu · kolaborasi qori & artis rohani",
    monetisasi: "AdSense musik · lisensi audio ke kreator konten · jasa produksi sholawat custom Rp 1,5jt · donasi",
    potensiRp: 1500000, urutan: 30,
  },
  {
    nama: "enyanyahwa.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-08-14", jatuhTempo: "2027-08-14", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Pasangan enya.web.id — musik rohani Indonesia",
    isiWebsite: "Katalog nyanyian rohani · video klip · lirik · konser mini online",
    monetisasi: "AdSense web + YouTube · merch kaos lirik · donasi · lisensi lagu",
    potensiRp: 1500000, urutan: 31,
  },
  {
    nama: "alhwda.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-09-04", jatuhTempo: "2027-09-04", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Al-Hawda — pendidikan tahfidz Al-Quran",
    isiWebsite: "Program tahfidz online · profil guru & metode · biaya transparan · pendaftaran · artikel tips hafalan · tes imla' gratis",
    monetisasi: "Les tahfidz online Rp 200rb/bln per santri · kelas intensif liburan · jual buku panduan · donasi program beasiswa",
    potensiRp: 2000000, urutan: 40,
  },
  {
    nama: "santriangon.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-07-29", jatuhTempo: "2027-07-29", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Komunitas Santri Angon — kelas & gerakan santri masa kini",
    isiWebsite: "Profil komunitas · kelas online santri (coding & bisnis) · artikel · agenda event · galeri · pendaftaran anggota",
    monetisasi: "Iuran komunitas Rp 50rb/bln · kelas coding/bisnis santri Rp 350rb · merch kaos Angon · sponsor event",
    potensiRp: 2500000, urutan: 42,
  },
  {
    nama: "gorefleksi.web.id", tier: "GATEWAY", status: "PLAN", regStatus: "AKTIF",
    berakhir: "2027-10-20", jatuhTempo: "2027-10-20", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Jurnal refleksi harian digital (freemium)",
    isiWebsite: "Landing app jurnal islami: prompt refleksi harian · pelacak amal · kutipan · versi web gratis → unduh app",
    monetisasi: "Premium Rp 25rb/bln (export PDF, tema, statistik) · AdSense blog refleksi · paket mindfulness korporat",
    potensiRp: 2000000, urutan: 43,
  },
  {
    nama: "mehudi.or.id", tier: "PARKED", status: "CEK", regStatus: "MENUNGGU",
    berakhir: "", jatuhTempo: "2026-09-06", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "UMRAH", peran: "Yayasan MeHUDi — Media Hikmah & Dakwah (bayar tagihan!)",
    isiWebsite: "Profil yayasan · program dakwah & pendidikan · laporan keuangan transparan · form donasi · jadwal kajian",
    monetisasi: "Donasi zakat-infaq-sadaqah · sponsor kajian · kolaborasi merchant halal",
    potensiRp: 3000000, catatan: "Tagihan belum dibayar — jatuh tempo 6 Sep 2026. Bayar atau rilis!",
    urutan: 23,
  },
  {
    nama: "165.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-07-07", jatuhTempo: "2027-07-07", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "Brand '165' — direktori layanan & nomor penting",
    isiWebsite: "Direktori layanan penting & UMKM berkode 165 · hotline komunitas · tips digital harian singkat",
    monetisasi: "AdSense · listing premium UMKM Rp 100rb/thn · funnel jasa mini-website ke juraganwebsite",
    potensiRp: 1500000, urutan: 24,
  },
  {
    nama: "fk165.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-08-14", jatuhTempo: "2027-08-14", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "Forum Komunikasi 165 — komunitas",
    isiWebsite: "Forum diskusi komunitas 165 · agenda · galeri · daftar anggota · marketplace antar-anggota",
    monetisasi: "Iuran forum · iklan banner anggota · sponsor event komunitas",
    potensiRp: 1000000, urutan: 25,
  },
  {
    nama: "dara.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-08-16", jatuhTempo: "2027-08-16", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "Media kesehatan ibu & anak (CPC tinggi)",
    isiWebsite: "Artikel kehamilan, ASI & tumbuh kembang · kolaborasi dr. Fatri Idana · kalkulator HPL & IMT · forum ibu",
    monetisasi: "AdSense kesehatan (CPC premium) · affiliate produk ibu-bayi · referral telekonsul · artikel sponsored produk aman",
    potensiRp: 3000000, urutan: 26,
  },
  {
    nama: "evo.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-08-16", jatuhTempo: "2027-08-16", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "Media otomotif & gadget 'EVOlusi'",
    isiWebsite: "Review motor, mobil & gadget · berita otomotif · tips membeli · kalkulator cicilan · embed video review",
    monetisasi: "AdSense otomotif CPC tinggi · affiliate aksesoris marketplace · leads test drive ke dealer · review sponsored",
    potensiRp: 3000000, urutan: 27,
  },
  {
    nama: "sgl.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-09-04", jatuhTempo: "2027-09-04", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "SGL — Sports, Games, Lifestyle",
    isiWebsite: "Berita olahraga lokal · tips game · gaya hidup sehat · jadwal pertandingan · esports update",
    monetisasi: "AdSense sports/gaming · affiliate jersey & gadget · slot banner tim komunitas",
    potensiRp: 2000000, urutan: 28,
  },
  {
    nama: "gaa.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-07-07", jatuhTempo: "2027-07-07", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "GAA — Gerak, Analisis, Aksi (analisis 3 menit)",
    isiWebsite: "Analisis tren singkat 3 menit baca: bisnis, teknologi, sosial · infografis · ringkasan laporan",
    monetisasi: "AdSense · newsletter premium Rp 30rb/bln · jasa riset mini untuk UMKM",
    potensiRp: 2000000, urutan: 29,
  },
  {
    nama: "telegroup.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-07-07", jatuhTempo: "2027-07-07", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "💎 GEM — Direktori Grup Telegram Indonesia",
    isiWebsite: "Katalog grup Telegram per kategori (kerja, belajar, belanja, komunitas) · rating · submit grup · trending mingguan",
    monetisasi: "Slot promote grup Rp 100rb/hari · submit premium Rp 25rb · AdSense · jasa buat & kelola grup Telegram",
    potensiRp: 5000000, urutan: 32,
  },
  {
    nama: "duasamudra.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-08-14", jatuhTempo: "2027-08-14", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "MEDIA", peran: "Dua Samudra — maritim & pariwisata bahari",
    isiWebsite: "Wisata bahari dua samudra · budaya pesisir · produk laut · panduan diving & memancing",
    monetisasi: "AdSense travel-bahari · komisi paket diving/snorkeling · affiliate peralatan laut",
    potensiRp: 2000000, urutan: 33,
  },
  {
    nama: "semestaperdana.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-09-05", jatuhTempo: "2027-09-05", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "JASA", peran: "Semesta Perdana — properti & villa premium",
    isiWebsite: "Listing villa & rumah sewa/beli · virtual tour · kalkulator KPR · artikel investasi properti · kontak agen WA",
    monetisasi: "Listing premium Rp 200rb/bln · komisi sewa (5%) · iklan developer · afiliasi KPR",
    potensiRp: 5000000, urutan: 35,
  },
  {
    nama: "sindogroups.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-08-14", jatuhTempo: "2027-08-14", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "AGENCY", peran: "Holding komunitas bisnis Sindo Groups",
    isiWebsite: "Profil grup · unit bisnis anggota · program kemitraan · berita grup · form pendaftaran mitra",
    monetisasi: "Biaya kemitraan Rp 1jt · iklan anggota · funnel jasa ke Digiman",
    potensiRp: 2000000, urutan: 36,
  },
  {
    nama: "muhdin.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-09-04", jatuhTempo: "2027-09-04", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "PERSONAL", peran: "Personal brand profesional — CV digital",
    isiWebsite: "CV digital · portofolio proyek · artikel keahlian · kontak profesional",
    monetisasi: "Jasa freelance sesuai keahlian · funnel peluang karier · AdSense ringan",
    potensiRp: 1000000, urutan: 37,
  },
  {
    nama: "dr-fatriidana.my.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-04-07", jatuhTempo: "2027-04-07", hargaPerpanjangan: 30000, autoKredit: false,
    kategori: "PERSONAL", peran: "Personal brand dokter — kesehatan terverifikasi",
    isiWebsite: "Profil & spesialisasi · artikel kesehatan terverifikasi dokter · jadwal praktik · booking telekonsul · FAQ pasien",
    monetisasi: "Telekonsul Rp 100rb/session · AdSense kesehatan · webinar kesehatan Rp 50rb · kolaborasi dara.web.id",
    potensiRp: 2500000, urutan: 38,
  },
  {
    nama: "bambuwater.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-10-06", jatuhTempo: "2027-10-06", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "PRODUK", peran: "Bambu Water — air mineral sumber alam",
    isiWebsite: "Cerita brand air 'Bambu Water' · katalog produk · profil sumber mata air · program mitra distributor · custom label korporat",
    monetisasi: "Penjualan kemasan · mitra depot per kota · sponsorship event alam · pre-order korporat custom label",
    potensiRp: 8000000, urutan: 44,
  },
  {
    nama: "degerasia.web.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-10-08", jatuhTempo: "2027-10-08", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "PRODUK", peran: "De Ger Asia — produk & kuliner Asia",
    isiWebsite: "Katalog produk Asia (makanan, herbal, teh) · resep · cerita asal produk · grosir & retail",
    monetisasi: "Retail margin 30% · grosir B2B · dropship reseller · affiliate",
    potensiRp: 4000000, urutan: 45,
  },
  {
    nama: "mesita.id", tier: "PARKED", status: "PARK", regStatus: "AKTIF",
    berakhir: "2027-06-06", jatuhTempo: "2027-06-06", hargaPerpanjangan: 250000, autoKredit: false,
    kategori: "PRODUK", peran: "Mesita — brand F&B (meja santap)",
    isiWebsite: "Katalog menu/produk makanan kemasan · cerita dapur · pemesanan online · program kemitraan franchise",
    monetisasi: "Penjualan F&B · paket katering · lisensi kemitraan Rp 15jt · merchandise",
    potensiRp: 6000000, urutan: 46,
  },
  {
    nama: "juragankompresor.web.id", tier: "GATEWAY", status: "CEK", regStatus: "MENUNGGU",
    berakhir: "", jatuhTempo: "2027-10-07", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "JASA", peran: "Juragan Kompresor — jual, servis & sewa (bayar tagihan!)",
    isiWebsite: "Katalog kompresor (Piston/Screw 1–100 hp) · servis & sparepart · sewa harian-mingguan · kalkulator CFM · penawaran WA",
    monetisasi: "Penjualan kompresor margin 10–15% (unit jutaan) · kontrak servis pabrik · rental harian Rp 750rb · jual sparepart",
    potensiRp: 10000000, catatan: "Tagihan belum dibayar. Bayar → domain langsung aman.",
    urutan: 47,
  },
  {
    nama: "gopijat.web.id", tier: "GATEWAY", status: "CEK", regStatus: "MENUNGGU",
    berakhir: "", jatuhTempo: "2027-10-20", hargaPerpanjangan: 55000, autoKredit: false,
    kategori: "JASA", peran: "Go Pijat — platform booking terapis (bayar tagihan!)",
    isiWebsite: "Direktori terapis terverifikasi per kota · booking WA 1 klik · rating & ulasan · layanan (pijat tradisional, urut, prenatal) · jadi mitra terapis",
    monetisasi: "Komisi booking Rp 15rb/booking · listing premium terapis Rp 50rb/bln · iklan produk kesehatan",
    potensiRp: 4000000, catatan: "Tagihan belum dibayar. Tandem dengan gorefleksi.web.id = ekosistem 'Go Therapy'.",
    urutan: 48,
  },
];

async function main() {
  console.log(`🌱 Seed Domain Money Engine — ${DATA.length} domain (force=${FORCE})`);
  let added = 0, updated = 0;
  for (const d of DATA) {
    const existing = await db.domain.findUnique({ where: { nama: d.nama } });
    if (!existing) {
      await db.domain.create({ data: d });
      added++;
      continue;
    }
    // Domain sudah ada: update data registrar selalu; blueprint hanya bila kosong / --force
    const data: Record<string, unknown> = {
      regStatus: d.regStatus,
      berakhir: d.berakhir,
      jatuhTempo: d.jatuhTempo,
      hargaPerpanjangan: d.hargaPerpanjangan,
      autoKredit: d.autoKredit,
      kategori: d.kategori,
      peran: d.peran,
      tier: d.tier,
      status: d.status,
      urutan: d.urutan,
    };
    if (FORCE || !existing.isiWebsite) data.isiWebsite = d.isiWebsite;
    if (FORCE || !existing.monetisasi) data.monetisasi = d.monetisasi;
    if (FORCE || !existing.potensiRp) data.potensiRp = d.potensiRp;
    if (d.catatan) data.catatan = d.catatan;
    await db.domain.update({ where: { nama: d.nama }, data });
    updated++;
  }
  const total = await db.domain.count();
  console.log(`✅ Selesai — baru: ${added}, diperbarui: ${updated}, total domain: ${total}`);
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
