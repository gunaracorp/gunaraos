import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BRAND } from "@/lib/branding";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — API Backup & Restore (Data Vault)
// by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon
//
// GET  /api/backup            → ekspor SELURUH data (38 tabel) ke JSON
// POST /api/backup            → impor/restore JSON ke database
//      body: { data: {resource: rows[]}, mode: "merge" | "replace" }
//      - merge   : data lama tetap, baris dengan id sama diperbarui
//      - replace : HAPUS semua data lama lalu isi ulang dari backup
// ═══════════════════════════════════════════════════════════════════

// Urutan restore mengikuti ketergantungan relasi (induk → anak)
const RESTORE_ORDER: string[] = [
  "setting", "domain", "agent", "appUser", "customer", "company",
  "client", "followUp", "debt", "debtPayment", "receivable", "cashflow",
  "childSaving", "relation", "politicalActivity", "learningJournal",
  "winLog", "caseStudy", "dailyLog", "weeklyReview", "backlogItem",
  "decisionLog", "socialAccount", "vaultEntry", "serviceCatalog",
  "permitApplication", "seoProject", "seoAudit", "keywordRank",
  "keywordIdea", "contentPlan", "backlink", "competitorReport",
  "metaPreset", "seoProposal", "consultation", "debate", "sageChat",
];

function getModel(name: string): unknown {
  const key = RESTORE_ORDER.includes(name) ? name : null;
  if (!key) return null;
  return (db as unknown as Record<string, unknown>)[key];
}

// Primary key per resource — mayoritas "id", dua model memakai natural key
const PK_FIELD: Record<string, string> = {
  setting: "key",
  serviceCatalog: "kode",
};
const pkOf = (resource: string) => PK_FIELD[resource] || "id";

// Field hasil strip API yang TIDAK ada di skema — dibuang saat restore
const COMPUTED_FIELDS = new Set([
  "hasPassword", "hasPin", "hasBackupCodes",
]);

/** Konversi string ISO datetime → Date agar valid utk field DateTime Prisma. */
function hydrateDates(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (COMPUTED_FIELDS.has(k)) continue;
    if (v === null) { out[k] = null; continue; }
    if (
      typeof v === "string" &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v) &&
      /Z|[+-]\d{2}:\d{2}$/.test(v)
    ) {
      const d = new Date(v);
      out[k] = isNaN(d.getTime()) ? v : d;
    } else {
      out[k] = v;
    }
  }
  return out;
}

const ISO = () => new Date().toISOString();

// ── EKSPOR ─────────────────────────────────────────────────────────
export async function GET() {
  try {
    const data: Record<string, unknown[]> = {};
    const counts: Record<string, number> = {};
    for (const resource of RESTORE_ORDER) {
      const model = getModel(resource) as { findMany: (a?: unknown) => Promise<unknown[]> } | null;
      if (!model) continue;
      const rows = await model.findMany();
      data[resource] = rows;
      counts[resource] = rows.length;
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return new NextResponse(
      JSON.stringify(
        {
          meta: {
            app: "GUNARA OS",
            version: BRAND.version,
            site: BRAND.siteUrl,
            author: "Gugun Gunara — Muhammad Lutfi Azmi (prabudanling · Santri Angon)",
            exportedAt: ISO(),
            totalRows: total,
            counts,
            format: "gunara-os-backup-v1",
          },
          data,
        },
        null,
        1 // kompak namun tetap terbaca
      ),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="gunara-os-backup-${ISO().slice(0, 10)}.json"`,
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (e) {
    console.error("backup export error", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// ── IMPOR / RESTORE ────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = body.mode === "replace" ? "replace" : "merge";
    const payload = body.data;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return NextResponse.json(
        { error: "Format backup tidak valid — field 'data' (object) wajib ada." },
        { status: 400 }
      );
    }

    // Validasi sumber: minimal 1 resource dikenal
    const known = Object.keys(payload).filter((k) => RESTORE_ORDER.includes(k));
    if (known.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada resource yang dikenali dalam file backup ini." },
        { status: 400 }
      );
    }

    // Validasi total baris (anti file raksasa/korup)
    let totalRows = 0;
    for (const k of known) {
      const rows = payload[k];
      if (!Array.isArray(rows)) continue;
      totalRows += rows.length;
    }
    if (totalRows > 200_000) {
      return NextResponse.json({ error: "File backup terlalu besar (>200.000 baris)." }, { status: 413 });
    }

    // REPLACE: kosongkan semua tabel dulu (urutan anak → induk)
    if (mode === "replace") {
      for (const resource of [...RESTORE_ORDER].reverse()) {
        const model = getModel(resource) as { deleteMany: () => Promise<unknown> } | null;
        if (!model) continue;
        await model.deleteMany();
      }
    }

    const summary: Record<string, { created: number; updated: number; skipped: number }> = {};
    let grandRestored = 0;

    // MERGE/REPLACE: isi ulang baris per baris (urutan induk → anak)
    for (const resource of RESTORE_ORDER) {
      const rows = payload[resource];
      if (!Array.isArray(rows) || rows.length === 0) continue;
      const model = getModel(resource) as {
        upsert: (a: unknown) => Promise<unknown>;
        create: (a: unknown) => Promise<unknown>;
      } | null;
      if (!model) continue;

      const stat = { created: 0, updated: 0, skipped: 0 };
      const pk = pkOf(resource);
      for (const raw of rows) {
        if (!raw || typeof raw !== "object") { stat.skipped++; continue; }
        const row = hydrateDates(raw as Record<string, unknown>);
        const pkVal = typeof row[pk] === "string" && row[pk] ? (row[pk] as string) : null;
        try {
          if (pkVal) {
            const { [pk]: _kept, ...fields } = row;
            await model.upsert({
              where: { [pk]: pkVal },
              update: fields,
              create: { ...fields, [pk]: pkVal },
            });
            stat.updated++; // upsert sukses (baru maupun lama) = tersinkron
          } else {
            await model.create({ data: row });
            stat.created++;
          }
        } catch (rowErr) {
          console.error(`restore ${resource} row error`, rowErr);
          stat.skipped++;
        }
      }
      summary[resource] = stat;
      grandRestored += stat.created + stat.updated;
    }

    return NextResponse.json({
      ok: true,
      mode,
      restored: grandRestored,
      skippedRows: Object.values(summary).reduce((a, s) => a + s.skipped, 0),
      summary,
      finishedAt: ISO(),
    });
  } catch (e) {
    console.error("backup restore error", e);
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
