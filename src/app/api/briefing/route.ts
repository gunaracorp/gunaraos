import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";

/**
 * 🌅 AI Morning Briefing — staf presiden pribadi.
 * GET  /api/briefing → daftar briefing (terbaru dulu, maks 30)
 * POST /api/briefing → susun briefing hari ini dari seluruh database (upsert per hari WIB)
 */

function todayWIB(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
}

export async function GET() {
  const items = await db.briefing.findMany({ orderBy: { tanggal: "desc" }, take: 30 });
  return NextResponse.json({ items, today: todayWIB() });
}

export async function POST() {
  try {
    const tanggal = todayWIB();

    // ── Kumpulkan denyut seluruh sistem ──
    const [mit, debts, followUps, cashflow, habits, habitsLog, ideas, backlog, domains, winLogs] =
      await Promise.all([
        db.dailyLog.findUnique({ where: { tanggal } }),
        db.debt.findMany({ where: { status: "AKTIF" }, orderBy: { tenggat: "asc" }, take: 5 }),
        db.followUp.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
        db.cashflow.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
        db.habit.findMany({ where: { arsip: false }, include: { logs: true } }),
        db.habitLog.findMany({ where: { tanggal } }),
        db.ideaItem.findMany({ where: { status: "AKTIF" }, orderBy: { dampak: "desc" }, take: 3 }),
        db.backlogItem.count(),
        db.domain.count(),
        db.winLog.count(),
      ]);

    const now = new Date();
    const bulanIni = now.toISOString().slice(0, 7);
    const masuk = cashflow.filter((c) => c.jenis === "MASUK" && String(c.tanggal || "").startsWith(bulanIni)).reduce((a, c) => a + (c.jumlah || 0), 0);
    const keluar = cashflow.filter((c) => c.jenis === "KELUAR" && String(c.tanggal || "").startsWith(bulanIni)).reduce((a, c) => a + (c.jumlah || 0), 0);
    const followUpTelat = followUps.filter((f) => f.status && !["SELESAI", "CLOSED"].includes(f.status)).length;

    const ringkasanData = [
      `Tanggal: ${tanggal} (WIB)`,
      `MIT hari ini: ${mit ? `pagi="${mit.mitPagi || "-"}"; malam="${mit.malam || "-"}"` : "belum diisi"}`,
      `Hutang aktif: ${debts.length} — ${debts.map((d) => `${d.kepada} (tenggat ${d.tenggat || "?"}, prioritas ${d.prioritas})`).join("; ") || "-"}`,
      `Follow-up terbuka: ${followUpTelat}`,
      `Arus kas bulan ini: masuk Rp${masuk.toLocaleString("id-ID")} · keluar Rp${keluar.toLocaleString("id-ID")} · net Rp${(masuk - keluar).toLocaleString("id-ID")}`,
      `Kebiasaan aktif: ${habits.length} — hari ini sudah dicatat ${habitsLog.length}`,
      `Ide dampak tertinggi: ${ideas.map((i) => i.judul).join("; ") || "-"}`,
      `Backlog menunggu: ${backlog} · Domain portfolio: ${domains} · Win log: ${winLogs}`,
    ].join("\n");

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Kamu staf presiden pribadi seorang polymath Indonesia (Gugun Gunara). Susun MORNING BRIEFING pagi dalam markdown Bahasa Indonesia, maksimal 220 kata. " +
            "Struktur: ## 🎯 Fokus Hari Ini (2-3 prioritas berdasarkan data), ## ⚠️ Yang Menekan (hutang/tenggat/follow-up), ## 💰 Denyut Kas (1-2 kalimat), ## 🌱 Disiplin (kebiasaan), ## ⚡ Satu Langkah Paling Berdampak. " +
            "Tajam, spesifik dari data, tanpa basa-basi. Jangan mengarang angka yang tidak ada di data.",
        },
        { role: "user", content: ringkasanData },
      ],
    });

    const isi = (completion.choices[0]?.message?.content || "").trim();
    if (!isi) return NextResponse.json({ error: "AI tidak menghasilkan briefing" }, { status: 502 });

    const item = await db.briefing.upsert({
      where: { tanggal },
      update: { isi },
      create: { tanggal, isi },
    });
    return NextResponse.json({ item });
  } catch (e) {
    console.error("briefing error", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
