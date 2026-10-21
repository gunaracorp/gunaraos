"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS v7.0 — SEO MASTERY · META FORGE
// Menempa meta tag + schema JSON-LD murni di sisi klien (zero API):
// pratinjau SERP Google, Open Graph, Twitter Card, dan 8 jenis schema.
// Preset tersimpan ke MetaPreset untuk dipakai ulang.
// ═══════════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileCode2,
  Copy,
  Save,
  Trash2,
  FolderOpen,
  Loader2,
  Image as ImageIcon,
  Wand2,
  HelpCircle,
  Plus,
  X,
  ListOrdered,
  MapPin,
  Package,
  Newspaper,
} from "lucide-react";
import { FadeUp } from "../motion";
import { useRecords } from "../use-records";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ── Tipe & konstanta ─────────────────────────────────────────────── */

type SchemaType =
  | "WEBSITE"
  | "ORGANIZATION"
  | "ARTICLE"
  | "PRODUCT"
  | "LOCAL_BUSINESS"
  | "FAQ"
  | "HOW_TO"
  | "BREADCRUMB";

const SCHEMA_TYPES: { value: SchemaType; label: string }[] = [
  { value: "WEBSITE", label: "WebSite — Situs Utama" },
  { value: "ORGANIZATION", label: "Organization — Profil Perusahaan" },
  { value: "ARTICLE", label: "Article — Artikel / Blog" },
  { value: "PRODUCT", label: "Product — Produk / Jasa" },
  { value: "LOCAL_BUSINESS", label: "LocalBusiness — Bisnis Lokal" },
  { value: "FAQ", label: "FAQPage — Halaman Tanya-Jawab" },
  { value: "HOW_TO", label: "HowTo — Panduan Langkah" },
  { value: "BREADCRUMB", label: "BreadcrumbList — Jejak Navigasi" },
];

const SCHEMA_TO_TYPE: Record<string, SchemaType> = {
  WebSite: "WEBSITE",
  Organization: "ORGANIZATION",
  Article: "ARTICLE",
  Product: "PRODUCT",
  LocalBusiness: "LOCAL_BUSINESS",
  FAQPage: "FAQ",
  HowTo: "HOW_TO",
  BreadcrumbList: "BREADCRUMB",
};

const AVAILABILITY: { value: string; label: string }[] = [
  { value: "InStock", label: "Tersedia" },
  { value: "OutOfStock", label: "Habis" },
  { value: "PreOrder", label: "Pre-Order" },
  { value: "Discontinued", label: "Dihentikan" },
];

interface QaPair {
  q: string;
  a: string;
}

interface StepPair {
  name: string;
  text: string;
}

interface ProjectItem {
  id: string;
  nama: string;
  domain: string;
}

interface MetaPresetItem {
  id: string;
  projectId: string;
  halaman: string;
  url: string;
  title: string;
  description: string;
  keywords: string;
  og: string;
  twitter: string;
  schemaJson: string;
  createdAt: string;
}

/* ── Helper murni ─────────────────────────────────────────────────── */

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n).trimEnd() + "…" : s;
}

