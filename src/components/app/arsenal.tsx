"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Globe, Bot, ShieldCheck, CalendarDays, Copy, Check, ScrollText, Sparkles } from "lucide-react";
import { RecordTable } from "./record-table";
import { useRecords, useSettings } from "./use-records";
import { DOMAIN_CONFIG, fmtDate } from "@/lib/gunara";
import { cn } from "@/lib/utils";

// ═════════ 43 DOMAIN ═════════
export function DomainsSection() {
  const domain = useRecords("domain");
  const grouped = useMemo(() => {
    const g: Record<string, typeof domain.items> = { INTI: [], GATEWAY: [], FUTURE: [], PARKED: [] };
    for (const d of domain.items) (g[d.tier] = g[d.tier] || []).push(d);
    return g;
  }, [domain.items]);

  const tierMeta: Record<string, { title: string; desc: string; tone: string }> = {
    INTI: { title: "⭐ Inti — Bangun Sekarang", desc: "6 domain prioritas. Fokus total di sini.", tone: "border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20" },
    GATEWAY: { title: "🚪 Gateway — Halaman Pintu", desc: "1 halaman sederhana, noindex, semua link mengarah ke inti.", tone: "border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20" },
    FUTURE: { title: "📅 Cadangan — Klaster Umrah (Tahun 2-3)", desc: "Aktifkan saat PT TKI menangani PPIU/IJO.", tone: "border-stone-300 dark:border-stone-700" },
    PARKED: { title: "💤 Park Sadar", desc: "Biarkan di registrar. TIDAK SEMUA domain harus jadi website. Keputusan CEO: coret yang tak ada rencana.", tone: "border-stone-200 dark:border-stone-800 opacity-90" },
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">🌐 Domain Portfolio — 43 Domain, Setiap Domain Punya Misi</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Jangan terjebak &quot;bangun 42 website&quot; — bangun 4-6 inti yang menghasilkan dulu.
          Sisanya = proteksi merek & amunisi masa depan. Kualitas jaringan &gt; jumlah domain.
        </p>
      </div>

      <RecordTable
        config={DOMAIN_CONFIG}
        rows={domain.items}
        loading={domain.loading}
        onCreate={domain.create}
        onUpdate={domain.update}
        onDelete={domain.remove}
      />

      <div className="grid lg:grid-cols-2 gap-4">
        {Object.entries(grouped).map(([tier, items]) => items.length > 0 && (
          <Card key={tier} className={cn("border shadow-sm", tierMeta[tier]?.tone)}>
            <div className="px-5 py-3 border-b">
              <h3 className="font-bold text-sm">{tierMeta[tier]?.title || tier}</h3>
              <p className="text-xs text-muted-foreground">{tierMeta[tier]?.desc}</p>
            </div>
            <CardContent className="p-4 flex flex-wrap gap-1.5">
              {items.map((d) => (
                <span key={d.id} className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium", d.status === "MASA TENGGANG" && "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300", d.status === "LIVE" && "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300", d.status === "PRIORITAS" && "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300")}>
                  <Globe className="size-3" /> {d.nama}
                  {d.status && d.status !== "PLAN" && <span className="opacity-70">· {d.status}</span>}
                </span>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
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
