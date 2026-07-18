import { AlertTriangle, Flame } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Bottleneck {
  x: number;
  y: number;
  heat: number;
}

export interface ComplianceFinding {
  id: string;
  cell_ref: { x: number; y: number };
  severity: "info" | "warning" | "violation";
  code: string;
  description: string;
}

const SEVERITY_VARIANT: Record<ComplianceFinding["severity"], "default" | "warning" | "destructive"> = {
  info: "default",
  warning: "warning",
  violation: "destructive",
};

export function ReportPanel({
  bottlenecks,
  findings,
}: {
  bottlenecks: Bottleneck[];
  findings: ComplianceFinding[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="glass-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Flame className="size-4 text-heat-hot" />
            Top bottlenecks
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {bottlenecks.length === 0 && (
            <p className="text-sm text-muted-foreground">No significant bottlenecks detected.</p>
          )}
          {bottlenecks.slice(0, 8).map((b, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span>
                Cell ({b.x}, {b.y})
              </span>
              <Badge variant={b.heat > 0.5 ? "destructive" : "warning"}>
                {(b.heat * 100).toFixed(0)}% occupancy
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertTriangle className="size-4 text-destructive" />
            Compliance findings
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {findings.length === 0 && (
            <p className="text-sm text-muted-foreground">No compliance issues found.</p>
          )}
          {findings.map((f) => (
            <div key={f.id} className="flex flex-col gap-1 border-b border-border/40 pb-2 last:border-0">
              <div className="flex items-center gap-2">
                <Badge variant={SEVERITY_VARIANT[f.severity]}>{f.code}</Badge>
                <span className="text-xs text-muted-foreground">
                  ({f.cell_ref.x}, {f.cell_ref.y})
                </span>
              </div>
              <p className="text-sm">{f.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
