// ═══════════════════════════════════════════════════
// GUNARA OS — Peta Navigasi (dipakai AppShell + Command Palette)
// ═══════════════════════════════════════════════════

import {
  LayoutDashboard, Waves, Wallet, Users, Handshake, BookOpen, Trophy,
  Sun, CalendarCheck, Inbox, Scale, Globe, Bot, ShieldCheck, Target,
  Briefcase, ScrollText, Lock, GraduationCap, Landmark, Brain, Swords,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";

export type SectionId =
  | "dashboard" | "hulu"
  | "keuangan" | "klien" | "relasi" | "belajar" | "dokumentasi"
  | "harian" | "mingguan" | "backlog" | "keputusan"
  | "domain" | "agents" | "sistem" | "roadmap"
  | "bisnis" | "perizinan" | "asetdigital"
  | "arena" | "sage" | "dewan46" | "solver"
  | "tutorial";

export interface NavItem { id: SectionId; label: string; icon: LucideIcon; desc?: string }
export interface NavGroup { title: string; items: NavItem[] }

export const NAV: NavGroup[] = [
  {
    title: "🌊 HULU — Diisi Sekali", items: [
      { id: "hulu", label: "Piagam · Visi · OKR", icon: Waves, desc: "Mata air segalanya" },
    ],
  },
  {
    title: "⚙️ MESIN — Dirawat Mingguan", items: [
      { id: "keuangan", label: "Keuangan", icon: Wallet, desc: "Hutang · Piutang · Kas · Anak" },
      { id: "klien", label: "Klien / CRM", icon: Users, desc: "Master + Follow-up" },
      { id: "relasi", label: "Relasi & Politik", icon: Handshake, desc: "Ledger kepercayaan" },
      { id: "belajar", label: "Belajar", icon: BookOpen, desc: "Jurnal — mesin ganda" },
      { id: "dokumentasi", label: "Dokumentasi", icon: Trophy, desc: "Win Log + Studi Kasus" },
    ],
  },
  {
    title: "🏃 HILIR — Dijalankan Harian", items: [
      { id: "harian", label: "Ritual Harian", icon: Sun, desc: "3 MIT pagi & malam" },
      { id: "mingguan", label: "Review Mingguan", icon: CalendarCheck, desc: "Minggu malam 30 menit" },
      { id: "backlog", label: "Backlog", icon: Inbox, desc: "Penjara ide" },
      { id: "keputusan", label: "Decisions Log", icon: Scale, desc: "Sejarah keputusan" },
    ],
  },
  {
    title: "🛡️ ARSENAL — Senjata", items: [
      { id: "domain", label: "43 Domain", icon: Globe, desc: "Portfolio & misi" },
      { id: "agents", label: "15 AI Agents", icon: Bot, desc: "Role activation siap copy" },
      { id: "sistem", label: "Sistem", icon: ShieldCheck, desc: "Aturan · Ritual · Stack" },
      { id: "roadmap", label: "Roadmap 90 Hari", icon: Target, desc: "Grand Build" },
    ],
  },
  {
    title: "⚡ GOD MODE — v7.0", items: [
      { id: "arena", label: "Arena Debat", icon: Swords, desc: "Dewan saling berdebat, diarbitrase" },
      { id: "sage", label: "Sage Console", icon: MessagesSquare, desc: "Ngobrol 3 wajah kebijaksanaan" },
    ],
  },
  {
    title: "🏛️ DEWAN — Nalar Kolektif", items: [
      { id: "solver", label: "Ultimate Solver", icon: Brain, desc: "Sidangkan Dewan 46 via AI" },
      { id: "dewan46", label: "Dewan 46", icon: Landmark, desc: "46 dewan · 150+ tahun/dewan" },
    ],
  },
  {
    title: "💼 BISNIS HUB — Gunara Group", items: [
      { id: "bisnis", label: "Database Bisnis", icon: Briefcase, desc: "Pelanggan · Perusahaan" },
      { id: "perizinan", label: "Perizinan", icon: ScrollText, desc: "Tracker ISO · Katalog · Finder" },
      { id: "asetdigital", label: "Aset Digital", icon: Lock, desc: "Sosmed · Brankas · Pengguna" },
    ],
  },
  {
    title: "📚 PANDUAN", items: [
      { id: "tutorial", label: "Tutorial Lengkap", icon: GraduationCap, desc: "Semua fitur, langkah demi langkah" },
    ],
  },
];

export const ALL_ITEMS: Record<SectionId, NavItem> = Object.fromEntries(
  NAV.flatMap((g) => g.items.map((i) => [i.id, i]))
) as Record<SectionId, NavItem>;

export const COMMAND_CENTER: NavItem = {
  id: "dashboard", label: "Command Center", icon: LayoutDashboard, desc: "Beranda sistem",
};
