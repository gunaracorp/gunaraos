"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v7.0 — SEO MASTERY · AKADEMI SEO
// Masterclass statis 12 bab (kurikulum + rumus emas) dan Checklist
// 100 Langkah dengan progres tersimpan di localStorage. Zero API.
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  GraduationCap,
  BookOpen,
  Search,
  Network,
  PenLine,
  Award,
  Wrench,
  Gauge,
  Link2,
  MapPin,
  Sparkles,
  BarChart3,
  Bot,
  ListChecks,
  RotateCcw,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { FadeUp } from "../motion";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ── Tipe & data kurikulum ────────────────────────────────────────── */

interface Bab {
  icon: LucideIcon;
  judul: string;
  intro: string[];
  checklist: string[];
  rumus: string;
}

const BAB_LIST: Bab[] = [
  {
    icon: BookOpen,
    judul: "Fundamental & Cara Kerja Google",
    intro: [
      "Google bekerja tiga tahap: crawl (bot menemukan URL lewat link & sitemap), index (halaman dipahami lalu disimpan), dan rank (diurutkan untuk tiap query). Yang diranking bukan situs, tapi halaman — dan posisinya ditentukan relevansi, otoritas, serta pengalaman pengguna.",
      "E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) adalah lensa kualitas yang dipakai quality rater & algoritma untuk menilai halamanmu — terutama topik yang menyentuh uang dan kesehatan.",
    ],
    checklist: [
      "Pastikan halaman penting bisa di-crawl: tidak diblokir robots.txt dan tidak noindex",
      "Submit sitemap.xml ke Google Search Console",
      "Cek cakupan indeks: cari “site:domainmu.com” dan bandingkan dengan jumlah halaman asli",
      "Bangun halaman About & kontak yang jelas sebagai sinyal trust",
      "Cantumkan penulis dengan kredensial nyata di setiap artikel",
      "Perbaiki error 4xx/5xx yang muncul di Coverage Report GSC",
    ],
    rumus:
      "Relevansi × Otoritas × Pengalaman = Peringkat. Optimalkan dulu satu-satunya yang bisa kamu kendalikan penuh hari ini: relevansi halaman terhadap satu intent yang spesifik.",
  },
  {
    icon: Search,
    judul: "Riset Keyword",
    intro: [
      "Keyword adalah jembatan antara yang diketik orang dan halamanmu. Bedakan empat intent: informational (mau tahu), navigational (mau ke tempat), commercial (mau membandingkan), transactional (mau beli) — masing-masing butuh jenis halaman berbeda.",
      "Long-tail (3+ kata) volumenya kecil tapi konversinya tinggi dan persaingannya rendah. Keyword gap adalah kata yang membuat kompetitor dapat traffic — tapi kamu tidak.",
    ],
    checklist: [
      "Daftar 10–20 seed keyword dari bahasa asli pelanggan, bukan jargon internal",
      "Klasifikasikan tiap keyword ke 4 intent sebelum menulis satu baris konten",
      "Prioritaskan long-tail ber-difficulty rendah untuk situs muda",
      "Analisis 3 kompetitor utama: temukan keyword yang mereka menang, kamu tidak (gap)",
      "Kelompokkan keyword per cluster topik — satu cluster dirancang untuk satu halaman",
      "Cek SERP asli tiap keyword: yang muncul blog, produk, atau video?",
    ],
    rumus:
      "Satu intent = satu halaman = satu keyword utama. Memburu dua intent dalam satu halaman adalah cara termudah untuk gagal di keduanya.",
  },
  {
    icon: Network,
    judul: "Arsitektur Situs & Internal Link",
    intro: [
      "Struktur situs menentukan bagaimana otoritas mengalir dan bagaimana Google memahami hubungan antar topik. Pola silo: homepage → kategori → sub-topik → artikel, dengan link mengalir turun dan menyamping dalam silo yang sama.",
      "Halaman orphan (tanpa link internal masuk) nyaris tidak pernah rank. Halaman paling penting harus tercapai dalam maksimal 3 klik dari homepage.",
    ],
    checklist: [
      "Gambar struktur situs saat ini — tandai halaman yang lebih dari 3 klik dari home",
      "Temukan halaman orphan (crawler/GSC) lalu beri link internal masuk",
      "Bangun silo per cluster: pillar page link ke semua artikel cluster, dan sebaliknya",
      "Gunakan anchor text deskriptif — hindari “klik di sini”",
      "Batasi navigasi utama maksimal 7 item",
      "Perbaiki link internal rusak dan redirect berantai",
    ],
    rumus:
      "Halaman yang paling banyak menerima link internal adalah halaman yang kamu nyatakan paling penting. Pastikan itu benar-benar halaman uangmu.",
  },
  {
    icon: PenLine,
    judul: "On-Page Mastery",
    intro: [
      "On-page adalah sinyal yang kamu kendalikan 100%. Title tag masih faktor ranking kuat: formula aman = Keyword Utama – Manfaat – Brand, 50–60 karakter. Satu H1 per halaman berisi keyword utama; H2/H3 memecah sub-topik dan menampung varian LSI (kata terkait secara semantik).",
      "Featured snippet dikejar dengan jawaban langsung 40–60 kata, tepat di bawah heading pertanyaan — formatnya paragraf, list bernomor, atau tabel.",
    ],
    checklist: [
      "Tulis title dengan formula [Keyword] – [Manfaat Nyata] – [Brand], maksimal 60 karakter",
      "Meta description 150–155 karakter dengan ajakan — bukan hasil salin isi halaman",
      "Pastikan satu H1 dan keyword utama hadir di 100 kata pertama",
      "Sebar varian LSI & sinonim secara alami — tanpa keyword stuffing",
      "Format jawaban potensi-snippet: paragraf 40–60 kata, list bernomor, atau tabel",
      "Tambahkan 3–5 internal link per artikel ke halaman cluster lain",
    ],
    rumus:
      "Jawab pertanyaan pembaca di 100 kata pertama, lalu perdalam. Google menghargai halaman yang langsung ke inti — pembaca pun sama.",
  },
  {
    icon: Award,
    judul: "Konten E-E-A-T & Topical Authority",
    intro: [
      "Topical authority = mesin mengenalmu sebagai rujukan satu topik. Dibangun dengan content hub: satu pillar page komprehensif + 10–20 artikel pendukung yang saling terhubung.",
      "Konten tanpa pengalaman nyata kalah oleh konten yang menunjukkan foto asli, data sendiri, dan opini praktisi. Jadwalkan update: konten lama yang diperbarui sering naik lebih cepat daripada konten baru.",
    ],
    checklist: [
      "Tentukan 3–5 topik inti; buat pillar page untuk masing-masing",
      "Siapkan minimal 10 artikel pendukung per pillar sebelum melompat topik",
      "Tambahkan bukti pengalaman: screenshot, foto kerja, data internal, studi kasus",
      "Cantumkan penulis + bio kredibel + link profil profesional di tiap artikel",
      "Jadwalkan audit konten 6 bulanan: update, merge, atau hapus halaman lemah",
      "Perbarui tahun dan data usang; tambahkan bagian “Update [tahun]” bila relevan",
    ],
    rumus:
      "10 artikel yang saling terhubung dalam satu topik mengalahkan 100 artikel yang tersebar. Kedalaman mengalahkan lebar.",
  },
  {
    icon: Wrench,
    judul: "Technical SEO",
    intro: [
      "Technical SEO memastikan mesin bisa merayapi, memahami, dan merender halamanmu tanpa hambatan: sitemap.xml mendata URL penting, robots.txt mengatur akses crawl, canonical mencegah duplikat, hreflang menyajikan bahasa yang tepat ke audiens yang tepat.",
      "Log file membuka fakta paling jujur: crawl budget kamu benar-benar dipakai untuk halaman mana.",
    ],
    checklist: [
      "Pastikan hanya satu versi situs live — redirect 301 www/non-www dan http→https",
      "Sitemap.xml ter-update otomatis dan hanya berisi URL canonical berstatus 200",
      "robots.txt tidak memblokir CSS/JS — Google perlu merender halaman penuh",
      "Pasang canonical self-referencing di semua halaman indeks",
      "Situs multi-bahasa: pasang hreflang yang benar (id, en, x-default)",
      "Tinjau log file bulanan: URL yang paling di-crawl vs URL yang paling penting",
    ],
    rumus:
      "Crawl budget adalah dompet Google di situsmu. Jangan biarkan habis untuk halaman filter, tag, dan hasil pencarian internal.",
  },
  {
    icon: Gauge,
    judul: "Core Web Vitals",
    intro: [
      "CWV mengukur pengalaman nyata: LCP (elemen terbesar tampil dalam <2,5 detik), INP (respons interaksi <200 ms), CLS (stabilitas layout <0,1). LCP buruk paling sering disebabkan gambar hero berat tanpa preload dan font yang memblokir render.",
      "INP biasanya terserang JavaScript pihak ketiga dan handler berat. CLS datang dari gambar/iklan tanpa dimensi dan font swap.",
    ],
    checklist: [
      "Ukur dengan PageSpeed Insights + field data CrUX; catat 3 metrik per halaman kunci",
      "Preload gambar hero LCP dan tambahkan fetchpriority=\"high\" pada <img> LCP",
      "Kompres semua gambar ke WebP/AVIF dengan ukuran sesuai lebar kontainernya",
      "Lazy-load gambar & iframe di bawah lipatan (loading=\"lazy\") — jangan pada elemen LCP",
      "Tambahkan width/height atau aspect-ratio pada semua media (anti CLS)",
      "Defer skrip pihak ketiga: chat widget, pixel iklan, heatmap",
    ],
    rumus:
      "LCP = 60% kemenangan CWV. Satu gambar hero yang dioptimalkan sering menaikkan skor lebih banyak daripada sebulan refactoring JavaScript.",
  },
  {
    icon: Link2,
    judul: "Link Building Etis",
    intro: [
      "Backlink tetap salah satu sinyal ranking terkuat — tapi kualitas mengalahkan kuantitas. Digital PR (data unik, survei, cerita berita) mendatangkan link editorial alami; broken link building menawarkan pengganti yang berguna; guest post relevan masih bekerja bila isinya benar-benar bernilai.",
      "Hindari jaringan PBN murahan dan link gratis dari situs judi/pinjol — itu racun jangka panjang yang berbalas dendam.",
    ],
    checklist: [
      "Buat satu aset linkable per kuartal: riset data, infografis, atau tools gratis",
      "Susun daftar 20 media/blog industri + kontak editor; pitch dengan data, bukan permintaan",
      "Temukan broken link di situs referensi; tawarkan halamanmu sebagai pengganti",
      "Klaim unlinked mention: cari nama brand tanpa link, minta disisipkan",
      "Audit profil backlink 3 bulanan; tolak link toxic via disavow bila perlu",
      "Diversifikasi anchor: ±60% brand/natural, 30% partial match, 10% exact match",
    ],
    rumus:
      "Link yang bisa kamu beli murah hari ini adalah link yang bisa dicabut algoritma besok. Bangun yang layak dikutip, bukan yang harus dibeli.",
  },
  {
    icon: MapPin,
    judul: "Local SEO",
    intro: [
      "Untuk bisnis lokal, paket 3-map di Google sering lebih berharga daripada posisi #1 organik. Fondasinya: Google Business Profile yang optimal, NAP (Name-Address-Phone) konsisten di seluruh web, dan aliran review yang stabil.",
      "Citation (direktori lokal) memberi sinyal kepercayaan lokasi yang memperkuat posisi map.",
    ],
    checklist: [
      "Klaim & verifikasi Google Business Profile; pilih kategori utama paling spesifik",
      "Samakan NAP 100% di website, GBP, dan semua direktori",
      "Minta review sistematis: 3 hari setelah transaksi via WA dengan link langsung",
      "Balas semua review (positif & negatif) maksimal 2×24 jam, sebutkan layanannya",
      "Posting update/foto di GBP minimal 2× per bulan",
      "Bangun halaman lokasi/layanan per kota dengan konten unik — bukan template copy-paste",
    ],
    rumus:
      "Review adalah ranking factor yang bisa kamu minta langsung. Satu review per bulan yang konsisten mengalahkan 20 review sekaligus lalu senyap.",
  },
  {
    icon: Sparkles,
    judul: "Rich Results & Schema",
    intro: [
      "Schema JSON-LD adalah kosakata resmi untuk menjelaskan konten ke mesin — membuka rich results: bintang rating, FAQ dropdown, breadcrumb, harga produk. Implementasikan lewat JSON-LD di <head>, lalu validasi dengan Rich Results Test.",
      "Schema bukan jaminan tampil — tapi tanpa schema, kamu tidak bisa tampil sama sekali.",
    ],
    checklist: [
      "Pasang schema Organization + WebSite di seluruh situs",
      "Tambahkan schema Article (headline, author, datePublished, image) di blog",
      "Produk: schema Product lengkap dengan offers, price, dan availability",
      "Bisnis lokal: LocalBusiness + aggregateRating (data nyata, bukan karangan)",
      "FAQ schema hanya untuk FAQ asli yang terlihat di halaman",
      "Validasi tiap deployment dengan Rich Results Test & validator schema.org",
    ],
    rumus:
      "Schema adalah lampu toko di malam hari: tidak menarik pembeli baru, tapi membuatmu terlihat oleh yang sedang lewat.",
  },
  {
    icon: BarChart3,
    judul: "Analitik & Pelaporan",
    intro: [
      "SEO tanpa pengukuran adalah karangan. Search Console adalah sumber kebenaran (impression, klik, posisi, query); GA4 menerangkan apa yang terjadi setelah klik (konversi, engagement).",
      "Dashboard mingguan satu halaman lebih berharga daripada laporan bulanan 40 halaman: tolok ukur kecil, keputusan cepat.",
    ],
    checklist: [
      "Hubungkan GSC + GA4; pastikan konversi utama (form, WA, telepon) terlacak",
      "Cek GSC mingguan: query naik-turun, halaman bercetak CTR rendah",
      "Perbaiki dulu halaman impression tinggi + CTR <2% — murah, hasil cepat",
      "Catat posisi 10 keyword prioritas tiap minggu — lihat tren, bukan titik",
      "Buat dashboard 1 halaman: klik, konversi, posisi rata-rata, halaman naik/turun",
      "Uji A/B title tag pada halaman CTR rendah dan catat hasilnya",
    ],
    rumus:
      "Impression tinggi + CTR rendah = uang yang tertinggal di meja. Perbaiki title & meta description dulu sebelum membangun link baru.",
  },
  {
    icon: Bot,
    judul: "SEO untuk AI Era",
    intro: [
      "AI Overviews, ChatGPT, dan Perplexity mengubah cara orang menemukan informasi — dari daftar 10 link biru menjadi satu jawaban. GEO (Generative Engine Optimization) / AIO adalah praktik agar brandmu dikutip dalam jawaban AI: konten yang jelas, data yang bisa dikutip, dan otoritas yang terverifikasi.",
      "Brand mention di media terpercaya kini menjadi sinyal SEO sekaligus sumber jawaban AI engine.",
    ],
    checklist: [
      "Uji brandmu di ChatGPT/Perplexity: apakah muncul untuk query industri?",
      "Sajikan data unik & statistik yang mudah dikutip — AI menyukai angka dengan sumber",
      "Tulis definisi & jawaban langsung di awal bagian — format yang dicomot AI",
      "Perkuat kehadiran di sumber yang sering dikutip: Wikipedia, media berita, forum niche",
      "Bangun halaman profil penulis yang kuat — AI memprioritaskan entitas terverifikasi",
      "Pantau referral dari AI engine di GA4 sebagai channel tersendiri",
    ],
    rumus:
      "Di era AI, kontenmu tidak bersaing untuk diklik — tapi untuk dikutip. Jadikan setiap artikel sumber yang tidak bisa dihindari AI.",
  },
];

