"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v6.0 — ULTIMATE SOLVER
// Ajukan masalah apa pun → Dewan 46 bersidang (AI) → putusan ter-
// struktur: akar masalah, perspektif per dewan, solusi berlapis,
// risiko, dan ritual eksekusi. Persona: Master Polymath · Sage
// Universal · The Ultimate Problem Solver.
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import {
  Gavel, Brain, Sparkles, Loader2, Copy, History, Trash2, ChevronDown,
  ShieldCheck, Wand2, Landmark, Check,
} from "lucide-react";
import { DEWAN, COUNCIL_GROUPS, KATEGORI_REKOMENDASI, councilsByIds, TOTAL_YEARS, type CouncilGroup } from "@/lib/dewan";
import { FadeUp, EASE } from "./motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const KATEGORI: { id: string; label: string }[] = [
  { id: "bisnis", label: "💼 Bisnis" },
  { id: "keuangan", label: "💰 Keuangan" },
  { id: "hukum", label: "⚖️ Hukum & Izin" },
  { id: "teknologi", label: "🖥️ Teknologi" },
  { id: "marketing", label: "📣 Marketing" },
  { id: "sdm", label: "👥 SDM & Tim" },
  { id: "operasional", label: "⚙️ Operasional" },
  { id: "hidup", label: "🏡 Hidup & Keluarga" },
  { id: "spiritual", label: "📿 Spiritual" },
  { id: "umum", label: "🌐 Umum" },
];

const URGENSI = [
  { id: "rutinitas", label: "Rutinitas", desc: "Pertumbuhan & sistem" },
  { id: "krusial", label: "Krusial", desc: "Menentukan kuartal ini" },
  { id: "eksistensial", label: "Eksistensial", desc: "Nyawa dipertaruhkan" },
];

const RITUAL_SIDANG = [
  "Membuka sidang… membaca berkas masalah…",
  "Memanggil para ketua dewan ke ruang sidang…",
  "Analisis akar masalah lintas 12 domain…",
  "Perspektif keuangan, hukum, strategi, dan jiwa disatukan…",
  "Menyusun solusi berlapis 48 jam / 30 hari / 90 hari…",
  "Menimbang risiko dan mendirikan benteng…",
  "Mengetik putusan dengan tinta emas…",
];

interface Consultation {
  id: string;
  problem: string;
  kategori: string;
  urgensi: string;
  dewan: string;
  putusan: string;
  createdAt: string;
}

