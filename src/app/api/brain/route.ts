import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

/**
 * 🧠 AI Ringkasan Second Brain — POST /api/brain
 * Body: { isi: string, judul?: string, kategori?: string }
 * Return: { ringkasan, poin[], kategori, tags[], koneksi[] }
 * Tidak menyimpan apa pun — saran ditampilkan, pengguna yang memutuskan.
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isi = String(body?.isi || "").trim();
    if (!isi) return NextResponse.json({ error: "Isi catatan kosong" }, { status: 400 });

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Kamu asisten berpikir polimatik untuk Second Brain milik seorang polymath Indonesia. " +
            "Analisis catatan pengguna dan jawab HANYA dengan JSON valid tanpa markdown, bentuk: " +
            '{"ringkasan":"1 kalimat","poin":["3 poin kunci"],"kategori":"IDE|INSIGHT|KUTIPAN|RENCANA|BELAJAR|LAIN","tags":["maks 5 tag"],"koneksi":["2 koneksi lintas-bidang yang tidak kelihatan"]}. ' +
            "Bahasa Indonesia, ringkas, tajam, tanpa basa-basi.",
        },
        {
          role: "user",
          content: `Judul: ${String(body?.judul || "(tanpa judul)")}\nKategori terpilih: ${String(body?.kategori || "-")}\nIsi catatan:\n${isi}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ error: "AI tidak mengembalikan JSON" }, { status: 502 });
    const parsed = JSON.parse(match[0]);

    return NextResponse.json({
      ringkasan: String(parsed.ringkasan || ""),
      poin: Array.isArray(parsed.poin) ? parsed.poin.slice(0, 5).map(String) : [],
      kategori: String(parsed.kategori || "").toUpperCase(),
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8).map(String) : [],
      koneksi: Array.isArray(parsed.koneksi) ? parsed.koneksi.slice(0, 3).map(String) : [],
    });
  } catch (e) {
    console.error("brain error", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
