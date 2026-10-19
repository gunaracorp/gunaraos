"use client";

// ═══════════════════════════════════════════════════
// GUNARA OS — Tutorial Lengkap Semua Fitur
// Searchable · langkah bernomor · tombol lompat section
// ═══════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, GraduationCap, CornerDownRight, Clock3, BookOpen } from "lucide-react";
import { FadeUp, EASE } from "./motion";
import { cn } from "@/lib/utils";

export interface TutorialItem {
  id: string;
  target?: string; // SectionId tujuan tombol "Buka sekarang"
  judul: string;
  ringkas: string;
  menit: number;
  langkah: string[];
  tips?: string[];
}

export interface TutorialGroup {
  grup: string;
  emoji: string;
  items: TutorialItem[];
}

export const TUTORIALS: TutorialGroup[] = [
  {
    grup: "Dasar-dasar", emoji: "🧭",
    items: [
      {
        id: "nav", target: "dashboard", judul: "Navigasi & Command Palette", ringkas: "Bergerak cepat di seluruh 19 section", menit: 2,
        langkah: [
          "Klik menu di sidebar kiri (desktop) atau tombol ☰ pojok kiri atas (mobile) untuk berpindah section.",
          "Tekan Ctrl+K (Windows/Linux) atau ⌘K (Mac) dari mana saja — Command Palette terbuka.",
          "Ketik nama section, contoh: \"ritual\", \"izin\", \"brankas\" — pilih hasilnya, kamu langsung lompat.",
          "Tombol bulan/matahari di pojok kanan atas mengganti tema gelap/terang — pilihan tersimpan otomatis.",
          "Garis progress tipis di atas layar menunjukkan seberapa jauh kamu men-scroll halaman.",
        ],
        tips: ["Mobile: tombol 🔍 di samping ☰ juga membuka Command Palette.", "Semua animasi otomatis mati bila sistem operasi kamu set 'reduce motion'."],
      },
    ],
  },
  {
    grup: "🌊 Hulu — Piagam & Visi", emoji: "🌊",
    items: [
      {
        id: "hulu", target: "hulu", judul: "Piagam Diri, Visi 10 Tahun, OKR & Kurikulum", ringkas: "Mata air segalanya — diisi sekali, dibaca tiap Senin", menit: 5,
        langkah: [
          "Buka section Hulu → tab Piagam. Tulis siapa kamu, apa yang tidak bisa ditawar, garis merah hidup.",
          "Tab Visi: tulis visi 10 tahun dalam kalimat present — seolah sudah terjadi.",
          "Tab OKR: isi Objective tahunan + 3–5 Key Results terukur. Baca ulang tiap Senin pagi.",
          "Tab Kurikulum: daftar ilmu yang sedang dipelajari tahun ini — sinkron dengan modul Belajar.",
          "Setiap tab punya tombol Simpan — tekan setelah selesai menulis; teks tersimpan di database.",
        ],
        tips: ["Hulu adalah 'mengapa'-mu. Kalau hari berat, baca Hulu dulu sebelum bekerja."],
      },
    ],
  },
  {
    grup: "⚙️ Mesin — Keuangan", emoji: "💰",
    items: [
      {
        id: "hutang", target: "keuangan", judul: "Hutang & Cicilan (sisa terhitung otomatis)", ringkas: "Setiap pinjaman terlacak sampai lunas", menit: 3,
        langkah: [
          "Buka Keuangan → tab Hutang → tombol Tambah.",
          "Isi 'Kepada', nilai awal, cicilan per bulan yang realistis mampu, dan tenggat.",
          "Setelah membayar cicilan, klik menu ⋯ di baris hutang → pilih dialog Cicil.",
          "Masukkan jumlah cicilan — sisa hutang otomatis berkurang, riwayat pembayaran tersimpan.",
          "Status AKTIF berubah LUNAS bila sisa nol — merayakannya wajib.",
        ],
        tips: ["Prioritas 'BUNGA-TINGGI' atau 'TENGGAT-DEKAT' menandai hutang yang harus didahulukan."],
      },
      {
        id: "piutang", target: "keuangan", judul: "Piutang Klien & Arus Kas", ringkas: "Uang yang belum masuk + kas masuk-keluar", menit: 3,
        langkah: [
          "Tab Piutang: catat nilai kontrak dan DP diterima — sisa tagihan dihitung otomatis.",
          "Status TERLAMBAT/MACET membuat baris merah — tindak lanjuti minggu itu juga.",
          "Tab Arus Kas: setiap transaksi masuk/keluar dicatat 2 menit — pilih PT (TKI/DIGIMAN/Pribadi).",
          "4 kartu statistik di atas otomatis merangkum: sisa hutang, piutang, omzet bulan ini.",
          "Tab Rekening Anak: setiap income, sisihkan 20% — ini janji, bukan keuangan.",
        ],
      },
    ],
  },
  {
    grup: "⚙️ Mesin — CRM & Relasi", emoji: "🤝",
    items: [
      {
        id: "crm", target: "klien", judul: "Master Klien & Follow-Up", ringkas: "Uang ada di follow-up, bukan leads baru", menit: 4,
        langkah: [
          "Buka Klien/CRM → tab Master Klien → Tambah. Isi nama, segmen, layanan, status pipeline.",
          "Status PIPIN (baru) → NEGOSIASI → KLIEN → RETAINER — ubah saat tahap berpindah.",
          "Tab Follow-Up: setiap janji menindak klien dicatat dengan tenggat.",
          "Follow-up lewat tenggat > 3 hari otomatis MERAH — kerjakan sebelum lead baru.",
          "Counter pipeline di atas menunjukkan distribusi status seluruh klien.",
        ],
        tips: ["Kolom 'sumber' penting: setelah 100 klien kamu tahu kanal mana yang benar-benar menghasilkan."],
      },
      {
        id: "relasi", target: "relasi", judul: "Relasi & Aktivitas Politik", ringkas: "Ledger kepercayaan — >3 bulan tanpa kabar = wajib sapa", menit: 3,
        langkah: [
          "Catat setiap tokoh/relasi penting dengan domainnya (PPP, Bisnis, Pemerintahan, Media, Agama).",
          "Isi dua kolom emas: 'Saya pernah bantu' dan 'Dia pernah bantu' — utang budi harus terlihat.",
          "Prioritas A = jaga tiap bulan, B = triwulan, C = tahunan.",
          "Aktivitas Politik mencatat kegiatan PPP — aturan boundary: bantuan = investasi relasi ATAU proyek resmi dengan invoice.",
        ],
      },
    ],
  },
  {
    grup: "💼 Bisnis Hub — Database Terlengkap", emoji: "💼",
    items: [
      {
        id: "pelanggan", target: "bisnis", judul: "Database Pelanggan (Metadata 360°)", ringkas: "25 field per pelanggan — identitas hingga preferensi", menit: 5,
        langkah: [
          "Buka Bisnis Hub → tab Pelanggan → Tambah.",
          "Isi identitas: nama, jenis (individu/badan usaha), KTP, NPWP, tanggal lahir, pekerjaan.",
          "Isi kontak: telepon, WhatsApp (format 62…), email, email Google, alamat lengkap + kota/provinsi/kode pos.",
          "Isi perilaku: sumber lead (WA/IG/FB/TikTok/SEO/Referral), status funnel (LEAD → KLIEN → RETAINER), preferensi kontak & waktu nyaman dihubungi.",
          "Isi komersial: total belanja, tanggal deal terakhir, tag — untuk segmentasi penawaran.",
          "Gunakan pencarian browser (Ctrl+F) atau filter kolom status untuk bekerja per segmen.",
        ],
        tips: ["Data identitas sensitif — aplikasi ini berjalan lokal di servermu sendiri (SQLite). Jangan ekspor sembarangan.", "UU PDP No.27/2022: data pelanggan hanya boleh dipakai untuk tujuan yang disetujui mereka."],
      },
      {
        id: "perusahaan", target: "bisnis", judul: "Database Perusahaan (Badan Usaha)", ringkas: "NIB, NPWP, SK AHU, KBLI, modal, pengurus", menit: 4,
        langkah: [
          "Buka Bisnis Hub → tab Perusahaan → Tambah.",
          "Pilih bentuk badan: PT, CV, PMA, PO/UPTA, Firma, Koperasi, Yayasan, atau Perseorangan.",
          "Isi legalitas: NIB (OSS), NPWP, SK Kemenkumham (format AHU-xxxx.AH.01.30.Tahun xxxx), SBU bila konstruksi.",
          "Isi KBLI (pisah koma), modal dasar & disetor, omzet tahunan, jumlah karyawan.",
          "Centang 'Perusahaan grup sendiri' untuk pusatperizinan.com & gunara.web.id — terpisah dari data klien.",
          "Kolom NIB pada tabel membantu verifikasi cepat saat konsultasi klien.",
        ],
      },
    ],
  },
  {
    grup: "🏛️ Perizinan — Mesin Konsultan", emoji: "🏛️",
    items: [
      {
        id: "tracker", target: "perizinan", judul: "Tracker Pengurusan 5 Tahap ISO", ringkas: "Posisi setiap berkas klien selalu terlihat", menit: 4,
        langkah: [
          "Buka Perizinan → tab Tracker 5 Tahap. Lima kolom = alur resmi gunara.web.id: Konsultasi → Penawaran → Kontrak → Proses → Garansi.",
          "Tambah pengurusan manual lewat tombol 'Tambah Pengurusan', ATAU lebih cepat: dari Katalog/Pencari Izin klik 'Buat Pengurusan'.",
          "Klik ▶ pada kartu untuk memindah berkas ke tahap berikutnya — status otomatis mengikuti standar ISO.",
          "Isi nilai deal, biaya pemerintah, dan DP — 3 kartu di atas menghitung pipeline aktif, sudah terbit, dan DP diterima.",
          "Lampirkan folder Google Drive klien di kolom 'Link dokumen' — satu klik saat laporan progres.",
        ],
        tips: ["Kartu menampilkan pelanggan, instansi, dan target selesai — cek tiap pagi seperti pilot cek instrumen."],
      },
      {
        id: "katalog", target: "perizinan", judul: "Katalog 46 Layanan", ringkas: "Harga mulai + durasi + instansi — hasil audit website sendiri", menit: 2,
        langkah: [
          "Buka Perizinan → tab Katalog 46 Layanan.",
          "Cari via kotak pencarian (nama/kode/instansi) atau filter per 11 kategori.",
          "Setiap kartu menampilkan harga mulai, estimasi durasi, dan instansi tujuan (OSS RBA, Kemenkumham, BPOM, BSN…).",
          "Klik 'Buat Pengurusan' — layanan langsung masuk Tracker Tahap 1, siap diisi data klien.",
        ],
      },
      {
        id: "finder", target: "perizinan", judul: "Pencari Izin Cerdas", ringkas: "11 pertanyaan → peta izin lengkap + estimasi biaya", menit: 3,
        langkah: [
          "Buka Perizinan → tab Pencari Izin.",
          "Pilih sektor usaha (10 pilihan) dan skala (UMKM/Menengah/Besar).",
          "Centang semua yang relevan: punya badan usaha? jual online? produk pangan? punya gedung? karyawan? perlu merek? ekspor-impor? investor asing? ikut tender?",
          "Klik 'Analisis Kebutuhan Izin' — hasil terurut prioritas: WAJIB → SANGAT DISARANKAN → DISARANKAN → OPSIONAL.",
          "Lihat estimasi total biaya (harga mulai semua izin) — pakai untuk penawaran pertama ke klien.",
          "Klik 'Masukkan Izin Prioritas ke Tracker' — semua izin WAJIB & SANGAT DISARANKAN langsung jadi pengurusan.",
        ],
        tips: ["Ini replikasi tools 'AI license finder' pusatperizinan.com — tapi aturannya transparan & bisa kamu audit."],
      },
    ],
  },
  {
    grup: "🔐 Aset Digital", emoji: "🔐",
    items: [
      {
        id: "sosmed", target: "asetdigital", judul: "Database Sosial Media", ringkas: "Semua akun + kredensial terenkripsi + metrik", menit: 3,
        langkah: [
          "Buka Aset Digital → tab Sosial Media → Tambah.",
          "Pilih platform (12 pilihan: Instagram, TikTok, WhatsApp Business, Google Bisnisku, marketplace, dll).",
          "Isi handle, nama tampilan, URL, email & nomor login, email/nomor pemulihan.",
          "Isi password — tersimpan TERENKRIPSI AES-256-GCM di server. Tidak pernah muncul di tabel.",
          "Untuk melihat/menyalin password: klik ikon gembok pada baris → Lihat/Salin.",
          "Catat metrik: followers, engagement, target post/minggu, tanggal post terakhir.",
        ],
        tips: ["Badge 2FA merah = akun tanpa verifikasi dua langkah — aktifkan hari ini juga."],
      },
      {
        id: "brankas", target: "asetdigital", judul: "Brankas Kredensial (Email Google & Semua Akun)", ringkas: "Satu brankas: Google, OSS, pajak, bank, marketplace", menit: 4,
        langkah: [
          "Buka Aset Digital → tab Brankas Kredensial → Tambah.",
          "Kategorikan akun: EMAIL_GOOGLE (untuk semua akun Google bisnis), OSS/Pemerintah, Pajak (Coretax/DJP), Bank, Marketplace, Hosting, AI Tools…",
          "Isi identifier (email/username), password, PIN banking, dan kode cadangan 2FA — semuanya terenkripsi AES-256-GCM.",
          "Panel 'Kesehatan Brankas' di atas menampilkan: akun tanpa 2FA, password lemah, belum dirotasi, status kompromi.",
          "Rotasi password > 90 hari — isi kolom 'Terakhir ganti password' agar panel mengingatkan.",
          "Kolom catatan HANYA untuk info non-sensitif (mis. 'AKun iklan terhubung') — jangan tulis password di catatan.",
        ],
        tips: ["Standar OWASP: 2FA Authenticator App (bukan SMS) untuk email Google utama.", "Simpan kode cadangan 2FA di brankas — satu-satunya cara masuk bila HP hilang."],
      },
      {
        id: "pengguna", target: "asetdigital", judul: "Pengguna & Akses (User ID, Email, Password)", ringkas: "Manajemen akun aplikasi + role", menit: 3,
        langkah: [
          "Buka Aset Digital → tab Pengguna & Akses → Tambah.",
          "Email login = user ID utama. Isi juga email Google terhubung untuk SSO kelak.",
          "Password disimpan scrypt (OWASP) — kolom tabel menampilkan skor kekuatan NIST: LEMAH/SEDANG/KUAT/SANGAT KUAT.",
          "Role: OWNER (penuh), ADMIN, KONSULTAN, STAFF, VIEWER (hanya lihat) — tetapkan sesuai tim.",
          "Status TERKUNCI untuk akun bermasalah; kolom failedAttempts & lastLoginAt melacak aktivitas login.",
        ],
      },
    ],
  },
  {
    grup: "🏃 Hilir — Ritual Harian", emoji: "🏃",
    items: [
      {
        id: "harian", target: "harian", judul: "Ritual Harian (3 MIT)", ringkas: "Pagi menulis MIT, malam refleksi", menit: 3,
        langkah: [
          "Setiap pagi buka Ritual Harian — tulis 3 MIT (Most Important Tasks) hari itu.",
          "MIT juga muncul di Command Center — centang dari dashboard, sinkron otomatis.",
          "Geser slider energi 1–10. Energi ≤ 4 memicu Protokol Hari Buruk — tidak memaksakan produksi.",
          "Malam hari: isi refleksi — 1 kalimat jujur cukup.",
          "Riwayat di bawah adalah jurnal panjang — satu baris per hari, tak terhapus.",
        ],
      },
      {
        id: "mingguan", target: "mingguan", judul: "Review Mingguan & Backlog", ringkas: "Minggu malam 30 menit — rapat dengan manager", menit: 4,
        langkah: [
          "Minggu malam buka Review Mingguan: hitung MIT selesai, leads, closing, energi rata-rata.",
          "Jawab 4 pertanyaan manajer: progres proyek, apa yang dihentikan, janji yang belum ditepati, target minggu depan.",
          "Isi fokus 1-2-3 minggu depan + jadwal anak.",
          "Ide baru yang menggoda? Masukkan Backlog — ide TIDAK BOLEH dieksekusi di minggu lahirnya.",
          "Review Backlog tiap minggu: Naik Prioritas atau Coret.",
        ],
      },
    ],
  },
  {
    grup: "🛡️ Arsenal", emoji: "🛡️",
    items: [
      {
        id: "agents", target: "agents", judul: "15 AI Agents — Role Activation", ringkas: "Konten siap salin untuk tiap platform AI", menit: 2,
        langkah: [
          "Buka Arsenal → 15 AI Agents.",
          "Klik kartu agent yang dibutuhkan (content, sales, riset, dll).",
          "Dialog menampilkan Role Activation Prompt lengkap — klik Salin.",
          "Tempel ke AI pilihanmu — agent aktif dengan kepribadian & tugas yang tepat.",
        ],
      },
      {
        id: "domain", target: "domain", judul: "43 Domain Portfolio", ringkas: "Setiap domain punya misi & tier", menit: 2,
        langkah: [
          "Buka Arsenal → 43 Domain. Grid dikelompokkan per tier: INTI, GATEWAY, FUTURE, PARKED.",
          "Edit status tiap domain: LIVE, PRIORITAS, PLAN, REDIRECT, MASA TENGGANG…",
          "Domain MASA TENGGANG ditandai merah — putuskan: perpanjang atau lepas.",
        ],
      },
    ],
  },
];

