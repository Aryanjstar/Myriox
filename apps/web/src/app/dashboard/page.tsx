import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PlansList } from "@/components/dashboard/plans-list";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Site plans</h1>
          <p className="text-sm text-muted-foreground">
            Build a floor plan and run a persona simulation against it.
          </p>
        </div>
        <Button asChild className="self-start sm:self-auto">
          <Link href="/dashboard/editor/new">
            <PlusCircle className="size-4" />
            New plan
          </Link>
        </Button>
      </div>

      <PlansList />
    </div>
  );
}
