import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v8.0 — SEO MASTERY: COMPETITOR RADAR API
// POST   /api/seo/competitor → analisis strategis kompetitor via AI
//                              (estimasi berbasis pola industri — AI
//                              TIDAK punya akses data live & wajib
//                              menyatakannya) + simpan CompetitorReport
// GET    /api/seo/competitor?projectId=… → riwayat laporan (20 terakhir)
// DELETE /api/seo/competitor?id=… → hapus satu laporan
// ═══════════════════════════════════════════════════════════════════

export const maxDuration = 120;

// ── Prompt sistem: analis SEO strategis ──
const SYSTEM_PROMPT = `Anda adalah GUNARA Competitor Radar — analis SEO strategis dengan 150 tahun pengalaman kolektif Dewan 46.

CATATAN PENTING (WAJIB DIPATUHI): Anda tidak punya akses data live (tidak bisa crawl situs, lihat backlink, atau metric real-time).
Semua analisis Anda adalah ESTIMASI STRATEGIS berdasarkan pola umum industri dan best practice SEO. NYATAKAN secara eksplisit
di awal laporan bahwa ini analisis estimasi yang harus divalidasi dengan data tools (Ahrefs/Semrush/Search Console).

GAYA:
- Bahasa Indonesia, markdown, tajam dan aksionabl seperti konsultan senior.
- Tidak basa-basi, langsung ke taktik yang bisa dieksekusi.

FORMAT (ikuti persis, markdown):
## 🎯 Profil Kompetitor
(profil 3-5 kalimat + tabel kecil estimasi: kekuatan domain, fokus konten, kanal utama)
## 💪 Kekuatan (Kemungkinan Besar)
(4-6 bullet kekuatan yang hampir pasti dimiliki kompetitor mapan)
## 🕳️ Celah yang Bisa Diserang
(4-6 bullet celah spesifik beserta cara mengeksploitasinya)
## 🔑 Peluang Keyword Gap
(tabel markdown 8-10 baris: | Keyword | Jenis | Cara Menang | — kolom "Jenis" = head/long-tail/commercial, kolom "Cara Menang" = taktik konkret)
## 🔗 Taktik Backlink
(4-6 taktik membangun backlink yang realistis untuk pasar Indonesia: media lokal, direktori, guest post, digital PR)
## 📅 Rencana Serangan 90 Hari
### Bulan 1 — Fondasi
### Bulan 2 — Ofensif
### Bulan 3 — Dominasi
(setiap bulan 3-4 bullet target terukur)
## ⚠️ Jangan Lakukan Ini
(3-5 anti-pattern yang justru menguntungkan kompetitor)`;

// ── Normalisasi domain: buang protokol/path, validasi bentuk dasar ──
function normalizeDomain(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const projectId = String(body.projectId ?? "");
    const domain = normalizeDomain(String(body.domain ?? ""));
    const myDomain = normalizeDomain(String(body.myDomain ?? ""));

    // Validasi domain sederhana (harus ada titik + TLD)
    if (!/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(domain)) {
      return NextResponse.json(
        { error: "Domain kompetitor tidak valid. Contoh: kompetitor.co.id" },
        { status: 400 }
      );
    }

    const userBlock = `DOMAIN KOMPETITOR: ${domain}
DOMAIN SAYA: ${myDomain || "(belum ditentukan — beri saran generik yang tetap aksionabl)"}

Buat laporan analisis strategis lengkap sesuai format. Ingat: ini ESTIMASI STRATEGIS — nyatakan di awal bahwa
angka perlu divalidasi dengan tools data nyata.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: SYSTEM_PROMPT },
        { role: "user", content: userBlock },
      ],
      thinking: { type: "disabled" },
    });
    const hasil = completion.choices[0]?.message?.content?.trim() || "";

    if (!hasil) {
      return NextResponse.json(
        { error: "Radar belum bisa memancarkan analisis. Coba sekali lagi." },
        { status: 502 }
      );
    }

    const item = await db.competitorReport.create({
      data: {
        projectId,
        domain,
        myDomain,
        hasil,
      },
    });

    return NextResponse.json({ item });
  } catch (e) {
    console.error("SEO COMPETITOR POST error:", e);
    return NextResponse.json({ error: "Analisis kompetitor gagal: " + String(e) }, { status: 500 });
  }
}

// ── Riwayat laporan kompetitor (maks 20 terbaru) ──
export async function GET(req: Request) {
  try {
    const projectId = new URL(req.url).searchParams.get("projectId");
    const items = await db.competitorReport.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ items });
  } catch (e) {
    console.error("SEO COMPETITOR GET error:", e);
    return NextResponse.json({ items: [] });
  }
}

// ── Hapus satu laporan kompetitor ──
export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id wajib" }, { status: 400 });
    await db.competitorReport.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
