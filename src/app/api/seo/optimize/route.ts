import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v8.0 — SEO MASTERY: CONTENT OPTIMIZER API
// POST /api/seo/optimize → analisis konten + keyword:
//   1) Metrik dihitung server-side (density, panjang kalimat, dsb)
//   2) AI menilai kualitas & memberi saran (JSON ketat, disanitasi)
// Tidak menyimpan ke DB — hasil langsung dikonsumsi UI optimasi.
// ═══════════════════════════════════════════════════════════════════

export const maxDuration = 120;

// ── Tipe hasil AI setelah sanitasi ──
interface OptimizerResult {
  skor: number;
  readability: "MUDAH" | "SEDANG" | "SULIT";
  masalah: string[];
  saran: string;
  metaTitle: string;
  metaDescription: string;
  outline: string[];
}

// ── Prompt sistem: editor SEO senior ──
const SYSTEM_PROMPT = `Anda adalah GUNARA Content Optimizer — editor SEO senior dengan 150 tahun pengalaman kolektif Dewan 46.
Anda menilai draf konten berdasarkan METRIK NYATA yang dihitung server (bukan perkiraan) dan memberi saran perbaikan.

ATURAN OUTPUT (SANGAT PENTING):
- Balas HANYA satu objek JSON murni — TANPA markdown fence (\`\`\`), TANPA teks apa pun sebelum/sesudah JSON.
- Bentuk persis:
{"skor": <0-100 integer>, "readability": "MUDAH"|"SEDANG"|"SULIT", "masalah": ["…", "…"], "saran": "markdown string", "metaTitle": "…", "metaDescription": "…", "outline": ["…", "…"]}
- "skor": penilaian keseluruhan potensi SEO konten (0-100), berbasis density, panjang, penempatan keyword, struktur.
- "readability": MUDAH (kalimat pendek <15 kata), SEDANG (15-25), SULIT (>25) — patuhi metrik avgSentenceLength.
- "masalah": 3-6 string pendek, tiap item satu masalah spesifik yang terbukti dari metrik.
- "saran": markdown dengan seksi PERSIS berikut:
  ## 📊 Penilaian
  ## 🔧 Perbaikan On-Page
  (bernomor, aksionabl, WAJIB mengutip density/wordCount/panjang kalimat nyata)
  ## ✨ Saran Kalimat Pembuka
  (2-3 alternatif pembuka yang menyisipkan keyword alami)
  ## 🏗️ Struktur Ideal
  (susunan H2/H3 yang disarankan)
- "metaTitle": maksimal 60 karakter, memuat keyword, menggoda klik.
- "metaDescription": maksimal 155 karakter, memuat keyword + CTA.
- "outline": 4-8 saran heading H2/H3 (string, awali dengan "## " atau "### ").
- Bahasa Indonesia semua, kecuali istilah teknis.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const content = String(body.content ?? "");
    const keyword = String(body.keyword ?? "").trim();
    const judul = String(body.judul ?? "").trim();

    // ── Validasi input ──
    if (content.trim().length < 50) {
      return NextResponse.json({ error: "Konten minimal 50 karakter untuk bisa dianalisis." }, { status: 400 });
    }
    if (keyword.length < 2) {
      return NextResponse.json({ error: "Keyword minimal 2 karakter." }, { status: 400 });
    }

    // ── 1. Hitung metrik server-side ──
    const words = content.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Jumlah kemunculan keyword (case-insensitive, regex di-escape)
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const keywordCount = (content.match(new RegExp(escaped, "gi")) ?? []).length;

    // Density keyword (2 desimal)
    const density = wordCount > 0 ? Math.round((keywordCount / wordCount) * 100 * 100) / 100 : 0;

    // Rata-rata panjang kalimat (split pada . ! ?)
    const sentences = content
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const avgSentenceLength =
      sentences.length > 0 ? Math.round((wordCount / sentences.length) * 10) / 10 : wordCount;

    // Jumlah paragraf (dipisah baris kosong)
    const paragraphCount = content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean).length;

    // Deteksi heading (markdown # atau tag h1-h6)
    const hasHeadings =
      /^\s*#{1,6}\s+\S/m.test(content) || /<h[1-6]\b/i.test(content);

    // Estimasi waktu baca (200 kata/menit)
    const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200));

    const metrics = { wordCount, keywordCount, density, avgSentenceLength, paragraphCount, hasHeadings, readingTimeMinutes };

    // ── 2. Nilai AI + saran perbaikan ──
    let result: OptimizerResult = {
      skor: 60,
      readability: "SEDANG",
      masalah: [],
      saran: "",
      metaTitle: "",
      metaDescription: "",
      outline: [],
    };

    const userBlock = `JUDUL DRAF: ${judul || "(tidak ada)"}
KEYWORD TARGET: "${keyword}"

METRIK SERVER (SUMBER KEBENARAN — WAJIB dikutip dalam saran):
${JSON.stringify(metrics, null, 1)}

DRAF KONTEN:
"""
${content.slice(0, 8000)}
"""

