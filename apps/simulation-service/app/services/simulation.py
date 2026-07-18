"""Simulation orchestrator: owns the tick loop, Cosmos checkpointing, bottleneck heat
aggregation, and hands struggle summaries to the Compliance Auditor at the end of a run.
Plan geometry is fetched from the Plan Service over HTTP — this service never touches
the `plans` Cosmos container."""

from __future__ import annotations

import asyncio
import uuid
from collections import Counter
from collections.abc import AsyncIterator
from datetime import datetime, timezone

from app.agents.compliance import deterministic_geometry_findings, synthesize_llm_findings
from app.agents.grid_world import GridWorld
from app.agents.graph import compile_simulation_graph
from app.agents.personas import get_persona
from app.agents.types import AgentState
from app.services.cosmos import agent_events_container, runs_container
from app.services.plan_client import fetch_plan

MAX_TICKS = 60


def _new_agents(plan: dict, persona_mix: list[dict]) -> list[AgentState]:
    agents: list[AgentState] = []
    entries = plan["entry_points"] or [{"x": 0, "y": 0, "label": "default"}]
    idx = 0
    for mix in persona_mix:
        for _ in range(mix["count"]):
            entry = entries[idx % len(entries)]
            agents.append(
                AgentState(
                    agent_id=str(uuid.uuid4()),
                    persona_id=mix["persona_id"],
                    x=entry["x"],
                    y=entry["y"],
                    status="moving",
                    ticks_stuck=0,
                    visited=[(entry["x"], entry["y"])],
                    thought=None,
                )
            )
            idx += 1
    return agents


async def run_simulation(
    org_id: str, plan_id: str, persona_mix: list[dict]
) -> AsyncIterator[dict]:
    """Async generator yielding one tick summary dict at a time, for the WebSocket router
    to stream straight through. Also persists per-tick agent events and the final run
    document + compliance findings to Cosmos."""
    plan_item = await fetch_plan(org_id, plan_id)
    grid = GridWorld.from_plan(plan_item)
    graph = compile_simulation_graph()

    run_id = str(uuid.uuid4())
    agent_count = sum(m["count"] for m in persona_mix)
    run_doc = {
        "id": run_id,
        "orgId": org_id,
        "planId": plan_id,
        "status": "running",
        "agentCount": agent_count,
        "personaMix": persona_mix,
        "startedAt": datetime.now(timezone.utc).isoformat(),
        "bottlenecks": [],
        "complianceFindings": [],
    }
    runs_container().create_item(run_doc)

    state = {
        "run_id": run_id,
        "tick": 0,
        "grid": grid,
        "agents": _new_agents(plan_item, persona_mix),
        "intentions": {},
    }

    heat: Counter[tuple[int, int]] = Counter()
    struggle_summaries: set[str] = set()

    for _ in range(MAX_TICKS):
        state = await asyncio.to_thread(graph.invoke, state)

        active = [a for a in state["agents"] if a["status"] != "exited"]
        for agent in state["agents"]:
            heat[(agent["x"], agent["y"])] += 1
            if agent["status"] in ("blocked", "stuck"):
                persona = get_persona(agent["persona_id"])
                # Name the cell types actually blocking the agent (e.g. "stairs") and the
                # agent's mobility profile — without this concrete detail the report LLM has
                # nothing to distinguish "genuine code violation" from "ordinary crowding".
                neighbor_types = sorted(
                    {
                        grid.cell_type_at(agent["x"] + dx, agent["y"] + dy)
                        for dx, dy in ((0, 1), (0, -1), (1, 0), (-1, 0))
                        if grid.in_bounds(agent["x"] + dx, agent["y"] + dy)
                    }
                )
                struggle_summaries.add(
                    f"Persona {agent['persona_id']} (mobility profile: {persona.mobility_profile}) "
                    f"became {agent['status']} at ({agent['x']}, {agent['y']}) after "
                    f"{agent['ticks_stuck']} consecutive ticks with no progress. Adjacent cell "
                    f"types blocking movement: {neighbor_types}."
                )

        tick_payload = {
            "run_id": run_id,
            "tick": state["tick"],
            "agents": [
                {
                    "agent_id": a["agent_id"],
                    "persona_id": a["persona_id"],
                    "x": a["x"],
                    "y": a["y"],
                    "status": a["status"],
                    "thought": a["thought"],
                }
                for a in state["agents"]
            ],
        }

        agent_events_container().create_item(
            {
                "id": str(uuid.uuid4()),
                "orgId": org_id,
                "runId": run_id,
                **tick_payload,
            }
        )
        yield tick_payload

        # Stop once nothing can change further: no one left mid-route, or everyone remaining
        # has already given up (status "stuck") rather than just being "blocked" this tick.
        if not active or all(a["status"] == "stuck" for a in active):
            break

    bottlenecks = [
        {"x": x, "y": y, "heat": count / max(1, agent_count)}
        for (x, y), count in heat.most_common(25)
    ]

    geometry_findings = deterministic_geometry_findings(
        run_id, grid, plan_item.get("cell_size_meters", 1.0)
    )
    llm_findings = await asyncio.to_thread(
        synthesize_llm_findings, run_id, list(struggle_summaries)
    )
    all_findings = geometry_findings + llm_findings

    runs_container().replace_item(
        item=run_id,
        body={
            **run_doc,
            "status": "completed",
            "completedAt": datetime.now(timezone.utc).isoformat(),
            "bottlenecks": bottlenecks,
            "complianceFindings": all_findings,
        },
    )

    yield {"run_id": run_id, "final": True, "bottlenecks": bottlenecks, "findings": all_findings}
