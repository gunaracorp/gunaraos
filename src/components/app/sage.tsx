"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v7.0 — GOD MODE · SAGE CONSOLE
// Ngobrol langsung dengan tiga wajah Gugun Gunara (AI):
//   🧠 Master Polymath          — sintesis lintas-bidang
//   🏔️ Sage Universal           — kebijaksanaan horizon 10 tahun
//   ⚡ Ultimate Problem Solver  — eksekusi tegas tanpa drama
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import {
  Brain, Mountain, Zap, SendHorizonal, Loader2, History, Trash2,
  ChevronDown, MessagesSquare,
} from "lucide-react";
import { FadeUp, EASE } from "./motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type ModeId = "polymath" | "sage" | "solver";

interface ModeMeta {
  id: ModeId;
  icon: typeof Brain;
  nama: string;
  desk: string;
  sapa: string;
  placeholder: string;
  renung: string[];
  /** kelas aksen kartu mode terpilih */
  ring: string;
  chip: string;
  glow: string;
}

const MODES: ModeMeta[] = [
  {
    id: "polymath",
    icon: Brain,
    nama: "Master Polymath",
    desk: "Sintesis lintas-bidang — melihat pola tersembunyi antar disiplin",
    sapa: "Aku melihat keterkaitan yang orang lain lewatkan. Tanyakan apa saja — bisnis, kode, keluarga, iman — semuanya nyambung.",
    placeholder: "Tanyakan apa pun… akan kuaitkan dari banyak disiplin sekaligus…",
    renung: [
      "Memetakan masalahmu ke biologi, ekonomi, dan sejarah…",
      "Mencari pola lintas-bidang yang tersembunyi…",
      "Menyusun analogia tajam dari ilmu tak terduga…",
    ],
    ring: "border-emerald-600 bg-emerald-600/[0.06]",
    chip: "bg-emerald-700 text-amber-200 border-emerald-600",
    glow: "from-emerald-800 to-emerald-950",
  },
  {
    id: "sage",
    icon: Mountain,
    nama: "Sage Universal",
    desk: "Horizon 10 tahun — kebijaksanaan orde kedua, tenang seperti gunung",
    sapa: "Tenang. Kebanyakan masalah lebih kecil dari rasa takutnya. Ceritakan — kita timbang dengan horizon sepuluh tahun.",
    placeholder: "Ceritakan keadaanmu… kita pikirkan dengan horizon 10 tahun…",
    renung: [
      "Memisahkan gejala, akar, dan hal di luar kendali…",
      "Menimbang efek orde kedua dari setiap pilihan…",
      "Mengukur keputusan dengan horizon sepuluh tahun…",
    ],
    ring: "border-amber-500 bg-amber-400/[0.06]",
    chip: "bg-amber-500/90 text-emerald-950 border-amber-500",
    glow: "from-amber-600 to-emerald-950",
  },
  {
    id: "solver",
    icon: Zap,
    nama: "Ultimate Problem Solver",
    desk: "Eksekusi tegas — akar masalah, langkah bernomor, tenggat",
    sapa: "Nol drama. Ceritakan masalahnya — kamu keluar dari sini dengan langkah bernomor dan tenggat.",
    placeholder: "Masalah apa yang harus selesai hari ini? Keluar dengan langkah bernomor…",
    renung: [
      "Membongkar cerita untuk menemukan masalah sebenarnya…",
      "Menyusun langkah eksekusi bernomor + tenggat…",
      "Mempersiapkan rencana cadangan yang berani…",
    ],
    ring: "border-rose-500 bg-rose-500/[0.06]",
    chip: "bg-rose-600 text-white border-rose-500",
    glow: "from-rose-700 to-emerald-950",
  },
];

interface ChatMsg { role: "user" | "assistant"; content: string }
interface SageItem {
  id: string;
  mode: string;
  pertanyaan: string;
  jawaban: string;
  createdAt: string;
}

