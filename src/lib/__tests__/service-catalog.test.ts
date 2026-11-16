import { describe, expect, it } from "vitest";
import { KATEGORI_LAYANAN, SERVICES, fmtDurasi, serviceByKode } from "../service-catalog";
import { SEKTOR_FINDER, findLicenses } from "../license-finder";

describe("service-catalog — 46 layanan konsultan", () => {
  it("tepat 46 layanan dengan kode unik", () => {
    expect(SERVICES.length).toBe(46);
    const kodes = SERVICES.map((s) => s.kode);
    expect(new Set(kodes).size).toBe(46);
  });

  it("setiap layanan: nama, kategori sah, instansi, harga & durasi masuk akal", () => {
    for (const s of SERVICES) {
      expect(s.nama.length).toBeGreaterThan(0);
      expect(KATEGORI_LAYANAN).toContain(s.kategori);
      expect(s.instansi.length).toBeGreaterThan(0);
      expect(s.hargaMulai).toBeGreaterThanOrEqual(0);
      expect(s.durasiMin).toBeLessThanOrEqual(s.durasiMaks);
    }
  });

  it("serviceByKode menemukan NIB & mengembalikan undefined untuk kode asing", () => {
    expect(serviceByKode("NIB")?.nama).toContain("NIB");
    expect(serviceByKode("TIDAK-ADA")).toBeUndefined();
  });

  it("fmtDurasi memformat rentang hari/bulan/minggu dengan benar", () => {
    expect(fmtDurasi(1, 3)).toContain("hari");
    expect(fmtDurasi(2, 2)).toContain("hari");
    expect(fmtDurasi(14, 21)).toContain("mgg");
    expect(fmtDurasi(60, 90)).toContain("bln");
    expect(fmtDurasi(1, 90).split("–").length).toBe(2);
  });
});

describe("license-finder — rules engine perizinan", () => {
  it("10 sektor tersedia dengan value & label", () => {
    expect(SEKTOR_FINDER.length).toBe(10);
    for (const s of SEKTOR_FINDER) {
      expect(String(s.value).length).toBeGreaterThan(0);
      expect(s.label.length).toBeGreaterThan(0);
    }
  });

  it("findLicenses menghasilkan rekomendasi berprioritas untuk UMKM kuliner", () => {
    const hasil = findLicenses({
      sektor: "KULINER",
      skala: "UMKM",
      badanUsaha: false,
      online: true,
      eksporImpor: false,
      gedungSendiri: false,
      karyawan: false,
      pangan: true,
      merek: true,
      asing: false,
      tender: false,
    });
    expect(hasil.length).toBeGreaterThan(0);
    for (const r of hasil) {
      expect(r.kode.length).toBeGreaterThan(0);
      expect(r.alasan.length).toBeGreaterThan(0);
      expect(["WAJIB", "SANGAT DISARANKAN", "DISARANKAN", "OPSIONAL"]).toContain(r.prioritas);
    }
    expect(hasil.some((r) => r.prioritas === "WAJIB")).toBe(true);
  });

  it("profil besar yang lengkap mengaktifkan lebih banyak izin dari UMKM polos", () => {
    const polos = findLicenses({ sektor: "PANGAN", skala: "UMKM", badanUsaha: false, online: false, eksporImpor: false, gedungSendiri: false, karyawan: false, pangan: true, merek: false, asing: false, tender: false });
    const besar = findLicenses({ sektor: "PANGAN", skala: "BESAR", badanUsaha: true, online: true, eksporImpor: true, gedungSendiri: true, karyawan: true, pangan: true, merek: true, asing: true, tender: true });
    expect(besar.length).toBeGreaterThan(polos.length);
  });

  it("seluruh 10 sektor menghasilkan rekomendasi tanpa error", () => {
    for (const s of SEKTOR_FINDER) {
      const hasil = findLicenses({ sektor: s.value, skala: "MENENGAH", badanUsaha: true, online: true, eksporImpor: false, gedungSendiri: false, karyawan: true, pangan: false, merek: false, asing: false, tender: false });
      expect(hasil.length).toBeGreaterThan(0);
    }
  });
});
