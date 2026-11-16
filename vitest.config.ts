/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

/**
 * GUNARA OS — Konfigurasi uji unit (Langkah 8 Roadmap — gerbang mutu).
 * Cakupan diukur pada modul MURNI src/lib (keputusan ADR-005):
 * db.ts (efek samping DB) dan gunara.tsx (konfigurasi UI besar)
 * tidak dimasukkan — keduanya diuji lewat smoke test runtime.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/lib/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: [
        "src/lib/branding.ts",
        "src/lib/crypto.ts",
        "src/lib/dewan.ts",
        "src/lib/i18n.ts",
        "src/lib/license-finder.ts",
        "src/lib/service-catalog.ts",
        "src/lib/usahasiap.ts",
        "src/lib/utils.ts",
        "src/lib/versioning.ts",
      ],
      thresholds: { global: { statements: 70, branches: 70, functions: 70, lines: 70 } },
    },
  },
});
