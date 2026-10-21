"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — i18n (Bahasa Indonesia 🇮🇩 / English 🇬🇧)
// by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon
//
// Standar internasional: seluruh kerangka UI (navigasi, header, footer,
// command palette) dapat berganti bahasa. Pilihan tersimpan permanen
// (localStorage "gunara-lang") dan ikut menandai <html lang>.
// ═══════════════════════════════════════════════════════════════════

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SectionId } from "@/components/app/nav";

export type Lang = "id" | "en";

interface I18nState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      lang: "id",
      setLang: (lang) => set({ lang }),
    }),
    { name: "gunara-lang" }
  )
);

// ── Terjemahan judul grup navigasi ────────────────────────────────
export const GROUP_EN: Record<string, string> = {
  "🚀 SEO MASTERY — Konsultan #1": "🚀 SEO MASTERY — Consultant #1",
  "🌊 HULU — Diisi Sekali": "🌊 UPSTREAM — Set Once",
  "⚙️ MESIN — Dirawat Mingguan": "⚙️ ENGINE — Maintained Weekly",
  "🏃 HILIR — Dijalankan Harian": "🏃 DOWNSTREAM — Run Daily",
  "🛡️ ARSENAL — Senjata": "🛡️ ARSENAL — Weapons",
  "⚡ GOD MODE — v9.0": "⚡ GOD MODE — v9.0",
  "🏛️ DEWAN — Nalar Kolektif": "🏛️ COUNCIL — Collective Reason",
  "💼 BISNIS HUB — Gunara Group": "💼 BUSINESS HUB — Gunara Group",
  "📚 PANDUAN": "📚 GUIDES",
};

// ── Terjemahan item navigasi (label + deskripsi) ──────────────────
export const NAV_EN: Record<string, { label: string; desc: string }> = {
  dashboard: { label: "Command Center", desc: "System home" },
  "seo-hub": { label: "SEO Command Center", desc: "SEO arsenal home" },
  "seo-audit": { label: "Audit Engine", desc: "40+ signals audit + AI" },
  "seo-keywords": { label: "Keyword Studio", desc: "AI research · clusters · intent" },
  "seo-ranks": { label: "Rank Tracker", desc: "Daily keyword positions" },
  "seo-content": { label: "Content Optimizer", desc: "Content score + AI" },
  "seo-calendar": { label: "Content Calendar", desc: "Editorial kanban" },
  "seo-backlinks": { label: "Backlink Monitor", desc: "Link profile & quality" },
  "seo-competitor": { label: "Competitor Radar", desc: "AI gap analysis" },
  "seo-forge": { label: "Meta & Schema Forge", desc: "SERP · OG · JSON-LD" },
  "seo-clients": { label: "Clients & Proposals", desc: "Projects + AI proposals" },
  "seo-academy": { label: "SEO Academy", desc: "Masterclass + 100-step checklist" },
  vault: { label: "Data Vault & Diagnostics", desc: "Backup · Restore · Health Check" },
  hulu: { label: "Charter · Vision · OKR", desc: "The source of everything" },
  keuangan: { label: "Finance", desc: "Debt · Receivables · Cash · Kids" },
  klien: { label: "Clients / CRM", desc: "Master + Follow-up" },
  relasi: { label: "Relations & Politics", desc: "Trust ledger" },
  belajar: { label: "Learning", desc: "Journal — dual engine" },
  dokumentasi: { label: "Documentation", desc: "Win Log + Case Studies" },
  harian: { label: "Daily Ritual", desc: "3 morning & evening MITs" },
  mingguan: { label: "Weekly Review", desc: "Sunday night, 30 minutes" },
  backlog: { label: "Backlog", desc: "Idea prison" },
  keputusan: { label: "Decisions Log", desc: "History of decisions" },
  domain: { label: "43 Domains", desc: "Portfolio & missions" },
  agents: { label: "15 AI Agents", desc: "Ready-to-copy role activation" },
  sistem: { label: "System", desc: "Rules · Rituals · Stack" },
  roadmap: { label: "90-Day Roadmap", desc: "Grand Build" },
  arena: { label: "Debate Arena", desc: "Council debates, arbitrated" },
  sage: { label: "Sage Console", desc: "Talk to 3 faces of wisdom" },
  solver: { label: "Ultimate Solver", desc: "Convene Council 46 via AI" },
  dewan46: { label: "Council 46", desc: "46 councils · 150+ years each" },
  bisnis: { label: "Business Database", desc: "Customers · Companies" },
  perizinan: { label: "Permits", desc: "ISO Tracker · Catalog · Finder" },
  asetdigital: { label: "Digital Assets", desc: "Socials · Vault · Users" },
  tutorial: { label: "Full Tutorial", desc: "Every feature, step by step" },
};

// ── String UI kerangka ─────────────────────────────────────────────
export const UI = {
  search: { id: "Cari…", en: "Search…" },
  searchAria: { id: "Buka command palette", en: "Open command palette" },
  skip: { id: "Lewati ke konten utama", en: "Skip to main content" },
  navAria: { id: "Navigasi utama", en: "Main navigation" },
  menuAria: { id: "Buka menu navigasi", en: "Open navigation menu" },
  footer: {
    id: "Data Vault & Diagnostik (Backup · Restore · Health Check) + SEO Mastery (11 Arsenal Konsultan #1) + Hulu → Mesin → Hilir + Bisnis Hub + Dewan 46 + God Mode (Arena Debat · Sage Console) — Master Polymath · Sage Universal · Ultimate Problem Solver.",
    en: "Data Vault & Diagnostics (Backup · Restore · Health Check) + SEO Mastery (11 Consultant #1 weapons) + Upstream → Engine → Downstream + Business Hub + Council 46 + God Mode (Debate Arena · Sage Console) — Master Polymath · Sage Universal · Ultimate Problem Solver.",
  },
  footerDedication: {
    id: "Untuk 3 wajah yang setiap pagi masih memanggil \u201cAyah\u201d. 🏛️",
    en: "For the 3 faces who still call \u201cDad\u201d every morning. 🏛️",
  },
  sidebarQuote: {
    id: "\u201cPrak burukeun — segerakan kesadaran. Ulah edan, kudu eling.\u201d",
    en: "\u201cPrak burukeun — a movement of awareness. Stay sane, stay mindful.\u201d",
  },
  sidebarQuoteSub: {
    id: "Jam 17.00: tutup laptop. Anak-anak menunggu.",
    en: "At 5 PM: close the laptop. The children are waiting.",
  },
  sidebarBadge: { id: "SEO MASTERY AKTIF", en: "SEO MASTERY ACTIVE" },
  sidebarBadgeSub: { id: "11 Arsenal · Audit · Rank · AI Proposal", en: "11 Weapons · Audit · Rank · AI Proposals" },
  version: { id: "v9.0 · SEO Mastery + Data Vault + God Mode", en: "v9.0 · SEO Mastery + Data Vault + God Mode" },
  langAria: { id: "Ganti bahasa", en: "Switch language" },
} as const;

/** Ambil string UI sesuai bahasa aktif. */
export function ui(key: keyof typeof UI, lang: Lang): string {
  return UI[key][lang];
}
