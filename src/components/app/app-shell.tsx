"use client";

// ═══════════════════════════════════════════════════
// GUNARA OS — AppShell
// Standar internasional: transisi antar-section, indikator
// navigasi beranimasi (layoutId), command palette ⌘K,
// dark/light theme, scroll progress, jam live WIB.
// ═══════════════════════════════════════════════════

import { useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Menu, X, Search, Sun, Moon, Landmark, Clock, Command,
} from "lucide-react";
import { Dashboard } from "@/components/app/dashboard";
import { HuluSection } from "@/components/app/hulu";
import { FinanceSection } from "@/components/app/finance";
import { CrmSection, RelationsSection } from "@/components/app/crm";
import { LearningSection, DocumentationSection } from "@/components/app/mesin-lain";
import { DailySection, WeeklySection, BacklogSection, DecisionsSection } from "@/components/app/hilir";
import { DomainsSection, AgentsSection, SystemSection, RoadmapSection } from "@/components/app/arsenal";
import { BisnisSection } from "@/components/app/bisnis";
import { PerizinanSection } from "@/components/app/perizinan";
import { AsetDigitalSection } from "@/components/app/aset-digital";
import { Dewan46Section } from "@/components/app/dewan";
import { UltimateSolverSection } from "@/components/app/solver";
import { ArenaSection } from "@/components/app/arena";
import { SageConsoleSection } from "@/components/app/sage";
import { TutorialSection } from "@/components/app/guide";
import { SeoHubSection } from "@/components/app/seo/seo-hub";
import { SeoAuditSection } from "@/components/app/seo/seo-audit";
import { KeywordStudioSection } from "@/components/app/seo/seo-keywords";
import { RankTrackerSection, BacklinkSection } from "@/components/app/seo/seo-ranks";
import { ContentOptimizerSection, ContentCalendarSection } from "@/components/app/seo/seo-content";
import { CompetitorRadarSection } from "@/components/app/seo/seo-competitor";
import { MetaForgeSection } from "@/components/app/seo/seo-forge";
import { SeoClientsSection } from "@/components/app/seo/seo-clients";
import { SeoAcademySection } from "@/components/app/seo/seo-academy";
import { BrandMark, BrandConsole, BrandSignatureLine } from "./brand-signature";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { NAV, ALL_ITEMS, COMMAND_CENTER, type NavItem, type SectionId } from "./nav";
import { PageTransition, useNow, useMounted, EASE } from "./motion";
import { CommandPalette } from "./command-palette";

