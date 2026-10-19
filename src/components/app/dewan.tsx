"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v6.0 — DEWAN 46
// Galeri 46 dewan pakar lintas bidang (150+ tahun pengalaman kolektif
// per dewan). Klik kartu → detail dewan → "Panggil ke Ultimate Solver".
// ═══════════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Crosshair, Wallet, Scale, Cpu, Megaphone, Users, Settings2,
  MoonStar, BarChart3, Palette, Building2, Globe, Search, Gavel,
  Quote, Landmark, Scroll, Sparkles,
  type LucideIcon,
} from "lucide-react";
import { DEWAN, COUNCIL_GROUPS, TOTAL_YEARS, type Council, type CouncilGroup } from "@/lib/dewan";
import { FadeUp, Stagger, StaggerItem, HoverLift, EASE } from "./motion";
import { cn } from "@/lib/utils";

const GROUP_ICON: Record<CouncilGroup, LucideIcon> = {
  "Strategi & Bisnis": Crosshair,
  "Keuangan": Wallet,
  "Hukum & Legalitas": Scale,
  "Teknologi": Cpu,
  "Marketing & Brand": Megaphone,
  "SDM & Kepemimpinan": Users,
  "Operasional": Settings2,
  "Hidup & Spiritual": MoonStar,
  "Analitik & Keputusan": BarChart3,
  "Kreatif & Komunikasi": Palette,
  "Properti & Aset": Building2,
  "Global": Globe,
};

export function Dewan46Section({ onNavigate }: { onNavigate: (section: string) => void }) {
  const reduce = useReducedMotion();
  const [group, setGroup] = useState<CouncilGroup | "Semua">("Semua");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<Council | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return DEWAN.filter((c) => {
      const okGroup = group === "Semua" || c.group === group;
      const okQ =
        !needle ||
        c.name.toLowerCase().includes(needle) ||
        c.tagline.toLowerCase().includes(needle) ||
        c.specialties.some((s) => s.toLowerCase().includes(needle));
      return okGroup && okQ;
    });
  }, [group, q]);

  const panggil = (c: Council) => {
    try {
      sessionStorage.setItem("gunara:solver-draft", JSON.stringify([c.id]));
    } catch { /* abaikan */ }
    setDetail(null);
    onNavigate("solver");
  };

  const tahunLabel = TOTAL_YEARS.toLocaleString("id-ID");

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-6 sm:p-8 text-emerald-50">
          <div className="absolute -right-10 -top-10 opacity-[0.07]">
            <Landmark className="size-56" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/90">GUNARA OS v6.0 — Nalar Kolektif</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-amber-100">
            🏛️ DEWAN 46
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/80 leading-relaxed">
            Empat puluh enam dewan pakar lintas bidang berdiri di balik sistem ini. Setiap dewan adalah gabungan
            arketipe legendaris dengan pengalaman kolektif lebih dari 150 tahun — siap bersidang untuk masalahmu
            melalui Ultimate Solver.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-3 py-1.5 text-xs font-bold text-amber-200 tabular-nums">
              <Landmark className="size-3.5" /> 46 Dewan
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-3 py-1.5 text-xs font-bold text-amber-200 tabular-nums">
              <Scroll className="size-3.5" /> {tahunLabel} Tahun Pengalaman Kolektif
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 px-3 py-1.5 text-xs font-bold text-amber-200">
              <Sparkles className="size-3.5" /> Master Polymath · Sage Universal · Ultimate Problem Solver
            </span>
          </div>
        </div>
      </FadeUp>

      {/* ── Filter ── */}
      <FadeUp delay={0.05}>
        <div className="flex flex-col gap-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari dewan atau keahlian…"
              className="pl-9"
              aria-label="Cari dewan"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["Semua", ...COUNCIL_GROUPS] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g as CouncilGroup | "Semua")}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  group === g
                    ? "bg-emerald-800 text-amber-200 border-emerald-700 shadow"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Grid Dewan ── */}
      <Stagger className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => {
          const Icon = GROUP_ICON[c.group];
          return (
            <StaggerItem key={c.id}>
              <HoverLift>
                <button
                  onClick={() => setDetail(c)}
                  className="w-full text-left rounded-xl border bg-card p-4 transition-colors hover:border-emerald-600/60 hover:bg-accent/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="size-9 flex-none rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-900 text-amber-200 flex items-center justify-center shadow">
                        <Icon className="size-4.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-sm tracking-tight">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">{c.group}</p>
                      </div>
                    </div>
                    <span className="flex-none rounded-full border bg-amber-400/10 border-amber-400/30 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-300 tabular-nums">
                      {c.years} th
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">{c.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {c.specialties.slice(0, 3).map((s) => (
                      <span key={s} className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {s}
                      </span>
                    ))}
                    {c.specialties.length > 3 && (
                      <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        +{c.specialties.length - 3}
                      </span>
                    )}
                  </div>
                </button>
              </HoverLift>
            </StaggerItem>
          );
        })}
      </Stagger>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Tidak ada dewan yang cocok. Coba kata kunci lain — 46 dewan pasti ada yang bersidang untukmu.
        </p>
      )}

      {/* ── Detail Dewan ── */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto nice-scroll">
          {detail && (() => {
            const Icon = GROUP_ICON[detail.group];
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2.5 text-left">
                    <span className="size-10 flex-none rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-amber-200 flex items-center justify-center shadow">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-base leading-tight">Dewan {detail.no} — {detail.name}</span>
                      <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                        {detail.group} · {detail.years} tahun pengalaman kolektif
                      </span>
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-left">{detail.tagline}</DialogDescription>
                </DialogHeader>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="space-y-4"
                >
                  {/* Motto */}
                  <div className="rounded-xl border-l-4 border-amber-400 bg-amber-400/5 p-3.5">
                    <Quote className="size-3.5 text-amber-500 mb-1" />
                    <p className="text-sm font-semibold italic leading-relaxed">{detail.motto}</p>
                  </div>

                  {/* Anggota */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Susunan Dewan</p>
                    <div className="space-y-1.5">
                      {detail.members.map((m) => (
                        <div key={m.title} className="flex items-center gap-2.5 rounded-lg border bg-muted/30 px-3 py-2">
                          <Gavel className="size-3.5 flex-none text-emerald-700 dark:text-emerald-400" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate">{m.title}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{m.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keahlian */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Keahlian</p>
                    <div className="flex flex-wrap gap-1.5">
                      {detail.specialties.map((s) => (
                        <span key={s} className="rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] font-medium">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Kerangka kerja */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Kerangka Kerja</p>
                    <ol className="space-y-1.5">
                      {detail.framework.map((f, i) => (
                        <li key={f} className="flex items-start gap-2.5 text-xs">
                          <span className="mt-[-1px] flex-none size-5 rounded-full bg-emerald-800 text-amber-200 text-[10px] font-bold flex items-center justify-center tabular-nums">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed pt-0.5">{f}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Button
                    onClick={() => panggil(detail)}
                    className="w-full bg-emerald-900 hover:bg-emerald-800 text-amber-200 font-bold"
                  >
                    <Gavel className="size-4 mr-1" /> Panggil Dewan Ini ke Ultimate Solver
                  </Button>
                </motion.div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
