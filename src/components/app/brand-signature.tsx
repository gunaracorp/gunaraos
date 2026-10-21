"use client";

// ═══════════════════════════════════════════════════════════════════
// GUNARA OS — BRAND SIGNATURE (tertanam, senyap di permukaan)
// ═══════════════════════════════════════════════════════════════════
// Tiga lapis branding yang "sembunyi tapi ada":
//   1. BrandMark        → logo "G" : klik 7× untuk membuka Vault Signature
//   2. BrandConsole     → banner signature di DevTools console
//   3. BrandSignatureLine → satu baris senyap di footer (SEO & rel=me)
// ═══════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Facebook, Twitter, Instagram, Music2, AtSign, MessageCircle,
  Fingerprint, Building2, ExternalLink,
} from "lucide-react";
import { BRAND, BRAND_SIGNATURE } from "@/lib/branding";

const VAULT_CLICKS = 7;

/* ───────────────────────────────────────────────────────────────────
 * 1. VAULT — logo "G" yang diklik 7× membuka signature tersembunyi
 * ─────────────────────────────────────────────────────────────────── */
export function BrandMark() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const clicks = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    clicks.current += 1;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => { clicks.current = 0; }, 2500);
    if (clicks.current >= VAULT_CLICKS) {
      clicks.current = 0;
      setOpen(true);
    }
  };

  useEffect(() => () => { if (resetTimer.current) clearTimeout(resetTimer.current); }, []);

  return (
    <>
      <motion.button
        type="button"
        onClick={handleClick}
        whileHover={reduce ? {} : { rotate: -6, scale: 1.06 }}
        whileTap={reduce ? {} : { scale: 0.94 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        className="size-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-emerald-950 font-black text-lg shadow-lg cursor-pointer select-none"
        aria-label="Gunara"
      >
        G
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Fingerprint className="size-5 text-amber-500" />
              Vault — Signature
            </DialogTitle>
            <DialogDescription>
              Tanda tangan digital yang tertanam di dalam GUNARA OS.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border bg-gradient-to-br from-emerald-950 to-emerald-900 p-4 text-emerald-50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-300/70">Ditempa oleh</p>
              <p className="mt-1 text-xl font-extrabold tracking-tight text-amber-300">{BRAND.person.knownAs}</p>
              <p className="text-sm text-emerald-100/80">{BRAND.person.fullName}</p>
              <p className="mt-2 text-xs text-emerald-200/70">{BRAND.person.roles.join(" · ")}</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {BRAND.person.alias.map((a) => (
                <span key={a} className="rounded-full border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  {a}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              {BRAND.organizations.map((org) => (
                <a
                  key={org.domain}
                  href={org.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-lg border bg-muted/30 px-3 py-2 text-sm transition-colors hover:bg-muted/60"
                >
                  <Building2 className="size-4 flex-none text-emerald-700 dark:text-emerald-400" />
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-semibold">{org.name}</span>
                    <span className="block text-xs text-muted-foreground">{org.domain}</span>
                  </span>
                  <ExternalLink className="size-3.5 flex-none text-muted-foreground" />
                </a>
              ))}
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Terhubung di mana saja</p>
              <div className="grid grid-cols-2 gap-1.5">
                {BRAND.socials.map((s) => {
                  const Icon = SOCIAL_ICON_MAP[s.name] ?? ExternalLink;
                  return (
                    <a
                      key={s.url}
                      href={s.url}
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border bg-muted/30 px-2.5 py-2 text-xs transition-colors hover:bg-muted/60"
                    >
                      <Icon className="size-3.5 flex-none" />
                      <span className="truncate font-medium">{s.handle}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <p className="text-center text-[10px] leading-relaxed text-muted-foreground/70">
              Gunara Corp · 2 PT · 49 Domain — &ldquo;Prak burukeun, segerakan kesadaran.&rdquo;
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ───────────────────────────────────────────────────────────────────
 * 2. CONSOLE — banner signature hanya terlihat di DevTools
 * ─────────────────────────────────────────────────────────────────── */
export function BrandConsole() {
  useEffect(() => {
    if (typeof console === "undefined") return;
    const style = [
      "color:#fbbf24", "background:#0d1f19", "font-size:14px", "padding:8px 14px",
      "border:1px solid #065f46", "border-radius:6px", "font-weight:700",
    ].join(";");
    console.log("%c GUNARA OS ", style);
    console.info(
      "%cby Gugun Gunara — Muhammad Lutfi Azmi\nprabudanling · Santri Angon\nPT Top Konsultan Internasional (topkonsultan.web.id)\nPT Digital Bisnis Manajemen (digiman.id)\nMaster Polymath · Sage Universal · The Ultimate Problem Solver",
      "color:#34d399;font-size:11px;line-height:1.7",
    );
    console.info(
      "%cSosial: facebook.com/bossdanling · x.com/gunzz_krenzz · instagram.com/prabudanling\ntiktok.com/@gunaracorp · threads.com/@prabudanling · reddit.com/user/prabudanling",
      "color:#94a3b8;font-size:10px;line-height:1.6",
    );
  }, []);
  return null;
}

/* ───────────────────────────────────────────────────────────────────
 * 3. FOOTER SIGNATURE — satu baris senyap, opacity rendah,
 *    link rel="me" agar Google mengasosiasikan profil = pemilik situs
 * ─────────────────────────────────────────────────────────────────── */
export function BrandSignatureLine() {
  return (
    <div className="w-full border-t border-dashed border-border/60 mt-2 pt-2 opacity-40 hover:opacity-90 transition-opacity">
      {/* Teks penuh untuk mesin pencari & pembaca layar */}
      <p className="sr-only">{BRAND_SIGNATURE}</p>
      {/* Baris senyap di permukaan */}
      <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
        by <strong className="font-semibold">Gugun Gunara</strong> — Muhammad Lutfi Azmi
        <span className="mx-1" aria-hidden>·</span>prabudanling
        <span className="mx-1" aria-hidden>·</span>Santri Angon
      </p>
      <p className="mt-0.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
        {BRAND.socials.map((s) => (
          <a
            key={s.url}
            href={s.url}
            target="_blank"
            rel="me noopener noreferrer"
            className="hover:text-foreground hover:underline underline-offset-2"
          >
            {s.handle}
          </a>
        ))}
      </p>
    </div>
  );
}

/** Peta ikon sosial (lucide tidak punya brand TikTok/Threads/Reddit). */
const SOCIAL_ICON_MAP: Record<string, typeof Facebook> = {
  Facebook,
  "X (Twitter)": Twitter,
  Instagram,
  TikTok: Music2,
  Threads: AtSign,
  Reddit: MessageCircle,
};