export function UltimateSolverSection() {
  const reduce = useReducedMotion();
  const { toast } = useToast();

  const [problem, setProblem] = useState("");
  const [kategori, setKategori] = useState("bisnis");
  const [urgensi, setUrgensi] = useState("rutinitas");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [ritual, setRitual] = useState(0);
  const [verdict, setVerdict] = useState<Consultation | null>(null);
  const [history, setHistory] = useState<Consultation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const verdictRef = useRef<HTMLDivElement>(null);

  const selectedCouncils = useMemo(() => councilsByIds(selected), [selected]);

  /* Draft dari Dewan 46 ("Panggil ke Ultimate Solver") */
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem("gunara:solver-draft");
      if (draft) {
        const ids = JSON.parse(draft) as string[];
        setSelected(ids.slice(0, 8));
        sessionStorage.removeItem("gunara:solver-draft");
      }
    } catch { /* abaikan */ }
    loadHistory();
  }, []);

  /* Rotasi kalimat ritual saat sidang berlangsung */
  useEffect(() => {
    if (!loading) return;
    const t = setInterval(() => setRitual((r) => (r + 1) % RITUAL_SIDANG.length), 2600);
    return () => clearInterval(t);
  }, [loading]);

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/solver");
      const data = await res.json();
      setHistory(data.items || []);
    } catch { /* offline — abaikan */ }
  };

  const toggleCouncil = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : s.length >= 8 ? s : [...s, id]
    );

  const autoPick = () => {
    const rec = KATEGORI_REKOMENDASI[kategori] || KATEGORI_REKOMENDASI.umum;
    setSelected(rec.slice(0, 5));
    toast({ title: "Dewan direkomendasikan", description: `${rec.slice(0, 5).length} dewan paling relevan untuk kategori ini.` });
  };

  const sidangkan = async () => {
    if (problem.trim().length < 10) {
      toast({ title: "Ceritakan lebih detail", description: "Masalah minimal 10 karakter agar Dewan bisa bersidang.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setRitual(0);
    try {
      const res = await fetch("/api/solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, kategori, urgensi, dewan: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sidang gagal");
      setVerdict(data.item);
      loadHistory();
      setTimeout(() => verdictRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    } catch (e) {
      toast({ title: "Sidang gagal dipanggil", description: String(e instanceof Error ? e.message : e), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const salin = async () => {
    if (!verdict) return;
    try {
      await navigator.clipboard.writeText(verdict.putusan);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* abaikan */ }
  };

  const hapusRiwayat = async (id: string) => {
    try {
      await fetch(`/api/solver?id=${id}`, { method: "DELETE" });
      setHistory((h) => h.filter((x) => x.id !== id));
      if (verdict?.id === id) setVerdict(null);
    } catch { /* abaikan */ }
  };

  const bukaRiwayat = (c: Consultation) => {
    setVerdict(c);
    setProblem(c.problem);
    setKategori(c.kategori);
    setUrgensi(c.urgensi);
    try { setSelected(JSON.parse(c.dewan || "[]")); } catch { setSelected([]); }
    setTimeout(() => verdictRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const tahunLabel = TOTAL_YEARS.toLocaleString("id-ID");

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-6 sm:p-8 text-emerald-50">
          <div className="absolute -right-8 -top-8 opacity-[0.07]"><Brain className="size-52" /></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/90">GUNARA OS v6.0 — Mesin Putusan</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-amber-100">⚖️ ULTIMATE SOLVER</h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/80 leading-relaxed">
            Master Polymath · Sage Universal · The Ultimate Problem Solver — memimpin {`Dewan 46`} ({tahunLabel} tahun
            pengalaman kolektif). Ajukan masalah apa pun: bisnis, uang, hukum, kode, keluarga, hingga hati. Dewan bersidang
            dan mengeluarkan putusan terstruktur yang bisa langsung dieksekusi.
          </p>
        </div>
      </FadeUp>

      <div className="grid gap-5 lg:grid-cols-[440px,1fr] items-start">
        {/* ── Form Sidang ── */}
        <FadeUp delay={0.05}>
          <div className="rounded-xl border bg-card p-5 space-y-4 lg:sticky lg:top-20">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground" htmlFor="solver-problem">
                1 · Masalah yang Diajukan
              </label>
              <Textarea
                id="solver-problem"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Contoh: Kas perusahaan sempit, piutang macet Rp 45 juta, dan saya harus bayar gaji 5 karyawan tanggal 25. Bagaimana strategi terbaik?"
                className="mt-2 min-h-[110px] resize-y"
                maxLength={6000}
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground tabular-nums">{problem.length}/6000</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">2 · Kategori</p>
              <div className="flex flex-wrap gap-1.5">
                {KATEGORI.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => setKategori(k.id)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                      kategori === k.id
                        ? "bg-emerald-800 text-amber-200 border-emerald-700"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">3 · Tingkat Urgensi</p>
              <div className="grid grid-cols-3 gap-1.5">
                {URGENSI.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setUrgensi(u.id)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-left transition-colors",
                      urgensi === u.id ? "border-amber-500 bg-amber-400/10" : "bg-muted/30 hover:bg-muted/60"
                    )}
                  >
                    <span className="block text-[11px] font-bold">{u.label}</span>
                    <span className="block text-[10px] text-muted-foreground leading-tight">{u.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  4 · Dewan yang Dipanggil <span className="tabular-nums">({selected.length}/8)</span>
                </p>
                <button
                  onClick={autoPick}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  <Wand2 className="size-3" /> Pilih otomatis
                </button>
              </div>
              {selected.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
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
                </div>
              )}
              <ScrollArea className="h-36 rounded-lg border bg-muted/20">
                <div className="p-2 space-y-2.5">
                  {COUNCIL_GROUPS.map((g) => (
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
              onClick={sidangkan}
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-amber-200 font-black text-sm tracking-wide shadow-lg"
            >
              {loading ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Gavel className="size-4 mr-1.5" />}
              {loading ? "DEWAN SEDANG BERSIDANG…" : "SIDANGKAN DEWAN 46"}
            </Button>
          </div>
        </FadeUp>

        {/* ── Putusan ── */}
        <div ref={verdictRef} className="min-w-0">
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
                  animate={reduce ? {} : { rotate: [0, -6, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                  className="mx-auto size-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-950 flex items-center justify-center shadow-lg"
                >
                  <Landmark className="size-7 text-amber-300" />
                </motion.div>
                <p className="mt-4 font-black tracking-tight text-emerald-900 dark:text-emerald-100">DEWAN 46 SEDANG BERSIDANG</p>
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
                      {RITUAL_SIDANG[ritual]}
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
            ) : verdict ? (
              <motion.article
                key={verdict.id}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="rounded-xl border bg-card overflow-hidden"
              >
                <header className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Putusan Resmi Dewan 46</p>
                    <p className="truncate text-xs text-muted-foreground mt-0.5">
                      {new Date(verdict.createdAt).toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })} · {verdict.kategori} · {verdict.urgensi}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={salin} className="shrink-0">
                    {copied ? <Check className="size-3.5 mr-1 text-emerald-600" /> : <Copy className="size-3.5 mr-1" />}
                    {copied ? "Tersalin" : "Salin"}
                  </Button>
                </header>
                <div className="px-5 py-4 max-w-none gunara-md">
                  <ReactMarkdown
                    components={{
                      h2: ({ children }) => (
                        <h3 className="mt-5 mb-2 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-900 dark:text-emerald-300 first:mt-0">
                          <span className="h-4 w-1 rounded-full bg-amber-400 inline-block" />{children}
                        </h3>
                      ),
                      h3: ({ children }) => (
                        <h4 className="mt-4 mb-1.5 text-xs font-black text-amber-700 dark:text-amber-400">{children}</h4>
                      ),
                      p: ({ children }) => <p className="my-2 text-[13px] leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="my-2 space-y-1.5">{children}</ul>,
                      ol: ({ children }) => <ol className="my-2 space-y-1.5">{children}</ol>,
                      li: ({ children }) => (
                        <li className="flex items-start gap-2 text-[13px] leading-relaxed">
                          <span className="mt-[7px] size-1.5 flex-none rounded-full bg-emerald-600 dark:bg-emerald-400" />
                          <span className="min-w-0 [&>ul]:mt-1">{children}</span>
                        </li>
                      ),
                      strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                      blockquote: ({ children }) => (
                        <blockquote className="my-3 border-l-4 border-amber-400 bg-amber-400/5 px-3 py-2 text-[13px] italic">{children}</blockquote>
                      ),
                      hr: () => <hr className="my-4 border-dashed" />,
                    }}
                  >
                    {verdict.putusan}
                  </ReactMarkdown>
                </div>
                <footer className="border-t bg-emerald-950 px-5 py-3">
                  <p className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5" /> Ditetapkan dalam sidang Dewan 46 — GUNARA OS v6.0 · by Gugun Gunara
                  </p>
                </footer>
              </motion.article>
            ) : (
              <motion.div
                key="empty"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="rounded-xl border border-dashed bg-card/60 p-8 text-center"
              >
                <Sparkles className="mx-auto size-8 text-amber-500" />
                <p className="mt-3 font-bold tracking-tight">Ruang sidang masih kosong</p>
                <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">
                  Tulis masalahmu di formulir, pilih dewan yang relevan (atau biarkan sistem merekomendasikan), lalu
                  sidangkan. Putusan akan muncul di sini — lengkap dengan akar masalah, solusi berlapis, dan ritual eksekusi.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                  {["🔍 Akar masalah", "🏛️ Perspektif 46 dewan", "🧭 Solusi 48 jam–90 hari", "⚠️ Risiko & benteng", "📿 Ritual eksekusi"].map((t) => (
                    <span key={t} className="rounded-full border bg-muted/40 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">{t}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Riwayat Sidang ── */}
      <FadeUp delay={0.08}>
        <div className="rounded-xl border bg-card">
          <button
            onClick={() => setShowHistory((s) => !s)}
            className="flex w-full items-center justify-between px-5 py-3.5 text-left"
            aria-expanded={showHistory}
          >
            <span className="inline-flex items-center gap-2 text-sm font-bold tracking-tight">
              <History className="size-4 text-emerald-700 dark:text-emerald-400" />
              Arsip Putusan <span className="text-muted-foreground font-medium tabular-nums">({history.length})</span>
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
                    <p className="py-6 text-center text-xs text-muted-foreground">Belum ada putusan tersimpan.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {history.map((h) => (
                        <li key={h.id} className="group flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2">
                          <button onClick={() => bukaRiwayat(h)} className="min-w-0 flex-1 text-left">
                            <p className="truncate text-xs font-semibold">{h.problem}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {new Date(h.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })} · {h.kategori} · {h.urgensi}
                            </p>
                          </button>
                          <button
                            onClick={() => hapusRiwayat(h.id)}
                            className="flex-none rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                            aria-label="Hapus putusan"
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
