"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v7.0 — SEO MASTERY · KLIEN & PROPOSAL
// Tab 1: Manajemen proyek SEO (grid kartu berwarna per status/warna).
// Tab 2: Proposal AI — isi kondisi klien, pilih layanan, AI menyusun
// proposal lengkap siap kirim ke klien. Riwayat tersimpan otomatis.
// ═══════════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Building2,
  FileText,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Sparkles,
  Copy,
  History,
  Target,
  BriefcaseBusiness,
} from "lucide-react";
import { FadeUp } from "../motion";
import { useRecords } from "../use-records";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ── Tipe & konstanta ─────────────────────────────────────────────── */

interface SeoProjectItem {
  id: string;
  nama: string;
  domain: string;
  industri: string;
  targetPasaran: string;
  bahasa: string;
  kompetitor: string;
  tujuan: string;
  status: string;
  warna: string;
  createdAt: string;
}

interface SeoProposalItem {
  id: string;
  projectId: string;
  klien: string;
  domain: string;
  masalah: string;
  anggaran: string;
  layanan: string;
  hasil: string;
  createdAt: string;
}

const EMPTY_PROJECT = {
  nama: "",
  domain: "",
  industri: "",
  targetPasaran: "Indonesia",
  bahasa: "id",
  kompetitor: "",
  tujuan: "",
  status: "AKTIF",
  warna: "emerald",
};
type ProjectForm = typeof EMPTY_PROJECT;

const STATUS_BADGE: Record<string, string> = {
  AKTIF: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  PAUSED: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  SELESAI: "border-border bg-muted text-muted-foreground",
};

const WARNA_DOT: Record<string, string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-400",
  rose: "bg-rose-500",
  violet: "bg-violet-500",
};

const LAYANAN = [
  "Audit Teknis Lengkap",
  "Riset Keyword & Strategi Konten",
  "Optimasi On-Page",
  "Produksi Konten & Blog",
  "Link Building Berkualitas",
  "Local SEO & Google Business",
  "Core Web Vitals & Kecepatan",
  "Pelatihan Tim Internal",
  "Laporan & Konsultasi Bulanan",
];

const MD_CLASS =
  "[&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:text-emerald-700 dark:[&_h2]:text-emerald-300 " +
  "[&_h3]:font-semibold [&_h3]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 " +
  "[&_table]:w-full [&_table]:text-xs [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:px-2 [&_td]:py-1 " +
  "[&_p]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-amber-400 [&_blockquote]:pl-3 [&_blockquote]:italic";

function fmtDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    });
  } catch {
    return "—";
  }
}

/* ── Komponen utama ───────────────────────────────────────────────── */

