import { FileWarning, HardHat, TrendingDown } from "lucide-react";

const PAIN_POINTS = [
  {
    icon: FileWarning,
    title: "Blueprints don't argue back",
    body: "A static 2D floor plan can't tell you that the corridor outside the elevator becomes a chokepoint at 5pm, or that the accessible route dead-ends at a fire door.",
  },
  {
    icon: HardHat,
    title: "Physics sims miss the human part",
    body: "Legacy crowd tools like AnyLogic or MassMotion model people as particles obeying flow equations — they don't capture why a lost delivery driver circles back, or why a parent avoids a crowded stairwell.",
  },
  {
    icon: TrendingDown,
    title: "Issues surface after the concrete sets",
    body: "Accessibility gaps, compliance violations, and layout dead-ends usually get caught in a walk-through review — after the budget for changes is already gone.",
  },
];

export function ProblemSection() {
  return (
    <section id="problem" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
          The old way
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Every layout looks fine on paper.
        </h2>
        <p className="mt-4 text-muted-foreground">
          That&apos;s exactly the problem — paper doesn&apos;t walk through the building.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PAIN_POINTS.map((point) => (
          <div key={point.title} className="glass-sm rounded-2xl p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <point.icon className="size-5" />
            </div>
            <h3 className="text-base font-semibold">{point.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{point.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
