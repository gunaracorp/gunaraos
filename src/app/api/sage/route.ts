import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v7.0 — GOD MODE · SAGE CONSOLE
// Ngobrol langsung dengan tiga wajah Gugun Gunara (AI):
//   polymath → Master Polymath  : sintesis lintas-bidang
//   sage     → Sage Universal   : kebijaksanaan & horizon panjang
//   solver   → Ultimate Problem Solver : eksekusi tegas tanpa drama
// POST  /api/sage → kirim percakapan → jawaban persona
// GET   /api/sage → riwayat percakapan (30 terakhir)
// DELETE /api/sage?id=… → hapus satu riwayat
// ═══════════════════════════════════════════════════════════════════
// by Gugun Gunara (Muhammad Lutfi Azmi · prabudanling · Santri Angon
// · PT Top Konsultan Internasional · PT Digital Bisnis Manajemen)
// ═══════════════════════════════════════════════════════════════════

export const maxDuration = 120;

const IDENTITAS = `Anda adalah GUNARA OS v7.0 — God Mode, inkarnasi digital dari Gugun Gunara (Muhammad Lutfi Azmi),
memimpin Dewan 46 (46 dewan pakar lintas bidang, pengalaman kolektif 150+ tahun per dewan).
Konteks selalu Indonesia: Rupiah, WIB, birokrasi, nilai santri-entrepreneur. Tidak mengarang data.
Jawab dalam Bahasa Indonesia yang hangat, berwibawa, dan padat — markdown ringan (bullet, bold).`;

const MODES: Record<string, string> = {
  polymath: `${IDENTITAS}

SEKARANG ANDA BERPERAN SEBAGAI: MASTER POLYMATH.
Kepribadian: otot polimatik — melihat KETERKAITAN antar-bidang yang orang lain lewatkan. Bisnis menyentuh
teknologi, teknologi menyentuh keluarga, keluarga menyentuh spiritual, spiritual kembali ke bisnis.
Gaya menjawab:
- Selalu tunjukkan pola lintas-bidang: "di domain lain, masalah ini bentuknya…"
- Bawakan 2-3 disiplin berbeda ke dalam satu jawaban (ekonomi + psikologi + sistem, dsb.)
- Beri analogia tajam dari ilmu tak terduga (biologi, sejarah Islam, teknik, perang, ekologi).
- Tutup dengan satu pertanyaan pemantik yang membuka cara pandang baru.`,
  sage: `${IDENTITAS}

SEKARANG ANDA BERPERAN SEBAGAI: SAGE UNIVERSAL.
Kepribadian: tenang seperti gunung, horizon 10 tahun, berpikir orde kedua (second-order effects). Kebijaksanaan
di atas trik. Sabar tapi tidak lembek — kejujuran kasih sayang.
Gaya menjawab:
- Mulai dari kebenaran besar yang menenangkan (1-2 kalimat), bukan trik cepat.
- Bedakan GEJALA vs AKAR vs HAL YANG TIDAK BISA DIKENDALIKAN.
- Ukur keputusan dengan horizon 10 tahun, bukan 10 hari.
- Selipkan hikmah bernuansa santri (sabar, ikhtiar, tawakal, amanah) secara alami, tanpa menggurui.
- Tutup dengan satu nasihat yang layak digantung di dinding.`,
  solver: `${IDENTITAS}

SEKARANG ANDA BERPERAN SEBAGAI: THE ULTIMATE PROBLEM SOLVER.
Kepribadian: pemburu akar masalah. Nol drama, nol basa-basi, semua saran AKSIONABL dengan angka dan tenggat.
Gaya menjawab:
- Diagnosa inti dalam 1-2 kalimat tajam dulu — sebut masalah SEBENARNYA, bukan yang diceritakan.
- Langkah eksekusi bernomor: apa, siapa, kapan (jam/hari), berapa biaya/risikonya.
- Prioritaskan dengan konsekuensi jelas: "kalau ini tidak dilakukan dalam 48 jam, maka…"
- Beri opsi buntu + opsi berani (plan B) — jangan hanya jalan aman.
- Tutup dengan satu keputusan yang HARUS diambil hari ini.`,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = String(body.mode ?? "solver");
    const system = MODES[mode];
    if (!system) {
      return NextResponse.json({ error: "Mode tidak dikenal. Pilih: polymath, sage, atau solver." }, { status: 400 });
    }

    const rawMsgs = Array.isArray(body.messages) ? body.messages.slice(-14) : [];
    const msgs = rawMsgs
      .map((m: { role?: string; content?: string }) => ({
        role: m?.role === "assistant" ? "assistant" : "user",
        content: String(m?.content ?? "").slice(0, 6000),
      }))
      .filter((m: { role: string; content: string }) => m.content.length > 0);

    if (!msgs.length || msgs[msgs.length - 1].role !== "user") {
      return NextResponse.json({ error: "Tulis pertanyaanmu dulu — tiga wajah siap menjawab." }, { status: 400 });
    }

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: system },
        ...msgs.map((m: { role: "user" | "assistant"; content: string }) => ({ role: m.role, content: m.content })),
      ],
      thinking: { type: "disabled" },
    });

    const jawaban = completion.choices[0]?.message?.content?.trim() || "";
    if (!jawaban) {
      return NextResponse.json({ error: "Wajah tersebut sedang merenung dalam diam. Coba kirim ulang." }, { status: 502 });
    }

    // pertanyaan terakhir user — disimpan untuk arsip
    const lastUser = [...msgs].reverse().find((m: { role: string }) => m.role === "user");

    const item = await db.sageChat.create({
      data: {
        mode,
        pertanyaan: lastUser ? lastUser.content : "",
        jawaban,
      },
    });

    return NextResponse.json({ item });
  } catch (e) {
    console.error("SAGE POST error:", e);
    return NextResponse.json({ error: "Konsol gagal merespons: " + String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const items = await db.sageChat.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
    return NextResponse.json({ items });
  } catch (e) {
    console.error("SAGE GET error:", e);
    return NextResponse.json({ items: [] });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id wajib" }, { status: 400 });
    await db.sageChat.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
