"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Users, Repeat2, UserPlus, Link2 } from "lucide-react";
import { RecordTable } from "./record-table";
import { useRecords } from "./use-records";
import {
  CLIENT_CONFIG, RELATION_CONFIG, POLITICAL_CONFIG,
  BadgeStatus, fmtDate, todayISO,
} from "@/lib/gunara";
import { cn } from "@/lib/utils";

// ── Section CRM: Master Klien + Follow-Up ──
export function CrmSection() {
  const client = useRecords("client");
  const followUp = useRecords("followUp");
  const [fuOpen, setFuOpen] = useState(false);
  const [fuEditing, setFuEditing] = useState<Record<string, unknown> | null>(null);

  const clientName = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of client.items) m[c.id] = c.nama;
    return m;
  }, [client.items]);

  const today = todayISO(); // WIB-safe (lokal, bukan UTC)
  const fuRows = useMemo(
    () => followUp.items.map((f) => ({
      ...f,
      isLate: f.status === "TERJADWAL" && Boolean(f.tenggat) && f.tenggat < today,
    })),
    [followUp.items, today]
  );

  const pipeline = useMemo(() => {
    const counts: Record<string, number> = { PIPIN: 0, NEGOSIASI: 0, KLIEN: 0, RETAINER: 0, ARSIP: 0 };
    for (const c of client.items) counts[c.status] = (counts[c.status] || 0) + 1;
    return counts;
  }, [client.items]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">👥 MESIN 2 — KLIEN / CRM</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Uang ada di follow-up, bukan di leads baru. Aturan manager: follow-up yang telat &gt; 3 hari = merah.
          Minggu tanpa follow-up = laporan ke review mingguan.
        </p>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          {Object.entries(pipeline).map(([k, v]) => (
            <span key={k} className="inline-flex items-center gap-1.5 rounded-full bg-card border px-3 py-1.5 font-medium">
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{v}</span> {k}
            </span>
          ))}
        </div>
      </div>

      <Tabs defaultValue="master">
        <TabsList>
          <TabsTrigger value="master" className="gap-1.5"><Users className="size-3.5" /> Master Klien</TabsTrigger>
          <TabsTrigger value="followup" className="gap-1.5"><Repeat2 className="size-3.5" /> Follow-Up</TabsTrigger>
        </TabsList>

        <TabsContent value="master">
          <RecordTable
            config={CLIENT_CONFIG}
            rows={client.items}
            loading={client.loading}
            onCreate={client.create}
            onUpdate={client.update}
            onDelete={client.remove}
          />
        </TabsContent>

        <TabsContent value="followup">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold tracking-tight">Follow-Up</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Uang ada di follow-up, bukan di leads baru. Telat &gt; 3 hari = warna merah.
                </p>
              </div>
              {client.items.length === 0 ? (
                <p className="text-xs text-muted-foreground">Tambah klien dulu di tab Master Klien.</p>
              ) : (
                <Button size="sm" className="gap-1.5" onClick={() => { setFuEditing(null); setFuOpen(true); }}>
                  <UserPlus className="size-4" /> Tambah Follow-Up
                </Button>
              )}
            </div>

            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="overflow-x-auto nice-scroll">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left font-semibold px-3 py-2.5 text-xs uppercase text-muted-foreground">Klien</th>
                      <th className="text-left font-semibold px-3 py-2.5 text-xs uppercase text-muted-foreground">Tindakan</th>
                      <th className="text-left font-semibold px-3 py-2.5 text-xs uppercase text-muted-foreground">Tenggat</th>
                      <th className="text-left font-semibold px-3 py-2.5 text-xs uppercase text-muted-foreground hidden md:table-cell">Status</th>
                      <th className="text-left font-semibold px-3 py-2.5 text-xs uppercase text-muted-foreground hidden md:table-cell">Hasil</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {followUp.loading && <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">Memuat…</td></tr>}
                    {!followUp.loading && fuRows.length === 0 && (
                      <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">Belum ada follow-up. Setiap klien puas = kandidat follow-up.</td></tr>
                    )}
                    {fuRows.map((row) => (
                      <tr key={row.id} className={cn("border-b last:border-0 hover:bg-muted/40 transition-colors", row.isLate && "bg-rose-50/60 dark:bg-rose-950/20")}>
                        <td className="px-3 py-2.5 font-semibold">{clientName[row.clientId] || "—"}</td>
                        <td className="px-3 py-2.5">{row.tindakan}</td>
                        <td className={cn("px-3 py-2.5", row.isLate && "text-rose-700 font-bold dark:text-rose-400")}>{fmtDate(row.tenggat)}</td>
                        <td className="px-3 py-2.5 hidden md:table-cell">
                          <BadgeStatus value={row.isLate ? "TELAT" : row.status} />
                        </td>
                        <td className="px-3 py-2.5 hidden md:table-cell line-clamp-1">{row.hasil || "—"}</td>
                        <td className="px-2 py-2.5 text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setFuEditing(row); setFuOpen(true); }}>Ubah</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <FollowUpDialog
        open={fuOpen}
        onOpenChange={setFuOpen}
        clients={client.items}
        initial={fuEditing}
        onSubmit={async (data) => {
          if (fuEditing) await followUp.update(fuEditing.id as string, data);
          else await followUp.create(data);
        }}
      />
    </div>
  );
}

function FollowUpDialog({ open, onOpenChange, clients, initial, onSubmit }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clients: any[];
  initial: Record<string, unknown> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => Promise<unknown>;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({
    clientId: "", tindakan: "", tenggat: "", status: "TERJADWAL", hasil: "",
  });

  // Reset form setiap kali dialog dibuka
  const [wasOpen, setWasOpen] = useState(false);
  if (open && !wasOpen) {
    setWasOpen(true);
    setForm({
      clientId: (initial?.clientId as string) || "",
      tindakan: (initial?.tindakan as string) || "",
      tenggat: (initial?.tenggat as string) || "",
      status: (initial?.status as string) || "TERJADWAL",
      hasil: (initial?.hasil as string) || "",
    });
  } else if (!open && wasOpen) {
    setWasOpen(false);
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Ubah Follow-Up" : "Tambah Follow-Up"}</DialogTitle>
          <DialogDescription>Tindakan ini adalah penghasil uang terbaikmu.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-1">
          <div className="space-y-1.5">
            <Label className="text-xs">Klien *</Label>
            <Select value={form.clientId || undefined} onValueChange={(v) => set("clientId", v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Pilih klien…" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.nama}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tindakan *</Label>
            <Input value={form.tindakan} onChange={(e) => set("tindakan", e.target.value)} placeholder="WA follow-up proposal / telepon konfirmasi" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tenggat</Label>
              <Input type="date" value={form.tenggat} onChange={(e) => set("tenggat", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TERJADWAL">Terjadwal</SelectItem>
                  <SelectItem value="SELESAI">Selesai</SelectItem>
                  <SelectItem value="TELAT">Telat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Hasil</Label>
            <Textarea rows={2} value={form.hasil} onChange={(e) => set("hasil", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button
            disabled={saving || !form.clientId || !form.tindakan}
            onClick={async () => { setSaving(true); try { await onSubmit(form); onOpenChange(false); } finally { setSaving(false); } }}
          >
            {saving ? "Menyimpan…" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Section Relasi & Politik ──
export function RelationsSection() {
  const relation = useRecords("relation");
  const political = useRecords("politicalActivity");

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">🤝 MESIN 3 — RELASI & POLITIK</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Politik itu <strong>ledger kepercayaan</strong> — siapa memberi, siapa menerima, kapan terakhir berhubungan.
          <br />Boundary rule: bantuan ke tokoh/kader = investasi relasi ATAU proyek PT resmi dengan invoice. <strong>Tidak ada zona abu-abu.</strong>
        </p>
      </div>

      <Tabs defaultValue="master">
        <TabsList>
          <TabsTrigger value="master" className="gap-1.5"><Link2 className="size-3.5" /> Master Relasi</TabsTrigger>
          <TabsTrigger value="politik" className="gap-1.5"><Users className="size-3.5" /> Aktivitas Politik</TabsTrigger>
        </TabsList>
        <TabsContent value="master">
          <RecordTable
            config={RELATION_CONFIG}
            rows={relation.items}
            loading={relation.loading}
            onCreate={relation.create}
            onUpdate={relation.update}
            onDelete={relation.remove}
          />
        </TabsContent>
        <TabsContent value="politik">
          <RecordTable
            config={POLITICAL_CONFIG}
            rows={political.items}
            loading={political.loading}
            onCreate={political.create}
            onUpdate={political.update}
            onDelete={political.remove}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
