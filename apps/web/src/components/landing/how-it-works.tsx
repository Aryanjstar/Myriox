const STEPS = [
  {
    n: "01",
    title: "Draw or upload your plan",
    body: "Paint walls, doors, ramps, stairs, and service points on the grid editor, or drop in a reference image. Mark your entry and exit points.",
  },
  {
    n: "02",
    title: "Cast your personas",
    body: "Choose how many of each persona to deploy — rushed commuter, wheelchair user, parent with a stroller, delivery worker, elderly visitor — each with its own goals and mobility profile.",
  },
  {
    n: "03",
    title: "Watch them reason, live",
    body: "LangGraph drives each agent through an Azure OpenAI reasoning call every tick. A GridValidator resolves collisions in real time as dots move across your plan.",
  },
  {
    n: "04",
    title: "Get a cited compliance report",
    body: "Every stall, dead-end, or narrow corridor is checked against real ADA/IFC clauses via retrieval-augmented search — with the exact code cited, not a vague warning.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-primary">
          How it works
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          From blank grid to cited report in four steps
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step.n} className="glass-sm relative rounded-2xl p-6">
            <span className="text-gradient text-3xl font-bold tracking-tight">{step.n}</span>
            <h3 className="mt-3 text-base font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            {i < STEPS.length - 1 && (
              <div className="absolute -right-4 top-1/2 hidden h-px w-8 -translate-y-1/2 bg-gradient-to-r from-border to-transparent lg:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
