"use client";

// ═══════════════════════════════════════════════════
// GUNARA OS — Pustaka Animasi Bersama (Framer Motion)
// Standar internasional: reduced-motion aware, performa GPU,
// easing konsisten, komponen reusable lintas section.
// ═══════════════════════════════════════════════════

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
  animate,
} from "framer-motion";
import { cn } from "@/lib/utils";

/** Easing khas GUNARA — halus dan percaya diri */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Hook: true setelah komponen ter-mount di klien (anti hydration-mismatch) */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);
  return mounted;
}

/** Hook: Date client-only, diperbarui tiap `intervalMs` (default 60s). null sebelum mount. */
export function useNow(intervalMs = 60_000): Date | null {
  const mounted = useMounted();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setNow(new Date());
    const t0 = setTimeout(update, 0);
    const t = intervalMs > 0 ? setInterval(update, intervalMs) : undefined;
    return () => {
      clearTimeout(t0);
      if (t) clearInterval(t);
    };
  }, [intervalMs]);
  return mounted ? now : null;
}

// ── FadeUp: elemen muncul dari bawah saat masuk viewport ──
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 18,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger: kontainer anak muncul berurutan ──
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.07,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 14,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

// ── PageTransition: bungkus konten section, animasi ganti section ──
export function PageTransition({ sectionKey, children }: { sectionKey: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={sectionKey}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.995 }}
        transition={{ duration: 0.32, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ── CountUp: angka beranimasi dari nilai sebelumnya → value, halus ──
export function CountUp({
  value,
  format,
  className,
  duration = 1.1,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const reduce = useReducedMotion();
  const fromRef = useRef(0);
  const [display, setDisplay] = useState(() => format(reduce ? value : 0));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(format(value));
      fromRef.current = value;
      return;
    }
    const controls = animate(fromRef.current, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(format(v)),
      onComplete: () => {
        fromRef.current = value;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </span>
  );
}

// ── FloatingOrbs: orb cahaya melayang untuk hero banner ──
export function FloatingOrbs({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden>
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-amber-400/10 blur-2xl" />
        <div className="absolute right-24 bottom-0 size-32 rounded-full bg-amber-300/10 blur-xl" />
      </div>
    );
  }
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)} aria-hidden>
      <motion.div
        className="absolute -right-10 -top-14 size-56 rounded-full bg-amber-400/15 blur-2xl"
        animate={{ x: [0, -22, 8, 0], y: [0, 16, -10, 0], scale: [1, 1.12, 0.96, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-28 -bottom-4 size-36 rounded-full bg-emerald-300/15 blur-xl"
        animate={{ x: [0, 18, -12, 0], y: [0, -14, 10, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      <motion.div
        className="absolute left-1/3 -top-8 size-24 rounded-full bg-amber-200/10 blur-lg"
        animate={{ y: [0, 12, -8, 0], opacity: [0.6, 1, 0.7, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      {/* garis grid halus */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
    </div>
  );
}

// ── ProgressRing: cincin progres SVG beranimasi (MIT selesai x/3) ──
export function ProgressRing({
  value,
  max,
  size = 64,
  stroke = 6,
  className,
  label,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  className?: string;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const pct = max > 0 ? Math.min(1, value / max) : 0;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} role="img" aria-label={label || `Progres ${value} dari ${max}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-emerald-100 dark:stroke-emerald-900" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className="stroke-emerald-500 dark:stroke-emerald-400"
          strokeDasharray={c}
          initial={reduce ? { strokeDashoffset: c * (1 - pct) } : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 0.9, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={value}
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
          className="text-sm font-extrabold text-emerald-800 dark:text-emerald-300 leading-none"
        >
          {value}/{max}
        </motion.span>
      </div>
    </div>
  );
}

// ── PulseDot: indikator "sistem hidup" ──
export function PulseDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-2", className)} aria-hidden>
      <motion.span
        className="absolute inline-flex size-full rounded-full bg-emerald-400"
        animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
    </span>
  );
}

// ── HoverLift: kartu terangkat halus saat hover ──
export function HoverLift({
  children,
  className,
  onClick,
  intensity = 4,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  intensity?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      onClick={onClick}
      whileHover={reduce ? {} : { y: -intensity }}
      whileTap={reduce ? {} : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}

// ── Skeleton shimmer (loading standar internasional) ──
export function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn("shimmer rounded-lg bg-muted", className)}
      aria-hidden
    />
  );
}
