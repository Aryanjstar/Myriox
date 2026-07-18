from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.auth import AuthContext, get_auth_context
from app.services.cosmos import plans_container

router = APIRouter(prefix="/api/plans", tags=["plans"])


class GridCellIn(BaseModel):
    x: int
    y: int
    type: str
    width_meters: float | None = None
    zone_id: str | None = None


class PointIn(BaseModel):
    x: int
    y: int
    label: str


class ZoneIn(BaseModel):
    id: str
    name: str
    kind: str


class CreatePlanRequest(BaseModel):
    name: str
    width_cells: int
    height_cells: int
    cell_size_meters: float = 1.0
    cells: list[GridCellIn]
    zones: list[ZoneIn] = []
    entry_points: list[PointIn] = []
    exit_points: list[PointIn] = []
    # Data URI of a compressed reference image traced in the grid editor. Stored inline
    # (capped client-side to stay well under the Cosmos 2MB document limit) rather than in
    # blob storage for now — see "Known simplifications" in docs/architecture.md.
    source_image_blob_url: str | None = None


@router.post("")
def create_plan(payload: CreatePlanRequest, auth: AuthContext = Depends(get_auth_context)):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "id": str(uuid.uuid4()),
        "orgId": auth.org_id,
        "name": payload.name,
        "width_cells": payload.width_cells,
        "height_cells": payload.height_cells,
        "cell_size_meters": payload.cell_size_meters,
        "cells": [c.model_dump() for c in payload.cells],
        "zones": [z.model_dump() for z in payload.zones],
        "entry_points": [p.model_dump() for p in payload.entry_points],
        "exit_points": [p.model_dump() for p in payload.exit_points],
        "source_image_blob_url": payload.source_image_blob_url,
        "createdAt": now,
        "updatedAt": now,
    }
    plans_container().create_item(doc)
    return doc


@router.get("")
def list_plans(auth: AuthContext = Depends(get_auth_context)):
    query = "SELECT * FROM c WHERE c.orgId = @orgId ORDER BY c.updatedAt DESC"
    items = list(
        plans_container().query_items(
            query=query,
            parameters=[{"name": "@orgId", "value": auth.org_id}],
            enable_cross_partition_query=False,
            partition_key=auth.org_id,
        )
    )
    return items


@router.get("/{plan_id}")
def get_plan(plan_id: str, auth: AuthContext = Depends(get_auth_context)):
    try:
        return plans_container().read_item(item=plan_id, partition_key=auth.org_id)
    except Exception as exc:
        raise HTTPException(404, "Plan not found") from exc


@router.get("/{plan_id}/internal", include_in_schema=False)
def get_plan_internal(plan_id: str, org_id: str):
    """Unauthenticated-by-JWT lookup used only by the Simulation Service over the
    internal Container Apps network, scoped by org_id/partition key rather than a
    verified end-user token. This boundary mirrors the dev-mode bypass already used
    elsewhere in this project and should move to service-to-service auth (mTLS or a
    signed service token) before this becomes a paid multi-tenant product."""
    try:
        return plans_container().read_item(item=plan_id, partition_key=org_id)
    except Exception as exc:
        raise HTTPException(404, "Plan not found") from exc
