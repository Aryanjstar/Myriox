from __future__ import annotations

from fastapi import APIRouter

from app.personas import SEED_PERSONAS

router = APIRouter(prefix="/api/personas", tags=["personas"])


@router.get("")
def list_personas():
    return [p.model_dump() for p in SEED_PERSONAS]