function hostOf(u: string): string {
  const raw = u.trim();
  if (!raw) return "";
  try {
    return new URL(raw.includes("://") ? raw : `https://${raw}`)
      .hostname.replace(/^www\./, "");
  } catch {
    return raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

function counterClass(len: number, max: number, warn: number): string {
  if (len === 0) return "text-muted-foreground";
  if (len <= max) return "text-emerald-600 dark:text-emerald-400";
  if (len <= warn) return "text-amber-600 dark:text-amber-400";
  return "text-rose-500";
}

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

/** Buang key bernilai undefined agar JSON-LD tetap rapi */
function clean<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/** Pecah URL menjadi rantai breadcrumb [Beranda, Segmen, …] */
function buildCrumbs(u: string): { name: string; item: string }[] {
  const raw = u.trim();
  const base = raw.startsWith("http") ? raw : raw ? `https://${raw}` : "";
  const crumbs: { name: string; item: string }[] = [];
  try {
    const url = new URL(base);
    crumbs.push({ name: "Beranda", item: url.origin });
    const segs = url.pathname.split("/").filter(Boolean);
    let acc = url.origin;
    for (const seg of segs) {
      acc += `/${seg}`;
      const label = decodeURIComponent(seg)
        .replace(/[-_]+/g, " ")
        .replace(/\.(html?|php|aspx)$/i, "");
      crumbs.push({
        name: label.charAt(0).toUpperCase() + label.slice(1),
        item: acc,
      });
    }
  } catch {
    crumbs.push({ name: "Beranda", item: raw });
  }
  return crumbs;
}

/* ── Komponen utama ───────────────────────────────────────────────── */

export function MetaForgeSection() {
  const { toast } = useToast();
  const { items: projects } = useRecords<ProjectItem>("seoProject");
  const { items: presets, loading: loadingPresets, create: createPreset, remove: removePreset } =
    useRecords<MetaPresetItem>("metaPreset");

  /* Kolom dasar */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [schemaType, setSchemaType] = useState<SchemaType>("WEBSITE");

  /* Kolom dinamis per jenis schema */
  const [qa, setQa] = useState<QaPair[]>([{ q: "", a: "" }]);
  const [steps, setSteps] = useState<StepPair[]>([{ name: "", text: "" }]);
  const [harga, setHarga] = useState("");
  const [mataUang, setMataUang] = useState("IDR");
  const [ketersediaan, setKetersediaan] = useState("InStock");
  const [penulis, setPenulis] = useState("");
  const [tanggalPublish, setTanggalPublish] = useState("");
  const [namaBisnis, setNamaBisnis] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jamBuka, setJamBuka] = useState("");
  const [rating, setRating] = useState("");
  const [jumlahReview, setJumlahReview] = useState("");

  /* Dialog simpan preset */
  const [saveOpen, setSaveOpen] = useState(false);
  const [halaman, setHalaman] = useState("");
  const [presetProjectId, setPresetProjectId] = useState("none");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const siteName = hostOf(url) || "situsku.com";
  const displayUrl = url.trim()
    ? url.trim().replace(/^https?:\/\//, "").replace(/^www\./, "")
    : "situsku.com/halaman";
  const handleClean = twitterHandle.trim().replace(/^@/, "");
  const faviconChar = (siteName.charAt(0) || "G").toUpperCase();

  /* ── Builder JSON-LD per jenis schema ── */
  const schema = useMemo((): Record<string, unknown> => {
    const ctx = { "@context": "https://schema.org" as const };
    const t = title.trim() || "Halaman";
    const u = url.trim() || undefined;
    const img = imageUrl.trim() || undefined;
    const desc = description.trim() || undefined;

    switch (schemaType) {
      case "WEBSITE":
        return clean({
          ...ctx,
          "@type": "WebSite",
          name: t,
          url: u,
          description: desc,
          potentialAction: {
            "@type": "SearchAction",
            target: `${url.trim().replace(/\/$/, "") || "https://situsku.com"}/?s={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        });
      case "ORGANIZATION":
        return clean({
          ...ctx,
          "@type": "Organization",
          name: namaBisnis.trim() || t,
          url: u,
          logo: img,
          description: desc,
          sameAs: handleClean ? [`https://twitter.com/${handleClean}`] : undefined,
        });
      case "ARTICLE":
        return clean({
          ...ctx,
          "@type": "Article",
          headline: trunc(t, 110),
          description: desc,
          image: img,
          author: penulis.trim()
            ? { "@type": "Person", name: penulis.trim() }
            : undefined,
          datePublished: tanggalPublish || undefined,
        });
      case "PRODUCT":
        return clean({
          ...ctx,
          "@type": "Product",
          name: t,
          description: desc,
          image: img,
          offers: {
            "@type": "Offer",
            price: harga.trim() || "0",
            priceCurrency: mataUang || "IDR",
            availability: `https://schema.org/${ketersediaan || "InStock"}`,
          },
        });
      case "LOCAL_BUSINESS":
        return clean({
          ...ctx,
          "@type": "LocalBusiness",
          name: namaBisnis.trim() || t,
          url: u,
          image: img,
          telephone: telepon.trim() || undefined,
          address: alamat.trim()
            ? { "@type": "PostalAddress", streetAddress: alamat.trim() }
            : undefined,
          openingHours: jamBuka.trim() || undefined,
          aggregateRating:
            rating.trim()
              ? {
                  "@type": "AggregateRating",
                  ratingValue: rating.trim(),
                  reviewCount: jumlahReview.trim() || "1",
                }
              : undefined,
        });
      case "FAQ": {
        const valid = qa.filter((p) => p.q.trim());
        return clean({
          ...ctx,
          "@type": "FAQPage",
          mainEntity: valid.length
            ? valid.map((p) => ({
                "@type": "Question",
                name: p.q.trim(),
                acceptedAnswer: { "@type": "Answer", text: p.a.trim() || "-" },
              }))
            : [
                {
                  "@type": "Question",
                  name: "Pertanyaan contoh?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Isi pasangan tanya-jawab di panel kiri.",
                  },
                },
              ],
        });
      }
      case "HOW_TO": {
        const valid = steps.filter((s) => s.name.trim());
        return clean({
          ...ctx,
          "@type": "HowTo",
          name: t,
          description: desc,
          step: valid.length
            ? valid.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: s.name.trim(),
                text: s.text.trim() || undefined,
              }))
            : [
                {
                  "@type": "HowToStep",
                  position: 1,
                  name: "Langkah pertama",
                  text: "Isi daftar langkah di panel kiri.",
                },
              ],
        });
      }
      case "BREADCRUMB": {
        const crumbs = buildCrumbs(url);
        return clean({
          ...ctx,
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: c.item,
          })),
        });
      }
    }
  }, [
    schemaType, title, description, url, imageUrl, handleClean,
    qa, steps, harga, mataUang, ketersediaan, penulis, tanggalPublish,
    namaBisnis, telepon, alamat, jamBuka, rating, jumlahReview,
  ]);

  const schemaStr = useMemo(() => JSON.stringify(schema, null, 2), [schema]);

  /* ── Aksi kecil ── */
  async function copyJsonLd() {
    try {
      await navigator.clipboard.writeText(schemaStr);
      setCopied(true);
      toast({ title: "📋 JSON-LD tersalin", description: "Tempel sebelum </head> halamanmu." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Gagal menyalin", description: "Browser menolak akses clipboard." });
    }
  }

  async function savePreset() {
    const h = halaman.trim();
    if (!h) {
      toast({ title: "Nama halaman wajib diisi", description: "Contoh: Beranda Utama" });
      return;
    }
    setSaving(true);
    try {
      await createPreset({
        projectId: presetProjectId !== "none" ? presetProjectId : "",
        halaman: h,
        url: url.trim(),
        title: title.trim(),
        description: description.trim(),
        keywords: keywords.trim(),
        og: JSON.stringify({ title: title.trim(), description: description.trim(), image: imageUrl.trim(), url: url.trim() }),
        twitter: JSON.stringify({ handle: handleClean }),
        schemaJson: JSON.stringify(schema),
      });
      toast({ title: "💾 Preset tersimpan", description: `"${h}" bisa dimuat ulang kapan saja.` });
      setSaveOpen(false);
      setHalaman("");
    } catch {
      toast({ title: "Gagal menyimpan preset" });
    } finally {
      setSaving(false);
    }
  }

  function loadPreset(p: MetaPresetItem) {
    setTitle(p.title || "");
    setDescription(p.description || "");
    setUrl(p.url || "");
    setKeywords(p.keywords || "");
    let ogObj: Record<string, string> = {};
    let twObj: Record<string, string> = {};
    try { ogObj = JSON.parse(p.og || "{}"); } catch { ogObj = {}; }
    try { twObj = JSON.parse(p.twitter || "{}"); } catch { twObj = {}; }
    setImageUrl(ogObj.image || "");
    setTwitterHandle(twObj.handle || "");

    let schema: Record<string, unknown> = {};
    try { schema = JSON.parse(p.schemaJson || "{}"); } catch { schema = {}; }
    const type = SCHEMA_TO_TYPE[(schema["@type"] as string) || "WebSite"] || "WEBSITE";
    setSchemaType(type);

    if (type === "LOCAL_BUSINESS") {
      setNamaBisnis((schema.name as string) || "");
      setTelepon((schema.telephone as string) || "");
      const addr = schema.address as { streetAddress?: string } | undefined;
      setAlamat(addr?.streetAddress || "");
      setJamBuka((schema.openingHours as string) || "");
      const ar = schema.aggregateRating as
        | { ratingValue?: string; reviewCount?: string }
        | undefined;
      setRating(ar?.ratingValue || "");
      setJumlahReview(ar?.reviewCount || "");
    } else if (type === "PRODUCT") {
      const offers = schema.offers as
        | { price?: string; priceCurrency?: string; availability?: string }
        | undefined;
      setHarga(offers?.price || "");
      setMataUang(offers?.priceCurrency || "IDR");
      setKetersediaan(offers?.availability?.split("/").pop() || "InStock");
    } else if (type === "ARTICLE") {
      const author = schema.author as { name?: string } | undefined;
      setPenulis(author?.name || "");
      setTanggalPublish((schema.datePublished as string) || "");
    } else if (type === "FAQ") {
      const me = (schema.mainEntity as { name?: string; acceptedAnswer?: { text?: string } }[] | undefined) || [];
      setQa(me.length ? me.map((q) => ({ q: q.name || "", a: q.acceptedAnswer?.text || "" })) : [{ q: "", a: "" }]);
    } else if (type === "HOW_TO") {
      const st = (schema.step as { name?: string; text?: string }[] | undefined) || [];
      setSteps(st.length ? st.map((s) => ({ name: s.name || "", text: s.text || "" })) : [{ name: "", text: "" }]);
    }

    toast({
      title: `Preset "${p.halaman}" dimuat`,
      description: "Semua kolom terisi ulang — lanjutkan penyempurnaan.",
    });
  }

  async function delPreset(id: string) {
    try {
      await removePreset(id);
      toast({ title: "Preset dihapus" });
    } catch {
      toast({ title: "Gagal menghapus preset" });
    }
  }

  const sortedPresets = useMemo(
    () =>
      [...presets].sort((a, b) =>
        (b.createdAt || "").localeCompare(a.createdAt || "")
      ),
    [presets]
  );

  const labelCls = "text-[10px] font-bold uppercase tracking-widest text-muted-foreground";

  /* ── Render ── */
  return (
    <div className="space-y-5">
      {/* ── Hero ── */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-emerald-950 via-[#1a231e] to-emerald-950 p-6 sm:p-8 text-emerald-50">
          <Wand2 aria-hidden className="absolute -right-8 -top-10 size-56 opacity-[0.06]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/90">
            GUNARA OS v7.0 — SEO MASTERY
          </p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-amber-100">
            🔨 Meta Forge
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-emerald-100/80 leading-relaxed">
            Menempa title, meta description, kartu sosial, dan schema JSON-LD — dengan
            pratinjau langsung ala Google. Semua digenerate di perangkatmu, instan tanpa
            server.
          </p>
        </div>
      </FadeUp>

      <div className="grid gap-4 lg:grid-cols-[420px,1fr] items-start">
        {/* ── Kolom Input ── */}
        <FadeUp delay={0.05}>
          <Card className="rounded-xl lg:sticky lg:top-20">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileCode2 className="size-4 text-emerald-600" /> Bahan Tempa
              </CardTitle>
              <CardDescription className="text-xs">
                Hitungan karakter mengikuti batas tampilan SERP Google.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-3 space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="forge-title">Title Tag</Label>
                  <span className={cn("text-[11px] font-bold tabular-nums", counterClass(title.length, 60, 70))}>
                    {title.length}/60
                  </span>
                </div>
                <Input
                  id="forge-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Jasa SEO Terbaik – Naik Peringkat – GUNARA"
                  maxLength={120}
                />
              </div>
              {/* Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="forge-desc">Meta Description</Label>
                  <span className={cn("text-[11px] font-bold tabular-nums", counterClass(description.length, 155, 170))}>
                    {description.length}/155
                  </span>
                </div>
                <Textarea
                  id="forge-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ringkas manfaat + ajakan. Muncul di bawah judul hasil pencarian Google…"
                  rows={3}
                  maxLength={320}
                />
              </div>
              {/* URL & gambar */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="forge-url">URL Halaman</Label>
                  <Input
                    id="forge-url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://situsku.com/layanan"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="forge-img">URL Gambar (OG)</Label>
                  <Input
                    id="forge-img"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://…/cover.jpg"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="forge-handle">Handle Twitter/X</Label>
                  <Input
                    id="forge-handle"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    placeholder="@gunaraos"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="forge-keywords">Keywords</Label>
                  <Input
                    id="forge-keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="jasa seo, konsultan seo"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <Label>Jenis Schema JSON-LD</Label>
                <Select value={schemaType} onValueChange={(v) => setSchemaType(v as SchemaType)}>
                  <SelectTrigger className="w-full" aria-label="Jenis schema">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHEMA_TYPES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ── Form dinamis per schema ── */}
              {schemaType === "FAQ" && (
                <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <HelpCircle className="size-3.5" /> Pasangan Tanya–Jawab
                  </p>
                  <div className="max-h-64 space-y-2 overflow-y-auto nice-scroll pr-1">
                    {qa.map((pair, i) => (
                      <div key={i} className="space-y-1.5 rounded-md border bg-card p-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                            TANYA #{i + 1}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-6 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700"
                            onClick={() => setQa((arr) => arr.filter((_, j) => j !== i))}
                            disabled={qa.length === 1}
                            aria-label={`Hapus pertanyaan ${i + 1}`}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                        <Input
                          value={pair.q}
                          onChange={(e) =>
                            setQa((arr) => arr.map((p, j) => (j === i ? { ...p, q: e.target.value } : p)))
                          }
                          placeholder="Berapa biaya jasa SEO per bulan?"
                        />
                        <Textarea
                          value={pair.a}
                          onChange={(e) =>
                            setQa((arr) => arr.map((p, j) => (j === i ? { ...p, a: e.target.value } : p)))
                          }
                          placeholder="Jawaban singkat dan langsung…"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setQa((arr) => [...arr, { q: "", a: "" }])}
                  >
                    <Plus className="size-3.5 mr-1" /> Tambah Pertanyaan
                  </Button>
                </div>
              )}

              {schemaType === "HOW_TO" && (
                <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <ListOrdered className="size-3.5" /> Langkah Panduan
                  </p>
                  <div className="max-h-64 space-y-2 overflow-y-auto nice-scroll pr-1">
                    {steps.map((step, i) => (
                      <div key={i} className="space-y-1.5 rounded-md border bg-card p-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                            LANGKAH #{i + 1}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-6 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700"
                            onClick={() => setSteps((arr) => arr.filter((_, j) => j !== i))}
                            disabled={steps.length === 1}
                            aria-label={`Hapus langkah ${i + 1}`}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </div>
                        <Input
                          value={step.name}
                          onChange={(e) =>
                            setSteps((arr) => arr.map((s, j) => (j === i ? { ...s, name: e.target.value } : s)))
                          }
                          placeholder="Nama langkah — riset keyword"
                        />
                        <Input
                          value={step.text}
                          onChange={(e) =>
                            setSteps((arr) => arr.map((s, j) => (j === i ? { ...s, text: e.target.value } : s)))
                          }
                          placeholder="Detail singkat langkah ini"
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setSteps((arr) => [...arr, { name: "", text: "" }])}
                  >
                    <Plus className="size-3.5 mr-1" /> Tambah Langkah
                  </Button>
                </div>
              )}

              {schemaType === "PRODUCT" && (
                <div className="grid gap-3 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2">
                  <p className="col-span-full flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <Package className="size-3.5" /> Detail Produk
                  </p>
                  <div className="space-y-1.5">
                    <Label htmlFor="forge-harga" className={labelCls}>Harga</Label>
                    <Input
                      id="forge-harga"
                      value={harga}
                      onChange={(e) => setHarga(e.target.value)}
                      placeholder="1500000"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className={labelCls}>Mata Uang</Label>
                    <Select value={mataUang} onValueChange={setMataUang}>
                      <SelectTrigger className="w-full" aria-label="Mata uang">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR">IDR — Rupiah</SelectItem>
                        <SelectItem value="USD">USD — Dollar</SelectItem>
                        <SelectItem value="SGD">SGD — Singapore</SelectItem>
                        <SelectItem value="EUR">EUR — Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className={labelCls}>Ketersediaan</Label>
                    <Select value={ketersediaan} onValueChange={setKetersediaan}>
                      <SelectTrigger className="w-full" aria-label="Ketersediaan">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABILITY.map((a) => (
                          <SelectItem key={a.value} value={a.value}>
                            {a.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {schemaType === "ARTICLE" && (
                <div className="grid gap-3 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2">
                  <p className="col-span-full flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <Newspaper className="size-3.5" /> Detail Artikel
                  </p>
                  <div className="space-y-1.5">
                    <Label htmlFor="forge-penulis" className={labelCls}>Penulis</Label>
                    <Input
                      id="forge-penulis"
                      value={penulis}
                      onChange={(e) => setPenulis(e.target.value)}
                      placeholder="Gunara Pratama"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="forge-tanggal" className={labelCls}>Tanggal Publish</Label>
                    <Input
                      id="forge-tanggal"
                      type="date"
                      value={tanggalPublish}
                      onChange={(e) => setTanggalPublish(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {schemaType === "LOCAL_BUSINESS" && (
                <div className="grid gap-3 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2">
                  <p className="col-span-full flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    <MapPin className="size-3.5" /> Detail Bisnis Lokal
                  </p>
                  <div className="space-y-1.5">
                    <Label htmlFor="forge-bisnis" className={labelCls}>Nama Bisnis</Label>
                    <Input
                      id="forge-bisnis"
                      value={namaBisnis}
                      onChange={(e) => setNamaBisnis(e.target.value)}
                      placeholder="Kopi Gunara Jakarta"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="forge-telp" className={labelCls}>Telepon</Label>
                    <Input
                      id="forge-telp"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="forge-alamat" className={labelCls}>Alamat</Label>
                    <Input
                      id="forge-alamat"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      placeholder="Jl. Sudirman No. 10, Jakarta Selatan"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="forge-jam" className={labelCls}>Jam Buka</Label>
                    <Input
                      id="forge-jam"
                      value={jamBuka}
                      onChange={(e) => setJamBuka(e.target.value)}
                      placeholder="Mo-Fr 08:00-17:00, Sa 08:00-14:00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="forge-rating" className={labelCls}>Rating (1–5)</Label>
                    <Input
                      id="forge-rating"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      placeholder="4.8"
                      inputMode="decimal"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="forge-review" className={labelCls}>Jumlah Review</Label>
                    <Input
                      id="forge-review"
                      value={jumlahReview}
                      onChange={(e) => setJumlahReview(e.target.value)}
                      placeholder="127"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeUp>

        {/* ── Kolom Pratinjau ── */}
        <FadeUp delay={0.1}>
          <Tabs defaultValue="serp" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="serp">Serp Google</TabsTrigger>
              <TabsTrigger value="og">Open Graph</TabsTrigger>
              <TabsTrigger value="twitter">Twitter Card</TabsTrigger>
              <TabsTrigger value="jsonld">JSON-LD</TabsTrigger>
            </TabsList>

            {/* SERP */}
            <TabsContent value="serp">
              <Card className="rounded-xl">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-base">Pratinjau Hasil Pencarian</CardTitle>
                  <CardDescription className="text-xs">
                    Perkiraan tampilan di hasil pencarian Google — desktop.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  {/* Kartu putih permanen — meniru tampilan Google */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-5 text-black shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 flex-none items-center justify-center rounded-full border border-neutral-200 bg-neutral-100 text-[10px] font-black text-neutral-500">
                        {faviconChar}
                      </span>
                      <div className="min-w-0 leading-tight">
                        <p className="truncate text-[13px] text-neutral-800">{siteName}</p>
                        <p className="truncate text-xs text-neutral-600">{trunc(displayUrl, 70)}</p>
                      </div>
                    </div>
                    <p className="mt-1.5 truncate text-xl text-emerald-700 dark:text-emerald-400">
                      {trunc(title.trim() || "Judul halaman belum ditempa", 60)}
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-neutral-600">
                      {trunc(
                        description.trim() ||
                          "Deskripsi meta belum diisi — Google akan mengambil potongan isi halaman secara otomatis.",
                        155
                      )}
                    </p>
                  </div>
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    Judul terpotong di 60 karakter, deskripsi di 155 — sesuai batas tampilan SERP.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Open Graph */}
            <TabsContent value="og">
              <Card className="rounded-xl">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-base">Pratinjau Open Graph</CardTitle>
                  <CardDescription className="text-xs">
                    Tampilan saat link dibagikan ke WhatsApp, Facebook, LinkedIn.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  <div className="mx-auto max-w-md overflow-hidden rounded-xl border bg-card shadow-sm">
                    {imageUrl.trim() ? (
                      <img
                        src={imageUrl.trim()}
                        alt="Pratinjau gambar Open Graph"
                        className="aspect-video w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center bg-muted">
                        <ImageIcon className="size-10 text-muted-foreground/40" aria-hidden />
                      </div>
                    )}
                    <div className="space-y-1 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {siteName}
                      </p>
                      <p className="truncate text-sm font-bold">
                        {trunc(title.trim() || "Judul halaman", 80)}
                      </p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {description.trim() || "Deskripsi halaman akan tampil di sini."}
                      </p>
                    </div>
                  </div>
                  {!imageUrl.trim() && (
                    <p className="mt-3 text-[11px] text-amber-600 dark:text-amber-400">
                      ⚠️ Belum ada gambar OG — kartu sosial tampak kosong saat dibagikan.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Twitter Card */}
            <TabsContent value="twitter">
              <Card className="rounded-xl">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="text-base">Pratinjau Twitter / X Card</CardTitle>
                  <CardDescription className="text-xs">
                    Kartu summary_large_image dengan handle akunmu.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  <div className="mx-auto max-w-sm space-y-3 rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-9 flex-none items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                        {faviconChar}
                      </span>
                      <div className="min-w-0 leading-tight">
                        <p className="truncate text-sm font-bold">{siteName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {handleClean ? `@${handleClean}` : "@handle-belum-diisi"}
                        </p>
                      </div>
                    </div>
                    {imageUrl.trim() ? (
                      <img
                        src={imageUrl.trim()}
                        alt="Pratinjau gambar Twitter Card"
                        className="aspect-[16/9] w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[16/9] w-full items-center justify-center rounded-lg bg-muted">
                        <ImageIcon className="size-8 text-muted-foreground/40" aria-hidden />
                      </div>
                    )}
                    <p className="truncate text-sm font-bold">
                      {trunc(title.trim() || "Judul halaman", 70)}
                    </p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {description.trim() || "Deskripsi halaman akan tampil di sini."}
                    </p>
                    <p className="truncate text-xs text-muted-foreground/70">{displayUrl}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* JSON-LD */}
            <TabsContent value="jsonld">
              <Card className="rounded-xl">
                <CardHeader className="p-6 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileCode2 className="size-4 text-emerald-600" /> Schema JSON-LD
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Tempel blok ini sebelum tag penutup &lt;/head&gt; halamanmu.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-3 space-y-3">
                  <pre className="max-h-96 overflow-auto nice-scroll rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed">
                    {`<script type="application/ld+json">\n${schemaStr}\n</script>`}
                  </pre>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={copyJsonLd}
                      aria-label="Salin JSON-LD"
                    >
                      {copied ? <Copy className="size-4 mr-1 text-emerald-600" /> : <Copy className="size-4 mr-1" />}
                      {copied ? "Tersalin!" : "📋 Salin JSON-LD"}
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => setSaveOpen(true)}
                    >
                      <Save className="size-4 mr-1" /> 💾 Simpan Preset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </FadeUp>
      </div>

      {/* ── Preset tersimpan ── */}
      <FadeUp delay={0.15}>
        <Card className="rounded-xl">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderOpen className="size-4 text-emerald-600" /> Preset Tersimpan
              {!loadingPresets && (
                <span className="ml-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tabular-nums">
                  {sortedPresets.length}
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              Muat ulang konfigurasi meta kapan pun — semua kolom terisi otomatis.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-3">
            {loadingPresets ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : sortedPresets.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Belum ada preset — tempa meta pertamamu lalu tekan 💾 Simpan Preset.
              </p>
            ) : (
              <ul className="max-h-96 space-y-2 overflow-y-auto nice-scroll pr-1">
                {sortedPresets.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 transition-colors hover:bg-muted/40"
                  >
                    <span className="size-2 flex-none rounded-full bg-amber-400" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.halaman}</p>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {trunc(p.title || "—", 48)} · {fmtDate(p.createdAt)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadPreset(p)}
                      aria-label={`Muat preset ${p.halaman}`}
                    >
                      <FolderOpen className="size-3.5 mr-1" /> Muat
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 dark:text-rose-400"
                      onClick={() => delPreset(p.id)}
                      aria-label={`Hapus preset ${p.halaman}`}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </FadeUp>

      {/* ── Dialog Simpan Preset ── */}
      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Simpan Preset Meta</DialogTitle>
            <DialogDescription>
              Beri nama halaman agar mudah dicari saat dimuat ulang.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="preset-halaman">Nama Halaman</Label>
              <Input
                id="preset-halaman"
                value={halaman}
                onChange={(e) => setHalaman(e.target.value)}
                placeholder="Beranda Utama"
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Proyek SEO{" "}
                <span className="font-normal text-muted-foreground">(opsional)</span>
              </Label>
              <Select value={presetProjectId} onValueChange={setPresetProjectId}>
                <SelectTrigger className="w-full" aria-label="Proyek untuk preset">
                  <SelectValue placeholder="Tanpa proyek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa proyek</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={savePreset}
              disabled={saving}
            >
              {saving && <Loader2 className="size-4 mr-1 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
