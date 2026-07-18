"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, LayoutGrid, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, type GridPlan } from "@/lib/api";

export function PlansList() {
  const [plans, setPlans] = useState<GridPlan[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listPlans()
      .then(setPlans)
      .catch(() => setError("Couldn't load your plans right now."));
  }, []);

  if (error) {
    return (
      <Card className="glass-sm border-dashed border-destructive/40">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (plans === null) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="glass-sm h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="glass-sm border-dashed border-border">
        <CardHeader>
          <CardTitle>No plans yet</CardTitle>
          <CardDescription>
            Create your first floor plan in the grid editor, then run a simulation with a
            custom persona mix to see live bottleneck heat and a compliance report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/dashboard/editor/new">Open the grid editor</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.id} className="glass-sm flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LayoutGrid className="size-4 shrink-0 text-primary" />
              <span className="truncate">{plan.name}</span>
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline">
                {plan.width_cells}×{plan.height_cells}
              </Badge>
              <span className="text-xs">
                Updated {new Date(plan.updatedAt).toLocaleDateString()}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/dashboard/simulations/new?planId=${plan.id}`}>
                <PlayCircle className="size-4" />
                Run simulation
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
