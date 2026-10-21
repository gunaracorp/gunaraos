"use client";

// ═══════════════════════════════════════════════════
// GUNARA OS v7.0 — SEO MASTERY (Bagian 2)
// seo-content.tsx — Content Optimizer + Kalender Konten
// Task ID: 2-c
// ═══════════════════════════════════════════════════

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { FadeUp } from "../motion";
import { useRecords } from "../use-records";
import { useToast } from "@/hooks/use-toast";
import { fmtDate, todayISO } from "@/lib/gunara";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  BookOpenText,
  Briefcase,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  FileText,
  FolderPlus,
  Layers,
  Loader2,
  Megaphone,
  MousePointerClick,
  PenLine,
  Search,
  Sparkles,
  Tags,
  Trash2,
  Video,
  Wand2,
  type LucideIcon,
} from "lucide-react";

// ── Tipe data lokal ──
type SeoProjectT = { id: string; nama: string; domain: string; status?: string };
type ContentPlanT = {
  id: string;
  judul: string;
  keywordUtama: string;
  keywordSekunder: string;
  tipe: string;
  status: string;
  penulis: string;
  deadline: string;
  catatan: string;
};
type OptimizeResultT = {
  skor?: number;
  readability?: string | number;
  density?: number;
  saran?: string | string[];
  metaTitle?: string;
  metaDescription?: string;
  outline?: string[] | string;
};

// ── Konstanta kanban ──
const KANBAN_COLS = ["IDE", "BRIEF", "DRAFT", "REVIEW", "PUBLISHED"] as const;
type KanbanCol = (typeof KANBAN_COLS)[number];

const TIPE_OPTS = ["ARTIKEL", "PILLAR", "INFOGRAFIS", "VIDEO", "STUDI KASUS", "LANDING PAGE"] as const;

const COL_DOT: Record<string, string> = {
  IDE: "bg-amber-400",
  BRIEF: "bg-lime-500",
  DRAFT: "bg-teal-500",
  REVIEW: "bg-orange-500",
  PUBLISHED: "bg-emerald-600",
};

const TIPE_ICON: Record<string, LucideIcon> = {
  ARTIKEL: FileText,
  PILLAR: Layers,
  INFOGRAFIS: BarChart3,
  VIDEO: Video,
  "STUDI KASUS": Briefcase,
  "LANDING PAGE": Megaphone,
};

// ═══════════════════════════════════════════════════
// Komponen lokal bersama
// ═══════════════════════════════════════════════════

function EmptyState({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <div className="rounded-full bg-emerald-500/10 p-3" aria-hidden>
        <Icon className="size-6 text-emerald-600 dark:text-emerald-400" />
      </div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="max-w-sm text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function ProjectPicker({
  id, projects, loading, value, onChange,
}: {
  id: string; projects: SeoProjectT[]; loading: boolean; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="w-full space-y-1.5 sm:max-w-sm">
      <Label htmlFor={id}>Proyek SEO</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} aria-label="Pilih proyek SEO">
          <SelectValue placeholder={loading ? "Memuat proyek…" : "Pilih proyek SEO"} />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.nama} · {p.domain}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Chip({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium",
        tone
      )}
    >
      {label} <span className="font-extrabold tabular-nums">{value}</span>
    </span>
  );
}

/** Cincin skor SVG: ≥80 emerald, ≥60 amber, sisanya merah */
function ScoreRing({ score }: { score: number }) {
  const size = 144;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, Math.round(score || 0)));
  const ringCls =
    clamped >= 80 ? "stroke-emerald-500" : clamped >= 60 ? "stroke-amber-400" : "stroke-red-500";
  const textCls =
    clamped >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : clamped >= 60
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";
  return (
    <div className="relative inline-flex items-center justify-center" role="img" aria-label={`Skor SEO ${clamped} dari 100`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped / 100)}
          className={cn(ringCls, "transition-[stroke-dashoffset] duration-700 ease-out")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-4xl font-extrabold leading-none tabular-nums", textCls)}>{clamped}</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">dari 100</span>
      </div>
    </div>
  );
}

