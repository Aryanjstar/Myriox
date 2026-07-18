"""Compliance Auditor: RAG-backed check against building codes / ADA clauses.

Runs once per simulation (not per tick, per persona) against the set of cells agents
actually struggled with, keeping GPT-4.1/GPT-5-class calls to a minimum for cost control.
"""

from __future__ import annotations

import json
import uuid

from langchain_core.messages import SystemMessage
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings

from app.agents.grid_world import GridWorld
from app.core.config import get_settings
from app.services.cosmos import code_clauses_container

ADA_MIN_CORRIDOR_WIDTH_METERS = 0.915  # 36 inches, standard ADA accessible route minimum
ADA_MIN_DOOR_WIDTH_METERS = 0.815  # 32 inches clear width


def _embeddings() -> AzureOpenAIEmbeddings:
    settings = get_settings()
    return AzureOpenAIEmbeddings(
        azure_endpoint=settings.azure_openai_endpoint,
        api_key=settings.azure_openai_api_key,
        api_version=settings.azure_openai_api_version,
        azure_deployment=settings.embedding_deployment,
    )


def _report_llm() -> AzureChatOpenAI:
    settings = get_settings()
    return AzureChatOpenAI(
        azure_endpoint=settings.azure_openai_endpoint,
        api_key=settings.azure_openai_api_key,
        api_version=settings.azure_openai_api_version,
        azure_deployment=settings.report_synthesis_deployment,
        temperature=0.2,
    )


def deterministic_geometry_findings(
    run_id: str, grid: GridWorld, cell_size_meters: float
) -> list[dict]:
    """Cheap, no-LLM-call checks for the obvious cases (narrow corridors/doors)."""
    findings = []
    narrow_cells = grid.narrow_corridor_cells(ADA_MIN_CORRIDOR_WIDTH_METERS, cell_size_meters)
    for x, y in narrow_cells:
        findings.append(
            {
                "id": str(uuid.uuid4()),
                "run_id": run_id,
                "cell_ref": {"x": x, "y": y},
                "severity": "violation",
                "code": "ADA-4.13.5",
                "description": (
                    f"Corridor/door at ({x}, {y}) is narrower than the "
                    f"{ADA_MIN_CORRIDOR_WIDTH_METERS}m ADA minimum accessible route width."
                ),
                "source_clause_id": "ada-4.13.5",
            }
        )
    return findings


def rag_lookup_for_struggle_point(query_text: str, jurisdiction: str, top_k: int = 3) -> list[dict]:
    """Vector search against the codeClauses container for a natural-language description
    of a struggle point (e.g. "wheelchair user stuck near stairs with no ramp")."""
    embeddings = _embeddings()
    vector = embeddings.embed_query(query_text)
    container = code_clauses_container()

    query = (
        "SELECT TOP @topK c.id, c.text, c.code, c.jurisdiction, "
        "VectorDistance(c.embedding, @embedding) AS score "
        "FROM c WHERE c.jurisdiction = @jurisdiction "
        "ORDER BY VectorDistance(c.embedding, @embedding)"
    )
    items = list(
        container.query_items(
            query=query,
            parameters=[
                {"name": "@topK", "value": top_k},
                {"name": "@embedding", "value": vector},
                {"name": "@jurisdiction", "value": jurisdiction},
            ],
            enable_cross_partition_query=True,
        )
    )
    return items


def synthesize_llm_findings(
    run_id: str, struggle_summaries: list[str], jurisdiction: str = "us_ada"
) -> list[dict]:
    """For struggle points that aren't caught by the deterministic geometry check (e.g. a
    delivery worker circling looking for a service elevator), ask the report model to reason
    over retrieved code clauses and flag genuine compliance concerns vs. ordinary friction."""
    if not struggle_summaries:
        return []

    llm = _report_llm()
    findings = []

    for summary in struggle_summaries:
        clauses = rag_lookup_for_struggle_point(summary, jurisdiction)
        prompt = (
            "You are a building-code compliance auditor. An autonomous pedestrian simulation "
            f"observed this struggle: \"{summary}\".\n"
            f"Relevant code clauses retrieved via RAG: {json.dumps(clauses)}\n"
            "If this struggle indicates a genuine code violation (not just ordinary crowding), "
            'respond with strict JSON: {"is_violation": true, "code": "...", "description": "..."}. '
            'Otherwise respond {"is_violation": false}.'
        )
        try:
            response = llm.invoke([SystemMessage(content=prompt)])
            parsed = json.loads(response.content)
        except Exception:
            parsed = {"is_violation": False}

        if parsed.get("is_violation"):
            findings.append(
                {
                    "id": str(uuid.uuid4()),
                    "run_id": run_id,
                    "cell_ref": {"x": 0, "y": 0},
                    "severity": "warning",
                    "code": parsed.get("code", "unknown"),
                    "description": parsed.get("description", summary),
                    "source_clause_id": clauses[0]["id"] if clauses else "unknown",
                }
            )

    return findings
