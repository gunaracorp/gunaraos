import { describe, expect, it } from "vitest";
import { COUNCIL_GROUPS, DEWAN, TOTAL_YEARS, councilsByIds } from "../dewan";

describe("dewan — Dewan 46 (invarian konstitusi §2)", () => {
  it("tepat 46 anggota — tidak kurang, tidak lebih", () => {
    expect(DEWAN.length).toBe(46);
  });

  it("nomor 1..46 berurutan unik & id unik", () => {
    const nos = DEWAN.map((c) => c.no);
    expect(nos).toEqual(Array.from({ length: 46 }, (_, i) => i + 1));
    const ids = DEWAN.map((c) => c.id);
    expect(new Set(ids).size).toBe(46);
  });

  it("setiap anggota: nama, tagline, motto, kelompok sah, tahun > 0, ada anggota pakar", () => {
    for (const c of DEWAN) {
      expect(c.name.length).toBeGreaterThan(0);
      expect(c.tagline.length).toBeGreaterThan(0);
      expect(c.motto.length).toBeGreaterThan(0);
      expect(COUNCIL_GROUPS).toContain(c.group);
      expect(c.years).toBeGreaterThan(0);
      expect(c.members.length).toBeGreaterThan(0);
      for (const m of c.members) {
        expect(m.title.length).toBeGreaterThan(0);
        expect(m.role.length).toBeGreaterThan(0);
      }
    }
  });

  it("TOTAL_YEARS konsisten dengan jumlah anggota", () => {
    expect(TOTAL_YEARS).toBe(DEWAN.reduce((a, c) => a + c.years, 0));
  });

  it("councilsByIds mengambil sesuai daftar & urutan DEWAN tetap", () => {
    const picked = councilsByIds([DEWAN[0].id, DEWAN[5].id]);
    expect(picked.length).toBe(2);
    expect(picked[0].id).toBe(DEWAN[0].id);
    expect(DEWAN.indexOf(picked[0])).toBe(DEWAN.indexOf(DEWAN[0]));
  });
});
