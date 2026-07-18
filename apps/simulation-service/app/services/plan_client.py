"""HTTP client for the Plan Service. The Simulation Service never imports the Plan
Service's code or reads its Cosmos containers directly — this is the only sanctioned
way to read plan data, per this project's microservices boundary rule."""

from __future__ import annotations

import httpx
from fastapi import HTTPException

from app.core.config import get_settings


async def fetch_plan(org_id: str, plan_id: str) -> dict:
    settings = get_settings()
    url = f"{settings.plan_service_url.rstrip('/')}/api/plans/{plan_id}/internal"
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, params={"org_id": org_id})
    if response.status_code == 404:
        raise HTTPException(404, "Plan not found")
    response.raise_for_status()
    return response.json()
