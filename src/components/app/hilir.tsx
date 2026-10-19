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
import { Textarea } from "@/components/ui/textarea";
import { Sun, Moon, HeartPulse, ListChecks } from "lucide-react";
import { RecordTable } from "./record-table";
import { useRecords } from "./use-records";
import { WEEKLY_CONFIG, BACKLOG_CONFIG, DECISION_CONFIG, fmtDate, todayISO } from "@/lib/gunara";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// ═════════ RITUAL HARIAN (3 MIT) ═════════
export function DailySection() {
  const daily = useRecords("dailyLog");
  const { toast } = useToast();
  const today = todayISO();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ mit1: "", mit2: "", mit3: "", energi: 5 });
  const [saving, setSaving] = useState(false);

  const todayLog = useMemo(() => daily.items.find((d) => d.tanggal === today), [daily.items, today]);
  const history = useMemo(() => daily.items.filter((d) => d.tanggal !== today).slice(0, 30), [daily.items, today]);

  const ritualDone = todayLog && todayLog.mit1;

  const saveToday = async () => {
    setSaving(true);
    try {
      await daily.create({ tanggal: today, ...form, done1: false, done2: false, done3: false, refleksi: "" });
      setOpen(false);
      toast({ title: "Ritual pagi tercatat", description: "MIT-1 WAJIB dikerjakan SEBELUM membuka WhatsApp bisnis, email, apapun." });
    } finally {
      setSaving(false);
    }
  };

  const toggleMit = async (field: "done1" | "done2" | "done3", val: boolean) => {
    if (!todayLog) return;
    await daily.update(todayLog.id, { [field]: val });
  };

  const saveRefleksi = async (val: { refleksi?: string; energi?: number }) => {
    if (!todayLog) return;
    await daily.update(todayLog.id, val);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">🏃 HILIR — Ritual Harian</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Sistem harus bisa dijalankan di hari terburukmu, bukan hari terbaikmu. Lebih dari 3 MIT = tidak ada MIT.
          MIT yang selesai hari itu = hari yang menang. Sisanya bonus.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Ritual Pagi */}
        <Card className="border shadow-sm">
          <div className="px-5 py-3 border-b bg-amber-50/70 dark:bg-amber-950/30 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold"><Sun className="size-4 text-amber-600" /> Ritual Pagi — 10 Menit</div>
            <span className="text-xs text-muted-foreground">{fmtDate(today)}</span>
          </div>
          <CardContent className="p-5">
            {!ritualDone ? (
              <div className="text-center py-6 space-y-3">
                <ListChecks className="size-10 mx-auto text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Belum ada 3 MIT untuk hari ini.<br />Tulis dulu — CUKUP 3.</p>
                <Button size="sm" onClick={() => { setForm({ mit1: "", mit2: "", mit3: "", energi: 5 }); setOpen(true); }}>Tulis 3 MIT Hari Ini</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {([1, 2, 3] as const).map((i) => {
                  const mitText = i === 1 ? todayLog!.mit1 : i === 2 ? todayLog!.mit2 : todayLog!.mit3;
                  const doneField = i === 1 ? "done1" : i === 2 ? "done2" : "done3";
                  const done = Boolean(todayLog![doneField]);
                  if (!mitText) return null;
                  return (
                    <label key={i} className={cn("flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors", done ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800" : "hover:bg-muted/50")}>
                      <Checkbox checked={done} onCheckedChange={(c) => toggleMit(doneField as "done1" | "done2" | "done3", Boolean(c))} className="mt-0.5" />
                      <div>
                        <p className={cn("text-sm font-semibold", done && "line-through opacity-60")}>MIT-{i}</p>
                        <p className={cn("text-sm", done && "line-through opacity-60")}>{mitText}</p>
                      </div>
                    </label>
                  );
                })}
                <p className="text-xs text-muted-foreground">
                  {i1done(todayLog)} {todayLog!.done1 ? "MIT-1 selesai — hari ini sudah menang." : "Kerjakan MIT-1 DULU, sebelum apapun."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ritual Malam */}
        <Card className="border shadow-sm">
          <div className="px-5 py-3 border-b bg-indigo-50/70 dark:bg-indigo-950/30 flex items-center gap-2 font-bold">
            <Moon className="size-4 text-indigo-700 dark:text-indigo-400" /> Ritual Malam — 5 Menit
          </div>
          <CardContent className="p-5 space-y-4">
            {!todayLog ? (
              <p className="text-sm text-muted-foreground">Isi ritual pagi dulu — malam menyusul.</p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label className="text-xs flex items-center gap-1.5"><HeartPulse className="size-3.5" /> Energi hari ini: <strong>{todayLog.energi}/10</strong> {todayLog.energi <= 4 && <span className="text-rose-600">— wajib istirahat!</span>}</Label>
                  <Slider min={1} max={10} step={1} value={[todayLog.energi]} onValueCommit={(v) => saveRefleksi({ energi: v[0] })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Catat 1 kalimat: &quot;Hari ini yang paling penting terjadi: ___&quot;</Label>
                  <Textarea
                    rows={2}
                    defaultValue={todayLog.refleksi}
                    placeholder="Tulis satu kalimat jujur…"
                    onBlur={(e) => saveRefleksi({ refleksi: e.target.value })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Setelah ini: tutup laptop. Ini bukan opsional. — Managermu 🫡
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Riwayat */}
      <div>
        <h3 className="text-base font-bold tracking-tight mb-2">Riwayat Hari</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {history.length === 0 && <p className="text-sm text-muted-foreground">Belum ada riwayat. Mulai hari ini.</p>}
          {history.map((d) => {
            const total = [d.mit1, d.mit2, d.mit3].filter(Boolean).length;
            const done = [d.done1 && d.mit1, d.done2 && d.mit2, d.done3 && d.mit3].filter(Boolean).length;
            return (
              <Card key={d.id} className="border shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm">{fmtDate(d.tanggal)}</p>
                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", done === total && total > 0 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300")}>
                    {done}/{total} MIT
                  </span>
                </div>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  {[d.mit1, d.mit2, d.mit3].filter(Boolean).slice(0, 3).map((m, idx) => <li key={idx}>• {m}</li>)}
                </ul>
                {d.refleksi && <p className="text-xs italic mt-2 line-clamp-2">&ldquo;{d.refleksi}&rdquo;</p>}
                <p className="text-xs mt-2 text-muted-foreground">Energi: {d.energi}/10</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dialog isi MIT */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>3 MIT Hari Ini</DialogTitle>
            <DialogDescription>
              Most Important Tasks — daftar 10 hal = kamu gagal semua. Cukup 3.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            {(["mit1", "mit2", "mit3"] as const).map((k, i) => (
              <div key={k} className="space-y-1.5">
                <Label className="text-xs">
                  MIT-{i + 1}: {["yang paling mendekati uang", "yang paling mendekati launch", "keluarga / kesehatan / rumah"][i]}
                </Label>
                <Input value={form[k]} onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={saveToday} disabled={saving || !form.mit1}>{saving ? "Menyimpan…" : "Mulai Hari"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function i1done(log: { done1: boolean }) { return log.done1 ? "✓" : ""; }

// ═════════ WEEKLY REVIEW ═════════
export function WeeklySection() {
  const weekly = useRecords("weeklyReview");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">📊 Review Mingguan</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Waktu tetap: <strong>Minggu malam, 30 menit, setelah anak-anak tidur.</strong> Ini sesi &quot;rapat dengan manager&quot;.
          Pertanyaan wajib ke manager: &quot;Review jawabanku minggu ini. Mana yang realistis, mana yang self-sabotase? Mana yang aku hindari? Jangan enak-enak.&quot;
        </p>
      </div>
      <RecordTable
        config={WEEKLY_CONFIG}
        rows={weekly.items}
        loading={weekly.loading}
        onCreate={weekly.create}
        onUpdate={weekly.update}
        onDelete={weekly.remove}
      />
    </div>
  );
}

// ═════════ BACKLOG ═════════
export function BacklogSection() {
  const backlog = useRecords("backlogItem");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">📥 Backlog — Penjara Ide</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Tipe founder visioner punya penyakit: <strong>setiap ide baru terasa lebih menarik dari yang sedang dikerjakan.</strong>{" "}
          Backlog menyembuhkan itu. Ide tidak hilang — tapi tidak boleh menculik fokus. Ide yang masih menarik setelah 30 hari = ide serius.
        </p>
      </div>
      <RecordTable
        config={BACKLOG_CONFIG}
        rows={backlog.items}
        loading={backlog.loading}
        onCreate={backlog.create}
        onUpdate={backlog.update}
        onDelete={backlog.remove}
      />
    </div>
  );
}

// ═════════ DECISIONS LOG ═════════
export function DecisionsSection() {
  const decisions = useRecords("decisionLog");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">⚖️ Decisions Log — Sejarah Keputusan Besar</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Manager yang baik tidak menuduh CEO berubah pikiran — ia membuka catatan.
          Hari buruk? Buka halaman ini → ingat: kamu sedang MEMBANGUN, bukan bertahan hidup.
        </p>
      </div>
      <RecordTable
        config={DECISION_CONFIG}
        rows={decisions.items}
        loading={decisions.loading}
        onCreate={decisions.create}
        onUpdate={decisions.update}
        onDelete={decisions.remove}
      />
    </div>
  );
}
