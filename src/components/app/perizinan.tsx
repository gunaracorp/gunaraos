"use client";

// ═══════════════════════════════════════════════════
// GUNARA OS — Perizinan: Tracker 5 Tahap ISO · Katalog
// 46 Layanan · Pencari Izin (rules engine)
// Alur resmi gunara.web.id: Konsultasi → Penawaran →
// Kontrak → Proses → Garansi
// ═══════════════════════════════════════════════════

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ClipboardList, Search, Sparkles, ArrowRight, FileCheck2,
  User, CalendarClock, Landmark, ChevronLeft, ChevronRight, ScrollText,
} from "lucide-react";
import { RecordTable } from "./record-table";
import { useRecords } from "./use-records";
import {
  PERMIT_CONFIG, BadgeStatus, BadgeMini, rupiahShort, fmtDate, todayISO,
} from "@/lib/gunara";
import { PERMIT_STAGE_META, TAHAP_NAMA } from "@/lib/gunara";
import { SERVICES, KATEGORI_LAYANAN, serviceByKode, fmtDurasi } from "@/lib/service-catalog";
import { findLicenses, SEKTOR_FINDER, type FinderInput, type Prioritas } from "@/lib/license-finder";
import { FadeUp, EASE } from "./motion";
import { cn } from "@/lib/utils";

type Row = Record<string, any>;

