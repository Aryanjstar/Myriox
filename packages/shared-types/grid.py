"""Shared grid/plan schema, mirrored from grid.ts. Keep both files in sync manually."""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel

CellType = Literal[
    "open",
    "wall",
    "door",
    "exit",
    "ramp",
    "stairs",
    "elevator",
    "service_point",
    "hazard",
]

PersonaObjective = Literal[
    "reach_nearest_exit_fast",
    "reach_accessible_exit",
    "navigate_to_service_point",
    "wander_and_browse",
    "deliver_and_locate_service_elevator",
]

MobilityProfile = Literal["standard", "wheelchair", "stroller", "visually_impaired"]


class GridCell(BaseModel):
    x: int
    y: int
    type: CellType
    width_meters: Optional[float] = None
    zone_id: Optional[str] = None


class Zone(BaseModel):
    id: str
    name: str
    kind: str


class Point(BaseModel):
    x: int
    y: int
    label: str


class GridPlan(BaseModel):
    id: str
    org_id: str
    name: str
    width_cells: int
    height_cells: int
    cell_size_meters: float
    cells: list[GridCell]
    zones: list[Zone]
    entry_points: list[Point]
    exit_points: list[Point]
    created_at: str
    updated_at: str
    # Data URI of a compressed reference image traced in the grid editor (see grid.ts).
    source_image_blob_url: Optional[str] = None


class PersonaDefinition(BaseModel):
    id: str
    name: str
    description: str
    objective: PersonaObjective
    traits: list[str]
    mobility_profile: MobilityProfile
    speed_factor: float


class AgentTickEvent(BaseModel):
    run_id: str
    tick: int
    agent_id: str
    persona_id: str
    x: int
    y: int
    status: Literal["moving", "waiting", "blocked", "exited", "stuck"]
    thought: Optional[str] = None


class ComplianceFinding(BaseModel):
    id: str
    run_id: str
    cell_ref: dict
    severity: Literal["info", "warning", "violation"]
    code: str
    description: str
    source_clause_id: str


class PersonaMixEntry(BaseModel):
    persona_id: str
    count: int


class Bottleneck(BaseModel):
    x: int
    y: int
    heat: float


class SimulationRun(BaseModel):
    id: str
    org_id: str
    plan_id: str
    status: Literal["queued", "running", "completed", "failed"]
    agent_count: int
    persona_mix: list[PersonaMixEntry]
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    bottlenecks: list[Bottleneck] = []
    compliance_findings: list[ComplianceFinding] = []
