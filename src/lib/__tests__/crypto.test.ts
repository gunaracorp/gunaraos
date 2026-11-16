import { afterEach, describe, expect, it, vi } from "vitest";

const KEY_A = "kunci-latihan-A-minimal-32-karakter-panjang-oke";
const KEY_B = "kunci-latihan-B-berbeda-juga-minimal-32-karakter-ya";

afterEach(() => vi.unstubAllEnvs());

describe("crypto — brankas AES-256-GCM (NIST SP 800-38D)", () => {
  it("encrypt → decrypt roundtrip utuh", async () => {
    vi.stubEnv("GUNARA_VAULT_KEY", KEY_A);
    const { encrypt, decrypt } = await import("../crypto");
    const payload = "PasswordRahasia#2026";
    const enc = encrypt(payload);
    expect(enc).toMatch(/^v1:[^:]+:[^:]+:[^:]+$/);
    expect(decrypt(enc)).toBe(payload);
  });

  it("IV acak — dua enkripsi dari plaintext sama tidak pernah identik", async () => {
    vi.stubEnv("GUNARA_VAULT_KEY", KEY_A);
    const { encrypt } = await import("../crypto");
    expect(encrypt("sama")).not.toBe(encrypt("sama"));
  });

  it("kunci berbeda gagal membuka (auth tag ditolak → string kosong)", async () => {
    vi.stubEnv("GUNARA_VAULT_KEY", KEY_A);
    const { encrypt, decrypt } = await import("../crypto");
    const enc = encrypt("rahasia lintas kunci");
    vi.stubEnv("GUNARA_VAULT_KEY", KEY_B);
    expect(decrypt(enc)).toBe("");
  });

  it("payload korup & input kosong aman (bukan throw)", async () => {
    vi.stubEnv("GUNARA_VAULT_KEY", KEY_A);
    const { encrypt, decrypt } = await import("../crypto");
    expect(decrypt("bukan:format:v1:yang-benar")).toBe("");
    expect(decrypt("")).toBe("");
    expect(encrypt("")).toBe("");
    const enc = encrypt("data jujur");
    expect(decrypt(enc.slice(0, -8))).toBe("");
  });
});

describe("crypto — password scrypt + kekuatan NIST", () => {
  it("hashPassword → verifyPassword roundtrip; hash berbeda tiap salt", async () => {
    const { hashPassword, verifyPassword } = await import("../crypto");
    const h1 = hashPassword("SandiKuat!123");
    const h2 = hashPassword("SandiKuat!123");
    expect(h1).toMatch(/^s1:16384:[^:]+:[^:]+$/);
    expect(h1).not.toBe(h2);
    expect(verifyPassword("SandiKuat!123", h1)).toBe(true);
    expect(verifyPassword("sandikuat!123", h1)).toBe(false);
    expect(verifyPassword("", h1)).toBe(false);
    expect(verifyPassword("x", "")).toBe(false);
    expect(verifyPassword("x", "format-salah")).toBe(false);
  });

  it("passwordStrength sesuai skala NIST (panjang > paksaan kompleksitas)", async () => {
    const { passwordStrength } = await import("../crypto");
    expect(passwordStrength("")).toBe("LEMAH");
    expect(passwordStrength("password")).toBe("LEMAH");
    expect(passwordStrength("123456")).toBe("LEMAH");
    expect(passwordStrength("gunara123")).toBe("LEMAH");
    expect(passwordStrength("aabbccdd")).toBe("LEMAH"); // karakter berulang
    expect(passwordStrength("KopiPagi17")).toBe("SEDANG");
    expect(passwordStrength("KopiPagi#17")).toBe("KUAT");
    expect(passwordStrength("Kopi Pagi #17/2026 Lantai 2!")).toBe("SANGAT KUAT");
  });
});

describe("crypto — integrasi API generik (encryptSecretsFor / stripSecretsFor)", () => {
  it("vaultEntry: password/pin/codes terenkripsi & di-strip dari response", async () => {
    vi.stubEnv("GUNARA_VAULT_KEY", KEY_A);
    const { encryptSecretsFor, stripSecretsFor } = await import("../crypto");
    const { data, error } = encryptSecretsFor("vaultEntry", {
      nama: "Email utama",
      password: "SandiVault!1",
      pin: "123456",
      backupCodes: "1111-2222-3333",
    });
    expect(error).toBeUndefined();
    expect(data.password).toBeUndefined();
    expect(data.pin).toBeUndefined();
    expect(data.backupCodes).toBeUndefined();
    expect(String(data.passwordEnc)).toMatch(/^v1:/);
    expect(String(data.pinEnc)).toMatch(/^v1:/);
    expect(String(data.backupCodesEnc)).toMatch(/^v1:/);
    expect(data.strength).toBe("KUAT");

    const listed = stripSecretsFor("vaultEntry", [data]);
    expect(listed[0].passwordEnc).toBeUndefined();
    expect(listed[0].hasPassword).toBe(true);
    expect(listed[0].hasPin).toBe(true);
    expect(listed[0].hasBackupCodes).toBe(true);
  });

  it("appUser & socialAccount ikut kontrak; resource lain lolos tanpa sentuh", async () => {
    vi.stubEnv("GUNARA_VAULT_KEY", KEY_A);
    const { encryptSecretsFor, stripSecretsFor } = await import("../crypto");
    const { data } = encryptSecretsFor("appUser", { email: "x@y.z", password: "OwnerKuat!9" });
    expect(data.password).toBeUndefined();
    expect(String(data.passwordHash)).toMatch(/^s1:/);
    const { data: sa } = encryptSecretsFor("socialAccount", { platform: "IG", password: "Sosmed!1" });
    expect(String(sa.passwordEnc)).toMatch(/^v1:/);
    const passthrough = stripSecretsFor("client", [{ nama: "Toko Makmur", passwordEnc: "tetap" }]);
    expect(passthrough[0].passwordEnc).toBe("tetap");
  });
});
