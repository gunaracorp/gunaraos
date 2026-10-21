"use client";

// ═══════════════════════════════════════════════════
// GUNARA OS — Command Palette (⌘K / Ctrl+K)
// Standar Notion/Linear: lompat cepat antar section.
// ═══════════════════════════════════════════════════

import { useEffect } from "react";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator,
} from "@/components/ui/command";
import { NAV, COMMAND_CENTER, type SectionId } from "./nav";
import { useMounted } from "./motion";
import { useI18n, GROUP_EN, NAV_EN, ui } from "@/lib/i18n";

export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onNavigate: (id: SectionId) => void;
}) {
  // ── ANTI-HYDRATION (React 19.2 + Radix useId race, lihat radix-ui/primitives#3700
  // & facebook/react#35399): ID internal DialogTitle/DialogDescription dari useId
  // bisa bergeser saat hydration terhadap HTML lama (HMR/stale cache) dan memicu
  // warning "some attributes didn't match". Palette hanya perlu ada SETELAH mount
  // (default tertutup, dibuka via ⌘K/tombol) → render null di server & render
  // pertama klien sehingga ID-nya 100% client-generated dan tak pernah dibandingkan.
  const mounted = useMounted();
  const lang = useI18n((s) => s.lang);
  const loc = (item: typeof COMMAND_CENTER) =>
    lang === "en" && NAV_EN[item.id]
      ? { ...item, label: NAV_EN[item.id].label, desc: NAV_EN[item.id].desc }
      : item;
  const groupTitle = (title: string) =>
    lang === "en" ? (GROUP_EN[title] || title) : title;

  // Global shortcut ⌘K / Ctrl+K — standar aplikasi kelas dunia
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const go = (id: SectionId) => {
    onNavigate(id);
    onOpenChange(false);
  };

  if (!mounted) return null;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={lang === "en" ? "Type a command or search sections… (⌘K)" : "Ketik perintah atau cari section… (⌘K)"} />
      <CommandList className="nice-scroll">
        <CommandEmpty>{lang === "en" ? "Not found. Try another word — your system has 15 sections." : "Tidak ditemukan. Coba kata lain — sistemmu punya 15 section."}</CommandEmpty>
        <CommandGroup heading={lang === "en" ? "Home" : "Beranda"}>
          <CommandItem onSelect={() => go(COMMAND_CENTER.id)}>
            <COMMAND_CENTER.icon className="size-4 text-emerald-700 dark:text-emerald-400" />
            <span>{loc(COMMAND_CENTER).label}</span>
            <span className="ml-auto text-xs text-muted-foreground">{loc(COMMAND_CENTER).desc}</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        {NAV.map((group, gi) => (
          <div key={group.title}>
            <CommandGroup heading={groupTitle(group.title)}>
              {group.items.map((item) => (
                <CommandItem key={item.id} onSelect={() => go(item.id)}>
                  <item.icon className="size-4 text-emerald-700 dark:text-emerald-400" />
                  <span>{loc(item).label}</span>
                  {item.desc && (
                    <span className="ml-auto text-xs text-muted-foreground truncate max-w-[45%]">{loc(item).desc}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {gi < NAV.length - 1 && <CommandSeparator />}
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
