// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — BRAND REGISTRY (Single Source of Truth)
// ═══════════════════════════════════════════════════════════════════
// Signature tertanam di dalam sistem — senyap di permukaan, utuh di
// inti. Semua metadata SEO, JSON-LD, manifest, dan easter egg menarik
// data dari file ini. Ubah di sini, berlaku di seluruh sistem.
//
// by Gugun Gunara — Muhammad Lutfi Azmi
// prabudanling · Santri Angon
// PT Top Konsultan Internasional (topkonsultan.web.id)
// PT Digital Bisnis Manajemen (digiman.id)
// ═══════════════════════════════════════════════════════════════════

export const BRAND = {
  siteName: "GUNARA OS",
  version: "7.0.0",
  siteUrl: "https://gunara.web.id",
  tagline: "Sistem Operasi Hidup & Bisnis — Hulu → Mesin → Hilir · Dewan 46 · God Mode",

  person: {
    fullName: "Muhammad Lutfi Azmi",
    knownAs: "Gugun Gunara",
    roles: ["Master Polymath", "Sage Universal", "The Ultimate Problem Solver"],
    alias: ["prabudanling", "Santri Angon", "Prabu Danling", "bossdanling", "gunzz_krenzz", "gunaracorp"],
    description:
      "Gugun Gunara (nama lengkap: Muhammad Lutfi Azmi) — Master Polymath, Sage Universal, dan The Ultimate Problem Solver. Pendiri GUNARA OS, Gunara Corp, PT Top Konsultan Internasional, dan PT Digital Bisnis Manajemen. Juga dikenal sebagai prabudanling dan Santri Angon.",
  },

  organizations: [
    {
      name: "PT Top Konsultan Internasional",
      shortName: "Top Konsultan",
      url: "https://topkonsultan.web.id",
      domain: "topkonsultan.web.id",
      description: "Konsultan bisnis internasional — mitra strategi, legalitas, dan pertumbuhan usaha.",
    },
    {
      name: "PT Digital Bisnis Manajemen",
      shortName: "Digiman",
      url: "https://digiman.id",
      domain: "digiman.id",
      description: "Digital bisnis manajemen — sistem, transformasi digital, dan dukungan operasional.",
    },
  ],

  socials: [
    { name: "Facebook", handle: "bossdanling", url: "https://www.facebook.com/bossdanling" },
    { name: "X (Twitter)", handle: "gunzz_krenzz", url: "https://x.com/gunzz_krenzz" },
    { name: "Instagram", handle: "prabudanling", url: "https://www.instagram.com/prabudanling" },
    { name: "TikTok", handle: "gunaracorp", url: "https://www.tiktok.com/@gunaracorp" },
    { name: "Threads", handle: "prabudanling", url: "https://www.threads.com/@prabudanling" },
    { name: "Reddit", handle: "prabudanling", url: "https://www.reddit.com/user/prabudanling/" },
  ],
} as const;

/** Kalimat signature lengkap — dipakai di footer, vault, dan manifest. */
export const BRAND_SIGNATURE =
  "by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon · " +
  "PT Top Konsultan Internasional (topkonsultan.web.id) · " +
  "PT Digital Bisnis Manajemen (digiman.id)";

/** Kata kunci SEO — nama & brand tertanam agar terindeks Google. */
export const BRAND_KEYWORDS: string[] = [
  "Gugun Gunara",
  "Muhammad Lutfi Azmi",
  "prabudanling",
  "Santri Angon",
  "Prabu Danling",
  "GUNARA OS",
  "Gunara Corp",
  "Gunara Group",
  "bossdanling",
  "gunzz_krenzz",
  "gunaracorp",
  "PT Top Konsultan Internasional",
  "Top Konsultan Internasional",
  "topkonsultan.web.id",
  "PT Digital Bisnis Manajemen",
  "digiman.id",
  "master polymath indonesia",
  "sage universal",
  "ultimate problem solver",
  "sistem operasi bisnis",
  "sistem operasi pribadi",
  "aplikasi bisnis indonesia",
  "konsultan bisnis indonesia",
  "konsultan perizinan",
  "pusatperizinan.com",
  "pusat perizinan",
  "manajemen keuangan UMKM",
  "CRM bisnis",
  "productivity app indonesia",
  "notion alternative indonesia",
  "super app bisnis",
];

/** Deskripsi default situs — nama brand ditenun alami dalam kalimat. */
export const BRAND_DESCRIPTION =
  "GUNARA OS v8.0 — super app personal & bisnis (Hulu → Mesin → Hilir) dengan God Mode: Ultimate Solver & Dewan 46, " +
  "Arena Debat Dewan (46 dewan saling berdebat lalu diarbitrase), dan Sage Console (ngobrol langsung dengan " +
  "Master Polymath, Sage Universal, The Ultimate Problem Solver). " +
  "46 dewan pakar lintas bidang berpengalaman 150+ tahun untuk memecahkan masalah bisnis, keuangan, hukum, " +
  "teknologi, hingga keluarga. Ditempa khusus oleh " +
  "Gugun Gunara (Muhammad Lutfi Azmi · prabudanling · Santri Angon) di bawah " +
  "PT Top Konsultan Internasional (topkonsultan.web.id) dan " +
  "PT Digital Bisnis Manajemen (digiman.id). " +
  "Master Polymath · Sage Universal · The Ultimate Problem Solver.";

export const BRAND_TITLE =
  "GUNARA OS v8.0 — Sistem Operasi Hidup & Bisnis · Dewan 46 · God Mode by Gugun Gunara (Muhammad Lutfi Azmi)";

/** JSON-LD @graph — identitas terstruktur untuk Google Knowledge Graph. */
export function buildBrandJsonLd() {
  const personId = `${BRAND.siteUrl}/#person-gugun-gunara`;
  const websiteId = `${BRAND.siteUrl}/#website`;
  const orgIds = BRAND.organizations.map((o) => `${o.url}/#organization`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: BRAND.person.fullName,
        alternateName: [BRAND.person.knownAs, ...BRAND.person.alias],
        jobTitle: BRAND.person.roles.join(" · "),
        description: BRAND.person.description,
        url: BRAND.siteUrl,
        sameAs: BRAND.socials.map((s) => s.url),
        knowsAbout: [
          "Bisnis", "Konsultan Perizinan", "Manajemen", "Digital Transformation",
          "Sistem Operasi Bisnis", "Keuangan", "Entrepreneurship", "Teknologi",
        ],
        worksFor: orgIds.map((id) => ({ "@id": id })),
      },
      ...BRAND.organizations.map((org) => ({
        "@type": "Organization",
        "@id": `${org.url}/#organization`,
        name: org.name,
        alternateName: org.shortName,
        url: org.url,
        description: org.description,
        founder: { "@id": personId },
        parentOrganization: { "@id": orgIds[0] },
      })),
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: BRAND.siteUrl,
        name: BRAND.siteName,
        alternateName: ["Gunara OS", "GunaraOS", "GUNARA"],
        description: BRAND_DESCRIPTION,
        inLanguage: "id-ID",
        author: { "@id": personId },
        publisher: { "@id": orgIds[0] },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${BRAND.siteUrl}/#software`,
        name: BRAND.siteName,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: BRAND_DESCRIPTION,
        author: { "@id": personId },
        publisher: { "@id": orgIds[0] },
        isPartOf: { "@id": websiteId },
      },
    ],
  };
}
