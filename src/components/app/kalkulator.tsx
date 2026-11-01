"use client";

// ═══════════════════════════════════════════════════════════════
// 🧮 KALKULATOR BISNIS — 5 kalkulator instan (v10.0 OMNISCIENT)
// ═══════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeUp } from "./motion";

const rp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0);

function Field({ label, value, onChange, suffix }: { label: string; value: number; onChange: (n: number) => void; suffix?: string }) {
  return (
    <label className="block text-xs font-medium text-muted-foreground">
      {label}
      <div className="relative mt-1">
        <Input
          type="number"
          className="pr-12"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{suffix}</span>}
      </div>
    </label>
  );
}

function Hasil({ rows }: { rows: [string, string][] }) {
  return (
    <div className="mt-3 space-y-1.5 rounded-lg border bg-muted/30 p-3">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{k}</span>
          <span className="font-black tabular-nums">{v}</span>
        </div>
      ))}
    </div>
  );
}

function Beb() {
  const [biayaTetap, setBT] = useState(10_000_000);
  const [harga, setHarga] = useState(150_000);
  const [biayaVariabel, setBV] = useState(50_000);
  const marginUnit = harga - biayaVariabel;
  const bepUnit = marginUnit > 0 ? Math.ceil(biayaTetap / marginUnit) : NaN;
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Field label="Biaya tetap / bulan" value={biayaTetap} onChange={setBT} suffix="Rp" />
      <Field label="Harga jual / unit" value={harga} onChange={setHarga} suffix="Rp" />
      <Field label="Biaya variabel / unit" value={biayaVariabel} onChange={setBV} suffix="Rp" />
      <div className="md:col-span-3">
        <Hasil rows={[
          ["Margin kontribusi / unit", rp(marginUnit)],
          ["BEP (unit)", Number.isFinite(bepUnit) ? `${bepUnit} unit / bulan` : "— harga ≤ biaya variabel"],
          ["BEP (rupiah)", Number.isFinite(bepUnit) ? rp(bepUnit * harga) : "—"],
        ]} />
      </div>
    </div>
  );
}

function MarginKalk() {
  const [modal, setModal] = useState(60_000);
  const [harga, setHarga] = useState(100_000);
  const margin = harga - modal;
  const marginPct = harga > 0 ? (margin / harga) * 100 : 0;
  const markupPct = modal > 0 ? (margin / modal) * 100 : 0;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Modal / biaya per unit" value={modal} onChange={setModal} suffix="Rp" />
      <Field label="Harga jual per unit" value={harga} onChange={setHarga} suffix="Rp" />
      <div className="md:col-span-2">
        <Hasil rows={[
          ["Margin per unit", rp(margin)],
          ["Margin (dari harga)", `${marginPct.toFixed(1)}%`],
          ["Markup (dari modal)", `${markupPct.toFixed(1)}%`],
        ]} />
        <p className="mt-2 text-[11px] text-muted-foreground">Margin dihitung dari harga jual; markup dihitung dari modal — jangan tertukar saat negosiasi.</p>
      </div>
    </div>
  );
}

function RoiKalk() {
  const [investasi, setInv] = useState(50_000_000);
  const [untungBulan, setUb] = useState(12_500_000);
  const roi = investasi > 0 ? (untungBulan / investasi) * 100 : 0;
  const payback = untungBulan > 0 ? investasi / untungBulan : NaN;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Investasi awal" value={investasi} onChange={setInv} suffix="Rp" />
      <Field label="Keuntungan / bulan" value={untungBulan} onChange={setUb} suffix="Rp" />
      <div className="md:col-span-2">
        <Hasil rows={[
          ["ROI bulanan", `${roi.toFixed(1)}%`],
          ["ROI tahunan (proyeksi)", `${(roi * 12).toFixed(1)}%`],
          ["Payback period", Number.isFinite(payback) ? `${payback.toFixed(1)} bulan` : "—"],
        ]} />
      </div>
    </div>
  );
}

