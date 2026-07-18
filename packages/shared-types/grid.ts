/**
 * Shared grid/plan schema used by the Next.js editor, the FastAPI backend,
 * and the MCP plan server. Mirrored in Python at packages/shared-types/grid.py.
 * Keep both files in sync manually until a codegen step is added.
 */

export type CellType =
  | "open"
  | "wall"
  | "door"
  | "exit"
  | "ramp"
  | "stairs"
  | "elevator"
  | "service_point"
  | "hazard";

export interface GridCell {
  x: number;
  y: number;
  type: CellType;
  /** Physical width of this cell in the corridor direction, in meters. Used for ADA/code checks. */
  widthMeters?: number;
  zoneId?: string;
}

export interface Zone {
  id: string;
  name: string;
  /** e.g. "public", "restricted", "accessible_route", "service" */
  kind: string;
}

export interface GridPlan {
  id: string;
  orgId: string;
  name: string;
  widthCells: number;
  heightCells: number;
  cellSizeMeters: number;
  cells: GridCell[];
  zones: Zone[];
  entryPoints: { x: number; y: number; label: string }[];
  exitPoints: { x: number; y: number; label: string }[];
  createdAt: string;
  updatedAt: string;
  /**
   * Present if the plan was traced from an uploaded reference image. Currently a compressed
   * data URI stored inline on the plan document (capped client-side to stay well under the
   * Cosmos 2MB document limit) rather than a real blob storage URL — see "Known
   * simplifications" in docs/architecture.md for the follow-up to move this to blob storage.
   */
  sourceImageBlobUrl?: string;
}

export type PersonaObjective =
  | "reach_nearest_exit_fast"
  | "reach_accessible_exit"
  | "navigate_to_service_point"
  | "wander_and_browse"
  | "deliver_and_locate_service_elevator";

export interface PersonaDefinition {
  id: string;
  name: string;
  description: string;
  objective: PersonaObjective;
  /** Behavioral traits injected into the agent's system prompt. */
  traits: string[];
  /** Mobility profile affects which cell types are traversable/preferred. */
  mobilityProfile: "standard" | "wheelchair" | "stroller" | "visually_impaired";
  speedFactor: number;
}

export interface AgentTickEvent {
  runId: string;
  tick: number;
  agentId: string;
  personaId: string;
  x: number;
  y: number;
  status: "moving" | "waiting" | "blocked" | "exited" | "stuck";
  thought?: string;
}

export interface ComplianceFinding {
  id: string;
  runId: string;
  cellRef: { x: number; y: number };
  severity: "info" | "warning" | "violation";
  code: string;
  description: string;
  sourceClauseId: string;
}

export interface SimulationRun {
  id: string;
  orgId: string;
  planId: string;
  status: "queued" | "running" | "completed" | "failed";
  agentCount: number;
  personaMix: { personaId: string; count: number }[];
  startedAt?: string;
  completedAt?: string;
  bottlenecks: { x: number; y: number; heat: number }[];
  complianceFindings: ComplianceFinding[];
}
