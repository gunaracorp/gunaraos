"use client";

// ═══════════════════════════════════════════════════
// GUNARA OS v7.0 — SEO MASTERY (Bagian 2)
// seo-ranks.tsx — Rank Tracker + Backlink Monitor
// Task ID: 2-c
// ═══════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { FadeUp } from "../motion";
import { useRecords } from "../use-records";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  Crown,
  ExternalLink,
  FolderPlus,
  Gauge,
  Lightbulb,
  Link2,
  Minus,
  Monitor,
  MousePointerClick,
  Radar,
  Search,
  ShieldCheck,
  Smartphone,
  Target,
  Trash2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

// ── Tipe data lokal ──
type SeoProjectT = { id: string; nama: string; domain: string; status?: string };
type RankT = {
  id: string;
  keyword: string;
  posisi: number;
  posisiSebelumnya: number;
  volume: number;
  url: string;
  perangkat: string;
};
type BacklinkT = {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  dofollow: boolean;
  kualitas: string;
  status: string;
  domainAuth: number;
};

// ── Helper ──
const fmtNum = (n: number) => new Intl.NumberFormat("id-ID").format(n);

function posisiBadgeCls(pos: number): { label: string; cls: string } {
  if (pos >= 1 && pos <= 3)
    return { label: `#${pos}`, cls: "bg-emerald-600 text-white border-emerald-600" };
  if (pos >= 4 && pos <= 10)
    return { label: `#${pos}`, cls: "bg-lime-500/20 text-lime-800 dark:text-lime-300 border-lime-500/50" };
  if (pos >= 11 && pos <= 30)
    return { label: `#${pos}`, cls: "bg-amber-400/25 text-amber-800 dark:text-amber-300 border-amber-400/50" };
  if (pos >= 31 && pos <= 99)
    return { label: `#${pos}`, cls: "bg-orange-300/25 text-orange-800 dark:text-orange-300 border-orange-400/50" };
  return { label: "Tidak ada", cls: "bg-muted text-muted-foreground border-border" };
}

// ═══════════════════════════════════════════════════
// Komponen lokal bersama
// ═══════════════════════════════════════════════════

function KpiCard({
  icon: Icon, label, value, sub, tone,
}: {
  icon: LucideIcon; label: string; value: string; sub?: string; tone?: string;
}) {
  return (
    <Card className="rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <Icon className={cn("size-4 shrink-0", tone ?? "text-emerald-600 dark:text-emerald-400")} aria-hidden />
        </div>
        <p className="mt-1.5 text-2xl font-extrabold tabular-nums tracking-tight">{value}</p>
        {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
      </CardContent>
    </Card>
  );
}

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

function DeltaCell({ pos, prev }: { pos: number; prev: number }) {
  if (!prev || prev <= 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="size-3.5" aria-hidden /> —
      </span>
    );
  }
  if (pos < prev) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <ArrowUp className="size-3.5" aria-hidden /> {prev - pos}
      </span>
    );
  }
  if (pos > prev) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
        <ArrowDown className="size-3.5" aria-hidden /> {pos - prev}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Minus className="size-3.5" aria-hidden /> Sama
    </span>
  );
}

const KUALITAS_OPTS = ["TINGGI", "SEDANG", "RENDAH", "TOXIC"] as const;

const KUALITAS_BADGE: Record<string, string> = {
  TINGGI: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40",
  SEDANG: "bg-amber-400/20 text-amber-800 dark:text-amber-300 border-amber-400/50",
  RENDAH: "bg-orange-300/25 text-orange-800 dark:text-orange-300 border-orange-400/50",
  TOXIC: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/40",
};

const KUALITAS_BAR: Record<string, string> = {
  TINGGI: "bg-emerald-500",
  SEDANG: "bg-amber-400",
  RENDAH: "bg-orange-300",
  TOXIC: "bg-red-500",
};

// ═══════════════════════════════════════════════════
// A) RankTrackerSection — Pemantau Posisi Keyword
// ═══════════════════════════════════════════════════

