"use client";

// ═══════════════════════════════════════════════════════════════
// GUNARA OS v7.0 — SEO MASTERY · AI Keyword Research Studio
// Generate 30 keyword ber-cluster + intent, filter, ekspor CSV,
// dan simpan ide ke proyek dengan penanda "dipakai".
// ═══════════════════════════════════════════════════════════════

import { useCallback, useMemo, useState } from "react";
import { Loader2, KeyRound, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useRecords } from "../use-records";
import { cn } from "@/lib/utils";

// ── Tipe data ──
type SeoProject = { id: string; nama: string; domain: string };

type KeywordIdea = {
  id: string;
  projectId: string;
  seed: string;
  keyword: string;
  intent: string;
  cluster: string;
  difficulty: number;
  volume: number;
  prioritas: string;
  dipakai: boolean;
};

// ── Konstanta & helper ──
const NONE = "__none";

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** Format volume gaya Indonesia: 1200 → "1,2rb", 2_400_000 → "2,4jt" */
function fmtVolume(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(".", ",")}jt`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1).replace(".", ",")}rb`;
  return String(v);
}

function intentBadgeClass(intent: string): string {
  switch ((intent || "").toLowerCase()) {
    case "informational": return "bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/15 dark:text-emerald-400";
    case "commercial": return "bg-amber-400/15 text-amber-600 hover:bg-amber-400/15 dark:text-amber-400";
    case "transactional": return "bg-rose-500/15 text-rose-600 hover:bg-rose-500/15 dark:text-rose-400";
    case "navigational": return "bg-sky-500/15 text-sky-600 hover:bg-sky-500/15 dark:text-sky-400";
    default: return "bg-muted text-muted-foreground hover:bg-muted";
  }
}

function prioritasBadgeClass(p: string): string {
  switch ((p || "").toUpperCase()) {
    case "TINGGI": return "bg-emerald-600 text-white hover:bg-emerald-600";
    case "SEDANG": return "bg-amber-400 text-amber-950 hover:bg-amber-400";
    default: return "bg-muted text-muted-foreground hover:bg-muted";
  }
}

function difficultyBarClass(v: number): string {
  if (v <= 30) return "[&>div]:bg-emerald-500";
  if (v <= 60) return "[&>div]:bg-amber-400";
  return "[&>div]:bg-rose-500";
}