function SidebarContent({
  active,
  onNavigate,
  animated = false,
}: {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  animated?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-5 border-b border-sidebar-border">
        <motion.div
          initial={reduce || !animated ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-2.5"
        >
          {/* Vault: klik 7× pada logo membuka signature tersembunyi */}
          <BrandMark />
          <div>
            <p className="font-extrabold tracking-tight text-amber-50 leading-none">GUNARA OS</p>
            <p className="text-[11px] text-emerald-200/70 mt-1">v8.0 · SEO Mastery + God Mode</p>
          </div>
        </motion.div>
      </div>

      <nav className="flex-1 overflow-y-auto nice-scroll px-2 py-3 space-y-4" aria-label="Navigasi utama">
        <motion.div
          initial={reduce || !animated ? false : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
        >
          <NavButton item={COMMAND_CENTER} active={active === "dashboard"} onClick={() => onNavigate("dashboard")} animated={animated} bold />
        </motion.div>

        {NAV.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={reduce || !animated ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.12 + gi * 0.06, ease: EASE }}
          >
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-emerald-200/50">{group.title}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavButton
                  key={item.id}
                  item={item}
                  active={active === item.id}
                  onClick={() => onNavigate(item.id)}
                  animated={animated}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-[11px] text-emerald-200/60 italic leading-relaxed">
          &ldquo;Prak burukeun — segerakan kesadaran. Ulah edan, kudu eling.&rdquo;
        </p>
        <p className="text-[10px] text-emerald-200/40 mt-1">Jam 17.00: tutup laptop. Anak-anak menunggu.</p>
        <div className="mt-2 rounded-lg bg-emerald-900/60 border border-emerald-800 px-2.5 py-2">
          <p className="text-[10px] font-bold text-amber-300 tracking-wide">SEO MASTERY AKTIF</p>
          <p className="text-[10px] text-emerald-200/70 mt-0.5">11 Arsenal · Audit · Rank · AI Proposal</p>
        </div>
      </div>
    </div>
  );
}

function NavButton({
  item, active, onClick, animated, bold,
}: {
  item: NavItem; active: boolean; onClick: () => void; animated: boolean; bold?: boolean;
}) {
  const reduce = useReducedMotion();
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors text-left group",
        active ? "text-emerald-950 font-bold" : bold ? "font-semibold text-emerald-100/85" : "text-emerald-100/75",
        !active && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      )}
    >
      {active && (
        <motion.span
          layoutId={animated ? "gunara-nav-pill" : undefined}
          className="absolute inset-0 rounded-lg bg-amber-400 shadow"
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <Icon className={cn(
        "size-4 flex-none relative z-10 transition-transform",
        !active && !reduce && "group-hover:translate-x-0.5"
      )} />
      <span className="flex-1 truncate relative z-10">{item.label}</span>
    </button>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const reduce = useReducedMotion();
  // Guard hydration: render placeholder hingga tema terbaca di klien
  const mounted = useMounted();
  if (!mounted) return <Button variant="ghost" size="icon" className="size-8 opacity-0 pointer-events-none" aria-hidden />;
  const dark = resolvedTheme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={reduce ? false : { rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex"
        >
          {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

export function AppShell() {
  const [active, setActive] = useState<SectionId>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const now = useNow(30_000);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  const go = (id: string) => {
    setActive(id as SectionId);
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  };

  const item: NavItem =
    active === "dashboard"
      ? COMMAND_CENTER
      : ALL_ITEMS[active] || COMMAND_CENTER;

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
      case "bisnis": return <BisnisSection />;
      case "perizinan": return <PerizinanSection />;
      case "asetdigital": return <AsetDigitalSection />;
      case "dewan46": return <Dewan46Section onNavigate={go} />;
      case "solver": return <UltimateSolverSection />;
      case "arena": return <ArenaSection />;
      case "sage": return <SageConsoleSection />;
      case "tutorial": return <TutorialSection onNavigate={go} />;
      case "seo-hub": return <SeoHubSection onNavigate={go} />;
      case "seo-audit": return <SeoAuditSection />;
      case "seo-keywords": return <KeywordStudioSection />;
      case "seo-ranks": return <RankTrackerSection />;
      case "seo-content": return <ContentOptimizerSection />;
      case "seo-calendar": return <ContentCalendarSection />;
      case "seo-backlinks": return <BacklinkSection />;
      case "seo-competitor": return <CompetitorRadarSection />;
      case "seo-forge": return <MetaForgeSection />;
      case "seo-clients": return <SeoClientsSection />;
      case "seo-academy": return <SeoAcademySection />;
      default: return <Dashboard onNavigate={go} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Scroll progress — standar aplikasi kelas dunia */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-400"
        style={{ scaleX: progress }}
        aria-hidden
      />

      {/* Sidebar desktop */}
      <aside className="hidden lg:block w-72 flex-none bg-sidebar text-sidebar-foreground border-r border-sidebar-border sticky top-0 h-screen">
        <SidebarContent active={active} onNavigate={setActive} animated />
      </aside>

      {/* Sidebar mobile */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="lg:hidden fixed top-3 left-3 z-50 bg-emerald-950 text-amber-200 shadow-lg hover:bg-emerald-900"
            aria-label="Buka menu navigasi"
            // aria-controls dari useId Radix bisa bergeser saat hydration stale
            // (upstream React 19.2 — radix#3700); atribut ini harmless saat sheet
            // tertutup & dihitung ulang Radix saat dibuka → diamkan saja.
            suppressHydrationWarning
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 bg-sidebar text-sidebar-foreground border-sidebar-border">
          <SheetTitle className="sr-only">Navigasi GUNARA OS</SheetTitle>
          {/* Deskripsi sr-only: wajib Radix agar tidak ada warning aria-describedby */}
          <SheetDescription className="sr-only">Menu navigasi seluruh section GUNARA OS</SheetDescription>
          <SidebarContent active={active} onNavigate={go} />
        </SheetContent>
      </Sheet>

      {/* Tombol command palette — mobile */}
      <Button
        size="icon"
        className="lg:hidden fixed top-3 left-14 z-50 size-9 bg-emerald-950/90 text-amber-200 shadow-lg hover:bg-emerald-900"
        onClick={() => setPaletteOpen(true)}
        aria-label="Buka pencarian cepat"
      >
        <Search className="size-4" />
      </Button>

      {/* Konten */}
      <main className="flex-1 min-w-0">
        <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b bg-card/60 backdrop-blur sticky top-0 z-40">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={item.label}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="flex items-center gap-2 text-sm"
            >
              <Landmark className="size-4 text-emerald-800 dark:text-emerald-400" />
              <span className="font-bold tracking-tight">{item.label}</span>
              {item.desc && <span className="text-muted-foreground">— {item.desc}</span>}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AnimatePresence>
              {now && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="hidden xl:inline-flex items-center gap-1.5 rounded-full border bg-muted/50 px-2.5 py-1 font-semibold tabular-nums"
                >
                  <Clock className="size-3" /> {String(now.getHours()).padStart(2, "0")}.{String(now.getMinutes()).padStart(2, "0")} WIB
                </motion.span>
              )}
            </AnimatePresence>
            <button
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border bg-muted/40 hover:bg-muted px-2.5 py-1.5 font-medium transition-colors"
              aria-label="Buka command palette"
            >
              <Search className="size-3.5" /> Cari…
              <kbd className="pointer-events-none inline-flex h-4.5 items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-semibold text-muted-foreground">
                <Command className="size-2.5" />K
              </kbd>
            </button>
            <ThemeToggle />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950 text-amber-200 px-3 py-1.5 font-semibold">
              Gunara Group · 2 PT · 43 Domain
            </span>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl mx-auto pb-16">
          <PageTransition sectionKey={active}>{content()}</PageTransition>
        </div>

        <footer className="border-t bg-card/60 mt-auto">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <p><strong className="text-emerald-800 dark:text-emerald-400">GUNARA OS v8.0</strong> — SEO Mastery (11 Arsenal Konsultan #1) + Hulu → Mesin → Hilir + Bisnis Hub + Dewan 46 + God Mode (Arena Debat · Sage Console) — Master Polymath · Sage Universal · Ultimate Problem Solver.</p>
            <p>Untuk 3 wajah yang setiap pagi masih memanggil &ldquo;Ayah&rdquo;. 🏛️</p>
          </div>
          {/* Signature senyap — tersembunyi di permukaan, utuh di dalam sistem */}
          <div className="max-w-6xl mx-auto px-6 pb-4">
            <BrandSignatureLine />
          </div>
        </footer>
      </main>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onNavigate={go} />

      {/* Banner signature di DevTools console — senyap, tak terlihat di UI */}
      <BrandConsole />
    </div>
  );
}
