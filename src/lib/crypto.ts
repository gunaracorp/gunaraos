// ═══════════════════════════════════════════════════════
// GUNARA OS — Pustaka Kriptografi (SERVER-ONLY)
// Standar: NIST SP 800-38D (AES-256-GCM), OWASP ASVS v4 L2
// - Password akun: scrypt (memory-hard, salt 16B, N=16384)
// - Kredensial brankas: AES-256-GCM (enkripsi dua arah)
// - Kunci: env GUNARA_VAULT_KEY (fallback dev, diberi warning)
// ═══════════════════════════════════════════════════════

import crypto from "node:crypto";

const SCRYPT_N = 16384, SCRYPT_R = 8, SCRYPT_P = 1, KEYLEN = 32;

function masterKey(): Buffer {
  const secret = process.env.GUNARA_VAULT_KEY;
  if (!secret && process.env.NODE_ENV === "production") {
    console.warn(
      "[crypto] GUNARA_VAULT_KEY tidak diset — memakai kunci dev. " +
      "Untuk produksi, set env GUNARA_VAULT_KEY (min. 32 karakter acak)."
    );
  }
  // Derivasi deterministik agar data lama tetap terbaca antar-restart
  return crypto.scryptSync(
    secret || "gunara-os-dev-vault-key-please-change-in-production",
    "gunara-vault-salt-v1",
    KEYLEN,
    { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P }
  );
}

/** Enkripsi string → "v1:<iv>:<tag>:<cipher>" (semua base64url) */
export function encrypt(plain: string): string {
  if (!plain) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", masterKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("base64url")}:${tag.toString("base64url")}:${enc.toString("base64url")}`;
}

/** Dekripsi payload hasil encrypt(). Payload korup → "" (bukan throw). */
export function decrypt(payload: string): string {
  if (!payload) return "";
  try {
    const [v, ivB, tagB, dataB] = payload.split(":");
    if (v !== "v1" || !ivB || !tagB || !dataB) return "";
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm", masterKey(), Buffer.from(ivB, "base64url")
    );
    decipher.setAuthTag(Buffer.from(tagB, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(dataB, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return "";
  }
}

/** Hash password scrypt → "s1:<N>:<salt>:<hash>" — verifikasi via timing-safe compare */
export function hashPassword(pw: string): string {
  if (!pw) return "";
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 64, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return `s1:${SCRYPT_N}:${salt.toString("base64url")}:${hash.toString("base64url")}`;
}

export function verifyPassword(pw: string, stored: string): boolean {
  if (!pw || !stored) return false;
  try {
    const [v, nB, saltB, hashB] = stored.split(":");
    if (v !== "s1") return false;
    const expected = Buffer.from(hashB, "base64url");
    const actual = crypto.scryptSync(pw, Buffer.from(saltB, "base64url"), expected.length, {
      N: Number(nB) || SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P,
    });
    return crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

/** Skor kekuatan password — standar NIST SP 800-63B (panjang > kompleksitas paksaan) */
export function passwordStrength(pw: string): "LEMAH" | "SEDANG" | "KUAT" | "SANGAT KUAT" {
  if (!pw) return "LEMAH";
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const common = /^(password|123456|qwerty|admin|gunara|indonesia|sayang|12345678)/i;
  if (common.test(pw) || /(.)\1{2,}/.test(pw)) score = Math.min(score, 1);
  if (score <= 2) return "LEMAH";
  if (score === 3) return "SEDANG";
  if (score === 4 || score === 5) return "KUAT";
  return "SANGAT KUAT";
}

// ── Integrasi API generik: transform field rahasia per-resource ──

export interface SecretTransformResult {
  data: Record<string, unknown>;
  error?: string;
}

/**
 * Panggil SEBELUM create/update untuk resource rahasia.
 * - appUser.password → passwordHash (+ strength, passwordChangedAt)
 * - vaultEntry.password/pin/backupCodes → passwordEnc/pinEnc/backupCodesEnc (+ strength, lastRotatedAt)
 * - socialAccount.password → passwordEnc
 */
export function encryptSecretsFor(resource: string, body: Record<string, unknown>): SecretTransformResult {
  const data = { ...body };
  const today = new Date().toISOString().slice(0, 10);

  if (resource === "appUser") {
    const pw = typeof data.password === "string" ? data.password : "";
    delete data.password;
    if (pw) {
      data.passwordHash = hashPassword(pw);
      data.passwordStrength = passwordStrength(pw);
      data.passwordChangedAt = today;
    }
  }

  if (resource === "vaultEntry") {
    const pw = typeof data.password === "string" ? data.password : "";
    delete data.password;
    if (pw) {
      data.passwordEnc = encrypt(pw);
      data.strength = passwordStrength(pw);
      data.lastRotatedAt = today;
    }
    if (typeof data.pin === "string" && data.pin) {
      data.pinEnc = encrypt(data.pin);
      delete data.pin;
    }
    if (typeof data.backupCodes === "string" && data.backupCodes) {
      data.backupCodesEnc = encrypt(data.backupCodes);
      delete data.backupCodes;
    }
  }

  if (resource === "socialAccount") {
    const pw = typeof data.password === "string" ? data.password : "";
    delete data.password;
    if (pw) data.passwordEnc = encrypt(pw);
  }

  return { data };
}

/** Hapus field rahasia dari hasil GET sebelum dikirim ke klien. */
export function stripSecretsFor(resource: string, items: Record<string, unknown>[]): Record<string, unknown>[] {
  if (resource === "appUser") {
    return items.map(({ passwordHash, ...rest }) => ({ ...rest, hasPassword: Boolean(passwordHash) }));
  }
  if (resource === "vaultEntry") {
    return items.map(({ passwordEnc, pinEnc, backupCodesEnc, ...rest }) => ({
      ...rest,
      hasPassword: Boolean(passwordEnc),
      hasPin: Boolean(pinEnc),
      hasBackupCodes: Boolean(backupCodesEnc),
    }));
  }
  if (resource === "socialAccount") {
    return items.map(({ passwordEnc, ...rest }) => ({ ...rest, hasPassword: Boolean(passwordEnc) }));
  }
  return items;
}

/** Reveal satu field rahasia (GET /api/data/[resource]/[id]?reveal=password|pin|backupCodes|passwordEnc) */
export const REVEALABLE: Record<string, Record<string, string>> = {
  vaultEntry: { password: "passwordEnc", pin: "pinEnc", backupCodes: "backupCodesEnc" },
  socialAccount: { password: "passwordEnc" },
};