Nilai konten ini dan balas JSON murni sesuai format.`;

    let rawAiText = "";
    try {
      const zai = await ZAI.create();
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: SYSTEM_PROMPT },
          { role: "user", content: userBlock },
        ],
        thinking: { type: "disabled" },
      });
      rawAiText = completion.choices[0]?.message?.content?.trim() || "";
    } catch (e) {
      console.error("SEO OPTIMIZE AI error:", e);
      rawAiText = "";
    }

    // ── 3. Parsing JSON tahan banting + sanitasi ──
    let parsedOk = false;
    if (rawAiText) {
      try {
        const stripped = rawAiText.replace(/```[a-zA-Z]*\n?/g, "").trim();
        const start = stripped.indexOf("{");
        const end = stripped.lastIndexOf("}");
        if (start === -1 || end === -1 || end <= start) throw new Error("Objek JSON tidak ditemukan");
        const p = JSON.parse(stripped.slice(start, end + 1)) as Record<string, unknown>;

        // Skor clamp 0-100
        let skor = Number(p.skor);
        if (!Number.isFinite(skor)) skor = 60;
        skor = Math.min(100, Math.max(0, Math.round(skor)));

        // Whitelist readability
        const readRaw = String(p.readability ?? "SEDANG").toUpperCase();
        const readability: OptimizerResult["readability"] =
          readRaw === "MUDAH" || readRaw === "SULIT" ? readRaw : "SEDANG";

        // Masalah: array string 3-6 item
        const masalah = Array.isArray(p.masalah)
          ? p.masalah.map((m) => String(m)).filter(Boolean).slice(0, 6)
          : [];

        // Saran markdown
        const saran = String(p.saran ?? "").trim();

        // Meta title ≤ 60, meta description ≤ 155
        const metaTitle = String(p.metaTitle ?? "").trim().slice(0, 60);
        const metaDescription = String(p.metaDescription ?? "").trim().slice(0, 155);

        // Outline: array string 4-8 item
        const outline = Array.isArray(p.outline)
          ? p.outline.map((o) => String(o)).filter(Boolean).slice(0, 8)
          : [];

        result = { skor, readability, masalah, saran, metaTitle, metaDescription, outline };
        parsedOk = Boolean(saran) && masalah.length > 0;
      } catch (e) {
        console.error("SEO OPTIMIZE parse error:", e, "| raw:", rawAiText.slice(0, 300));
        parsedOk = false;
      }
    }

    // ── 4. Fallback bila AI gagal / format rusak ──
    if (!parsedOk) {
      const idealDensity = density < 0.5 ? "naikkan" : density > 3 ? "turunkan" : "pertahankan";
      result = {
        skor: 60,
        readability: avgSentenceLength > 25 ? "SULIT" : avgSentenceLength >= 15 ? "SEDANG" : "MUDAH",
        masalah: [
          `Density keyword ${density}% (muncul ${keywordCount}x dari ${wordCount} kata) — ${idealDensity} ke rentang 0,5-2,5%.`,
          `Rata-rata kalimat ${avgSentenceLength} kata — pecah kalimat >25 kata agar mudah dibaca.`,
          hasHeadings ? "Struktur heading perlu diperdalam dengan variasi keyword." : "Belum ada heading — pecah konten dengan H2/H3.",
          wordCount < 300 ? `Konten baru ${wordCount} kata — targetkan minimal 600-1000 kata.` : `Panjang ${wordCount} kata — perkuat kedalaman sub-topik.`,
        ],
        saran:
          `## 📊 Penilaian\nKonten ${wordCount} kata, keyword "${keyword}" muncul ${keywordCount}x (density ${density}%), rata-rata kalimat ${avgSentenceLength} kata, ${paragraphCount} paragraf, waktu baca ±${readingTimeMinutes} menit.\n\n` +
          `## 🔧 Perbaikan On-Page\n1. ${idealDensity === "naikkan" ? "Tambah" : idealDensity === "turunkan" ? "Kurangi" : "Pertahankan"} pemakaian keyword "${keyword}" — ideal 0,5-2,5% dari total kata.\n2. Sisipkan keyword di 100 kata pertama dan di minimal satu H2.\n3. Pecah kalimat panjang (rata-rata sekarang ${avgSentenceLength} kata) menjadi kalimat 12-18 kata.\n4. Gunakan ${hasHeadings ? "heading yang lebih spesifik" : "H2/H3 untuk setiap sub-topik"} agar mudah dipindai.\n5. Tambahkan data, contoh, atau studi kasus untuk memperdalam konteks topik.\n\n` +
          `## ✨ Saran Kalimat Pembuka\n- "Mencari panduan lengkap soal ${keyword}? Artikel ini membedah tuntas langkah demi langkah."\n- "${keyword.charAt(0).toUpperCase() + keyword.slice(1)} bukan sekadar tren — ini cara memanfaatkannya dengan benar."\n\n` +
          `## 🏗️ Struktur Ideal\n- ## Apa itu ${keyword} (definisi singkat + konteks)\n- ## Mengapa ${keyword} Penting (data & manfaat)\n- ## Cara Melakukan ${keyword} (langkah bernomor)\n- ## Kesalahan Umum seputar ${keyword}\n- ## FAQ ${keyword} (3-5 pertanyaan)`,
        metaTitle: ((judul ? judul + " | " : "") + keyword).slice(0, 60),
        metaDescription: content.replace(/\s+/g, " ").trim().slice(0, 155),
        outline: [
          `## Apa itu ${keyword}`,
          `## Mengapa ${keyword} Penting`,
          `## Cara Melakukan ${keyword} (Langkah demi Langkah)`,
          `## Kesalahan Umum seputar ${keyword}`,
          `## FAQ tentang ${keyword}`,
        ],
      };
    }

    // ── 5. Gabungkan metrik + hasil AI ──
    return NextResponse.json({
      skor: result.skor,
      readability: result.readability,
      density,
      wordCount,
      readingTimeMinutes,
      keywordCount,
      avgSentenceLength,
      paragraphCount,
      hasHeadings,
      masalah: result.masalah,
      saran: result.saran,
      metaTitle: result.metaTitle,
      metaDescription: result.metaDescription,
      outline: result.outline,
    });
  } catch (e) {
    console.error("SEO OPTIMIZE POST error:", e);
    return NextResponse.json({ error: "Optimasi konten gagal: " + String(e) }, { status: 500 });
  }
}
