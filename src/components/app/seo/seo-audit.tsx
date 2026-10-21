"use client";

// ═══════════════════════════════════════════════════════════════
// GUNARA OS v7.0 — SEO MASTERY · AI Audit Engine
// Jalankan audit 40+ sinyal SEO, lihat skor ring, temuan berjenjang,
// dan rekomendasi strategi dari Dewan 46. Riwayat audit tersimpan.
// ═══════════════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { CheckCircle2, Circle, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useRecords } from "../use-records";
import { EASE } from "../motion";
import { cn } from "@/lib/utils";

// ── Tipe data ──
type SeoProject = { id: string; nama: string; domain: string };

type SeoAuditRow = {
  id: string;
  projectId: string;
  url: string;
  skorTotal: number;
  skorTeknik: number;
  skorOnpage: number;
  skorKonten: number;
  skorMobile: number;
  metrics: string;
  issues: string;
  ringkasan: string;
  createdAt: string;
};

type AuditResult = {
  id?: string;
  url?: string;
  skorTotal: number;
  skorTeknik: number;
  skorOnpage: number;
  skorKonten: number;
  skorMobile: number;
  issues?: unknown;
  ringkasan?: string;
};

type Issue = { severity?: string; judul?: string; detail?: string; saran?: string };

// ── Konstanta & helper ──
const STEPS = ["Mengambil halaman…", "Menganalisis 40+ sinyal…", "Dewan 46 menyusun strategi…"] as const;
const NONE = "__none";

function parseIssues(raw: unknown): Issue[] {
  let data: unknown = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return Array.isArray(data) ? (data as Issue[]) : [];
}

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function skorBadgeClass(s: number): string {
  if (s >= 80) return "bg-emerald-600 text-white hover:bg-emerald-600";
  if (s >= 60) return "bg-amber-400 text-amber-950 hover:bg-amber-400";
  return "bg-red-500 text-white hover:bg-red-500";
}

function barClass(v: number): string {
  if (v >= 80) return "[&>div]:bg-emerald-500";
  if (v >= 60) return "[&>div]:bg-amber-400";
  return "[&>div]:bg-red-500";
}

function severityBadgeClass(sev: string | undefined): string {
  switch ((sev || "").toUpperCase()) {
    case "KRITIS": return "bg-red-500/15 text-red-600 hover:bg-red-500/15 dark:text-red-400";
    case "PERINGATAN": return "bg-amber-400/15 text-amber-600 hover:bg-amber-400/15 dark:text-amber-400";
    case "BAIK": return "bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/15 dark:text-emerald-400";
    default: return "bg-muted text-muted-foreground hover:bg-muted";
  }
}

