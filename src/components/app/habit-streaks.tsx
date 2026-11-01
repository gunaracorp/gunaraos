"use client";

// ═══════════════════════════════════════════════════════════════
// 🌱 HABIT STREAKS — mesin bunga majemuk disiplin (v10.0 OMNISCIENT)
// ═══════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { Flame, Plus, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FadeUp, ProgressRing } from "./motion";
import { useRecords } from "./use-records";

function wibDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(d);
}
function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    out.push(wibDate(d));
  }
  return out;
}

function hitungStreak(dates: Set<string>): number {
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = wibDate(new Date(Date.now() - i * 86_400_000));
    if (dates.has(d)) streak += 1;
    else if (i > 0) break;
    else continue; // hari ini boleh belum
  }
  return streak;
}

export function HabitStreaksSection() {
  const { items, loading, create, remove, refresh } = useRecords<any>("habit");
  const [nama, setNama] = useState("");
  const [ikon, setIkon] = useState("🌱");
  const [target, setTarget] = useState(7);
  const days = useMemo(() => lastNDays(14), []);
  const today = days[days.length - 1];

  const toggle = async (habitId: string, tanggal: string, selesai: boolean) => {
    await fetch("/api/data/habitLog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, tanggal, selesai: !selesai }),
    });
    refresh();
  };

  const tambah = async () => {
    if (!nama.trim()) { toast.error("Nama kebiasaan wajib"); return; }
    await create({ nama: nama.trim(), ikon: ikon.trim() || "🌱", target });
    toast.success("Kebiasaan baru ditanam 🌱");
    setNama("");
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 lg:p-6">
      <FadeUp>
        <Card className="border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-emerald-500/15 p-3"><Flame className="size-6 text-emerald-500" /></div>
            <div>
              <h1 className="text-xl font-black">Habit Streaks</h1>
              <p className="text-sm text-muted-foreground">Bunga majemuk disiplin — 1% lebih baik tiap hari. Grid 14 hari, zona WIB.</p>
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      <FadeUp>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Plus className="size-4" /> Tanam Kebiasaan</CardTitle></CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-[80px_1fr_140px_auto]">
            <Input placeholder="🌱" value={ikon} onChange={(e) => setIkon(e.target.value)} className="text-center" maxLength={4} />
            <Input placeholder="Nama kebiasaan (mis. Baca 30 menit)" value={nama} onChange={(e) => setNama(e.target.value)} />
            <label className="text-xs text-muted-foreground">Target {target}×/minggu
              <input type="range" min={1} max={7} value={target} onChange={(e) => setTarget(Number(e.target.value))} className="w-full accent-emerald-500" />
            </label>
            <Button onClick={tambah}>Tanam</Button>
          </CardContent>
        </Card>
      </FadeUp>

      <div className="space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Memuat…</p>}
        {(items as any[]).filter((h) => !h.arsip).map((h) => {
          const done = new Set<string>((h.logs || []).filter((l: any) => l.selesai).map((l: any) => l.tanggal));
          const streak = hitungStreak(done);
          const bestStreak = streak; // streak berjalan
          const mingguIni = days.slice(7).filter((d) => done.has(d)).length;
          const pct = Math.min(100, Math.round((mingguIni / (h.target || 7)) * 100));
          return (
            <FadeUp key={h.id}>
              <Card>
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-2xl">{h.ikon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold leading-tight">{h.nama}</div>
                      <div className="text-[11px] text-muted-foreground">target {h.target}×/minggu · minggu ini {mingguIni}×</div>
                    </div>
                    <Badge className="bg-orange-500/15 text-orange-700 dark:text-orange-400"><Flame className="mr-1 size-3" /> streak {streak}</Badge>
                    <Badge variant="outline"><Trophy className="mr-1 size-3" /> rekor {bestStreak}</Badge>
                    <ProgressRing value={mingguIni} max={h.target || 7} size={48} stroke={5} />
                    <Button size="icon" variant="ghost" className="size-7 text-red-500" onClick={() => remove(h.id).then(() => toast.success("Kebiasaan dihapus"))}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {days.map((d) => {
                      const isDone = done.has(d);
                      return (
                        <button
                          key={d}
                          onClick={() => toggle(h.id, d, isDone)}
                          className={`flex h-11 w-11 flex-col items-center justify-center rounded-lg border text-[9px] transition-colors ${
                            isDone ? "border-emerald-500 bg-emerald-500/20 font-bold text-emerald-700 dark:text-emerald-300" : "bg-background hover:bg-muted"
                          } ${d === today ? "ring-2 ring-emerald-500/50" : ""}`}
                          title={d}
                        >
                          <span>{d.slice(8)}</span>
                          <span className="text-[8px] text-muted-foreground">{d.slice(5, 7)}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </CardContent>
              </Card>
            </FadeUp>
          );
        })}
        {!loading && !(items as any[]).length && (
          <p className="text-sm text-muted-foreground">Belum ada kebiasaan — tanam yang pertama hari ini.</p>
        )}
      </div>
    </div>
  );
}