function AnuitasKalk() {
  const [pokok, setPokok] = useState(100_000_000);
  const [bunga, setBunga] = useState(9);
  const [tenor, setTenor] = useState(24);
  const i = bunga / 100 / 12;
  const cicilan = i > 0 && tenor > 0 ? (pokok * i) / (1 - Math.pow(1 + i, -tenor)) : tenor > 0 ? pokok / tenor : NaN;
  const total = Number.isFinite(cicilan) ? cicilan * tenor : NaN;
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Field label="Pokok pinjaman" value={pokok} onChange={setPokok} suffix="Rp" />
      <Field label="Bunga / tahun" value={bunga} onChange={setBunga} suffix="%" />
      <Field label="Tenor" value={tenor} onChange={setTenor} suffix="bln" />
      <div className="md:col-span-3">
        <Hasil rows={[
          ["Cicilan / bulan (anuitas)", Number.isFinite(cicilan) ? rp(cicilan) : "—"],
          ["Total pembayaran", Number.isFinite(total) ? rp(total) : "—"],
          ["Total bunga", Number.isFinite(total) ? rp(total - pokok) : "—"],
        ]} />
      </div>
    </div>
  );
}

function TabunganKalk() {
  const [awal, setAwal] = useState(10_000_000);
  const [setoran, setSetoran] = useState(2_000_000);
  const [bunga, setBunga] = useState(5);
  const [tahun, setTahun] = useState(10);
  const fv = useMemo(() => {
    const r = bunga / 100 / 12;
    const n = tahun * 12;
    return awal * Math.pow(1 + r, n) + (r > 0 ? setoran * ((Math.pow(1 + r, n) - 1) / r) : setoran * n);
  }, [awal, setoran, bunga, tahun]);
  const totalSetor = awal + setoran * tahun * 12;
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Field label="Tabungan awal" value={awal} onChange={setAwal} suffix="Rp" />
      <Field label="Setoran / bulan" value={setoran} onChange={setSetoran} suffix="Rp" />
      <Field label="Imbal hasil / tahun" value={bunga} onChange={setBunga} suffix="%" />
      <Field label="Jangka waktu" value={tahun} onChange={setTahun} suffix="thn" />
      <div className="md:col-span-4">
        <Hasil rows={[
          ["Nilai masa depan (FV)", rp(fv)],
          ["Total uang disetor", rp(totalSetor)],
          ["Bunga majemuk bekerja", rp(fv - totalSetor)],
        ]} />
      </div>
    </div>
  );
}

export function KalkulatorSection() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 lg:p-6">
      <FadeUp>
        <Card className="border-2 border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-violet-500/15 p-3"><Calculator className="size-6 text-violet-500" /></div>
            <div>
              <h1 className="text-xl font-black">Kalkulator Bisnis</h1>
              <p className="text-sm text-muted-foreground">5 kalkulator instan sisi klien: BEP, Margin, ROI, Anuitas, Proyeksi Tabungan — angka dulu, baru keputusan.</p>
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      <FadeUp>
        <Tabs defaultValue="bep">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="bep">BEP</TabsTrigger>
            <TabsTrigger value="margin">Margin & Harga</TabsTrigger>
            <TabsTrigger value="roi">ROI + Payback</TabsTrigger>
            <TabsTrigger value="anuitas">Cicilan Anuitas</TabsTrigger>
            <TabsTrigger value="tabungan">Proyeksi Tabungan</TabsTrigger>
          </TabsList>
          <TabsContent value="bep"><Card><CardHeader className="pb-2"><CardTitle className="text-base">Break-Even Point</CardTitle></CardHeader><CardContent><Beb /></CardContent></Card></TabsContent>
          <TabsContent value="margin"><Card><CardHeader className="pb-2"><CardTitle className="text-base">Margin vs Markup</CardTitle></CardHeader><CardContent><MarginKalk /></CardContent></Card></TabsContent>
          <TabsContent value="roi"><Card><CardHeader className="pb-2"><CardTitle className="text-base">ROI & Payback Period</CardTitle></CardHeader><CardContent><RoiKalk /></CardContent></Card></TabsContent>
          <TabsContent value="anuitas"><Card><CardHeader className="pb-2"><CardTitle className="text-base">Cicilan Anuitas (metode bank)</CardTitle></CardHeader><CardContent><AnuitasKalk /></CardContent></Card></TabsContent>
          <TabsContent value="tabungan"><Card><CardHeader className="pb-2"><CardTitle className="text-base">Proyeksi Tabungan (Future Value)</CardTitle></CardHeader><CardContent><TabunganKalk /></CardContent></Card></TabsContent>
        </Tabs>
      </FadeUp>
    </div>
  );
}
