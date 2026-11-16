import { describe, expect, it } from "vitest";
import { GROUP_EN, UI, ui, useI18n } from "../i18n";
import { cn } from "../utils";

describe("i18n — dua bahasa selalu lengkap", () => {
  it("ui(key, lang) mengembalikan string tidak kosong untuk semua kunci", () => {
    for (const key of Object.keys(UI)) {
      expect(ui(key as keyof typeof UI, "id").length).toBeGreaterThan(0);
      expect(ui(key as keyof typeof UI, "en").length).toBeGreaterThan(0);
    }
  });

  it("peta terjemahan grup terisi untuk grup navigasi utama", () => {
    expect(Object.keys(GROUP_EN).length).toBeGreaterThan(0);
    for (const v of Object.values(GROUP_EN)) expect(v.length).toBeGreaterThan(0);
  });

  it("setLang berganti bahasa pada store (tersimpan persist di klien)", () => {
    const before = useI18n.getState().lang;
    useI18n.getState().setLang(before === "id" ? "en" : "id");
    expect(useI18n.getState().lang).not.toBe(before);
    useI18n.getState().setLang(before);
    expect(useI18n.getState().lang).toBe(before);
  });
});

describe("utils — cn (clsx + tailwind-merge)", () => {
  it("menggabungkan kelas & menyelesaikan konflik tailwind", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", false && "text-blue-500")).toBe("text-red-500");
    expect(cn()).toBe("");
  });
});
