import { describe, expect, it } from "vitest";
import { BRAND, BRAND_DESCRIPTION, BRAND_TITLE, VERSION, VERSION_SHORT, buildBrandJsonLd } from "../branding";
import { APP_VERSION, APP_CHANNEL } from "../versioning";

describe("branding — satu sumber kebenaran", () => {
  it("VERSION mengikuti SemVer 2.0.0", () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("VERSION_SHORT = MAJOR.MINOR dari VERSION", () => {
    expect(VERSION_SHORT).toBe(VERSION.split(".").slice(0, 2).join("."));
  });

  it("APP_VERSION (versioning) === BRAND.version — sinkron", () => {
    expect(APP_VERSION).toBe(VERSION);
    expect(BRAND.version).toBe(VERSION);
  });

  it("identitas inti tak boleh kosong", () => {
    expect(BRAND.siteName).toBe("GUNARA OS");
    expect(BRAND.siteUrl).toMatch(/^https:\/\//);
    expect(BRAND.tagline.length).toBeGreaterThan(0);
  });

  it("judul & deskripsi menurunkan versi dari sumber tunggal", () => {
    expect(BRAND_TITLE).toContain(VERSION_SHORT);
    expect(BRAND_DESCRIPTION.length).toBeGreaterThan(0);
  });

  it("organisasi & sosmed terinventaris", () => {
    expect(BRAND.organizations.length).toBeGreaterThanOrEqual(2);
    expect(BRAND.person.fullName.length).toBeGreaterThan(0);
    expect(BRAND.person.roles.length).toBeGreaterThan(0);
    for (const o of BRAND.organizations) expect(o.url).toMatch(/^https:\/\//);
    for (const s of BRAND.socials) expect(s.url).toMatch(/^https:\/\//);
  });

  it("buildBrandJsonLd — @graph lengkap: Person, Organizations, WebSite, SoftwareApplication", () => {
    const jsonld = buildBrandJsonLd();
    expect(jsonld["@context"]).toBe("https://schema.org");
    const graph = jsonld["@graph"] as Array<Record<string, unknown>>;
    const types = graph.map((n) => n["@type"]);
    expect(types).toContain("Person");
    expect(types.filter((t) => t === "Organization").length).toBe(BRAND.organizations.length);
    expect(types).toContain("WebSite");
    expect(types).toContain("SoftwareApplication");
    expect(types).toContain("FAQPage");
    const software = graph.find((n) => n["@type"] === "SoftwareApplication")!;
    expect(software.softwareVersion).toBe(VERSION);
    const website = graph.find((n) => n["@type"] === "WebSite")!;
    expect(website.inLanguage).toBe("id-ID");
    const appChannelConsistent = APP_VERSION === VERSION && typeof APP_CHANNEL === "string";
    expect(appChannelConsistent).toBe(true);
  });
});
