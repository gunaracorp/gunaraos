import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v8.0 — SEO MASTERY: AUDIT ENGINE API
// POST   /api/seo/audit → audit on-page lengkap (fetch + parsing regex
//                         tanpa dependensi eksternal) + skor 4 pilar
//                         + rekomendasi strategis AI
// GET    /api/seo/audit?projectId=… → riwayat audit (20 terakhir)
// DELETE /api/seo/audit?id=… → hapus satu riwayat audit
// ═══════════════════════════════════════════════════════════════════
// Semua parsing HTML memakai regex murni — tanpa cheerio/jsdom — agar
// route tetap ringan dan aman di runtime serverless.
// ═══════════════════════════════════════════════════════════════════

export const maxDuration = 120;

// ── Tipe temuan audit ──
type Severity = "KRITIS" | "PERINGATAN" | "BAIK";
interface AuditIssue {
  severity: Severity;
  judul: string;
  detail: string;
  saran: string;
}
type Metrics = Record<string, number | string | boolean>;

// ── Dekode entity HTML dasar agar teks terbaca ──
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Ambil isi atribut content dari tag meta tertentu ──
// (mendukung urutan atribut apa pun: content sebelum/sesudah name)
function metaContent(metaTags: string[], attr: string, name: string): string {
  const re = new RegExp(`${attr}=["']${name}["']`, "i");
  for (const tag of metaTags) {
    if (re.test(tag)) {
      const m = tag.match(/content=["']([^"']*)["']/i);
      if (m) return decodeEntities(m[1]);
    }
  }
  return "";
}

// ── Buang script/style lalu hitung kata dari teks polos ──
function countWords(html: string): number {
  const cleaned = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ");
  const text = decodeEntities(cleaned);
  const words = text.split(/\s+/).filter(Boolean);
  return words.length;
}

// ── Deteksi hint responsive (media query / kelas framework) ──
function hasResponsiveHints(html: string): boolean {
  if (/(max-width|min-width)\s*:/i.test(html)) return true;
  return /col-(sm|md|lg|xl)|flex|grid|container|responsive|@media/i.test(html);
}

