import { Gauge, ShieldHalf, Users } from "lucide-react";

const CARDS = [
  {
    icon: Gauge,
    title: "Stress-test peak occupancy",
    body: "Scale a run up to 100 agents across all five personas to find the crowd density at which a corridor, exit, or checkout queue tips over into a genuine bottleneck — not just a busy afternoon.",
  },
  {
    icon: Users,
    title: "Mix personas under load",
    body: "Cast rushed commuters alongside a wheelchair user, a parent with a stroller, and a lost delivery worker in the same run — the friction between different mobility profiles sharing one corridor is exactly what a physics-only sim can't surface.",
  },
  {
    icon: ShieldHalf,
    title: "Two-layer compliance check",
    body: "Deterministic geometry checks (narrow corridors, missing ramps) run alongside an LLM that reasons over vector-retrieved ADA/IFC clauses — so a finding is either a hard rule violation or an explained judgment call, never a vague warning.",
  },
];

export function StressTestSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
          Beyond a single walkthrough
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Push past one clean run
        </h2>
        <p className="mt-4 text-muted-foreground">
          A single simulation tells you a layout works on an average day. Myriox is built to
          push past that — testing the edges before you commit to a layout.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <div key={card.title} className="glass-sm group rounded-2xl p-6 transition-transform hover:-translate-y-1">
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <card.icon className="size-5" />
            </div>
            <h3 className="text-base font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
