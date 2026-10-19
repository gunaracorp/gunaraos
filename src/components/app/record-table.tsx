"use client";

// ═══════════════════════════════════════════════════
// GUNARA OS — RecordTable generik (config-driven)
// Standar internasional: skeleton shimmer, row stagger,
// empty state bermakna, form dialog bebas anti-pattern.
// ═══════════════════════════════════════════════════

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, MoreHorizontal, Inbox } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FieldConfig, ResourceConfig } from "@/lib/gunara";
import { cn } from "@/lib/utils";

 
type Row = Record<string, any>;

interface RecordTableProps {
  config: ResourceConfig;
  rows: Row[];
  loading?: boolean;
  onCreate: (data: Row) => Promise<unknown>;
  onUpdate: (id: string, data: Row) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  extraRowActions?: (row: Row) => React.ReactNode;
  hideAdd?: boolean;
  addLabel?: string;
}

export function RecordTable({ config, rows, loading, onCreate, onUpdate, onDelete, extraRowActions, hideAdd, addLabel }: RecordTableProps) {
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  const startAdd = () => { setEditing(null); setOpen(true); };
  const startEdit = (row: Row) => { setEditing(row); setOpen(true); };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-base font-bold tracking-tight">{config.title}</h3>
          {config.subtitle && <p className="text-xs text-muted-foreground max-w-2xl mt-0.5">{config.subtitle}</p>}
        </div>
        {!hideAdd && (
          <motion.div whileTap={reduce ? {} : { scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Button size="sm" onClick={startAdd} className="gap-1.5">
              <Plus className="size-4" /> {addLabel || "Tambah"}
            </Button>
          </motion.div>
        )}
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto nice-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                {config.columns.map((c) => (
                  <th key={c.name} className={cn("text-left font-semibold px-3 py-2.5 text-xs uppercase tracking-wide text-muted-foreground", c.hideOnMobile && "hidden md:table-cell")}>
                    {c.label}
                  </th>
                ))}
                <th className="w-12"><span className="sr-only">Aksi</span></th>
              </tr>
            </thead>
            <tbody>
              {loading && <SkeletonRows cols={config.columns.length + 1} />}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={config.columns.length + 1} className="px-3 py-10">
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center gap-2 text-center"
                    >
                      <Inbox className="size-8 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground max-w-md">{config.emptyText || "Belum ada data. Data menakutkan hanya sebelum ditulis — tulis dulu."}</p>
                    </motion.div>
                  </td>
                </tr>
              )}
              {rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3), ease: "easeOut" }}
                  className="border-b last:border-0 hover:bg-muted/40 transition-colors"
                >
                  {config.columns.map((c) => (
                    <td key={c.name} className={cn("px-3 py-2.5 align-top", c.hideOnMobile && "hidden md:table-cell")}>
                      {c.render ? c.render(row) : <span className="line-clamp-2">{String(row[c.name] ?? "—")}</span>}
                    </td>
                  ))}
                  <td className="px-2 py-2.5 text-right align-top">
                    <div className="flex items-center justify-end gap-1">
                      {extraRowActions?.(row)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7" aria-label="Aksi baris"><MoreHorizontal className="size-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEdit(row)}><Pencil className="size-4 mr-2" /> Ubah</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={async () => { if (confirm("Yakin hapus entri ini?")) await onDelete(row.id); }}
                          >
                            <Trash2 className="size-4 mr-2" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RecordFormDialog
        config={config}
        open={open}
        onOpenChange={setOpen}
        initial={editing}
        onSubmit={async (data) => {
          if (editing) await onUpdate(editing.id, data);
          else await onCreate(data);
        }}
      />
    </div>
  );
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <tr key={`sk-${i}`} className="border-b last:border-0">
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-3 py-3">
              <div className="shimmer h-4 rounded bg-muted" style={{ width: j === 0 ? "70%" : `${45 + ((i + j) % 3) * 15}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function RecordFormDialog({ config, open, onOpenChange, initial, onSubmit }: {
  config: ResourceConfig;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Row | null;
  onSubmit: (data: Row) => Promise<unknown>;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Row>({});

  // Sinkron form saat dialog dibuka / sumber data berubah (useEffect, bukan setState-saat-render)
  useEffect(() => {
    const base: Row = {};
    for (const f of config.fields) base[f.name] = f.type === "checkbox" ? false : f.type === "number" || f.type === "money" ? 0 : "";
    if (config.defaults) Object.assign(base, config.defaults);
    const merged: Row = { ...base };
    if (initial) {
      for (const f of config.fields) {
        const v = initial[f.name];
        if (v !== undefined && v !== null) merged[f.name] = v;
      }
    }
    setForm(merged);
  }, [initial, open, config]);

  const set = (name: string, value: unknown) => setForm((f) => ({ ...f, [name]: value }));

  const submit = async () => {
    setSaving(true);
    try {
      const data: Row = { ...form };
      for (const f of config.fields) {
        if (f.type === "money" || f.type === "number") data[f.name] = Number(data[f.name]) || 0;
        if (f.type === "checkbox") data[f.name] = Boolean(data[f.name]);
        if (f.type === "text" || f.type === "textarea" || f.type === "date" || f.type === "select") {
          data[f.name] = data[f.name] == null ? "" : String(data[f.name]);
        }
      }
      await onSubmit(data);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const fieldInput = (f: FieldConfig) => {
    const v = form[f.name];
    switch (f.type) {
      case "textarea":
        return <Textarea rows={f.rows || 2} value={v ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} />;
      case "money":
        return <Input type="number" inputMode="numeric" value={v ?? 0} onChange={(e) => set(f.name, e.target.value === "" ? 0 : Number(e.target.value))} />;
      case "number":
        return <Input type="number" value={v ?? 0} onChange={(e) => set(f.name, e.target.value === "" ? 0 : Number(e.target.value))} />;
      case "date":
        return <Input type="date" value={v ?? ""} onChange={(e) => set(f.name, e.target.value)} />;
      case "select":
        return (
          <Select value={v || undefined} onValueChange={(val) => set(f.name, val)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="Pilih…" /></SelectTrigger>
            <SelectContent>
              {(f.options || []).map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return <Checkbox checked={Boolean(v)} onCheckedChange={(c) => set(f.name, c)} />;
      default:
        return <Input value={v ?? ""} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto nice-scroll">
        <DialogHeader>
          <DialogTitle>{initial ? `Ubah — ${config.title}` : `Tambah — ${config.title}`}</DialogTitle>
          {config.subtitle && <DialogDescription>{config.subtitle}</DialogDescription>}
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-1">
          {config.fields.map((f) => (
            <div key={f.name} className={cn("space-y-1.5", f.full && "md:col-span-2")}>
              <Label className="text-xs">{f.label}{f.required && " *"}</Label>
              {fieldInput(f)}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={submit} disabled={saving}>{saving ? "Menyimpan…" : "Simpan"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
