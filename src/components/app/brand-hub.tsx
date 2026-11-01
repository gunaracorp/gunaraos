"use client";

// ═══════════════════════════════════════════════════════════════
// 👑 BRAND & SOCIAL HUB — Identitas Dunia GUNARA OS
// by Gugun Gunara — Muhammad Lutfi Azmi · prabudanling · Santri Angon
// ═══════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";
import {
  Crown, Copy, Check, Globe, ShieldCheck, Facebook, Instagram, Twitter,
  Music2, AtSign, MessageCircle, Search, ListChecks, ExternalLink,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeUp, Stagger, StaggerItem, PulseDot } from "./motion";
import { BRAND, BRAND_SIGNATURE } from "@/lib/branding";

const SOCIAL_ICON_MAP: Record<string, LucideIcon> = {
  Facebook,
  "X (Twitter)": Twitter,
  Instagram,
  TikTok: Music2,
  Threads: AtSign,
  Reddit: MessageCircle,
};

type ProbeState = "idle" | "loading" | "ok" | "fail";

const SEO_PROBES: { label: string; path: string }[] = [
  { label: "robots.txt", path: "/robots.txt" },
  { label: "sitemap.xml", path: "/sitemap.xml" },
  { label: "OpenGraph Image", path: "/opengraph-image" },
  { label: "Version Manifest", path: "/api/version" },
];

function SeoLivePanel() {
  const [states, setStates] = useState<Record<string, { state: ProbeState; ms: number }>>({});

  const runProbes = async () => {
    setStates(Object.fromEntries(SEO_PROBES.map((p) => [p.label, { state: "loading", ms: 0 }])));
    await Promise.all(
      SEO_PROBES.map(async (p) => {
        const t0 = performance.now();
        try {
          const res = await fetch(p.path, { cache: "no-store" });
          const ms = Math.round(performance.now() - t0);
          setStates((s) => ({ ...s, [p.label]: { state: res.ok ? "ok" : "fail", ms } }));
        } catch {
          setStates((s) => ({ ...s, [p.label]: { state: "fail", ms: Math.round(performance.now() - t0) } }));
        }
      })
    );
  };

  useEffect(() => {
    const t = setTimeout(runProbes, 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <PulseDot /> Status Kesiapan Google — Live
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {SEO_PROBES.map((p) => {
          const st = states[p.label] || { state: "idle", ms: 0 };
          return (
            <div key={p.label} className="rounded-lg border bg-background/60 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{p.label}</span>
                {st.state === "ok" && <Check className="size-4 text-emerald-500" />}
                {st.state === "fail" && <span className="text-xs font-bold text-red-500">GAGAL</span>}
                {st.state === "loading" && <span className="text-[10px] text-muted-foreground">probe…</span>}
                {st.state === "idle" && <span className="text-[10px] text-muted-foreground">—</span>}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {st.state === "ok" ? `SIAP · ${st.ms} ms` : st.state === "fail" ? "tidak terjangkau" : "\u00a0"}
              </div>
            </div>
          );
        })}
        <Button variant="outline" size="sm" className="col-span-2 lg:col-span-4" onClick={runProbes}>
          <Search className="mr-2 size-4" /> Probe Ulang
        </Button>
      </CardContent>
    </Card>
  );
}

export function BrandHubSection() {
  const [copied, setCopied] = useState(false);

  const copySignature = async () => {
    try {
      await navigator.clipboard.writeText(BRAND_SIGNATURE);
      setCopied(true);
      toast.success("Tersalin!", { description: "Signature lengkap siap ditempel di mana pun." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin — coba manual.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 lg:p-6">
      {/* ── HERO SIGNATURE ── */}
      <FadeUp>
        <Card className="overflow-hidden border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Crown className="size-5 text-amber-500" />
              <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">IDENTITAS DUNIA</Badge>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight lg:text-3xl">
                {BRAND.person.knownAs}
                <span className="ml-2 text-base font-semibold text-muted-foreground">
                  ({BRAND.person.fullName})
                </span>
              </h1>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {BRAND.person.roles.join(" · ")}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {BRAND.person.alias.map((a) => (
                <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={copySignature} size="sm">
                {copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}
                {copied ? "Tersalin!" : "Salin Signature Lengkap"}
              </Button>
              <span className="text-[11px] text-muted-foreground">
                Tertanam di JSON-LD, robots, sitemap, OG image, manifest.
              </span>
            </div>
          </CardContent>
        </Card>
      </FadeUp>

      {/* ── SUPPORT SYSTEM ── */}
      <Stagger className="grid gap-3 md:grid-cols-2">
        {BRAND.organizations.map((org) => (
          <StaggerItem key={org.domain}>
            <Card className="h-full">
              <CardContent className="flex h-full items-start gap-3 p-4">
                <div className="rounded-lg bg-emerald-500/10 p-2.5">
                  <Globe className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold">{org.name}</div>
                  <a
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    {org.domain} <ExternalLink className="size-3" />
                  </a>
                  <p className="mt-1 text-xs text-muted-foreground">{org.description}</p>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      {/* ── 6 SOSIAL MEDIA ── */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <ShieldCheck className="size-5 text-emerald-500" /> 6 Kanal Resmi — <code className="rounded bg-muted px-1.5 py-0.5 text-xs">rel=&quot;me&quot;</code> terverifikasi
        </h2>
        <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {BRAND.socials.map((s) => {
            const Icon = SOCIAL_ICON_MAP[s.name] || Globe;
            return (
              <StaggerItem key={s.name}>
                <a href={s.url} target="_blank" rel="me noopener noreferrer" className="block">
                  <Card className="transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/5">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="rounded-lg bg-emerald-500/10 p-2.5">
                        <Icon className="size-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-bold">{s.name}</div>
                        <div className="truncate text-xs text-muted-foreground">@{s.handle}</div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>

      <FadeUp><SeoLivePanel /></FadeUp>

      {/* ── CHECKLIST MESIN "NAMA NAIK DI GOOGLE" ── */}
      <FadeUp>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="size-5 text-emerald-500" /> Mesin &quot;Nama Naik di Google&quot; — Yang Sudah Tertanam
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm md:grid-cols-2">
            {[
              "JSON-LD @graph: Person + Organization + WebSite + SoftwareApplication + FAQPage",
              "sameAs → 6 kanal sosial resmi (verifikasi identitas)",
              "robots.txt: Googlebot + 25 bot + 12 AI crawler (era GEO)",
              "sitemap.xml hreflang id-ID / en-US",
              "OG image dinamis dengan nama Gugun Gunara",
              "40+ brand keyword di metadata (termasuk alias & domain PT)",
              "Manifest versi + changelog terbuka untuk crawler",
              "Signature konsisten di footer, vault, dan easter egg",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 rounded-lg border bg-background/50 p-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span className="text-xs leading-relaxed">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </FadeUp>
    </div>
  );
}
