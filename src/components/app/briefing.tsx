"use client";

// ═══════════════════════════════════════════════════════════════
// 🌅 AI MORNING BRIEFING — staf presiden pribadi (v10.0 OMNISCIENT)
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { Sunrise, Sparkles, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeUp } from "./motion";

export function BriefingSection() {
  const [items, setItems] = useState<any[]>([]);
  const [aktif, setAktif] = useState<any>(null);
  const [today, setToday] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/briefing", { cache: "no-store" });
      const json = await res.json();
      setItems(json.items || []);
      setToday(json.today || "");
      setAktif((json.items || [])[0] || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const susun = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/briefing", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyusun briefing");
      toast.success("Briefing pagi tersusun 🌅", { description: `Tersimpan untuk ${json.item?.tanggal}` });
      await load();
      setAktif(json.item);
    } catch (e: any) {
      toast.error("Briefing gagal", { description: String(e?.message || e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 lg:p-6">
      <FadeUp>
        <Card className="border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardContent className="flex flex-wrap items-center gap-3 p-5">
            <div className="rounded-lg bg-orange-500/15 p-3"><Sunrise className="size-6 text-orange-500" /></div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-black">AI Morning Briefing</h1>
              <p className="text-sm text-muted-foreground">Staf presiden pribadi: membaca seluruh database (MIT, hutang, follow-up, kas, kebiasaan, ide) lalu menyusun briefing pagi — satu per hari.</p>
            </div>
            <Button onClick={susun} disabled={busy}>
              {busy ? <RefreshCw className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
              {busy ? "Menyusun…" : today && aktif?.tanggal === today ? "Perbarui Briefing Hari Ini" : "Susun Briefing Pagi"}
            </Button>
          </CardContent>
        </Card>
      </FadeUp>

      {aktif && (
        <FadeUp key={aktif.id}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4 text-orange-500" /> Briefing {aktif.tanggal}
                {aktif.tanggal === today && <Badge className="bg-orange-500/15 text-orange-700 dark:text-orange-400">HARI INI</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
              <ReactMarkdown>{aktif.isi}</ReactMarkdown>
            </CardContent>
          </Card>
        </FadeUp>
      )}

      <FadeUp>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Arsip Briefing ({items.length})</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {loading && <p className="text-sm text-muted-foreground">Memuat…</p>}
            {!loading && !items.length && (
              <p className="text-sm text-muted-foreground">
                Belum ada briefing. Klik <b>Susun Briefing Pagi</b> — sistem akan membaca seluruh database dan menulis ringkasan pertama.
              </p>
            )}
            {items.map((b) => (
              <button
                key={b.id}
                onClick={() => setAktif(b)}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm hover:bg-muted/50 ${aktif?.id === b.id ? "border-orange-500/50 bg-orange-500/5" : ""}`}
              >
                <span className="font-semibold">{b.tanggal}</span>
                <span className="text-[11px] text-muted-foreground">{String(b.isi).length} karakter</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </FadeUp>
    </div>
  );
}