// ── Cincin skor SVG beranimasi ──
function ScoreRing({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const size = 148;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const colorCls = value >= 80 ? "stroke-emerald-500" : value >= 60 ? "stroke-amber-400" : "stroke-red-500";
  return (
    <div className="relative inline-flex items-center justify-center" role="img" aria-label={`Skor total ${value} dari 100`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={colorCls}
          strokeDasharray={c}
          initial={reduce ? { strokeDashoffset: c * (1 - pct) } : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black tabular-nums">{value}</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Skor Total</span>
      </div>
    </div>
  );
}

// ── Section utama ──
export function SeoAuditSection() {
  const projects = useRecords<SeoProject>("seoProject");

  const [url, setUrl] = useState("");
  const [projectId, setProjectId] = useState("");
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [history, setHistory] = useState<SeoAuditRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) clearTimeout(t);
    timersRef.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const loadHistory = useCallback(async (pid: string) => {
    setHistoryLoading(true);
    try {
      const qs = pid ? `?projectId=${encodeURIComponent(pid)}` : "";
      const res = await fetch(`/api/seo/audit${qs}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal memuat riwayat audit");
      setHistory(Array.isArray(json.items) ? (json.items as SeoAuditRow[]) : []);
    } catch (e) {
      setHistory([]);
      toast({
        title: "Gagal memuat riwayat",
        description: e instanceof Error ? e.message : "Terjadi kesalahan jaringan.",
        variant: "destructive",
      });
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Muat riwayat saat pertama kali & tiap proyek berubah
  useEffect(() => {
    loadHistory(projectId);
  }, [projectId, loadHistory]);

  const runAudit = useCallback(async () => {
    const target = url.trim();
    if (!target) {
      toast({ title: "URL wajib diisi", description: "Masukkan domain yang ingin diaudit, mis. gunara.web.id", variant: "destructive" });
      return;
    }
    setRunning(true);
    setStep(0);
    setResult(null);
    clearTimers();
    timersRef.current = [
      setTimeout(() => setStep(1), 900),
      setTimeout(() => setStep(2), 1900),
    ];
    try {
      const res = await fetch("/api/seo/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: target, projectId: projectId || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Audit gagal dijalankan");
      const item = json.item as Partial<SeoAuditRow> | undefined;
      if (!item) throw new Error("Respons audit tidak valid");
      setResult({
        id: item.id,
        url: item.url ?? target,
        skorTotal: num(item.skorTotal),
        skorTeknik: num(item.skorTeknik),
        skorOnpage: num(item.skorOnpage),
        skorKonten: num(item.skorKonten),
        skorMobile: num(item.skorMobile),
        issues: item.issues,
        ringkasan: item.ringkasan ?? "",
      });
      toast({ title: "✅ Audit selesai", description: `Skor total ${num(item.skorTotal)}/100 untuk ${target}` });
      loadHistory(projectId);
    } catch (e) {
      toast({
        title: "Gagal menjalankan audit",
        description: e instanceof Error ? e.message : "Terjadi kesalahan jaringan.",
        variant: "destructive",
      });
    } finally {
      clearTimers();
      setRunning(false);
      setStep(0);
    }
  }, [url, projectId, clearTimers, loadHistory]);

  const loadFromHistory = useCallback((row: SeoAuditRow) => {
    setResult({
      id: row.id,
      url: row.url,
      skorTotal: num(row.skorTotal),
      skorTeknik: num(row.skorTeknik),
      skorOnpage: num(row.skorOnpage),
      skorKonten: num(row.skorKonten),
      skorMobile: num(row.skorMobile),
      issues: row.issues,
      ringkasan: row.ringkasan,
    });
  }, []);

  const deleteAudit = useCallback(async (row: SeoAuditRow) => {
    setDeletingId(row.id);
    try {
      const res = await fetch(`/api/seo/audit?id=${encodeURIComponent(row.id)}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Gagal menghapus audit");
      setResult((prev) => (prev && prev.id === row.id ? null : prev));
      setHistory((prev) => prev.filter((h) => h.id !== row.id));
      toast({ title: "🗑️ Audit dihapus", description: `${row.url} dihapus dari riwayat.` });
    } catch (e) {
      toast({
        title: "Gagal menghapus",
        description: e instanceof Error ? e.message : "Terjadi kesalahan jaringan.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }, []);

  const reduce = useReducedMotion();
  const issues = result ? parseIssues(result.issues) : [];
  const subScores = result
    ? [
        { label: "Teknik", value: result.skorTeknik },
        { label: "On-Page", value: result.skorOnpage },
        { label: "Konten", value: result.skorKonten },
        { label: "Mobile", value: result.skorMobile },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-600/10 via-transparent to-amber-400/10 p-6 dark:border-emerald-700/30">
        <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <ShieldCheck className="size-6 text-emerald-600 dark:text-emerald-400" aria-hidden /> AI Audit Engine
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Mesin audit 40+ sinyal SEO: teknis, on-page, konten, dan mobile — diakhiri strategi
          perbaikan prioritas dari Dewan 46.
        </p>
      </div>

      {/* ── Form audit ── */}
      <Card className="py-0">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[1fr_240px_auto]">
            <div className="space-y-2">
              <Label htmlFor="audit-url">URL Website</Label>
              <Input
                id="audit-url"
                placeholder="contoh: gunara.web.id"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !running) runAudit();
                }}
                disabled={running}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audit-project">Proyek (opsional)</Label>
              <Select value={projectId || NONE} onValueChange={(v) => setProjectId(v === NONE ? "" : v)} disabled={running}>
                <SelectTrigger id="audit-project" className="w-full">
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
              onClick={runAudit}
              disabled={running}
            >
              {running ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden /> Menganalisis…
                </>
              ) : (
                <>🔍 Jalankan Audit</>
              )}
            </Button>
          </div>

          {/* Indikator langkah berjalan */}
          {running && (
            <motion.ol
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mt-5 space-y-2.5 rounded-xl border bg-muted/30 p-4"
              aria-live="polite"
              aria-label="Progres audit"
            >
              {STEPS.map((s, i) => {
                const done = i < step;
                const active = i === step;
                return (
                  <li key={s} className={cn("flex items-center gap-2.5 text-sm", !done && !active && "text-muted-foreground")}>
                    {done ? (
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
                    ) : active ? (
                      <motion.span
                        className="relative inline-flex size-2.5 shrink-0"
                        aria-hidden
                      >
                        <motion.span
                          className="absolute inline-flex size-full rounded-full bg-emerald-500"
                          animate={reduce ? undefined : { scale: [1, 2], opacity: [0.8, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                        />
                        <span className="relative inline-flex size-2.5 rounded-full bg-emerald-600" />
                      </motion.span>
                    ) : (
                      <Circle className="size-4 shrink-0 text-muted-foreground/50" aria-hidden />
                    )}
                    <span className={cn(active && "font-semibold text-emerald-700 dark:text-emerald-400")}>{s}</span>
                  </li>
                );
              })}
            </motion.ol>
          )}
        </CardContent>
      </Card>

      {/* ── Hasil audit ── */}
      {result && (
        <div className="space-y-4">
          <Card className="gap-4 border-emerald-700/30 py-0">
            <CardHeader className="px-6 pb-0 pt-6">
              <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                Hasil Audit
                <Badge variant="outline" className="font-mono text-xs">{result.url}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
                <ScoreRing value={result.skorTotal} />
                <div className="grid w-full flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                  {subScores.map((s) => (
                    <div key={s.label}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium">{s.label}</span>
                        <span className="tabular-nums text-muted-foreground">{s.value}</span>
                      </div>
                      <Progress value={s.value} className={cn("h-2.5", barClass(s.value))} aria-label={`Skor ${s.label}: ${s.value}`} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Temuan */}
            <Card className="gap-4 py-0">
              <CardHeader className="px-6 pb-0 pt-6">
                <CardTitle className="text-base">Temuan Audit ({issues.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {issues.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">Tidak ada temuan tercatat.</p>
                ) : (
                  <ul className="nice-scroll max-h-96 space-y-3 overflow-y-auto pr-1">
                    {issues.map((it, i) => (
                      <li key={i} className="rounded-lg border bg-card p-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={cn("text-[10px] font-bold", severityBadgeClass(it.severity))}>
                            {(it.severity || "INFO").toUpperCase()}
                          </Badge>
                          <span className="text-sm font-bold">{it.judul || "Temuan"}</span>
                        </div>
                        {it.detail && <p className="mt-1.5 text-xs text-muted-foreground">{it.detail}</p>}
                        {it.saran && <p className="mt-1 text-xs italic text-emerald-700 dark:text-emerald-400">💡 {it.saran}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Rekomendasi AI */}
            <Card className="gap-4 py-0">
              <CardHeader className="px-6 pb-0 pt-6">
                <CardTitle className="text-base">🧠 Rekomendasi Dewan 46</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {result.ringkasan ? (
                  <div className="gunara-prose nice-scroll max-h-96 overflow-y-auto pr-1 text-sm">
                    <ReactMarkdown>{result.ringkasan}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">Tidak ada ringkasan untuk audit ini.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── Riwayat audit ── */}
      <Card className="gap-4 py-0">
        <CardHeader className="px-6 pb-0 pt-6">
          <CardTitle className="text-base">Riwayat Audit ({history.length})</CardTitle>
          <p className="text-xs text-muted-foreground">Klik baris untuk membuka kembali hasil audit.</p>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {historyLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Belum ada riwayat. Jalankan audit pertamamu di atas.
            </p>
          ) : (
            <div className="nice-scroll max-h-96 overflow-y-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/90 backdrop-blur">
                  <tr>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Waktu</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">URL</th>
                    <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase text-muted-foreground">Skor</th>
                    <th className="w-12 px-3 py-2.5"><span className="sr-only">Aksi</span></th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr
                      key={h.id}
                      className="cursor-pointer border-t transition-colors hover:bg-muted/50"
                      onClick={() => loadFromHistory(h)}
                    >
                      <td className="whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground">
                        {new Date(h.createdAt).toLocaleString("id-ID", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="max-w-0 truncate px-3 py-2.5 font-medium">{h.url}</td>
                      <td className="px-3 py-2.5">
                        <Badge className={cn("tabular-nums", skorBadgeClass(num(h.skorTotal)))}>{h.skorTotal}</Badge>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:text-red-500"
                          aria-label={`Hapus audit ${h.url}`}
                          disabled={deletingId === h.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAudit(h);
                          }}
                        >
                          {deletingId === h.id ? (
                            <Loader2 className="size-4 animate-spin" aria-hidden />
                          ) : (
                            <Trash2 className="size-4" aria-hidden />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
