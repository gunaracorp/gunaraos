"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v7.0 — SEO MASTERY · RADAR KOMPETITOR
// Bidik domain kompetitor → AI membedah gap, senjata, dan celah →
// hasil markdown siap tempur. Riwayat laporan tersimpan otomatis.
// ═══════════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Radar,
  Loader2,
  Trash2,
  Eye,
  History,
  Crosshair,
  Lightbulb,
  Globe,
} from "lucide-react";
import { FadeUp } from "../motion";
import { useRecords } from "../use-records";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CompetitorItem {
  id: string;
  projectId: string;
  domain: string;
  myDomain: string;
  hasil: string;
  createdAt: string;
}

interface ProjectItem {
  id: string;
  nama: string;
  domain: string;
}

/* Styling anak-markdown untuk render hasil AI (dipakai view & history) */
const MD_CLASS =
  "[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:text-emerald-700 dark:[&_h2]:text-emerald-300 " +
  "[&_h3]:font-semibold [&_h3]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 " +
  "[&_table]:w-full [&_table]:text-xs [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:px-2 [&_td]:py-1 " +
  "[&_p]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:pl-3 [&_blockquote]:italic";

/** Tanggal deterministik (server & klien sama) — hindari hydration mismatch */
function fmtDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    });
  } catch {
    return "—";
  }
}

