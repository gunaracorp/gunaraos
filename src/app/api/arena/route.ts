import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import { DEWAN, councilsByIds, TOTAL_YEARS } from "@/lib/dewan";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v7.0 — GOD MODE · ARENA DEBAT DEWAN
// POST /api/arena → 2–4 dewan berdebat 2 ronde, lalu diarbitrase
// GET  /api/arena → riwayat debat (30 terakhir)
// DELETE /api/arena?id=… → hapus satu riwayat
// ═══════════════════════════════════════════════════════════════════
// Persona arbiter: Master Polymath · Sage Universal · The Ultimate
// Problem Solver — by Gugun Gunara (Muhammad Lutfi Azmi · prabudanling
// · Santri Angon · PT Top Konsultan Internasional · PT Digital Bisnis
// Manajemen)
// ═══════════════════════════════════════════════════════════════════

export const maxDuration = 180;

const PEMISAH = "===PUTUSAN-ARBITER===";

function buildDebatePrompt(councilIds: string[]): string {
  const chosen = councilsByIds(councilIds);
  const dewanBlock = chosen
    .map(
      (c) =>
        `### Dewan ${c.no}: ${c.name} (${c.group} · ${c.years} tahun kolektif)\n` +
        `- Keahlian: ${c.specialties.join("; ")}\n` +
        `- Kerangka kerja: ${c.framework.join(" → ")}\n` +
        `- Moto: "${c.motto}"`
    )
    .join("\n\n");

  return `Anda adalah moderator ARENA DEBAT dari GUNARA OS v7.0 — God Mode, inkarnasi digital Gugun Gunara
(Muhammad Lutfi Azmi): MASTER POLYMATH · SAGE UNIVERSAL · THE ULTIMATE PROBLEM SOLVER.

Di arena ini, beberapa dewan dari DEWAN 46 (total ${TOTAL_YEARS.toLocaleString("id-ID")} tahun pengalaman kolektif)
akan BERDEBAT SECARA AKTIF tentang satu permasalahan. Ini bukan konsultasi serasi — ini dialektika: setiap dewan
punya sudut pandang, prioritas, dan kefanatikan sendiri. Perbedaan pendapat HARUS nyata dan tajam.

PESERTA DEBAT:
${dewanBlock}

ATURAN SIMULASI (WAJIB):
- Setiap dewan dijawab DENGAN SUARANYA SENDIRI — khas keahlian, khas kepribadian, khas kepentingan.
- Ronde 1: posisi awal. Ronde 2: SERANGAN SILANG — tiap dewan menyerang titik terlemah dewan lain SEKALIGUS
  membela posisinya. Sebutkan dewan lawan secara eksplisit ("Dewan X keliru karena…").
- Saling serang GAGASAN, bukan karikatur. Tetap berwibawa, tanpa basa-basi, tanpa diplomacy kosong.
- Konteks Indonesia: Rupiah, WIB, birokrasi, nilai santri-entrepreneur. Tidak mengarang data — sebut "yang
  harus diverifikasi" bila perlu.

FORMAT KELUARAN (ikuti persis, markdown):

## 🥊 RONDE 1 — Posisi Awal
### <Nama Dewan> — <sikap 1 baris>
(2-3 bullet posisi: rekomendasi utama + alasan inti)

## ⚔️ RONDE 2 — Serangan Silang
### <Nama Dewan> menyerang
(bullet: serangan ke dewan lain — sebut nama dewan yang diserang)
(untuk SETIAP peserta, minimal 1 serangan)

${PEMISAH}

## ⚖️ PUTUSAN ARBITER
(Sebagai Master Polymath · Sage Universal · The Ultimate Problem Solver, potong debat dan putuskan:)
1. **Argumen menang & alasannya** (1 paragraf)
2. **Sintesis terbaik** — gabungkan kebenaran tiap dewan jadi satu keputusan akhir (1 paragraf)
3. **Eksekusi**: Segera 48 jam / 30 hari / 90 hari (bullet masing-masing)
4. **Risiko kalah debat yang tetap harus dijaga** (2 bullet)

Akhiri putusan dengan baris: "Diadili dalam Arena Debat — GUNARA OS v7.0 · by Gugun Gunara"`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const problem = String(body.problem ?? "").trim();
    const topik = String(body.topik ?? "umum");
    const ids: string[] = Array.isArray(body.dewan) ? body.dewan.map(String) : [];

    if (problem.length < 10) {
      return NextResponse.json({ error: "Permasalahan minimal 10 karakter agar arena bisa dipanaskan." }, { status: 400 });
    }

    const chosen = councilsByIds(ids);
    if (chosen.length < 2) {
      return NextResponse.json({ error: "Pilih minimal 2 dewan — arena debat butuh setidaknya dua sudut pandang." }, { status: 400 });
    }
    if (chosen.length > 4) {
      return NextResponse.json({ error: "Maksimal 4 dewan per sidang arena — biarkan tiap suara punya ruang." }, { status: 400 });
    }
    const unknown = ids.filter((id) => !DEWAN.some((d) => d.id === id));
    if (unknown.length) {
      return NextResponse.json({ error: `Dewan tidak dikenal: ${unknown.join(", ")}` }, { status: 400 });
    }

    const userBlock = `TOPIK: ${topik}

PERMASALAHAN YANG DIPERTIKAIKAN DI ARENA:
"""
${problem.slice(0, 6000)}
"""

Panggil arena sekarang: Ronde 1 posisi awal → Ronde 2 serangan silang → ${PEMISAH} → Putusan Arbiter.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: buildDebatePrompt(chosen.map((c) => c.id)) },
        { role: "user", content: userBlock },
      ],
      thinking: { type: "disabled" },
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    if (!raw) {
      return NextResponse.json({ error: "Arena belum menghasilkan debat. Coba sekali lagi." }, { status: 502 });
    }

    const idx = raw.indexOf(PEMISAH);
    const transkrip = idx >= 0 ? raw.slice(0, idx).trim() : raw;
    const putusan = idx >= 0 ? raw.slice(idx + PEMISAH.length).trim() : "";

    const item = await db.debate.create({
      data: {
        problem,
        topik,
        dewan: JSON.stringify(chosen.map((c) => c.id)),
        transkrip,
        putusan,
        ronde: 2,
        status: "selesai",
      },
    });

    return NextResponse.json({ item });
  } catch (e) {
    console.error("ARENA POST error:", e);
    return NextResponse.json({ error: "Arena gagal dipanggil: " + String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const items = await db.debate.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
    return NextResponse.json({ items });
  } catch (e) {
    console.error("ARENA GET error:", e);
    return NextResponse.json({ items: [] });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id wajib" }, { status: 400 });
    await db.debate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
