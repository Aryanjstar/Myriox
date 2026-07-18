import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="bg-mesh glass relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-16 sm:py-20">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Walk your plan before you build it
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Set up your first grid, cast five personas, and get a cited compliance report in
          minutes — no install, no CAD license required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/dashboard">
              Run your first simulation
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
