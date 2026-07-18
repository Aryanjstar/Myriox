import { Check, Minus } from "lucide-react";

type CellValue = boolean | "partial";

const ROWS: { label: string; myriox: CellValue; legacy: CellValue }[] = [
  { label: "Models human intent, not just flow physics", myriox: true, legacy: false },
  { label: "Explains *why* an agent got stuck, in plain language", myriox: true, legacy: false },
  { label: "Live building-code citations during the walk", myriox: true, legacy: false },
  { label: "Mobility-aware routing (wheelchair, stroller, etc.)", myriox: true, legacy: "partial" },
  { label: "Crowd density / flow-rate modeling", myriox: true, legacy: true },
  { label: "Multi-tenant, browser-based, no desktop install", myriox: true, legacy: false },
];

function Cell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <div className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Check className="size-3.5" />
      </div>
    );
  }
  if (value === "partial") {
    return (
      <div className="flex size-6 items-center justify-center rounded-full bg-heat-warm/15 text-heat-warm">
        <Minus className="size-3.5" />
      </div>
    );
  }
  return (
    <div className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground/50">
      <Minus className="size-3.5" />
    </div>
  );
}

export function ComparisonSection() {
  return (
    <section id="why-myriox" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
          Why Myriox
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Reasoning agents beat rigid physics
        </h2>
        <p className="mt-4 text-muted-foreground">
          Legacy crowd simulators (AnyLogic, MassMotion) and generative-design tools (Forma)
          solve adjacent problems well. Neither one simulates a person who thinks.
        </p>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-border/60 px-5 py-3 text-xs font-medium text-muted-foreground sm:gap-6 sm:px-6">
          <span />
          <span className="w-16 text-center text-primary sm:w-24">Myriox</span>
          <span className="w-16 text-center sm:w-24">Legacy tools</span>
        </div>
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-2 border-b border-border/40 px-5 py-3.5 text-sm last:border-0 sm:gap-6 sm:px-6"
          >
            <span className="pr-2 text-foreground/90">{row.label}</span>
            <div className="flex w-16 justify-center sm:w-24">
              <Cell value={row.myriox} />
            </div>
            <div className="flex w-16 justify-center sm:w-24">
              <Cell value={row.legacy} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
