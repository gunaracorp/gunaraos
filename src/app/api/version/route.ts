import { NextResponse } from "next/server";
import { versionManifest } from "@/lib/versioning";
import { BRAND } from "@/lib/branding";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — API Version Manifest
// by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon
//
// GET /api/version → metadata versi runtime berstandar internasional:
//   nama, versi (SemVer 2.0.0), versi pendek, codename, channel,
//   tanggal rilis, breakdown SemVer, jumlah rilis, ringkasan rilis
//   terbaru, standar yang diikuti, dan tautan sistem versioning.
//
// Data di-derive otomatis dari src/lib/branding.ts (VERSION) +
// src/lib/versioning.ts (RELEASES) — tidak ada string hardcode di sini.
// Dipakai: section Release Center, monitoring, tooling eksternal.
// ═══════════════════════════════════════════════════════════════════

export async function GET() {
  const body = {
    ...versionManifest(new Date().toISOString()),
    tagline: BRAND.tagline,
    siteUrl: BRAND.siteUrl,
  };

  return NextResponse.json(body, {
    headers: {
      // Metadata versi harus selalu segar — jangan di-cache lama
      "Cache-Control": "no-store, max-age=0",
      "X-Gunara-Version": BRAND.version,
    },
  });
}