/* ── Data checklist 100 langkah (10 kategori × 10 item) ───────────── */

const CHECKLIST: { nama: string; items: string[] }[] = [
  {
    nama: "Teknis",
    items: [
      "Sitemap.xml aktif dan ter-submit di Search Console",
      "robots.txt tidak memblokir halaman penting maupun aset CSS/JS",
      "Semua varian domain redirect 301 ke satu versi canonical",
      "HTTPS aktif di seluruh situs tanpa mixed content",
      "Canonical tag self-referencing di semua halaman indeks",
      "Tidak ada halaman penting dengan meta robots noindex",
      "Struktur URL pendek, deskriptif, tanpa parameter sampah",
      "Breadcrumb tampil di halaman dalam dan berisi schema BreadcrumbList",
      "Halaman 404 custom dengan link kembali ke konten utama",
      "Redirect berantai (chain) sudah dirapikan menjadi satu lompatan",
    ],
  },
  {
    nama: "On-Page",
    items: [
      "Setiap halaman punya title tag unik maksimal 60 karakter",
      "Meta description unik 150–155 karakter dengan ajakan",
      "Satu H1 per halaman berisi keyword utama",
      "Keyword utama muncul di 100 kata pertama konten",
      "Heading H2/H3 mengandung varian keyword & pertanyaan terkait",
      "Anchor text internal deskriptif, bukan “klik di sini”",
      "Semua gambar punya alt text deskriptif (bukan nama file mentah)",
      "URL canonical benar pada versi filter/sortir/paginasi",
      "Tidak ada keyword stuffing — densitas tetap natural",
      "Setiap artikel punya 3–5 internal link ke konten cluster",
    ],
  },
  {
    nama: "Konten",
    items: [
      "Satu pillar page komprehensif untuk setiap topik inti",
      "Minimal 10 artikel pendukung per cluster, terhubung ke pillar",
      "Setiap artikel menjawab intent spesifik sejak paragraf awal",
      "Konten menampilkan pengalaman nyata: foto, data, studi kasus",
      "Penulis dengan bio & kredensial tercantum di tiap artikel",
      "Audit konten 6 bulan berjalan: update, merge, atau hapus",
      "Tanggal dan data usang sudah diperbarui",
      "Tidak ada halaman thin content (<300 kata tanpa nilai)",
      "Bagian FAQ akhir artikel menjawab “People Also Ask”",
      "CTA jelas di akhir setiap konten — bukan sekadar informasi",
    ],
  },
  {
    nama: "Keyword",
    items: [
      "10–20 seed keyword dikumpulkan dari bahasa asli pelanggan",
      "Tiap keyword dipetakan ke intent (informatif/komersial/transaksional)",
      "Daftar long-tail ber-difficulty rendah siap diserang dulu",
      "Analisis keyword gap dari 3 kompetitor utama selesai",
      "Keyword dipetakan ke halaman spesifik (tidak saling kanibal)",
      "Tidak ada dua halaman menargetkan keyword utama yang sama",
      "Prioritas = volume × difficulty × nilai bisnis, bukan volume saja",
      "SERP tiap keyword dicek manual sebelum produksi konten",
      "Cluster keyword terdokumentasi di satu sheet/kanban",
      "Keyword musiman dipetakan ke kalender konten",
    ],
  },
  {
    nama: "UX",
    items: [
      "Menu utama maksimal 7 item, jelas dan tidak tumpang tindih",
      "CTA utama terlihat tanpa scroll (above the fold)",
      "Form kontak pendek — hanya field yang benar-benar perlu",
      "Font minimal 16px di mobile dengan kontras teks memadai",
      "Tidak ada popup interstitial yang menutupi konten saat masuk",
      "Pencarian internal tersedia untuk situs dengan >30 halaman",
      "Link jelas berbeda dari teks biasa (warna/underline)",
      "Whitespace & hierarki visual memudahkan pemindaian cepat",
      "Halaman penting tercapai maksimal 3 klik dari homepage",
      "Feedback visual instan saat tombol/link ditekan",
    ],
  },
  {
    nama: "Local",
    items: [
      "Google Business Profile terklaim dan terverifikasi",
      "Kategori GBP utama memakai pilihan paling spesifik",
      "NAP konsisten identik di website, GBP, dan semua direktori",
      "Proses permintaan review berjalan otomatis (WA/email)",
      "Semua review dibalas maksimal 2×24 jam",
      "Foto bisnis terbaru diunggah minimal 2× per bulan",
      "Citation aktif di 10 direktori lokal utama",
      "Halaman lokasi/layanan per kota berisi konten unik",
      "Schema LocalBusiness lengkap: alamat, telepon, jam buka",
      "Peta Google ter-embed di halaman kontak",
    ],
  },
  {
    nama: "Backlink",
    items: [
      "Profil backlink diaudit 3 bulanan, link toxic ditandai",
      "Satu aset linkable (riset data/tools/infografis) per kuartal",
      "Daftar 20 target media & blog industri siap dipitch",
      "Unlinked brand mention dicari dan dikonversi jadi link",
      "Anchor text terdiversifikasi — mayoritas brand/natural",
      "Tidak ada link dari situs judi/pinjol/porn atau PBN murahan",
      "Backlink kompetitor top-5 sudah dipetakan dan dikejar",
      "Guest post hanya di situs relevan dengan trafik nyata",
      "Broken link building berjalan rutin tiap bulan",
      "Kecepatan perolehan link terlihat natural (tanpa lonjakan curiga)",
    ],
  },
  {
    nama: "Analitik",
    items: [
      "GSC dan GA4 terhubung dan datanya valid",
      "Konversi utama (form/WA/telepon) terlacak di GA4",
      "Cek query GSC dilakukan setiap minggu",
      "Halaman impression tinggi + CTR rendah ditandai untuk perbaikan",
      "Posisi 10 keyword prioritas dicatat tiap minggu",
      "Dashboard 1 halaman: klik, konversi, posisi, halaman naik/turun",
      "Laporan bulanan berisi insight & keputusan, bukan sekadar angka",
      "A/B test title tag dijalankan pada halaman CTR rendah",
      "Trafik organik disegmentasikan per landing page/konversi",
      "Referral dari AI engine (Perplexity dkk.) mulai dipantau",
    ],
  },
  {
    nama: "Mobile",
    items: [
      "Desain mobile-first — konten identik dengan versi desktop",
      "Tap target minimal 44×44px dan tidak bertumpuk",
      "Tidak ada horizontal scroll di lebar layar 360px",
      "Teks dan tombol terbaca tanpa zoom",
      "Popup mobile tidak menutupi seluruh layar",
      "Gambar responsif (srcset) sesuai lebar layar",
      "Menu mobile mudah dijangkau satu jempol",
      "Nomor telepon & WA bisa diklik (link tel:/wa.me)",
      "Uji manual di perangkat Android kelas bawah",
      "Core Web Vitals mobile hijau di halaman kunci",
    ],
  },
  {
    nama: "Keamanan",
    items: [
      "Sertifikat SSL valid dan diperbarui otomatis",
      "Semua trafik http dipaksa ke https (HSTS)",
      "Area admin dilindungi password kuat + 2FA",
      "CMS, plugin, dan tema selalu versi terbaru",
      "Backup otomatis harian, tersimpan di lokasi terpisah",
      "Form memiliki proteksi spam (honeypot/turnstile)",
      "Malware scan terjadwal dan laporannya diperiksa",
      "Konten user-generated melewati moderasi",
      "Header keamanan dasar aktif (X-Frame-Options, CSP)",
      "Akun kreator konten memakai hak akses minimum",
    ],
  },
];

