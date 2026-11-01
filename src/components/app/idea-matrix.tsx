"use client";

// ═══════════════════════════════════════════════════════════════
// 💡 IDEA MATRIX — peta prioritas Dampak × Usaha (v10.0 OMNISCIENT)
// ═══════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { Lightbulb, Plus, Trash2, Zap, Mountain, Candy, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FadeUp } from "./motion";
import { useRecords } from "./use-records";

const KUADRAN = [
  { key: "QW", nama: "Quick Wins", icon: Zap, cls: "text-emerald-600 dark:text-emerald-400", ket: "Dampak tinggi · usaha rendah — kerjakan SEKARANG" },
  { key: "BB", nama: "Big Bets", icon: Mountain, cls: "text-blue-600 dark:text-blue-400", ket: "Dampak tinggi · usaha tinggi — rencanakan matang" },
  { key: "FI", nama: "Fill-Ins", icon: Candy, cls: "text-amber-600 dark:text-amber-400", ket: "Dampak rendah · usaha rendah — sela waktu" },
  { key: "MP", nama: "Money Pits", icon: TrendingDown, cls: "text-red-600 dark:text-red-400", ket: "Dampak rendah · usaha tinggi — CORET!" },
] as const;

function kuadran(dampak: number, usaha: number): string {
  const hi = dampak >= 3;
  const lo = usaha <= 3;
  if (hi && lo) return "QW";
  if (hi && !lo) return "BB";
  if (!hi && lo) return "FI";
  return "MP";
}

const STATUS_CLS: Record<string, string> = {
  AKTIF: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  DIEKSEKUSI: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  SELESAI: "bg-muted text-muted-foreground",
  CORET: "bg-red-500/15 text-red-700 dark:text-red-400 line-through",
};

