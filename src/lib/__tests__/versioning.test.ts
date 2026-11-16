import { describe, expect, it } from "vitest";
import {
  APP_VERSION, APP_CHANNEL, CHANGELOG_CATEGORIES, RELEASES, SEMVER_RULES,
  bumpVersion, compareVersions, formatVersion, getRelease, isValidVersion,
  latestRelease, parseVersion, releaseStats, shortVersion, sortedReleases,
  versionManifest, type ReleaseEntry,
} from "../versioning";

const SEMVER = /^\d+\.\d+\.\d+$/;

describe("versioning — disiplin rilis (ADR-003)", () => {
  it("RELEASES terurut terbaru dulu (SemVer turun)", () => {
    for (let i = 1; i < RELEASES.length; i++) {
      expect(compareVersions(RELEASES[i - 1].version, RELEASES[i].version)).toBeGreaterThanOrEqual(0);
    }
  });

  it("setiap entri punya versi sah, tanggal ISO, codename tidak kosong", () => {
    for (const r of RELEASES as ReleaseEntry[]) {
      expect(r.version).toMatch(SEMVER);
      expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.codename.length).toBeGreaterThan(0);
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.summary.length).toBeGreaterThan(0);
    }
  });

  it("sejak GERBANG-MUTU (2026-11-16, ADR-003), codename memakai konvensi KAPITAL-SAMBUNG-GARIS", () => {
    for (const r of RELEASES as ReleaseEntry[]) {
      if (r.date >= "2026-11-16") expect(r.codename).toMatch(/^[A-Z][A-Z0-9-]*$/);
    }
  });

  it("entri rilis terbaru (APP_VERSION) punya bukti verified", () => {
    const latest = getRelease(APP_VERSION);
    expect(latest).toBeDefined();
    expect(latest!.verified?.length ?? 0).toBeGreaterThan(0);
  });

  it("channel hanya dari nilai yang diketahui", () => {
    const channels = ["stable", "rc", "beta", "alpha"];
    for (const r of RELEASES) expect(channels).toContain(r.channel);
  });
});

describe("parseVersion & isValidVersion — SemVer 2.0.0", () => {
  it("mem-parse versi polos, prerelease, dan build metadata", () => {
    const p = parseVersion("10.2.1")!;
    expect(p).toEqual({ major: 10, minor: 2, patch: 1, prerelease: null, build: null });
    const q = parseVersion("2.0.0-rc.1+build.42")!;
    expect(q.prerelease).toBe("rc.1");
    expect(q.build).toBe("build.42");
    expect(q.major).toBe(2);
  });

  it("menolak format tidak valid (null / false)", () => {
    expect(parseVersion("bukan-versi")).toBeNull();
    expect(parseVersion("1.2")).toBeNull();
    expect(parseVersion("")).toBeNull();
    expect(isValidVersion("10.2.1")).toBe(true);
    expect(isValidVersion("10.2.1-beta.1")).toBe(true);
    expect(isValidVersion("v10")).toBe(false);
    expect(isValidVersion("1.2.3.4")).toBe(false);
  });
});

describe("compareVersions — pembeda SemVer yang benar", () => {
  it("mayor > minor > patch, urutan preseden dihormati", () => {
    expect(compareVersions("2.0.0", "1.9.9")).toBeGreaterThan(0);
    expect(compareVersions("1.10.0", "1.9.0")).toBeGreaterThan(0);
    expect(compareVersions("1.0.2", "1.0.1")).toBeGreaterThan(0);
    expect(compareVersions("1.0.0", "1.0.0")).toBe(0);
    expect(compareVersions("1.0.0-rc.1", "1.0.0")).toBeLessThan(0);
  });
});

describe("bumpVersion — tiga bobot kenaikan", () => {
  it("patch, minor, major bekerja sesuai kontrak", () => {
    expect(bumpVersion("10.2.1", "patch")).toBe("10.2.2");
    expect(bumpVersion("10.2.1", "minor")).toBe("10.3.0");
    expect(bumpVersion("10.2.1", "major")).toBe("11.0.0");
  });
});

describe("formatVersion & shortVersion — tampilan", () => {
  it("shortVersion memangkas patch (dengan prefix v)", () => {
    expect(shortVersion("10.2.1")).toBe("v10.2");
    expect(shortVersion()).toBe(shortVersion(APP_VERSION));
  });
  it("formatVersion memakai prefix v; channel non-stable ditambahkan sebagai suffix", () => {
    expect(formatVersion("10.2.1")).toBe("v10.2.1");
    expect(formatVersion("10.2.1", true)).toBe("v10.2.1"); // channel aktif = stable
  });
});

describe("registry rilis — fungsi agregat", () => {
  it("getRelease menemukan entri & mengembalikan undefined untuk versi asing", () => {
    expect(getRelease("10.2.0")?.codename).toBe("PUSAT-DATA");
    expect(getRelease("0.0.1")).toBeUndefined();
  });

  it("sortedReleases & latestRelease konsisten dengan urutan RELEASES", () => {
    expect(sortedReleases()[0].version).toBe(RELEASES[0].version);
    expect(latestRelease()?.version).toBe(RELEASES[0].version);
  });

  it("releaseStats menghitung total entri lintas kategori", () => {
    const stats = releaseStats();
    expect(stats.totalReleases).toBe(RELEASES.length);
    expect(stats.totalItems).toBeGreaterThan(0);
    expect(stats.totalItems).toBe(
      stats.added + stats.changed + stats.fixed + stats.removed + stats.deprecated + stats.security
    );
  });

  it("versionManifest — manifest runtime lengkap untuk /api/version", () => {
    const m = versionManifest("2026-11-16T00:00:00.000Z");
    expect(m.name).toBe("GUNARA OS");
    expect(m.version).toBe(APP_VERSION);
    expect(m.channel).toBe(APP_CHANNEL);
    expect(m.generatedAt).toBe("2026-11-16T00:00:00.000Z");
    expect(m.releaseCount).toBe(RELEASES.length);
    expect(m.semver).not.toBeNull();
    expect(m.latestRelease?.version).toBe(RELEASES[0].version);
    expect(m.codename).toBe(RELEASES[0].codename);
  });
});

describe("aturan & kategori terdokumentasi", () => {
  it("SEMVER_RULES menjelaskan MAJOR/MINOR/PATCH dengan contoh", () => {
    const parts = SEMVER_RULES.map((r) => r.part);
    expect(parts).toEqual(["MAJOR", "MINOR", "PATCH"]);
    for (const r of SEMVER_RULES) {
      expect(r.when.length).toBeGreaterThan(0);
      expect(r.example.length).toBeGreaterThan(0);
      expect(r.exampleWhen.length).toBeGreaterThan(0);
    }
  });
  it("CHANGELOG_CATEGORIES sesuai Keep a Changelog", () => {
    expect(CHANGELOG_CATEGORIES).toEqual(
      expect.arrayContaining(["added", "changed", "deprecated", "removed", "fixed", "security"])
    );
  });
});