const CHECK_TOTAL = 100;
const LS_KEY = "gunara-seo-checklist";

/* ── Komponen utama ───────────────────────────────────────────────── */

export function SeoAcademySection() {
  const { toast } = useToast();

  /* Progres checklist — init {} lalu dimuat dari localStorage (anti hydration mismatch) */
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const celebratedRef = useRef(false);
  const initialTotalRef = useRef<number | null>(null);

  useEffect(() => {
    // Deferasinkron: hindari setState sinkron di body effect (cascading render)
    const t = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          const raw = window.localStorage.getItem(LS_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as Record<string, boolean>;
            if (parsed && typeof parsed === "object") {
              setChecked(parsed);
              initialTotalRef.current = Object.values(parsed).filter(Boolean).length;
            }
          }
        }
      } catch {
        /* localStorage diblokir / rusak — abaikan */
      }
      setLoaded(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const total = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  /* Toast perayaan sekali saat tepat mencapai 100 (bukan saat load sudah 100) */
  useEffect(() => {
    if (!loaded) return;
    if (
      total === CHECK_TOTAL &&
      !celebratedRef.current &&
      initialTotalRef.current !== CHECK_TOTAL
    ) {
      celebratedRef.current = true;
      toast({
        title: "🏆 100/100 — Komplit!",
        description:
          "Seluruh langkah SEO tertandai. Situsmu kini lebih solid dari 90% kompetitor di SERP.",
      });
    }
  }, [loaded, total, toast]);

  function toggle(key: string) {
    setChecked((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(LS_KEY, JSON.stringify(next));
        }
      } catch {
        /* penyimpanan penuh / diblokir — abaikan */
      }
      return next;
    });
  }

  function resetAll() {
    setChecked({});
    try {
      if (typeof window !== "undefined") window.localStorage.removeItem(LS_KEY);
    } catch {
      /* abaikan */
    }
    celebratedRef.current = false;
    initialTotalRef.current = 0;
    toast({ title: "Checklist direset", description: "Mulai serangan baru dari langkah 1." });
  }

  function catCount(ci: number): number {
    return CHECKLIST[ci].items.filter((_, ii) => checked[`${ci}-${ii}`]).length;
  }

  return (
    <div className="space-y-5">
      {/* ── Hero ── */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-950 via-[#1a231e] to-emerald-950 p-6 sm:p-8 text-emerald-50">
          <GraduationCap aria-hidden className="absolute -right-8 -top-10 size-56 opacity-[0.06]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/90">
            GUNARA OS v7.0 — SEO MASTERY
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-amber-100">
            🎓 Akademi SEO
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/80 leading-relaxed">
            Kurikulum master 12 bab — dari fundamental sampai era AI — plus checklist
            100 langkah lapangan. Progres checklistmu tersimpan otomatis di perangkat.
          </p>
        </div>
      </FadeUp>

      {/* ══════════ A · KURIKULUM MASTER ══════════ */}
      <FadeUp delay={0.05}>
        <Card className="rounded-xl">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="size-4 text-emerald-600" /> 🎓 Kurikulum Master
            </CardTitle>
            <CardDescription className="text-xs">
              12 bab padat — buka satu bab, kerjakan checklistnya, lanjut ke bab berikut.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-3">
            <Accordion type="single" collapsible className="w-full">
              {BAB_LIST.map((bab, i) => {
                const Icon = bab.icon;
                return (
                  <AccordionItem key={i} value={`bab-${i}`}>
                    <AccordionTrigger className="py-4 hover:no-underline">
                      <span className="flex min-w-0 items-center gap-3 text-left">
                        <span className="flex size-9 flex-none items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold">
                            {i + 1}. {bab.judul}
                          </span>
                          <span className="block text-[11px] font-normal text-muted-foreground">
                            {bab.checklist.length} langkah actionable
                          </span>
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pb-5">
                      {bab.intro.map((par, pi) => (
                        <p key={pi} className="text-[13px] leading-relaxed text-muted-foreground">
                          {par}
                        </p>
                      ))}
                      <ul className="list-disc space-y-1 pl-5">
                        {bab.checklist.map((c, ci) => (
                          <li key={ci} className="my-1 text-[13px] leading-relaxed">
                            {c}
                          </li>
                        ))}
                      </ul>
                      <div className="rounded border border-amber-400/40 bg-amber-400/5 p-3">
                        <p className="flex items-start gap-1.5 text-xs italic leading-relaxed text-amber-900 dark:text-amber-200">
                          <Zap className="mt-0.5 size-3.5 flex-none text-amber-500" aria-hidden />
                          <span>
                            <strong className="not-italic">⚡ Rumus Emas:</strong> {bab.rumus}
                          </span>
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      </FadeUp>

      {/* ══════════ B · CHECKLIST 100 LANGKAH ══════════ */}
      <FadeUp delay={0.1}>
        <Card className="rounded-xl">
          <CardHeader className="p-6 pb-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ListChecks className="size-4 text-emerald-600" /> ✅ Checklist 100 Langkah
                </CardTitle>
                <CardDescription className="mt-1 text-xs">
                  10 kategori × 10 langkah lapangan. Centangmu tersimpan di perangkat ini.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={resetAll}>
                <RotateCcw className="size-3.5 mr-1" /> Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-4">
            {/* Total progres */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <div className="flex items-baseline gap-1">
                <span
                  className={cn(
                    "text-4xl font-black tabular-nums",
                    total === CHECK_TOTAL
                      ? "text-amber-500"
                      : "text-emerald-700 dark:text-emerald-400"
                  )}
                >
                  {total}
                </span>
                <span className="text-lg font-bold text-muted-foreground">/100</span>
              </div>
              <div className="min-w-[160px] flex-1 space-y-1.5">
                <Progress
                  value={loaded ? (total / CHECK_TOTAL) * 100 : 0}
                  className="h-2.5"
                  aria-label={`Progres checklist ${total} dari 100`}
                />
                <p className="text-[11px] text-muted-foreground">
                  {total === CHECK_TOTAL
                    ? "🏆 Semua langkah dituntaskan — situsmu solid dari pondasi sampai kubah."
                    : total >= 70
                      ? "Kuat. Sisa langkah adalah pemolesan yang memisahkan #4 dari #1."
                      : total >= 30
                        ? "Fondasi mulai berdiri — jaga ritme centangnya."
                        : "Mulai dari kategori Teknis — dampaknya paling cepat terasa."}
                </p>
              </div>
            </div>

            {/* Tab kategori */}
            <Tabs defaultValue="0" className="w-full">
              <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
                {CHECKLIST.map((cat, ci) => {
                  const c = catCount(ci);
                  return (
                    <TabsTrigger
                      key={ci}
                      value={String(ci)}
                      className={cn(
                        "text-xs",
                        c === cat.items.length && "text-emerald-700 dark:text-emerald-400"
                      )}
                    >
                      {c === cat.items.length ? "✓ " : ""}
                      {cat.nama}
                      <span className="ml-1 tabular-nums text-muted-foreground">
                        {c}/{cat.items.length}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {CHECKLIST.map((cat, ci) => {
                const done = catCount(ci);
                return (
                  <TabsContent key={ci} value={String(ci)} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Progress
                        value={loaded ? (done / cat.items.length) * 100 : 0}
                        className="h-2"
                        aria-label={`Progres kategori ${cat.nama}: ${done} dari ${cat.items.length}`}
                      />
                      <span className="flex-none text-xs font-bold tabular-nums text-muted-foreground">
                        {done}/{cat.items.length}
                      </span>
                    </div>
                    <ul className="max-h-96 space-y-1.5 overflow-y-auto nice-scroll pr-1">
                      {cat.items.map((item, ii) => {
                        const key = `${ci}-${ii}`;
                        const on = !!checked[key];
                        return (
                          <li key={key}>
                            <label
                              className={cn(
                                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40",
                                on && "border-emerald-500/30 bg-emerald-500/5"
                              )}
                            >
                              <Checkbox
                                checked={on}
                                onCheckedChange={() => toggle(key)}
                                className="mt-0.5"
                                aria-label={item}
                              />
                              <span
                                className={cn(
                                  "text-[13px] leading-snug",
                                  on
                                    ? "text-muted-foreground line-through decoration-emerald-600/50"
                                    : "text-foreground"
                                )}
                              >
                                {item}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      </FadeUp>
    </div>
  );
}
