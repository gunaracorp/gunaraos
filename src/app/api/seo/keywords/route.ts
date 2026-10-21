import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v8.0 — SEO MASTERY: KEYWORD ENGINE API
// POST   /api/seo/keywords → riset 30 ide keyword via AI (JSON ketat,
//                            disanitasi server) + simpan ke KeywordIdea
// GET    /api/seo/keywords?projectId=… → daftar ide keyword (100 terakhir)
// PATCH  /api/seo/keywords {id, dipakai} → toggle status dipakai
// ═══════════════════════════════════════════════════════════════════
// AI diminta mengembalikan JSON array MURNI (tanpa markdown fence).
// Parser server dibuat tahan banting: buang fence, ambil `[` pertama
// sampai `]` terakhir, lalu sanitasi tiap elemen satu per satu.
// ═══════════════════════════════════════════════════════════════════

export const maxDuration = 120;

// ── Whitelist intent & prioritas ──
const INTENTS = ["informational", "commercial", "transactional", "navigational"] as const;
type Intent = (typeof INTENTS)[number];

interface SanitizedIdea {
  seed: string;
  keyword: string;
  intent: Intent;
  cluster: string;
  difficulty: number;
  volume: number;
  prioritas: "TINGGI" | "SEDANG" | "RENDAH";
}

// ── Prompt sistem: mesin riset keyword kelas dunia ──
const SYSTEM_PROMPT = `Anda adalah GUNARA Keyword Engine — mesin riset keyword SEO kelas dunia dengan data historis pasar Indonesia.
Tugas Anda: menghasilkan 30 ide keyword di SEKELAR seed yang diberikan, untuk industri & pasar Indonesia.

ATURAN OUTPUT (SANGAT PENTING):
- Balas HANYA JSON array murni — TANPA markdown fence (\`\`\`), TANPA penjelasan, TANPA teks apa pun sebelum/sesudah array.
- Tepat 30 elemen, setiap elemen objek dengan kunci:
  {"keyword": string, "intent": "informational"|"commercial"|"transactional"|"navigational", "cluster": string, "difficulty": number, "volume": number, "prioritas": "TINGGI"|"SEDANG"|"RENDAH"}
- "cluster": label pendek bahasa Indonesia (mis. "Tutorial", "Perbandingan", "Harga", "Vendor", "Definisi", "Lokal").
- "difficulty": 0-100 (integer) — makin tinggi makin kompetitif.
- "volume": estimasi realistis pencarian bulanan untuk pasar INDONESIA (head term ribuan, long-tail puluhan-ratusan).
- "prioritas": TINGGI bila difficulty rendah & volume bagus; RENDAH bila difficulty sangat tinggi atau volume kecil.

STRATEGI KEYWORD:
- Campuran: ±8 head term, ±22 long-tail (3-6 kata) yang benar-benar diketik orang Indonesia.
- Bahasa Indonesia natural (gaya orang mencari di Google, boleh campur istilah Inggris yang umum di Indonesia).
- Cakup semua intent: informational, commercial, transactional, navigational.
- Hindari duplikat dan variasi trivial yang identik.`;

