"use client";

import { AnimatePresence, motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";

export interface LiveAgent {
  agent_id: string;
  persona_id: string;
  x: number;
  y: number;
  status: string;
  thought?: string | null;
}

const PERSONA_COLOR: Record<string, string> = {
  rushed_commuter: "var(--color-chart-1)",
  wheelchair_visitor: "var(--color-chart-3)",
  parent_with_stroller: "var(--color-chart-5)",
  delivery_worker: "var(--color-chart-2)",
  elderly_visitor: "var(--color-chart-4)",
};

const GRID_W = 20;
const GRID_H = 14;

export function SimulationCanvas({ agents }: { agents: LiveAgent[] }) {
  const cellPct = 100 / GRID_W;
  const rowPct = 100 / GRID_H;

  return (
    <Card className="glass-sm">
      <CardContent>
        <div className="relative aspect-[20/14] w-full overflow-hidden rounded-lg border border-border/60 bg-grid-glow bg-secondary/30">
          <AnimatePresence>
            {agents.map((agent) => {
              const status = agent.status;
              const glow =
                status === "blocked" || status === "stuck"
                  ? "var(--color-heat-hot)"
                  : PERSONA_COLOR[agent.persona_id] ?? "var(--color-primary)";
              return (
                <motion.div
                  key={agent.agent_id}
                  className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    backgroundColor: glow,
                    boxShadow: `0 0 10px 2px ${glow}`,
                  }}
                  animate={{
                    left: `${agent.x * cellPct + cellPct / 2}%`,
                    top: `${agent.y * rowPct + rowPct / 2}%`,
                    scale: status === "exited" ? 0 : 1,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  title={agent.thought ?? undefined}
                />
              );
            })}
          </AnimatePresence>

          {agents.length === 0 && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Configure a persona mix and run a simulation to see agents move live.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
