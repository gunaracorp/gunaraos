"use client";

// ═══════════════════════════════════════════════════════════════
// 🏭 USAHASIAP OS — Compliance to Revenue
// Sumber kebenaran: USMR-001 Master Document Register v1.0
// by Gugun Gunara — Muhammad Lutfi Azmi
// ═══════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import {
  Factory, Github, ShieldCheck, FileCheck2, Rocket, TrendingUp, AlertTriangle,
  ChevronDown, ChevronRight, Search, ListChecks, Save, BookOpenText, CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FadeUp, Stagger, StaggerItem, HoverLift } from "./motion";
import { useRecords } from "./use-records";
import {
  USA_DOCUMENTS, USA_DOMAINS, USA_VOLUMES, USA_PIPELINE, USA_GATES,
  USA_WAVES, USA_GUARDRAIL, USA_RISKS, USA_PRIORITAS_14, USA_STATUS,
} from "@/lib/usahasiap";

const BOBOT: { test: (s: string) => boolean; nilai: number; label: string }[] = [
  { test: (s) => s.startsWith("APPROVED"), nilai: 1, label: "Approved" },
  { test: (s) => s.startsWith("IN REVIEW"), nilai: 0.7, label: "Review" },
  { test: (s) => s.startsWith("DRAFT"), nilai: 0.4, label: "Draft" },
];

function bobotStatus(status: string): number {
  const b = BOBOT.find((b) => b.test(status));
  return b ? b.nilai : 0;
}

function StatusBadge({ status }: { status: string }) {
  const n = bobotStatus(status);
  const cls =
    n >= 1 ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
    : n >= 0.7 ? "bg-blue-500/15 text-blue-700 dark:text-blue-400"
    : n >= 0.4 ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
    : "bg-muted text-muted-foreground";
  return <Badge className={`text-[10px] ${cls}`}>{status}</Badge>;
}

