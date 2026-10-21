"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — RELEASE CENTER (Pusat Kendali Versi)
// by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon
//
// Sumber data: src/lib/versioning.ts (single source of truth)
// Standar: SemVer 2.0.0 · Keep a Changelog 1.1.0 · Conventional Commits
//
// Isi section:
//   🏷️ Hero versi aktif         — v{APP_VERSION} + salin info versi
//   📊 Statistik rilis          — 4 KPI agregat
//   🧩 Anatomi versi            — MAJOR/MINOR/PATCH + contoh dibedah
//   🕰️ Timeline rilis           — changelog interaktif per versi
//   🚀 Cara merilis versi baru  — 5 langkah + salin perintah
//   🔌 Manifest API             — GET /api/version live
//   🔗 Rantai dokumentasi       — worklog → changelog → tag
// ═══════════════════════════════════════════════════════════════════

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  Boxes,
  Copy,
  ExternalLink,
  FileJson,
  History,
  Plus,
  RefreshCw,
  Rocket,
  ScrollText,
  ShieldCheck,
  Tag,
  Trash2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  APP_CHANNEL,
  APP_VERSION,
  CHANGELOG_CATEGORIES,
  SEMVER_RULES,
  getRelease,
  releaseStats,
  sortedReleases,
  type ChangelogCategory,
} from "@/lib/versioning";
import { cn } from "@/lib/utils";
import { FadeUp, FloatingOrbs, PulseDot } from "./motion";

// ── Peta kategori changelog (Keep a Changelog) → label + ikon + badge ──
const CATEGORY_META: Record<
  ChangelogCategory,
  { label: string; icon: LucideIcon; badge: string }
> = {
  added: {
    label: "Ditambahkan",
    icon: Plus,
    badge:
      "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  changed: {
    label: "Diubah",
    icon: RefreshCw,
    badge:
      "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:border-amber-400/40 dark:bg-amber-400/15 dark:text-amber-300",
  },
  deprecated: {
    label: "Deprecated",
    icon: Archive,
    badge:
      "border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:border-zinc-400/40 dark:bg-zinc-400/10 dark:text-zinc-300",
  },
  removed: {
    label: "Dihapus",
    icon: Trash2,
    badge:
      "border-red-600/30 bg-red-600/10 text-red-700 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-300",
  },
  fixed: {
    label: "Diperbaiki",
    icon: Wrench,
    badge:
      "border-sky-600/30 bg-sky-600/10 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/15 dark:text-sky-300",
  },
  security: {
    label: "Keamanan",
    icon: ShieldCheck,
    badge:
      "border-violet-600/30 bg-violet-600/10 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-300",
  },
};

// ── Warna bagian SemVer (konsisten: MAJOR merah, MINOR emerald, PATCH sky) ──
const PART_COLOR: Record<"MAJOR" | "MINOR" | "PATCH", string> = {
  MAJOR: "text-red-600 dark:text-red-400",
  MINOR: "text-emerald-600 dark:text-emerald-400",
  PATCH: "text-sky-600 dark:text-sky-400",
};

// ── Badge standar di hero ──
const STANDARDS = ["SemVer 2.0.0", "Keep a Changelog", "Conventional Commits"];

// ── Artefak dokumentasi terkait (manifest links) ──
const DOC_LINKS = [
  { href: "/version.json", label: "version.json" },
  { href: "/CHANGELOG.md", label: "CHANGELOG.md" },
  { href: "/VERSIONING.md", label: "VERSIONING.md" },
];

// ── Rantai dokumentasi (footer note) ──
const DOC_CHAIN = [
  "worklog.md",
  "CHANGELOG.md",
  "versioning.ts",
  "version.json",
  "git tag vX.Y.Z",
];

