# Seed Personas

These five personas are hardcoded for the first simulation demo (Phase 2). Each maps to a
`PersonaDefinition` in `packages/shared-types/grid.py` / `grid.ts`.

| id | name | objective | mobility | speed | key traits |
|----|------|-----------|----------|-------|------------|
| `rushed_commuter` | Rushed Commuter | reach_nearest_exit_fast | standard | 1.4 | impatient, takes shortest path even through crowds, low tolerance for waiting |
| `wheelchair_visitor` | Wheelchair User | reach_accessible_exit | wheelchair | 0.8 | avoids stairs entirely, requires ramps/elevators, flags narrow corridors |
| `parent_with_stroller` | Parent with Stroller | navigate_to_service_point | stroller | 0.7 | avoids stairs, needs wide doorways, seeks changing rooms/service points |
| `delivery_worker` | Delivery Worker | deliver_and_locate_service_elevator | standard | 1.1 | unfamiliar with layout, gets lost looking for service elevator, asks for directions |
| `elderly_visitor` | Elderly Visitor | wander_and_browse | standard | 0.6 | prefers seating/rest points, avoids crowds, slow and cautious near stairs |

## Behavior Model

Each tick, a persona agent receives:
- Its current position, local visible cells (Moore neighborhood radius 2, matching common
  LangGraph grid-simulation fog-of-war patterns).
- Its objective, traits, and memory of recently visited cells (to avoid loops).
- The `GridValidator` node resolves the requested move against walls/collisions and commits
  the authoritative position.

Agents that are "wheelchair" or "stroller" mobility never receive `stairs` as a valid move —
they must route through `ramp`/`elevator` cells, which is exactly the behavior the Compliance
Auditor watches for violations (e.g., no ramp present within reasonable distance of a stair).
