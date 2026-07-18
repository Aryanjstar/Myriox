"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

const GRID_SIZE = 12;

interface Dot {
  id: number;
  path: { x: number; y: number }[];
  color: string;
  delay: number;
}

function buildDots(): Dot[] {
  const colors = ["var(--color-chart-1)", "var(--color-chart-3)", "var(--color-chart-5)"];
  return Array.from({ length: 14 }, (_, i) => {
    const startY = Math.floor(Math.random() * GRID_SIZE);
    const path = [
      { x: 0, y: startY },
      { x: GRID_SIZE * 0.4, y: startY + (Math.random() - 0.5) * 3 },
      { x: GRID_SIZE * 0.55, y: GRID_SIZE * 0.5 },
      { x: GRID_SIZE * 0.55, y: GRID_SIZE * 0.5 + (Math.random() - 0.5) },
      { x: GRID_SIZE, y: GRID_SIZE * 0.5 + (Math.random() - 0.5) * 2 },
    ];
    return { id: i, path, color: colors[i % colors.length], delay: (i % 7) * 0.4 };
  });
}

export function LivePreview() {
  const [dots, setDots] = useState<Dot[]>([]);
  const cell = 100 / GRID_SIZE;

  useEffect(() => {
    setDots(buildDots());
  }, []);

  return (
    <div className="glass relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl p-2 shadow-2xl sm:p-3">
      <div className="flex items-center gap-1.5 px-2 pb-2 pt-1">
        <span className="size-2.5 rounded-full bg-destructive/60" />
        <span className="size-2.5 rounded-full bg-heat-warm/60" />
        <span className="size-2.5 rounded-full bg-emerald-500/60" />
        <span className="ml-2 text-xs text-muted-foreground">lobby_v3 — live simulation</span>
      </div>

      <div className="bg-grid-glow relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/60 bg-secondary/40">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="bottleneckGlow" cx="55%" cy="50%" r="18%">
              <stop offset="0%" stopColor="var(--color-heat-hot)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--color-heat-hot)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="52" y="35" width="10" height="30" fill="url(#bottleneckGlow)" />

          {dots.map((dot) => (
            <motion.circle
              key={dot.id}
              r={1}
              fill={dot.color}
              initial={{ cx: dot.path[0].x * cell, cy: dot.path[0].y * cell }}
              animate={{
                cx: dot.path.map((p) => p.x * cell),
                cy: dot.path.map((p) => p.y * cell),
              }}
              transition={{
                duration: 6,
                times: [0, 0.35, 0.55, 0.75, 1],
                repeat: Infinity,
                delay: dot.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>

        <div className="glass-sm absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:right-auto">
          <Flame className="size-3.5 shrink-0 text-heat-hot" />
          <span className="text-foreground/90">Corridor pinch point detected</span>
          <span className="ml-auto rounded-full bg-destructive/15 px-2 py-0.5 font-medium text-destructive">
            ADA 4.3.3
          </span>
        </div>
      </div>
    </div>
  );
}