export function UsaSiapSection() {
  const { items, loading, refresh, update } = useRecords<any>("usaDocument");
  const [q, setQ] = useState("");
  const [fDomain, setFDomain] = useState<string>("ALL");
  const [fWave, setFWave] = useState<string>("ALL");
  const [fStatus, setFStatus] = useState<string>("ALL");
  const [open, setOpen] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<Record<string, string>>({});
  const [draftCatatan, setDraftCatatan] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const docs = items.length ? items : USA_DOCUMENTS;

  const stats = useMemo(() => {
    const total = docs.length || 45;
    const progres = docs.reduce((a: number, d: any) => a + bobotStatus(d.status || ""), 0);
    return {
      total,
      domain: USA_DOMAINS.length,
      volume: USA_VOLUMES.length,
      progres: total ? Math.round((progres / total) * 100) : 0,
    };
  }, [docs]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (docs as any[]).filter((d) => {
      if (fDomain !== "ALL" && d.domain !== fDomain) return false;
      if (fWave !== "ALL" && String(d.gelombang) !== fWave) return false;
      if (fStatus !== "ALL" && d.status !== fStatus) return false;
      if (!needle) return true;
      return [d.kode, d.nama, d.pgaRef, d.ownerRole, d.output]
        .join(" ").toLowerCase().includes(needle);
    });
  }, [docs, q, fDomain, fWave, fStatus]);

  const domainProgress = useMemo(() => {
    const map: Record<string, { total: number; progres: number }> = {};
    for (const d of docs as any[]) {
      map[d.domain] = map[d.domain] || { total: 0, progres: 0 };
      map[d.domain].total += 1;
      map[d.domain].progres += bobotStatus(d.status || "");
    }
    return map;
  }, [docs]);

  const waveProgress = useMemo(() => {
    const map: Record<number, { total: number; progres: number }> = {};
    for (const d of docs as any[]) {
      map[d.gelombang] = map[d.gelombang] || { total: 0, progres: 0 };
      map[d.gelombang].total += 1;
      map[d.gelombang].progres += bobotStatus(d.status || "");
    }
    return map;
  }, [docs]);

  const simpan = async (kode: string) => {
    setSaving(kode);
    try {
      await update(kode, {
        status: draftStatus[kode] ?? (docs as any[]).find((d) => d.kode === kode)?.status,
        catatan: draftCatatan[kode] ?? (docs as any[]).find((d) => d.kode === kode)?.catatan ?? "",
      });
      toast.success(`${kode} tersimpan permanen`, { description: "Status & catatan tercatat di database." });
      refresh();
    } catch (e: any) {
      toast.error("Gagal menyimpan", { description: String(e?.message || e) });
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 lg:p-6">
      {/* ── HERO VISI (USA-01 DRAFT v0.3) ── */}
      <FadeUp>
        <Card className="overflow-hidden border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-emerald-500/5 to-transparent">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Factory className="size-5 text-blue-500" />
              <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400">USMR-001 v1.0 · BASELINE 31 OKT 2026</Badge>
              <Badge variant="outline" className="text-xs">45 Controlled Documents · 9 Domain · PGA165</Badge>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight lg:text-3xl">UsahaSiap — Compliance to Revenue OS</h1>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Membangun sistem operasi bisnis tepercaya: kecerdasan usaha, kepatuhan terdokumentasi,
                dan peluang perdagangan lintas negara — dari <b>compliance</b> yang rapi menjadi <b>revenue</b> yang nyata.
                Visi bersumber dari <b>USA-01 Vision Statement (DRAFT v0.3)</b>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a href="https://github.com/gunaracorp/usahasiap-compliance-to-revenue-os" target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline"><Github className="mr-2 size-4" /> Repo GitHub</Button>
              </a>
              <span className="text-[11px] text-muted-foreground">
                by Gugun Gunara — Muhammad Lutfi Azmi · didukung PT Top Konsultan Internasional + PT Digital Bisnis Manajemen
              </span>
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      {/* ── STATISTIK LIVE ── */}
      <Stagger className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Dokumen Terkendali", value: stats.total, icon: FileCheck2 },
          { label: "Domain", value: stats.domain, icon: ListChecks },
          { label: "Master Volume", value: stats.volume, icon: BookOpenText },
          { label: "Progres Berbobot", value: `${stats.progres}%`, icon: TrendingUp },
        ].map((s) => (
          <StaggerItem key={s.label}>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-lg bg-emerald-500/10 p-2.5"><s.icon className="size-5 text-emerald-600 dark:text-emerald-400" /></div>
                <div>
                  <div className="text-xl font-black tabular-nums">{loading ? "…" : s.value}</div>
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      {/* ── PIPELINE COMPLIANCE → REVENUE ── */}
      <FadeUp>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Pipeline Compliance → Revenue</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-5">
              {USA_PIPELINE.map((p, i) => (
                <div key={p.no} className="relative rounded-lg border bg-background/60 p-3">
                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">TAHAP {p.no}</div>
                  <div className="text-sm font-bold">{p.nama}</div>
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{p.desc}</p>
                  {i < USA_PIPELINE.length - 1 && (
                    <ChevronRight className="absolute -right-2.5 top-1/2 hidden size-4 -translate-y-1/2 text-muted-foreground md:block" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      {/* ── 5 MASTER VOLUME + REGISTER ── */}
      <FadeUp>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">5 Master Volume + Master Register</CardTitle></CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-3">
            {USA_VOLUMES.map((v) => (
              <div key={v.id} className="rounded-lg border bg-background/60 p-3">
                <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{v.id}</div>
                <div className="text-sm font-bold leading-snug">{v.nama}</div>
                <p className="mt-1 text-[11px] text-muted-foreground">{v.peran}</p>
                <div className="mt-1.5 text-[10px] text-muted-foreground/80">{v.cakupan}</div>
              </div>
            ))}
            <div className="rounded-lg border-2 border-blue-500/40 bg-blue-500/5 p-3">
              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">USMR-001</div>
              <div className="text-sm font-bold">Master Document Register v1.0</div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Sumber kebenaran ID, status, owner-role, dan review — yang ditampilkan di explorer bawah.
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      {/* ── REGISTER EXPLORER ── */}
      <FadeUp>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base"><Search className="size-4" /> Register Explorer — 45 Dokumen (tersimpan di database)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 md:grid-cols-4">
              <Input placeholder="Cari kode / nama / PGA / owner / output…" value={q} onChange={(e) => setQ(e.target.value)} className="md:col-span-1" />
              <Select value={fDomain} onValueChange={setFDomain}>
                <SelectTrigger><SelectValue placeholder="Domain" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Domain</SelectItem>
                  {USA_DOMAINS.map((d) => (
                    <SelectItem key={d.kode} value={d.kode}>{d.kode} — {d.nama}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={fWave} onValueChange={setFWave}>
                <SelectTrigger><SelectValue placeholder="Gelombang" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Gelombang</SelectItem>
                  {[1, 2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>Gelombang {n}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={fStatus} onValueChange={setFStatus}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  {USA_STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="text-xs text-muted-foreground">{filtered.length} / {(docs as any[]).length} dokumen</div>

            <div className="divide-y rounded-lg border">
              {filtered.map((d) => {
                const isOpen = open === d.kode;
                return (
                  <div key={d.kode}>
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-muted/50"
                      onClick={() => { setOpen(isOpen ? null : d.kode); setDraftStatus((s) => ({ ...s, [d.kode]: d.status })); setDraftCatatan((s) => ({ ...s, [d.kode]: d.catatan || "" })); }}
                    >
                      {isOpen ? <ChevronDown className="size-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
                      <span className="w-16 shrink-0 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{d.kode}</span>
                      <span className="min-w-0 flex-1 truncate text-sm">{d.nama}</span>
                      <Badge variant="outline" className="hidden text-[10px] sm:inline">G{d.gelombang}</Badge>
                      <StatusBadge status={d.status} />
                    </button>
                    {isOpen && (
                      <div className="space-y-3 bg-muted/30 px-4 py-3 text-xs">
                        <div className="grid gap-2 md:grid-cols-2">
                          <div><span className="font-semibold">PGA165:</span> {d.pgaRef}</div>
                          <div><span className="font-semibold">Owner-role:</span> {d.ownerRole}</div>
                          <div><span className="font-semibold">Reviewer:</span> {d.reviewer}</div>
                          <div><span className="font-semibold">Dependensi:</span> {d.dependensi || "—"}</div>
                        </div>
                        <div><span className="font-semibold">Keluaran minimum:</span> {d.output}</div>
                        <div className="grid gap-2 md:grid-cols-[200px_1fr]">
                          <Select value={draftStatus[d.kode] ?? d.status} onValueChange={(v) => setDraftStatus((s) => ({ ...s, [d.kode]: v }))}>
                            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {USA_STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Textarea
                              placeholder="Catatan progres…"
                              className="min-h-[36px] rows-1"
                              value={draftCatatan[d.kode] ?? d.catatan ?? ""}
                              onChange={(e) => setDraftCatatan((s) => ({ ...s, [d.kode]: e.target.value }))}
                            />
                            <Button size="sm" onClick={() => simpan(d.kode)} disabled={saving === d.kode}>
                              <Save className="mr-1 size-4" /> {saving === d.kode ? "…" : "Simpan"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      {/* ── 9 DOMAIN CARDS ── */}
      <FadeUp>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">9 Domain — Progres Live (klik untuk filter explorer)</CardTitle></CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {USA_DOMAINS.map((dom) => {
              const p = domainProgress[dom.kode] || { total: dom.jumlah, progres: 0 };
              const pct = p.total ? Math.round((p.progres / p.total) * 100) : 0;
              return (
                <HoverLift key={dom.kode} onClick={() => { setFDomain(dom.kode); setOpen(null); }}>
                  <div className={`cursor-pointer rounded-lg border p-3 ${fDomain === dom.kode ? "border-blue-500/60 bg-blue-500/5" : ""}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{dom.kode} — {dom.nama}</span>
                      <span className="text-xs font-bold tabular-nums">{pct}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-1 text-[10px] text-muted-foreground">{dom.rentang} · {dom.jumlah} dokumen</div>
                  </div>
                </HoverLift>
              );
            })}
          </CardContent>
        </Card>
      </FadeUp>

      {/* ── GATES & WAVES ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <FadeUp>
          <Card className="h-full">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Rocket className="size-4" /> 5 Stage Gates</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {USA_GATES.map((g) => (
                <div key={g.no} className="rounded-lg border bg-background/60 p-3">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">GATE {g.no} — {g.nama}</div>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{g.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeUp>
        <FadeUp>
          <Card className="h-full">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="size-4" /> 5 Gelombang Pengerjaan</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {USA_WAVES.map((w) => {
                const p = waveProgress[w.no] || { total: 0, progres: 0 };
                const pct = p.total ? Math.round((p.progres / p.total) * 100) : 0;
                return (
                  <div key={w.no} className="rounded-lg border bg-background/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">GELOMBANG {w.no} · {w.rentang}</span>
                      <span className="text-[10px] font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{pct}%</span>
                    </div>
                    <div className="mt-1 text-[11px] text-muted-foreground">{w.fokus}</div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      {/* ── GUARDRAIL · RISIKO · PRIORITAS 14 HARI ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <FadeUp>
          <Card className="h-full">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="size-4" /> Guardrail Janji</CardTitle></CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {USA_GUARDRAIL.boleh.map((b) => <div key={b}>✅ {b}</div>)}
              <div className="pt-1" />
              {USA_GUARDRAIL.larang.map((b) => <div key={b} className="text-muted-foreground">🚫 {b}</div>)}
            </CardContent>
          </Card>
        </FadeUp>
        <FadeUp>
          <Card className="h-full">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="size-4" /> 6 Risiko Utama</CardTitle></CardHeader>
            <CardContent className="space-y-1.5 text-xs text-muted-foreground">
              {USA_RISKS.map((r, i) => <div key={r}>{i + 1}. {r}</div>)}
            </CardContent>
          </Card>
        </FadeUp>
        <FadeUp>
          <Card className="h-full">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="size-4" /> Prioritas 14 Hari Pertama</CardTitle></CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              {USA_PRIORITAS_14.map((p, i) => <div key={p}>{i + 1}. {p}</div>)}
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      <FadeUp>
        <p className="rounded-lg border bg-muted/30 p-3 text-[11px] leading-relaxed text-muted-foreground">
          <b>Sumber kebenaran:</b> USMR-001 Master Document Register v1.0 (baseline 31 Oktober 2026) + USM-00..04 dari
          repo github.com/gunaracorp/usahasiap-compliance-to-revenue-os. Register ini mengendalikan identitas & status
          dokumen; dokumen USA menjadi sumber rinci. Alat ini <b>bukan pengganti</b> OSS/regulator/nasihat hukum — keputusan
          final tetap pada owner dan reviewer kompeten.
        </p>
      </FadeUp>
    </div>
  );
}
