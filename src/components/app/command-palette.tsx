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

export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onNavigate: (id: SectionId) => void;
}) {
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

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Ketik perintah atau cari section… (⌘K)" />
      <CommandList className="nice-scroll">
        <CommandEmpty>Tidak ditemukan. Coba kata lain — sistemmu punya 15 section.</CommandEmpty>
        <CommandGroup heading="Beranda">
          <CommandItem onSelect={() => go(COMMAND_CENTER.id)}>
            <COMMAND_CENTER.icon className="size-4 text-emerald-700 dark:text-emerald-400" />
            <span>{COMMAND_CENTER.label}</span>
            <span className="ml-auto text-xs text-muted-foreground">{COMMAND_CENTER.desc}</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        {NAV.map((group, gi) => (
          <div key={group.title}>
            <CommandGroup heading={group.title}>
              {group.items.map((item) => (
                <CommandItem key={item.id} onSelect={() => go(item.id)}>
                  <item.icon className="size-4 text-emerald-700 dark:text-emerald-400" />
                  <span>{item.label}</span>
                  {item.desc && (
                    <span className="ml-auto text-xs text-muted-foreground truncate max-w-[45%]">{item.desc}</span>
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
