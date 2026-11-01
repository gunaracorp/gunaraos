"use client";

// ═══════════════════════════════════════════════════════════════
// 🧠 SECOND BRAIN — otak kedua polimatik (v10.0 OMNISCIENT)
// ═══════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { Brain, Plus, Pin, PinOff, Trash2, Sparkles, Wand2, Search } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FadeUp } from "./motion";
import { useRecords } from "./use-records";

const KATEGORI = ["IDE", "INSIGHT", "KUTIPAN", "RENCANA", "BELAJAR", "LAIN"] as const;

const KAT_CLS: Record<string, string> = {
  IDE: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  INSIGHT: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  KUTIPAN: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  RENCANA: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  BELAJAR: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
  LAIN: "bg-muted text-muted-foreground",
};

export function SecondBrainSection() {
  const { items, loading, create, update, remove, refresh } = useRecords<any>("brainNote");
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [kategori, setKategori] = useState<string>("IDE");
  const [tags, setTags] = useState("");
  const [q, setQ] = useState("");
  const [fKat, setFKat] = useState("ALL");
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [aiSaran, setAiSaran] = useState<Record<string, any>>({});

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (items as any[])
      .filter((n) => (fKat === "ALL" ? true : n.kategori === fKat))
      .filter((n) => (!needle ? true : `${n.judul} ${n.isi} ${n.tags}`.toLowerCase().includes(needle)))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || String(b.createdAt).localeCompare(String(a.createdAt)));
  }, [items, q, fKat]);

  const tambah = async () => {
    if (!isi.trim()) { toast.error("Isi catatan wajib diisi"); return; }
    try {
      await create({ judul: judul.trim(), isi: isi.trim(), kategori, tags: tags.trim() });
      toast.success("Catatan masuk otak kedua 🧠");
      setJudul(""); setIsi(""); setTags("");
    } catch (e: any) {
      toast.error("Gagal menyimpan", { description: String(e?.message || e) });
    }
  };

  const analisis = async (n: any) => {
    setAiBusy(n.id);
    try {
      const res = await fetch("/api/brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ judul: n.judul, isi: n.isi, kategori: n.kategori }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "AI gagal");
      setAiSaran((s) => ({ ...s, [n.id]: json }));
      toast.success("Analisis AI siap — terapkan bila cocok");
    } catch (e: any) {
      toast.error("AI gagal", { description: String(e?.message || e) });
    } finally {
      setAiBusy(null);
    }
  };

  const terapkan = async (n: any) => {
    const s = aiSaran[n.id];
    if (!s) return;
    await update(n.id, {
      aiRingkasan: s.ringkasan || "",
      aiPoin: (s.poin || []).join("||"),
      aiKategori: s.kategori || "",
      aiTags: (s.tags || []).join(", "),
      aiKoneksi: (s.koneksi || []).join("||"),
    });
    toast.success("Saran AI diterapkan ke catatan");
    refresh();
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 lg:p-6">
      <FadeUp>
        <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-purple-500/15 p-3"><Brain className="size-6 text-purple-500" /></div>
            <div>
              <h1 className="text-xl font-black">Second Brain</h1>
              <p className="text-sm text-muted-foreground">Otak kedua polimatik — catat ide, insight, kutipan; biarkan AI menemukan koneksi lintas-bidang.</p>
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      {/* ── FORM CATAT BARU ── */}
      <FadeUp>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Plus className="size-4" /> Catat Cepat</CardTitle></CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-[1fr_180px]">
            <Input placeholder="Judul (opsional)" value={judul} onChange={(e) => setJudul(e.target.value)} />
            <Input placeholder="Tags (pisah koma)" value={tags} onChange={(e) => setTags(e.target.value)} />
            <Textarea placeholder="Isi catatan…" value={isi} onChange={(e) => setIsi(e.target.value)} className="min-h-[72px] md:col-span-1" />
            <div className="flex gap-2">
              <Select value={kategori} onValueChange={setKategori}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{KATEGORI.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={tambah} className="flex-1"><Plus className="mr-1 size-4" /> Simpan</Button>
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      {/* ── FILTER ── */}
      <div className="grid gap-2 md:grid-cols-[1fr_200px]">
        <Input placeholder="Cari isi / judul / tags…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select value={fKat} onValueChange={setFKat}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Kategori</SelectItem>
            {KATEGORI.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* ── DAFTAR CATATAN ── */}
      <div className="grid gap-3 md:grid-cols-2">
        {loading && <p className="text-sm text-muted-foreground">Memuat…</p>}
        {filtered.map((n) => (
          <Card key={n.id} className={n.pinned ? "border-amber-500/50" : ""}>
            <CardContent className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge className={`text-[10px] ${KAT_CLS[n.kategori] || KAT_CLS.LAIN}`}>{n.kategori}</Badge>
                    {String(n.tags || "").split(",").filter(Boolean).map((t: string) => (
                      <Badge key={t} variant="outline" className="text-[10px]">#{t.trim()}</Badge>
                    ))}
                  </div>
                  {n.judul && <div className="mt-1 font-bold leading-snug">{n.judul}</div>}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="icon" variant="ghost" className="size-7" onClick={() => update(n.id, { pinned: !n.pinned }).then(refresh)}>
                    {n.pinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="size-7 text-red-500" onClick={() => remove(n.id).then(() => toast.success("Catatan dihapus"))}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{n.isi}</p>

              {(n.aiRingkasan || n.aiPoin) && (
                <div className="rounded-lg border bg-muted/40 p-2.5 text-xs">
                  {n.aiRingkasan && <div className="font-semibold">💡 {n.aiRingkasan}</div>}
                  {n.aiPoin && (
                    <ul className="mt-1 list-disc pl-4 text-muted-foreground">
                      {String(n.aiPoin).split("||").filter(Boolean).map((p: string) => <li key={p}>{p}</li>)}
                    </ul>
                  )}
                  {n.aiKoneksi && (
                    <div className="mt-1 text-muted-foreground">🔗 {String(n.aiKoneksi).split("||").join(" · ")}</div>
                  )}
                </div>
              )}

              {aiSaran[n.id] && (
                <div className="rounded-lg border border-purple-500/40 bg-purple-500/5 p-2.5 text-xs">
                  <div className="font-semibold">{aiSaran[n.id].ringkasan}</div>
                  <ul className="mt-1 list-disc pl-4 text-muted-foreground">
                    {(aiSaran[n.id].poin || []).map((p: string) => <li key={p}>{p}</li>)}
                  </ul>
                  {!!(aiSaran[n.id].koneksi || []).length && (
                    <div className="mt-1 text-muted-foreground">🔗 {aiSaran[n.id].koneksi.join(" · ")}</div>
                  )}
                  <Button size="sm" className="mt-2" onClick={() => terapkan(n)}><Wand2 className="mr-1 size-3.5" /> Terapkan Sekali Klik</Button>
                </div>
              )}

              <Button size="sm" variant="outline" onClick={() => analisis(n)} disabled={aiBusy === n.id}>
                <Sparkles className="mr-1 size-3.5" /> {aiBusy === n.id ? "AI berpikir…" : "AI Ringkasan"}
              </Button>
            </CardContent>
          </Card>
        ))}
        {!loading && !filtered.length && (
          <p className="text-sm text-muted-foreground md:col-span-2">Belum ada catatan — otak kedua menunggu ide pertamamu. <Search className="inline size-3" /></p>
        )}
      </div>
    </div>
  );
}
