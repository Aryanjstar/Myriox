"""Myriox MCP Plan Server.

Exposes the currently-active grid plan (walls/doors/exits/zones) as MCP tools so LangGraph
agents — or any other MCP-aware client — can "read the raw design data" without depending
on how that plan was authored (built-in grid editor today, Figma/CAD import in Phase 2).
The tool contract stays identical regardless of ingestion source.
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import Any

from azure.cosmos import CosmosClient
from azure.identity import DefaultAzureCredential
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("myriox-mcp-plan-server")


@lru_cache
def _cosmos_client() -> CosmosClient:
    endpoint = os.environ["MYRIOX_COSMOS_ENDPOINT"]
    key = os.environ.get("MYRIOX_COSMOS_KEY")
    if key:
        return CosmosClient(endpoint, credential=key)
    return CosmosClient(endpoint, credential=DefaultAzureCredential())


def _plans_container():
    db = _cosmos_client().get_database_client(os.environ.get("MYRIOX_COSMOS_DATABASE", "myriox"))
    return db.get_container_client("plans")


@mcp.tool()
def get_grid_layout(org_id: str, plan_id: str) -> dict[str, Any]:
    """Fetch the full grid layout (cells, entry/exit points) for a plan.

    Args:
        org_id: The tenant/organization id that owns the plan (Cosmos partition key).
        plan_id: The plan document id.
    """
    plan = _plans_container().read_item(item=plan_id, partition_key=org_id)
    return {
        "id": plan["id"],
        "name": plan["name"],
        "width_cells": plan["width_cells"],
        "height_cells": plan["height_cells"],
        "cell_size_meters": plan["cell_size_meters"],
        "cells": plan["cells"],
        "entry_points": plan["entry_points"],
        "exit_points": plan["exit_points"],
    }


@mcp.tool()
def get_zone_metadata(org_id: str, plan_id: str) -> list[dict[str, Any]]:
    """Fetch just the named zones (e.g. 'public', 'accessible_route', 'service') for a plan,
    without the full cell grid — useful when an agent only needs zone-level context.

    Args:
        org_id: The tenant/organization id that owns the plan (Cosmos partition key).
        plan_id: The plan document id.
    """
    plan = _plans_container().read_item(item=plan_id, partition_key=org_id)
    return plan.get("zones", [])


@mcp.tool()
def list_plans(org_id: str) -> list[dict[str, str]]:
    """List all plan ids/names available for an organization.

    Args:
        org_id: The tenant/organization id.
    """
    query = "SELECT c.id, c.name FROM c WHERE c.orgId = @orgId"
    items = list(
        _plans_container().query_items(
            query=query,
            parameters=[{"name": "@orgId", "value": org_id}],
            partition_key=org_id,
        )
    )
    return items


def main() -> None:
    mcp.run()


if __name__ == "__main__":
    main()
