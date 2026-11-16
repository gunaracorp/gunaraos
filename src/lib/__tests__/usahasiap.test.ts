import { describe, expect, it } from "vitest";
import {
  USA_DOCUMENTS, USA_DOMAINS, USA_GATES, USA_GUARDRAIL,
  USA_PIPELINE, USA_RISKS, USA_STATUS, USA_VOLUMES, USA_WAVES,
} from "../usahasiap";

describe("usahasiap — register 45 dokumen (invarian Langkah 22 & 28)", () => {
  it("tepat 45 dokumen USA-01..45, kode unik & berurutan", () => {
    expect(USA_DOCUMENTS.length).toBe(45);
    const kodes = USA_DOCUMENTS.map((d) => d.kode);
    expect(new Set(kodes).size).toBe(45);
    kodes.forEach((kode, i) => expect(kode).toBe(`USA-${String(i + 1).padStart(2, "0")}`));
  });

  it("setiap dokumen punya nama, domain A–I, gelombang 1–5, status berakar pada enum", () => {
    for (const d of USA_DOCUMENTS) {
      expect(d.nama.length).toBeGreaterThan(0);
      expect(d.domain).toMatch(/^[A-I]$/);
      expect(d.domainNama.length).toBeGreaterThan(0);
      expect(d.gelombang).toBeGreaterThanOrEqual(1);
      expect(d.gelombang).toBeLessThanOrEqual(5);
      // Status boleh membawa suffix versi (mis. "DRAFT v0.3") — akarnya harus enum
      expect(USA_STATUS.some((s) => d.status.startsWith(s))).toBe(true);
    }
  });

  it("struktur master: 9 domain · 5 volume · 5 pipeline · 5 gates · 5 gelombang", () => {
    expect(USA_DOMAINS.length).toBe(9);
    expect(USA_VOLUMES.length).toBe(5);
    expect(USA_PIPELINE.length).toBe(5);
    expect(USA_GATES.length).toBe(5);
    expect(USA_WAVES.length).toBe(5);
  });

  it("guardrail & risiko terinventaris", () => {
    expect(Object.keys(USA_GUARDRAIL).length).toBeGreaterThan(0);
    expect(USA_RISKS.length).toBeGreaterThan(0);
  });
});
