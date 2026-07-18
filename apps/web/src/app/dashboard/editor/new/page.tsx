import { GridEditor } from "@/components/editor/grid-editor";

export default function NewPlanPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Build a floor plan</h1>
        <p className="text-sm text-muted-foreground">
          Paint walls, doors, ramps, stairs, and service points, then place an entry and
          exit point.
        </p>
      </div>
      <GridEditor />
    </div>
  );
}
