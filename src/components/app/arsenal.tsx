"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Globe, Bot, ShieldCheck, CalendarDays, Copy, Check, ScrollText, Sparkles,
  CheckCircle2, AlertTriangle, Wallet, TrendingUp, Zap, ShieldAlert, Clock,
  Lightbulb, Target, type LucideIcon,
} from "lucide-react";
import { RecordTable } from "./record-table";
import { useRecords, useSettings } from "./use-records";
import { FadeUp, CountUp, useMounted, useNow } from "./motion";
import { DOMAIN_CONFIG, fmtDate, rupiah, rupiahShort } from "@/lib/gunara";
import { cn } from "@/lib/utils";

// ═════════ DOMAIN MONEY ENGINE — 49 Domain, 49 Mesin Uang ═════════

type Row = Record<string, any>;

/** Sisa hari s/d tanggal `iso` (parsed zona LOKAL) relatif terhadap `now`.
 *  ATURAN ANTI-HYDRATION: panggil HANYA saat `mounted && now` (client-only). */
function diffDays(iso: string, now: Date): number {
  const t = new Date(iso + "T00:00:00").getTime();
  return Math.ceil((t - now.getTime()) / 86400000);
}

function sisaLabel(s: number | null): string {
  if (s === null || isNaN(s)) return "—";
  if (s < 0) return `lewat ${-s} hari`;
  if (s === 0) return "berakhir hari ini";
  return `${s} hari lagi`;
}

const KATEGORI_GRUP: { key: string; label: string }[] = [
  { key: "KONSULTAN", label: "💼 Konsultan & Perizinan" },
  { key: "AGENCY", label: "🏢 Agency Digital" },
  { key: "JASA", label: "🔧 Jasa & Otomotif" },
  { key: "PRODUK", label: "☕ Produk & F&B" },
  { key: "MEDIA", label: "📰 Media & Portal" },
  { key: "UMRAH", label: "🕋 Umrah & Spiritual" },
  { key: "PERSONAL", label: "👤 Personal Brand" },
];

const SISTEM_UANG: { emoji: string; judul: string; domains: string[]; strategi: string }[] = [
  { emoji: "💼", judul: "Mesin Leads Konsultan", domains: ["topkonsultan.web.id", "pusatperizinan.web.id", "gunara.web.id"], strategi: "Satu funnel: SEO perizinan → konsultasi WA → closing. Satu funnel, klien jutaan rupiah." },
  { emoji: "🏢", judul: "Agency Chain", domains: ["digiman.id", "juraganwebsite.web.id", "pppdigital.id", "pppbisnis.com"], strategi: "Rantai agency — website, ads, konten. Cross-sell antar lengan, satu pembukuan terpisah." },
  { emoji: "📰", judul: "AdSense Media Network", domains: ["cekhoax.web.id", "cektransparan.web.id", "ciamisraya.web.id", "dara.web.id", "evo.web.id", "telegroup.web.id", "gaa.web.id", "sgl.web.id", "visitpessel.web.id", "nusaparadise.id", "duasamudra.web.id", "165.web.id", "fk165.web.id"], strategi: "13 portal niche → traffic organik gratis → iklan programmatic, saling menyuntik otoritas SEO." },
  { emoji: "🕋", judul: "Kuartal Umrah", domains: ["arofahajj.com", "gohajj.web.id", "solusibaitullah.web.id", "medina.web.id", "medinagov.web.id", "gorefleksi.web.id", "suarasufi.web.id", "jiwaabdicinta.web.id", "enya.web.id", "enyanyahwa.web.id", "alhwda.web.id", "santriangon.web.id", "mehudi.or.id"], strategi: "Klaster spiritual: donasi, sponsor kajian, afiliasi travel — satu audiens, banyak pintu masuk." },
  { emoji: "🔧", judul: "Jasa Lokal WA-Landing", domains: ["berkatpendingin.web.id", "mandiripendingin.web.id", "juragankompresor.web.id", "gopijat.web.id", "pusatgeely.web.id", "semestaperdana.web.id", "tirtasejukabadi.web.id"], strategi: "Landing 1 halaman + tombol WA: servis, jual, sewa — closing cepat, margin jasa langsung." },
  { emoji: "☕", judul: "Produk & F&B", domains: ["kopnusa.id", "bambuwater.web.id", "degerasia.web.id", "mesita.id"], strategi: "Katalog produk + pemesanan WA — margin langsung per botol, per cangkir, per porsi." },
  { emoji: "👤", judul: "Personal Brand", domains: ["gunara.web.id", "prabudanling.web.id", "dr-fatriidana.my.id", "muhdin.web.id"], strategi: "Otoritas pribadi = pipa konsultasi premium, speaking, dan kemitraan tanpa biaya iklan." },
];