export function CompetitorRadarSection() {
  const { toast } = useToast();
  const { items: reports, loading: loadingReports, refresh, remove } =
    useRecords<CompetitorItem>("competitorReport");
  const { items: projects } = useRecords<ProjectItem>("seoProject");

  const [domain, setDomain] = useState("");
  const [myDomain, setMyDomain] = useState("");
  const [projectId, setProjectId] = useState("none");
  const [scanning, setScanning] = useState(false);
  const [view, setView] = useState<{ domain: string; hasil: string } | null>(null);

  const sorted = useMemo(
    () =>
      [...reports].sort((a, b) =>
        (b.createdAt || "").localeCompare(a.createdAt || "")
      ),
    [reports]
  );

  async function scan() {
    const d = domain.trim();
    if (!d) {
      toast({
        title: "Domain kompetitor wajib diisi",
        description: "Contoh: kompetitor.com — tanpa https://",
      });
      return;
    }
    setScanning(true);
    try {
      const res = await fetch("/api/seo/competitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: d,
          myDomain: myDomain.trim() || undefined,
          projectId: projectId !== "none" ? projectId : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.item) {
        throw new Error(json?.error || "Radar gagal menembus target");
      }
      setView({
        domain: json.item.domain ?? d,
        hasil: json.item.hasil || "",
      });
      toast({
        title: "🎯 Radar terkunci",
        description: `Analisis ${json.item.domain ?? d} siap ditinjau.`,
      });
      await refresh();
    } catch (e: unknown) {
      toast({
        title: "Radar gagal",
        description: e instanceof Error ? e.message : "Coba lagi sebentar.",
      });
    } finally {
      setScanning(false);
    }
  }

  async function del(id: string) {
    try {
      await remove(id);
      toast({ title: "Laporan dihapus" });
    } catch {
      toast({ title: "Gagal menghapus laporan" });
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Hero ── */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-950 via-[#1a231e] to-emerald-950 p-6 sm:p-8 text-emerald-50">
          <Radar
            aria-hidden
            className="absolute -right-8 -top-10 size-56 opacity-[0.06]"
          />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/90">
            GUNARA OS v7.0 — SEO MASTERY
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-amber-100">
            🎯 Radar Kompetitor
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/80 leading-relaxed">
            Bidik domain pesaing — AI membedah struktur konten, kata kunci, kekuatan
            backlink, dan celah yang bisa diserang. Kenali medan sebelum bertempur.
          </p>
        </div>
      </FadeUp>

      <div className="grid gap-4 lg:grid-cols-[380px,1fr] items-start">
        {/* ── Form Radar ── */}
        <FadeUp delay={0.05}>
          <Card className="rounded-xl">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Crosshair className="size-4 text-emerald-600" /> Bidik Target
              </CardTitle>
              <CardDescription className="text-xs">
                Isi domain kompetitor — radar AI akan memindai dan menyusun laporan
                strategis.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-3 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="radar-domain">Domain Kompetitor</Label>
                <Input
                  id="radar-domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="kompetitor.com"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="radar-mine">
                  Domain Saya{" "}
                  <span className="font-normal text-muted-foreground">(opsional)</span>
                </Label>
                <Input
                  id="radar-mine"
                  value={myDomain}
                  onChange={(e) => setMyDomain(e.target.value)}
                  placeholder="bisnisku.com"
                  autoComplete="off"
                />
                <p className="text-[11px] text-muted-foreground">
                  Diisi = perbandingan langsung kepala-kepala.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label>
                  Proyek SEO{" "}
                  <span className="font-normal text-muted-foreground">(opsional)</span>
                </Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="w-full" aria-label="Pilih proyek SEO">
                    <SelectValue placeholder="Tanpa proyek" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tanpa proyek</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={scan}
                disabled={scanning}
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                {scanning ? (
                  <>
                    <Loader2 className="size-4 mr-1 animate-spin" /> Memindai target…
                  </>
                ) : (
                  <>
                    <Radar className="size-4 mr-1" /> 🎯 Radar Serangan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </FadeUp>

        {/* ── Hasil + Riwayat ── */}
        <div className="space-y-4">
          <FadeUp delay={0.1}>
            <Card className="rounded-xl">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="size-4 text-emerald-600" /> Hasil Analisis
                </CardTitle>
                {view && (
                  <CardDescription className="text-xs">
                    Laporan strategis untuk{" "}
                    <strong className="text-foreground">{view.domain}</strong>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="p-6 pt-3">
                {view ? (
                  <div
                    className={cn(
                      "max-h-[520px] overflow-y-auto nice-scroll text-sm leading-relaxed",
                      MD_CLASS
                    )}
                  >
                    <ReactMarkdown>{view.hasil}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
                    <Radar className="size-10 text-muted-foreground/40" aria-hidden />
                    <p className="mt-3 text-sm font-semibold text-muted-foreground">
                      Belum ada target dipindai
                    </p>
                    <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                      Masukkan domain kompetitor di kiri, lalu tembak Radar Serangan.
                      Laporan akan muncul di sini.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeUp>

          <FadeUp delay={0.15}>
            <Card className="rounded-xl">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="size-4 text-emerald-600" /> Riwayat Laporan
                  {!loadingReports && (
                    <Badge variant="outline" className="ml-1 tabular-nums">
                      {sorted.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-3">
                {loadingReports ? (
                  <div className="space-y-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                    ))}
                  </div>
                ) : sorted.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Belum ada riwayat — laporan yang dihasilkan radar otomatis tersimpan
                    di sini.
                  </p>
                ) : (
                  <ul className="max-h-96 space-y-2 overflow-y-auto nice-scroll pr-1">
                    {sorted.map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 transition-colors hover:bg-muted/40"
                      >
                        <span className="size-2 flex-none rounded-full bg-emerald-500" aria-hidden />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{r.domain}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {fmtDate(r.createdAt)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setView({ domain: r.domain, hasil: r.hasil || "" })
                          }
                          aria-label={`Lihat laporan ${r.domain}`}
                        >
                          <Eye className="size-3.5 mr-1" /> Lihat
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400"
                          onClick={() => del(r.id)}
                          aria-label={`Hapus laporan ${r.domain}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </FadeUp>

          {/* ── Tips ── */}
          <FadeUp delay={0.2}>
            <div className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-400/5 p-4">
              <Lightbulb className="mt-0.5 size-5 flex-none text-amber-500" aria-hidden />
              <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                <strong>Tips Radar:</strong> Radar memakai estimasi strategis AI —
                gabungkan dengan data Search Console untuk tembakan presisi.
              </p>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}
