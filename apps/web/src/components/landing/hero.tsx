"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LivePreview } from "@/components/landing/live-preview";

const STATS = [
  { value: "5", label: "reasoning personas per run" },
  { value: "200", label: "ticks simulated per plan" },
  { value: "12+", label: "ADA / IFC clauses checked live" },
];

export function Hero() {
  return (
    <section className="bg-mesh px-4 pt-32 pb-16 sm:px-6 sm:pt-40 sm:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-sm mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Behavioral simulation, not fluid-dynamics simulation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]"
          >
            Find the bottleneck in your floor plan
            <span className="text-gradient"> before it costs you a change order.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
          >
            Myriox sends a rushed commuter, a wheelchair user, a lost delivery worker, and
            dozens more AI personas walking through your plan. Each one reasons about
            <em> why </em> a layout fails — then a compliance auditor checks every corridor
            they struggled with against real building codes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button asChild size="lg">
              <Link href="/dashboard">
                Run your first simulation
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#problem">Why this matters</Link>
            </Button>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-border/60 pt-6 sm:max-w-md"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="text-2xl font-semibold tracking-tight sm:text-3xl">{stat.value}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <LivePreview />
        </motion.div>
      </div>
    </section>
  );
}