const AKSI_MINGGU: { lingkaran: string; isi: ReactNode }[] = [
  { lingkaran: "bg-rose-600 text-white", isi: <>Tebus <strong className="text-rose-700 dark:text-rose-300">pppbisnis.com</strong> — <strong>Rp 215rb</strong> <span className="font-extrabold text-rose-700 dark:text-rose-300">SEKARANG</span>, atau domain hilang selamanya.</> },
  { lingkaran: "bg-amber-500 text-white", isi: <>Bayar <strong>3 tagihan</strong> domain berstatus MENUNGGU (mehudi.or.id · juragankompresor.web.id · gopijat.web.id) — total <strong>Rp 165rb</strong>.</> },
  { lingkaran: "bg-sky-600 text-white", isi: <>Aktifkan <strong>auto-kredit</strong> di registrar untuk semua domain AKTIF — perpanjangan tidak boleh lagi jadi drama tahunan.</> },
  { lingkaran: "bg-emerald-600 text-white", isi: <>Pilih <strong>1 domain INTI</strong> &amp; bangun blueprintnya minggu ini — satu yang matang mengalahkan sembilan yang hambar.</> },
];

function StatusBadge({ value }: { value: string }) {
  return (
    <Badge variant="outline" className={cn(
      "shrink-0 border",
      value === "AKTIF" && "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300",
      value === "MENUNGGU" && "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300",
      value === "REDEMPTION" && "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300",
    )}>{value || "—"}</Badge>
  );
}

function KpiCard({ icon: Icon, label, tone, children }: {
  icon: LucideIcon; label: string; tone?: "emerald" | "amber"; children: ReactNode;
}) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon className={cn("size-3.5 shrink-0",
            tone === "emerald" && "text-emerald-600 dark:text-emerald-400",
            tone === "amber" && "text-amber-600 dark:text-amber-400")} aria-hidden />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground truncate">{label}</span>
        </div>
        <div className={cn("mt-1.5 font-mono text-2xl font-extrabold tabular-nums",
          tone === "emerald" && "text-emerald-700 dark:text-emerald-400",
          tone === "amber" && "text-amber-700 dark:text-amber-400")}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

function DomainCard({ d, onOpen }: { d: Row; onOpen: (d: Row) => void }) {
  const redemption = d.regStatus === "REDEMPTION";
  return (
    <Card className={cn("border shadow-sm",
      d.regStatus && d.regStatus !== "AKTIF" && (redemption ? "ring-2 ring-rose-400/70" : "ring-2 ring-amber-400/60"))}>
      <CardContent className="p-4 flex flex-col">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <p className="font-bold text-sm break-words min-w-0">{d.nama}</p>
          <div className="flex flex-wrap justify-end gap-1 shrink-0">
            <StatusBadge value={d.regStatus || "—"} />
            <Badge variant="outline">{d.kategori || "—"}</Badge>
          </div>
        </div>
        <p className="mt-2 font-mono text-lg font-extrabold text-emerald-700 dark:text-emerald-400 break-words">
          {rupiahShort(d.potensiRp)}<span className="text-xs font-semibold text-muted-foreground">/bln</span>
        </p>
        <p className="text-[11px] text-muted-foreground">↻ {rupiahShort(d.hargaPerpanjangan)}/thn</p>
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{d.peran || "—"}</p>
        <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => onOpen(d)}>
          Lihat Blueprint
        </Button>
      </CardContent>
    </Card>
  );
}

