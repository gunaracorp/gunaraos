"use client";

// ═══════════════════════════════════════════════════
// GUNARA OS — Bisnis Hub: Database Pelanggan & Perusahaan
// Metadata terlengkap hasil audit pusatperizinan.com +
// gunara.web.id — CRM kelas konsultan internasional.
// ═══════════════════════════════════════════════════

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Users, MapPin, TrendingUp, ShieldCheck, Landmark } from "lucide-react";
import { RecordTable } from "./record-table";
import { useRecords } from "./use-records";
import { CUSTOMER_CONFIG, COMPANY_CONFIG, rupiahShort } from "@/lib/gunara";
import { FadeUp } from "./motion";

function StatMini({ icon: Icon, label, value, tone = "emerald" }: {
  icon: React.ElementType; label: string; value: string | number; tone?: "emerald" | "amber" | "sky";
}) {
  const reduce = useReducedMotion();
  const tones = {
    emerald: "text-emerald-700 dark:text-emerald-400",
    amber: "text-amber-700 dark:text-amber-400",
    sky: "text-sky-700 dark:text-sky-400",
  };
  return (
    <motion.div
      whileHover={reduce ? {} : { y: -3 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="rounded-xl border bg-card p-3.5 flex items-center gap-3"
    >
      <div className="size-9 rounded-lg bg-muted flex items-center justify-center flex-none">
        <Icon className={`size-4.5 ${tones[tone]}`} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-extrabold tabular-nums leading-none">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-1 truncate">{label}</p>
      </div>
    </motion.div>
  );
}

export function BisnisSection() {
  const customer = useRecords("customer");
  const company = useRecords("company");

  const stat = useMemo(() => {
    const c = customer.items;
    const p = company.items;
    return {
      total: c.length,
      klien: c.filter((x) => x.status === "KLIEN" || x.status === "RETAINER").length,
      lead: c.filter((x) => x.status === "LEAD" || x.status === "PROSPEK").length,
      belanja: c.reduce((a, x) => a + (x.totalBelanja || 0), 0),
      perusahaan: p.length,
      grup: p.filter((x) => x.isGrupSendiri).length,
      provinsi: new Set(p.map((x) => x.province).filter(Boolean)).size,
    };
  }, [customer.items, company.items]);

  return (
    <div className="space-y-4">
      <FadeUp>
        <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-950/40 dark:to-sky-950/30 p-5">
          <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
            💼 BISNIS HUB — Database Terlengkap
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Satu sumber kebenaran untuk seluruh Gunara Group: pelanggan (identitas, kontak, perilaku),
            perusahaan (NIB, NPWP, SK AHU, KBLI, modal, pengurus). Standar konsultan internasional —
            <strong className="text-emerald-800 dark:text-emerald-300"> ISO 9001:2015</strong>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-4">
            <StatMini icon={Users} label="Total pelanggan" value={stat.total} />
            <StatMini icon={TrendingUp} label="Klien aktif + retainer" value={stat.klien} tone="amber" />
            <StatMini icon={Building2} label="Perusahaan (grup sendiri)" value={`${stat.perusahaan} (${stat.grup})`} tone="sky" />
            <StatMini icon={MapPin} label="Total belanja tercatat" value={rupiahShort(stat.belanja)} tone="amber" />
          </div>
        </div>
      </FadeUp>

      <Tabs defaultValue="pelanggan">
        <TabsList>
          <TabsTrigger value="pelanggan" className="gap-1.5"><Users className="size-3.5" /> Pelanggan</TabsTrigger>
          <TabsTrigger value="perusahaan" className="gap-1.5"><Building2 className="size-3.5" /> Perusahaan</TabsTrigger>
        </TabsList>

        <TabsContent value="pelanggan">
          <RecordTable
            config={CUSTOMER_CONFIG}
            rows={customer.items}
            loading={customer.loading}
            onCreate={customer.create}
            onUpdate={customer.update}
            onDelete={customer.remove}
          />
          <FadeUp delay={0.1}>
            <div className="mt-3 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2">
              <ShieldCheck className="size-4 text-emerald-700 dark:text-emerald-400 flex-none mt-0.5" />
              <p>
                Data identitas (KTP, NPWP, alamat) tersimpan lokal di database Anda sendiri — sesuai
                janji layanan &ldquo;arsip digital akses terbatas&rdquo; dan prinsip perlindungan data
                pelanggan UU PDP No. 27/2022. Jangan pernah membagikan ekspor data ini ke luar.
              </p>
            </div>
          </FadeUp>
        </TabsContent>

        <TabsContent value="perusahaan">
          <RecordTable
            config={COMPANY_CONFIG}
            rows={company.items}
            loading={company.loading}
            onCreate={company.create}
            onUpdate={company.update}
            onDelete={company.remove}
          />
          <FadeUp delay={0.1}>
            <div className="mt-3 rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2">
              <Landmark className="size-4 text-emerald-700 dark:text-emerald-400 flex-none mt-0.5" />
              <p>
                Tandai <strong>Perusahaan grup sendiri</strong> untuk pusatperizinan.com &amp; gunara.web.id —
                dashboard akan menghitungnya sebagai aset grup, terpisah dari perusahaan klien.
              </p>
            </div>
          </FadeUp>
        </TabsContent>
      </Tabs>
    </div>
  );
}