// ── Langkah merilis versi baru ──
const STEPS: {
  title: string;
  desc: string;
  files?: string[];
  codes?: { code: string; hint?: string }[];
}[] = [
  {
    title: "Pastikan kode sehat",
    desc: "Nol error lint sebelum menyentuh nomor versi — gerbang kualitas pertama.",
    codes: [{ code: "bun run lint", hint: "# harus 0 error" }],
  },
  {
    title: "Pilih jenis kenaikan versi",
    desc: "CLI men-sync 4 file otomatis (branding.ts, package.json, sidebar, footer) dalam satu perintah.",
    codes: [
      { code: "bun run version:patch", hint: "# bug fix saja" },
      { code: "bun run version:minor", hint: "# fitur baru" },
      { code: "bun run version:major", hint: "# breaking change" },
    ],
  },
  {
    title: "Catat perubahan",
    desc: "Tambah ReleaseEntry baru untuk versi tersebut, lalu pindahkan catatan [Unreleased] ke bagian versi baru.",
    files: ["src/lib/versioning.ts", "CHANGELOG.md"],
  },
  {
    title: "Validasi sebelum rilis",
    desc: "Harus SEMUA OK — entri changelog lengkap, format SemVer valid, semua file tersinkron.",
    codes: [{ code: "bun run version:check", hint: "# harus SEMUA OK" }],
  },
  {
    title: "Kunci riwayat dengan git tag",
    desc: "Tandai commit rilis — riwayat jadi permanen dan bisa diaudit kapan pun.",
    codes: [{ code: 'git tag -a vX.Y.Z -m "GUNARA OS vX.Y.Z"', hint: "# ganti X.Y.Z" }],
  },
];

