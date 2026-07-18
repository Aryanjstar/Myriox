import { redirect } from "next/navigation";

import { SimulationRunner } from "@/components/simulation/simulation-runner";

export default async function NewSimulationPage({
  searchParams,
}: {
  searchParams: Promise<{ planId?: string }>;
}) {
  const { planId } = await searchParams;
  if (!planId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Run simulation</h1>
        <p className="text-sm text-muted-foreground">
          Choose how many of each persona to deploy, then watch them navigate your plan live.
        </p>
      </div>
      <SimulationRunner planId={planId} />
    </div>
  );
}
