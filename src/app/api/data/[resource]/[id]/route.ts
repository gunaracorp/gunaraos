import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getModel(name: string): any | null {
  const key = MODELS[name];
  if (!key) return null;
  return (db as unknown as Record<string, unknown>)[key];
}

export async function PATCH(req: Request, ctx: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await ctx.params;
  const model = getModel(resource);
  if (!model) return NextResponse.json({ error: "Resource tidak dikenal" }, { status: 404 });
  try {
    const body = await req.json();
    if (body.id) delete body.id;
    const item = await model.update({ where: { id }, data: body });
    return NextResponse.json({ item });
  } catch (e) {
    console.error("PATCH error", resource, e);
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await ctx.params;
  const model = getModel(resource);
  if (!model) return NextResponse.json({ error: "Resource tidak dikenal" }, { status: 404 });
  try {
    await model.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE error", resource, e);
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
