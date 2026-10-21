import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import {
  BRAND, BRAND_TITLE, BRAND_DESCRIPTION, BRAND_KEYWORDS, buildBrandJsonLd,
} from "@/lib/branding";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — Root Layout
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
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg" }],
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "GUNARA OS — by Gugun Gunara",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    site: "@gunzz_krenzz",
    creator: "@gunzz_krenzz",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  other: {
    author: "Gugun Gunara — Muhammad Lutfi Azmi (prabudanling · Santri Angon)",
    "og:profile:username": "prabudanling",
    "geo.region": "ID",
    "content-language": "id",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1f19",
  width: "device-width",
  initialScale: 1,
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
        {/* GUNARA OS — ditempa by Gugun Gunara (Muhammad Lutfi Azmi · prabudanling · Santri Angon)
            PT Top Konsultan Internasional — topkonsultan.web.id
            PT Digital Bisnis Manajemen — digiman.id
            Support system: Gunara Corp · pusatperizinan.com · gunara.web.id */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        {/* Structured data — identitas brand untuk Google (tak terlihat di permukaan) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBrandJsonLd()) }}
        />
      </body>
    </html>
  );
}
