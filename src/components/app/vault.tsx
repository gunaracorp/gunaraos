"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — Data Vault & Diagnostik (v9.0)
// by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon
//
// 3 tab:
//   💾 Backup & Restore — ekspor/impor seluruh data (JSON)
//   🩺 Diagnostik       — health check database + uji semua endpoint
//   📦 Panduan Deploy   — cara data tersimpan + migrasi hosting
// ═══════════════════════════════════════════════════════════════════

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  DatabaseBackup, Download, Upload, ShieldCheck, Activity, PackageOpen,
  CheckCircle2, XCircle, Loader2, Info, HardDriveDownload, Clock,
  FileJson, TriangleAlert, Globe2, ServerCog, RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FadeUp, EASE } from "./motion";

// ── Tipe ───────────────────────────────────────────────────────────
interface BackupMeta {
  app?: string; version?: string; exportedAt?: string; totalRows?: number;
  counts?: Record<string, number>; format?: string; author?: string;
}
interface RestoreSummary {
  ok?: boolean; mode?: string; restored?: number; skippedRows?: number;
  summary?: Record<string, { created: number; updated: number; skipped: number }>;
  error?: string;
}
interface HealthData {
  ok?: boolean; version?: string; env?: string; dbOk?: boolean;
  counts?: Record<string, number>; totalRows?: number;
  memoryMb?: number; heapMb?: number; uptimeSec?: number;
  latencyMs?: number; checkedAt?: string;
  checks?: { name: string; ok: boolean; detail: string }[];
}
interface ProbeResult { path: string; status: number | null; ms: number | null; ok: boolean }

const LABEL_ID: Record<string, string> = {
  setting: "Pengaturan", domain: "43 Domain", agent: "15 AI Agents",
  appUser: "Pengguna", customer: "Pelanggan", company: "Perusahaan",
  client: "Klien CRM", followUp: "Follow-up", debt: "Hutang",
  debtPayment: "Cicilan Hutang", receivable: "Piutang", cashflow: "Kas",
  childSaving: "Tabungan Anak", relation: "Relasi & Politik",
  politicalActivity: "Aktivitas Politik", learningJournal: "Jurnal Belajar",
  winLog: "Win Log", caseStudy: "Studi Kasus", dailyLog: "Ritual Harian",
  weeklyReview: "Review Mingguan", backlogItem: "Backlog",
  decisionLog: "Decisions Log", socialAccount: "Sosmed",
  vaultEntry: "Brankas Sandi", serviceCatalog: "Katalog Layanan",
  permitApplication: "Perizinan", seoProject: "Proyek SEO",
  seoAudit: "Audit SEO", keywordRank: "Posisi Keyword",
  keywordIdea: "Ide Keyword", contentPlan: "Kalender Konten",
  backlink: "Backlink", competitorReport: "Laporan Kompetitor",
  metaPreset: "Preset Meta", seoProposal: "Proposal SEO",
  consultation: "Ultimate Solver", debate: "Arena Debat",
  sageChat: "Sage Console",
};

const PROBE_ENDPOINTS: string[] = [
  "/api/health", "/api/data/setting", "/api/data/agent", "/api/data/domain",
  "/api/data/seoProject", "/api/data/client", "/api/data/debt",
  "/api/seo/audit", "/api/seo/keywords", "/api/seo/competitor",
  "/api/seo/proposal", "/api/solver", "/api/arena", "/api/sage",
];

const LAST_BACKUP_KEY = "gunara-last-backup-at";

function fmtDT(v?: string | null): string {
  if (!v) return "—";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta",
    }).format(new Date(v));
  } catch { return "—"; }
}