export function TutorialSection({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [q, setQ] = useState("");
  const reduce = useReducedMotion();

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return TUTORIALS;
    return TUTORIALS.map((g) => ({
      ...g,
      items: g.items.filter((it) =>
        it.judul.toLowerCase().includes(s) || it.ringkas.toLowerCase().includes(s) ||
        it.langkah.some((l) => l.toLowerCase().includes(s))
      ),
    })).filter((g) => g.items.length > 0);
  }, [q]);

  const totalItem = TUTORIALS.reduce((a, g) => a + g.items.length, 0);

  return (
    <div className="space-y-4">
      <FadeUp>
        <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-amber-950/30 dark:to-emerald-950/40 p-5">
          <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            📚 Tutorial Lengkap — {totalItem} Panduan
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Cara memakai setiap fitur GUNARA OS — dari ritual harian sampai brankas kredensial terenkripsi.
            Setiap panduan berisi langkah bernomor, tips ahli, dan tombol lompat langsung ke section-nya.
          </p>
          <div className="relative mt-3 max-w-md">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Cari panduan… (contoh: password, izin, MIT, hutang)"
              className="pl-9"
              aria-label="Cari tutorial"
            />
          </div>
        </div>
      </FadeUp>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-10">
          Tidak ada panduan untuk &ldquo;{q}&rdquo;. Coba kata kunci lain — misalnya &ldquo;klien&rdquo; atau &ldquo;izin&rdquo;.
        </p>
      )}

      {filtered.map((group, gi) => (
        <FadeUp key={group.grup} delay={gi * 0.05}>
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/40 flex items-center gap-2">
              <span className="text-lg">{group.emoji}</span>
              <h3 className="font-extrabold text-sm tracking-tight">{group.grup}</h3>
              <Badge variant="outline" className="ml-auto text-[10px]">{group.items.length} panduan</Badge>
            </div>
            <Accordion type="single" collapsible className="px-2">
              {group.items.map((it) => (
                <AccordionItem key={it.id} value={it.id} className="border-b last:border-0">
                  <AccordionTrigger className="hover:no-underline px-2 py-3">
                    <div className="flex items-start gap-2.5 text-left">
                      <BookOpen className="size-4 mt-0.5 text-emerald-700 dark:text-emerald-400 flex-none" />
                      <div>
                        <p className="font-bold text-sm leading-snug">{it.judul}</p>
                        <p className="text-xs text-muted-foreground font-normal mt-0.5">{it.ringkas} · <Clock3 className="size-3 inline" /> {it.menit} mnt</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-4">
                    <motion.ol
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="space-y-2.5"
                    >
                      {it.langkah.map((l, i) => (
                        <li key={i} className="flex gap-2.5 text-sm">
                          <span className="size-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center flex-none mt-0.5">{i + 1}</span>
                          <span className="leading-relaxed">{l}</span>
                        </li>
                      ))}
                    </motion.ol>
                    {it.tips && (
                      <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900 p-3">
                        {it.tips.map((t, i) => (
                          <p key={i} className="text-xs text-amber-900 dark:text-amber-300 flex gap-2">
                            <CornerDownRight className="size-3.5 flex-none mt-0.5" /> {t}
                          </p>
                        ))}
                      </div>
                    )}
                    {it.target && onNavigate && (
                      <Button
                        size="sm" variant="outline" className="mt-3 gap-1.5"
                        onClick={() => onNavigate(it.target!)}
                      >
                        Buka section-nya sekarang →
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </FadeUp>
      ))}

      <AnimatePresence>
        {q && filtered.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground text-center"
          >
            {filtered.reduce((a, g) => a + g.items.length, 0)} panduan cocok dengan &ldquo;{q}&rdquo;
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
