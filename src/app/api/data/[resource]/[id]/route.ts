import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { encryptSecretsFor, stripSecretsFor, decrypt, REVEALABLE } from "@/lib/crypto";

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
  appUser: "appUser",
  customer: "customer",
  company: "company",
  socialAccount: "socialAccount",
  vaultEntry: "vaultEntry",
  permitApplication: "permitApplication",
  serviceCatalog: "serviceCatalog",
};

function getModel(name: string): any | null {
  const key = MODELS[name];
  if (!key) return null;
  return (db as unknown as Record<string, unknown>)[key];
}

// GET satu item — dukung reveal field rahasia terenkripsi (?reveal=password|pin|backupCodes)
export async function GET(req: Request, ctx: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await ctx.params;
  const model = getModel(resource);
  if (!model) return NextResponse.json({ error: "Resource tidak dikenal" }, { status: 404 });

  const item = await model.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });

  const revealKey = new URL(req.url).searchParams.get("reveal");
  if (revealKey) {
    const field = REVEALABLE[resource]?.[revealKey];
    if (!field) return NextResponse.json({ error: "Field tidak dapat dibuka" }, { status: 403 });
    return NextResponse.json({ value: decrypt(String(item[field] || "")) });
  }
  return NextResponse.json({ item: stripSecretsFor(resource, [item])[0] });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await ctx.params;
  const model = getModel(resource);
  if (!model) return NextResponse.json({ error: "Resource tidak dikenal" }, { status: 404 });
  try {
    const body = await req.json();
    if (body.id) delete body.id;
    const { data, error } = encryptSecretsFor(resource, body);
    if (error) return NextResponse.json({ error }, { status: 400 });
    const item = await model.update({ where: { id }, data });
    return NextResponse.json({ item: stripSecretsFor(resource, [item])[0] });
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