export function IdeaMatrixSection() {
  const { items, loading, create, update, remove } = useRecords<any>("ideaItem");
  const [judul, setJudul] = useState("");
  const [catatan, setCatatan] = useState("");
  const [dampak, setDampak] = useState(4);
  const [usaha, setUsaha] = useState(2);
  const [sel, setSel] = useState<any>(null);

  const aktif = useMemo(() => (items as any[]).filter((i) => i.status === "AKTIF" || i.status === "DIEKSEKUSI"), [items]);

  const tambah = async () => {
    if (!judul.trim()) { toast.error("Judul ide wajib"); return; }
    await create({ judul: judul.trim(), catatan: catatan.trim(), dampak, usaha, status: "AKTIF" });
    toast.success("Ide masuk peta 💡");
    setJudul(""); setCatatan("");
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 lg:p-6">
      <FadeUp>
        <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-amber-500/15 p-3"><Lightbulb className="size-6 text-amber-500" /></div>
            <div>
              <h1 className="text-xl font-black">Idea Matrix</h1>
              <p className="text-sm text-muted-foreground">Peta prioritas Dampak × Usaha — semua ide dilihat dingin, dipilih tajam.</p>
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      {/* ── TAMBAH IDE ── */}
      <FadeUp>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Plus className="size-4" /> Ide Baru</CardTitle></CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-[1fr_1fr_120px_120px_auto]">
            <Input placeholder="Judul ide" value={judul} onChange={(e) => setJudul(e.target.value)} />
            <Input placeholder="Catatan singkat (opsional)" value={catatan} onChange={(e) => setCatatan(e.target.value)} />
            <label className="text-xs text-muted-foreground">Dampak {dampak}
              <input type="range" min={1} max={5} value={dampak} onChange={(e) => setDampak(Number(e.target.value))} className="w-full accent-emerald-500" />
            </label>
            <label className="text-xs text-muted-foreground">Usaha {usaha}
              <input type="range" min={1} max={5} value={usaha} onChange={(e) => setUsaha(Number(e.target.value))} className="w-full accent-blue-500" />
            </label>
            <Button onClick={tambah}><Plus className="mr-1 size-4" /> Masukkan</Button>
          </CardContent>
        </Card>
      </FadeUp>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* ── MATRIKS 5×5 ── */}
        <FadeUp>
          <Card className="h-full">
            <CardHeader className="pb-3"><CardTitle className="text-base">Peta Prioritas</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-1 text-[10px]">
                <div />
                {[1, 2, 3, 4, 5].map((u) => <div key={u} className="text-center text-muted-foreground">usaha {u}</div>)}
                {[5, 4, 3, 2, 1].map((d) => (
                  <div key={d} className="contents">
                    <div className="flex items-center justify-end pr-1 text-muted-foreground">dampak {d}</div>
                    {[1, 2, 3, 4, 5].map((u) => {
                      const k = kuadran(d, u);
                      const dots = aktif.filter((i) => i.dampak === d && i.usaha === u);
                      const K = KUADRAN.find((x) => x.key === k)!;
                      return (
                        <div key={`${d}-${u}`} className={`min-h-12 rounded border p-1 ${k === "QW" ? "bg-emerald-500/5" : k === "BB" ? "bg-blue-500/5" : k === "FI" ? "bg-amber-500/5" : "bg-red-500/5"}`}>
                          {dots.map((dot) => (
                            <button
                              key={dot.id}
                              className={`mb-0.5 w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-semibold ${dot.status === "DIEKSEKUSI" ? "bg-blue-500/20" : "bg-background border"}`}
                              title={dot.judul}
                              onClick={() => setSel(dot)}
                            >
                              {dot.judul}
                            </button>
                          ))}
                          {dots.length === 0 && <span className="text-muted-foreground/40">{K.key}</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-3 grid gap-1.5 text-[11px] sm:grid-cols-2">
                {KUADRAN.map((k) => (
                  <div key={k.key} className="flex items-start gap-1.5">
                    <k.icon className={`mt-0.5 size-3.5 ${k.cls}`} />
                    <span><b>{k.nama}</b> — {k.ket}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeUp>

        {/* ── DETAIL / STATUS ── */}
        <FadeUp>
          <Card className="h-full">
            <CardHeader className="pb-3"><CardTitle className="text-base">{sel ? sel.judul : "Pilih titik ide"}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {!sel && <p className="text-sm text-muted-foreground">Klik salah satu ide di peta untuk mengubah status: AKTIF → DIEKSEKUSI → SELESAI / CORET.</p>}
              {sel && (
                <>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className={STATUS_CLS[sel.status]}>{sel.status}</Badge>
                    <Badge variant="outline">dampak {sel.dampak}</Badge>
                    <Badge variant="outline">usaha {sel.usaha}</Badge>
                    <Badge variant="outline">{KUADRAN.find((k) => k.key === kuadran(sel.dampak, sel.usaha))?.nama}</Badge>
                  </div>
                  {sel.catatan && <p className="text-sm text-muted-foreground">{sel.catatan}</p>}
                  <div className="grid grid-cols-2 gap-2">
                    {["DIEKSEKUSI", "SELESAI", "CORET", "AKTIF"].map((st) => (
                      <Button key={st} size="sm" variant="outline" onClick={() => update(sel.id, { status: st }).then(() => { setSel({ ...sel, status: st }); toast.success(`Status → ${st}`); })}>
                        {st}
                      </Button>
                    ))}
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => remove(sel.id).then(() => { setSel(null); toast.success("Ide dicoret permanen"); })}>
                    <Trash2 className="mr-1 size-3.5" /> Hapus
                  </Button>
                </>
              )}

              <div className="pt-2">
                <div className="mb-1.5 text-xs font-bold text-muted-foreground">SEMUA IDE ({(items as any[]).length})</div>
                <div className="max-h-56 space-y-1 overflow-y-auto">
                  {(items as any[]).map((i) => (
                    <button key={i.id} className="flex w-full items-center justify-between gap-2 rounded border px-2 py-1.5 text-left text-xs hover:bg-muted/50" onClick={() => setSel(i)}>
                      <span className={`truncate ${i.status === "CORET" ? "line-through text-muted-foreground" : ""}`}>{i.judul}</span>
                      <Badge className={`text-[9px] ${STATUS_CLS[i.status]}`}>{i.status}</Badge>
                    </button>
                  ))}
                  {loading && <p className="text-xs text-muted-foreground">Memuat…</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeUp>
      </div>
    </div>
  );
}
