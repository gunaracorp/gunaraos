import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Generic CRUD API untuk semua resource GUNARA OS.
 * GET    /api/data/[resource]          → list
 * POST   /api/data/[resource]          → create (dailyLog: upsert by tanggal)
 */

const MODELS: Record<string, string> = {
  debt: "debt",
  debtPayment: "debtPayment",
  receivable: "receivable",
  cashflow: "cashflow",
  childSaving: "childSaving",
  client: "client",
  followUp: "followUp",
  relation: "relation",
  politicalActivity: "politicalActivity",
  learningJournal: "learningJournal",
  winLog: "winLog",
  caseStudy: "caseStudy",
  dailyLog: "dailyLog",
  weeklyReview: "weeklyReview",
  backlogItem: "backlogItem",
  decisionLog: "decisionLog",
  domain: "domain",
  agent: "agent",
  setting: "setting",
};

// Model dengan urutan custom (setting tidak punya createdAt)
const ORDERED: Record<string, Record<string, string>> = {
  domain: { urutan: "asc" },
  agent: { nomor: "asc" },
  dailyLog: { tanggal: "desc" },
  weeklyReview: { createdAt: "desc" },
  setting: { key: "asc" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModel(name: string): any | null {
  const key = MODELS[name];
  if (!key) return null;
  return (db as unknown as Record<string, unknown>)[key];
}

export async function GET(req: Request, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params;
  const model = getModel(resource);
  if (!model) return NextResponse.json({ error: "Resource tidak dikenal" }, { status: 404 });
  const url = new URL(req.url);
  const whereKey = url.searchParams.get("whereKey");
  const whereVal = url.searchParams.get("whereVal");
  const where = whereKey && whereVal ? { [whereKey]: whereVal } : undefined;
  const include =
    resource === "debt" ? { payments: true } : resource === "client" ? { followUps: true } : undefined;
  const orderBy = ORDERED[resource] || { createdAt: "desc" };
  const items = await model.findMany({ where, include, orderBy });
  return NextResponse.json({ items });
}

export async function POST(req: Request, ctx: { params: Promise<{ resource: string }> }) {
  const { resource } = await ctx.params;
  const model = getModel(resource);
  if (!model) return NextResponse.json({ error: "Resource tidak dikenal" }, { status: 404 });
  try {
    const body = await req.json();
    // dailyLog: upsert by tanggal (satu baris per hari)
    if (resource === "dailyLog" && body.tanggal) {
      const existing = await model.findUnique({ where: { tanggal: body.tanggal } });
      if (existing) {
        delete body.id;
        const updated = await model.update({ where: { tanggal: body.tanggal }, data: body });
        return NextResponse.json({ item: updated });
      }
    }
    if (body.id) delete body.id;
    const item = await model.create({ data: body });
    return NextResponse.json({ item });
  } catch (e) {
    console.error("POST error", resource, e);
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