export function SeoClientsSection() {
  const { toast } = useToast();
  const { items: projects, loading: loadingProjects, create: createProject, update: updateProject, remove: removeProject } =
    useRecords<SeoProjectItem>("seoProject");
  const { items: proposals, loading: loadingProposals, refresh: refreshProposals, remove: removeProposal } =
    useRecords<SeoProposalItem>("seoProposal");

  /* ── Proyek ── */
  const [projOpen, setProjOpen] = useState(false);
  const [projEdit, setProjEdit] = useState<SeoProjectItem | null>(null);
  const [projForm, setProjForm] = useState<ProjectForm>(EMPTY_PROJECT);
  const [projSaving, setProjSaving] = useState(false);
  const [delTarget, setDelTarget] = useState<SeoProjectItem | null>(null);

  /* ── Proposal ── */
  const [pProjectId, setPProjectId] = useState("none");
  const [pKlien, setPKlien] = useState("");
  const [pDomain, setPDomain] = useState("");
  const [pMasalah, setPMasalah] = useState("");
  const [pAnggaran, setPAnggaran] = useState("");
  const [pLayanan, setPLayanan] = useState<string[]>([]);
  const [pLoading, setPLoading] = useState(false);
  const [pView, setPView] = useState<{ klien: string; hasil: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.nama.localeCompare(b.nama)),
    [projects]
  );
  const sortedProposals = useMemo(
    () => [...proposals].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    [proposals]
  );

  /* ── Aksi proyek ── */
  function openCreate() {
    setProjEdit(null);
    setProjForm(EMPTY_PROJECT);
    setProjOpen(true);
  }

  function openEdit(p: SeoProjectItem) {
    setProjEdit(p);
    setProjForm({
      nama: p.nama,
      domain: p.domain,
      industri: p.industri,
      targetPasaran: p.targetPasaran || "Indonesia",
      bahasa: p.bahasa || "id",
      kompetitor: p.kompetitor,
      tujuan: p.tujuan,
      status: p.status || "AKTIF",
      warna: p.warna || "emerald",
    });
    setProjOpen(true);
  }

  async function saveProject() {
    if (!projForm.nama.trim() || !projForm.domain.trim()) {
      toast({
        title: "Data kurang lengkap",
        description: "Nama proyek dan domain wajib diisi.",
      });
      return;
    }
    setProjSaving(true);
    try {
      if (projEdit) {
        await updateProject(projEdit.id, projForm);
        toast({ title: "Proyek diperbarui", description: `Perubahan pada ${projForm.nama} tersimpan.` });
      } else {
        await createProject(projForm);
        toast({ title: "Proyek dibuat", description: `${projForm.nama} siap dikejar peringkatnya.` });
      }
      setProjOpen(false);
    } catch {
      toast({ title: "Gagal menyimpan proyek" });
    } finally {
      setProjSaving(false);
    }
  }

  async function confirmDelete() {
    if (!delTarget) return;
    try {
      await removeProject(delTarget.id);
      toast({ title: "Proyek dihapus", description: `${delTarget.nama} dikeluarkan dari radar.` });
    } catch {
      toast({ title: "Gagal menghapus proyek" });
    } finally {
      setDelTarget(null);
    }
  }

  /* ── Aksi proposal ── */
  function selectProposalProject(v: string) {
    setPProjectId(v);
    const p = projects.find((x) => x.id === v);
    if (p) {
      setPKlien(p.nama);
      setPDomain(p.domain);
    }
  }

  function toggleLayanan(l: string) {
    setPLayanan((arr) => (arr.includes(l) ? arr.filter((x) => x !== l) : [...arr, l]));
  }

  async function makeProposal() {
    if (!pKlien.trim()) {
      toast({ title: "Nama klien wajib diisi", description: "Pilih proyek atau ketik manual." });
      return;
    }
    setPLoading(true);
    try {
      const res = await fetch("/api/seo/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          klien: pKlien.trim(),
          domain: pDomain.trim(),
          masalah: pMasalah.trim(),
          anggaran: pAnggaran.trim(),
          layanan: pLayanan,
          projectId: pProjectId !== "none" ? pProjectId : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.item) {
        throw new Error(json?.error || "Mesin proposal sedang tersendat");
      }
      setPView({ klien: pKlien.trim(), hasil: json.item.hasil || "" });
      toast({ title: "✨ Proposal siap", description: "Tinjau, sesuaikan, lalu kirim ke klien." });
      await refreshProposals();
    } catch (e: unknown) {
      toast({
        title: "Proposal gagal dibuat",
        description: e instanceof Error ? e.message : "Coba lagi sebentar.",
      });
    } finally {
      setPLoading(false);
    }
  }

  async function copyProposal() {
    if (!pView) return;
    try {
      await navigator.clipboard.writeText(pView.hasil);
      setCopied(true);
      toast({ title: "📋 Proposal tersalin", description: "Markdown siap ditempel ke dokumen klien." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Gagal menyalin", description: "Browser menolak akses clipboard." });
    }
  }

  async function delProposal(id: string) {
    try {
      await removeProposal(id);
      toast({ title: "Riwayat proposal dihapus" });
    } catch {
      toast({ title: "Gagal menghapus proposal" });
    }
  }

  /* ── Render ── */
  return (
    <div className="space-y-5">
      {/* ── Hero ── */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-950 via-[#1a231e] to-emerald-950 p-6 sm:p-8 text-emerald-50">
          <BriefcaseBusiness aria-hidden className="absolute -right-8 -top-10 size-56 opacity-[0.06]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/90">
            GUNARA OS v7.0 — SEO MASTERY
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-amber-100">
            🤝 Klien &amp; Proposal SEO
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/80 leading-relaxed">
            Kelola portofolio proyek SEO tiap klien, lalu biarkan AI menyusun proposal
            profesional dari kondisi nyata di lapangan — dari audit sampai angka anggaran.
          </p>
        </div>
      </FadeUp>

      <Tabs defaultValue="proyek" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="proyek">🏢 Proyek SEO</TabsTrigger>
          <TabsTrigger value="proposal">📄 Proposal AI</TabsTrigger>
        </TabsList>

        {/* ═══════════ TAB 1 — PROYEK ═══════════ */}
        <TabsContent value="proyek" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {!loadingProjects && (
                <span className="font-bold tabular-nums text-foreground">{sortedProjects.length}</span>
              )}{" "}
              proyek terdaftar
            </p>
            <Button
              onClick={openCreate}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Plus className="size-4 mr-1" /> ＋ Proyek Baru
            </Button>
          </div>

          {loadingProjects ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-56 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : sortedProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
              <Building2 className="size-10 text-muted-foreground/40" aria-hidden />
              <p className="mt-3 text-sm font-semibold text-muted-foreground">
                Belum ada proyek SEO
              </p>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                Daftarkan website pertamamu — atau website klien — untuk mulai
                memantau, menempa, dan menaikkan peringkatnya.
              </p>
              <Button onClick={openCreate} variant="outline" className="mt-4">
                <Plus className="size-4 mr-1" /> ＋ Proyek Baru
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sortedProjects.map((p) => {
                const kompetitors = p.kompetitor
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                return (
                  <FadeUp key={p.id}>
                    <Card className="flex h-full flex-col rounded-xl">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start gap-2">
                          <span
                            className={cn("mt-1.5 size-2.5 flex-none rounded-full", WARNA_DOT[p.warna] || "bg-emerald-500")}
                            aria-hidden
                          />
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate text-sm font-bold">{p.nama}</CardTitle>
                            <p className="truncate font-mono text-[11px] text-muted-foreground">
                              {p.domain}
                            </p>
                          </div>
                          <Badge variant="outline" className={cn("flex-none text-[10px]", STATUS_BADGE[p.status] || STATUS_BADGE.AKTIF)}>
                            {p.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-1 flex-col gap-2 p-4 pt-1">
                        <div className="flex flex-wrap gap-1">
                          {p.industri && (
                            <Badge variant="secondary" className="text-[10px] font-normal">
                              🏭 {p.industri}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-[10px] font-normal">
                            🌏 {p.targetPasaran || "Indonesia"}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] font-normal">
                            🗣️ {p.bahasa || "id"}
                          </Badge>
                        </div>
                        {p.tujuan && (
                          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            <Target className="mb-0.5 inline size-3 text-amber-500" aria-hidden />{" "}
                            {p.tujuan}
                          </p>
                        )}
                        {kompetitors.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {kompetitors.slice(0, 4).map((k) => (
                              <span
                                key={k}
                                className="rounded-full border bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                              >
                                {k}
                              </span>
                            ))}
                            {kompetitors.length > 4 && (
                              <span className="rounded-full border bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                                +{kompetitors.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="mt-auto flex gap-2 border-t pt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => openEdit(p)}
                            aria-label={`Edit proyek ${p.nama}`}
                          >
                            <Pencil className="size-3.5 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400"
                            onClick={() => setDelTarget(p)}
                            aria-label={`Hapus proyek ${p.nama}`}
                          >
                            <Trash2 className="size-3.5 mr-1" /> Hapus
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </FadeUp>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* ═══════════ TAB 2 — PROPOSAL AI ═══════════ */}
        <TabsContent value="proposal" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[440px,1fr] items-start">
            {/* Form proposal */}
            <FadeUp delay={0.05}>
              <Card className="rounded-xl xl:sticky xl:top-20">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="size-4 text-emerald-600" /> Susun Proposal
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Deskripsikan kondisi klien — AI menyusun proposal lengkap dengan
                    strategi dan pembagian fase.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-3 space-y-4">
                  <div className="space-y-1.5">
                    <Label>Klien / Proyek Tersimpan</Label>
                    <Select value={pProjectId} onValueChange={selectProposalProject}>
                      <SelectTrigger className="w-full" aria-label="Pilih proyek klien">
                        <SelectValue placeholder="Pilih proyek atau isi manual" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Isi manual (tanpa proyek)</SelectItem>
                        {sortedProjects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="prop-klien">Nama Klien</Label>
                      <Input
                        id="prop-klien"
                        value={pKlien}
                        onChange={(e) => setPKlien(e.target.value)}
                        placeholder="Toko Bangunan Jaya"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="prop-domain">Domain</Label>
                      <Input
                        id="prop-domain"
                        value={pDomain}
                        onChange={(e) => setPDomain(e.target.value)}
                        placeholder="tokojaya.com"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="prop-masalah">Kondisi / Masalah Klien</Label>
                    <Textarea
                      id="prop-masalah"
                      value={pMasalah}
                      onChange={(e) => setPMasalah(e.target.value)}
                      placeholder="Deskripsi kondisi saat ini…"
                      rows={4}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="prop-anggaran">Anggaran</Label>
                    <Input
                      id="prop-anggaran"
                      value={pAnggaran}
                      onChange={(e) => setPAnggaran(e.target.value)}
                      placeholder="Rp 15.000.000 / bulan"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Layanan Dipilih{" "}
                      <span className="font-normal normal-case tracking-normal text-muted-foreground">
                        ({pLayanan.length}/{LAYANAN.length})
                      </span>
                    </Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {LAYANAN.map((l) => (
                        <label
                          key={l}
                          className="flex cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                        >
                          <Checkbox
                            checked={pLayanan.includes(l)}
                            onCheckedChange={() => toggleLayanan(l)}
                            className="mt-0.5"
                            aria-label={l}
                          />
                          <span className="text-xs leading-snug">{l}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={makeProposal}
                    disabled={pLoading}
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    {pLoading ? (
                      <>
                        <Loader2 className="size-4 mr-1 animate-spin" /> Menyusun proposal…
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4 mr-1" /> ✨ Buat Proposal
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </FadeUp>

            {/* Hasil proposal */}
            <div className="space-y-4">
              <FadeUp delay={0.1}>
                <Card className="rounded-xl">
                  <CardHeader className="p-6 pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="size-4 text-amber-500" /> Dokumen Proposal
                    </CardTitle>
                    {pView && (
                      <CardDescription className="text-xs">
                        Draf untuk <strong className="text-foreground">{pView.klien}</strong> —
                        periksa angka &amp; janji sebelum dikirim.
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="p-6 pt-3 space-y-3">
                    {pView ? (
                      <>
                        <div
                          className={cn(
                            "max-h-[520px] overflow-y-auto nice-scroll text-sm leading-relaxed",
                            MD_CLASS
                          )}
                        >
                          <ReactMarkdown>{pView.hasil}</ReactMarkdown>
                        </div>
                        <Button variant="outline" className="w-full" onClick={copyProposal}>
                          {copied ? (
                            <Copy className="size-4 mr-1 text-emerald-600" />
                          ) : (
                            <Copy className="size-4 mr-1" />
                          )}
                          {copied ? "Tersalin!" : "📋 Salin Proposal"}
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
                        <FileText className="size-10 text-muted-foreground/40" aria-hidden />
                        <p className="mt-3 text-sm font-semibold text-muted-foreground">
                          Belum ada draf proposal
                        </p>
                        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                          Isi kondisi klien dan pilih layanan di kiri — dokumen proposal
                          akan tersusun di sini.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeUp>

              {/* Riwayat proposal */}
              <FadeUp delay={0.15}>
                <Card className="rounded-xl">
                  <CardHeader className="p-6 pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <History className="size-4 text-emerald-600" /> Riwayat Proposal
                      {!loadingProposals && (
                        <Badge variant="outline" className="ml-1 tabular-nums">
                          {sortedProposals.length}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-3">
                    {loadingProposals ? (
                      <div className="space-y-2">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                        ))}
                      </div>
                    ) : sortedProposals.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Belum ada proposal — dokumen yang dibuat AI otomatis tercatat di sini.
                      </p>
                    ) : (
                      <Accordion type="single" collapsible className="max-h-96 overflow-y-auto nice-scroll pr-1">
                        {sortedProposals.map((pr) => (
                          <AccordionItem key={pr.id} value={pr.id}>
                            <AccordionTrigger className="py-3 hover:no-underline">
                              <span className="flex min-w-0 items-center gap-2 text-left">
                                <span className="size-2 flex-none rounded-full bg-emerald-500" aria-hidden />
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-semibold">
                                    {pr.klien}
                                  </span>
                                  <span className="block text-[11px] font-normal text-muted-foreground">
                                    {fmtDate(pr.createdAt)} · {pr.layanan ? "paket layanan" : "tanpa layanan"}
                                  </span>
                                </span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className={cn("text-[13px] leading-relaxed", MD_CLASS)}>
                                <ReactMarkdown>{pr.hasil || "*Dokumen kosong.*"}</ReactMarkdown>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="mt-2 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400"
                                onClick={() => delProposal(pr.id)}
                              >
                                <Trash2 className="size-3.5 mr-1" /> Hapus dari riwayat
                              </Button>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </CardContent>
                </Card>
              </FadeUp>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Dialog Proyek (buat / edit) ── */}
      <Dialog open={projOpen} onOpenChange={setProjOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto nice-scroll">
          <DialogHeader>
            <DialogTitle>{projEdit ? "Ubah Proyek" : "Proyek SEO Baru"}</DialogTitle>
            <DialogDescription>
              Website siapa yang akan dikejar peringkatnya? Isi profil singkatnya.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pr-nama">Nama Proyek</Label>
              <Input
                id="pr-nama"
                value={projForm.nama}
                onChange={(e) => setProjForm((f) => ({ ...f, nama: e.target.value }))}
                placeholder="Toko Bangunan Jaya"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-domain">Domain</Label>
              <Input
                id="pr-domain"
                value={projForm.domain}
                onChange={(e) => setProjForm((f) => ({ ...f, domain: e.target.value }))}
                placeholder="tokojaya.com"
                autoComplete="off"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-industri">Industri</Label>
              <Input
                id="pr-industri"
                value={projForm.industri}
                onChange={(e) => setProjForm((f) => ({ ...f, industri: e.target.value }))}
                placeholder="Konstruksi & Ritel"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-pasaran">Target Pasaran</Label>
              <Select
                value={projForm.targetPasaran}
                onValueChange={(v) => setProjForm((f) => ({ ...f, targetPasaran: v }))}
              >
                <SelectTrigger className="w-full" aria-label="Target pasaran">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Indonesia">Indonesia</SelectItem>
                  <SelectItem value="Lokal Kota">Lokal Kota</SelectItem>
                  <SelectItem value="Global">Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-bahasa">Bahasa</Label>
              <Select
                value={projForm.bahasa}
                onValueChange={(v) => setProjForm((f) => ({ ...f, bahasa: v }))}
              >
                <SelectTrigger className="w-full" aria-label="Bahasa">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Indonesia (id)</SelectItem>
                  <SelectItem value="en">English (en)</SelectItem>
                  <SelectItem value="id+en">Indonesia + English (id+en)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-status">Status</Label>
              <Select
                value={projForm.status}
                onValueChange={(v) => setProjForm((f) => ({ ...f, status: v }))}
              >
                <SelectTrigger className="w-full" aria-label="Status proyek">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AKTIF">Aktif</SelectItem>
                  <SelectItem value="PAUSED">Dijeda</SelectItem>
                  <SelectItem value="SELESAI">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-warna">Warna Aksen</Label>
              <Select
                value={projForm.warna}
                onValueChange={(v) => setProjForm((f) => ({ ...f, warna: v }))}
              >
                <SelectTrigger className="w-full" aria-label="Warna aksen">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emerald">
                    <span className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-emerald-500" /> Emerald
                    </span>
                  </SelectItem>
                  <SelectItem value="amber">
                    <span className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-amber-400" /> Amber
                    </span>
                  </SelectItem>
                  <SelectItem value="rose">
                    <span className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-rose-500" /> Rose
                    </span>
                  </SelectItem>
                  <SelectItem value="violet">
                    <span className="flex items-center gap-2">
                      <span className="size-2.5 rounded-full bg-violet-500" /> Violet
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pr-kompetitor">
                Kompetitor{" "}
                <span className="font-normal normal-case tracking-normal text-muted-foreground">
                  (pisah dengan koma)
                </span>
              </Label>
              <Textarea
                id="pr-kompetitor"
                value={projForm.kompetitor}
                onChange={(e) => setProjForm((f) => ({ ...f, kompetitor: e.target.value }))}
                placeholder="kompetitor-a.com, kompetitor-b.com"
                rows={2}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="pr-tujuan">Tujuan Bisnis</Label>
              <Textarea
                id="pr-tujuan"
                value={projForm.tujuan}
                onChange={(e) => setProjForm((f) => ({ ...f, tujuan: e.target.value }))}
                placeholder="Naikkan leads organik 3× dalam 6 bulan, kuasai kata kunci lokal…"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={saveProject}
              disabled={projSaving}
            >
              {projSaving && <Loader2 className="size-4 mr-1 animate-spin" />}
              {projEdit ? "Simpan Perubahan" : "Buat Proyek"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── AlertDialog konfirmasi hapus proyek ── */}
      <AlertDialog open={!!delTarget} onOpenChange={(o) => !o && setDelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus proyek {delTarget?.nama}?</AlertDialogTitle>
            <AlertDialogDescription>
              Proyek akan dikeluarkan dari daftar. Riwayat audit, keyword, dan laporan
              yang menempel pada proyek ini tidak ikut terhapus — tapi koneksi ke
              proyek hilang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={confirmDelete}
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
