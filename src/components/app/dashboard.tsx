"use client";

import { useMemo, useState } from "react";
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
  Sun, ShieldCheck, Quote, ListChecks, CalendarClock,
} from "lucide-react";
import { useRecords, useSettings } from "./use-records";
import { rupiah, rupiahShort, fmtDateFull, todayISO, fmtDate } from "@/lib/gunara";
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

export function Dashboard({ onNavigate }: { onNavigate: (section: string) => void }) {
  const daily = useRecords("dailyLog");
  const debt = useRecords("debt");
  const receivable = useRecords("receivable");
  const client = useRecords("client");
  const win = useRecords("winLog");
  const backlog = useRecords("backlogItem");
  const followUp = useRecords("followUp");
  const { values } = useSettings(["piagam", "aturanMutlak", "faseAktif"]);
  const { toast } = useToast();

  const [mitOpen, setMitOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ mit1: "", mit2: "", mit3: "", energi: 5 });

  const today = todayISO();
  const now = new Date();
  const todayLog = useMemo(() => daily.items.find((d) => d.tanggal === today), [daily.items, today]);

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
    const count = followUp.items.filter((f) => f.status === "TERJADWAL" && f.tenggat && f.tenggat < today).length;
    return count;
  }, [followUp.items, today]);

  const aturan: string[] = useMemo(() => {
    try { return JSON.parse(values.aturanMutlak || "[]"); } catch { return []; }
  }, [values.aturanMutlak]);

  // Aturan hari ini — bergantian berdasarkan tanggal
  const aturanHariIni = aturan.length > 0 ? aturan[now.getDate() % aturan.length] : "";

  const saveMit = async () => {
    setSaving(true);
    try {
      await daily.create({ tanggal: today, ...form, done1: false, done2: false, done3: false, refleksi: "" });
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

  const pola = POLA[now.getDay()];

  return (
    <div className="space-y-5">
      {/* Sapaan */}
      <div className="rounded-2xl border-2 border-emerald-900/20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 dark:from-emerald-950 dark:via-emerald-950 dark:to-emerald-900 p-6 md:p-8 text-emerald-50 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-amber-400/10 blur-2xl" />
        <div className="absolute right-24 bottom-0 size-32 rounded-full bg-amber-300/10 blur-xl" />
        <div className="relative">
          <p className="text-emerald-200/80 text-sm font-medium">{fmtDateFull(now)}</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Assalamu&apos;alaikum, Pak Gugun 🏛️
          </h1>
          <p className="text-emerald-100/90 text-sm mt-2 max-w-2xl leading-relaxed">
            {todayLog ? "Sistem jalan. Lihat 3 MIT-mu di bawah — MIT yang selesai hari itu = hari yang menang." : "Belum ada 3 MIT untuk hari ini. Tulis dulu — CUKUP 3, sebelum membuka WhatsApp."}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
              <Flame className="size-3.5 text-amber-300" /> {pola.emoji} {pola.fokus} — {pola.catatan}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 text-amber-100 px-3 py-1.5 text-xs font-semibold">
              <CalendarClock className="size-3.5" /> {values.faseAktif || "Fase belum diset"}
            </span>
          </div>
        </div>
      </div>

      {/* 3 MIT + Energi */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border shadow-sm">
          <div className="px-5 py-3 border-b bg-muted/50 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm"><ListChecks className="size-4 text-emerald-700 dark:text-emerald-400" /> 3 MIT Hari Ini</div>
            <Button size="sm" variant={todayLog ? "ghost" : "outline"} className="h-7 text-xs" onClick={() => { setForm({ mit1: todayLog?.mit1 || "", mit2: todayLog?.mit2 || "", mit3: todayLog?.mit3 || "", energi: todayLog?.energi || 5 }); setMitOpen(true); }}>
              {todayLog ? "Edit" : "Isi Sekarang"}
            </Button>
          </div>
          <CardContent className="p-5">
            {!todayLog ? (
              <div className="text-center py-8 space-y-3">
                <Sun className="size-10 mx-auto text-amber-500/60" />
                <p className="text-sm text-muted-foreground">Ritual Pagi — 10 menit, sebelum buka HP sosmed.</p>
                <Button size="sm" onClick={() => { setForm({ mit1: "", mit2: "", mit3: "", energi: 5 }); setMitOpen(true); }}>Tulis 3 MIT</Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {([1, 2, 3] as const).map((i) => {
                  const mitText = i === 1 ? todayLog.mit1 : i === 2 ? todayLog.mit2 : todayLog.mit3;
                  const doneField = i === 1 ? "done1" : i === 2 ? "done2" : "done3";
                  const done = Boolean(todayLog[doneField]);
                  if (!mitText) return null;
                  return (
                    <label key={i} className={cn("flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors", done ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800" : "hover:bg-muted/50")}>
                      <Checkbox checked={done} onCheckedChange={(c) => toggleMit(doneField as "done1" | "done2" | "done3", Boolean(c))} className="mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">MIT-{i}</p>
                        <p className={cn("text-sm font-medium", done && "line-through opacity-60")}>{mitText}</p>
                      </div>
                    </label>
                  );
                })}
                {todayLog.done1 && <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">✓ MIT-1 selesai — hari ini sudah menang. Sisanya bonus.</p>}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <div className="px-5 py-3 border-b bg-muted/50 flex items-center gap-2 font-bold text-sm"><HeartPulse className="size-4 text-rose-600" /> Energi CEO</div>
          <CardContent className="p-5 space-y-4">
            <div className="text-center">
              <p className="text-4xl font-extrabold tracking-tight text-rose-700 dark:text-rose-400">{todayLog?.energi ?? "—"}</p>
              <p className="text-xs text-muted-foreground">skala 1–10</p>
            </div>
            <Slider min={1} max={10} step={1} value={[todayLog?.energi ?? 5]} onValueCommit={(v) => setEnergi(v[0])} disabled={!todayLog} />
            {todayLog && todayLog.energi <= 4 && (
              <p className="text-xs bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg p-2.5 text-rose-800 dark:text-rose-300">
                Energi ≤ 4 → hari itu: 1 MIT saja. Lalu istirahat. Ini perintah, bukan saran.
              </p>
            )}
            <p className="text-xs text-muted-foreground">Tidur minimal 6 jam. CEO lelah = keputusan bodoh = rugi lagi.</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatMini icon={<Landmark className="size-4" />} label="Sisa Hutang" value={rupiah(sisaHutang)} tone="red" onClick={() => onNavigate("keuangan")} hint="Terjadwal, bukan menakutkan" />
        <StatMini icon={<HandCoins className="size-4" />} label="Piutang Beredar" value={rupiah(piutang)} tone="gold" onClick={() => onNavigate("keuangan")} hint="Uang kita di luar" />
        <StatMini icon={<Users className="size-4" />} label="Klien Aktif + Retainer" value={String(klienAktif)} onClick={() => onNavigate("klien")} hint="Uang berulang = mesin" />
        <StatMini icon={<HandCoins className="size-4" />} label="Follow-Up Telat" value={String(fuTelat)} tone={fuTelat > 0 ? "red" : "green"} onClick={() => onNavigate("klien")} hint={fuTelat > 0 ? "Tindak sekarang!" : "Rapi — bagus"} />
      </div>

      {/* Win terakhir + aturan hari ini + quote */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="border shadow-sm">
          <div className="px-5 py-3 border-b bg-muted/50 flex items-center gap-2 font-bold text-sm"><Trophy className="size-4 text-amber-500" /> Win Terakhir</div>
          <CardContent className="p-5">
            {lastWin ? (
              <>
                <p className="text-sm font-semibold leading-relaxed">{lastWin.kemenangan}</p>
                <p className="text-xs text-muted-foreground mt-2">{fmtDate(lastWin.tanggal)}{lastWin.bukti ? ` · bukti: ${lastWin.bukti}` : ""}</p>
                <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs gap-1" onClick={() => onNavigate("dokumentasi")}>
                  Buka Win Log <ArrowRight className="size-3.5" />
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada kemenangan dicatat. Tidak ada yang terlalu kecil.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <div className="px-5 py-3 border-b bg-muted/50 flex items-center gap-2 font-bold text-sm"><ShieldCheck className="size-4 text-emerald-700 dark:text-emerald-400" /> Aturan Mutlak Hari Ini</div>
          <CardContent className="p-5">
            <p className="text-sm font-semibold leading-relaxed">{aturanHariIni || "—"}</p>
            <p className="text-xs text-muted-foreground mt-3">10 aturan ini tidak bisa dinegosiasikan. Bukan lux — itu maintenance.</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-300/60 dark:border-amber-700/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 shadow-sm">
          <CardContent className="p-5 flex flex-col h-full">
            <Quote className="size-5 text-amber-600 mb-2" />
            <p className="text-sm font-bold leading-relaxed text-amber-900 dark:text-amber-200">
              &ldquo;Prak burukeun — segerakan kesadaran. Ulah edan, kudu eling.&rdquo;
            </p>
            <p className="text-xs text-amber-800/70 dark:text-amber-300/70 mt-auto pt-3">Misi: 1 miliar jiwa terdampak • 500 buku • 100 jurnal internasional</p>
          </CardContent>
        </Card>
      </div>

      {/* Piagam & backlog shortcut */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border shadow-sm">
          <div className="px-5 py-3 border-b bg-gradient-to-r from-emerald-950 to-emerald-800 dark:from-emerald-950 dark:to-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-50"><Sparkles className="size-4 text-amber-300" /> Piagam Diri</div>
            <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={() => onNavigate("hulu")}>Baca Penuh</Button>
          </div>
          <CardContent className="p-5">
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
              {(values.piagam || "").split("\n").filter((l) => !l.startsWith("#")).join(" ").slice(0, 260)}…
            </p>
            <p className="text-xs text-muted-foreground mt-3">Dibaca setiap Senin pagi, sebelum membuka WhatsApp. Non-negotiable.</p>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <div className="px-5 py-3 border-b bg-muted/50 flex items-center gap-2 font-bold text-sm"><Flame className="size-4 text-orange-500" /> Ide di Backlog</div>
          <CardContent className="p-5">
            {backlog.items.slice(0, 3).map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-2 py-1.5 border-b last:border-0">
                <p className="text-sm line-clamp-1">{b.ide}</p>
                <span className="text-xs text-muted-foreground flex-none">{fmtDate(b.tanggal)}</span>
              </div>
            ))}
            {backlog.items.length === 0 && (
              <p className="text-sm text-muted-foreground">Kosong. Ide baru TIDAK BOLEH dieksekusi di minggu yang sama ia lahir — masukkan ke backlog dulu.</p>
            )}
            <Button size="sm" variant="ghost" className="mt-2 h-7 text-xs gap-1" onClick={() => onNavigate("backlog")}>
              Buka Penjara Ide <ArrowRight className="size-3.5" />
            </Button>
          </CardContent>
        </Card>
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

function StatMini({ icon, label, value, tone, onClick, hint }: {
  icon: React.ReactNode; label: string; value: string; tone?: "red" | "green" | "gold"; onClick?: () => void; hint?: string;
}) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <p className="text-xs font-medium">{label}</p>
        </div>
        <p className={cn("text-lg font-extrabold mt-1.5 tracking-tight",
          tone === "green" && "text-emerald-700 dark:text-emerald-400",
          tone === "red" && "text-rose-700 dark:text-rose-400",
          tone === "gold" && "text-amber-700 dark:text-amber-400")}>
          {value}
        </p>
        {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
      </CardContent>
    </Card>
  );
}