export function SageConsoleSection() {
  const reduce = useReducedMotion();
  const { toast } = useToast();

  const [mode, setMode] = useState<ModeId>("solver");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [renung, setRenung] = useState(0);
  const [history, setHistory] = useState<SageItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const meta = MODES.find((m) => m.id === mode)!;

  useEffect(() => { loadHistory(); }, []);

  useEffect(() => {
    if (!loading) return;
    setRenung(0);
    const t = setInterval(() => setRenung((r) => (r + 1) % meta.renung.length), 2400);
    return () => clearInterval(t);
  }, [loading, meta.renung.length]);

  /* Auto-scroll ke bawah saat pesan baru masuk */
  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, loading, reduce]);

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/sage");
      const data = await res.json();
      setHistory(data.items || []);
    } catch { /* offline — abaikan */ }
  };

  const kirim = async () => {
    const text = input.trim();
    if (!text) return;
    if (loading) return;
    const nextMsgs: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(nextMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/sage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          messages: nextMsgs.filter((m) => m.content !== meta.sapa).slice(-14),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Konsol gagal merespons");
      setMessages((m) => [...m, { role: "assistant", content: data.item.jawaban }]);
      loadHistory();
    } catch (e) {
      toast({ title: "Konsol gagal merespons", description: String(e instanceof Error ? e.message : e), variant: "destructive" });
      // tarik balik pesan user agar bisa dikirim ulang
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const gantiMode = (id: ModeId) => {
    if (loading) return;
    setMode(id);
    setMessages([]);
  };

  const bukaRiwayat = (h: SageItem) => {
    if (loading) return;
    const m = MODES.find((x) => x.id === h.mode);
    if (m) setMode(m.id);
    setMessages([
      { role: "user", content: h.pertanyaan },
      { role: "assistant", content: h.jawaban },
    ]);
  };

  const hapusRiwayat = async (id: string) => {
    try {
      await fetch(`/api/sage?id=${id}`, { method: "DELETE" });
      setHistory((h) => h.filter((x) => x.id !== id));
    } catch { /* abaikan */ }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-950 via-[#1a231e] to-emerald-950 p-6 sm:p-8 text-emerald-50">
          <motion.div
            aria-hidden
            animate={reduce ? {} : { y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="absolute -right-8 -top-10 opacity-[0.06]"
          >
            <MessagesSquare className="size-56" />
          </motion.div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/90">GUNARA OS v7.0 — GOD MODE</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-amber-100">🔮 SAGE CONSOLE</h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/80 leading-relaxed">
            Tiga wajah, satu inti. Ngobrol langsung dengan <strong className="text-amber-200">Master Polymath</strong>,
            <strong className="text-amber-200"> Sage Universal</strong>, atau
            <strong className="text-amber-200"> The Ultimate Problem Solver</strong> — masing-masing dengan
            kepribadian, cara berpikir, dan gaya jawaban sendiri.
          </p>
        </div>
      </FadeUp>

      {/* ── Pemilih Mode ── */}
      <div className="grid gap-3 sm:grid-cols-3">
        {MODES.map((m, i) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <motion.button
              key={m.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: EASE }}
              whileHover={reduce ? undefined : { y: -3 }}
              onClick={() => gantiMode(m.id)}
              disabled={loading}
              aria-pressed={active}
              className={cn(
                "rounded-xl border p-4 text-left transition-colors disabled:opacity-60",
                active ? m.ring + " shadow-sm" : "bg-card hover:bg-muted/40"
              )}
            >
              <span className={cn(
                "size-9 rounded-lg bg-gradient-to-br flex items-center justify-center shadow",
                m.glow
              )}>
                <Icon className="size-4.5 text-amber-100" />
              </span>
              <p className="mt-2.5 text-sm font-black tracking-tight">{m.nama}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{m.desk}</p>
            </motion.button>
          );
        })}
      </div>

      {/* ── Ruang Obrolan ── */}
      <FadeUp delay={0.05}>
        <div className="rounded-xl border bg-card overflow-hidden">
          <header className="flex items-center justify-between gap-2 border-b bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <meta.icon className="size-4 flex-none text-emerald-700 dark:text-emerald-400" />
              <p className="text-sm font-bold tracking-tight truncate">Ruang Obrolan — {meta.nama}</p>
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="text-[10px] font-semibold text-muted-foreground hover:text-foreground ml-1 shrink-0"
                >
                  (bersihkan)
                </button>
              )}
            </div>
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-bold", meta.chip)}>{mode.toUpperCase()}</span>
          </header>

          <div ref={chatRef} className="h-[46vh] min-h-[320px] overflow-y-auto nice-scroll px-4 py-4 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <motion.div
                  animate={reduce ? {} : { scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className={cn("size-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg", meta.glow)}
                >
                  <meta.icon className="size-7 text-amber-100" />
                </motion.div>
                <p className="mt-3 text-sm font-bold">{meta.nama} menunggu…</p>
                <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">{meta.sapa}</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {m.role === "user" ? (
                      <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-800 text-emerald-50 px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap">
                        {m.content}
                      </div>
                    ) : (
                      <div className="max-w-[92%] rounded-2xl rounded-bl-sm border bg-background px-4 py-3 max-w-none gunara-md">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="my-1.5 text-[13px] leading-relaxed first:mt-0 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="my-1.5 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="my-1.5 space-y-1 list-decimal list-inside">{children}</ol>,
                            li: ({ children }) => (
                              <li className="flex items-start gap-2 text-[13px] leading-relaxed">
                                <span className="mt-[7px] size-1.5 flex-none rounded-full bg-emerald-600 dark:bg-emerald-400" />
                                <span className="min-w-0">{children}</span>
                              </li>
                            ),
                            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                            h1: ({ children }) => <p className="text-[13px] font-black my-1.5">{children}</p>,
                            h2: ({ children }) => <p className="text-[13px] font-black my-1.5">{children}</p>,
                            h3: ({ children }) => <p className="text-[12px] font-black text-amber-700 dark:text-amber-400 my-1.5">{children}</p>,
                            blockquote: ({ children }) => (
                              <blockquote className="my-2 border-l-4 border-amber-400 bg-amber-400/5 px-3 py-1.5 text-[13px] italic">{children}</blockquote>
                            ),
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {loading && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="rounded-2xl rounded-bl-sm border bg-background px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-3.5 animate-spin text-emerald-700 dark:text-emerald-400" />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={renung}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[11px] text-muted-foreground"
                      >
                        {meta.renung[renung]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="border-t bg-muted/20 p-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    kirim();
                  }
                }}
                placeholder={meta.placeholder}
                className="min-h-[44px] max-h-32 resize-none text-[13px]"
                maxLength={6000}
                aria-label={`Tulis pesan untuk ${meta.nama}`}
              />
              <Button
                onClick={kirim}
                disabled={loading || !input.trim()}
                size="icon"
                className="size-11 shrink-0 bg-gradient-to-br from-emerald-800 to-emerald-950 hover:from-emerald-700 hover:to-emerald-900 text-amber-200 shadow"
                aria-label="Kirim pesan"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <SendHorizonal className="size-4" />}
              </Button>
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              <kbd className="rounded border bg-background px-1 font-mono">Enter</kbd> kirim ·
              <kbd className="ml-1 rounded border bg-background px-1 font-mono">Shift+Enter</kbd> baris baru
            </p>
          </div>
        </div>
      </FadeUp>

      {/* ── Riwayat ── */}
      <FadeUp delay={0.08}>
        <div className="rounded-xl border bg-card">
          <button
            onClick={() => setShowHistory((s) => !s)}
            className="flex w-full items-center justify-between px-5 py-3.5 text-left"
            aria-expanded={showHistory}
          >
            <span className="inline-flex items-center gap-2 text-sm font-bold tracking-tight">
              <History className="size-4 text-emerald-700 dark:text-emerald-400" />
              Riwayat Obrolan <span className="text-muted-foreground font-medium tabular-nums">({history.length})</span>
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
                    <p className="py-6 text-center text-xs text-muted-foreground">Belum ada obrolan tersimpan.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {history.map((h) => {
                        const m = MODES.find((x) => x.id === h.mode);
                        const Icon = m?.icon ?? MessagesSquare;
                        return (
                          <li key={h.id} className="group flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2">
                            <Icon className="size-3.5 flex-none text-muted-foreground" />
                            <button onClick={() => bukaRiwayat(h)} className="min-w-0 flex-1 text-left">
                              <p className="truncate text-xs font-semibold">{h.pertanyaan}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {m?.nama ?? h.mode} · {new Date(h.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                              </p>
                            </button>
                            <button
                              onClick={() => hapusRiwayat(h.id)}
                              className="flex-none rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                              aria-label="Hapus obrolan"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </li>
                        );
                      })}
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
