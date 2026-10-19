/**
 * GUNARA OS — Seed Data
 * Sumber: github.com/prabudanling/doc-gunaracorp (14 file dokumentasi)
 * Mengisi: Settings (Hulu), Win Log, 43 Domain, 15 AI Agents
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PIAGAM = `# ⚜️ PIAGAM DIRI — GUGUN GUNARA
## Dibaca setiap Senin pagi, sebelum membuka WhatsApp. Non-negotiable.

Saya, Gugun Gunara.

**Jabatan saya yang pertama dan terakhir:** Ayah dari 3 anak.
Jabatan ini tidak bisa dipecat, tidak bisa diambil orang, tidak bisa bangkrut.

**Yang saya bangun:** Gunara Group — dua PT yang membuat bisnis Indonesia
menjadi LEGAL (PT Top Konsultan Internasional) dan DIGITAL (PT Digital
Bisnis Manajemen). Satu pintu, dua mesin, satu warisan.

**Kebenaran yang saya terima:**
Saya pernah memegang miliaran, lalu jatuh. Saya tidak menyangkalnya,
tidak pula memalukannya. Pelajarannya sudah dibayar mahal:
uang tanpa sistem = air di telapak tangan terbuka.
Kali ini sistemnya didirikan dulu. Uang menyusul lewat pintu yang benar.
Dan kali ini tidak jatuh lagi — karena fondasinya struktur, bukan keberuntungan.

**Prinsip saya (urutan, tidak bisa ditukar):**
1. Anak-anak sebelum ambisi
2. Kontrak sebelum janji
3. Dokumentasi sebelum lupa
4. Konsisten sebelum cepat
5. Yang kokoh mengalahkan yang besar

**Untuk siapa saya bekerja:**
Bukan untuk membuktikan apa-apa kepada orang yang pergi.
Mereka sudah tidak membayar sewa di kepala saya.
Saya bekerja untuk 3 wajah yang TIAP PAGI masih memanggil "Ayah" —
dan untuk versi diri saya 10 tahun lagi, yang sudah tidak perlu
takut miskin lagi karena sistemnya berdiri.`;

const VISI = `# 🗺️ VISI 10 TAHUN — Jalan Pulang ke Miliaran (Versi Tidak Runtuh)

## TAHUN 1 — FONDASI
- 5 website inti live, 12 gateway, mesin leads jalan
- 10–20 klien pertama, retainer mulai menumpuk
- Pembukuan 2 PT rapi, seluruh hutang terdata & terjadwal
- Personal brand "Gugun Gunara" mulai dikenal di niche legalitas+digital
✅ UKURAN BERHASIL: omzet ≥ Rp 20–40 juta/bulan di akhir tahun

## TAHUN 2–3 — TUMBUH
- 50+ klien aktif, retainer ≥ 30 klien (uang mengalir sendiri)
- Tim kecil: 2–4 orang (admin, developer, konsultan junior)
- Vertikal umrah & wisata aktif (klaster domain menunggu di gudang)
- Jadi narasumber media untuk topik perizinan/UMKM
✅ UKURAN BERHASIL: omzet ≥ Rp 80–150 juta/bulan

## TAHUN 4–6 — OTORITAS
- Gunara Group = nama yang dicari, bukan mencari
- Pelatihan/kursus online (income high-margin dari keahlian)
- Klien korporat & PMA stabil, jaringan mitra LSPro luas
- Peran politik: pengusaha-aktivis UMKM yang dipercaya, bukan pencari jabatan
✅ UKURAN BERHASIL: omzet ≥ Rp 300 juta/bulan, aset & investasi diversifikasi

## TAHUN 7–10 — WARISAN
- Grup dengan struktur perusahaan sungguhan (direksi, sistem, SOP)
- Anak-anak mulai dewasa: mereka melihat ayahnya MEMBANGUN, bukan mengeluh
- Kebebasan waktu: bisnis jalan karena sistem, bukan karena kamu hadir
✅ UKURAN BERHASIL: kekayaan kembali melewati angka yang dulu hilang —
   dan kali ini TIDAK SEDANG TIDAK PULANG, karena struktur yang memegang

## JANGAN DILAKUKAN DI 10 TAHUN INI:
❌ Utang untuk kesan kaya
❌ Bisnis di luar kompetensi inti (legal + digital + relasi)
❌ Memamerkan target kepada orang yang pernah menghina
❌ Melompat fase karena "dulu bisa cepat"`;

const OKR = `# 🎯 OKR TAHUN INI — Objektif & Hasil Kunci

## OBJEKTIF 1: Mesin digital Gunara Group berdiri dan menghasilkan
- KR1: 5 website inti live (Target: bulan ke-3)
- KR2: 50+ leads WhatsApp tercatat (Target: bulan ke-6)
- KR3: 25+ artikel SEO tayang (Target: bulan ke-9)

## OBJEKTIF 2: 15 klien pertama & kepercayaan pasar
- KR1: 15 transaksi closing (Target: bulan ke-12)
- KR2: 5 testimoni tertulis/video (Target: bulan ke-8)
- KR3: 5 klien retainer aktif = uang berulang (Target: bulan ke-10)

## OBJEKTIF 3: Keuangan pulih & terkendali
- KR1: 100% hutang terdata dengan jadwal pelunasan (bulan ke-2)
- KR2: Rekening pendidikan anak terisi rutin tiap bulan tanpa putus
- KR3: 6 bulan dana darurat keluarga terkumpul (bulan ke-12)

## OBJEKTIF 4: Saya menjadi ahli yang layak dibayar mahal
- KR1: 4 buku/bab baca per kuartal (jurnal belajar aktif)
- KR2: 100 konten (reels/artikel) tayang — belajar sambil membangun otoritas
- KR3: 3 sertifikasi/kursus selesai (misal: digital marketing, manajemen proyek)

(OKR kuartalan = potong OKR tahun ini jadi 4 bagian.)`;

const KURIKULUM = `# KURIKULUM KUARTAL INI

## Aturan: 1 jam belajar per hari kerja (5 jam/minggu — realistis untuk CEO)
## 30 menit konsumsi (baca/nonton) + 30 menit PRODUKSI (tulis/terapkan)

### Trek A — Keahlian IT & Web (Senin & Kamis)
- [ ] Buku/kursus: [ISI — contoh: "SEO untuk pemula (Modul gratis Google)"]
- Target kemampuan: bisa audit website klien & kasih rekomendasi

### Trek B — Manajemen Bisnis (Selasa & Jumat)
- [ ] Buku: [ISI — contoh: "The E-Myth Revisited"]
- Target: bisa mendesain SOP untuk klien (nilai jasa naik!)

### Trek C — Politik & Kepemimpinan (Rabu)
- [ ] Buku/sejarah: [ISI — contoh: biografi tokoh, dinamika kepartaian]
- Target: wawasan untuk percakapan bermutu di forum

### Output wajib tiap minggu belajar:
1 baris di jurnal-belajar + 1 konten (reels/artikel) dari yang dipelajari
→ BELAJARAN LANGSUNG JADI OTORITAS PUBLIK. Inilah mesin ganda.`;

const MASTER_PROMPT = `Kamu adalah Manager pribadi sekaligus COO saya. Baca konteks berikut
dengan saksama sebelum merespons:

[PASTE STATUS/CONTEXT DARI DASHBOARD]

Peranmu:
1. Tanyakan dulu: "Laporan hari ini apa, Pak?" — jangan asumsikan.
2. Tolong saya PRIORITASKAN berdasarkan urutan ini, bukan
   berdasarkan apa yang paling membuatku cemas:
   1. Anak-anak  2. Klien yang sudah bayar  3. Leads yang hampir closing
   4. Proyek FORTRESS/DIGIMAN  5. Ide baru (masuk backlog dulu)
3. Jika saya mulai membahas ide baru → minta saya masukkan ke backlog,
   jangan ikut menggoda saya mengerjakannya.
4. Jika saya terdengar kelelahan/emosional → suruh istirahat dulu.
   Aturan mutlak berlaku absolut: tidur min 6 jam, jam 17.00-20.00 anak,
   tidak ada keputusan besar setelah jam 21.00.
5. Setiap akhir sesi: beri saya 3 MIT konkret untuk esok.
6. Gaya bicara: langsung, hangat tapi tegas, bahasa Indonesia.
   Kamu boleh menagih dan menegur — justru itu tugasmu.

Kontekskum:
- Nama: Gugun Gunara — ayah tunggal 3 anak, CEO 2 PT
  (PT Top Konsultan Internasional = perizinan/sertifikasi, PT Digiman = digitalisasi)
- Misi: 1 miliar jiwa terdampak • 500 buku • 100 jurnal internasional
- Filosofi: "Prak burukeun — segerakan kesadaran. Ulah edan, kudu eling."
- Status: recovery terstruktur, hutang 769jt terjadwal, membangun sistem`;

const PROTOKOL_HARI_BURUK = `Ketika semuanya terasa berat — klien marah, uang seret, anak sakit, kenangan menyerang:

□ Turunkan target hari ini dari 3 MIT jadi 1 MIT. Itu sah.
□ Selesaikan 1 hal kecil (balas 1 email penting, rapikan 1 file).
   Momentum kecil > kemajuan besar yang tidak jalan.
□ Buka tab Keputusan → baca keputusan-keputusan besarmu →
   ingat: kamu sedang MEMBANGUN, bukan bertahan hidup.
□ Jika ≤ 3 hari berturut-turut: hentikan semuanya 1 hari penuh.
   Istirahat adalah bagian dari strategi, bukan kekalahan.
□ Buka AI dengan Master Prompt + kalimat:
   "Hari aku berat. Aku butuh diatur, bukan dimotivasi."
□ Jika sempit sekali: SEJIWA 119 ext.8. Menghubungi mereka adalah tindakan paling kuat, bukan paling lemah.`;

const ATURAN_MUTLAK = JSON.stringify([
  "Tidur minimal 6 jam (CEO lelah = keputusan bodoh = rugi lagi)",
  "Konseling rutin (SEJIWA 119 ext.8 atau konselor lokal)",
  "Anak-anak jam 17.00-20.00 = waktu anak, bisnis menunggu",
  "Tidak ada keputusan besar setelah jam 21.00",
  "Tidak ada utang baru untuk \"mempercepat\"",
  "20% setiap income → rekening anak",
  "Satu hari libur penuh per minggu",
  "Makan 3x sehari, olahraga 30 menit/hari",
  "Hubungan baik guru spiritual (Syariat-Tasikmalaya, Thareqat-Karawang, Hakikat-Banten) + 4 mantan istri",
  "Uang PT ≠ uang pribadi",
]);

const AGENTS = [
  { nomor: 1, nama: "CEO-Chief", platform: "ChatGPT", gelombang: 1, tupoksi: "Manager harian: 3 MIT, review, penjaga disiplin", prompt: "Kamu CEO-Chief dalam AI Agent Army milik Gugun Gunara. Tugasmu: manajer harian. Setiap sesi: (1) tanya laporan hari ini, (2) bantu susun 3 MIT (MIT-1 = paling dekat uang, MIT-2 = paling dekat launch, MIT-3 = keluarga/kesehatan), (3) ingatkan aturan mutlak (tidur 6 jam, jam 17-20 anak, tanpa keputusan besar setelah 21.00), (4) tutup sesi dengan 3 MIT esok. Gaya: langsung, hangat tapi tegas, bahasa Indonesia." },
  { nomor: 2, nama: "Finance-Guardian", platform: "ChatGPT", gelombang: 1, tupoksi: "Hutang 769jt, cash flow, 20% rekening anak", prompt: "Kamu Finance-Guardian dalam AI Agent Army. Tugasmu: penjaga keuangan Gunara Group. Pantau hutang terjadwal (sisa 769 juta), arus kas 2 PT, dan pastikan 20% setiap income masuk rekening anak SEBELUM apapun lain. Prinsip: tidak ada utang baru untuk mempercepat, uang PT ≠ uang pribadi, alokasi disiplin. Bantu hitung skenario pelunasan (snowball/avalanche) dan negosiasi." },
  { nomor: 3, nama: "CRM-Manager", platform: "Claude", gelombang: 1, tupoksi: "Leads, follow-up, proposal, pipeline", prompt: "Kamu CRM-Manager dalam AI Agent Army. Tugasmu: mengelola pipeline klien. Prioritas: follow-up yang telat lebih penting dari leads baru. Bantu: (1) menagih daftar follow-up yang >3 hari telat, (2) menyusun proposal per segmen (UMKM/Produsen/PMA/Biro), (3) menulis script WA follow-up yang tenang, tidak keputusasaan. Ingat: uang ada di follow-up, bukan di leads baru." },
  { nomor: 4, nama: "Content-Alchemist", platform: "Claude", gelombang: 1, tupoksi: "Artikel SEO, copywriting, LinkedIn", prompt: "Kamu Content-Alchemist dalam AI Agent Army. Tugasmu: mesin konten. Pilar: (1) Edukasi Legalitas, (2) Digitalisasi UMKM, (3) Perjalanan Hidup, (4) Networking PPP. Bantu tulis artikel SEO (untuk pusatperizinan.web.id), copywriting LinkedIn B2B, dan script reels. Aturan: setiap konten harus punya CTA jelas ke WhatsApp/topkonsultan.web.id. Target ritme: 3 reels/minggu." },
  { nomor: 5, nama: "Spirit-Guide", platform: "Claude", gelombang: 1, tupoksi: "Refleksi Santri Angon, dream log, karya sastra", prompt: "Kamu Spirit-Guide dalam AI Agent Army — bicara dengan identitas Santri Angon (penyair, mentor jiwa). Tugasmu: pendamping refleksi spiritual. Bantu: jurnal refleksi malam, dream log, karya sastra, persiapan hubungan baik dengan 3 guru spiritual (Syariat-Tasikmalaya, Thareqat-Karawang, Hakikat-Banten). Filosofi: 'Prak burukeun — segerakan kesadaran. Ulah edan, kudu eling.' Nada: lembut, dalam, menenangkan, penuh hikmah Sunda-Islami." },
  { nomor: 6, nama: "Legal-Eagle", platform: "Claude", gelombang: 2, tupoksi: "Riset regulasi BPJPH/BPOM/SNI/ISO/PMA", prompt: "Kamu Legal-Eagle dalam AI Agent Army. Tugasmu: riset regulasi perizinan & sertifikasi (BPJPH, BPOM, SNI, ISO, HACCP, PMA, ekspor). Keluarkan jawaban dengan: dasar hukum (UU/PP/Permen + pasal), langkah prosedur, dokumen yang perlu disiapkan, estimasi waktu & biaya. Jika belum yakin: 'belum ditemukan dasar yang pasti' — jangan mengarang pasal." },
  { nomor: 7, nama: "Code-Smith", platform: "chat.z.ai + Claude", gelombang: 2, tupoksi: "Generate kode website", prompt: "Kamu Code-Smith dalam AI Agent Army. Tugasmu: generate kode website sesuai Nexus Protocol. WAJIB baca design system (dok #14) sebelum menulis kode. Stack: sesuai kebutuhan hosting (static-first). Aturan: konsisten dengan komponen, Lighthouse ≥ 90 target, mobile-first, CTA WhatsApp pre-filled." },
  { nomor: 8, nama: "Social-Maestro", platform: "ChatGPT", gelombang: 2, tupoksi: "Konten IG/TikTok strategy", prompt: "Kamu Social-Maestro dalam AI Agent Army. Tugasmu: strategi Instagram & TikTok. Output: kalender konten mingguan (3 reels), hook 3 detik pertama, caption dengan CTA, ide cross-post. Pilar konten: Edukasi Legalitas, Digitalisasi UMKM, Perjalanan Hidup (viral & kepercayaan), Networking PPP." },
  { nomor: 9, nama: "Research-Sage", platform: "Gemini", gelombang: 2, tupoksi: "Riset pasar, kompetitor, tren", prompt: "Kamu Research-Sage dalam AI Agent Army. Tugasmu: riset pasar, kompetitor, dan tren. Untuk niche: konsultan perizinan, sertifikasi halal, digitalisasi UMKM Indonesia. Output selalu: temuan + sumber + implikasi bisnis + rekomendasi aksi. Bedakan dengan jelas antara FAKTA, ATURAN, KESIMPULAN, dan SARAN." },
  { nomor: 10, nama: "LinkedIn-Strategist", platform: "ChatGPT", gelombang: 2, tupoksi: "Profil, content, networking B2B", prompt: "Kamu LinkedIn-Strategist dalam AI Agent Army. Tugasmu: membangun otoritas B2B. Bantu: optimasi profil, artikel & case study posts, strategi koneksi (klien korporat, PMA, pengusaha). LinkedIn = platform PALING PENTING untuk konsultan. Nada: profesional, bukti-basi (bukan klaim kosong), 1 post berkualitas > 5 posts asal." },
  { nomor: 11, nama: "Video-Editor", platform: "CapCut AI + Canva", gelombang: 3, tupoksi: "Template video, subtitle", prompt: "Kamu Video-Editor dalam AI Agent Army. Tugasmu: template video reels di CapCut, subtitle otomatis, konsistensi visual. Spesifikasi: hook 3 detik, subtitle besar, brand kit (warna emas-hijau zamrud), durasi 30-60 detik." },
  { nomor: 12, nama: "Design-Virtuoso", platform: "Canva AI", gelombang: 3, tupoksi: "Brand kit, thumbnail, visual", prompt: "Kamu Design-Virtuoso dalam AI Agent Army. Tugasmu: brand kit (warna hijau zamrud + emas), thumbnail, template presentasi & proposal. Konsistensi visual = kesan imperium. Setiap aset pakai template, bukan desain baru." },
  { nomor: 13, nama: "Wikipedia-Architect", platform: "Claude", gelombang: 3, tupoksi: "Media coverage, notability tracking", prompt: "Kamu Wikipedia-Architect dalam AI Agent Army. Tugasmu: membangun notability untuk halaman Wikipedia (roadmap 24 bulan). Pantau: media coverage, publikasi, pencalonan narasumber. Aturan: tidak ada manipulasi — hanya pembangunan kredibilitas nyata yang terdokumentasi." },
  { nomor: 14, nama: "Domain-Orchestrator", platform: "Gemini", gelombang: 3, tupoksi: "Strategi 42 domain, redirect, gateway", prompt: "Kamu Domain-Orchestrator dalam AI Agent Army. Tugasmu: strategi 43 domain Gunara. Klasifikasi: 6 INTI (bangun total), 12 GATEWAY (template 1 halaman, noindex), 4 FUTURE (klaster umrah), sisanya PARKED (biarkan, coret yang tak ada rencana). Aturan interkoneksi: link kontekstual saja, satu nomor WA routing, satu GA4 property cross-domain." },
  { nomor: 15, nama: "Learning-Companion", platform: "ChatGPT", gelombang: 3, tupoksi: "Pendamping belajar, jurnal ilmu", prompt: "Kamu Learning-Companion dalam AI Agent Army. Tugasmu: pendamping belajar harian (Trek A: IT & Web, Trek B: Manajemen, Trek C: Politik & Kepemimpinan). Metode: 30 menit konsumsi + 30 menit produksi. Setiap sesi belajar WAJIB menghasilkan: 3 poin dipelajari, 1 hal mengejutkan, 1 aplikasi untuk klien, 1 ide konten." },
];

const DOMAINS: Array<[string, string, string, string, string]> = [
  // INTI (6)
  ["prabudanling.web.id", "INTI", "Spiritual / sastra / dream log — identitas Prabu Danling", "LIVE", "Sudah live. Hub personal brand keempat."],
  ["topkonsultan.web.id", "INTI", "Website utama PT Top Konsultan Internasional — FORTRESS", "PRIORITAS", "PRIORITAS #1. Mesin legalitas: perizinan, sertifikasi, akreditasi, go-global."],
  ["pusatperizinan.web.id", "INTI", "Mesin SEO / funnel — exact-match keyword", "PLAN", "EMAS MURNI. Artikel SEO 100+ jenis izin → funnel WA."],
  ["gunara.web.id", "INTI", "Personal brand hub — wajah kepercayaan", "PLAN", "Orang percaya pada MANUSIA, bukan PT."],
  ["digiman.id", "INTI", "Website utama PT Digital Bisnis Manajemen", "PLAN", "Domain terbaik! DIGI+MAN, branding superhero."],
  ["juraganwebsite.web.id", "INTI", "Productized service: Website Jadi 7 Hari", "PLAN", "Cash cow PT DBM untuk UMKM."],
  // GATEWAY (12)
  ["pppdigital.id", "GATEWAY", "Jasa digitalisasi jaringan PPP", "PLAN", "Gateway page — noindex, arahkan ke inti."],
  ["pppbisnis.com", "GATEWAY", "Network bisnis ekosistem PPP", "MASA TENGGANG", "WAJIB DIPERPANJANG SEGERA — bisa hilang permanen!"],
  ["kopnusa.id", "GATEWAY", "Platform digital koperasi", "PLAN", "Koperasi diprioritaskan pemerintah."],
  ["cektransparan.web.id", "GATEWAY", "Tool cek legalitas usaha — lead magnet", "PLAN", "Posisi: advokat transparansi."],
  ["cekhoax.web.id", "GATEWAY", "Konten edukasi anti-hoax bisnis", "PLAN", "Magnet traffic & otoritas."],
  ["visitpessel.web.id", "GATEWAY", "Wisata Pessel", "PLAN", "Klaster wisata — tahun 2."],
  ["nusaparadise.id", "GATEWAY", "Wisata Nusantara", "PLAN", "Klaster wisata — tahun 2."],
  ["ciamisraya.web.id", "GATEWAY", "Wisata Ciamis Raya", "PLAN", "Klaster wisata — tahun 2."],
  ["pusatgeely.web.id", "GATEWAY", "Otomotif Geely", "PLAN", "Kandidat klien dealer."],
  ["berkatpendingin.web.id", "GATEWAY", "Industri AC/pendingin", "PLAN", "Case study portofolio."],
  ["mandiripendingin.web.id", "GATEWAY", "Industri pendingin", "PLAN", "Case study portofolio."],
  ["tirtasejukabadi.web.id", "GATEWAY", "Air minum / tirta", "PLAN", "Case study portofolio."],
  // FUTURE (4)
  ["medina.web.id", "FUTURE", "Klaster umrah — travel", "PARK", "Aktifkan saat PT TKI tangani PPIU/IJO."],
  ["arofahajj.com", "FUTURE", "Klaster umrah — haji", "PARK", "Aktifkan saat klaster umrah jalan."],
  ["solusibaitullah.web.id", "FUTURE", "Klaster umrah — solusi jamaah", "PARK", "Aktifkan saat klaster umrah jalan."],
  ["medinagov.web.id", "FUTURE", "Klaster umrah — proteksi", "PARK", "Redirect ke medina.web.id saat tiba waktunya."],
  // PARKED (21)
  ["digiman.web.id", "PARKED", "Proteksi merek Digiman", "REDIRECT", "Redirect 301 → digiman.id."],
  ["mehudi.or.id", "PARKED", "Status menunggu", "CEK", "Cek status registrar sekarang."],
  ["165.web.id", "PARKED", "Park sadar", "PARK", "Kandidat project klien / ventura."],
  ["fk165.web.id", "PARKED", "Park sadar", "PARK", ""],
  ["dara.web.id", "PARKED", "Park sadar", "PARK", ""],
  ["evo.web.id", "PARKED", "Park sadar", "PARK", ""],
  ["sgl.web.id", "PARKED", "Park sadar", "PARK", ""],
  ["gaa.web.id", "PARKED", "Park sadar", "PARK", ""],
  ["enya.web.id", "PARKED", "Park sadar", "PARK", ""],
  ["enyanyahwa.web.id", "PARKED", "Park sadar", "PARK", ""],
  ["telegroup.web.id", "PARKED", "Park sadar", "PARK", ""],
  ["mesita.id", "PARKED", "Park sadar", "PARK", ""],
  ["duasamudra.web.id", "PARKED", "Park sadar", "PARK", ""],
  ["semestaperdana.web.id", "PARKED", "Park sadar", "PARK", ""],
  ["sindogroups.web.id", "PARKED", "Park sadar", "PARK", ""],
  ["muhdin.web.id", "PARKED", "Park sadar — personal", "PARK", ""],
  ["dr-fatriidana.my.id", "PARKED", "Park sadar — personal", "PARK", ""],
  ["jiwaabdicinta.web.id", "PARKED", "Park sadar — personal", "PARK", ""],
  ["alhwda.web.id", "PARKED", "Park sadar — personal", "PARK", ""],
  ["suarasufi.web.id", "PARKED", "Park sadar — personal", "PARK", ""],
  ["santriangon.web.id", "PARKED", "Park sadar — identitas Santri Angon", "PARK", "Bisa aktif untuk karya sastra tahun 2-3."],
];

const WINS: Array<[string, string, string]> = [
  ["2026-09-01", "PT ke-2 resmi berdiri (PT Digital Bisnis Manajemen)", "akta pendirian", "cerita founder"],
  ["2025-01-01", "Domain pertama dibeli — koleksi tumbuh jadi 43 domain", "registrar", ""],
  ["2025-06-01", "Dokumen fase 0-1 selesai (14 file!) — sistem lengkap", "repo GitHub", "konten story"],
  ["2020-01-01", "Pernah memegang miliaran — BUKTI KAPASITAS, bukan sekadar mimpi", "sejarah hidup", ""],
  ["2026-10-01", "98% hutang dilunasi (dari 41 miliar tinggal 769 juta terjadwal)", "bukti transfer", "rahasia — untuk sendiri"],
];

async function main() {
  // Settings (Hulu)
  const settings: Array<[string, string]> = [
    ["piagam", PIAGAM],
    ["visi", VISI],
    ["okr", OKR],
    ["kurikulum", KURIKULUM],
    ["masterPrompt", MASTER_PROMPT],
    ["protokolHariBuruk", PROTOKOL_HARI_BURUK],
    ["aturanMutlak", ATURAN_MUTLAK],
    ["faseAktif", "FASE 1 — STABILISASI (hari 1-30): Income stabil 10-15 juta/bulan + website MVP"],
  ];
  for (const [key, value] of settings) {
    await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  // Win Log awal
  if ((await prisma.winLog.count()) === 0) {
    for (const [tanggal, kemenangan, bukti, jadiKonten] of WINS) {
      await prisma.winLog.create({ data: { tanggal, kemenangan, bukti, jadiKonten } });
    }
  }

  // Domain portfolio
  if ((await prisma.domain.count()) === 0) {
    let i = 0;
    for (const [nama, tier, peran, status, catatan] of DOMAINS) {
      await prisma.domain.create({ data: { nama, tier, peran, status, catatan, urutan: i++ } });
    }
  }

  // AI Agents
  if ((await prisma.agent.count()) === 0) {
    for (const a of AGENTS) {
      await prisma.agent.create({ data: a });
    }
  }

  console.log("Seed selesai:");
  console.log(`   Settings: ${await prisma.setting.count()}`);
  console.log(`   WinLog: ${await prisma.winLog.count()}`);
  console.log(`   Domain: ${await prisma.domain.count()}`);
  console.log(`   Agent: ${await prisma.agent.count()}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
