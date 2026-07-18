"""Simulation-internal types. Mirrors packages/shared-types/grid.py for the subset the agent
loop needs; kept separate so the agent core has no import dependency outside app/."""

from __future__ import annotations

from typing import Literal, TypedDict

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

AgentStatus = Literal["moving", "waiting", "blocked", "exited", "stuck"]

# Impassable cell types per mobility profile, beyond generic "wall".
MOBILITY_BLOCKED_CELLS: dict[MobilityProfile, set[CellType]] = {
    "standard": {"wall"},
    "wheelchair": {"wall", "stairs"},
    "stroller": {"wall", "stairs"},
    "visually_impaired": {"wall"},
}


class GridCellDict(TypedDict):
    x: int
    y: int
    type: CellType
    width_meters: float | None
    zone_id: str | None


class AgentState(TypedDict):
    agent_id: str
    persona_id: str
    x: int
    y: int
    status: AgentStatus
    ticks_stuck: int
    visited: list[tuple[int, int]]
    thought: str | None
