"use client";

import { useState } from "react";
import {
  LayoutDashboard, Waves, Wallet, Users, Handshake, BookOpen, Trophy,
  Sun, CalendarCheck, Inbox, Scale, Globe, Bot, ShieldCheck, Target,
  Menu, X, Landmark,
} from "lucide-react";
import { Dashboard } from "@/components/app/dashboard";
import { HuluSection } from "@/components/app/hulu";
import { FinanceSection } from "@/components/app/finance";
import { CrmSection, RelationsSection } from "@/components/app/crm";
import { LearningSection, DocumentationSection } from "@/components/app/mesin-lain";
import { DailySection, WeeklySection, BacklogSection, DecisionsSection } from "@/components/app/hilir";
import { DomainsSection, AgentsSection, SystemSection, RoadmapSection } from "@/components/app/arsenal";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type SectionId =
  | "dashboard" | "hulu"
  | "keuangan" | "klien" | "relasi" | "belajar" | "dokumentasi"
  | "harian" | "mingguan" | "backlog" | "keputusan"
  | "domain" | "agents" | "sistem" | "roadmap";

interface NavItem { id: SectionId; label: string; icon: React.ElementType; desc?: string }
interface NavGroup { title: string; items: NavItem[] }

const NAV: NavGroup[] = [
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
];

const ALL_ITEMS: Record<SectionId, NavItem> = Object.fromEntries(
  NAV.flatMap((g) => g.items.map((i) => [i.id, i]))
) as Record<SectionId, NavItem>;

function SidebarContent({ active, onNavigate }: { active: SectionId; onNavigate: (id: SectionId) => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 font-black text-lg shadow-lg">G</div>
          <div>
            <p className="font-extrabold tracking-tight text-amber-50 leading-none">GUNARA OS</p>
            <p className="text-[11px] text-emerald-200/70 mt-1">Sistem Operasi Hidup · v1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto nice-scroll px-2 py-3 space-y-4">
        <button
          onClick={() => onNavigate("dashboard")}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors text-left",
            active === "dashboard"
              ? "bg-amber-400 text-emerald-950 shadow"
              : "text-emerald-100/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <LayoutDashboard className="size-4 flex-none" /> Command Center
        </button>

        {NAV.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-emerald-200/50">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors text-left",
                      active === item.id
                        ? "bg-amber-400 text-emerald-950 font-bold shadow"
                        : "text-emerald-100/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className="size-4 flex-none" />
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-[11px] text-emerald-200/60 italic leading-relaxed">
          &ldquo;Prak burukeun — segerakan kesadaran. Ulah edan, kudu eling.&rdquo;
        </p>
        <p className="text-[10px] text-emerald-200/40 mt-1">Jam 17.00: tutup laptop. Anak-anak menunggu.</p>
      </div>
    </div>
  );
}

export function AppShell() {
  const [active, setActive] = useState<SectionId>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (id: string) => {
    setActive(id as SectionId);
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  };

  const item: NavItem | undefined =
    active === "dashboard"
      ? { id: "dashboard", label: "Command Center", icon: LayoutDashboard, desc: "Beranda sistem" }
      : ALL_ITEMS[active];

  const content = () => {
    switch (active) {
      case "dashboard": return <Dashboard onNavigate={go} />;
      case "hulu": return <HuluSection />;
      case "keuangan": return <FinanceSection />;
      case "klien": return <CrmSection />;
      case "relasi": return <RelationsSection />;
      case "belajar": return <LearningSection />;
      case "dokumentasi": return <DocumentationSection />;
      case "harian": return <DailySection />;
      case "mingguan": return <WeeklySection />;
      case "backlog": return <BacklogSection />;
      case "keputusan": return <DecisionsSection />;
      case "domain": return <DomainsSection />;
      case "agents": return <AgentsSection />;
      case "sistem": return <SystemSection />;
      case "roadmap": return <RoadmapSection />;
      default: return <Dashboard onNavigate={go} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden lg:block w-72 flex-none bg-sidebar text-sidebar-foreground border-r border-sidebar-border sticky top-0 h-screen">
        <SidebarContent active={active} onNavigate={setActive} />
      </aside>

      {/* Sidebar mobile */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="lg:hidden fixed top-3 left-3 z-50 bg-emerald-950 text-amber-200 shadow-lg hover:bg-emerald-900"
            aria-label="Buka menu navigasi"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar text-sidebar-foreground border-sidebar-border">
          <SheetTitle className="sr-only">Navigasi GUNARA OS</SheetTitle>
          <SidebarContent active={active} onNavigate={go} />
        </SheetContent>
      </Sheet>

      {/* Konten */}
      <main className="flex-1 min-w-0">
        <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b bg-card/60 backdrop-blur sticky top-0 z-40">
          <div className="flex items-center gap-2 text-sm">
            <Landmark className="size-4 text-emerald-800 dark:text-emerald-400" />
            <span className="font-bold tracking-tight">{item?.label}</span>
            {item?.desc && <span className="text-muted-foreground">— {item.desc}</span>}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 text-amber-200 px-3 py-1.5 font-semibold">
              Gunara Group · 2 PT · 43 Domain
            </span>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl mx-auto pb-16">
          {content()}
        </div>

        <footer className="border-t bg-card/60 mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p><strong className="text-emerald-800 dark:text-emerald-400">GUNARA OS v1.0</strong> — Dibangun dari doc-gunaracorp: Hulu → Mesin → Hilir.</p>
            <p>Untuk 3 wajah yang setiap pagi masih memanggil &ldquo;Ayah&rdquo;. 🏛️</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