function densityTone(d: number): string {
  if (d >= 0.5 && d <= 2.5) return "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
  if (d > 4 || d < 0.2) return "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400";
  return "border-amber-400/50 bg-amber-400/15 text-amber-800 dark:text-amber-300";
}

// ═══════════════════════════════════════════════════
// A) ContentOptimizerSection — Optimasi Konten AI
// ═══════════════════════════════════════════════════

export function ContentOptimizerSection() {
  const { toast } = useToast();
  const [judul, setJudul] = useState("");
  const [keyword, setKeyword] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResultT | null>(null);

  const MIN_CHARS = 50;
  const ready = content.trim().length >= MIN_CHARS && keyword.trim().length > 0;

  // Analisis lokal (untuk chip yang tidak bergantung API)
  const analysis = useMemo(() => {
    const text = content.trim();
    const words = text ? text.split(/\s+/).filter(Boolean) : [];
    const sentences = text ? text.split(/[.!?]+(?:\s|$)/).map((s) => s.trim()).filter(Boolean) : [];
    const kw = keyword.trim().toLowerCase();
    const kwCount = kw && text ? text.toLowerCase().split(kw).length - 1 : 0;
    return {
      wordCount: words.length,
      avgSentence: sentences.length ? words.length / sentences.length : 0,
      readingMinutes: words.length ? Math.max(1, Math.ceil(words.length / 200)) : 0,
      kwCount,
    };
  }, [content, keyword]);

  const density = typeof result?.density === "number" ? result.density : 0;
  const readabilityLabel =
    result?.readability != null
      ? typeof result.readability === "number"
        ? String(Math.round(result.readability))
        : String(result.readability)
      : "—";

  const saranMd = useMemo(() => {
    const s = result?.saran;
    if (!s) return "";
    if (Array.isArray(s)) return s.map((x) => `- ${x}`).join("\n");
    return String(s);
  }, [result]);

  const outlineItems = useMemo(() => {
    const o = result?.outline;
    if (!o) return [] as string[];
    if (Array.isArray(o)) return o.map(String);
    return String(o).split("\n").map((x) => x.trim()).filter(Boolean);
  }, [result]);

  async function handleOptimize() {
    if (!ready) {
      toast({
        title: "Lengkapi dulu ya",
        description: `Konten minimal ${MIN_CHARS} karakter dan keyword utama wajib diisi.`,
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/seo/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), keyword: keyword.trim(), judul: judul.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Mesin optimasi gagal memproses konten.");
      setResult(json as OptimizeResultT);
      toast({ title: "🧪 Optimasi selesai", description: `Skor SEO: ${json?.skor ?? "-"}/100` });
    } catch (e) {
      toast({
        title: "Gagal mengoptimalkan",
        description: e instanceof Error ? e.message : "Terjadi kesalahan, coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "📋 Disalin", description: `${label} siap ditempel.` });
    } catch {
      toast({ title: "Gagal menyalin", description: "Clipboard tidak tersedia di perangkat ini.", variant: "destructive" });
    }
  }

  return (
    <div className="space-y-4">
      <FadeUp>
        <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 p-5 dark:border-emerald-700/30 dark:from-emerald-950/40 dark:to-amber-950/30">
          <h2 className="text-lg font-extrabold tracking-tight">🧪 CONTENT OPTIMIZER — Optimasi Konten dengan AI</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Tempel draf artikelmu, dapatkan skor SEO, saran perbaikan yang bisa dieksekusi,
            plus meta title &amp; description siap pakai.
          </p>
        </div>
      </FadeUp>

      <FadeUp delay={0.05}>
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Draf Konten</CardTitle>
            <CardDescription>Masukkan keyword utama dan draf konten minimal {MIN_CHARS} karakter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="opt-judul">Judul Artikel</Label>
                <Input
                  id="opt-judul"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="opsional · mis. Panduan UMKM Go Digital 2025"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="opt-kw">Keyword Utama</Label>
                <Input
                  id="opt-kw"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="mis. jasa seo untuk umkm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-end justify-between gap-2">
                <Label htmlFor="opt-content">Konten</Label>
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    content.trim().length >= MIN_CHARS
                      ? "font-medium text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
                  )}
                >
                  {content.length} karakter
                  {content.trim().length >= MIN_CHARS ? " · siap dioptimalkan" : ` · minimal ${MIN_CHARS}`}
                </span>
              </div>
              <Textarea
                id="opt-content"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tempel draf artikelmu di sini…"
                className="nice-scroll"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleOptimize} disabled={loading || !ready} className="gap-1.5">
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden /> Menganalisis…
                  </>
                ) : (
                  "🧪 Optimalkan dengan AI"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      {result && (
        <FadeUp delay={0.05}>
          <div className="space-y-4">
            {/* Skor + chip metrik */}
            <Card className="rounded-xl">
              <CardContent className="flex flex-col items-center gap-6 p-6 md:flex-row md:items-center">
                <ScoreRing score={result.skor ?? 0} />
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <Chip label="📄 Jumlah kata:" value={String(analysis.wordCount)} />
                  <Chip
                    label="🎯 Density:"
                    value={`${density.toFixed(2)}%`}
                    tone={densityTone(density)}
                  />
                  <Chip label="⏱️ Waktu baca:" value={`${analysis.readingMinutes || 1} mnt`} />
                  <Chip label="🔑 Keyword muncul:" value={`${analysis.kwCount}×`} />
                  <Chip label="✍️ Rata-rata kalimat:" value={`${analysis.avgSentence.toFixed(1)} kata`} />
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-xs font-medium",
                      "border-amber-400/50 bg-amber-400/15 text-amber-800 dark:text-amber-300"
                    )}
                  >
                    <BookOpenText className="size-3.5" aria-hidden /> Keterbacaan:{" "}
                    <span className="font-extrabold">{readabilityLabel}</span>
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Saran AI */}
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" aria-hidden /> Saran Perbaikan
                  </CardTitle>
                  <CardDescription>Rekomendasi AI untuk menaikkan skor konten.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {saranMd ? (
                    <div className="max-h-72 overflow-y-auto nice-scroll text-sm [&_a]:underline [&_h2]:font-bold [&_h3]:font-semibold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5">
                      <ReactMarkdown>{saranMd}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Tidak ada saran — kontenmu sudah bagus. 👍</p>
                  )}
                </CardContent>
              </Card>

              {/* Meta siap pakai */}
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tags className="size-4 text-amber-500" aria-hidden /> Meta Siap Pakai
                  </CardTitle>
                  <CardDescription>Salin langsung ke halaman / CMS kamu.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Meta Title</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 px-2 text-xs"
                        onClick={() => copyText(result.metaTitle || "", "Meta title")}
                        disabled={!result.metaTitle}
                      >
                        <Copy className="size-3" aria-hidden /> Salin
                      </Button>
                    </div>
                    <p className="rounded-lg border bg-muted/40 p-3 text-sm">{result.metaTitle || "—"}</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Meta Description</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 px-2 text-xs"
                        onClick={() => copyText(result.metaDescription || "", "Meta description")}
                        disabled={!result.metaDescription}
                      >
                        <Copy className="size-3" aria-hidden /> Salin
                      </Button>
                    </div>
                    <p className="rounded-lg border bg-muted/40 p-3 text-sm">{result.metaDescription || "—"}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Outline Konten</p>
                    {outlineItems.length > 0 ? (
                      <ol className="list-decimal space-y-1 rounded-lg border bg-muted/40 p-3 pl-8 text-sm">
                        {outlineItems.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm text-muted-foreground">Tidak ada outline.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </FadeUp>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// B) ContentCalendarSection — Kalender Editorial Kanban
// ═══════════════════════════════════════════════════

export function ContentCalendarSection() {
  const { toast } = useToast();
  const projects = useRecords<SeoProjectT>("seoProject");
  const [projectId, setProjectId] = useState("");
  const plans = useRecords<ContentPlanT>("contentPlan", projectId ? { key: "projectId", value: projectId } : undefined);

  // Dialog tambah konten
  const [open, setOpen] = useState(false);
  const [dJudul, setDJudul] = useState("");
  const [dKeyword, setDKeyword] = useState("");
  const [dKeyword2, setDKeyword2] = useState("");
  const [dTipe, setDTipe] = useState<string>("ARTIKEL");
  const [dStatus, setDStatus] = useState<string>("IDE");
  const [dPenulis, setDPenulis] = useState("");
  const [dDeadline, setDDeadline] = useState("");
  const [dCatatan, setDCatatan] = useState("");
  const [saving, setSaving] = useState(false);

  const today = todayISO();

  const byStatus = useMemo(() => {
    const map: Record<string, ContentPlanT[]> = {};
    for (const col of KANBAN_COLS) map[col] = [];
    for (const it of plans.items) {
      const col = KANBAN_COLS.includes(it.status as KanbanCol) ? it.status : "IDE";
      map[col].push(it);
    }
    return map;
  }, [plans.items]);

  const stats = useMemo(() => {
    const late = plans.items.filter(
      (it) => it.deadline && it.deadline < today && it.status !== "PUBLISHED"
    ).length;
    const published = plans.items.filter((it) => it.status === "PUBLISHED").length;
    return { total: plans.items.length, late, published };
  }, [plans.items, today]);

  function resetForm() {
    setDJudul(""); setDKeyword(""); setDKeyword2(""); setDTipe("ARTIKEL");
    setDStatus("IDE"); setDPenulis(""); setDDeadline(""); setDCatatan("");
  }

  async function handleCreate() {
    if (!projectId) {
      toast({ title: "Pilih proyek dulu", description: "Pilih proyek SEO sebelum menambah konten.", variant: "destructive" });
      return;
    }
    const t = dJudul.trim();
    if (!t) {
      toast({ title: "Judul wajib diisi", description: "Tulis judul konten yang akan diproduksi.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await plans.create({
        projectId,
        judul: t,
        keywordUtama: dKeyword.trim(),
        keywordSekunder: dKeyword2.trim(),
        tipe: dTipe,
        status: dStatus,
        penulis: dPenulis.trim(),
        deadline: dDeadline,
        catatan: dCatatan.trim(),
      });
      toast({ title: "✅ Konten ditambahkan", description: `“${t}” masuk ke tahap ${dStatus}.` });
      setOpen(false);
      resetForm();
    } catch (e) {
      toast({
        title: "Gagal menambah konten",
        description: e instanceof Error ? e.message : "Coba lagi.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function moveStatus(item: ContentPlanT, dir: -1 | 1) {
    const idx = KANBAN_COLS.indexOf(item.status as KanbanCol);
    const cur = idx === -1 ? 0 : idx;
    const next = Math.max(0, Math.min(KANBAN_COLS.length - 1, cur + dir));
    if (next === cur) return;
    try {
      await plans.update(item.id, { status: KANBAN_COLS[next] });
      toast({ title: `📌 Dipindah ke ${KANBAN_COLS[next]}`, description: item.judul });
    } catch {
      toast({ title: "Gagal memindahkan", description: "Status tidak terubah, coba lagi.", variant: "destructive" });
    }
  }

  async function handleDelete(item: ContentPlanT) {
    try {
      await plans.remove(item.id);
      toast({ title: "🗑️ Konten dihapus", description: item.judul });
    } catch {
      toast({ title: "Gagal menghapus", description: "Konten tidak terhapus, coba lagi.", variant: "destructive" });
    }
  }

  const hasProjects = projects.items.length > 0;

  return (
    <div className="space-y-4">
      <FadeUp>
        <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 p-5 dark:border-emerald-700/30 dark:from-emerald-950/40 dark:to-amber-950/30">
          <h2 className="text-lg font-extrabold tracking-tight">🗓️ KALENDER KONTEN — Alur Produksi Editorial</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Kanban alur konten dari ide sampai publish. Geser kartu antar tahap dengan tombol panah,
            jaga tidak ada konten terlambat.
          </p>
        </div>
      </FadeUp>

      {projects.loading ? (
        <Card className="rounded-xl">
          <CardContent className="space-y-2 p-6">
            <Skeleton className="h-9 w-full max-w-sm" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ) : !hasProjects ? (
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <EmptyState
              icon={FolderPlus}
              title="Belum ada proyek SEO"
              desc="Buat proyek dulu di Pusat Kendali SEO (SEO Hub) untuk mulai menyusun kalender konten."
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <FadeUp delay={0.05}>
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <ProjectPicker
                  id="calendar-project-picker"
                  projects={projects.items}
                  loading={projects.loading}
                  value={projectId}
                  onChange={setProjectId}
                />
              </CardContent>
            </Card>
          </FadeUp>

          {!projectId ? (
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <EmptyState
                  icon={MousePointerClick}
                  title="Pilih proyek untuk memuat kalender"
                  desc="Papan kanban produksi konten akan tampil setelah proyek dipilih."
                />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Chip statistik + tombol tambah */}
              <FadeUp delay={0.1}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 font-medium">
                      <CalendarDays className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
                      Total <span className="font-extrabold tabular-nums">{stats.total}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 font-medium">
                      <Clock
                        className={cn("size-3.5", stats.late > 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}
                        aria-hidden
                      />
                      Terlambat <span className={cn("font-extrabold tabular-nums", stats.late > 0 && "text-red-600 dark:text-red-400")}>{stats.late}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 font-medium">
                      <Wand2 className="size-3.5 text-amber-500" aria-hidden />
                      Published <span className="font-extrabold tabular-nums">{stats.published}</span>
                    </span>
                  </div>
                  <Button onClick={() => setOpen(true)} className="gap-1.5">＋ Konten Baru</Button>
                </div>
              </FadeUp>

              {/* Papan kanban / empty state */}
              {plans.loading ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
                  {KANBAN_COLS.map((col) => (
                    <div key={col} className="space-y-3 rounded-xl border bg-muted/30 p-3">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  ))}
                </div>
              ) : plans.items.length === 0 ? (
                <Card className="rounded-xl">
                  <CardContent className="p-6">
                    <EmptyState
                      icon={CalendarRange}
                      title="Kalender masih kosong"
                      desc="Rencanakan konten pertamamu — klik ＋ Konten Baru, isi judul, keyword, dan tenggatnya."
                    />
                  </CardContent>
                </Card>
              ) : (
                <FadeUp delay={0.15}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
                    {KANBAN_COLS.map((col) => {
                      const list = byStatus[col] || [];
                      return (
                        <div key={col} className="space-y-3 rounded-xl border bg-muted/30 p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={cn("size-2 shrink-0 rounded-full", COL_DOT[col])} aria-hidden />
                              <span className="text-sm font-bold tracking-tight">{col}</span>
                            </div>
                            <Badge variant="secondary" className="tabular-nums">{list.length}</Badge>
                          </div>

                          {list.length === 0 && (
                            <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                              Kosong
                            </p>
                          )}

                          <div className="space-y-3">
                            {list.map((item) => {
                              const idx = KANBAN_COLS.indexOf(item.status as KanbanCol);
                              const cur = idx === -1 ? 0 : idx;
                              const isLate = Boolean(item.deadline) && item.deadline < today && item.status !== "PUBLISHED";
                              const TipeIcon = TIPE_ICON[item.tipe] ?? FileText;
                              return (
                                <div
                                  key={item.id}
                                  className="space-y-2 rounded-xl border bg-card p-4 transition-colors hover:border-emerald-400"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <Badge variant="outline" className="gap-1 text-[11px] font-semibold">
                                      <TipeIcon className="size-3" aria-hidden /> {item.tipe || "ARTIKEL"}
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="size-7 shrink-0 p-0 text-muted-foreground hover:text-red-600"
                                      onClick={() => handleDelete(item)}
                                      aria-label={`Hapus konten ${item.judul}`}
                                    >
                                      <Trash2 className="size-3.5" aria-hidden />
                                    </Button>
                                  </div>

                                  <p className="line-clamp-2 text-sm font-semibold leading-snug" title={item.judul}>
                                    {item.judul}
                                  </p>

                                  {item.keywordUtama && (
                                    <p className="inline-flex max-w-full items-center gap-1 text-xs text-muted-foreground">
                                      <Search className="size-3 shrink-0" aria-hidden />
                                      <span className="truncate">{item.keywordUtama}</span>
                                    </p>
                                  )}

                                  {item.deadline ? (
                                    isLate ? (
                                      <p className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                                        <Clock className="size-3" aria-hidden /> Terlambat · {fmtDate(item.deadline)}
                                      </p>
                                    ) : (
                                      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="size-3" aria-hidden /> {fmtDate(item.deadline)}
                                      </p>
                                    )
                                  ) : (
                                    <p className="text-xs text-muted-foreground/70">Tanpa tenggat</p>
                                  )}

                                  <div className="flex items-center justify-between gap-2 border-t pt-2">
                                    {item.penulis ? (
                                      <span className="inline-flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                                        <PenLine className="size-3 shrink-0" aria-hidden />
                                        <span className="truncate">{item.penulis}</span>
                                      </span>
                                    ) : (
                                      <span />
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="size-6 p-0"
                                        disabled={cur <= 0}
                                        onClick={() => moveStatus(item, -1)}
                                        aria-label={`Pindah “${item.judul}” ke tahap sebelumnya`}
                                      >
                                        <ChevronLeft className="size-3.5" aria-hidden />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="size-6 p-0"
                                        disabled={cur >= KANBAN_COLS.length - 1}
                                        onClick={() => moveStatus(item, 1)}
                                        aria-label={`Pindah “${item.judul}” ke tahap berikutnya`}
                                      >
                                        <ChevronRight className="size-3.5" aria-hidden />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </FadeUp>
              )}
            </>
          )}
        </>
      )}

      {/* Dialog tambah konten */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] nice-scroll overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>＋ Konten Baru</DialogTitle>
            <DialogDescription>Rencanakan konten baru: judul, keyword, tipe, dan tenggatnya.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="cal-judul">Judul Konten</Label>
              <Input
                id="cal-judul"
                value={dJudul}
                onChange={(e) => setDJudul(e.target.value)}
                placeholder="mis. 7 Cara UMKM Naik Peringkat Google"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cal-kw1">Keyword Utama</Label>
              <Input
                id="cal-kw1"
                value={dKeyword}
                onChange={(e) => setDKeyword(e.target.value)}
                placeholder="mis. seo untuk umkm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cal-kw2">Keyword Sekunder</Label>
              <Input
                id="cal-kw2"
                value={dKeyword2}
                onChange={(e) => setDKeyword2(e.target.value)}
                placeholder="pisah koma · opsional"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tipe Konten</Label>
              <Select value={dTipe} onValueChange={setDTipe}>
                <SelectTrigger aria-label="Pilih tipe konten">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPE_OPTS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status Awal</Label>
              <Select value={dStatus} onValueChange={setDStatus}>
                <SelectTrigger aria-label="Pilih status awal">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KANBAN_COLS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cal-penulis">Penulis</Label>
              <Input
                id="cal-penulis"
                value={dPenulis}
                onChange={(e) => setDPenulis(e.target.value)}
                placeholder="mis. Rani"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cal-deadline">Deadline</Label>
              <Input
                id="cal-deadline"
                type="date"
                value={dDeadline}
                onChange={(e) => setDDeadline(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="cal-catatan">Catatan</Label>
              <Textarea
                id="cal-catatan"
                rows={3}
                value={dCatatan}
                onChange={(e) => setDCatatan(e.target.value)}
                placeholder="opsional · arahan sudut pandang, referensi, CTA…"
                className="nice-scroll"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button onClick={handleCreate} disabled={saving} className="gap-1.5">
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Menyimpan…
                </>
              ) : (
                "Simpan ke Kalender"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