// ── Helper: tanggal id-ID (zona Asia/Jakarta, anti hydration-mismatch) ──
function fmtDateID(iso: string): string {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
      timeZone: "Asia/Jakarta",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// ── Helper: salin ke clipboard + fallback lama ──
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

// ── Judul blok section (ikon + h2 + deskripsi) ──
function SectionTitle({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="space-y-1">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="grid size-8 place-items-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
          aria-hidden
        >
          <Icon className="size-4.5" />
        </span>
        <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
      </div>
      <p className="text-sm break-words text-muted-foreground">{desc}</p>
    </div>
  );
}

// ── Baris perintah + tombol salin ──
function CodeRow({
  code,
  hint,
  onCopy,
}: {
  code: string;
  hint?: string;
  onCopy: (code: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/60 p-2 pl-3">
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap rounded font-mono text-xs">
        {code}
      </code>
      {hint && (
        <span className="hidden shrink-0 font-mono text-[11px] text-muted-foreground sm:inline">
          {hint}
        </span>
      )}
      <Button
        variant="ghost"
        size="icon"
        className="size-7 shrink-0"
        aria-label={`Salin perintah: ${code}`}
        onClick={() => onCopy(code)}
      >
        <Copy className="size-3.5" aria-hidden />
      </Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SECTION UTAMA
// ═══════════════════════════════════════════════════════════════════
export function ReleaseCenterSection() {
  const { toast } = useToast();

  const releases = useMemo(() => sortedReleases(), []);
  const stats = useMemo(() => releaseStats(), []);
  const current = useMemo(() => getRelease(APP_VERSION), []);

  const copyVersionInfo = useCallback(async () => {
    const payload = {
      name: "GUNARA OS",
      version: APP_VERSION,
      codename: current?.codename ?? null,
      date: current?.date ?? null,
      channel: APP_CHANNEL,
    };
    const ok = await copyText(JSON.stringify(payload, null, 2));
    if (ok) {
      toast({
        title: "📋 Info versi disalin",
        description: `JSON v${APP_VERSION} “${current?.codename ?? "—"}” siap ditempel ke dokumen atau issue.`,
      });
    } else {
      toast({
        title: "Gagal menyalin",
        description: "Clipboard tidak tersedia di browser ini.",
        variant: "destructive",
      });
    }
  }, [current, toast]);

  const copyCommand = useCallback(
    async (code: string) => {
      const ok = await copyText(code);
      if (ok) {
        toast({ title: "📋 Perintah disalin", description: code });
      } else {
        toast({
          title: "Gagal menyalin",
          description: "Clipboard tidak tersedia di browser ini.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const kpis = [
    {
      label: "Total Rilis",
      value: stats.totalReleases,
      hint: `sejak v${releases[releases.length - 1]?.version ?? "—"}`,
      icon: Tag,
      chip: "bg-muted text-foreground",
    },
    {
      label: "Fitur Ditambahkan",
      value: stats.added,
      hint: "entri Added tercatat",
      icon: Plus,
      chip: "bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    },
    {
      label: "Penyempurnaan",
      value: stats.changed,
      hint: "entri Changed tercatat",
      icon: RefreshCw,
      chip: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
    },
    {
      label: "Bug Diperbaiki",
      value: stats.fixed,
      hint: "entri Fixed tercatat",
      icon: Wrench,
      chip: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
    },
  ];

  return (
    <section aria-label="Release Center — pusat kendali versi GUNARA OS" className="space-y-8">
      {/* ── 1. HERO — versi aktif ── */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 p-6 text-emerald-50 sm:p-8">
          <FloatingOrbs />
          <div className="relative z-10 space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                🏷️ VERSION CONTROL — STANDAR INTERNASIONAL
              </p>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Release Center</h1>
              <p className="max-w-2xl text-sm text-emerald-100/90">
                Pusat kendali versi GUNARA OS — seluruh riwayat rilis terstruktur mengikuti{" "}
                <strong className="text-amber-200">SemVer 2.0.0</strong>,{" "}
                <strong className="text-amber-200">Keep a Changelog</strong>, dan{" "}
                <strong className="text-amber-200">Conventional Commits</strong>. Setiap perubahan
                punya jejak yang bisa diaudit.
              </p>
            </div>

            <div className="flex flex-col gap-5 rounded-xl border border-emerald-300/20 bg-emerald-950/40 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                  Versi Aktif
                </p>
                <p className="font-mono text-5xl font-black leading-none tracking-tight text-white tabular-nums sm:text-6xl">
                  v{APP_VERSION}
                </p>
                <p className="text-sm break-words text-emerald-100/90">
                  <span className="font-semibold text-amber-200">
                    “{current?.codename ?? "tanpa codename"}”
                  </span>{" "}
                  · dirilis {current ? fmtDateID(current.date) : "—"}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge className="border border-emerald-300/40 bg-emerald-400/15 text-emerald-100">
                    <PulseDot />
                    {APP_CHANNEL.toUpperCase()}
                  </Badge>
                  {STANDARDS.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="border-emerald-300/30 bg-white/5 text-emerald-100"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
                <Button
                  onClick={() => void copyVersionInfo()}
                  className="w-full bg-emerald-500 text-emerald-950 hover:bg-emerald-400 sm:w-auto"
                >
                  📋 Salin Info Versi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── 2. STATISTIK RILIS — 4 KPI ── */}
      <FadeUp>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label} className="gap-1.5 rounded-xl p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {k.label}
                </p>
                <span
                  className={cn("grid size-8 shrink-0 place-items-center rounded-lg", k.chip)}
                  aria-hidden
                >
                  <k.icon className="size-4" />
                </span>
              </div>
              <p className="font-mono text-2xl font-bold tabular-nums sm:text-3xl">{k.value}</p>
              <p className="text-xs break-words text-muted-foreground">{k.hint}</p>
            </Card>
          ))}
        </div>
      </FadeUp>

      {/* ── 3. ANATOMI VERSI — SemVer 2.0.0 ── */}
      <FadeUp>
        <div className="space-y-4">
          <SectionTitle
            icon={Boxes}
            title="Anatomi Versi"
            desc="Naikkan MAJOR saat breaking change, MINOR saat fitur baru, PATCH saat bug fix — persis aturan resmi semver.org."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {SEMVER_RULES.map((rule) => (
              <Card key={rule.part} className="gap-2 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn("font-mono text-lg font-black tracking-tight", PART_COLOR[rule.part])}
                  >
                    {rule.part}
                  </span>
                  <Badge variant="outline" className="font-mono text-[11px]">
                    {rule.example}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed break-words">{rule.when}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Contoh nyata:</span> {rule.exampleWhen}
                </p>
              </Card>
            ))}
          </div>

          {/* Contoh dibedah: v9.1.2 */}
          <Card className="mt-4 gap-3 rounded-xl border-emerald-600/20 bg-emerald-600/5 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
              Contoh dibedah — v9.1.2
            </p>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
              <p className="shrink-0 font-mono text-5xl font-black leading-none tracking-tight sm:text-6xl">
                <span>v</span>
                <span className={PART_COLOR.MAJOR}>9</span>
                <span className="text-muted-foreground/60">.</span>
                <span className={PART_COLOR.MINOR}>1</span>
                <span className="text-muted-foreground/60">.</span>
                <span className={PART_COLOR.PATCH}>2</span>
              </p>
              <ul className="min-w-0 flex-1 space-y-2.5">
                <li className="flex items-center gap-2.5">
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-md bg-red-600/10 font-mono text-sm font-bold text-red-600 dark:bg-red-500/15 dark:text-red-400"
                    aria-hidden
                  >
                    9
                  </span>
                  <p className="text-sm break-words text-muted-foreground">
                    <strong className="font-semibold text-foreground">MAJOR</strong> — generasi
                    arsitektur kesembilan
                  </p>
                </li>
                <li className="flex items-center gap-2.5">
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-md bg-emerald-600/10 font-mono text-sm font-bold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                    aria-hidden
                  >
                    1
                  </span>
                  <p className="text-sm break-words text-muted-foreground">
                    <strong className="font-semibold text-foreground">MINOR</strong> — rilis fitur
                    ke-1 sejak v9.0
                  </p>
                </li>
                <li className="flex items-center gap-2.5">
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-md bg-sky-500/10 font-mono text-sm font-bold text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
                    aria-hidden
                  >
                    2
                  </span>
                  <p className="text-sm break-words text-muted-foreground">
                    <strong className="font-semibold text-foreground">PATCH</strong> — patch ke-2:
                    hanya perbaikan bug
                  </p>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </FadeUp>

      {/* ── 4. TIMELINE RILIS ── */}
      <FadeUp>
        <div className="space-y-4">
          <SectionTitle
            icon={History}
            title="Timeline Rilis"
            desc={`${stats.totalItems} perubahan tercatat merata di ${stats.totalReleases} rilis — terbaru di atas, versi terpasang terbuka otomatis.`}
          />
          <Accordion type="multiple" defaultValue={[APP_VERSION]}>
            <ol className="relative space-y-6 border-l-2 border-emerald-500/30">
              {releases.map((r) => {
                const isCurrent = r.version === APP_VERSION;
                const groups = CHANGELOG_CATEGORIES.map((cat) => ({ cat, items: r[cat] })).filter(
                  (g): g is { cat: ChangelogCategory; items: string[] } =>
                    Array.isArray(g.items) && g.items.length > 0
                );
                const total = groups.reduce((s, g) => s + g.items.length, 0);
                return (
                  <li key={r.version} className="relative pl-5 sm:pl-6">
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -left-2 top-6 size-3.5 rounded-full border-2",
                        isCurrent
                          ? "border-emerald-500 bg-emerald-500 ring-4 ring-emerald-500/20"
                          : "border-muted-foreground/40 bg-background"
                      )}
                    />
                    <Card className="gap-3 rounded-xl p-4 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {isCurrent ? (
                          <Badge className="border border-emerald-600/40 bg-emerald-600/15 font-mono text-emerald-700 dark:text-emerald-300">
                            v{r.version}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="font-mono">
                            v{r.version}
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                            TERPASANG
                          </Badge>
                        )}
                        <time
                          dateTime={r.date}
                          className="ml-auto font-mono text-xs text-muted-foreground"
                        >
                          {fmtDateID(r.date)}
                        </time>
                      </div>

                      <h3 className="text-base font-bold tracking-tight break-words sm:text-lg">
                        {r.codename}
                        <span className="font-normal text-muted-foreground"> — {r.title}</span>
                      </h3>
                      <p className="text-sm leading-relaxed break-words text-muted-foreground">
                        {r.summary}
                      </p>

                      <AccordionItem value={r.version} className="border-b-0">
                        <AccordionTrigger className="gap-2 rounded-md bg-muted/50 px-3 py-2.5 text-sm font-semibold hover:no-underline">
                          {total} perubahan tercatat
                        </AccordionTrigger>
                        <AccordionContent className="pb-1 pt-3">
                          <div className="space-y-4">
                            {groups.map((g) => {
                              const meta = CATEGORY_META[g.cat];
                              const Icon = meta.icon;
                              return (
                                <div key={g.cat} className="space-y-1.5">
                                  <Badge className={cn("gap-1", meta.badge)}>
                                    <Icon aria-hidden />
                                    {meta.label}
                                  </Badge>
                                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                                    {g.items.map((item) => (
                                      <li key={item} className="break-words">
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Card>
                  </li>
                );
              })}
            </ol>
          </Accordion>
        </div>
      </FadeUp>

      {/* ── 5. CARA MERILIS VERSI BARU ── */}
      <FadeUp>
        <div className="space-y-4">
          <SectionTitle
            icon={Rocket}
            title="Cara Merilis Versi Baru"
            desc="Lima langkah disiplin — dari kode sehat sampai git tag. Ikuti berurutan, jangan ada yang dilewati."
          />
          <Card className="rounded-xl p-4 sm:p-6">
            <ol className="space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-3 sm:gap-4">
                  <span
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm font-semibold leading-snug sm:text-base">{s.title}</p>
                    <p className="text-sm break-words text-muted-foreground">{s.desc}</p>
                    {s.files && (
                      <div className="flex flex-wrap gap-1.5">
                        {s.files.map((f) => (
                          <code
                            key={f}
                            className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs break-all"
                          >
                            {f}
                          </code>
                        ))}
                      </div>
                    )}
                    {s.codes && (
                      <div className="space-y-1.5">
                        {s.codes.map((c) => (
                          <CodeRow key={c.code} code={c.code} hint={c.hint} onCopy={copyCommand} />
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </FadeUp>

      {/* ── 6. MANIFEST API ── */}
      <FadeUp>
        <ManifestCard toast={toast} />
      </FadeUp>

      {/* ── 7. CATATAN KAKI — rantai dokumentasi ── */}
      <FadeUp>
        <Card className="gap-2 rounded-xl p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <ScrollText className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
            <h2 className="text-base font-extrabold tracking-tight sm:text-lg">
              Rantai Dokumentasi
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            {DOC_CHAIN.map((chip, i) => (
              <span key={chip} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden className="text-muted-foreground">
                    →
                  </span>
                )}
                <span className="rounded-md border bg-muted px-2.5 py-1.5 font-mono text-xs">
                  {chip}
                </span>
              </span>
            ))}
          </div>
          <p className="text-sm break-words text-muted-foreground">
            Setiap perubahan tercatat di rantai ini — tidak ada yang hilang.
          </p>
        </Card>
      </FadeUp>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MANIFEST API — GET /api/version (live, dengan skeleton + retry)
// ═══════════════════════════════════════════════════════════════════
function ManifestCard({ toast }: { toast: ReturnType<typeof useToast>["toast"] }) {
  const [data, setData] = useState<unknown>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errMsg, setErrMsg] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setErrMsg("");
    try {
      const res = await fetch("/api/version", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
      setStatus("ready");
    } catch (e) {
      setErrMsg(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const pretty = useMemo(() => (data === null ? "" : JSON.stringify(data, null, 2)), [data]);

  const copyJson = useCallback(async () => {
    const ok = await copyText(pretty);
    if (ok) {
      toast({
        title: "📋 JSON manifest disalin",
        description: "Payload /api/version siap ditempel ke dokumen atau skrip.",
      });
    } else {
      toast({
        title: "Gagal menyalin",
        description: "Clipboard tidak tersedia di browser ini.",
        variant: "destructive",
      });
    }
  }, [pretty, toast]);

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={FileJson}
        title="Manifest API"
        desc="Metadata versi machine-readable — konsumsi dari CI, bot, atau skrip eksternal tanpa membuka UI."
      />
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            Endpoint Runtime
            <Badge variant="outline" className="font-mono text-[11px]">
              GET /api/version
            </Badge>
          </CardTitle>
          <CardDescription>
            Respons JSON live dari server — sumber yang sama dipakai script version:check.
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void copyJson()}
              disabled={status !== "ready"}
            >
              <Copy className="size-3.5" aria-hidden />
              Salin JSON
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-3">
          {status === "loading" && (
            <div className="space-y-2 rounded-lg border bg-muted/40 p-4" aria-hidden>
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm break-words text-destructive">
                Gagal memuat manifest ({errMsg}). Endpoint /api/version mungkin belum tersedia atau
                jaringan bermasalah.
              </p>
              <Button variant="outline" size="sm" onClick={() => void load()} className="shrink-0">
                <RefreshCw className="size-3.5" aria-hidden />
                Coba lagi
              </Button>
            </div>
          )}
          {status === "ready" && (
            <pre className="nice-scroll max-h-72 overflow-auto rounded-lg border bg-muted/50 p-4 font-mono text-xs leading-relaxed">
              {pretty}
            </pre>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Artefak terkait:</span>
            {DOC_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2.5 py-1.5 font-mono text-xs underline underline-offset-2 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {l.label}
                <ExternalLink className="size-3" aria-hidden />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
