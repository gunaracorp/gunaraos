"use client";

// ═══════════════════════════════════════════════════
// GUNARA OS — Command Center (Dashboard)
// Anti-hydration: semua data waktu dirender CLIENT-ONLY
// via useNow(); server & klien identik sampai mount.
// ═══════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Flame, Trophy, HeartPulse, Landmark, HandCoins, Users, Sparkles, ArrowRight,
  Sun, ShieldCheck, Quote, ListChecks, CalendarClock, Clock,
} from "lucide-react";
import { useRecords, useSettings } from "./use-records";
import {
  FadeUp, Stagger, StaggerItem, CountUp, FloatingOrbs, ProgressRing,
  PulseDot, HoverLift, ShimmerBlock, useNow, EASE,
} from "./motion";
import { rupiah, fmtDateFull, todayISO, isoFrom, fmtDate } from "@/lib/gunara";
import { TOTAL_YEARS } from "@/lib/dewan";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const POLA: Record<number, { fokus: string; emoji: string; catatan: string }> = {
  1: { fokus: "CEO Day", emoji: "🏛️", catatan: "Strategi & bangun mesin — minimal 3 jam deep work" },
  2: { fokus: "Sales Day", emoji: "📞", catatan: "Follow-up leads — telepon/WA 5 prospek" },
  3: { fokus: "Build Day", emoji: "🔨", catatan: "Eksekusi proyek + 1 konten tayang" },
  4: { fokus: "Sales Day 2", emoji: "🤝", catatan: "Sales + mitra (notaris, LSPro, jaringan)" },
  5: { fokus: "Admin & Cash Day", emoji: "💵", catatan: "Invoicing & pembukuan — uang tidak boleh kacau" },
  6: { fokus: "Anak Day Penuh", emoji: "👶", catatan: "Bisnis hanya urusan darurat — non-negotiable" },
  0: { fokus: "Keluarga + Weekly Review", emoji: "🌙", catatan: "Malam: Weekly Review 30 menit" },
};

const clockWIB = (d: Date) =>
  `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")} WIB`;