function BlueprintDialog({ item, onClose }: { item: Row | null; onClose: () => void }) {
  const mounted = useMounted();
  const now = useNow();
  const [copied, setCopied] = useState(false);

  const sisa = item?.berakhir && mounted && now ? diffDays(item.berakhir, now) : null;

  const copy = async () => {
    if (!item) return;
    const teks = [
      `BLUEPRINT ${item.nama}`,
      `Peran: ${item.peran || "—"}`,
      `Status registrar: ${item.regStatus || "—"}`,
      `Potensi/bulan: ${rupiah(item.potensiRp)}`,
      `Biaya perpanjangan/tahun: ${rupiah(item.hargaPerpanjangan)}`,
      `Berakhir: ${fmtDate(item.berakhir)} (${sisaLabel(sisa)})`,
      "",
      "APA ISI WEBSITE INI:",
      item.isiWebsite || "—",
      "",
      "CARA MENGHASILKAN UANG:",
      item.monetisasi || "—",
      ...(item.catatan ? ["", `Catatan: ${item.catatan}`] : []),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(teks);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard ditolak */ }
  };

  return (
    <Dialog open={item !== null} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-2xl" aria-label={item ? `Blueprint ${item.nama}` : "Blueprint domain"}>
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2 break-words min-w-0">
            <span className="break-words min-w-0">{item?.nama}</span>
            {item && <StatusBadge value={item.regStatus || "—"} />}
          </DialogTitle>
          <DialogDescription>{item?.peran || "Blueprint konten & strategi monetisasi domain ini."}</DialogDescription>
        </DialogHeader>
        {item && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted p-3 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Potensi / Bulan</p>
                <p className="font-mono text-xl font-extrabold text-emerald-700 dark:text-emerald-400 break-words">{rupiah(item.potensiRp)}</p>
              </div>
              <div className="rounded-lg bg-muted p-3 min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Biaya / Tahun</p>
                <p className="font-mono text-xl font-extrabold break-words">{rupiahShort(item.hargaPerpanjangan)}</p>
              </div>
              <div className="rounded-lg bg-muted p-3 col-span-2 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">Berakhir: <strong className="text-foreground">{fmtDate(item.berakhir)}</strong></p>
                <Badge variant="outline" className={cn(
                  sisa !== null && !isNaN(sisa) && sisa <= 90 && "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300",
                )}>{sisaLabel(sisa)}</Badge>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">Apa isi website ini</p>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {item.isiWebsite || "Belum diisi — tulis blueprint halaman, konten, dan fiturnya."}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-400 mb-1.5">Cara menghasilkan uang</p>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg p-3">
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {item.monetisasi || "Belum diisi — definisikan strategi monetisasinya."}
                </p>
              </div>
            </div>

            {item.catatan && (
              <p className="italic text-xs text-amber-700 dark:text-amber-400 break-words">{item.catatan}</p>
            )}

            <Button onClick={copy} className="w-full sm:w-auto" aria-label={`Salin blueprint ${item.nama}`}>
              {copied ? <Check className="size-4 mr-1.5" /> : <Copy className="size-4 mr-1.5" />}
              {copied ? "Tersalin!" : "Salin Blueprint"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function DomainsSection() {
  const domain = useRecords("domain");
  const [view, setView] = useState<Row | null>(null);
  const mounted = useMounted();
  const now = useNow();

  // ── KPI (useMemo, tanpa Date → aman hydration) ──
  const kpi = useMemo(() => {
    const items = domain.items;
    const biaya = items.reduce((a: number, d: Row) => a + (Number(d.hargaPerpanjangan) || 0), 0);
    const potensi = items.reduce((a: number, d: Row) => a + (Number(d.potensiRp) || 0), 0);
    return {
      total: items.length,
      aktif: items.filter((d: Row) => d.regStatus === "AKTIF").length,
      perluBayar: items.filter((d: Row) => d.regStatus && d.regStatus !== "AKTIF").length,
      biaya,
      potensi,
      roi: biaya > 0 ? (potensi * 12) / biaya : 0,
    };
  }, [domain.items]);

  // ── Data alert aksi segera ──
  const redemptions = useMemo(() => domain.items.filter((d: Row) => d.regStatus === "REDEMPTION"), [domain.items]);
  const menunggu = useMemo(() => domain.items.filter((d: Row) => d.regStatus === "MENUNGGU"), [domain.items]);
  const tagihanTotal = useMemo(
    () => menunggu.reduce((a: number, d: Row) => a + (Number(d.hargaPerpanjangan) || 0), 0),
    [menunggu],
  );

  // Sisa hari dihitung HANYA saat mounted (anti-hydration) — sebelum mount: tanpa chip tanggal
  const expiring = useMemo(() => {
    if (!mounted || !now) return [];
    return domain.items
      .filter((d: Row) => d.regStatus === "AKTIF" && d.berakhir)
      .map((d: Row) => ({ d, sisa: diffDays(d.berakhir, now) }))
      .filter((x: { d: Row; sisa: number }) => !isNaN(x.sisa) && x.sisa <= 90)
      .sort((a: { sisa: number }, b: { sisa: number }) => a.sisa - b.sisa);
  }, [domain.items, mounted, now]);

  // ── Grouping blueprint per kategori (urutan tetap) ──
  const grouped = useMemo(() => {
    const groups = KATEGORI_GRUP.map(({ key, label }) => ({ key, label, items: [] as Row[], subtotal: 0 }));
    const sisa: Row[] = [];
    for (const d of domain.items) {
      const g = groups.find((x) => x.key === d.kategori);
      if (g) { g.items.push(d); g.subtotal += Number(d.potensiRp) || 0; }
      else sisa.push(d);
    }
    return { groups: groups.filter((g) => g.items.length > 0), sisa };
  }, [domain.items]);

  // ── Potensi gabungan tiap sistem uang (data-driven dari DB) ──
  const sistemPotensi = useMemo(() => {
    const m: Record<string, number> = {};
    for (const d of domain.items) m[d.nama] = Number(d.potensiRp) || 0;
    return SISTEM_UANG.map((s) => ({ ...s, potensi: s.domains.reduce((a, n) => a + (m[n] || 0), 0) }));
  }, [domain.items]);

  return (
    <div className="space-y-4">
      {/* 1. HERO */}
      <FadeUp>
        <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-extrabold tracking-tight min-w-0 break-words">🌐 Domain Money Engine — 49 Domain, 49 Mesin Uang</h2>
            <Badge variant="outline" className="shrink-0 border-emerald-800/30 bg-emerald-900 text-amber-200 dark:bg-emerald-900 dark:text-amber-300 text-[10px] uppercase tracking-wider">
              v9.3 Domain Money Engine
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Setiap domain bukan sekadar alamat — ia punya misi, blueprint konten, strategi monetisasi, dan target revenue sendiri.
            Buka blueprint-nya, jalankan mesinnya, ukur uangnya.
          </p>
        </div>
      </FadeUp>

      {/* 2. KPI STRIP */}
      <FadeUp delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard icon={Globe} label="Total Domain">
            <CountUp value={kpi.total} format={(n) => String(Math.round(n))} />
          </KpiCard>
          <KpiCard icon={CheckCircle2} label="Aktif" tone="emerald">
            <CountUp value={kpi.aktif} format={(n) => String(Math.round(n))} />
          </KpiCard>
          <KpiCard icon={AlertTriangle} label="Perlu Bayar" tone="amber">
            <CountUp value={kpi.perluBayar} format={(n) => String(Math.round(n))} />
          </KpiCard>
          <KpiCard icon={Wallet} label="Biaya / Tahun">
            <CountUp value={kpi.biaya} format={(n) => rupiahShort(Math.round(n))} />
          </KpiCard>
          <KpiCard icon={TrendingUp} label="Potensi / Bulan" tone="emerald">
            <CountUp value={kpi.potensi} format={(n) => rupiahShort(Math.round(n))} />
          </KpiCard>
          <KpiCard icon={Zap} label="ROI Tahunan" tone="emerald">
            <CountUp value={kpi.roi} format={(n) => `×${n.toFixed(1)}`} />
          </KpiCard>
        </div>
      </FadeUp>

      {/* 3. ALERT AKSI SEGERA */}
      {(redemptions.length > 0 || menunggu.length > 0 || expiring.length > 0) && (
        <FadeUp delay={0.05}>
          <Card className="border border-rose-300 dark:border-rose-900 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden />
                <p className="font-bold text-sm text-rose-700 dark:text-rose-300">Aksi Segera — aset &amp; uang yang bisa hilang</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {redemptions.map((d: Row) => (
                  <span key={d.id} className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                    <ShieldAlert className="size-3.5 shrink-0" aria-hidden />
                    <span className="break-words min-w-0">{d.nama} REDEMPTION — Tebus {rupiahShort(d.hargaPerpanjangan)} SEKARANG atau HILANG</span>
                  </span>
                ))}
                {menunggu.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                    <Wallet className="size-3.5 shrink-0" aria-hidden />
                    <span className="break-words min-w-0">Bayar tagihan {rupiahShort(tagihanTotal)} — {menunggu.map((d: Row) => d.nama).join(", ")}</span>
                  </span>
                )}
                {expiring.map(({ d, sisa }) => (
                  <span key={d.id} className="inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300">
                    <Clock className="size-3.5 shrink-0" aria-hidden />
                    <span className="break-words min-w-0">{d.nama} · {sisaLabel(sisa)}</span>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      )}

      {/* 4. TABS */}
      <FadeUp delay={0.05}>
        <Tabs defaultValue="blueprint">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="blueprint" className="gap-1.5">💰 Blueprint Uang</TabsTrigger>
            <TabsTrigger value="dewan" className="gap-1.5">💡 Dewan Monetisasi</TabsTrigger>
            <TabsTrigger value="data" className="gap-1.5">📋 Kelola Data</TabsTrigger>
          </TabsList>

          {/* TAB 1 — BLUEPRINT UANG */}
          <TabsContent value="blueprint" className="space-y-5">
            {grouped.groups.map((g) => (
              <div key={g.key}>
                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                  <h3 className="font-bold text-sm">{g.label}</h3>
                  <Badge variant="outline" className="text-[10px]">{g.items.length} domain</Badge>
                  <span className="text-xs text-muted-foreground">potensi <strong className="text-emerald-700 dark:text-emerald-400">{rupiahShort(g.subtotal)}</strong>/bln</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {g.items.map((d) => <DomainCard key={d.id} d={d} onOpen={setView} />)}
                </div>
              </div>
            ))}
            {grouped.sisa.length > 0 && (
              <div>
                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                  <h3 className="font-bold text-sm">◇ Belum Dikategorikan</h3>
                  <Badge variant="outline" className="text-[10px]">{grouped.sisa.length} domain</Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {grouped.sisa.map((d) => <DomainCard key={d.id} d={d} onOpen={setView} />)}
                </div>
              </div>
            )}
          </TabsContent>

          {/* TAB 2 — DEWAN MONETISASI */}
          <TabsContent value="dewan" className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="size-4 text-amber-500 shrink-0" aria-hidden />
                <h3 className="font-bold text-sm">7 Sistem Uang dari 49 Domain</h3>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {sistemPotensi.map((s) => (
                  <Card key={s.judul} className="border shadow-sm">
                    <CardContent className="p-4">
                      <p className="text-xl" aria-hidden>{s.emoji}</p>
                      <p className="font-bold text-sm mt-1">{s.judul}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {s.domains.map((n) => (
                          <span key={n} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground break-words">{n}</span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{s.strategi}</p>
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-2">Potensi gabungan: {rupiahShort(s.potensi)}/bln</p>
                    </CardContent>
                  </Card>
                ))}
                <Card className="border shadow-sm ring-1 ring-emerald-300 dark:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <CardContent className="p-4">
                    <p className="text-xl" aria-hidden>🎯</p>
                    <p className="font-bold text-sm mt-1">Aturan Emas</p>
                    <p className="text-sm leading-relaxed mt-2 text-emerald-900 dark:text-emerald-200">
                      3-6 inti dulu, sisanya gateway — jangan bangun 49 website sekaligus; satu yang matang mengalahkan sembilan yang hambar.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="border shadow-sm">
              <div className="px-5 py-3 border-b bg-muted/50 font-bold text-sm flex items-center gap-2">
                <Target className="size-4 shrink-0" aria-hidden /> Aksi Cepat Minggu Ini
              </div>
              <CardContent className="p-4">
                <ul className="space-y-3">
                  {AKSI_MINGGU.map((a, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className={cn("flex-none size-7 rounded-full text-xs font-extrabold flex items-center justify-center", a.lingkaran)}>{i + 1}</span>
                      <p className="text-sm leading-relaxed min-w-0 break-words pt-0.5">{a.isi}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3 — KELOLA DATA */}
          <TabsContent value="data">
            <RecordTable
              config={DOMAIN_CONFIG}
              rows={domain.items}
              loading={domain.loading}
              onCreate={domain.create}
              onUpdate={domain.update}
              onDelete={domain.remove}
            />
          </TabsContent>
        </Tabs>
      </FadeUp>

      <BlueprintDialog item={view} onClose={() => setView(null)} />
    </div>
  );
}

// ═════════ 15 AI AGENTS ═════════
export function AgentsSection() {
  const agent = useRecords("agent");
  const [view, setView] = useState<{ nama: string; prompt: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const g: Record<number, typeof agent.items> = { 1: [], 2: [], 3: [] };
    for (const a of agent.items) (g[a.gelombang] = g[a.gelombang] || []).push(a);
    return g;
  }, [agent.items]);

  const waveMeta: Record<number, { title: string; desc: string }> = {
    1: { title: "GELOMBANG 1 — Aktif Sekarang", desc: "5 agents kerja harian: manajemen, uang, klien, konten, jiwa." },
    2: { title: "GELOMBANG 2 — Aktif Fase 2", desc: "5 agents pendukung: legal, kode, sosmed, riset, LinkedIn." },
    3: { title: "GELOMBANG 3 — Aktif Fase 3", desc: "5 agents skala: video, desain, Wikipedia, domain, belajar." },
  };

  const copy = async (nama: string, prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(nama);
      setTimeout(() => setCopied(null), 1500);
    } catch { /* clipboard ditolak */ }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">🤖 AI Agent Army — 15 Agents, 3 Gelombang</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Satu AI = Satu Ahli. Prinsip Emas: jangan pakai satu AI untuk semua. Ini seperti tim konsultan sungguhan.
          Tekan &quot;Lihat Prompt&quot; untuk menyalin role activation ke AI mana pun (ChatGPT, Claude, Gemini).
        </p>
      </div>

      {([1, 2, 3] as const).map((wave) => (
        <div key={wave} className="space-y-3">
          <div>
            <h3 className="font-bold text-sm">{waveMeta[wave].title}</h3>
            <p className="text-xs text-muted-foreground">{waveMeta[wave].desc}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(grouped[wave] || []).map((a) => (
              <Card key={a.id} className="border shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="rounded-lg bg-emerald-900 text-amber-300 p-1.5"><Bot className="size-4" /></div>
                      <div>
                        <p className="font-bold text-sm leading-tight">{String(a.nomor).padStart(2, "0")}. {a.nama}</p>
                        <p className="text-xs text-muted-foreground">{a.platform}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 min-h-[2rem]">{a.tupoksi}</p>
                  <div className="flex gap-1.5 mt-3">
                    <Button size="sm" variant="outline" className="h-7 text-xs flex-1" onClick={() => setView({ nama: a.nama, prompt: a.prompt })}>
                      Lihat Prompt
                    </Button>
                    <Button size="sm" variant="secondary" className="h-7 text-xs px-2" onClick={() => copy(a.nama, a.prompt)}>
                      {copied === a.nama ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Dialog open={Boolean(view)} onOpenChange={(v) => !v && setView(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="size-4 text-amber-500" /> Role Activation — {view?.nama}</DialogTitle>
            <DialogDescription>Copy prompt ini ke awal percakapan dengan AI mana pun.</DialogDescription>
          </DialogHeader>
          <pre className="text-xs bg-muted rounded-lg p-4 whitespace-pre-wrap font-mono max-h-[50vh] overflow-y-auto nice-scroll">{view?.prompt}</pre>
          <Button onClick={() => view && copy(view.nama, view.prompt)}>
            {copied === view?.nama ? <Check className="size-4 mr-1" /> : <Copy className="size-4 mr-1" />}
            {copied === view?.nama ? "Tersalin!" : "Copy Prompt"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ═════════ SISTEM: Aturan Mutlak, Pola Mingguan, Protokol Hari Buruk, Master Prompt, Stack ═════════
const POLA_MINGGUAN = [
  { hari: "Senin", fokus: "CEO Day", catatan: "Strategi, dokumen, bangun mesin (FORTRESS). Minimal 3 jam deep work.", emoji: "🏛️" },
  { hari: "Selasa", fokus: "Sales Day", catatan: "Follow-up leads, outreach, closing. Telepon/WA 5 prospek.", emoji: "📞" },
  { hari: "Rabu", fokus: "Build Day", catatan: "Eksekusi proyek + konten (reels/artikel). 1 konten tayang.", emoji: "🔨" },
  { hari: "Kamis", fokus: "Sales Day 2", catatan: "Sales + mitra (notaris, LSPro, jaringan). Relasi = pipa leads.", emoji: "🤝" },
  { hari: "Jumat", fokus: "Admin & Cash Day", catatan: "Invoicing, pembukuan, tuntaskan. Uang tidak boleh kacau.", emoji: "💵" },
  { hari: "Sabtu", fokus: "Anak Day Penuh", catatan: "Bisnis hanya urusan darurat. Non-negotiable.", emoji: "👶" },
  { hari: "Minggu", fokus: "Keluarga + Weekly Review", catatan: "Pagi: keluarga. Malam: Weekly Review 30 menit — rapat dengan manager.", emoji: "🌙" },
];

const STACK = [
  { layer: "🧠 Otak (AI)", items: ["ChatGPT — brainstorming & strategi", "Claude — long-form writing & coding", "Gemini — riset & data", "chat.z.ai — generate kode website", "GitHub Copilot — inline coding IDE"] },
  { layer: "📊 Struktur", items: ["Notion — second brain", "ClickUp — project management", "Google Sheets — CRM & keuangan", "Google Calendar — time blocking"] },
  { layer: "💾 Storage", items: ["Google Drive — file reguler 15GB", "TeraBox — file raksasa 1TB", "GitHub — kode + backup docs"] },
  { layer: "💬 Komunikasi", items: ["WhatsApp Business — klien & closing"] },
  { layer: "🎨 Konten", items: ["Canva — desain", "IG + TikTok — video utama", "X — thoughts cepat", "LinkedIn — B2B (paling penting)", "Medium — artikel panjang"] },
  { layer: "🔐 Security", items: ["Bitwarden — semua kredensial"] },
];

export function SystemSection() {
  const { values, save } = useSettings(["masterPrompt", "protokolHariBuruk", "aturanMutlak"]);
  const [copied, setCopied] = useState(false);
  const [editPrompt, setEditPrompt] = useState(false);
  const [draft, setDraft] = useState("");

  const aturan: string[] = useMemo(() => {
    try { return JSON.parse(values.aturanMutlak || "[]"); } catch { return []; }
  }, [values.aturanMutlak]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(values.masterPrompt || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">🛡️ SISTEM — Aturan, Ritual & Senjata</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Kamu tidak butuh seseorang yang mengelola hidupmu. <strong>Kamu butuh sistem yang membuatmu tidak bisa menipu dirimu sendiri.</strong>
        </p>
      </div>

      <Tabs defaultValue="aturan">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="aturan" className="gap-1.5"><ShieldCheck className="size-3.5" /> Aturan Mutlak</TabsTrigger>
          <TabsTrigger value="mingguan" className="gap-1.5"><CalendarDays className="size-3.5" /> Pola Mingguan</TabsTrigger>
          <TabsTrigger value="buruk" className="gap-1.5"><ScrollText className="size-3.5" /> Hari Buruk</TabsTrigger>
          <TabsTrigger value="prompt" className="gap-1.5"><Sparkles className="size-3.5" /> Master Prompt</TabsTrigger>
          <TabsTrigger value="stack" className="gap-1.5">🧰 Gunara Stack</TabsTrigger>
        </TabsList>

        <TabsContent value="aturan">
          <div className="grid sm:grid-cols-2 gap-3">
            {aturan.map((a, i) => (
              <Card key={i} className="border shadow-sm">
                <CardContent className="p-4 flex gap-3 items-start">
                  <span className="flex-none size-8 rounded-full bg-gradient-to-br from-emerald-800 to-emerald-600 text-amber-200 text-sm font-extrabold flex items-center justify-center">{i + 1}</span>
                  <p className="text-sm font-medium leading-relaxed pt-1">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mingguan">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {POLA_MINGGUAN.map((d) => (
              <Card key={d.hari} className={cn("border shadow-sm", d.hari === "Sabtu" && "ring-2 ring-amber-400/60")}>
                <CardContent className="p-4">
                  <p className="text-2xl">{d.emoji}</p>
                  <p className="font-extrabold mt-1">{d.hari}</p>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">{d.fokus}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{d.catatan}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Ritual bulanan (tanggal 1): update angka context · review backlog · isi kolom hasil decisions log · transfer % tetap ke rekening anak-anak — nama rekening: pendidikan mereka. Ini bukan keuangan, ini janji.</p>
        </TabsContent>

        <TabsContent value="buruk">
          <Card className="border-2 border-rose-200 dark:border-rose-900 shadow-sm">
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-wider font-bold text-rose-600 dark:text-rose-400 mb-3">Protokol Hari Buruk — Karena PASTI Ada</p>
              <pre className="text-sm whitespace-pre-wrap leading-relaxed font-sans">{values.protokolHariBuruk}</pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompt">
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-2 mb-3">
                <Button size="sm" onClick={copyPrompt}>
                  {copied ? <Check className="size-4 mr-1" /> : <Copy className="size-4 mr-1" />} {copied ? "Tersalin!" : "Copy Master Prompt"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setDraft(values.masterPrompt || ""); setEditPrompt(true); }}>Edit Prompt</Button>
              </div>
              <pre className="text-xs bg-muted rounded-lg p-4 whitespace-pre-wrap font-mono leading-relaxed max-h-[55vh] overflow-y-auto nice-scroll">{values.masterPrompt}</pre>
            </CardContent>
          </Card>
          <Dialog open={editPrompt} onOpenChange={setEditPrompt}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader><DialogTitle>Edit Master Prompt</DialogTitle></DialogHeader>
              <textarea className="text-xs bg-muted rounded-lg p-4 font-mono min-h-[50vh] nice-scroll border" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <Button onClick={async () => { await save("masterPrompt", draft); setEditPrompt(false); }}>Simpan</Button>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="stack">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {STACK.map((s) => (
              <Card key={s.layer} className="border shadow-sm">
                <CardContent className="p-4">
                  <p className="font-bold text-sm">{s.layer}</p>
                  <ul className="mt-2 space-y-1.5">
                    {s.items.map((i) => <li key={i} className="text-xs text-muted-foreground leading-relaxed">▸ {i}</li>)}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ═════════ ROADMAP 90 HARI + FASE ═════════
const FASES = [
  { no: "0", nama: "Darurat & Fondasi", waktu: "Hari 1–3", isi: "Perpanjang pppbisnis.com · cek mehudi.or.id · email profesional · repo GitHub + 14 dokumen · WA Business · Google Business Profile 2 PT · aset dasar · 3 mitra kunci", gate: "pppbisnis aktif · email jalan · repo hidup · WA Business lengkap · GBP terdaftar" },
  { no: "1", nama: "FORTRESS — topkonsultan.web.id", waktu: "Minggu 1–3", isi: "Design system approve · homepage + 6 halaman layanan · form konsultasi · 3 artikel SEO · QA penuh · DEPLOY + SSL · GA4 + Search Console", gate: "live semua device · form terkirim · WA masuk label benar · Lighthouse ≥ 90" },
  { no: "2", nama: "Mesin Leads & Wajah", waktu: "Minggu 4–6", isi: "pusatperizinan struktur blog · 10 artikel SEO · internal linking · gunara.web.id personal brand · 3 reels/minggu · lead magnet PDF", gate: "terindeks Google · gunara live · 10+12 konten tayang" },
  { no: "3", nama: "DIGIMAN — Mesin Kedua", waktu: "Minggu 6–9", isi: "digiman.id live · juraganwebsite (Website Jadi 7 Hari) · redirect digiman.web.id · bundling 'Paket Usaha Siap Tempur' · pembukuan terpisah", gate: "2 website live · redirect jalan · pembukuan aktif" },
  { no: "4", nama: "Interkoneksi Total", waktu: "Minggu 9–12", isi: "12 gateway pages (template, noindex) · redirect 301 · cross-domain tracking GA4 · audit link internal · keputusan domain parkir", gate: "12 gateway live · tracking tercatat · inti saling terhubung natural" },
  { no: "5", nama: "Optimasi & Vertikal", waktu: "Bulan 4–6", isi: "Analisis data artikel · skala konten 40 artikel · uji iklan kecil Rp 300-500rb · cektransparan aktif · 5 testimoni pertama", gate: "keputusan berbasis data, bukan perasaan" },
];

const KALENDER_90 = [
  ["Minggu 1", "🚨 FASE 0 (darurat + fondasi) + mulai design system"],
  ["Minggu 2", "🏛️ Build homepage + halaman layanan FORTRESS"],
  ["Minggu 3", "🏛️ Sisa halaman + konten + QA + DEPLOY ⭐ WEBSITE 1 LIVE"],
  ["Minggu 4", "🔍 pusatperizinan struktur + mulai 10 artikel"],
  ["Minggu 5", "🔍 Lanjut artikel + 👤 gunara.web.id build"],
  ["Minggu 6", "👤 gunara live ⭐ + lead magnet + 12 reels tayang → GATE 2"],
  ["Minggu 7", "💻 digiman.id build"],
  ["Minggu 8", "💻 digiman.id + juraganwebsite + redirect + bundling"],
  ["Minggu 9", "💻 Launch ⭐ WEBSITE 4-5 LIVE + pembukuan → GATE 3"],
  ["Minggu 10", "🕸️ Template gateway + deploy 6 gateway pertama"],
  ["Minggu 11", "🕸️ 6 gateway berikutnya + tracking lintas domain"],
  ["Minggu 12", "🕸️ Audit interkoneksi + keputusan domain + REVIEW 90 HARI → GATE 4"],
];

const TARGET_FINANSIAL = [
  ["Fase 1 (hari 1-30)", "Income stabil 10–15 juta/bulan"],
  ["Fase 2 (hari 31-90)", "Income 15–25 juta/bulan"],
  ["Fase 3 (hari 91-180)", "Income 25–40 juta/bulan"],
  ["Fase 4 (hari 181-365)", "Income 40–60 juta/bulan"],
  ["Tahun 2", "Menuju level sebelumnya (miliaran) — TAPI TIDAK RUNTUH"],
];

export function RoadmapSection() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">🎯 Gunara Grand Build — Roadmap 90 Hari + Ekspansi 12 Bulan</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Bukan bangun 42 website sekaligus — itu resep 42 website setengah jadi.
          Fokus seperti sinar matahari lewat kaca pembesar: <strong>satu titik sampai terbakar.</strong>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {FASES.map((f) => (
          <Card key={f.no} className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex-none size-9 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-600 text-amber-200 font-extrabold flex items-center justify-center">{f.no}</span>
                <div>
                  <p className="font-extrabold text-sm">{f.nama}</p>
                  <p className="text-xs text-muted-foreground">{f.waktu}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{f.isi}</p>
              <div className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-2.5 text-xs">
                <strong className="text-emerald-800 dark:text-emerald-300">GATE {f.no} LULUS JIKA:</strong> {f.gate}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border shadow-sm">
          <div className="px-5 py-3 border-b bg-muted/50 font-bold text-sm flex items-center gap-2"><CalendarDays className="size-4" /> Kalender 90 Hari</div>
          <CardContent className="p-4 space-y-2 max-h-96 overflow-y-auto nice-scroll">
            {KALENDER_90.map(([mg, isi]) => (
              <div key={mg} className="flex gap-3 text-sm">
                <span className="flex-none w-20 text-xs font-bold text-emerald-800 dark:text-emerald-400 pt-0.5">{mg}</span>
                <span className="text-xs text-muted-foreground leading-relaxed">{isi}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <div className="px-5 py-3 border-b bg-muted/50 font-bold text-sm flex items-center gap-2"><CalendarDays className="size-4" /> Target Finansial Bertahap — Jangan Lompat</div>
          <CardContent className="p-4 space-y-2">
            {TARGET_FINANSIAL.map(([f, t]) => (
              <div key={f} className="flex gap-3 text-sm">
                <span className="flex-none w-36 text-xs font-bold text-emerald-800 dark:text-emerald-400 pt-0.5">{f}</span>
                <span className="text-xs text-muted-foreground leading-relaxed">{t}</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
              Kebenaran yang tidak enak tapi membebaskan: jalan kembali ke miliaran = 24–36 bulan eksekusi disiplin, BUKAN 90 hari. Dan itu BAIK — karena kali ini uangnya menempel pada sistem.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border shadow-sm">
        <div className="px-5 py-3 border-b bg-muted/50 font-bold text-sm flex items-center gap-2"><CalendarDays className="size-4" /> Tanggal Penting Terdata</div>
        <CardContent className="p-4 text-xs text-muted-foreground leading-relaxed space-y-1">
          <p>• Win Log terakhir: {fmtDate("2026-10-01")} — 98% hutang dilunasi (dari 41 miliar tinggal 769 juta terjadwal).</p>
          <p>• Data keuangan riil diinput di Mesin 1 — data menakutkan hanya sebelum ditulis; setelah ditulis ia jadi jadwal.</p>
        </CardContent>
      </Card>
    </div>
  );
}
