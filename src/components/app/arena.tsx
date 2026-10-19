"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v7.0 — GOD MODE · ARENA DEBAT DEWAN
// 2–4 dewan dipilih → saling berdebat 2 ronde (posisi awal → serangan
// silang) → Master Polymath · Sage Universal · Ultimate Problem Solver
// mengarbitrase → verdict final. Dialektika, bukan pujian.
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import {
  Swords, Sparkles, Loader2, Copy, History, Trash2, ChevronDown, Check,
  Gavel, ShieldCheck,
} from "lucide-react";
import { DEWAN, COUNCIL_GROUPS, KATEGORI_REKOMENDASI, councilsByIds, TOTAL_YEARS, type CouncilGroup } from "@/lib/dewan";
import { FadeUp, EASE } from "./motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const TOPIK: { id: string; label: string }[] = [
  { id: "bisnis", label: "💼 Bisnis" },
  { id: "keuangan", label: "💰 Keuangan" },
  { id: "hukum", label: "⚖️ Hukum & Izin" },
  { id: "teknologi", label: "🖥️ Teknologi" },
  { id: "marketing", label: "📣 Marketing" },
  { id: "sdm", label: "👥 SDM & Tim" },
  { id: "operasional", label: "⚙️ Operasional" },
  { id: "hidup", label: "🏡 Hidup & Keluarga" },
  { id: "umum", label: "🌐 Umum" },
];

const RITUAL_ARENA = [
  "Membuka gerbang arena… menimbang posisi para dewan…",
  "Dewan-dewan saling menatap. Argumen mulai dipedang…",
  "Ronde 1 — posisi awal dibacakan dengan tinta emas…",
  "Ronde 2 — serangan silang! Titik terlemah diburu…",
  "Master Polymath memetakan pola argumen…",
  "Sage Universal menimbang orde kedua setiap klaim…",
  "Ultimate Problem Solver siap mengarbitrase…",
];

interface Debate {
  id: string;
  problem: string;
  topik: string;
  dewan: string;
  transkrip: string;
  putusan: string;
  ronde: number;
  createdAt: string;
}

/* Renderer markdown bersama untuk transkrip & putusan */
function mdComponents(verdict = false) {
  return {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h3 className={cn(
        "mt-5 mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wide first:mt-0",
        verdict ? "text-amber-700 dark:text-amber-400" : "text-emerald-900 dark:text-emerald-300"
      )}>
        <span className={cn("h-4 w-1 rounded-full inline-block", verdict ? "bg-amber-500" : "bg-amber-400")} />{children}
      </h3>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="mt-4 mb-1.5 text-xs font-black text-foreground">{children}</h4>
    ),
    p: ({ children }: { children?: React.ReactNode }) => <p className="my-2 text-[13px] leading-relaxed">{children}</p>,
    ul: ({ children }: { children?: React.ReactNode }) => <ul className="my-2 space-y-1.5">{children}</ul>,
    ol: ({ children }: { children?: React.ReactNode }) => <ol className="my-2 space-y-1.5 list-decimal list-inside">{children}</ol>,
    li: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex items-start gap-2 text-[13px] leading-relaxed">
        <span className="mt-[7px] size-1.5 flex-none rounded-full bg-emerald-600 dark:bg-emerald-400" />
        <span className="min-w-0 [&>ol]:mt-1 [&>ul]:mt-1">{children}</span>
      </li>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold text-foreground">{children}</strong>,
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-3 border-l-4 border-amber-400 bg-amber-400/5 px-3 py-2 text-[13px] italic">{children}</blockquote>
    ),
    hr: () => <hr className="my-4 border-dashed" />,
  };
}

