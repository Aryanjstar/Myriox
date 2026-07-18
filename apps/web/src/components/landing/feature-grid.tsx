import { AlertTriangle, Brain, Route, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "Persona-driven reasoning, not fluid dynamics",
    description:
      "Every agent is powered by an LLM with a distinct objective, mobility profile, and memory — it reasons about why a layout fails, not just that it's congested.",
  },
  {
    icon: Route,
    title: "Dozens of agents, one shared space",
    description:
      "LangGraph orchestrates concurrent agents navigating your grid, causing emergent bottlenecks the same way real crowds do — a poorly placed exit becomes a visible traffic jam.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance built into the walk",
    description:
      "A RAG-backed Compliance Auditor checks every corridor, ramp, and doorway against ADA and building-code clauses as agents encounter them — no separate audit pass required.",
  },
  {
    icon: AlertTriangle,
    title: "See failures before they're expensive",
    description:
      "Catch the accessible-route gap or the delivery dead-end in a simulation, not during a change order after the walls are up.",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          What&apos;s actually running under the hood
        </h2>
        <p className="mt-4 text-muted-foreground">
          No black box — here is exactly what each simulation does.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="glass-sm rounded-2xl p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <feature.icon className="size-5" />
            </div>
            <h3 className="text-base font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