// ══════ TAB 1: TRACKER — Kanban 5 tahap ISO ══════
function PermitTracker() {
  const permits = useRecords("permitApplication");
  const reduce = useReducedMotion();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);

  const move = async (row: Row, dir: 1 | -1) => {
    const next = Math.min(5, Math.max(1, (row.tahap || 1) + dir));
    if (next === row.tahap) return;
    // Status otomatis mengikuti tahap — standar alur ISO
    const autoStatus = next === 5 ? "TERBIT" : next === 4 ? "PROSES" : next === 3 ? "KONTRAK" : row.status;
    await permits.update(row.id, { tahap: next, status: autoStatus });
    toast({ title: `Tahap ${next} — ${TAHAP_NAMA[next]}`, description: `${row.namaLayanan} maju ke tahap berikutnya.` });
  };

  const byTahap = useMemo(() => {
    const map: Record<number, Row[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    for (const p of permits.items) map[p.tahap]?.push(p);
    return map;
  }, [permits.items]);

  const pipelineRp = permits.items
    .filter((p) => p.status !== "GAGAL" && p.status !== "BATAL" && p.status !== "TERBIT")
    .reduce((a, p) => a + (p.harga || 0), 0);
  const terbitRp = permits.items.filter((p) => p.status === "TERBIT").reduce((a, p) => a + (p.harga || 0), 0);
  const dpRp = permits.items.reduce((a, p) => a + (p.dpDiterima || 0), 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: "Pipeline aktif", value: pipelineRp, tone: "text-amber-700 dark:text-amber-400" },
          { label: "Sudah terbit", value: terbitRp, tone: "text-emerald-700 dark:text-emerald-400" },
          { label: "DP diterima", value: dpRp, tone: "text-sky-700 dark:text-sky-400" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
            className="rounded-xl border bg-card p-3"
          >
            <p className={cn("text-base font-extrabold tabular-nums", s.tone)}>{rupiahShort(s.value)}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {permits.loading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-3 space-y-2">
              <div className="shimmer h-4 w-2/3 rounded bg-muted" />
              <div className="shimmer h-16 rounded bg-muted" />
              <div className="shimmer h-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {PERMIT_STAGE_META.map((stage, si) => (
            <motion.div
              key={stage.tahap}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: si * 0.06, ease: EASE }}
              className="rounded-xl border bg-card overflow-hidden flex flex-col"
            >
              <div className="px-3 py-2.5 border-b bg-muted/40">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn(
                      "size-6 rounded-lg flex items-center justify-center text-xs font-black flex-none",
                      stage.tahap === 5 ? "bg-emerald-600 text-white" : "bg-amber-400 text-emerald-950",
                    )}>{stage.tahap}</span>
                    <p className="font-bold text-sm truncate">{stage.nama}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] tabular-nums">{byTahap[stage.tahap].length}</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{stage.desc}</p>
              </div>
              <div className="p-2 space-y-2 flex-1">
                <AnimatePresence initial={false}>
                  {byTahap[stage.tahap].map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="rounded-lg border bg-background p-2.5 group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-bold leading-snug">{p.namaLayanan}</p>
                        <BadgeStatus value={p.status} />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                        <User className="size-3" /> {p.customerName || p.companyName || "—"}
                      </p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Landmark className="size-3" /> {p.instansi || "—"}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">{rupiahShort(p.harga)}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="size-6" aria-label="Mundur tahap" disabled={p.tahap <= 1} onClick={() => move(p, -1)}>
                            <ChevronLeft className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-6" aria-label="Naik tahap" disabled={p.tahap >= 5} onClick={() => move(p, 1)}>
                            <ChevronRight className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                      {p.targetSelesai && (
                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <CalendarClock className="size-3" /> target {fmtDate(p.targetSelesai)}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {byTahap[stage.tahap].length === 0 && (
                  <p className="text-[11px] text-muted-foreground text-center py-4">Kosong</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">Klik ◀ ▶ pada kartu untuk memindah tahap — status ikut standar ISO otomatis.</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }} className="gap-1.5">
            <ClipboardList className="size-4" /> Tambah Pengurusan
          </Button>
        </div>
      </div>

      <RecordTable
        config={PERMIT_CONFIG}
        rows={permits.items}
        loading={permits.loading}
        onCreate={permits.create}
        onUpdate={permits.update}
        onDelete={permits.remove}
        hideAdd
      />

      <PermitFormDialog
        open={open} onOpenChange={setOpen} initial={editing}
        onSubmit={async (data) => { if (editing) await permits.update(editing.id, data); else await permits.create(data); }}
      />
    </div>
  );
}

function PermitFormDialog({ open, onOpenChange, initial, onSubmit }: {
  open: boolean; onOpenChange: (v: boolean) => void; initial: Row | null;
  onSubmit: (data: Row) => Promise<unknown>;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Row>({});
  // Sinkron saat dialog dibuka (useEffect — bebas anti-pattern setState-saat-render)
  useEffect(() => {
    if (open) {
      setForm({
        namaLayanan: initial?.namaLayanan || "", layananKode: initial?.layananKode || "",
        customerName: initial?.customerName || "", companyName: initial?.companyName || "",
        tahap: initial?.tahap || 1, status: initial?.status || "PENAWARAN",
        instansi: initial?.instansi || "", harga: initial?.harga || 0,
        biayaPemerintah: initial?.biayaPemerintah || 0, dpDiterima: initial?.dpDiterima || 0,
        tanggalMasuk: initial?.tanggalMasuk || todayISO(), targetSelesai: initial?.targetSelesai || "",
        tanggalTerbit: initial?.tanggalTerbit || "", dokumenUrl: initial?.dokumenUrl || "",
        notes: initial?.notes || "",
      });
    }
  }, [open, initial]);

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto nice-scroll">
        <DialogHeader>
          <DialogTitle>{initial ? "Ubah" : "Tambah"} Pengurusan Izin</DialogTitle>
          <DialogDescription>Posisi berkas klien dalam alur 5 langkah ISO 9001:2015.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-1">
          <div className="space-y-1.5 md:col-span-2"><Label>Nama layanan *</Label>
            <Input value={form.namaLayanan || ""} onChange={(e) => set("namaLayanan", e.target.value)} placeholder="NIB — Nomor Induk Berusaha" /></div>
          <div className="space-y-1.5"><Label>Pelanggan</Label>
            <Input value={form.customerName || ""} onChange={(e) => set("customerName", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Perusahaan klien</Label>
            <Input value={form.companyName || ""} onChange={(e) => set("companyName", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Tahap (1–5)</Label>
            <Select value={String(form.tahap || 1)} onValueChange={(v) => set("tahap", Number(v))}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PERMIT_STAGE_META.map((s) => (
                  <SelectItem key={s.tahap} value={String(s.tahap)}>{s.tahap} — {s.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select></div>
          <div className="space-y-1.5"><Label>Status</Label>
            <Select value={form.status || "PENAWARAN"} onValueChange={(v) => set("status", v)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["PENAWARAN", "KONTRAK", "PROSES", "TERBIT", "GAGAL", "BATAL"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select></div>
          <div className="space-y-1.5"><Label>Instansi tujuan</Label>
            <Input value={form.instansi || ""} onChange={(e) => set("instansi", e.target.value)} placeholder="OSS RBA / Kemenkumham / BPOM…" /></div>
          <div className="space-y-1.5"><Label>Nilai deal (Rp)</Label>
            <Input type="number" value={form.harga ?? 0} onChange={(e) => set("harga", Number(e.target.value) || 0)} /></div>
          <div className="space-y-1.5"><Label>Biaya pemerintah (Rp)</Label>
            <Input type="number" value={form.biayaPemerintah ?? 0} onChange={(e) => set("biayaPemerintah", Number(e.target.value) || 0)} /></div>
          <div className="space-y-1.5"><Label>DP diterima (Rp)</Label>
            <Input type="number" value={form.dpDiterima ?? 0} onChange={(e) => set("dpDiterima", Number(e.target.value) || 0)} /></div>
          <div className="space-y-1.5"><Label>Tanggal masuk</Label>
            <Input type="date" value={form.tanggalMasuk || ""} onChange={(e) => set("tanggalMasuk", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Target selesai</Label>
            <Input type="date" value={form.targetSelesai || ""} onChange={(e) => set("targetSelesai", e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Tanggal terbit</Label>
            <Input type="date" value={form.tanggalTerbit || ""} onChange={(e) => set("tanggalTerbit", e.target.value)} /></div>
          <div className="space-y-1.5 md:col-span-2"><Label>Link dokumen</Label>
            <Input value={form.dokumenUrl || ""} onChange={(e) => set("dokumenUrl", e.target.value)} placeholder="https://drive…" /></div>
          <div className="space-y-1.5 md:col-span-2"><Label>Catatan progres</Label>
            <Input value={form.notes || ""} onChange={(e) => set("notes", e.target.value)} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button disabled={saving} onClick={async () => { setSaving(true); try { await onSubmit(form); onOpenChange(false); } finally { setSaving(false); } }}>
            {saving ? "Menyimpan…" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ══════ TAB 2: KATALOG — 46 layanan ══════
function ServiceCatalogTab() {
  const [q, setQ] = useState("");
  const [kat, setKat] = useState("SEMUA");
  const permits = useRecords("permitApplication");
  const { toast } = useToast();
  const reduce = useReducedMotion();

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return SERVICES.filter((x) =>
      (kat === "SEMUA" || x.kategori === kat) &&
      (!s || x.nama.toLowerCase().includes(s) || x.kode.toLowerCase().includes(s) || x.instansi.toLowerCase().includes(s))
    );
  }, [q, kat]);

  const jadiProyek = async (kode: string) => {
    const svc = serviceByKode(kode);
    if (!svc) return;
    await permits.create({
      namaLayanan: svc.nama, layananKode: svc.kode, kategori: svc.kategori,
      tahap: 1, status: "PENAWARAN", instansi: svc.instansi, tanggalMasuk: todayISO(),
    });
    toast({ title: "Masuk tracker", description: `${svc.nama} → Tahap 1 (Konsultasi). Lengkapi data klien di tab Tracker.` });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari layanan / kode / instansi…" className="pl-9" />
        </div>
        <Select value={kat} onValueChange={setKat}>
          <SelectTrigger className="sm:w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="SEMUA">Semua Kategori (11)</SelectItem>
            {KATEGORI_LAYANAN.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} layanan — hasil audit resmi gunara.web.id · harga mulai · jalur instansi resmi</p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((s, i) => (
          <motion.div
            key={s.kode}
            layout
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.4), ease: EASE }}
            whileHover={reduce ? {} : { y: -3 }}
            className="rounded-xl border bg-card p-4 flex flex-col"
          >
            <div className="flex items-start justify-between gap-2">
              <BadgeMini text={s.kode} tone="amber" />
              <Badge variant="outline" className="text-[10px]">{s.instansi}</Badge>
            </div>
            <p className="font-bold text-sm mt-2 leading-snug">{s.nama}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{s.deskripsi}</p>
            <div className="flex items-center justify-between mt-3 text-xs">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{rupiahShort(s.hargaMulai)}</span>
              <span className="text-muted-foreground">{fmtDurasi(s.durasiMin, s.durasiMaks)}</span>
            </div>
            <Button size="sm" variant="outline" className="mt-2.5 w-full gap-1.5" onClick={() => jadiProyek(s.kode)}>
              <FileCheck2 className="size-3.5" /> Buat Pengurusan
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ══════ TAB 3: PENCARI IZIN — rules engine ══════
const EMPTY_INPUT: FinderInput = {
  sektor: "KULINER", skala: "UMKM", badanUsaha: false, online: false, eksporImpor: false,
  gedungSendiri: false, karyawan: false, pangan: false, merek: false, asing: false, tender: false,
};

const PRIORITAS_TONE: Record<Prioritas, "green" | "amber" | "red" | "gray"> = {
  "WAJIB": "red", "SANGAT DISARANKAN": "amber", "DISARANKAN": "green", "OPSIONAL": "gray",
};

function LicenseFinderTab() {
  const [input, setInput] = useState<FinderInput>(EMPTY_INPUT);
  const [shown, setShown] = useState(false);
  const permits = useRecords("permitApplication");
  const { toast } = useToast();
  const reduce = useReducedMotion();

  const hasil = useMemo(() => (shown ? findLicenses(input) : []), [shown, input]);
  const total = hasil.reduce((a, h) => a + (serviceByKode(h.kode)?.hargaMulai || 0), 0);

  const set = <K extends keyof FinderInput>(k: K, v: FinderInput[K]) => setInput((f) => ({ ...f, [k]: v }));

  const jadikanProyek = async () => {
    const wajib = hasil.filter((h) => h.prioritas === "WAJIB" || h.prioritas === "SANGAT DISARANKAN");
    for (const h of wajib) {
      const svc = serviceByKode(h.kode);
      if (!svc) continue;
      await permits.create({
        namaLayanan: svc.nama, layananKode: svc.kode, kategori: svc.kategori,
        tahap: 1, status: "PENAWARAN", instansi: svc.instansi, tanggalMasuk: todayISO(),
      });
    }
    toast({ title: `${wajib.length} izin masuk tracker`, description: "Semua izin WAJIB & SANGAT DISARANKAN kini di Tahap 1 — siap dikonsultasikan." });
  };

  const FLAGS: { key: keyof FinderInput; label: string }[] = [
    { key: "badanUsaha", label: "Sudah punya badan usaha (PT/CV/PO)" },
    { key: "online", label: "Jual online / marketplace" },
    { key: "pangan", label: "Produk pangan / minuman" },
    { key: "gedungSendiri", label: "Punya / menyewa bangunan usaha" },
    { key: "karyawan", label: "Mempekerjakan karyawan" },
    { key: "merek", label: "Perlu melindungi merek/brand" },
    { key: "eksporImpor", label: "Ekspor / impor barang" },
    { key: "asing", label: "Ada investor / pekerja asing" },
    { key: "tender", label: "Rencana ikut tender / proyek BUMN" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 items-start">
      <FadeUp className="rounded-xl border bg-card p-4 space-y-3.5">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center">
            <Sparkles className="size-4" />
          </div>
          <div>
            <p className="font-extrabold text-sm leading-none">Pencari Izin Cerdas</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Seperti tools di pusatperizinan.com — 100% transparan</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Sektor usaha</Label>
          <Select value={input.sektor} onValueChange={(v) => set("sektor", v)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SEKTOR_FINDER.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Skala usaha</Label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["UMKM", "MENENGAH", "BESAR"] as const).map((s) => (
              <button
                key={s}
                onClick={() => set("skala", s)}
                className={cn(
                  "rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors",
                  input.skala === s ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-muted"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {FLAGS.map((f) => (
            <label key={f.key} className="flex items-center gap-2.5 text-xs cursor-pointer group">
              <Checkbox checked={Boolean(input[f.key])} onCheckedChange={(c) => set(f.key, Boolean(c))} />
              <span className="group-hover:text-foreground text-muted-foreground transition-colors">{f.label}</span>
            </label>
          ))}
        </div>

        <Button className="w-full gap-1.5" onClick={() => setShown(true)}>
          <Sparkles className="size-4" /> Analisis Kebutuhan Izin
        </Button>
      </FadeUp>

      <div className="space-y-3 min-w-0">
        {!shown && (
          <FadeUp className="rounded-xl border border-dashed p-8 text-center">
            <Sparkles className="size-10 mx-auto text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold">Jawab 11 pertanyaan → dapatkan peta izin lengkap</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Mesin aturan meniru pemetaan konsultan: fondasi legalitas, izin sektor, izin lintas sektor —
              lengkap dengan prioritas, estimasi biaya, dan instansi tujuan.
            </p>
          </FadeUp>
        )}
        {shown && (
          <>
            <FadeUp className="rounded-xl border-2 border-emerald-700/25 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Estimasi biaya {hasil.length} izin (harga mulai)</p>
                <p className="text-2xl font-black tabular-nums text-emerald-800 dark:text-emerald-300">{rupiahShort(total)}</p>
              </div>
              <Button onClick={jadikanProyek} className="gap-1.5">
                <ArrowRight className="size-4" /> Masukkan Izin Prioritas ke Tracker
              </Button>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {hasil.map((h, i) => {
                const svc = serviceByKode(h.kode);
                if (!svc) return null;
                return (
                  <motion.div
                    key={h.kode}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
                    className="rounded-xl border bg-card p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <BadgeMini text={h.prioritas} tone={PRIORITAS_TONE[h.prioritas]} />
                      <span className="text-[11px] text-muted-foreground">{svc.instansi}</span>
                    </div>
                    <p className="font-bold text-sm mt-2">{svc.nama}</p>
                    <p className="text-xs text-muted-foreground mt-1">{h.alasan}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">{rupiahShort(svc.hargaMulai)}</span>
                      <span>{fmtDurasi(svc.durasiMin, svc.durasiMaks)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ══════ SECTION UTAMA ══════
export function PerizinanSection() {
  return (
    <div className="space-y-4">
      <FadeUp>
        <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-amber-950/30 dark:to-emerald-950/40 p-5">
          <h2 className="text-lg font-extrabold tracking-tight">🏛️ PERIZINAN — Mesin Konsultan</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Jantung bisnis Gunara Group: tracker pengurusan dengan alur <strong>5 langkah ISO 9001:2015</strong> (persis
            gunara.web.id), katalog 46 layanan lengkap harga &amp; durasi, plus Pencari Izin — replikasi tools AI
            pusatperizinan.com dengan aturan yang transparan.
          </p>
        </div>
      </FadeUp>

      <Tabs defaultValue="tracker">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="tracker" className="gap-1.5"><ClipboardList className="size-3.5" /> Tracker 5 Tahap</TabsTrigger>
          <TabsTrigger value="katalog" className="gap-1.5"><ScrollText className="size-3.5" /> Katalog 46 Layanan</TabsTrigger>
          <TabsTrigger value="finder" className="gap-1.5"><Sparkles className="size-3.5" /> Pencari Izin</TabsTrigger>
        </TabsList>
        <TabsContent value="tracker"><PermitTracker /></TabsContent>
        <TabsContent value="katalog"><ServiceCatalogTab /></TabsContent>
        <TabsContent value="finder"><LicenseFinderTab /></TabsContent>
      </Tabs>
    </div>
  );
}