export function KeywordStudioSection() {
  const projects = useRecords<SeoProject>("seoProject");

  const [seed, setSeed] = useState("");
  const [industri, setIndustri] = useState("");
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<KeywordIdea[]>([]);
  const [clusterFilter, setClusterFilter] = useState<string>("all");
  const [generated, setGenerated] = useState(false);

  const saved = useRecords<KeywordIdea>(
    "keywordIdea",
    projectId ? { key: "projectId", value: projectId } : undefined
  );

  const clusters = useMemo(
    () => [...new Set(results.map((r) => r.cluster).filter(Boolean))].sort(),
    [results]
  );

  const filtered = useMemo(
    () => (clusterFilter === "all" ? results : results.filter((r) => r.cluster === clusterFilter)),
    [results, clusterFilter]
  );

  const stats = useMemo(() => {
    const total = results.length;
    const avgDiff = total > 0 ? Math.round(results.reduce((s, r) => s + num(r.difficulty), 0) / total) : 0;
    const totalVol = results.reduce((s, r) => s + num(r.volume), 0);
    return { total, avgDiff, totalVol };
  }, [results]);

  const generate = useCallback(async () => {
    const s = seed.trim();
    if (!s) {
      toast({ title: "Seed keyword wajib diisi", description: "Mis. jasa pendirian pt", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/seo/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seed: s,
          industri: industri.trim() || undefined,
          projectId: projectId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal generate keyword");
      const items: KeywordIdea[] = Array.isArray(json.items) ? json.items : [];
      setResults(items);
      setClusterFilter("all");
      setGenerated(true);
      toast({
        title: `⚡ ${items.length} keyword siap`,
        description: projectId
          ? "Ide tersimpan otomatis ke proyek yang dipilih."
          : "Pilih proyek untuk menyimpan ide ke database.",
      });
      if (projectId) saved.refresh();
    } catch (e) {
      toast({
        title: "Gagal generate keyword",
        description: e instanceof Error ? e.message : "Terjadi kesalahan jaringan.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [seed, industri, projectId, saved]);

  const toggleDipakai = useCallback(
    async (idea: KeywordIdea) => {
      try {
        await saved.update(idea.id, { dipakai: !idea.dipakai });
      } catch (e) {
        toast({
          title: "Gagal memperbarui ide",
          description: e instanceof Error ? e.message : "Terjadi kesalahan.",
          variant: "destructive",
        });
      }
    },
    [saved]
  );

  const removeIdea = useCallback(
    async (idea: KeywordIdea) => {
      try {
        await saved.remove(idea.id);
        toast({ title: "🗑️ Ide dihapus", description: idea.keyword });
      } catch (e) {
        toast({
          title: "Gagal menghapus ide",
          description: e instanceof Error ? e.message : "Terjadi kesalahan.",
          variant: "destructive",
        });
      }
    },
    [saved]
  );

  const copyCsv = useCallback(async () => {
    if (results.length === 0) {
      toast({ title: "Belum ada data", description: "Generate keyword dulu sebelum menyalin CSV.", variant: "destructive" });
      return;
    }
    const rows = [
      "keyword,volume,difficulty,intent,cluster",
      ...results.map((r) =>
        [`"${(r.keyword || "").replace(/"/g, '""')}"`, num(r.volume), num(r.difficulty), r.intent, `"${(r.cluster || "").replace(/"/g, '""')}"`].join(",")
      ),
    ];
    try {
      await navigator.clipboard.writeText(rows.join("\n"));
      toast({ title: "📋 CSV disalin", description: `${results.length} baris keyword siap ditempel ke spreadsheet.` });
    } catch {
      toast({
        title: "Gagal menyalin",
        description: "Browser memblokir akses clipboard. Coba lagi atau gunakan HTTPS.",
        variant: "destructive",
      });
    }
  }, [results]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-600/10 via-transparent to-amber-400/10 p-6 dark:border-emerald-700/30">
        <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <KeyRound className="size-6 text-emerald-600 dark:text-emerald-400" aria-hidden /> AI Keyword Research Studio
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Satu seed keyword → 30 ide terukur dengan intent, cluster, difficulty, dan volume.
          Prioritaskan yang TINGGI, biarkan Dewan 46 yang memilah.
        </p>
      </div>

      {/* ── Form riset ── */}
      <Card className="py-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="kw-seed">Seed Keyword</Label>
              <Input
                id="kw-seed"
                placeholder="mis. jasa pendirian pt"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) generate();
                }}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kw-industri">Industri (opsional)</Label>
              <Input
                id="kw-industri"
                placeholder="mis. perizinan usaha"
                value={industri}
                onChange={(e) => setIndustri(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kw-project">Proyek</Label>
              <Select value={projectId || NONE} onValueChange={(v) => setProjectId(v === NONE ? "" : v)} disabled={loading}>
                <SelectTrigger id="kw-project" className="w-full">
                  <SelectValue placeholder="Pilih proyek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>— Tanpa proyek —</SelectItem>
                  {projects.items.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={generate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Meriset…
                </>
              ) : (
                <>⚡ Generate 30 Keyword</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Hasil riset ── */}
      {generated ? (
        <Card className="gap-4 py-0">
          <CardHeader className="px-6 pb-0 pt-6">
            <CardTitle className="flex flex-wrap items-center gap-2 text-base">
              Hasil Riset
              {projectId && (
                <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/15 dark:text-emerald-400">
                  ✓ Tersimpan ke proyek
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {/* Statistik ringkas */}
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg border bg-muted/30 p-3 text-center">
                <p className="text-2xl font-extrabold tabular-nums">{stats.total}</p>
                <p className="text-[11px] text-muted-foreground">Total Keyword</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-center">
                <p className="text-2xl font-extrabold tabular-nums">{stats.avgDiff}</p>
                <p className="text-[11px] text-muted-foreground">Rata-rata Difficulty</p>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-center">
                <p className="text-2xl font-extrabold tabular-nums">{fmtVolume(stats.totalVol)}</p>
                <p className="text-[11px] text-muted-foreground">Total Volume/bulan</p>
              </div>
            </div>

            {/* Filter cluster + ekspor */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {["all", ...clusters].map((c) => {
                const active = clusterFilter === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setClusterFilter(c)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "bg-card text-muted-foreground hover:border-emerald-500 hover:text-foreground"
                    )}
                  >
                    {c === "all" ? "Semua Cluster" : c}
                  </button>
                );
              })}
              <Button
                size="sm"
                variant="outline"
                className="ml-auto gap-1.5"
                onClick={copyCsv}
                disabled={results.length === 0}
              >
                📋 Salin CSV
              </Button>
            </div>

            {/* Tabel keyword */}
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Tidak ada keyword pada cluster ini.</p>
            ) : (
              <div className="nice-scroll max-h-96 overflow-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/90 backdrop-blur">
                    <tr>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Keyword</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Intent</th>
                      <th className="hidden px-3 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground md:table-cell">Cluster</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Difficulty</th>
                      <th className="px-3 py-2.5 text-right text-xs font-semibold uppercase text-muted-foreground">Volume</th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Prioritas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={`${r.keyword}-${i}`} className="border-t transition-colors hover:bg-muted/50">
                        <td className="max-w-0 px-3 py-2.5 font-medium">
                          <span className="block truncate">{r.keyword}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge className={cn("text-[10px] capitalize", intentBadgeClass(r.intent))}>{r.intent}</Badge>
                        </td>
                        <td className="hidden max-w-40 truncate px-3 py-2.5 text-xs text-muted-foreground md:table-cell">{r.cluster}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={num(r.difficulty)}
                              className={cn("h-1.5 w-16", difficultyBarClass(num(r.difficulty)))}
                              aria-label={`Difficulty ${r.difficulty}`}
                            />
                            <span className="tabular-nums text-xs text-muted-foreground">{num(r.difficulty)}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-right tabular-nums">{fmtVolume(num(r.volume))}</td>
                        <td className="px-3 py-2.5">
                          <Badge className={cn("text-[10px] font-bold", prioritasBadgeClass(r.prioritas))}>{r.prioritas}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed py-0">
          <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
            <KeyRound className="size-8 text-muted-foreground/50" aria-hidden />
            <p className="font-semibold">Belum ada hasil riset</p>
            <p className="max-w-md text-sm text-muted-foreground">
              Masukkan seed keyword di atas lalu klik <span className="font-semibold">⚡ Generate 30 Keyword</span>.
              Pilih proyek agar ide otomatis tersimpan dan bisa ditandai &quot;dipakai&quot;.
            </p>
          </CardContent>
        </Card>
      )}

      {/* ── Ide tersimpan (hanya saat proyek dipilih) ── */}
      {projectId && (
        <Card className="gap-4 py-0">
          <CardHeader className="px-6 pb-0 pt-6">
            <CardTitle className="text-base">💾 Ide Tersimpan ({saved.items.length})</CardTitle>
            <p className="text-xs text-muted-foreground">
              Centang ide yang akan dipakai dalam kalender konten.
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {saved.loading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : saved.items.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Belum ada ide tersimpan untuk proyek ini. Hasil generate dengan proyek terpilih otomatis masuk ke sini.
              </p>
            ) : (
              <ul className="nice-scroll max-h-96 space-y-2 overflow-y-auto pr-1">
                {saved.items.map((idea) => (
                  <li
                    key={idea.id}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                  >
                    <Checkbox
                      id={`idea-${idea.id}`}
                      checked={idea.dipakai}
                      onCheckedChange={() => toggleDipakai(idea)}
                      aria-label={`Tandai ${idea.keyword} sebagai dipakai`}
                    />
                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor={`idea-${idea.id}`}
                        className={cn(
                          "block cursor-pointer truncate text-sm font-medium",
                          idea.dipakai && "text-muted-foreground line-through"
                        )}
                      >
                        {idea.keyword}
                      </label>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-muted-foreground">
                        <span className="capitalize">{idea.intent}</span>
                        {idea.cluster && <span>· {idea.cluster}</span>}
                        <span>· Vol {fmtVolume(num(idea.volume))}</span>
                        <span>· KD {num(idea.difficulty)}</span>
                      </p>
                    </div>
                    <Badge className={cn("shrink-0 text-[10px] font-bold", prioritasBadgeClass(idea.prioritas))}>
                      {idea.prioritas}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 shrink-0 text-muted-foreground hover:text-red-500"
                      aria-label={`Hapus ide ${idea.keyword}`}
                      onClick={() => removeIdea(idea)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