export function ArenaSection() {
  const reduce = useReducedMotion();
  const { toast } = useToast();

  const [problem, setProblem] = useState("");
  const [topik, setTopik] = useState("bisnis");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [ritual, setRitual] = useState(0);
  const [debate, setDebate] = useState<Debate | null>(null);
  const [history, setHistory] = useState<Debate[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const selectedCouncils = useMemo(() => councilsByIds(selected), [selected]);
  const totalTahunPeserta = selectedCouncils.reduce((a, c) => a + c.years, 0);

  useEffect(() => { loadHistory(); }, []);

  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setRitual((r) => (r + 1) % RITUAL_ARENA.length), 2600);
    return () => clearInterval(t);
  }, [loading]);

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/arena");
      const data = await res.json();
      setHistory(data.items || []);
    } catch { /* offline — abaikan */ }
  };

  const toggleCouncil = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : s.length >= 4 ? s : [...s, id]
    );

  const autoPick = () => {
    const rec = KATEGORI_REKOMENDASI[topik] || KATEGORI_REKOMENDASI.umum;
    const pick = rec.slice(0, 3);
    setSelected(pick);
    toast({ title: "3 dewan dipanggil ke arena", description: "Sudut pandang paling berlawanan untuk topik ini." });
  };

  const debatkan = async () => {
    if (problem.trim().length < 10) {
      toast({ title: "Ceritakan lebih detail", description: "Permasalahan minimal 10 karakter agar arena bisa dipanaskan.", variant: "destructive" });
      return;
    }
    if (selected.length < 2) {
      toast({ title: "Pilih minimal 2 dewan", description: "Arena debat butuh setidaknya dua sudut pandang yang berlawanan.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setRitual(0);
    try {
      const res = await fetch("/api/arena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, topik, dewan: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Arena gagal dipanggil");
      setDebate(data.item);
      loadHistory();
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    } catch (e) {
      toast({ title: "Arena gagal dipanggil", description: String(e instanceof Error ? e.message : e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const salin = async () => {
    if (!debate) return;
    try {
      await navigator.clipboard.writeText(
        debate.transkrip + (debate.putusan ? "\n\n" + debate.putusan : "")
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* abaikan */ }
  };

  const hapusRiwayat = async (id: string) => {
    try {
      await fetch(`/api/arena?id=${id}`, { method: "DELETE" });
      setHistory((h) => h.filter((x) => x.id !== id));
      if (debate?.id === id) setDebate(null);
    } catch { /* abaikan */ }
  };

  const bukaRiwayat = (d: Debate) => {
    setDebate(d);
    setProblem(d.problem);
    setTopik(d.topik);
    try { setSelected(JSON.parse(d.dewan || "[]")); } catch { setSelected([]); }
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-950 via-[#1a231e] to-emerald-950 p-6 sm:p-8 text-emerald-50">
          <motion.div
            aria-hidden
            animate={reduce ? {} : { rotate: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
            className="absolute -right-8 -top-10 opacity-[0.06]"
          >
            <Swords className="size-56" />
          </motion.div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/90">GUNARA OS v7.0 — GOD MODE</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-amber-100">⚔️ ARENA DEBAT DEWAN</h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/80 leading-relaxed">
            Pilih 2–4 dewan dari 46 dewan ({TOTAL_YEARS.toLocaleString("id-ID")} tahun kolektif) — biarkan mereka
            <strong className="text-amber-200"> saling berdebat</strong>: posisi awal, serangan silang, lalu
            Master Polymath · Sage Universal · The Ultimate Problem Solver turun mengarbitrase. Kebenaran lahir
            dari dialektika, bukan pujian.
          </p>
        </div>
      </FadeUp>

      <div className="grid gap-5 lg:grid-cols-[440px,1fr] items-start">
        {/* ── Form Arena ── */}
        <FadeUp delay={0.05}>
          <div className="rounded-xl border bg-card p-5 space-y-4 lg:sticky lg:top-20">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground" htmlFor="arena-problem">
                1 · Permasalahan yang Dipertikaikan
              </label>
              <Textarea
                id="arena-problem"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Contoh: Saya punya Rp 20 juta kas bebas — dipakai buat marketing agresif bulan ini, atau disimpan sebagai benteng 6 bulan? Debatkan."
                className="mt-2 min-h-[110px] resize-y"
                maxLength={6000}
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground tabular-nums">{problem.length}/6000</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">2 · Topik</p>
              <div className="flex flex-wrap gap-1.5">
                {TOPIK.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTopik(t.id)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                      topik === t.id
                        ? "bg-emerald-800 text-amber-200 border-emerald-700"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  3 · Dewan Peserta <span className="tabular-nums">({selected.length}/4 — min. 2)</span>
                </p>
                <button
                  onClick={autoPick}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  <Sparkles className="size-3" /> Pilih otomatis
                </button>
              </div>
              {selected.length > 0 && (
                <div className="mb-2 flex flex-wrap items-center gap-1">
                  {selectedCouncils.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => toggleCouncil(c.id)}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-800 text-amber-200 border border-emerald-700 px-2.5 py-1 text-[10px] font-bold"
                      title="Klik untuk melepas"
                    >
                      {c.name} ✕
                    </button>
                  ))}
                  {selectedCouncils.length >= 2 && (
                    <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">
                      = {totalTahunPeserta.toLocaleString("id-ID")} tahun kolektif
                    </span>
                  )}
                </div>
              )}
              <ScrollArea className="h-36 rounded-lg border bg-muted/20">
                <div className="p-2 space-y-2.5">
                  {COUNCIL_GROUPS.map((g: CouncilGroup) => (
                    <div key={g}>
                      <p className="px-1 pb-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70">{g}</p>
                      <div className="flex flex-wrap gap-1">
                        {DEWAN.filter((c) => c.group === g).map((c) => (
                          <button
                            key={c.id}
                            onClick={() => toggleCouncil(c.id)}
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors",
                              selected.includes(c.id)
                                ? "bg-emerald-800 text-amber-200 border-emerald-700"
                                : "bg-background text-muted-foreground hover:bg-muted"
                            )}
                          >
                            {c.no}. {c.name.replace(/^Dewan /, "")}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Button
              onClick={debatkan}
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-amber-200 font-black text-sm tracking-wide shadow-lg"
            >
              {loading ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Swords className="size-4 mr-1.5" />}
              {loading ? "ARENA BERDEBAT…" : "PANGGIL ARENA DEBAT"}
            </Button>
          </div>
        </FadeUp>

        {/* ── Hasil Debat ── */}
        <div ref={resultRef} className="min-w-0">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="rounded-xl border bg-card p-8 text-center"
              >
                <motion.div
                  animate={reduce ? {} : { rotate: [0, -8, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="mx-auto size-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 flex items-center justify-center shadow-lg"
                >
                  <Swords className="size-7 text-amber-300" />
                </motion.div>
                <p className="mt-4 font-black tracking-tight text-emerald-900 dark:text-emerald-100">ARENA SEDANG MEMANAS</p>
                <div className="mt-2 h-5">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={ritual}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs text-muted-foreground"
                    >
                      {RITUAL_ARENA[ritual]}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="mx-auto mt-4 h-1.5 w-56 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-600 to-amber-400"
                    animate={reduce ? {} : { x: ["-100%", "300%"] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            ) : debate ? (
              <div className="space-y-4">
                {/* Transkrip Ronde 1–2 */}
                <motion.article
                  key={debate.id + "-transkrip"}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="rounded-xl border bg-card overflow-hidden"
                >
                  <header className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transkrip Debat — {debate.ronde} Ronde</p>
                      <p className="truncate text-xs text-muted-foreground mt-0.5">
                        {new Date(debate.createdAt).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })} · {debate.topik}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={salin} className="shrink-0">
                      {copied ? <Check className="size-3.5 mr-1 text-emerald-600" /> : <Copy className="size-3.5 mr-1" />}
                      {copied ? "Tersalin" : "Salin"}
                    </Button>
                  </header>
                  <div className="px-5 py-4 max-w-none gunara-md">
                    <ReactMarkdown components={mdComponents(false)}>{debate.transkrip}</ReactMarkdown>
                  </div>
                </motion.article>

                {/* Putusan Arbiter */}
                {debate.putusan && (
                  <motion.article
                    key={debate.id + "-putusan"}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
                    className="rounded-xl border border-amber-500/50 bg-gradient-to-b from-amber-400/[0.04] to-card overflow-hidden shadow-sm"
                  >
                    <header className="border-b border-amber-500/30 bg-amber-400/10 px-5 py-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                        <Gavel className="size-3.5" /> Putusan Arbiter — Master Polymath · Sage Universal · Ultimate Problem Solver
                      </p>
                    </header>
                    <div className="px-5 py-4 max-w-none gunara-md">
                      <ReactMarkdown components={mdComponents(true)}>{debate.putusan}</ReactMarkdown>
                    </div>
                    <footer className="border-t border-amber-500/20 bg-emerald-950 px-5 py-3">
                      <p className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1.5">
                        <ShieldCheck className="size-3.5" /> Diadili dalam Arena Debat — GUNARA OS v7.0 · by Gugun Gunara
                      </p>
                    </footer>
                  </motion.article>
                )}
              </div>
            ) : (
              <motion.div
                key="empty"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="rounded-xl border border-dashed bg-card/60 p-8 text-center"
              >
                <Swords className="mx-auto size-8 text-amber-500" />
                <p className="mt-3 font-bold tracking-tight">Arena masih sepi</p>
                <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">
                  Tulis permasalahan, pilih 2–4 dewan dengan sudut pandang berbeda (mis. Keuangan vs Marketing vs
                  Hukum), lalu panggil arena. Transkrip debat + putusan arbiter akan muncul di sini.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                  {["🥊 Ronde 1 — Posisi awal", "⚔️ Ronde 2 — Serangan silang", "⚖️ Arbitrase 3 persona", "🧭 Eksekusi 48 jam–90 hari"].map((t) => (
                    <span key={t} className="rounded-full border bg-muted/40 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">{t}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Riwayat Debat ── */}
      <FadeUp delay={0.08}>
        <div className="rounded-xl border bg-card">
          <button
            onClick={() => setShowHistory((s) => !s)}
            className="flex w-full items-center justify-between px-5 py-3.5 text-left"
            aria-expanded={showHistory}
          >
            <span className="inline-flex items-center gap-2 text-sm font-bold tracking-tight">
              <History className="size-4 text-emerald-700 dark:text-emerald-400" />
              Arsip Debat <span className="text-muted-foreground font-medium tabular-nums">({history.length})</span>
            </span>
            <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", showHistory && "rotate-180")} />
          </button>
          <AnimatePresence initial={false}>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="border-t px-3 py-3">
                  {history.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">Belum ada debat tersimpan.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {history.map((h) => (
                        <li key={h.id} className="group flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2">
                          <button onClick={() => bukaRiwayat(h)} className="min-w-0 flex-1 text-left">
                            <p className="truncate text-xs font-semibold">{h.problem}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {new Date(h.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })} · {h.topik}
                            </p>
                          </button>
                          <button
                            onClick={() => hapusRiwayat(h.id)}
                            className="flex-none rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                            aria-label="Hapus debat"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeUp>
    </div>
  );
}
