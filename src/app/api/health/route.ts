import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BRAND } from "@/lib/branding";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — API Health Check (Diagnostik)
// by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon
//
// GET /api/health → status kesehatan sistem:
//   database (ping), jumlah baris per tabel, memori, uptime, versi.
// Dipakai section "Data Vault & Diagnostik" untuk memverifikasi bahwa
// data tersimpan & situs sehat — terutama setelah install ulang/deploy.
// ═══════════════════════════════════════════════════════════════════

const TABLES: string[] = [
  "setting", "domain", "agent", "appUser", "customer", "company",
  "client", "followUp", "debt", "debtPayment", "receivable", "cashflow",
  "childSaving", "relation", "politicalActivity", "learningJournal",
  "winLog", "caseStudy", "dailyLog", "weeklyReview", "backlogItem",
  "decisionLog", "socialAccount", "vaultEntry", "serviceCatalog",
  "permitApplication", "seoProject", "seoAudit", "keywordRank",
  "keywordIdea", "contentPlan", "backlink", "competitorReport",
  "metaPreset", "seoProposal", "consultation", "debate", "sageChat",
];

export async function GET() {
  const started = Date.now();
  const checks: { name: string; ok: boolean; detail: string }[] = [];

  // 1. Ping database
  let dbOk = false;
  try {
    await db.$queryRaw`SELECT 1`;
    dbOk = true;
    checks.push({ name: "Database (SQLite)", ok: true, detail: "Ping berhasil — koneksi aktif" });
  } catch (e) {
    checks.push({ name: "Database (SQLite)", ok: false, detail: String(e) });
  }

  // 2. Hitung baris per tabel
  const counts: Record<string, number> = {};
  let totalRows = 0;
  if (dbOk) {
    for (const table of TABLES) {
      try {
        const model = (db as unknown as Record<string, { count: () => Promise<number> }>)[table];
        const n = await model.count();
        counts[table] = n;
        totalRows += n;
      } catch {
        counts[table] = -1;
      }
    }
    const broken = Object.entries(counts).filter(([, n]) => n < 0);
    checks.push({
      name: "Integritas 38 tabel",
      ok: broken.length === 0,
      detail: broken.length === 0
        ? `${TABLES.length} tabel terbaca semuanya — total ${totalRows} baris data`
        : `Tabel bermasalah: ${broken.map(([t]) => t).join(", ")}`,
    });
  }

  // 3. Tabel inti tidak kosong (agent & domain di-seed bawaan)
  if (dbOk) {
    const seeded = (counts["agent"] || 0) > 0 && (counts["domain"] || 0) > 0;
    checks.push({
      name: "Data bawaan (15 Agents · 43 Domain)",
      ok: seeded,
      detail: seeded
        ? `${counts["agent"]} agents + ${counts["domain"]} domain terpasang`
        : "Data bawaan belum ada — jalankan seed atau restore backup",
    });
  }

  // 4. Enkripsi brankas
  const vaultKeyed = Boolean(process.env.GUNARA_VAULT_KEY);
  checks.push({
    name: "Kunci enkripsi brankas (AES-256-GCM)",
    ok: true,
    detail: vaultKeyed
      ? "GUNARA_VAULT_KEY terpasang — produksi aman"
      : "Memakai kunci dev — set env GUNARA_VAULT_KEY utk produksi",
  });

  const mem = process.memoryUsage();
  const ok = dbOk && checks.every((c) => c.ok || c.name.startsWith("Kunci") || c.name.startsWith("Data bawaan"));

  return NextResponse.json(
    {
      ok,
      app: BRAND.siteName,
      version: BRAND.version,
      env: process.env.NODE_ENV || "development",
      platform: process.platform,
      dbOk,
      counts,
      totalRows,
      memoryMb: Math.round(mem.rss / 1024 / 1024),
      heapMb: Math.round(mem.heapUsed / 1024 / 1024),
      uptimeSec: Math.round(process.uptime()),
      checkedAt: new Date().toISOString(),
      latencyMs: Date.now() - started,
      checks,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
