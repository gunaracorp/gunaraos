"use client";

// ═══════════════════════════════════════════════════════════════
// GUNARA OS v8.0 — SEO MASTERY · SEO Command Center (Beranda Suite)
// Pusat kendali arsenal SEO: KPI live, peluncur alat, audit terakhir.
// ═══════════════════════════════════════════════════════════════

import { useMemo } from "react";
import {
  CalendarDays,
  Code2,
  FileText,
  Globe,
  Handshake,
  KeyRound,
  Link2,
  Radar,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecords } from "../use-records";
import { CountUp, FadeUp, FloatingOrbs, HoverLift } from "../motion";
import { cn } from "@/lib/utils";

// ── Tipe data (bentuk JSON dari /api/data/*) ──
type SeoProject = { id: string; nama: string; domain: string; status: string };
type SeoAudit = { id: string; projectId: string; url: string; skorTotal: number; createdAt: string };
type KeywordRank = { id: string; posisi: number };
type Backlink = { id: string; status: string; dofollow: boolean };
type ContentPlan = { id: string; status: string };

// ── Helper tampilan ──
function relTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const diffMs = Date.now() - d.getTime();
  const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" });
  const min = Math.round(diffMs / 60_000);
  if (Math.abs(min) < 60) return rtf.format(-min, "minute");
  const hr = Math.round(diffMs / 3_600_000);
  if (Math.abs(hr) < 24) return rtf.format(-hr, "hour");
  const day = Math.round(diffMs / 86_400_000);
  if (Math.abs(day) < 30) return rtf.format(-day, "day");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function skorBadgeClass(s: number): string {
  if (s >= 80) return "bg-emerald-600 text-white hover:bg-emerald-600";
  if (s >= 60) return "bg-amber-400 text-amber-950 hover:bg-amber-400";
  return "bg-red-500 text-white hover:bg-red-500";
}

// ── Definisi kartu aksi cepat ──
type QuickAction = { id: string; icon: LucideIcon; title: string; desc: string };
const ARSENAL: QuickAction[] = [
  { id: "seo-audit", icon: ShieldCheck, title: "Audit Engine", desc: "Analisis 40+ sinyal on-page & teknis dengan Dewan 46" },
  { id: "seo-keywords", icon: KeyRound, title: "Keyword Studio", desc: "Riset 30 keyword ber-cluster + intent dalam sekali klik" },
  { id: "seo-ranks", icon: TrendingUp, title: "Rank Tracker", desc: "Pantau posisi harian di Google & deteksi gejorak" },
  { id: "seo-content", icon: FileText, title: "Content Optimizer", desc: "Optimalkan artikel & susun kalender konten editorial" },
  { id: "seo-backlinks", icon: Link2, title: "Backlink Monitor", desc: "Profil tautan, kualitas domain, dan deteksi toxic" },
  { id: "seo-competitor", icon: Radar, title: "Competitor Radar", desc: "Bongkar strategi kompetitor & temukan celah pasar" },
  { id: "seo-forge", icon: Code2, title: "Meta & Schema Forge", desc: "Tempa meta tag + JSON-LD siap tempel" },
  { id: "seo-clients", icon: Handshake, title: "Klien & Proposal", desc: "Kelola proyek klien & buat proposal SEO otomatis" },
];

type Kpi = { icon: LucideIcon; label: string; value: string; hint: string; accent?: string };

