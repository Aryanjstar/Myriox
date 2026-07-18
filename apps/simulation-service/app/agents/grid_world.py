"""In-memory grid representation and movement legality checks used by the GridValidator node."""

from __future__ import annotations

from dataclasses import dataclass

from app.agents.types import MOBILITY_BLOCKED_CELLS, CellType, GridCellDict, MobilityProfile

DIRECTIONS: dict[str, tuple[int, int]] = {
    "north": (0, -1),
    "south": (0, 1),
    "east": (1, 0),
    "west": (-1, 0),
    "wait": (0, 0),
}


@dataclass
class GridWorld:
    width: int
    height: int
    cells: dict[tuple[int, int], GridCellDict]
    exit_points: list[tuple[int, int]]

    @classmethod
    def from_plan(cls, plan: dict) -> "GridWorld":
        cells = {}
        for cell in plan["cells"]:
            cells[(cell["x"], cell["y"])] = cell
        exits = [(p["x"], p["y"]) for p in plan.get("exit_points", [])]
        return cls(
            width=plan["width_cells"],
            height=plan["height_cells"],
            cells=cells,
            exit_points=exits,
        )

    def cell_type_at(self, x: int, y: int) -> CellType:
        # The grid editor only sends painted (non-"open") cells to save space — a cell
        # missing from this dict is unpainted floor, not a wall. Defaulting to "wall" here
        # previously made every agent think it was boxed in on every real saved plan, since
        # no plan explicitly lists its open floor cells. Out-of-bounds is handled separately
        # by is_passable()/in_bounds(), so within-bounds + missing == "open" is correct.
        cell = self.cells.get((x, y))
        return cell["type"] if cell else "open"

    def in_bounds(self, x: int, y: int) -> bool:
        return 0 <= x < self.width and 0 <= y < self.height

    def is_passable(self, x: int, y: int, mobility: MobilityProfile) -> bool:
        if not self.in_bounds(x, y):
            return False
        cell_type = self.cell_type_at(x, y)
        blocked = MOBILITY_BLOCKED_CELLS.get(mobility, {"wall"})
        return cell_type not in blocked

    def resolve_move(
        self, x: int, y: int, direction: str, mobility: MobilityProfile
    ) -> tuple[int, int, bool]:
        """Returns (new_x, new_y, moved). If the move is illegal, returns the original
        position with moved=False so the caller can mark the agent as blocked."""
        dx, dy = DIRECTIONS.get(direction, (0, 0))
        nx, ny = x + dx, y + dy
        if direction == "wait":
            return x, y, True
        if self.is_passable(nx, ny, mobility):
            return nx, ny, True
        return x, y, False

    def narrow_corridor_cells(self, min_width_meters: float, cell_size_meters: float) -> list[tuple[int, int]]:
        """Cells whose explicit width (or default cell size) is below the accessibility
        threshold. Feeds the Compliance Auditor without needing an LLM call for the obvious cases."""
        flagged = []
        for (x, y), cell in self.cells.items():
            if cell["type"] not in ("open", "door", "ramp"):
                continue
            width = cell.get("width_meters") or cell_size_meters
            if width < min_width_meters:
                flagged.append((x, y))
        return flagged
