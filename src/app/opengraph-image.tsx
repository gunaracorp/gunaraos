import { ImageResponse } from "next/og";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — OpenGraph Image (dinamis, ber-branding)
// by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon
// PT Top Konsultan Internasional · PT Digital Bisnis Manajemen
// ═══════════════════════════════════════════════════════════════════

export const alt = "GUNARA OS — by Gugun Gunara (Muhammad Lutfi Azmi)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0d1f19",
          padding: 72,
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 24,
              backgroundImage: "linear-gradient(135deg, #fbbf24, #d97706)",
              color: "#0d1f19",
              fontSize: 56,
              fontWeight: 800,
            }}
          >
            G
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 64, fontWeight: 800, color: "#fbbf24", letterSpacing: 4 }}>
              GUNARA OS
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "#6ee7b7" }}>
              Sistem Operasi Hidup &amp; Bisnis — Hulu → Mesin → Hilir
            </div>
          </div>
        </div>

        {/* Signature */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "#ffffff" }}>
            by Gugun Gunara — Muhammad Lutfi Azmi
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#a7f3d0" }}>
            prabudanling · Santri Angon · Master Polymath · Sage Universal · The Ultimate Problem Solver
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#94a3b8" }}>
            PT Top Konsultan Internasional (topkonsultan.web.id) · PT Digital Bisnis Manajemen (digiman.id)
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
