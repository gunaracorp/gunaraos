import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/branding";

// Sitemap — membantu Google mengindeks GUNARA OS beserta identitas brandnya
// (Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BRAND.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