export function Dashboard({ onNavigate }: { onNavigate: (section: string) => void }) {
  const daily = useRecords("dailyLog");
  const debt = useRecords("debt");
  const receivable = useRecords("receivable");
  const client = useRecords("client");
  const win = useRecords("winLog");
  const backlog = useRecords("backlogItem");
  const followUp = useRecords("followUp");
  const bizCustomer = useRecords("customer");
  const bizPermit = useRecords("permitApplication");
  const { values } = useSettings(["piagam", "aturanMutlak", "faseAktif"]);
  const { toast } = useToast();
  const reduce = useReducedMotion();

  const [mitOpen, setMitOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ mit1: "", mit2: "", mit3: "", energi: 5 });

  // ── ANTI-HYDRATION: waktu hanya ada di klien, sinkron tiap 30 detik ──
  const now = useNow(30_000);
  const today = now ? isoFrom(now) : "";

  const todayLog = useMemo(
    () => (today ? daily.items.find((d) => d.tanggal === today) : undefined),
    [daily.items, today]
  );

  const sisaHutang = useMemo(
    () => debt.items.reduce((a, d) => a + (d.status === "LUNAS" ? 0 : d.nilaiAwal - (d.payments || []).reduce((s: number, p: { jumlah: number }) => s + p.jumlah, 0)), 0),
    [debt.items]
  );
  const piutang = useMemo(
    () => receivable.items.filter((r) => r.status !== "LUNAS").reduce((a, r) => a + (r.nilaiKontrak - r.dpDiterima), 0),
    [receivable.items]
  );
  const klienAktif = useMemo(
    () => client.items.filter((c) => ["KLIEN", "RETAINER"].includes(c.status)).length,
    [client.items]
  );
  const lastWin = win.items[0];
  const fuTelat = useMemo(() => {
    if (!today) return 0;
    return followUp.items.filter((f) => f.status === "TERJADWAL" && f.tenggat && f.tenggat < today).length;
  }, [followUp.items, today]);

  const aturan: string[] = useMemo(() => {
    try { return JSON.parse(values.aturanMutlak || "[]"); } catch { return []; }
  }, [values.aturanMutlak]);

  const aturanHariIni = now && aturan.length > 0 ? aturan[now.getDate() % aturan.length] : "";
  const pola = now ? POLA[now.getDay()] : null;
  const statsLoading = debt.loading || receivable.loading || client.loading || followUp.loading;

  // ── Bisnis Hub: pipeline izin + pelanggan (metadata terlengkap) ──
  const bizPipeline = useMemo(
    () => bizPermit.items
      .filter((p) => !["TERBIT", "GAGAL", "BATAL"].includes(p.status))
      .reduce((a, p) => a + (p.harga || 0), 0),
    [bizPermit.items]
  );
  const bizProses = bizPermit.items.filter((p) => p.tahap === 4 && p.status === "PROSES").length;
  const bizPelanggan = bizCustomer.items.length;

  const mitDone = todayLog ? [todayLog.done1, todayLog.done2, todayLog.done3].filter(Boolean).length : 0;
  const mitFilled = todayLog ? [todayLog.mit1, todayLog.mit2, todayLog.mit3].filter(Boolean).length : 0;

  const saveMit = async () => {
    setSaving(true);
    try {
      await daily.create({ tanggal: todayISO(), ...form, done1: false, done2: false, done3: false, refleksi: "" });
      setMitOpen(false);
      toast({ title: "Ritual pagi tercatat", description: "MIT-1 dikerjakan DULU, sebelum membuka WhatsApp bisnis, email, apapun." });
    } finally {
      setSaving(false);
    }
  };

  const toggleMit = async (field: "done1" | "done2" | "done3", val: boolean) => {
    if (!todayLog) return;
    await daily.update(todayLog.id, { [field]: val });
  };

  const setEnergi = async (v: number) => {
    if (!todayLog) return;
    await daily.update(todayLog.id, { energi: v });
    if (v <= 4) toast({ title: "Energi rendah terdeteksi", description: "Hari ini: 1 MIT saja. Lalu istirahat. Ini perintah, bukan saran. — Managermu" });
  };

  const energiVal = todayLog?.energi;
  const energiColor =
    energiVal == null ? "text-muted-foreground/40"
    : energiVal <= 4 ? "text-rose-600 dark:text-rose-400"
    : energiVal >= 8 ? "text-emerald-600 dark:text-emerald-400"
    : "text-amber-600 dark:text-amber-400";

  return (
    <div className="space-y-5">
      {/* ═══ SAPAAN — hero dengan orb hidup & jam live ═══ */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="rounded-2xl border-2 border-emerald-900/20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 dark:from-emerald-950 dark:via-emerald-950 dark:to-emerald-900 p-6 md:p-8 text-emerald-50 relative overflow-hidden"
      >
        <FloatingOrbs />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-emerald-200/80 text-sm font-medium">
              {now ? fmtDateFull(now) : <span className="inline-block h-4 w-44 align-middle shimmer rounded bg-emerald-800/60" />}
            </p>
            <AnimatePresence>
              {now && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25, duration: 0.4, ease: EASE }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold tabular-nums"
                >
                  <Clock className="size-3 text-amber-300" /> {clockWIB(now)}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/50 border border-emerald-700/40 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-300">
              <PulseDot /> SISTEM AKTIF
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2">
            Assalamu&apos;alaikum, Pak Gugun 🏛️
          </h1>
          <p className="text-emerald-100/90 text-sm mt-2 max-w-2xl leading-relaxed">
            {todayLog ? "Sistem jalan. Lihat 3 MIT-mu di bawah — MIT yang selesai hari itu = hari yang menang." : "Belum ada 3 MIT untuk hari ini. Tulis dulu — CUKUP 3, sebelum membuka WhatsApp."}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {pola ? (
              <motion.span
                key={pola.fokus}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.45, ease: EASE }}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold"
              >
                <Flame className="size-3.5 text-amber-300" /> {pola.emoji} {pola.fokus} — {pola.catatan}
              </motion.span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1.5 text-xs"><span className="h-3.5 w-40 shimmer rounded bg-emerald-800/60" /></span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 text-amber-100 px-3 py-1.5 text-xs font-semibold">
              <CalendarClock className="size-3.5" /> {values.faseAktif || "Fase belum diset"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ═══ DEWAN 46 — v6.0 ═══ */}
      <FadeUp delay={0.1}>
        <button
          onClick={() => onNavigate("solver")}
          className="w-full group rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-400/10 via-card to-card p-4 flex items-center gap-4 text-left transition-colors hover:border-amber-500/60 hover:bg-amber-400/[0.06]"
        >
          <span className="size-11 flex-none rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-950 text-amber-200 flex items-center justify-center shadow">
            <Landmark className="size-5" />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-black tracking-tight">DEWAN 46 — Baru di v6.0</span>
            <span className="block text-xs text-muted-foreground truncate">
              Master Polymath · Sage Universal · Ultimate Problem Solver — sidangkan 46 dewan pakar ({TOTAL_YEARS.toLocaleString("id-ID")} tahun kolektif) untuk masalah apa pun.
            </span>
          </span>
          <ArrowRight className="size-4 flex-none text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </FadeUp>

      {/* ═══ 3 MIT + Energi ═══ */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border shadow-sm">
          <div className="px-5 py-3 border-b bg-muted/50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 font-bold text-sm"><ListChecks className="size-4 text-emerald-700 dark:text-emerald-400" /> 3 MIT Hari Ini</div>
              <AnimatePresence>
                {mitFilled > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  >
                    <ProgressRing value={mitDone} max={3} size={40} stroke={4} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button size="sm" variant={todayLog ? "ghost" : "outline"} className="h-7 text-xs" onClick={() => { setForm({ mit1: todayLog?.mit1 || "", mit2: todayLog?.mit2 || "", mit3: todayLog?.mit3 || "", energi: todayLog?.energi || 5 }); setMitOpen(true); }}>
              {todayLog ? "Edit" : "Isi Sekarang"}
            </Button>
          </div>
          <CardContent className="p-5">
            {daily.loading ? (
              <div className="space-y-3">
                <ShimmerBlock className="h-16 w-full" />
                <ShimmerBlock className="h-16 w-full" />
              </div>
            ) : !todayLog ? (
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="text-center py-8 space-y-3"
              >
                <motion.div
                  animate={reduce ? {} : { y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sun className="size-10 mx-auto text-amber-500/60" />
                </motion.div>
                <p className="text-sm text-muted-foreground">Ritual Pagi — 10 menit, sebelum buka HP sosmed.</p>
                <Button size="sm" onClick={() => { setForm({ mit1: "", mit2: "", mit3: "", energi: 5 }); setMitOpen(true); }}>Tulis 3 MIT</Button>
              </motion.div>
            ) : (
              <div className="space-y-2.5">
                {([1, 2, 3] as const).map((i, idx) => {
                  const mitText = i === 1 ? todayLog.mit1 : i === 2 ? todayLog.mit2 : todayLog.mit3;
                  const doneField = i === 1 ? "done1" : i === 2 ? "done2" : "done3";
                  const done = Boolean(todayLog[doneField]);
                  if (!mitText) return null;
                  return (
                    <motion.label
                      key={i}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * idx, duration: 0.4, ease: EASE }}
                      whileHover={reduce ? {} : { x: 3 }}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors",
                        done ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800" : "hover:bg-muted/50"
                      )}
                    >
                      <Checkbox checked={done} onCheckedChange={(c) => toggleMit(doneField as "done1" | "done2" | "done3", Boolean(c))} className="mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">MIT-{i}</p>
                        <p className={cn("text-sm font-medium transition-all", done && "line-through opacity-60")}>{mitText}</p>
                      </div>
                      <AnimatePresence>
                        {done && (
                          <motion.span
                            initial={reduce ? false : { scale: 0, rotate: -90, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                            className="ml-auto flex-none inline-flex items-center justify-center size-6 rounded-full bg-emerald-500 text-white shadow-md"
                            aria-label="Selesai"
                          >
                            ✓
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.label>
                  );
                })}
                <AnimatePresence>
                  {todayLog.done1 && (
                    <motion.p
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold"
                    >
                      ✓ MIT-1 selesai — hari ini sudah menang. Sisanya bonus.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <div className="px-5 py-3 border-b bg-muted/50 flex items-center gap-2 font-bold text-sm"><HeartPulse className="size-4 text-rose-600" /> Energi CEO</div>
          <CardContent className="p-5 space-y-4">
            <div className="text-center">
              <AnimatePresence mode="popLayout">
                <motion.p
                  key={energiVal ?? "none"}
                  initial={reduce || energiVal == null ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { scale: 0.7, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 340, damping: 22 }}
                  className={cn("text-4xl font-extrabold tracking-tight", energiColor)}
                >
                  {energiVal ?? "—"}
                </motion.p>
              </AnimatePresence>
              <p className="text-xs text-muted-foreground">skala 1–10</p>
            </div>
            <Slider min={1} max={10} step={1} value={[todayLog?.energi ?? 5]} onValueCommit={(v) => setEnergi(v[0])} disabled={!todayLog} />
            <AnimatePresence>
              {todayLog && todayLog.energi <= 4 && (
                <motion.p
                  initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="text-xs bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg p-2.5 text-rose-800 dark:text-rose-300 overflow-hidden"
                >
                  Energi ≤ 4 → hari itu: 1 MIT saja. Lalu istirahat. Ini perintah, bukan saran.
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-xs text-muted-foreground">Tidur minimal 6 jam. CEO lelah = keputusan bodoh = rugi lagi.</p>
          </CardContent>
        </Card>
      </div>

      {/* ═══ Statistik — angka count-up + kartu terangkat ═══ */}
      <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3" gap={0.08}>
        <StatMini loading={statsLoading} icon={<Landmark className="size-4" />} label="Sisa Hutang" value={sisaHutang} format={(v) => rupiah(Math.round(v))} tone="red" onClick={() => onNavigate("keuangan")} hint="Terjadwal, bukan menakutkan" />
        <StatMini loading={statsLoading} icon={<HandCoins className="size-4" />} label="Piutang Beredar" value={piutang} format={(v) => rupiah(Math.round(v))} tone="gold" onClick={() => onNavigate("keuangan")} hint="Uang kita di luar" />
        <StatMini loading={statsLoading} icon={<Users className="size-4" />} label="Klien Aktif + Retainer" value={klienAktif} format={(v) => String(Math.round(v))} onClick={() => onNavigate("klien")} hint="Uang berulang = mesin" />
        <StatMini loading={statsLoading} icon={<HandCoins className="size-4" />} label="Follow-Up Telat" value={fuTelat} format={(v) => String(Math.round(v))} tone={fuTelat > 0 ? "red" : "green"} onClick={() => onNavigate("klien")} hint={fuTelat > 0 ? "Tindak sekarang!" : "Rapi — bagus"} />
      </Stagger>

      {/* ═══ Bisnis Hub strip — mesin konsultan perizinan ═══ */}
      <FadeUp delay={0.05}>
        <button
          onClick={() => onNavigate("perizinan")}
          className="w-full text-left rounded-xl border-2 border-emerald-800/20 bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-50 dark:from-emerald-950/40 dark:via-amber-950/20 dark:to-emerald-950/40 p-4 flex flex-wrap items-center gap-x-6 gap-y-2 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="size-9 rounded-lg bg-emerald-700 text-amber-200 flex items-center justify-center font-black text-sm flex-none">G</span>
            <div>
              <p className="text-xs font-black tracking-wide text-emerald-900 dark:text-emerald-300">BISNIS HUB — GUNARA GROUP</p>
              <p className="text-[11px] text-muted-foreground">pusatperizinan.com · gunara.web.id — mesin konsultan perizinan</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs ml-auto">
            <span className="text-muted-foreground">Pelanggan: <strong className="text-foreground tabular-nums">{bizPelanggan}</strong></span>
            <span className="text-muted-foreground">Izin diproses: <strong className="text-foreground tabular-nums">{bizProses}</strong></span>
            <span className="text-muted-foreground">Pipeline aktif: <strong className="text-emerald-700 dark:text-emerald-400 tabular-nums">{rupiah(bizPipeline)}</strong></span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Buka →</span>
          </div>
        </button>
      </FadeUp>

      {/* ═══ Win terakhir + aturan hari ini + quote ═══ */}
      <div className="grid lg:grid-cols-3 gap-4">
        <FadeUp delay={0.05}>
          <Card className="border shadow-sm h-full">
            <div className="px-5 py-3 border-b bg-muted/50 flex items-center gap-2 font-bold text-sm"><Trophy className="size-4 text-amber-500" /> Win Terakhir</div>
            <CardContent className="p-5">
              {win.loading ? (
                <div className="space-y-2"><ShimmerBlock className="h-4 w-full" /><ShimmerBlock className="h-4 w-2/3" /></div>
              ) : lastWin ? (
                <>
                  <p className="text-sm font-semibold leading-relaxed">{lastWin.kemenangan}</p>
                  <p className="text-xs text-muted-foreground mt-2">{fmtDate(lastWin.tanggal)}{lastWin.bukti ? ` · bukti: ${lastWin.bukti}` : ""}</p>
                  <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs gap-1 group" onClick={() => onNavigate("dokumentasi")}>
                    Buka Win Log <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada kemenangan dicatat. Tidak ada yang terlalu kecil.</p>
              )}
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.12}>
          <Card className="border shadow-sm h-full">
            <div className="px-5 py-3 border-b bg-muted/50 flex items-center gap-2 font-bold text-sm"><ShieldCheck className="size-4 text-emerald-700 dark:text-emerald-400" /> Aturan Mutlak Hari Ini</div>
            <CardContent className="p-5">
              {aturanHariIni ? (
                <motion.p
                  key={aturanHariIni}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="text-sm font-semibold leading-relaxed"
                >
                  {aturanHariIni}
                </motion.p>
              ) : (
                <ShimmerBlock className="h-10 w-full" />
              )}
              <p className="text-xs text-muted-foreground mt-3">10 aturan ini tidak bisa dinegosiasikan. Bukan lux — itu maintenance.</p>
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.19}>
          <Card className="border-2 border-amber-300/60 dark:border-amber-700/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 shadow-sm h-full">
            <CardContent className="p-5 flex flex-col h-full">
              <Quote className="size-5 text-amber-600 mb-2" />
              <p className="text-sm font-bold leading-relaxed text-amber-900 dark:text-amber-200">
                &ldquo;Prak burukeun — segerakan kesadaran. Ulah edan, kudu eling.&rdquo;
              </p>
              <p className="text-xs text-amber-800/70 dark:text-amber-300/70 mt-auto pt-3">Misi: 1 miliar jiwa terdampak • 500 buku • 100 jurnal internasional</p>
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      {/* ═══ Piagam & backlog shortcut ═══ */}
      <div className="grid lg:grid-cols-2 gap-4">
        <FadeUp delay={0.08}>
          <Card className="border shadow-sm h-full flex flex-col">
            <div className="px-5 py-3 border-b bg-gradient-to-r from-emerald-950 to-emerald-800 dark:from-emerald-950 dark:to-emerald-900 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-50"><Sparkles className="size-4 text-amber-300" /> Piagam Diri</div>
              <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => onNavigate("hulu")}>Baca Penuh</Button>
            </div>
            <CardContent className="p-5 flex-1">
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                {(values.piagam || "").split("\n").filter((l) => !l.startsWith("#")).join(" ").slice(0, 260)}…
              </p>
              <p className="text-xs text-muted-foreground mt-3">Dibaca setiap Senin pagi, sebelum membuka WhatsApp. Non-negotiable.</p>
            </CardContent>
          </Card>
        </FadeUp>

        <FadeUp delay={0.15}>
          <Card className="border shadow-sm h-full flex flex-col">
            <div className="px-5 py-3 border-b bg-muted/50 flex items-center gap-2 font-bold text-sm"><Flame className="size-4 text-orange-500" /> Ide di Backlog</div>
            <CardContent className="p-5 flex-1">
              {backlog.items.slice(0, 3).map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.35, ease: EASE }}
                  className="flex items-center justify-between gap-2 py-1.5 border-b last:border-0"
                >
                  <p className="text-sm line-clamp-1">{b.ide}</p>
                  <span className="text-xs text-muted-foreground flex-none">{fmtDate(b.tanggal)}</span>
                </motion.div>
              ))}
              {backlog.items.length === 0 && (
                <p className="text-sm text-muted-foreground">Kosong. Ide baru TIDAK BOLEH dieksekusi di minggu yang sama ia lahir — masukkan ke backlog dulu.</p>
              )}
              <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs gap-1 group" onClick={() => onNavigate("backlog")}>
                Buka Penjara Ide <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </FadeUp>
      </div>

      {/* Dialog MIT */}
      <Dialog open={mitOpen} onOpenChange={setMitOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>3 MIT Hari Ini</DialogTitle>
            <DialogDescription>MIT-1 = paling mendekati uang · MIT-2 = paling mendekati launch · MIT-3 = keluarga/kesehatan/rumah</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            {(["mit1", "mit2", "mit3"] as const).map((k, i) => (
              <div key={k} className="space-y-1.5">
                <Label className="text-xs">MIT-{i + 1}{i === 0 && " — kerjakan DULU, sebelum apapun"}</Label>
                <Input value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMitOpen(false)}>Batal</Button>
            <Button onClick={saveMit} disabled={saving || !form.mit1}>{saving ? "Menyimpan…" : "Mulai Hari"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatMini({ icon, label, value, format, tone, onClick, hint, loading }: {
  icon: React.ReactNode; label: string; value: number; format: (n: number) => string;
  tone?: "red" | "green" | "gold"; onClick?: () => void; hint?: string; loading?: boolean;
}) {
  return (
    <StaggerItem>
      <HoverLift onClick={onClick} className="h-full">
        <Card className="border shadow-sm hover:shadow-md h-full cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              {icon}
              <p className="text-xs font-medium">{label}</p>
            </div>
            {loading ? (
              <ShimmerBlock className="h-6 w-24 mt-2" />
            ) : (
              <p className={cn("text-lg font-extrabold mt-1.5 tracking-tight",
                tone === "green" && "text-emerald-700 dark:text-emerald-400",
                tone === "red" && "text-rose-700 dark:text-rose-400",
                tone === "gold" && "text-amber-700 dark:text-amber-400")}>
                <CountUp value={value} format={format} />
              </p>
            )}
            {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
          </CardContent>
        </Card>
      </HoverLift>
    </StaggerItem>
  );
}
