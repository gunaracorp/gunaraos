import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import {
  BRAND, BRAND_TITLE, BRAND_DESCRIPTION, BRAND_KEYWORDS, BRAND_LOCALES, buildBrandJsonLd,
} from "@/lib/branding";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — Root Layout (Metadata Berstandard Internasional)
// GUNARA OS by Gugun Gunara — Muhammad Lutfi Azmi
// prabudanling · Santri Angon
// PT Top Konsultan Internasional (topkonsultan.web.id)
// PT Digital Bisnis Manajemen (digiman.id)
// Master Polymath · Sage Universal · The Ultimate Problem Solver
// ═══════════════════════════════════════════════════════════════════

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// ── URL gambar untuk kartu sosial ────────────────────────────────
const OG_IMAGE = "/opengraph-image";
const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: BRAND_TITLE,
    template: "%s · GUNARA OS by Gugun Gunara",
  },
  description: BRAND_DESCRIPTION,
  keywords: [...BRAND_KEYWORDS],
  applicationName: "GUNARA OS",
  authors: [
    {
      name: "Gugun Gunara — Muhammad Lutfi Azmi",
      url: "https://www.instagram.com/prabudanling",
    },
  ],
  creator: "Gugun Gunara (Muhammad Lutfi Azmi · prabudanling · Santri Angon)",
  publisher: "PT Top Konsultan Internasional · PT Digital Bisnis Manajemen",
  generator: "GUNARA OS by Gugun Gunara",
  referrer: "origin-when-cross-origin",
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/logo.svg" }],
    apple: [{ url: "/logo.svg" }],
    other: [{ rel: "mask-icon", url: "/logo.svg", color: "#0d1f19" }],
  },
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/",
      en: "/",
      "x-default": "/",
    },
    types: {
      "application/rss+xml": `${BRAND.siteUrl}/sitemap.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "GUNARA OS — by Gugun Gunara",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: OG_IMAGE_SIZE.width,
        height: OG_IMAGE_SIZE.height,
        alt: "GUNARA OS — Sistem Operasi Hidup & Bisnis by Gugun Gunara (Muhammad Lutfi Azmi)",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@gunzz_krenzz",
    creator: "@gunzz_krenzz",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
    date: false,
  },
  appleWebApp: {
    capable: true,
    title: "GUNARA OS",
    statusBarStyle: "black-translucent",
  },
  category: "technology",
  classification: "Business Software · Productivity · SEO Tools",
  other: {
    author: "Gugun Gunara — Muhammad Lutfi Azmi (prabudanling · Santri Angon)",
    "og:profile:username": "prabudanling",
    "geo.region": "ID",
    "geo.placename": "Indonesia",
    "content-language": "id",
    "revisit-after": "7 days",
    "distribution": "global",
    "rating": "general",
    "apple-mobile-web-app-title": "GUNARA OS",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1f19" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} font-sans antialiased bg-background text-foreground`}
      >
        {/* Skip link — aksesibilitas standar WCAG (internasional) */}
        <a
          href="#gunara-main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[999] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
        >
          Lewati ke konten utama
        </a>
        {/* GUNARA OS — ditempa by Gugun Gunara (Muhammad Lutfi Azmi · prabudanling · Santri Angon)
            PT Top Konsultan Internasional — topkonsultan.web.id
            PT Digital Bisnis Manajemen — digiman.id
            Support system: Gunara Corp · pusatperizinan.com · gunara.web.id */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        {/* Structured data — identitas brand untuk Google Knowledge Graph (tak terlihat di permukaan) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBrandJsonLd()) }}
        />
        {/* Meta katalog bahasa — bantu mesin cari memahami dukungan multibahasa */}
        <meta name="supported-languages" content={BRAND_LOCALES.map((l) => l.hreflang).join(", ")} />
      </body>
    </html>
  );
}