// ── Prompt sistem untuk rekomendasi strategis AI ──
const SYSTEM_PROMPT = `Anda adalah GUNARA OS v8.0 — Master SEO Internasional dengan 150 tahun pengalaman kolektif Dewan 46.
Anda menerima hasil audit teknis sebuah halaman web (metrik mentah + daftar temuan) dan menerjemahkannya
menjadi rekomendasi strategis yang tegas, aksionabl, dan berbasis angka nyata.

ATURAN:
- Bahasa Indonesia, markdown, tegas seperti konsultan senior — tanpa basa-basi.
- WAJIB mengutip angka nyata dari metrik (panjang title, jumlah kata, jumlah H1, coverage alt, dll).
- Jangan mengarang data yang tidak ada di metrik.
- Setiap saran harus konkret: sebutkan apa yang diubah, keberapa, dan mengapa.

FORMAT (ikuti persis, markdown):
## 🩺 Diagnosis
(2-4 kalimat: kondisi kesehatan SEO halaman berdasarkan skor dan metrik)
## 🚨 Prioritas Perbaikan
(daftar bernomor 5-8 item, urut dari dampak terbesar, setiap item menyebut metrik nyata + aksi konkret)
## 📈 Rencana 30 Hari
(bagi menjadi Minggu 1-4, setiap minggu 1-2 bullet fokus eksekusi)
## 💎 Quick Wins
(3-5 bullet perbaikan cepat <1 jam yang langsung menaikkan skor)`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const projectId = String(body.projectId ?? "");
    let url = String(body.url ?? "").trim();
    if (!url) {
      return NextResponse.json({ error: "URL wajib diisi." }, { status: 400 });
    }

    // ── 1. Normalisasi URL (tambah https:// bila tidak ada skema) ──
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Format URL tidak valid: " + url }, { status: 400 });
    }

    // ── 2. Fetch halaman server-side ──
    let html = "";
    let httpStatus = 0;
    let finalUrl = url;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; GunaraOS-AuditBot/1.0)" },
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      });
      httpStatus = res.status;
      finalUrl = res.url || url;
      if (!res.ok) {
        return NextResponse.json(
          { error: `Situs tidak dapat dijangkau: HTTP ${res.status} pada ${url}` },
          { status: 502 }
        );
      }
      html = (await res.text()).slice(0, 1_500_000); // batasi ukuran agar parsing ringan
    } catch (e) {
      return NextResponse.json(
        { error: "Situs tidak dapat dijangkau: " + String(e instanceof Error ? e.message : e) },
        { status: 502 }
      );
    }
    if (!html) {
      return NextResponse.json(
        { error: "Situs tidak dapat dijangkau: respons kosong dari server." },
        { status: 502 }
      );
    }

    // ── 3. Parsing HTML murni regex ──
    const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
    const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = decodeEntities(titleMatch ? titleMatch[1] : "");
    const description = metaContent(metaTags, "name", "description");
    const robots = metaContent(metaTags, "name", "robots").toLowerCase();
    const viewport = metaContent(metaTags, "name", "viewport");
    const ogTitle = metaContent(metaTags, "property", "og:title");
    const ogDescription = metaContent(metaTags, "property", "og:description");
    const ogImage = metaContent(metaTags, "property", "og:image");

    // Canonical
    const canonicalTag = linkTags.find((t) => /rel=["']canonical["']/i.test(t));
    const canonical = canonicalTag
      ? decodeEntities(canonicalTag.match(/href=["']([^"']*)["']/i)?.[1] ?? "")
      : "";

    // Lang attribute
    const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
    const lang = htmlTag.match(/\slang=["']([^"']*)["']/i)?.[1] ?? "";

    // Headings
    const h1Tags = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) ?? [];
    const h1Count = h1Tags.length;
    const firstH1 = h1Count ? decodeEntities((h1Tags[0] ?? "").replace(/<[^>]+>/g, " ")) : "";
    const h2Count = (html.match(/<h2\b[^>]*>/gi) ?? []).length;

    // Gambar & alt
    const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
    const imgTotal = imgTags.length;
    const imgWithAlt = imgTags.filter((t) => /\balt=["'][^"']+["']/i.test(t)).length;

    // Tautan internal / eksternal
    const host = new URL(finalUrl).hostname.replace(/^www\./, "");
    const aTags = html.match(/<a\b[^>]*href=["']([^"']*)["'][^>]*>/gi) ?? [];
    let internalLinks = 0;
    let externalLinks = 0;
    for (const a of aTags) {
      const href = (a.match(/href=["']([^"']*)["']/i)?.[1] ?? "").trim();
      if (!href || href.startsWith("#") || /^(javascript:|mailto:|tel:)/i.test(href)) continue;
      if (/^https?:\/\//i.test(href)) {
        try {
          const linkHost = new URL(href).hostname.replace(/^www\./, "");
          if (linkHost === host) internalLinks++;
          else externalLinks++;
        } catch {
          /* href rusak — abaikan */
        }
      } else {
        internalLinks++; // path relatif = internal
      }
    }

    // Konten
    const wordCount = countWords(html);

    // JSON-LD, favicon, form, inline style
    const jsonLd = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html);
    const favicon = linkTags.some((t) => /rel=["'][^"']*icon[^"']*["']/i.test(t));
    const formCount = (html.match(/<form\b/gi) ?? []).length;
    const inlineStyleCount = (html.match(/\sstyle=["']/gi) ?? []).length;
    const isHttps = finalUrl.startsWith("https://");
    const robotsBlocking = robots.includes("noindex") || robots.includes("none");

    // Susun objek metrik mentah (disimpan sebagai JSON di DB)
    const metrics: Metrics = {
      finalUrl,
      httpStatus,
      isHttps,
      title,
      titleLength: title.length,
      hasDescription: Boolean(description),
      descriptionLength: description.length,
      canonical,
      lang,
      viewportPresent: Boolean(viewport),
      robots,
      robotsBlocking,
      h1Count,
      firstH1,
      h2Count,
      imgTotal,
      imgWithAlt,
      altCoveragePct: imgTotal ? Math.round((imgWithAlt / imgTotal) * 100) : 0,
      internalLinks,
      externalLinks,
      wordCount,
      ogTitlePresent: Boolean(ogTitle),
      ogDescriptionPresent: Boolean(ogDescription),
      ogImagePresent: Boolean(ogImage),
      ogComplete: Boolean(ogTitle && ogDescription && ogImage),
      jsonLdPresent: jsonLd,
      faviconPresent: favicon,
      formCount,
      inlineStyleCount,
      responsiveHints: hasResponsiveHints(html),
    };

    // ── 4. Skor 4 pilar (0-100) ──
    // Teknik: https(15) canonical(15) lang(15) viewport(15) robots(15) jsonld(15) favicon(10)
    let skorTeknik = 0;
    if (isHttps) skorTeknik += 15;
    if (canonical) skorTeknik += 15;
    if (lang) skorTeknik += 15;
    if (viewport) skorTeknik += 15;
    if (!robotsBlocking) skorTeknik += 15;
    if (jsonLd) skorTeknik += 15;
    if (favicon) skorTeknik += 10;

    // On-page: title(30) description(25) h1(20) og(25)
    let skorOnpage = 0;
    const tl = title.length;
    if (tl >= 30 && tl <= 60) skorOnpage += 30;
    else if (tl >= 20 && tl <= 70) skorOnpage += 15;
    const dl = description.length;
    if (dl >= 70 && dl <= 160) skorOnpage += 25;
    else if (dl >= 50 && dl <= 200) skorOnpage += 12;
    if (h1Count === 1) skorOnpage += 20;
    if (metrics.ogComplete) skorOnpage += 25;
    else if (ogTitle || ogDescription || ogImage) skorOnpage += 10;

    // Konten: panjang(60) + coverage alt(40)
    let skorKonten = 0;
    if (wordCount >= 1000) skorKonten += 60;
    else if (wordCount >= 600) skorKonten += 45;
    else if (wordCount >= 300) skorKonten += 30;
    else if (wordCount >= 150) skorKonten += 15;
    else skorKonten += 5;
    if (imgTotal === 0) skorKonten += 30; // netral — tidak ada gambar untuk dinilai
    else if (imgWithAlt / imgTotal >= 0.8) skorKonten += 40;
    else if (imgWithAlt / imgTotal >= 0.5) skorKonten += 25;
    else if (imgWithAlt > 0) skorKonten += 10;

    // Mobile: viewport(50) inline style(25) hint responsive(25)
    let skorMobile = 0;
    if (viewport) skorMobile += 50;
    if (inlineStyleCount <= 10) skorMobile += 25;
    else if (inlineStyleCount <= 30) skorMobile += 12;
    if (metrics.responsiveHints) skorMobile += 25;

    const skorTotal = Math.round(
      0.3 * skorTeknik + 0.3 * skorOnpage + 0.25 * skorKonten + 0.15 * skorMobile
    );

    // ── 5. Susun daftar temuan (masalah dulu, lalu maks 4 yang BAIK) ──
    const issues: AuditIssue[] = [];
    let baikCount = 0;
    const push = (severity: Severity, judul: string, detail: string, saran: string) => {
      if (severity === "BAIK" && baikCount >= 4) return;
      if (severity === "BAIK") baikCount++;
      issues.push({ severity, judul, detail, saran });
    };

    // HTTPS
    if (isHttps)
      push("BAIK", "HTTPS aktif", `Situs dilayani via HTTPS (${finalUrl}).`, "Pertahankan; pastikan semua aset juga dimuat via HTTPS.");
    else
      push("KRITIS", "Situs tidak memakai HTTPS", "HTTP terdeteksi — browser & Google menandai situs tidak aman.", "Pasang sertifikat SSL (Let's Encrypt gratis) dan redirect 301 semua trafik HTTP → HTTPS.");

    // Title tag
    if (!title)
      push("KRITIS", "Tag <title> hilang", "Tidak ditemukan judul halaman — Google akan menampilkan URL mentah di SERP.", "Tambahkan <title> unik 30-60 karakter yang memuat keyword utama.");
    else if (tl < 30 || tl > 60)
      push("PERINGATAN", `Panjang title suboptimal (${tl} karakter)`, `Title saat ini: "${title.slice(0, 80)}". Ideal 30-60 karakter agar tidak terpotong di SERP.`, tl < 30 ? "Perkaya title dengan modifier/keyword sekunder hingga 30-60 karakter." : "Padatkan title ke 30-60 karakter; simpan keyword di awal.");
    else
      push("BAIK", `Title optimal (${tl} karakter)`, "Panjang title berada di rentang manis SERP.", "Pertahankan dan uji variasi CTR via Search Console.");

    // Meta description
    if (!description)
      push("PERINGATAN", "Meta description hilang", "Tanpa description, Google men-snippet acak dari halaman.", "Tambahkan meta description 70-160 karakter yang menawarkan nilai + CTA.");
    else if (dl < 70 || dl > 160)
      push("PERINGATAN", `Panjang meta description suboptimal (${dl} karakter)`, "Ideal 70-160 karakter agar tidak terpotong.", dl < 70 ? "Perpanjang description dengan benefit + CTA hingga 70-160 karakter." : "Pangkas description ke bawah 160 karakter.");
    else
      push("BAIK", `Meta description optimal (${dl} karakter)`, "Panjang description ideal untuk SERP.", "Pertahankan; sinkronkan dengan og:description.");

    // H1
    if (h1Count === 0)
      push("KRITIS", "Tidak ada tag H1", "Halaman tanpa H1 kehilangan sinyal topik terkuat.", "Tambahkan satu H1 yang memuat keyword utama, beda sedikit dari title.");
    else if (h1Count > 1)
      push("PERINGATAN", `Terdapat ${h1Count} tag H1`, "H1 ganda mengaburkan sinyal topik untuk Google.", "Jadikan satu H1 utama; turunkan sisanya ke H2/H3.");
    else
      push("BAIK", "Struktur H1 tepat (tepat 1 buah)", `H1: "${firstH1.slice(0, 80)}".`, "Pastikan H1 memuat keyword utama secara alami.");

    // Struktur H2
    if (h2Count === 0)
      push("PERINGATAN", "Tidak ada sub-heading H2", "Konten tanpa H2 sulit dipindai user & bot.", "Pecah konten menjadi 4-8 seksi ber-H2 yang mengandung variasi keyword.");
    else
      push("BAIK", `Struktur H2 sehat (${h2Count} sub-heading)`, "Konten memiliki hierarki yang bisa dipindai.", "Pertahankan; selipkan keyword long-tail di 2-3 H2.");

    // Robots meta
    if (robotsBlocking)
      push("KRITIS", "Meta robots memblokir indeksasi", `Ditemukan robots "${robots}" — halaman TIDAK akan terindeks Google.`, "Hapus noindex/nofollow dari meta robots agar halaman bisa diranking.");
    else
      push("BAIK", "Meta robots mengizinkan indeksasi", "Tidak ada direktif noindex pada halaman.", "Pastikan juga tidak diblokir di robots.txt & X-Robots-Tag header.");

    // Viewport
    if (!viewport)
      push("KRITIS", "Meta viewport hilang", "Tanpa viewport, halaman dirender versi desktop di ponsel — mobile-first indexing menderita.", 'Tambahkan <meta name="viewport" content="width=device-width, initial-scale=1">.');
    else
      push("BAIK", "Viewport mobile siap", `Viewport: "${viewport}".`, "Pastikan layout benar-benar responsif di berbagai lebar layar.");

    // Canonical
    if (!canonical)
      push("PERINGATAN", "Tag canonical tidak ditemukan", "Tanpa canonical, duplikasi URL (parameter, trailing slash) bisa memecah otoritas.", 'Tambahkan <link rel="canonical"> menunjuk URL versi utama.');
    else
      push("PERINGATAN", `Canonical menunjuk: ${canonical.slice(0, 80)}`, "Canonical ditemukan — pastikan benar-benar menunjuk URL ini sendiri (self-canonical).", "Jika canonical tidak self-referencing, perbaiki agar tidak membuang otoritas halaman ini.");

    // Open Graph
    if (metrics.ogComplete)
      push("BAIK", "Tag Open Graph lengkap", "og:title, og:description, og:image tersedia — share sosial media tampil maksimal.", "Pertahankan; gunakan gambar OG 1200×630px.");
    else
      push("PERINGATAN", "Tag Open Graph belum lengkap", `og:title: ${ogTitle ? "ada" : "hilang"} · og:description: ${ogDescription ? "ada" : "hilang"} · og:image: ${ogImage ? "ada" : "hilang"}.`, "Lengkapi ketiga tag OG agar tampilan share WhatsApp/IG/FB profesional.");

    // Konten pendek
    if (wordCount < 300)
      push("KRITIS", `Konten terlalu tipis (${wordCount} kata)`, "Google menyebut ini thin content — sulit ranking untuk keyword kompetitif.", "Perluas menjadi minimal 600-1000 kata: tambah FAQ, studi kasus, dan penjelasan mendalam.");
    else if (wordCount < 600)
      push("PERINGATAN", `Panjang konten borderline (${wordCount} kata)`, "Di bawah 600 kata, topik kompetitif akan sulit terangkan tuntas.", "Targetkan 800-1200 kata dengan sub-topik yang dicari audiens.");
    else
      push("BAIK", `Kedalaman konten baik (${wordCount} kata)`, "Panjang konten memadai untuk bersaing di SERP.", "Segar berkala (update data/tahun) agar tidak decay.");

    // Coverage alt
    if (imgTotal === 0)
      push("PERINGATAN", "Tidak ada gambar sama sekali", "Halaman tanpa visual menurunkan engagement & kehilangan trafik Google Images.", "Tambahkan 3-5 gambar relevan (foto produk, infografis) dengan alt text deskriptif.");
    else if (imgWithAlt / imgTotal < 0.8)
      push("PERINGATAN", `Coverage alt text rendah (${imgWithAlt}/${imgTotal} gambar)`, `${Math.round((imgWithAlt / imgTotal) * 100)}% gambar punya alt — sisanya tak terbaca screen reader & Google Images.`, "Tulis alt text deskriptif (5-15 kata) untuk semua gambar, mulai dari yang paling atas.");

    // JSON-LD
    if (!jsonLd)
      push("PERINGATAN", "Belum ada data terstruktur JSON-LD", "Tanpa schema, halaman tak berpeluang rich result (bintang, FAQ, breadcrumb).", "Tambahkan JSON-LD Organization + Article/Product + FAQPage sesuai tipe halaman.");
    else
      push("BAIK", "Data terstruktur JSON-LD terdeteksi", "Halaman berpeluang tampil sebagai rich result.", "Validasi via Rich Results Test & lengkapi properti recommended.");

    // Lang attribute
    if (!lang)
      push("PERINGATAN", "Atribut lang pada <html> tidak ada", "Bot butuh sinyal bahasa untuk menargetkan hasil pencarian Indonesia.", 'Set <html lang="id"> dan pertimbangkan hreflang bila multibahasa.');

    // Favicon
    if (!favicon)
      push("PERINGATAN", "Favicon tidak terdeteksi", "Favicon hilang menurunkan kepercayaan & tampilan tab/SERP mobile.", 'Tambahkan <link rel="icon"> + apple-touch-icon 180×180.');

    // ── 6. Rekomendasi strategis AI (dengan fallback tanpa crash) ──
    let ringkasan = "";
    try {
      const userBlock = `METRIK AUDIT (JSON):
${JSON.stringify(metrics, null, 1)}

RINGKASAN TEMUAN:
${issues.map((i) => `- [${i.severity}] ${i.judul}`).join("\n")}

SKOR: Total ${skorTotal}/100 · Teknik ${skorTeknik} · On-page ${skorOnpage} · Konten ${skorKonten} · Mobile ${skorMobile}

Berikan rekomendasi strategis sesuai format. WAJIB mengutip angka nyata dari metrik di atas.`;

      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: SYSTEM_PROMPT },
          { role: "user", content: userBlock },
        ],
        thinking: { type: "disabled" },
      });
      ringkasan = completion.choices[0]?.message?.content?.trim() || "";
    } catch (e) {
      console.error("SEO AUDIT AI error:", e);
      ringkasan = "";
    }

    // Fallback: bangun ringkasan dari temuan bila AI gagal
    if (!ringkasan) {
      const kritis = issues.filter((i) => i.severity === "KRITIS");
      const warning = issues.filter((i) => i.severity === "PERINGATAN");
      const lines: string[] = [];
      lines.push("## 🩺 Diagnosis");
      lines.push(
        `Skor total halaman **${skorTotal}/100** (Teknik ${skorTeknik} · On-page ${skorOnpage} · Konten ${skorKonten} · Mobile ${skorMobile}). ` +
          `Audit menemukan **${kritis.length} masalah kritis** dan **${warning.length} peringatan** ` +
          `pada halaman ${finalUrl} dengan ${wordCount} kata dan ${imgTotal} gambar.`
      );
      lines.push("## 🚨 Prioritas Perbaikan");
      const prioritas = [...kritis, ...warning];
      prioritas.forEach((i, idx) => {
        lines.push(`${idx + 1}. **${i.judul}** — ${i.saran}`);
      });
      if (prioritas.length === 0) lines.push("1. Tidak ada masalah besar terdeteksi — lanjutkan optimasi konten & backlink.");
      lines.push("## 📈 Rencana 30 Hari");
      lines.push("- **Minggu 1:** Perbaiki semua temuan KRITIS di atas (teknis + konten tipis).");
      lines.push("- **Minggu 2:** Selesaikan peringatan on-page (title, description, OG, alt text).");
      lines.push("- **Minggu 3:** Tambah data terstruktur JSON-LD & perkuat internal linking.");
      lines.push("- **Minggu 4:** Perluas konten ≥1000 kata, ukur ulang skor audit.");
      lines.push("## 💎 Quick Wins");
      warning.slice(0, 5).forEach((i) => lines.push(`- ${i.judul}: ${i.saran}`));
      ringkasan = lines.join("\n");
    }

    // ── 7. Simpan ke DB ──
    const item = await db.seoAudit.create({
      data: {
        projectId,
        url: finalUrl,
        skorTotal,
        skorTeknik,
        skorOnpage,
        skorKonten,
        skorMobile,
        metrics: JSON.stringify(metrics),
        issues: JSON.stringify(issues),
        ringkasan,
      },
    });

    return NextResponse.json({ item });
  } catch (e) {
    console.error("SEO AUDIT POST error:", e);
    return NextResponse.json({ error: "Audit gagal dijalankan: " + String(e) }, { status: 500 });
  }
}

// ── Riwayat audit (maks 20 terbaru, bisa difilter per proyek) ──
export async function GET(req: Request) {
  try {
    const projectId = new URL(req.url).searchParams.get("projectId");
    const items = await db.seoAudit.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ items });
  } catch (e) {
    console.error("SEO AUDIT GET error:", e);
    return NextResponse.json({ items: [] });
  }
}

// ── Hapus satu riwayat audit ──
export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id wajib" }, { status: 400 });
    await db.seoAudit.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
