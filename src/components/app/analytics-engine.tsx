"use client";

// ═══════════════════════════════════════════════════════════════
// 📊 ANALYTICS ENGINE — agregasi data nyata (v10.0 OMNISCIENT)
// ═══════════════════════════════════════════════════════════════

import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, BarChart3, Wallet, Users, HandCoins, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeUp, Stagger, StaggerItem, CountUp } from "./motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const rp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
const rpShort = (n: number) =>
  n >= 1e9 ? `${(n / 1e9).toFixed(1)}M` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}jt` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}rb` : String(n);

export function AnalyticsSection() {
  const [cashflow, setCashflow] = useState<any[]>([]);
  const [receivable, setReceivable] = useState<any[]>([]);
  const [debts, setDebts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [cf, rc, dbt, cl] = await Promise.all(
          ["cashflow", "receivable", "debt?whereKey=status&whereVal=AKTIF", "client"].map(async (r) => {
            const [res, q] = r.split("?");
            const res2 = await fetch(`/api/data/${res}${q ? `?${q}` : ""}`, { cache: "no-store" });
            const j = await res2.json();
            return j.items || [];
          })
        );
        setCashflow(cf); setReceivable(rc); setDebts(dbt); setClients(cl);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const bulanIni = now.toISOString().slice(0, 7);
    const bulanLalu = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);
    const sum = (arr: any[], bulan: string) =>
      arr.filter((c) => String(c.tanggal || "").startsWith(bulan))
        .reduce((a, c) => a + (c.nilai || 0), 0);
    const masuk = sum(cashflow.filter((c) => c.jenis === "MASUK"), bulanIni);
    const keluar = sum(cashflow.filter((c) => c.jenis === "KELUAR"), bulanIni);
    const masukLalu = sum(cashflow.filter((c) => c.jenis === "MASUK"), bulanLalu);

    const perBulan: Record<string, { masuk: number; keluar: number }> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = d.toISOString().slice(0, 7);
      perBulan[k] = { masuk: 0, keluar: 0 };
    }
    for (const c of cashflow) {
      const k = String(c.tanggal || "").slice(0, 7);
      if (!perBulan[k]) continue;
      if (c.jenis === "MASUK") perBulan[k].masuk += c.nilai || 0;
      else perBulan[k].keluar += c.nilai || 0;
    }
    const chart = Object.entries(perBulan).map(([bulan, v]) => ({
      bulan: bulan.slice(5) + "/" + bulan.slice(2, 4),
      Masuk: v.masuk, Keluar: v.keluar,
    }));

    const piutang = receivable.reduce((a, r) => a + ((r.nilaiKontrak || 0) - (r.dpDiterima || 0)), 0);
    const hutang = debts.reduce((a, d) => a + (d.nilaiAwal || 0), 0);
    const klienAktif = clients.filter((c) => c.status !== "CLOSED").length;

    return { masuk, keluar, net: masuk - keluar, masukLalu, chart, piutang, hutang, klienAktif };
  }, [cashflow, receivable, debts, clients]);

  const naik = stats.masuk >= stats.masukLalu;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 lg:p-6">
      <FadeUp>
        <Card className="border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-cyan-500/15 p-3"><BarChart3 className="size-6 text-cyan-500" /></div>
            <div>
              <h1 className="text-xl font-black">Analytics Engine</h1>
              <p className="text-sm text-muted-foreground">Agregasi data nyata: kas, piutang, hutang, klien — angka yang jujur, bukan perasaan.</p>
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      {/* ── KPI ── */}
      <Stagger className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          { label: "Kas Masuk (bulan ini)", value: stats.masuk, icon: ArrowUpRight, cls: "text-emerald-600 dark:text-emerald-400" },
          { label: "Kas Keluar (bulan ini)", value: stats.keluar, icon: ArrowDownRight, cls: "text-red-600 dark:text-red-400" },
          { label: "Net Kas", value: stats.net, icon: Wallet, cls: "text-cyan-600 dark:text-cyan-400" },
          { label: "Piutang Tertagih", value: stats.piutang, icon: HandCoins, cls: "text-amber-600 dark:text-amber-400" },
          { label: "Hutang Aktif", value: stats.hutang, icon: Scale, cls: "text-purple-600 dark:text-purple-400" },
        ].map((k) => (
          <StaggerItem key={k.label}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{k.label}</span>
                  <k.icon className={`size-4 ${k.cls}`} />
                </div>
                <div className={`mt-1 text-lg font-black tabular-nums ${k.cls}`}>
                  {loading ? "…" : <CountUp value={k.value} format={rp} />}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* ── ARUS KAS 6 BULAN ── */}
        <FadeUp>
          <Card className="h-full">
            <CardHeader className="pb-2"><CardTitle className="text-base">Arus Kas 6 Bulan</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chart}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="bulan" fontSize={11} />
                  <YAxis fontSize={10} tickFormatter={rpShort} width={52} />
                  <Tooltip formatter={(v: any) => rp(Number(v))} contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Masuk" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Keluar" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </FadeUp>

        {/* ── FUNNEL & TREN ── */}
        <FadeUp>
          <Card className="h-full">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Users className="size-4" /> Pipeline Klien</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-black tabular-nums text-emerald-600 dark:text-emerald-400">
                  {loading ? "…" : stats.klienAktif}
                </div>
                <div className="text-[11px] text-muted-foreground">klien aktif dari {clients.length} total</div>
              </div>
              <div className="space-y-2">
                {clients.slice(0, 6).map((c) => {
                  const nilai = c.nilaiKontrak || 0;
                  const max = Math.max(...clients.map((x) => x.nilaiKontrak || 0), 1);
                  return (
                    <div key={c.id}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="truncate font-semibold">{c.nama}</span>
                        <Badge variant="outline" className="text-[9px]">{rpShort(nilai)}</Badge>
                      </div>
                      <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${(nilai / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
                {!clients.length && !loading && <p className="text-xs text-muted-foreground">Belum ada klien tercatat.</p>}
              </div>
              {stats.masukLalu > 0 && (
                <div className={`rounded-lg border p-2.5 text-xs ${naik ? "border-emerald-500/40 bg-emerald-500/5" : "border-red-500/40 bg-red-500/5"}`}>
                  {naik ? "📈" : "📉"} Kas masuk bulan ini {naik ? "naik" : "turun"} vs bulan lalu ({rpShort(stats.masukLalu)} → {rpShort(stats.masuk)}).
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>
      </div>
    </div>
  );
}
