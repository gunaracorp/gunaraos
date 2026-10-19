"use client";

// ═══════════════════════════════════════════════════
// GUNARA OS — Aset Digital: Sosial Media · Brankas
// Kredensial (AES-256-GCM) · Pengguna & Akses
// Keamanan standar internasional: password tidak pernah
// dikirim saat list — reveal via endpoint khusus.
// ═══════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Share2, KeyRound, Users, Eye, Copy, MoreHorizontal, ShieldAlert, ShieldCheck, Lock,
} from "lucide-react";
import { RecordTable } from "./record-table";
import { useRecords } from "./use-records";
import { SOCIAL_CONFIG, VAULT_CONFIG, APPUSER_CONFIG, BadgeMini } from "@/lib/gunara";
import { FadeUp } from "./motion";
import { useToast } from "@/hooks/use-toast";

type Row = Record<string, any>;

// ── Aksi baris: lihat & salin kredensial terenkripsi ──
function SecretRowActions({ resource, row, field = "password" }: {
  resource: string; row: Row; field?: string;
}) {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const reveal = async (action: "view" | "copy") => {
    setBusy(true);
    try {
      const res = await fetch(`/api/data/${resource}/${row.id}?reveal=${field}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json = await res.json();
      if (action === "copy") {
        await navigator.clipboard.writeText(json.value || "");
        toast({ title: "Tersalin ke clipboard", description: `${row.label || row.handle} — otomatis hapus dari clipboard setelah dipakai.` });
      } else {
        toast({ title: `Password: ${json.value || "(kosong)"}`, description: `${row.label || row.handle} — jangan screenshot layar ini.` });
      }
    } catch {
      toast({ title: "Gagal membuka kredensial", description: "Coba lagi sebentar.", variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  if (!row.hasPassword) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-7" aria-label="Buka kredensial" disabled={busy}>
          <Lock className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => reveal("view")}><Eye className="size-4 mr-2" /> Lihat password</DropdownMenuItem>
        <DropdownMenuItem onClick={() => reveal("copy")}><Copy className="size-4 mr-2" /> Salin password</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Panel kesehatan keamanan brankas ──
function VaultHealth({ items }: { items: Row[] }) {
  const no2fa = items.filter((x) => x.twoFactorType === "NONE").length;
  const lemah = items.filter((x) => x.strength === "LEMAH").length;
  const kompromi = items.filter((x) => x.status === "KOMPROMI").length;
  const stale = items.filter((x) => !x.lastRotatedAt).length;
  const kesehatan = no2fa + lemah + kompromi === 0 && items.length > 0
    ? { label: "SEHAT — KEPATUHAN PENUH", tone: "green" as const }
    : { label: "PERLU PERHATIAN", tone: "amber" as const };

  return (
    <FadeUp>
      <div className="rounded-xl border bg-card p-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          {kesehatan.tone === "green"
            ? <ShieldCheck className="size-5 text-emerald-600" />
            : <ShieldAlert className="size-5 text-amber-600" />}
          <BadgeMini text={kesehatan.label} tone={kesehatan.tone} />
        </div>
        <p className="text-xs text-muted-foreground">
          Tanpa 2FA: <strong className="text-foreground">{no2fa}</strong> · Password lemah: <strong className="text-foreground">{lemah}</strong> ·
          Belum pernah dirotasi: <strong className="text-foreground">{stale}</strong> · Kompromi: <strong className="text-foreground">{kompromi}</strong>
        </p>
        <p className="text-[11px] text-muted-foreground/80 ml-auto italic">
          Standar OWASP ASVS: rotasi 90 hari, 2FA untuk semua akun utama.
        </p>
      </div>
    </FadeUp>
  );
}

// ── Section utama ──
export function AsetDigitalSection() {
  const social = useRecords("socialAccount");
  const vault = useRecords("vaultEntry");
  const users = useRecords("appUser");

  const sosmedStat = useMemo(() => {
    const total = social.items.reduce((a, x) => a + (x.followers || 0), 0);
    const tanpa2fa = social.items.filter((x) => !x.twoFactor).length;
    return { total: social.items.length, totalFollowers: total, tanpa2fa };
  }, [social.items]);

  const vaultStat = useMemo(() => {
    const google = vault.items.filter((x) => x.category === "EMAIL_GOOGLE").length;
    return { total: vault.items.length, google };
  }, [vault.items]);

  const userStat = useMemo(() => {
    const aktif = users.items.filter((x) => x.status === "AKTIF").length;
    const tanpa2fa = users.items.filter((x) => x.twoFactorType === "NONE").length;
    return { total: users.items.length, aktif, tanpa2fa };
  }, [users.items]);

  return (
    <div className="space-y-4">
      <FadeUp>
        <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-sky-50 to-emerald-50 dark:from-sky-950/40 dark:to-emerald-950/40 p-5">
          <h2 className="text-lg font-extrabold tracking-tight">🔐 ASET DIGITAL — Sosmed · Kredensial · Akses</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Database sosial media &amp; brankas kredensial Gunara Group — email Google, OSS, pajak, bank, marketplace.
            Password dienkripsi <strong className="text-emerald-800 dark:text-emerald-300">AES-256-GCM</strong> (standar NIST),
            hash pengguna <strong className="text-emerald-800 dark:text-emerald-300">scrypt</strong> (standar OWASP).
          </p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card border px-3 py-1.5 font-medium">
              <Share2 className="size-3.5 text-emerald-700 dark:text-emerald-400" />
              <strong>{sosmedStat.total}</strong> akun sosmed · <strong>{sosmedStat.totalFollowers.toLocaleString("id-ID")}</strong> followers gabungan
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card border px-3 py-1.5 font-medium">
              <KeyRound className="size-3.5 text-emerald-700 dark:text-emerald-400" />
              <strong>{vaultStat.total}</strong> kredensial (<strong>{vaultStat.google}</strong> Google)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card border px-3 py-1.5 font-medium">
              <Users className="size-3.5 text-emerald-700 dark:text-emerald-400" />
              <strong>{userStat.total}</strong> pengguna (<strong>{userStat.aktif}</strong> aktif)
            </span>
          </div>
        </div>
      </FadeUp>

      <Tabs defaultValue="sosmed">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="sosmed" className="gap-1.5"><Share2 className="size-3.5" /> Sosial Media</TabsTrigger>
          <TabsTrigger value="brankas" className="gap-1.5"><KeyRound className="size-3.5" /> Brankas Kredensial</TabsTrigger>
          <TabsTrigger value="pengguna" className="gap-1.5"><Users className="size-3.5" /> Pengguna &amp; Akses</TabsTrigger>
        </TabsList>

        <TabsContent value="sosmed">
          <RecordTable
            config={SOCIAL_CONFIG}
            rows={social.items}
            loading={social.loading}
            onCreate={social.create}
            onUpdate={social.update}
            onDelete={social.remove}
            extraRowActions={(row) => <SecretRowActions resource="socialAccount" row={row} />}
          />
          {sosmedStat.tanpa2fa > 0 && (
            <FadeUp delay={0.05}>
              <p className="mt-2 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="size-3.5" /> {sosmedStat.tanpa2fa} akun sosmed belum mengaktifkan 2FA — aktifkan hari ini juga.
              </p>
            </FadeUp>
          )}
        </TabsContent>

        <TabsContent value="brankas" className="space-y-3">
          <VaultHealth items={vault.items} />
          <RecordTable
            config={VAULT_CONFIG}
            rows={vault.items}
            loading={vault.loading}
            onCreate={vault.create}
            onUpdate={vault.update}
            onDelete={vault.remove}
            extraRowActions={(row) => <SecretRowActions resource="vaultEntry" row={row} />}
          />
        </TabsContent>

        <TabsContent value="pengguna">
          <RecordTable
            config={APPUSER_CONFIG}
            rows={users.items}
            loading={users.loading}
            onCreate={users.create}
            onUpdate={users.update}
            onDelete={users.remove}
          />
          <FadeUp delay={0.05}>
            <div className="mt-3 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2">
              <ShieldCheck className="size-4 text-emerald-700 dark:text-emerald-400 flex-none mt-0.5" />
              <p>
                Password disimpan sebagai <strong>hash scrypt</strong> (salt acak 16-byte, N=16384) — bahkan pemilik
                server tidak bisa membacanya. Kolom password di form boleh dikosongkan saat mengubah data lain,
                hash lama tetap berlaku. Kolom &ldquo;Password&rdquo; pada tabel menampilkan hasil skor kekuatan NIST.
              </p>
            </div>
          </FadeUp>
        </TabsContent>
      </Tabs>
    </div>
  );
}