export function RankTrackerSection() {
  const { toast } = useToast();
  const projects = useRecords<SeoProjectT>("seoProject");
  const [projectId, setProjectId] = useState("");
  const ranks = useRecords<RankT>("keywordRank", projectId ? { key: "projectId", value: projectId } : undefined);

  // Form tambah keyword
  const [fKeyword, setFKeyword] = useState("");
  const [fPosisi, setFPosisi] = useState("");
  const [fPrev, setFPrev] = useState("");
  const [fVolume, setFVolume] = useState("");
  const [fUrl, setFUrl] = useState("");
  const [fPerangkat, setFPerangkat] = useState("desktop");
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    const items = ranks.items;
    const positioned = items.filter((r) => r.posisi > 0);
    const avg = positioned.length
      ? positioned.reduce((s, r) => s + r.posisi, 0) / positioned.length
      : 0;
    return {
      total: items.length,
      avg,
      top3: items.filter((r) => r.posisi >= 1 && r.posisi <= 3).length,
      top10: items.filter((r) => r.posisi >= 1 && r.posisi <= 10).length,
    };
  }, [ranks.items]);

  const sorted = useMemo(
    () => [...ranks.items].sort((a, b) => (a.posisi || 101) - (b.posisi || 101)),
    [ranks.items]
  );

  async function handleAdd() {
    if (!projectId) {
      toast({ title: "Pilih proyek dulu", description: "Pilih proyek SEO sebelum melacak keyword.", variant: "destructive" });
      return;
    }
    const kw = fKeyword.trim();
    if (!kw) {
      toast({ title: "Keyword wajib diisi", description: "Tulis keyword yang ingin dilacak posisinya.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await ranks.create({
        projectId,
        keyword: kw,
        posisi: Math.max(0, Math.min(100, Math.round(Number(fPosisi) || 0))),
        posisiSebelumnya: Math.max(0, Math.round(Number(fPrev) || 0)),
        volume: Math.max(0, Math.round(Number(fVolume) || 0)),
        url: fUrl.trim(),
        perangkat: fPerangkat,
      });
      toast({ title: "✅ Keyword dilacak", description: `“${kw}” masuk ke pemantauan posisi.` });
      setFKeyword(""); setFPosisi(""); setFPrev(""); setFVolume(""); setFUrl("");
    } catch (e) {
      toast({ title: "Gagal menambah keyword", description: e instanceof Error ? e.message : "Coba lagi.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, kw: string) {
    try {
      await ranks.remove(id);
      toast({ title: "🗑️ Keyword dihapus", description: kw });
    } catch {
      toast({ title: "Gagal menghapus", description: "Keyword tidak terhapus, coba lagi.", variant: "destructive" });
    }
  }

  const hasProjects = projects.items.length > 0;

  return (
    <div className="space-y-4">
      <FadeUp>
        <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 p-5 dark:border-emerald-700/30 dark:from-emerald-950/40 dark:to-amber-950/30">
          <h2 className="text-lg font-extrabold tracking-tight">🎯 SEO RANK TRACKER — Pemantau Posisi Keyword</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Pantau pergerakan posisi keyword di Google per perangkat. Hijau = naik, merah = turun.
            Fokuskan tenaga mendorong keyword di posisi 11–30 ke halaman pertama.
          </p>
        </div>
      </FadeUp>

      {projects.loading ? (
        <Card className="rounded-xl"><CardContent className="p-6 text-sm text-muted-foreground">Memuat proyek…</CardContent></Card>
      ) : !hasProjects ? (
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <EmptyState
              icon={FolderPlus}
              title="Belum ada proyek SEO"
              desc="Buat proyek dulu di Pusat Kendali SEO (SEO Hub) untuk mulai melacak posisi keyword."
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <FadeUp delay={0.05}>
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <ProjectPicker
                  id="rank-project-picker"
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
                  title="Pilih proyek untuk memuat data"
                  desc="Posisi keyword, statistik, dan riwayat akan tampil setelah proyek dipilih."
                />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Statistik KPI */}
              <FadeUp delay={0.1}>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <KpiCard icon={Search} label="Total Keyword" value={fmtNum(stats.total)} sub="keyword yang dilacak" />
                  <KpiCard
                    icon={Target}
                    label="Rata-rata Posisi"
                    value={stats.avg > 0 ? stats.avg.toFixed(1) : "—"}
                    sub="di luar posisi 100+"
                    tone="text-amber-500"
                  />
                  <KpiCard icon={Crown} label="Top 3" value={fmtNum(stats.top3)} sub="posisi 1–3" tone="text-emerald-600 dark:text-emerald-400" />
                  <KpiCard icon={TrendingUp} label="Top 10" value={fmtNum(stats.top10)} sub="posisi 1–10" tone="text-lime-600 dark:text-lime-400" />
                </div>
              </FadeUp>

              {/* Form tambah keyword */}
              <FadeUp delay={0.15}>
                <Card className="rounded-xl">
                  <CardHeader>
                    <CardTitle>＋ Lacak Keyword Baru</CardTitle>
                    <CardDescription>
                      Catat posisi keyword saat ini di Google. Isi 0 jika keyword belum muncul di 100 besar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="rank-kw">Keyword</Label>
                        <Input
                          id="rank-kw"
                          value={fKeyword}
                          onChange={(e) => setFKeyword(e.target.value)}
                          placeholder="mis. jasa pembuatan website jakarta"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="rank-pos">Posisi Saat Ini</Label>
                        <Input
                          id="rank-pos"
                          type="number"
                          min={0}
                          max={100}
                          value={fPosisi}
                          onChange={(e) => setFPosisi(e.target.value)}
                          placeholder="mis. 4 · 0 = 100+"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="rank-prev">Posisi Sebelumnya</Label>
                        <Input
                          id="rank-prev"
                          type="number"
                          min={0}
                          max={100}
                          value={fPrev}
                          onChange={(e) => setFPrev(e.target.value)}
                          placeholder="opsional"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="rank-vol">Volume Pencarian</Label>
                        <Input
                          id="rank-vol"
                          type="number"
                          min={0}
                          value={fVolume}
                          onChange={(e) => setFVolume(e.target.value)}
                          placeholder="opsional · per bulan"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="rank-url">URL Halaman</Label>
                        <Input
                          id="rank-url"
                          value={fUrl}
                          onChange={(e) => setFUrl(e.target.value)}
                          placeholder="opsional · https://…"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Perangkat</Label>
                        <Select value={fPerangkat} onValueChange={setFPerangkat}>
                          <SelectTrigger aria-label="Pilih perangkat">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="desktop">🖥️ Desktop</SelectItem>
                            <SelectItem value="mobile">📱 Mobile</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleAdd} disabled={saving} className="gap-1.5">
                        {saving ? "Menyimpan…" : "＋ Lacak Keyword"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeUp>

              {/* Tabel posisi */}
              <FadeUp delay={0.2}>
                <Card className="overflow-hidden rounded-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <CardTitle>Daftar Posisi Keyword</CardTitle>
                        <CardDescription>Diurutkan dari posisi terbaik.</CardDescription>
                      </div>
                      <Badge variant="secondary" className="tabular-nums">{sorted.length} keyword</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-y-auto nice-scroll">
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-card">
                          <TableRow>
                            <TableHead>Keyword</TableHead>
                            <TableHead className="text-center">Posisi</TableHead>
                            <TableHead className="text-center">Perubahan</TableHead>
                            <TableHead className="hidden text-right md:table-cell">Volume</TableHead>
                            <TableHead className="hidden md:table-cell">Perangkat</TableHead>
                            <TableHead className="hidden lg:table-cell">URL</TableHead>
                            <TableHead className="w-12 text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ranks.loading && (
                            <TableRow>
                              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Memuat data…</TableCell>
                            </TableRow>
                          )}
                          {!ranks.loading && sorted.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} className="p-0">
                                <EmptyState
                                  icon={Radar}
                                  title="Belum ada keyword yang dilacak"
                                  desc="Tambahkan keyword pertama lewat form di atas untuk mulai memantau posisi."
                                />
                              </TableCell>
                            </TableRow>
                          )}
                          {!ranks.loading && sorted.map((r) => {
                            const pb = posisiBadgeCls(r.posisi);
                            return (
                              <TableRow key={r.id} className="hover:bg-emerald-500/5">
                                <TableCell className="max-w-[220px] font-medium">
                                  <span className="block truncate" title={r.keyword}>{r.keyword}</span>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge className={cn("border font-semibold tabular-nums", pb.cls)}>{pb.label}</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <DeltaCell pos={r.posisi} prev={r.posisiSebelumnya} />
                                </TableCell>
                                <TableCell className="hidden text-right font-mono tabular-nums md:table-cell">
                                  {r.volume > 0 ? fmtNum(r.volume) : "—"}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  <span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                                    {r.perangkat === "mobile" ? <Smartphone className="size-3.5" aria-hidden /> : <Monitor className="size-3.5" aria-hidden />}
                                    {r.perangkat || "desktop"}
                                  </span>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {r.url ? (
                                    <a
                                      href={r.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex max-w-[160px] items-center gap-1 text-xs text-emerald-700 hover:underline dark:text-emerald-400"
                                      title={r.url}
                                    >
                                      <span className="truncate">{r.url}</span>
                                      <ExternalLink className="size-3 shrink-0" aria-hidden />
                                    </a>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="size-8 p-0 text-muted-foreground hover:text-red-600"
                                    onClick={() => handleDelete(r.id, r.keyword)}
                                    aria-label={`Hapus keyword ${r.keyword}`}
                                  >
                                    <Trash2 className="size-4" aria-hidden />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </FadeUp>

              {/* Tips cek manual */}
              <FadeUp delay={0.25}>
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-50 p-4 dark:bg-amber-950/30">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
                  <p className="text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-semibold">Cek manual posisi:</span> cek via Google dengan parameter{" "}
                    <code className="rounded bg-amber-100 px-1 font-mono dark:bg-amber-900/60">uci=1</code> atau gunakan
                    mode incognito — hindari personalisasi hasil pencarian agar posisi tercatat akurat.
                  </p>
                </div>
              </FadeUp>
            </>
          )}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// B) BacklinkSection — Monitor Tautan Masuk
// ═══════════════════════════════════════════════════

export function BacklinkSection() {
  const { toast } = useToast();
  const projects = useRecords<SeoProjectT>("seoProject");
  const [projectId, setProjectId] = useState("");
  const links = useRecords<BacklinkT>("backlink", projectId ? { key: "projectId", value: projectId } : undefined);

  // Form tambah backlink
  const [bSource, setBSource] = useState("");
  const [bTarget, setBTarget] = useState("");
  const [bAnchor, setBAnchor] = useState("");
  const [bDofollow, setBDofollow] = useState(true);
  const [bKualitas, setBKualitas] = useState<string>("SEDANG");
  const [bDa, setBDa] = useState("");
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    const items = links.items;
    const total = items.length;
    const dofollow = items.filter((b) => b.dofollow).length;
    const avgDa = total ? items.reduce((s, b) => s + (b.domainAuth || 0), 0) / total : 0;
    const dist: Record<string, number> = { TINGGI: 0, SEDANG: 0, RENDAH: 0, TOXIC: 0 };
    for (const b of items) dist[b.kualitas] = (dist[b.kualitas] || 0) + 1;
    return { total, dofollowPct: total ? (dofollow / total) * 100 : 0, avgDa, tinggi: dist.TINGGI, dist };
  }, [links.items]);

  async function handleAdd() {
    if (!projectId) {
      toast({ title: "Pilih proyek dulu", description: "Pilih proyek SEO sebelum mencatat backlink.", variant: "destructive" });
      return;
    }
    const src = bSource.trim();
    if (!src) {
      toast({ title: "URL sumber wajib diisi", description: "Masukkan URL situs yang memberi tautan.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await links.create({
        projectId,
        sourceUrl: src,
        targetUrl: bTarget.trim(),
        anchorText: bAnchor.trim(),
        dofollow: bDofollow,
        kualitas: bKualitas,
        status: "PENDING",
        domainAuth: Math.max(0, Math.min(100, Math.round(Number(bDa) || 0))),
      });
      toast({ title: "✅ Backlink tercatat", description: `Tautan dari ${src} masuk ke portofolio.` });
      setBSource(""); setBTarget(""); setBAnchor(""); setBDa("");
      setBDofollow(true); setBKualitas("SEDANG");
    } catch (e) {
      toast({ title: "Gagal menyimpan backlink", description: e instanceof Error ? e.message : "Coba lagi.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, src: string) {
    try {
      await links.remove(id);
      toast({ title: "🗑️ Backlink dihapus", description: src });
    } catch {
      toast({ title: "Gagal menghapus", description: "Backlink tidak terhapus, coba lagi.", variant: "destructive" });
    }
  }

  const hasProjects = projects.items.length > 0;

  return (
    <div className="space-y-4">
      <FadeUp>
        <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 p-5 dark:border-emerald-700/30 dark:from-emerald-950/40 dark:to-amber-950/30">
          <h2 className="text-lg font-extrabold tracking-tight">🔗 BACKLINK MONITOR — Portofolio Tautan Masuk</h2>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
            Kualitas backlink jauh lebih penting daripada kuantitas. Pantau atribut dofollow, otoritas domain (DA),
            dan segera karantina tautan toxic yang berpotensi merusak.
          </p>
        </div>
      </FadeUp>

      {projects.loading ? (
        <Card className="rounded-xl"><CardContent className="p-6 text-sm text-muted-foreground">Memuat proyek…</CardContent></Card>
      ) : !hasProjects ? (
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <EmptyState
              icon={FolderPlus}
              title="Belum ada proyek SEO"
              desc="Buat proyek dulu di Pusat Kendali SEO (SEO Hub) untuk mulai memantau backlink."
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <FadeUp delay={0.05}>
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <ProjectPicker
                  id="backlink-project-picker"
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
                  title="Pilih proyek untuk memuat data"
                  desc="Statistik dan daftar backlink akan tampil setelah proyek dipilih."
                />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Statistik + distribusi kualitas */}
              <FadeUp delay={0.1}>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <KpiCard icon={Link2} label="Total Backlink" value={fmtNum(stats.total)} sub="tautan terpantau" />
                  <KpiCard
                    icon={ShieldCheck}
                    label="Dofollow"
                    value={`${stats.dofollowPct.toFixed(0)}%`}
                    sub="porsi tautan dofollow"
                    tone="text-emerald-600 dark:text-emerald-400"
                  />
                  <KpiCard icon={Gauge} label="Rata-rata DA" value={stats.total ? stats.avgDa.toFixed(1) : "—"} sub="otoritas domain 0–100" tone="text-amber-500" />
                  <KpiCard icon={Crown} label="Kualitas TINGGI" value={fmtNum(stats.tinggi)} sub="backlink berkualitas" tone="text-lime-600 dark:text-lime-400" />
                </div>
              </FadeUp>

              <FadeUp delay={0.12}>
                <Card className="rounded-xl">
                  <CardContent className="space-y-3 p-6">
                    <p className="text-sm font-semibold">Distribusi Kualitas</p>
                    <div
                      className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
                      role="img"
                      aria-label={`Distribusi kualitas backlink: TINGGI ${stats.dist.TINGGI}, SEDANG ${stats.dist.SEDANG}, RENDAH ${stats.dist.RENDAH}, TOXIC ${stats.dist.TOXIC}`}
                    >
                      {stats.total > 0 && KUALITAS_OPTS.map((q) => {
                        const n = stats.dist[q] || 0;
                        if (!n) return null;
                        return (
                          <div
                            key={q}
                            className={KUALITAS_BAR[q]}
                            style={{ width: `${(n / stats.total) * 100}%` }}
                            title={`${q}: ${n}`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {KUALITAS_OPTS.map((q) => (
                        <span key={q} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className={cn("size-2 rounded-full", KUALITAS_BAR[q])} aria-hidden />
                          {q} <span className="font-semibold tabular-nums text-foreground">{stats.dist[q] || 0}</span>
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </FadeUp>

              {/* Form tambah backlink */}
              <FadeUp delay={0.15}>
                <Card className="rounded-xl">
                  <CardHeader>
                    <CardTitle>＋ Catat Backlink Baru</CardTitle>
                    <CardDescription>Status awal backlink baru otomatis PENDING hingga diverifikasi.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="bl-src">URL Sumber</Label>
                        <Input
                          id="bl-src"
                          value={bSource}
                          onChange={(e) => setBSource(e.target.value)}
                          placeholder="https://situs-pemberi-tautan.com/artikel"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="bl-target">URL Target</Label>
                        <Input
                          id="bl-target"
                          value={bTarget}
                          onChange={(e) => setBTarget(e.target.value)}
                          placeholder="opsional · halaman situsmu yang ditaut"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="bl-anchor">Anchor Text</Label>
                        <Input
                          id="bl-anchor"
                          value={bAnchor}
                          onChange={(e) => setBAnchor(e.target.value)}
                          placeholder="mis. jasa SEO terbaik"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="bl-da">Domain Authority</Label>
                        <Input
                          id="bl-da"
                          type="number"
                          min={0}
                          max={100}
                          value={bDa}
                          onChange={(e) => setBDa(e.target.value)}
                          placeholder="0–100"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Kualitas</Label>
                        <Select value={bKualitas} onValueChange={setBKualitas}>
                          <SelectTrigger aria-label="Pilih kualitas backlink">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {KUALITAS_OPTS.map((q) => (
                              <SelectItem key={q} value={q}>
                                <span className="flex items-center gap-2">
                                  <span className={cn("size-2 rounded-full", KUALITAS_BAR[q])} aria-hidden />
                                  {q}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end pb-1">
                        <div className="flex items-center gap-2">
                          <Switch id="bl-dofollow" checked={bDofollow} onCheckedChange={setBDofollow} />
                          <Label htmlFor="bl-dofollow">{bDofollow ? "Dofollow" : "Nofollow"}</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleAdd} disabled={saving} className="gap-1.5">
                        {saving ? "Menyimpan…" : "＋ Catat Backlink"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </FadeUp>

              {/* Tabel backlink */}
              <FadeUp delay={0.2}>
                <Card className="overflow-hidden rounded-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <CardTitle>Daftar Backlink</CardTitle>
                        <CardDescription>Tautan masuk beserta atribut dan statusnya.</CardDescription>
                      </div>
                      <Badge variant="secondary" className="tabular-nums">{links.items.length} tautan</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-96 overflow-y-auto nice-scroll">
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-card">
                          <TableRow>
                            <TableHead>Source URL</TableHead>
                            <TableHead className="hidden md:table-cell">Anchor</TableHead>
                            <TableHead className="text-center">Atribut</TableHead>
                            <TableHead className="text-center">Kualitas</TableHead>
                            <TableHead className="text-right">DA</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="w-12 text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {links.loading && (
                            <TableRow>
                              <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Memuat data…</TableCell>
                            </TableRow>
                          )}
                          {!links.loading && links.items.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} className="p-0">
                                <EmptyState
                                  icon={Radar}
                                  title="Belum ada backlink tercatat"
                                  desc="Catat tautan masuk pertama lewat form di atas, atau hasil dari guest post & digital PR."
                                />
                              </TableCell>
                            </TableRow>
                          )}
                          {!links.loading && links.items.map((b) => (
                            <TableRow key={b.id} className="hover:bg-emerald-500/5">
                              <TableCell className="max-w-[220px]">
                                <a
                                  href={b.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex max-w-full items-center gap-1 text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                                  title={b.sourceUrl}
                                >
                                  <span className="truncate">{b.sourceUrl}</span>
                                  <ExternalLink className="size-3 shrink-0" aria-hidden />
                                </a>
                              </TableCell>
                              <TableCell className="hidden max-w-[160px] md:table-cell">
                                <span className="block truncate text-xs" title={b.anchorText}>
                                  {b.anchorText || <span className="text-muted-foreground">—</span>}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                {b.dofollow ? (
                                  <Badge className="border-transparent bg-emerald-600 font-semibold text-white">Dofollow</Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-muted text-muted-foreground">Nofollow</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={cn("border font-semibold", KUALITAS_BADGE[b.kualitas] || KUALITAS_BADGE.SEDANG)}>
                                  {b.kualitas}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono tabular-nums">{b.domainAuth}</TableCell>
                              <TableCell className="text-center">
                                {b.status === "AKTIF" && (
                                  <Badge className="border-emerald-500/40 bg-emerald-500/15 font-semibold text-emerald-700 dark:text-emerald-400">AKTIF</Badge>
                                )}
                                {b.status === "HILANG" && (
                                  <Badge className="border-red-500/40 bg-red-500/15 font-semibold text-red-700 dark:text-red-400">HILANG</Badge>
                                )}
                                {b.status !== "AKTIF" && b.status !== "HILANG" && (
                                  <Badge className="border-amber-400/50 bg-amber-400/20 font-semibold text-amber-800 dark:text-amber-300">
                                    {b.status || "PENDING"}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="size-8 p-0 text-muted-foreground hover:text-red-600"
                                  onClick={() => handleDelete(b.id, b.sourceUrl)}
                                  aria-label="Hapus backlink"
                                >
                                  <Trash2 className="size-4" aria-hidden />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </FadeUp>
            </>
          )}
        </>
      )}
    </div>
  );
}
