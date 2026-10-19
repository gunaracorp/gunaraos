import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import { DEWAN, councilsByIds, TOTAL_YEARS } from "@/lib/dewan";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v6.0 — ULTIMATE SOLVER API
// POST /api/solver → sidang Dewan 46 (AI) + simpan putusan
// GET  /api/solver → riwayat konsultasi (30 terakhir)
// DELETE /api/solver?id=… → hapus satu riwayat
// ═══════════════════════════════════════════════════════════════════
// Persona: Master Polymath · Sage Universal · The Ultimate Problem
// Solver — by Gugun Gunara (Muhammad Lutfi Azmi · prabudanling ·
// Santri Angon · PT Top Konsultan Internasional · PT Digital Bisnis
// Manajemen)
// ═══════════════════════════════════════════════════════════════════

export const maxDuration = 120;

function buildSystemPrompt(councilIds: string[]): string {
  const chosen = councilsByIds(councilIds);
  const dewanBlock = chosen.length
    ? chosen
        .map(
          (c) =>
            `### Dewan ${c.no}: ${c.name} (${c.group} · ${c.years} tahun kolektif)\n` +
            `- Keahlian: ${c.specialties.join("; ")}\n` +
            `- Kerangka kerja: ${c.framework.join(" → ")}\n` +
            `- Moto: "${c.motto}"`
        )
        .join("\n\n")
    : "(Tidak ada dewan spesifik — gunakan penilaian lintas bidang terbaik.)";

  return `Anda adalah GUNARA OS v6.0 — inkarnasi digital dari Gugun Gunara (Muhammad Lutfi Azmi):
MASTER POLYMATH · SAGE UNIVERSAL · THE ULTIMATE PROBLEM SOLVER.

Anda memimpin DEWAN 46: 46 dewan pakar lintas bidang — total ${TOTAL_YEARS.toLocaleString("id-ID")} tahun
pengalaman kolektif. Setiap dewan beranggotakan arketipe legendaris dengan 150+ tahun pengalaman gabungan.

DEWAN YANG SEDANG BERSIDANG:
${dewanBlock}

GAYA MENJAWAB (WAJIB):
- Bahasa Indonesia yang tegas, hangat, dan berwibawa seperti sage — tidak bertele-tele, tidak basa-basi.
- Setiap saran harus AKSIONABL: langkah konkret, angka, tenggat, atau contoh nyata.
- Hormati konteks Indonesia: Rupiah, WIB, hukum & birokrasi Indonesia, nilai santri-entrepreneur.
- Kejujuran kasih sayang: jika idemu lemah, katakan tegas dan berikan yang lebih kuat.
- Jangan pernah mengarang data; jika perlu data yang belum ada, sebutkan sebagai "yang harus diverifikasi".

FORMAT PUTUSAN (ikuti persis, markdown):
## ⚖️ Putusan Dewan
(2-3 kalimat diagnosis tajam — sebutkan inti masalah sebenarnya)
## 🔍 Akar Masalah
(3-5 bullet akar masalah, bukan gejala)
## 🏛️ Perspektif Dewan
(untuk SETIAP dewan yang bersidang:)
### <Nama Dewan> · <tahun> tahun
(2-3 bullet insight khas keahlian dewan tersebut)
## 🧭 Solusi Berlapis
### Segera — 48 jam
(2-4 bullet)
### 30 Hari
(2-4 bullet)
### 90 Hari
(2-4 bullet)
## ⚠️ Risiko & Benteng
(3 bullet: risiko + cara menahannya)
## 📿 Ritual Eksekusi
(checklist 5 langkah harian/mingguan)
## 🖋️ Tanda Tangan Dewan
(1-2 kalimat penutup bijak, akhiri dengan baris: "Ditetapkan dalam sidang Dewan 46 — GUNARA OS v6.0 · by Gugun Gunara")`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const problem = String(body.problem ?? "").trim();
    const kategori = String(body.kategori ?? "umum");
    const urgensi = String(body.urgensi ?? "rutinitas");
    const ids: string[] = Array.isArray(body.dewan) ? body.dewan.slice(0, 8).map(String) : [];

    if (problem.length < 10) {
      return NextResponse.json({ error: "Ceritakan masalahmu minimal 10 karakter agar Dewan bisa bersidang." }, { status: 400 });
    }

    const chosen = councilsByIds(ids);
    const unknown = ids.filter((id) => !DEWAN.some((d) => d.id === id));
    if (unknown.length) {
      return NextResponse.json({ error: `Dewan tidak dikenal: ${unknown.join(", ")}` }, { status: 400 });
    }

    const urgensiLine =
      urgensi === "eksistensial"
        ? "URGENSI: EKSISTENSIAL — nyawa bisnis/keluarga dipertaruhkan. Utamakan benteng & langkah penyelamatan."
        : urgensi === "krusial"
          ? "URGENSI: KRUSIAL — menentukan kuartal ini. Utamakan eksekusi 30 hari."
          : "URGENSI: RUTINITAS — masalah pertumbuhan. Utamakan sistem & kebiasaan.";

    const userBlock = `KATEGORI: ${kategori}
${urgensiLine}

MASALAH YANG DIAJUKAN KEPADA DEWAN 46:
"""
${problem.slice(0, 6000)}
"""

Sidangkan Dewan 46 sekarang. Berikan putusan lengkap sesuai format.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: buildSystemPrompt(chosen.map((c) => c.id)) },
        { role: "user", content: userBlock },
      ],
      thinking: { type: "disabled" },
    });

    const putusan = completion.choices[0]?.message?.content?.trim() || "";
    if (!putusan) {
      return NextResponse.json({ error: "Dewan belum dapat mengeluarkan putusan. Coba sekali lagi." }, { status: 502 });
    }

    const item = await db.consultation.create({
      data: {
        problem,
        kategori,
        urgensi,
        dewan: JSON.stringify(chosen.map((c) => c.id)),
        putusan,
        status: "selesai",
      },
    });

    return NextResponse.json({ item });
  } catch (e) {
    console.error("SOLVER POST error:", e);
    return NextResponse.json({ error: "Sidang gagal dipanggil: " + String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const items = await db.consultation.findMany({ orderBy: { createdAt: "desc" }, take: 30 });
    return NextResponse.json({ items });
  } catch (e) {
    console.error("SOLVER GET error:", e);
    return NextResponse.json({ items: [] });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id wajib" }, { status: 400 });
    await db.consultation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
