"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Trophy, FolderKanban } from "lucide-react";
import { RecordTable } from "./record-table";
import { useRecords } from "./use-records";
import { LEARNING_CONFIG, WINLOG_CONFIG, CASESTUDY_CONFIG } from "@/lib/gunara";

export function LearningSection() {
  const journal = useRecords("learningJournal");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">📚 MESIN 4 — BELAJAR</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Prinsip: <strong>setiap jam belajar harus menghasilkan 2 keluaran — keahlianmu naik DAN konten/aset bertambah.</strong>{" "}
          Belajar yang tidak didokumentasikan = menguap. Kurikulum kuartal ada di menu Hulu.
        </p>
      </div>
      <RecordTable
        config={LEARNING_CONFIG}
        rows={journal.items}
        loading={journal.loading}
        onCreate={journal.create}
        onUpdate={journal.update}
        onDelete={journal.remove}
      />
    </div>
  );
}

export function DocumentationSection() {
  const win = useRecords("winLog");
  const cases = useRecords("caseStudy");

  return (
    <div className="space-y-4">
      <div className="rounded-xl border-2 border-emerald-800/20 bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/30 p-5">
        <h2 className="text-lg font-extrabold tracking-tight">🏆 MESIN 5 — DOKUMENTASI KEMENANGAN</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Otak depresi menyaring hanya kegagalan — Win Log adalah penyeimbang bukti fisik.
          Konsultan terbaik dunia bukan yang tahu paling banyak — dia yang punya <strong>BUKTI</strong> paling banyak.
        </p>
      </div>

      <Tabs defaultValue="win">
        <TabsList>
          <TabsTrigger value="win" className="gap-1.5"><Trophy className="size-3.5" /> Win Log</TabsTrigger>
          <TabsTrigger value="cases" className="gap-1.5"><FolderKanban className="size-3.5" /> Studi Kasus</TabsTrigger>
        </TabsList>
        <TabsContent value="win">
          <RecordTable
            config={WINLOG_CONFIG}
            rows={win.items}
            loading={win.loading}
            onCreate={win.create}
            onUpdate={win.update}
            onDelete={win.remove}
          />
        </TabsContent>
        <TabsContent value="cases">
          <RecordTable
            config={CASESTUDY_CONFIG}
            rows={cases.items}
            loading={cases.loading}
            onCreate={cases.create}
            onUpdate={cases.update}
            onDelete={cases.remove}
          />
        </TabsContent>
      </Tabs>
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <BookOpen className="size-3.5" /> Isi mundur semua kemenangan yang masih kamu ingat — dulu pernah memegang miliaran = kamu PERNAH mampu, itu bukti kapasitas.
      </p>
    </div>
  );
}