// ═══════════════════════════════════════════════════════════════════
export function VaultSection() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {/* ── Hero ── */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-6 text-emerald-50 sm:p-8">
          <div className="relative z-10 space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              GUNARA OS · MODUL DATA v9.0
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl flex items-center gap-3">
              <DatabaseBackup className="size-7 text-amber-300" aria-hidden />
              Data Vault &amp; Diagnostik
            </h1>
            <p className="max-w-2xl text-sm text-emerald-100/90">
              Seluruh data Anda <strong className="text-amber-200">tersimpan otomatis ke database server</strong> setiap
              kali menekan Simpan/Tambah — aman walau browser ditutup. Gunakan tab{" "}
              <strong className="text-amber-200">Backup &amp; Restore</strong> untuk menjamin data tetap utuh saat
              pindah hosting, dan <strong className="text-amber-200">Diagnostik</strong> untuk memeriksa seluruh
              link &amp; endpoint setelah situs terinstall.
            </p>
          </div>
        </div>
      </FadeUp>

      <Tabs defaultValue="backup" className="gap-4">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="backup" className="gap-1.5"><DatabaseBackup className="size-4" /> Backup &amp; Restore</TabsTrigger>
          <TabsTrigger value="health" className="gap-1.5"><Activity className="size-4" /> Diagnostik</TabsTrigger>
          <TabsTrigger value="deploy" className="gap-1.5"><Globe2 className="size-4" /> Panduan Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="backup"><BackupTab toast={toast} /></TabsContent>
        <TabsContent value="health"><HealthTab toast={toast} /></TabsContent>
        <TabsContent value="deploy"><DeployTab /></TabsContent>
      </Tabs>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TAB 1 — BACKUP & RESTORE
// ═══════════════════════════════════════════════════════════════════
function BackupTab({ toast }: { toast: ReturnType<typeof useToast>["toast"] }) {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [meta, setMeta] = useState<BackupMeta | null>(null);
  const [payload, setPayload] = useState<Record<string, unknown[]> | null>(null);
  const [mode, setMode] = useState<"merge" | "replace">("merge");
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [result, setResult] = useState<RestoreSummary | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [autoTip, setAutoTip] = useState(true);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(LAST_BACKUP_KEY);
      if (v) setLastBackup(v);
      const t = window.localStorage.getItem("gunara-vault-autotip");
      if (t === "off") setAutoTip(false);
    } catch { /* abaikan */ }
  }, []);

  // ── Ekspor ──
  const doExport = useCallback(async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/backup", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gunara-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      const now = new Date().toISOString();
      setLastBackup(now);
      try { window.localStorage.setItem(LAST_BACKUP_KEY, now); } catch { /* abaikan */ }
      toast({ title: "✅ Backup berhasil diunduh", description: "Simpan file JSON ini di tempat aman (cloud drive / lokal)." });
    } catch (e) {
      toast({ title: "Gagal mengekspor", description: String(e), variant: "destructive" });
    } finally {
      setExporting(false);
    }
  }, [toast]);

  // ── Pilih & baca file ──
  const onFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast({ title: "File terlalu besar (maks 15 MB)", variant: "destructive" });
      return;
    }
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== "object" || !parsed.data) {
        throw new Error("Bukan file backup GUNARA OS (field 'data' tidak ditemukan).");
      }
      const m: BackupMeta = parsed.meta || {};
      const data = parsed.data as Record<string, unknown[]>;
      const rows = Object.values(data).reduce((a: number, r) => a + (Array.isArray(r) ? r.length : 0), 0);
      setMeta({ ...m, totalRows: m.totalRows ?? rows });
      setPayload(data);
      setResult(null);
      setFileName(file.name);
      toast({ title: "📂 File backup terbaca", description: `${rows.toLocaleString("id-ID")} baris dari ${Object.keys(data).length} resource.` });
    } catch (e) {
      setMeta(null); setPayload(null); setFileName("");
      toast({ title: "File tidak valid", description: String(e instanceof Error ? e.message : e), variant: "destructive" });
    }
  }, [toast]);

  // ── Restore ──
  const doRestore = useCallback(async () => {
    if (!payload) return;
    setImporting(true);
    setResult(null);
    try {
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, data: payload }),
      });
      const json = (await res.json()) as RestoreSummary;
      if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
      setResult(json);
      toast({
        title: "✅ Restore selesai",
        description: `${(json.restored || 0).toLocaleString("id-ID")} baris tersimpan${json.skippedRows ? `, ${json.skippedRows} dilewati` : ""}.`,
      });
    } catch (e) {
      toast({ title: "Restore gagal", description: String(e instanceof Error ? e.message : e), variant: "destructive" });
    } finally {
      setImporting(false);
    }
  }, [payload, mode, toast]);

  const topCounts = meta?.counts
    ? Object.entries(meta.counts).sort((a, b) => b[1] - a[1]).slice(0, 12)
    : [];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Ekspor */}
      <FadeUp>
        <Card className="h-full rounded-xl gap-4">
          <CardHeader className="px-6 pb-0 pt-6">
            <CardTitle className="flex items-center gap-2 text-base">
              <HardDriveDownload className="size-5 text-emerald-700 dark:text-emerald-400" aria-hidden />
              Ekspor Data (Backup)
            </CardTitle>
            <CardDescription>
              Unduh <strong>seluruh</strong> data GUNARA OS — 38 tabel, termasuk proyek SEO, keuangan,
              CRM, dan brankas — menjadi satu file JSON.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <Button
              onClick={doExport}
              disabled={exporting}
              className="w-full bg-emerald-700 text-white hover:bg-emerald-800 sm:w-auto"
              size="lg"
            >
              {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              {exporting ? "Menyiapkan backup…" : "⬇️ Unduh Backup Lengkap"}
            </Button>
            <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground space-y-1.5">
              <p className="flex items-start gap-2">
                <Clock className="mt-0.5 size-3.5 flex-none" aria-hidden />
                <span>Backup terakhir: <strong className="text-foreground">{lastBackup ? fmtDT(lastBackup) : "belum pernah"}</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-3.5 flex-none text-emerald-600" aria-hidden />
                <span>Field rahasia (sandi brankas) tetap <strong>terenkripsi AES-256-GCM</strong> di dalam file — aman dibawa ke mana pun.</span>
              </p>
              <p className="flex items-start gap-2">
                <Info className="mt-0.5 size-3.5 flex-none" aria-hidden />
                <span>Kebiasaan emas: backup tiap akhir pekan + sebelum migrasi hosting.</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      {/* Impor */}
      <FadeUp delay={0.06}>
        <Card className="h-full rounded-xl gap-4">
          <CardHeader className="px-6 pb-0 pt-6">
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="size-5 text-amber-600" aria-hidden />
              Impor Data (Restore)
            </CardTitle>
            <CardDescription>
              Muat file backup untuk memulihkan data — misalnya setelah install situs di hosting baru.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <Input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={(e) => onFile(e.target.files?.[0])}
              className="cursor-pointer file:cursor-pointer file:border-0 file:bg-muted file:mr-3 file:rounded-md file:px-3 file:py-1.5 file:text-xs file:font-semibold"
              aria-label="Pilih file backup JSON"
            />
            {fileName && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs">
                <FileJson className="size-4 flex-none text-emerald-600" aria-hidden />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{fileName}</p>
                  <p className="text-muted-foreground">
                    v{meta?.version || "?"} · {fmtDT(meta?.exportedAt)} · {(meta?.totalRows || 0).toLocaleString("id-ID")} baris
                    {meta?.format ? ` · ${meta.format}` : ""}
                  </p>
                </div>
              </div>
            )}

            {meta?.counts && topCounts.length > 0 && (
              <div className="max-h-40 overflow-y-auto nice-scroll rounded-lg border p-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">Isi file (12 teratas):</p>
                <div className="flex flex-wrap gap-1.5">
                  {topCounts.map(([k, n]) => (
                    <Badge key={k} variant="outline" className="text-[11px]">
                      {LABEL_ID[k] || k}: {n.toLocaleString("id-ID")}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as "merge" | "replace")}
              className="grid gap-2 sm:grid-cols-2"
            >
              <label
                htmlFor="mode-merge"
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 text-xs transition-colors ${mode === "merge" ? "border-emerald-500 bg-emerald-500/5" : "hover:bg-muted/50"}`}
              >
                <RadioGroupItem id="mode-merge" value="merge" className="mt-0.5" />
                <span>
                  <strong className="block text-sm">Gabung (aman)</strong>
                  Data lama tetap; baris dengan ID sama diperbarui dari backup.
                </span>
              </label>
              <label
                htmlFor="mode-replace"
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 text-xs transition-colors ${mode === "replace" ? "border-rose-500 bg-rose-500/5" : "hover:bg-muted/50"}`}
              >
                <RadioGroupItem id="mode-replace" value="replace" className="mt-0.5" />
                <span>
                  <strong className="block text-sm">Timpa (kosongkan)</strong>
                  HAPUS semua data lama, lalu isi 100% dari backup.
                </span>
              </label>
            </RadioGroup>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={!payload || importing}
                  className="w-full bg-amber-600 text-white hover:bg-amber-700 sm:w-auto"
                  size="lg"
                >
                  {importing ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  {importing ? "Memulihkan data…" : "⬆️ Mulai Restore"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {mode === "replace" ? "⚠️ Timpa SEMUA data?" : "Gabungkan data dari backup?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {mode === "replace"
                      ? "Seluruh data yang sekarang ada di database akan DIHAPUS lalu diganti isi file backup. Tindakan ini tidak bisa dibatalkan. Pastikan Anda sudah punya backup kondisi sekarang."
                      : "Baris dengan ID sama akan diperbarui, baris baru ditambahkan, data lama lainnya tetap aman."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={doRestore}
                    className={mode === "replace" ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-emerald-700 text-white hover:bg-emerald-800"}
                  >
                    Ya, {mode === "replace" ? "timpa" : "gabungkan"} sekarang
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {importing && (
              <div className="space-y-2">
                <Progress value={66} className="h-1.5" />
                <p className="text-xs text-muted-foreground">Menulis baris ke database… jangan tutup halaman.</p>
              </div>
            )}

            {result?.ok && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs space-y-1"
              >
                <p className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" /> Restore berhasil — mode {result.mode}
                </p>
                <p>{(result.restored || 0).toLocaleString("id-ID")} baris tersimpan{result.skippedRows ? ` · ${result.skippedRows} baris dilewati` : ""}.</p>
                <p className="text-muted-foreground">Muat ulang halaman (F5) untuk melihat data terpulihkan di semua modul.</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </FadeUp>

      {/* Penjelasan auto-save */}
      {autoTip && (
        <FadeUp delay={0.1} className="lg:col-span-2">
          <Card className="rounded-xl gap-4 border-emerald-600/20 bg-emerald-500/[0.03]">
            <CardHeader className="px-6 pb-0 pt-6">
              <CardTitle className="flex items-center gap-2 text-base">
                <Info className="size-5 text-emerald-600" aria-hidden />
                Bagaimana data GUNARA OS tersimpan? (jawaban atas &ldquo;kalau aku tambahkan saat situs terinstall, tersave tidak?&rdquo;)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Ya, tersave otomatis — permanen.</strong> Setiap kali Anda menekan
                tombol Tambah / Simpan di modul mana pun (keuangan, klien, SEO, dll.), data dikirim ke API dan
                ditulis ke <strong className="text-foreground">database SQLite di server</strong> (file{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">db/custom.db</code> via Prisma ORM). Browser
                hanyalah etalase: tutup tab, matikan laptop, ganti HP — data tetap utuh di server.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-background p-3">
                  <p className="font-semibold text-foreground">1 · Tersimpan otomatis</p>
                  <p className="mt-1 text-xs">Tulis → API → database. Tanpa tombol save terpisah, tanpa localStorage.</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="font-semibold text-foreground">2 · Berpindah perangkat</p>
                  <p className="mt-1 text-xs">Buka situs dari HP/laptop lain → data sama, karena sumbernya satu: server.</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="font-semibold text-foreground">3 · Anti-hilang total</p>
                  <p className="mt-1 text-xs">Ekspor backup JSON rutin (tombol di atas) → bila server bermasalah, restore kembali.</p>
                </div>
              </div>
              <p className="flex items-start gap-2 text-xs">
                <PackageOpen className="mt-0.5 size-4 flex-none text-amber-600" aria-hidden />
                <span>Satu-satunya skenario data hilang: file database di server terhapus (mis. reinstall). Solusinya justru fitur ini — ekspor rutin, impor kapan pun. Tab <strong>Panduan Deploy</strong> menjelaskan langkah migrasi hosting.</span>
              </p>
            </CardContent>
          </Card>
        </FadeUp>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TAB 2 — DIAGNOSTIK (HEALTH CHECK + UJI ENDPOINT)
// ═══════════════════════════════════════════════════════════════════
function HealthTab({ toast }: { toast: ReturnType<typeof useToast>["toast"] }) {
  const [running, setRunning] = useState(false);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [probes, setProbes] = useState<ProbeResult[]>([]);
  const [probeProgress, setProbeProgress] = useState(0);

  const runCheck = useCallback(async () => {
    setRunning(true);
    setHealth(null);
    setProbes([]);
    setProbeProgress(0);
    try {
      // 1) Health server
      const res = await fetch("/api/health", { cache: "no-store" });
      const json = (await res.json()) as HealthData;
      setHealth(json);

      // 2) Probe seluruh endpoint penting (kajian link — bukan cuma health DB)
      const results: ProbeResult[] = [];
      for (let i = 0; i < PROBE_ENDPOINTS.length; i++) {
        const path = PROBE_ENDPOINTS[i];
        const t0 = performance.now();
        try {
          const r = await fetch(path, { cache: "no-store" });
          results.push({ path, status: r.status, ms: Math.round(performance.now() - t0), ok: r.ok });
        } catch {
          results.push({ path, status: null, ms: null, ok: false });
        }
        setProbes([...results]);
        setProbeProgress(Math.round(((i + 1) / PROBE_ENDPOINTS.length) * 100));
      }

      const allOk = json.dbOk && results.every((r) => r.ok);
      toast({
        title: allOk ? "🩺 Semua sistem SEHAT" : "⚠️ Ada masalah terdeteksi",
        description: allOk
          ? `${PROBE_ENDPOINTS.length} endpoint + database semuanya OK.`
          : "Periksa daftar merah di bawah — endpoint yang gagal ditandai.",
        variant: allOk ? "default" : "destructive",
      });
    } catch (e) {
      toast({ title: "Health check gagal dijalankan", description: String(e), variant: "destructive" });
    } finally {
      setRunning(false);
    }
  }, [toast]);

  const okCount = probes.filter((p) => p.ok).length;

  return (
    <div className="space-y-4">
      <FadeUp>
        <Card className="rounded-xl gap-4">
          <CardHeader className="px-6 pb-0 pt-6">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="size-5 text-rose-600" aria-hidden />
              Diagnostik Kesehatan Sistem
            </CardTitle>
            <CardDescription>
              Satu klik untuk memeriksa: koneksi database, integritas 38 tabel, memori &amp; uptime server,
              <strong> plus uji respons {PROBE_ENDPOINTS.length} endpoint API</strong> — persis seperti audit link,
              bisa dijalankan ulang kapan pun setelah situs terinstall di hosting baru.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3 px-6 pb-6">
            <Button onClick={runCheck} disabled={running} size="lg" className="bg-rose-700 text-white hover:bg-rose-800">
              {running ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              {running ? "Memeriksa sistem…" : "🩺 Jalankan Health Check"}
            </Button>
            {running && <Progress value={probeProgress} className="h-1.5 flex-1 min-w-40" aria-label="Kemajuan pemeriksaan" />}
            {!running && probes.length > 0 && (
              <Badge variant={okCount === probes.length ? "default" : "destructive"} className={okCount === probes.length ? "bg-emerald-700" : ""}>
                {okCount}/{probes.length} endpoint OK
              </Badge>
            )}
          </CardContent>
        </Card>
      </FadeUp>

      {running && !health && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      )}

      {health && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Status server */}
          <FadeUp>
            <Card className="h-full rounded-xl gap-4">
              <CardHeader className="px-6 pb-0 pt-6">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ServerCog className="size-5 text-emerald-700 dark:text-emerald-400" aria-hidden />
                  Status Server
                  <Badge variant={health.ok ? "default" : "destructive"} className={health.ok ? "bg-emerald-700" : ""}>
                    {health.ok ? "SEHAT" : "PERLU PERHATIAN"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6">
                <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  {[
                    { l: "Versi", v: `v${health.version || "?"}` },
                    { l: "Lingkungan", v: health.env || "-" },
                    { l: "Memori", v: `${health.memoryMb ?? 0} MB` },
                    { l: "Uptime", v: `${Math.floor((health.uptimeSec || 0) / 60)} mnt` },
                  ].map((s) => (
                    <div key={s.l} className="rounded-lg border bg-muted/30 p-2.5">
                      <p className="text-muted-foreground">{s.l}</p>
                      <p className="font-bold tabular-nums">{s.v}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-1.5">
                  {(health.checks || []).map((c) => (
                    <li key={c.name} className="flex items-start gap-2 rounded-lg border p-2.5 text-xs">
                      {c.ok
                        ? <CheckCircle2 className="mt-0.5 size-4 flex-none text-emerald-600" aria-hidden />
                        : (c.name.startsWith("Kunci") || c.name.startsWith("Data bawaan")
                            ? <Info className="mt-0.5 size-4 flex-none text-amber-500" aria-hidden />
                            : <XCircle className="mt-0.5 size-4 flex-none text-rose-600" aria-hidden />)}
                      <span><strong>{c.name}</strong> — <span className="text-muted-foreground">{c.detail}</span></span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeUp>

          {/* Hasil probe endpoint */}
          <FadeUp delay={0.06}>
            <Card className="h-full rounded-xl gap-4">
              <CardHeader className="px-6 pb-0 pt-6">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe2 className="size-5 text-sky-700 dark:text-sky-400" aria-hidden />
                  Kajian Link — Respons Endpoint API
                </CardTitle>
                <CardDescription>Semua jalur data yang dipakai modul GUNARA OS, diuji langsung dari browser Anda.</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                {probes.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Belum diuji — tekan tombol Health Check.</p>
                ) : (
                  <div className="max-h-72 overflow-y-auto nice-scroll rounded-lg border">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-muted/95 backdrop-blur">
                        <tr className="text-left text-muted-foreground">
                          <th className="px-3 py-2 font-semibold">Endpoint</th>
                          <th className="px-3 py-2 font-semibold">Status</th>
                          <th className="px-3 py-2 text-right font-semibold">Waktu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {probes.map((p) => (
                          <tr key={p.path} className="border-t">
                            <td className="px-3 py-1.5 font-mono">{p.path}</td>
                            <td className="px-3 py-1.5">
                              {p.ok
                                ? <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-3.5" /> {p.status}</span>
                                : <span className="inline-flex items-center gap-1 font-semibold text-rose-600"><XCircle className="size-3.5" /> {p.status ?? "gagal"}</span>}
                            </td>
                            <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">{p.ms ?? "—"} ms</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeUp>

          {/* Hitungan per tabel */}
          {health.counts && (
            <FadeUp delay={0.1} className="lg:col-span-2">
              <Card className="rounded-xl gap-4">
                <CardHeader className="px-6 pb-0 pt-6">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DatabaseBackup className="size-5 text-emerald-700 dark:text-emerald-400" aria-hidden />
                    Isi Database — {health.totalRows?.toLocaleString("id-ID") || 0} baris total
                  </CardTitle>
                  <CardDescription>Bukti nyata data Anda tersimpan di server. Angka naik setiap kali Anda menambah data.</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="grid max-h-80 grid-cols-2 gap-1.5 overflow-y-auto nice-scroll sm:grid-cols-3 lg:grid-cols-5">
                    {Object.entries(health.counts).map(([k, n]) => (
                      <div key={k} className="flex items-center justify-between rounded-lg border bg-muted/20 px-2.5 py-1.5 text-xs">
                        <span className="truncate text-muted-foreground">{LABEL_ID[k] || k}</span>
                        <span className="ml-2 font-bold tabular-nums">{n < 0 ? "!" : n}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TAB 3 — PANDUAN DEPLOY
// ═══════════════════════════════════════════════════════════════════
function Code({ children }: { children: string }) {
  return (
    <pre className="nice-scroll overflow-x-auto rounded-lg border bg-emerald-950 p-3 text-[11px] leading-relaxed text-emerald-100">
      <code>{children}</code>
    </pre>
  );
}

function DeployTab() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FadeUp>
        <Card className="h-full rounded-xl gap-4">
          <CardHeader className="px-6 pb-0 pt-6">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="size-5 text-emerald-700 dark:text-emerald-400" aria-hidden />
              1 · Memahami Penyimpanan Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-6 pb-6 text-sm text-muted-foreground">
            <p>Semua data GUNARA OS hidup di <strong className="text-foreground">satu file database</strong> di server:</p>
            <Code>db/custom.db   ← database SQLite (Prisma ORM)</Code>
            <ul className="list-disc space-y-1.5 pl-5 text-xs">
              <li>Tombol Tambah/Simpan → API → langsung tertulis ke file ini. <strong>Tidak ada draft yang hanya ada di browser.</strong></li>
              <li>Backup = mengamankan file ini, atau ekspor JSON via tab Backup &amp; Restore.</li>
              <li>Migrasi hosting = bawa file ini (atau restore JSON) ke server baru.</li>
              <li>Field rahasia brankas dienkripsi AES-256-GCM — kuncinya env <code className="rounded bg-muted px-1 py-0.5">GUNARA_VAULT_KEY</code>. Bila migrasi, pakai kunci yang sama agar sandi tetap terbaca.</li>
            </ul>
          </CardContent>
        </Card>
      </FadeUp>

      <FadeUp delay={0.05}>
        <Card className="h-full rounded-xl gap-4">
          <CardHeader className="px-6 pb-0 pt-6">
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe2 className="size-5 text-sky-700 dark:text-sky-400" aria-hidden />
              2 · Install di Hosting Baru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-6 pb-6 text-sm text-muted-foreground">
            <p className="text-xs">Syarat: Node.js 20+ / Bun, akses terminal (VPS, Plesk, Railway, dsb.).</p>
            <Code>{`# 1. Unggah kode proyek ke server
# 2. Install dependensi
bun install        # atau: npm install

# 3. Siapkan database (skema + tabel)
bun run db:push

# 4. (Sangat disarankan) kunci enkripsi brankas
#    buat string acak min. 32 karakter:
GUNARA_VAULT_KEY="ganti-dengan-kunci-rahasia-anda"

# 5. Jalankan
bun run build && bun run start`}</Code>
            <p className="text-xs">
              Bila menggunakan panel yang menyediakan Node app: set <code className="rounded bg-muted px-1 py-0.5">Start command</code> ={" "}
              <code className="rounded bg-muted px-1 py-0.5">bun run start</code> (atau <code className="rounded bg-muted px-1 py-0.5">npm run start</code>).
            </p>
          </CardContent>
        </Card>
      </FadeUp>

      <FadeUp delay={0.1}>
        <Card className="h-full rounded-xl gap-4">
          <CardHeader className="px-6 pb-0 pt-6">
            <CardTitle className="flex items-center gap-2 text-base">
              <HardDriveDownload className="size-5 text-amber-600" aria-hidden />
              3 · Memindahkan Data ke Server Baru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-6 pb-6 text-sm text-muted-foreground">
            <p className="text-xs"><strong className="text-foreground">Cara A — file database</strong> (paling cepat):</p>
            <Code>{`# di server lama
cp db/custom.db /tmp/backup-custom.db

# unggah ke server baru, letakkan di:
db/custom.db`}</Code>
            <p className="text-xs"><strong className="text-foreground">Cara B — JSON backup</strong> (lebih aman lintas versi):</p>
            <ol className="list-decimal space-y-1 pl-5 text-xs">
              <li>Di server lama: buka <strong>Data Vault → Backup &amp; Restore → Unduh Backup Lengkap</strong>.</li>
              <li>Di server baru: install situs (langkah 2 di atas) lalu buka halaman yang sama.</li>
              <li>Pilih file → mode <strong>Gabung</strong> → Mulai Restore.</li>
            </ol>
          </CardContent>
        </Card>
      </FadeUp>

      <FadeUp delay={0.15}>
        <Card className="h-full rounded-xl gap-4">
          <CardHeader className="px-6 pb-0 pt-6">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="size-5 text-emerald-700 dark:text-emerald-400" aria-hidden />
              4 · Checklist Pascadeploy (5 Menit)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Buka tab <strong>Diagnostik</strong> → Jalankan Health Check → pastikan semua endpoint hijau.</li>
              <li>Tambahkan satu data uji di modul mana pun (mis. Backlog) → muat ulang halaman → pastikan masih ada (bukti tersimpan).</li>
              <li>Restore data lama bila ini migrasi (tab Backup &amp; Restore).</li>
              <li>Set env <code className="rounded bg-muted px-1 py-0.5">GUNARA_VAULT_KEY</code> sama dengan server lama agar sandi brankas terbaca.</li>
              <li>Aktifkan backup rutin: unduh JSON tiap akhir pekan.</li>
            </ol>
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
              <TriangleAlert className="mt-0.5 size-4 flex-none text-amber-600" aria-hidden />
              <span>Website ini berstandard internasional: metadata lengkap (OpenGraph, Twitter Card, JSON-LD, hreflang), robots.txt ramah AI-crawler, sitemap, manifest PWA, dan aksesibilitas WCAG (skip link, aria, kontras). Semua sudah terpasang otomatis — tidak perlu diatur ulang saat deploy.</span>
            </div>
          </CardContent>
        </Card>
      </FadeUp>
    </div>
  );
}
