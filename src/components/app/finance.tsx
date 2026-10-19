"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, HandCoins, ArrowLeftRight, Baby, LayoutDashboard, Landmark } from "lucide-react";
import { RecordTable } from "./record-table";
import { useRecords } from "./use-records";
import {
  DEBT_CONFIG, RECEIVABLE_CONFIG, CASHFLOW_CONFIG, CHILD_SAVING_CONFIG,
  rupiah, todayISO,
} from "@/lib/gunara";
import { useToast } from "@/hooks/use-toast";

function StatCard({ title, value, sub, tone }: { title: string; value: string; sub?: string; tone?: "green" | "red" | "gold" }) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <p className={`text-xl font-extrabold mt-1 tracking-tight ${tone === "green" ? "text-emerald-700 dark:text-emerald-400" : tone === "red" ? "text-rose-700 dark:text-rose-400" : tone === "gold" ? "text-amber-700 dark:text-amber-400" : ""}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export function FinanceSection() {
  const debt = useRecords("debt");
  const receivable = useRecords("receivable");
  const cashflow = useRecords("cashflow");
  const child = useRecords("childSaving");
  const payment = useRecords("debtPayment");
  const { toast } = useToast();

  const [payFor, setPayFor] = useState<{ id: string; kepada: string; sisa: number } | null>(null);
  const [payForm, setPayForm] = useState({ tanggal: todayISO(), jumlah: 0, catatan: "" });
  const [paying, setPaying] = useState(false);

  const sisaTotal = useMemo(
    () => debt.items.reduce((a, d) => a + (d.status === "LUNAS" ? 0 : d.nilaiAwal - (d.payments || []).reduce((s: number, p: { jumlah: number }) => s + p.jumlah, 0)), 0),
    [debt.items]
  );
  const piutangBeredar = useMemo(
    () => receivable.items.filter((r) => r.status !== "LUNAS").reduce((a, r) => a + (r.nilaiKontrak - r.dpDiterima), 0),
    [receivable.items]
  );
  const bulanIni = todayISO().slice(0, 7); // WIB-safe (lokal, bukan UTC)
  const omzetBulan = useMemo(
    () => cashflow.items.filter((c) => c.jenis === "MASUK" && (c.tanggal || "").startsWith(bulanIni)).reduce((a, c) => a + c.nilai, 0),
    [cashflow.items, bulanIni]
  );
  const saldoAnak = useMemo(() => child.items.reduce((a, c) => a + c.nilai, 0), [child.items]);
  const pengeluaranBulan = useMemo(
    () => cashflow.items.filter((c) => c.jenis === "KELUAR" && (c.tanggal || "").startsWith(bulanIni)).reduce((a, c) => a + c.nilai, 0),
    [cashflow.items, bulanIni]
  );

  const submitPayment = async () => {
    if (!payFor) return;
    setPaying(true);
    try {
      await payment.create({ debtId: payFor.id, ...payForm, jumlah: Number(payForm.jumlah) });
      await debt.refresh();
      setPayFor(null);
      setPayForm({ tanggal: todayISO(), jumlah: 0, catatan: "" });
      toast({ title: "Pembayaran tercatat", description: "Sisa hutang diperbarui otomatis. Satu langkah lebih dekat ke LUNAS." });
    } finally {
      setPaying(false);
    }
  };

  const debtWithActions = { ...DEBT_CONFIG };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">💰 MESIN 1 — KEUANGAN</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Aturan keuangan grup: uang PT tidak pernah dicampur uang pribadi. 20% setiap income → rekening anak
          — bukan keuangan, ini janji. Uang tanpa sistem = air di telapak tangan terbuka.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard title="Sisa Hutang Total" value={rupiah(sisaTotal)} sub="Terjadwal, bukan menakutkan" tone="red" />
        <StatCard title="Piutang Beredar" value={rupiah(piutangBeredar)} sub="Uang kita yang ada di luar" tone="gold" />
        <StatCard title="Omzet Bulan Ini" value={rupiah(omzetBulan)} sub="Masuk ke semua PT + pribadi" tone="green" />
        <StatCard title="Pengeluaran Bulan Ini" value={rupiah(pengeluaranBulan)} />
        <StatCard title="Rekening Anak" value={rupiah(saldoAnak)} sub="20% dari setiap income" tone="gold" />
      </div>

      <Tabs defaultValue="hutang">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="hutang" className="gap-1.5"><Landmark className="size-3.5" /> Hutang</TabsTrigger>
          <TabsTrigger value="piutang" className="gap-1.5"><HandCoins className="size-3.5" /> Piutang</TabsTrigger>
          <TabsTrigger value="kas" className="gap-1.5"><ArrowLeftRight className="size-3.5" /> Arus Kas</TabsTrigger>
          <TabsTrigger value="anak" className="gap-1.5"><Baby className="size-3.5" /> Rekening Anak</TabsTrigger>
        </TabsList>

        <TabsContent value="hutang">
          <RecordTable
            config={debtWithActions}
            rows={debt.items}
            loading={debt.loading}
            onCreate={debt.create}
            onUpdate={debt.update}
            onDelete={debt.remove}
            extraRowActions={(row) => {
              const sisa = row.nilaiAwal - (row.payments || []).reduce((s: number, p: { jumlah: number }) => s + p.jumlah, 0);
              if (sisa <= 0) return null;
              return (
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1"
                  onClick={() => setPayFor({ id: row.id, kepada: row.kepada, sisa })}>
                  <Wallet className="size-3" /> Cicil
                </Button>
              );
            }}
          />
        </TabsContent>

        <TabsContent value="piutang">
          <RecordTable
            config={RECEIVABLE_CONFIG}
            rows={receivable.items}
            loading={receivable.loading}
            onCreate={receivable.create}
            onUpdate={receivable.update}
            onDelete={receivable.remove}
          />
        </TabsContent>

        <TabsContent value="kas">
          <RecordTable
            config={CASHFLOW_CONFIG}
            rows={cashflow.items}
            loading={cashflow.loading}
            onCreate={cashflow.create}
            onUpdate={cashflow.update}
            onDelete={cashflow.remove}
          />
        </TabsContent>

        <TabsContent value="anak">
          <RecordTable
            config={CHILD_SAVING_CONFIG}
            rows={child.items}
            loading={child.loading}
            onCreate={child.create}
            onUpdate={child.update}
            onDelete={child.remove}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog cicilan */}
      <Dialog open={Boolean(payFor)} onOpenChange={(v) => !v && setPayFor(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Catat Pembayaran — {payFor?.kepada}</DialogTitle>
            <p className="text-sm text-muted-foreground">Sisa saat ini: <strong>{rupiah(payFor?.sisa || 0)}</strong></p>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="space-y-1.5">
              <Label className="text-xs">Tanggal</Label>
              <Input type="date" value={payForm.tanggal} onChange={(e) => setPayForm((f) => ({ ...f, tanggal: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Jumlah bayar</Label>
              <Input type="number" value={payForm.jumlah || ""} onChange={(e) => setPayForm((f) => ({ ...f, jumlah: Number(e.target.value) }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Catatan</Label>
              <Input value={payForm.catatan} onChange={(e) => setPayForm((f) => ({ ...f, catatan: e.target.value }))} placeholder="bukti transfer / kesepakatan" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayFor(null)}>Batal</Button>
            <Button onClick={submitPayment} disabled={paying}>{paying ? "Menyimpan…" : "Simpan Pembayaran"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
