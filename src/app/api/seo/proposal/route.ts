import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v8.0 — SEO MASTERY: PROPOSAL GENERATOR API
// POST   /api/seo/proposal → proposal komersial SEO profesional siap
//                            kirim klien (AI) + simpan SeoProposal
// GET    /api/seo/proposal?projectId=… → riwayat proposal (20 terakhir)
// DELETE /api/seo/proposal?id=… → hapus satu proposal
// ═══════════════════════════════════════════════════════════════════
// Proposal hanya memuat LAYANAN YANG DIPILIH user — tidak pernah
// menambahkan layanan di luar scope yang diminta.
// ═══════════════════════════════════════════════════════════════════

export const maxDuration = 120;

// ── Prompt sistem: direktur PT Top Konsultan Internasional ──
const SYSTEM_PROMPT = `Anda adalah direktur PT Top Konsultan Internasional — konsultan SEO #1 dengan 150 tahun pengalaman
kolektif Dewan 46. Anda menulis proposal komersial profesional yang siap dikirim langsung ke klien.

GAYA:
- Bahasa Indonesia formal, persuasif, dan berwibawa — nada konsultan premium, bukan sales keras.
- Markdown rapi siap cetak/kirim PDF. Persuasi lewat nilai & bukti, bukan janji muluk.
- Jangan menjanjikan ranking #1 secara literal — janjikan proses, transparansi, dan target terukur.

FORMAT (ikuti persis, markdown):
# 📄 Proposal Layanan SEO
(subjudul: untuk [klien] · [domain] · tanggal penyusunan)

## Ringkasan Eksekutif
(3-4 kalimat: situasi klien, apa yang kami tawarkan, hasil yang diharapkan)

## Diagnosis Awal
(bedahkan masalah yang klien sampaikan — 3-5 bullet akar masalah & dampak bisnisnya)

## Ruang Lingkup Layanan
(HANYA layanan yang dipilih klien — satu sub-seksi ### per layanan, masing-masing berisi
penjelasan singkat + bullet deliverables konkret yang akan diterima klien)

## Metodologi 90 Hari
### Fase 1 (Hari 1-30) — Fondasi & Audit
### Fase 2 (Hari 31-60) — Eksekusi & Optimasi
### Fase 3 (Hari 61-90) — Penguatan & Skala
(setiap fase 3-4 bullet aktivitas + output)

## KPI & Pelaporan
(metrik yang dilaporkan, frekuensi laporan, kanal komunikasi)

## Investasi
(sebutkan anggaran klien sebagai paket — rangkum apa saja yang tercakup, tanpa tabel harga rinci)
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const projectId = String(body.projectId ?? "");
    const klien = String(body.klien ?? "").trim();
    const domain = String(body.domain ?? "").trim();
    const masalah = String(body.masalah ?? "").trim();
    const anggaran = String(body.anggaran ?? "").trim();

    // Sanitasi daftar layanan — harus array non-kosong
    const layanan: string[] = Array.isArray(body.layanan)
      ? body.layanan.map((l: unknown) => String(l).trim()).filter(Boolean)
      : [];

    // Validasi input wajib
    if (klien.length < 2) {
      return NextResponse.json({ error: "Nama klien minimal 2 karakter." }, { status: 400 });
    }
    if (layanan.length === 0) {
      return NextResponse.json({ error: "Pilih minimal satu layanan untuk proposal." }, { status: 400 });
    }

    const userBlock = `NAMA KLIEN: ${klien}
DOMAIN/WEBSITE: ${domain || "(belum ada)"}
MASALAH YANG DISAMPAIKAN KLIEN:
"""
${masalah || "(tidak dijelaskan — buat diagnosis awal umum berdasarkan industri)"}
"""
ANGGARAN KLIEN: ${anggaran || "(belum disebutkan — posisikan investasi sebagai paket menyesuaikan)"}
LAYANAN DIPILIH (WAJIB: proposal hanya mencakup layanan-layanan ini):
${layanan.map((l) => `- ${l}`).join("\n")}

Susun proposal komersial lengkap siap kirim sesuai format.`;

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
        { error: "Proposal belum berhasil disusun. Coba sekali lagi." },
        { status: 502 }
      );
    }

    const item = await db.seoProposal.create({
      data: {
        projectId,
        klien,
        domain,
        masalah,
        anggaran,
        layanan: JSON.stringify(layanan),
        hasil,
      },
    });

    return NextResponse.json({ item });
  } catch (e) {
    console.error("SEO PROPOSAL POST error:", e);
    return NextResponse.json({ error: "Penyusunan proposal gagal: " + String(e) }, { status: 500 });
  }
}

// ── Riwayat proposal (maks 20 terbaru) ──
export async function GET(req: Request) {
  try {
    const projectId = new URL(req.url).searchParams.get("projectId");
    const items = await db.seoProposal.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ items });
  } catch (e) {
    console.error("SEO PROPOSAL GET error:", e);
    return NextResponse.json({ items: [] });
  }
}

// ── Hapus satu proposal ──
export async function DELETE(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id wajib" }, { status: 400 });
    await db.seoProposal.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