// ── Sanitasi satu ide keyword mentah dari AI ──
function sanitizeIdea(raw: unknown, seed: string): SanitizedIdea | null {
  const r = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const keyword = String(r.keyword ?? "").trim().slice(0, 200);
  if (!keyword) return null;

  // Whitelist intent — fallback ke informational
  const intentRaw = String(r.intent ?? "informational").toLowerCase().trim();
  const intent: Intent = (INTENTS as readonly string[]).includes(intentRaw)
    ? (intentRaw as Intent)
    : "informational";

  const cluster = String(r.cluster ?? "").trim().slice(0, 80) || "Umum";

  // Clamp integer difficulty 0-100
  let difficulty = Number(r.difficulty);
  if (!Number.isFinite(difficulty)) difficulty = 50;
  difficulty = Math.min(100, Math.max(0, Math.round(difficulty)));

  // Clamp integer volume ≥ 0
  let volume = Number(r.volume);
  if (!Number.isFinite(volume)) volume = 0;
  volume = Math.max(0, Math.min(5_000_000, Math.round(volume)));

  // Prioritas: whitelist, bila tidak valid turunkan dari difficulty+volume
  const prioritasRaw = String(r.prioritas ?? "").toUpperCase().trim();
  const prioritas: SanitizedIdea["prioritas"] =
    prioritasRaw === "TINGGI" || prioritasRaw === "SEDANG" || prioritasRaw === "RENDAH"
      ? prioritasRaw
      : difficulty < 40 && volume > 500
        ? "TINGGI"
        : difficulty > 70
          ? "RENDAH"
          : "SEDANG";

  return { seed, keyword, intent, cluster, difficulty, volume, prioritas };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const seed = String(body.seed ?? "").trim();
    const projectId = String(body.projectId ?? "");
    const industri = String(body.industri ?? "").trim() || "umum";
    const negara = String(body.negara ?? "id").trim() || "id";

    // Validasi seed minimal 2 karakter
    if (seed.length < 2) {
      return NextResponse.json({ error: "Seed keyword minimal 2 karakter." }, { status: 400 });
    }

    // Panggil AI
    const userBlock = `SEED: "${seed}"
INDUSTRI/BISNIS: ${industri}
PASAR: ${negara === "id" ? "Indonesia (Google.co.id, bahasa Indonesia)" : negara}

Hasilkan 30 ide keyword sesuai aturan. Balas JSON array murni saja.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: SYSTEM_PROMPT },
        { role: "user", content: userBlock },
      ],
      thinking: { type: "disabled" },
    });
    const text = completion.choices[0]?.message?.content?.trim() || "";

    // ── Parsing tahan banting ──
    let items: SanitizedIdea[] = [];
    try {
      const stripped = text.replace(/```[a-zA-Z]*\n?/g, "").trim();
      const start = stripped.indexOf("[");
      const end = stripped.lastIndexOf("]");
      if (start === -1 || end === -1 || end <= start) throw new Error("Array JSON tidak ditemukan");
      const parsed: unknown = JSON.parse(stripped.slice(start, end + 1));
      if (!Array.isArray(parsed)) throw new Error("Bukan array");
      items = parsed
        .map((raw) => sanitizeIdea(raw, seed))
        .filter((i): i is SanitizedIdea => i !== null)
        .slice(0, 30);
    } catch (e) {
      console.error("SEO KEYWORDS parse error:", e, "| raw:", text.slice(0, 300));
      return NextResponse.json(
        { error: "AI mengembalikan format yang tidak bisa diparse. Coba ulangi riset." },
        { status: 502 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: "AI tidak menghasilkan keyword valid. Coba seed lain atau ulangi." },
        { status: 502 }
      );
    }

    // Simpan ke DB bila terhubung ke proyek
    if (projectId) {
      await db.keywordIdea.createMany({
        data: items.map((i) => ({
          projectId,
          seed: i.seed,
          keyword: i.keyword,
          intent: i.intent,
          cluster: i.cluster,
          difficulty: i.difficulty,
          volume: i.volume,
          prioritas: i.prioritas,
        })),
      });
    }

    return NextResponse.json({ items });
  } catch (e) {
    console.error("SEO KEYWORDS POST error:", e);
    return NextResponse.json({ error: "Riset keyword gagal: " + String(e) }, { status: 500 });
  }
}

// ── Daftar ide keyword tersimpan (maks 100 terbaru) ──
export async function GET(req: Request) {
  try {
    const projectId = new URL(req.url).searchParams.get("projectId");
    const items = await db.keywordIdea.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ items });
  } catch (e) {
    console.error("SEO KEYWORDS GET error:", e);
    return NextResponse.json({ items: [] });
  }
}

// ── Toggle status dipakai pada satu ide keyword ──
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id ?? "");
    if (!id) return NextResponse.json({ error: "id wajib" }, { status: 400 });
    const item = await db.keywordIdea.update({
      where: { id },
      data: { dipakai: Boolean(body.dipakai) },
    });
    return NextResponse.json({ item });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