export function SeoHubSection({ onNavigate }: { onNavigate: (id: string) => void }) {
  const projects = useRecords<SeoProject>("seoProject");
  const audits = useRecords<SeoAudit>("seoAudit");
  const ranks = useRecords<KeywordRank>("keywordRank");
  const backlinks = useRecords<Backlink>("backlink");
  const plans = useRecords<ContentPlan>("contentPlan");

  const loading = projects.loading || audits.loading || ranks.loading || backlinks.loading || plans.loading;

  // Skor SEO rata-rata: rata-rata audit TERBARU per proyek (audit lama diabaikan)
  const avgSkor = useMemo<number | null>(() => {
    const latest = new Map<string, SeoAudit>();
    for (const a of audits.items) {
      const key = a.projectId || a.url;
      const prev = latest.get(key);
      if (!prev || new Date(a.createdAt).getTime() > new Date(prev.createdAt).getTime()) {
        latest.set(key, a);
      }
    }
    const vals = [...latest.values()].map((a) => Number(a.skorTotal) || 0);
    if (vals.length === 0) return null;
    return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
  }, [audits.items]);

  const kpis: Kpi[] = useMemo(() => {
    const aktif = projects.items.filter((p) => p.status === "AKTIF").length;
    const posisiValid = ranks.items.filter((r) => Number(r.posisi) > 0);
    const rataPosisi =
      posisiValid.length > 0
        ? (posisiValid.reduce((s, r) => s + Number(r.posisi), 0) / posisiValid.length)
            .toFixed(1)
            .replace(".", ",")
        : "—";
    const blAktif = backlinks.items.filter((b) => b.status === "AKTIF" && b.dofollow).length;
    const terjadwal = plans.items.filter((c) => c.status !== "PUBLISHED").length;
    return [
      { icon: Globe, label: "Proyek Aktif", value: String(aktif), hint: `${projects.items.length} total proyek` },
      { icon: KeyRound, label: "Keyword Dilacak", value: String(ranks.items.length), hint: "dari Rank Tracker" },
      { icon: TrendingUp, label: "Rata-rata Posisi", value: rataPosisi, hint: `${posisiValid.length} keyword di top-100` },
      { icon: Link2, label: "Backlink Aktif", value: String(blAktif), hint: "dofollow + status AKTIF", accent: "text-amber-500 dark:text-amber-400" },
      { icon: CalendarDays, label: "Konten Terjadwal", value: String(terjadwal), hint: "belum PUBLISHED" },
    ];
  }, [projects.items, ranks.items, backlinks.items, plans.items]);

  const auditTerakhir = useMemo(
    () =>
      [...audits.items]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [audits.items]
  );

  return (
    <div className="space-y-6">
      {/* ── Hero banner ── */}
      <FadeUp>
        <section
          className="relative overflow-hidden rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-600/10 via-transparent to-amber-400/10 p-6 dark:border-emerald-700/30"
          aria-label="SEO Command Center"
        >
          <FloatingOrbs />
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <Badge className="mb-3 bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/15 dark:text-emerald-300">
                SEO MASTERY · MODUL v8.0
              </Badge>
              <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                🚀 SEO Command Center
              </h2>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">
                Arsenal Konsultan SEO #1 — ditempa Dewan 46 · 150 tahun pengalaman kolektif.
                Mulai dari audit, kuasai keyword, menangkan SERP.
              </p>
            </div>
            <div className="shrink-0 rounded-xl border bg-card/80 p-5 text-center backdrop-blur-sm md:min-w-48">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Skor SEO Rata-rata
              </p>
              {loading ? (
                <Skeleton className="mx-auto mt-2 h-12 w-24" />
              ) : avgSkor === null ? (
                <p className="mt-1 text-5xl font-black tabular-nums text-muted-foreground">—</p>
              ) : (
                <CountUp
                  value={avgSkor}
                  format={(n) => String(Math.round(n))}
                  className={cn(
                    "mt-1 block text-5xl font-black tabular-nums leading-none",
                    avgSkor >= 80 ? "text-emerald-600 dark:text-emerald-400" : avgSkor >= 60 ? "text-amber-500" : "text-red-500"
                  )}
                />
              )}
              <p className="mt-2 text-[11px] text-muted-foreground">
                {avgSkor === null ? "Jalankan audit pertama" : "dari audit terbaru tiap proyek"}
              </p>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ── KPI cards ── */}
      <section aria-label="Statistik utama" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <Card key={k.label} className="gap-2 py-0">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="rounded-lg bg-emerald-600/10 p-2 text-emerald-600 dark:text-emerald-400">
                <k.icon className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-muted-foreground">{k.label}</p>
                {loading ? (
                  <Skeleton className="mt-1 h-7 w-12" />
                ) : (
                  <p className={cn("text-2xl font-extrabold tabular-nums leading-tight", k.accent)}>{k.value}</p>
                )}
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{k.hint}</p>
              </div>
              <span className="sr-only">Statistik {i + 1}</span>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── Empty state: belum ada proyek ── */}
      {!loading && projects.items.length === 0 && (
        <Card className="border-dashed border-amber-400/60 bg-amber-400/5 py-0">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Handshake className="size-8 text-amber-500" aria-hidden />
            <div>
              <p className="font-bold">Belum ada proyek SEO</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Daftarkan domain pertamamu di modul Klien & Proposal — semua alat lain akan
                otomatis terhubung ke proyek tersebut.
              </p>
            </div>
            <Button className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => onNavigate("seo-clients")}>
              <Handshake className="size-4" aria-hidden /> Tambah Proyek Pertama
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Luncurkan Arsenal ── */}
      <section aria-label="Luncurkan Arsenal">
        <div className="mb-4">
          <h3 className="text-lg font-bold tracking-tight">⚡ Luncurkan Arsenal</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            8 senjata untuk mendominasi halaman pertama Google.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {ARSENAL.map((a) => (
            <HoverLift key={a.id} onClick={() => onNavigate(a.id)}>
              <Card
                role="button"
                tabIndex={0}
                aria-label={`Buka ${a.title}`}
                className="h-full cursor-pointer border bg-card py-0 transition-colors hover:border-emerald-500 dark:hover:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onNavigate(a.id);
                  }
                }}
              >
                <CardContent className="flex h-full items-start gap-3 p-4">
                  <div className="rounded-lg bg-emerald-600/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                    <a.icon className="size-5" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold tracking-tight">{a.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </HoverLift>
          ))}
        </div>
      </section>

      {/* ── Audit Terakhir ── */}
      <Card className="gap-4 py-0">
        <CardHeader className="px-6 pb-0 pt-6">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden />
            Audit Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {audits.loading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : auditTerakhir.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Belum ada audit. Buka <span className="font-semibold text-emerald-600 dark:text-emerald-400">Audit Engine</span> dan jalankan audit pertamamu.
            </p>
          ) : (
            <ul className="divide-y">
              {auditTerakhir.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2.5">
                  <Globe className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{a.url}</span>
                  <Badge className={cn("shrink-0 tabular-nums", skorBadgeClass(Number(a.skorTotal)))}>
                    {a.skorTotal}
                  </Badge>
                  <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">
                    {relTime(a.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
