"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "./use-records";
import { Scroll, Map, Target, GraduationCap, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DOCS = [
  { key: "piagam", title: "Piagam Diri", icon: Scroll, desc: "Diisi sekali. Dibaca setiap Senin pagi, sebelum membuka WhatsApp. Non-negotiable.", jangkar: true },
  { key: "visi", title: "Visi 10 Tahun", icon: Map, desc: "Peta pulang ke miliaran — versi tidak runtuh. Dibaca tiap bulan." },
  { key: "okr", title: "OKR Tahun Ini", icon: Target, desc: "Target tahun, turun dari visi. Dibaca tiap Minggu malam." },
  { key: "kurikulum", title: "Kurikulum Kuartal", icon: GraduationCap, desc: "1 jam belajar per hari kerja: 30 menit konsumsi + 30 menit produksi." },
];

// Render markdown ringan (h1/h2/h3, list, bold)
function Prose({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  lines.forEach((line, i) => {
    const bold = (s: string) => s.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
      part.startsWith("**") && part.endsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : <span key={j}>{part}</span>
    );
    if (line.startsWith("## ")) out.push(<h2 key={i}>{bold(line.slice(3))}</h2>);
    else if (line.startsWith("### ")) out.push(<h3 key={i}>{bold(line.slice(4))}</h3>);
    else if (line.startsWith("# ")) out.push(<h1 key={i}>{bold(line.slice(2))}</h1>);
    else if (/^[-•] /.test(line)) out.push(<li key={i} className="gunara-li">{bold(line.slice(2))}</li>);
    else if (line.trim() === "") out.push(<div key={i} className="h-2" />);
    else out.push(<p key={i}>{bold(line)}</p>);
  });
  return <div className="gunara-prose">{out}</div>;
}

function DocCard({ doc, value, onSave }: { doc: (typeof DOCS)[0]; value: string; onSave: (v: string) => Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const Icon = doc.icon;

  return (
    <Card className="border-2 shadow-sm overflow-hidden">
      <div className={cn("px-5 py-4 border-b", doc.jangkar ? "bg-gradient-to-r from-emerald-950 to-emerald-800 dark:from-emerald-950 dark:to-emerald-900" : "bg-muted/60")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={cn("mt-0.5 rounded-lg p-2", doc.jangkar ? "bg-amber-400/20 text-amber-300" : "bg-emerald-800/10 text-emerald-800 dark:text-emerald-300")}>
              <Icon className="size-5" />
            </div>
            <div>
              <h3 className={cn("font-extrabold tracking-tight", doc.jangkar ? "text-amber-50 text-lg" : "text-base")}>{doc.title}</h3>
              <p className={cn("text-xs mt-0.5", doc.jangkar ? "text-emerald-100/80" : "text-muted-foreground")}>{doc.desc}</p>
            </div>
          </div>
          {!editing && (
            <Button size="sm" variant={doc.jangkar ? "secondary" : "outline"} onClick={() => { setDraft(value); setEditing(true); }}>
              <Pencil className="size-3.5 mr-1" /> Ubah
            </Button>
          )}
        </div>
      </div>
      <CardContent className="p-5">
        {editing ? (
          <div className="space-y-3">
            <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={20} className="font-mono text-sm nice-scroll" />
            <div className="flex gap-2">
              <Button size="sm" disabled={saving} onClick={async () => { setSaving(true); await onSave(draft); setSaving(false); setEditing(false); }}>
                <Check className="size-4 mr-1" /> {saving ? "Menyimpan…" : "Simpan"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}><X className="size-4 mr-1" /> Batal</Button>
            </div>
          </div>
        ) : value ? (
          <Prose text={value} />
        ) : (
          <p className="text-sm text-muted-foreground">Belum diisi. Tekan &quot;Ubah&quot; untuk menulis — jangan sempurna, cukup jujur.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function HuluSection() {
  const { values, loading, save } = useSettings(DOCS.map((d) => d.key));

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">🌊 HULU — Mata Air Segalanya</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Diisi <strong>sekali</strong> dan hanya dibaca. Saat hari buruk datang, kamu butuh dokumen yang ditulis
          oleh &quot;kamu yang kuat&quot; untuk menuntun &quot;kamu yang lelah&quot;. Ini jangkar.
        </p>
      </div>
      <Tabs defaultValue={DOCS[0].key}>
        <TabsList className="flex-wrap h-auto">
          {DOCS.map((d) => (
            <TabsTrigger key={d.key} value={d.key} className="gap-1.5">
              <d.icon className="size-3.5" /> {d.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {DOCS.map((d) => (
          <TabsContent key={d.key} value={d.key}>
            <DocCard doc={d} value={values[d.key] || ""} onSave={(v) => save(d.key, v)} />
          </TabsContent>
        ))}
      </Tabs>
      {loading && <p className="text-sm text-muted-foreground">Memuat dokumen hulu…</p>}
    </div>
  );
}
