from __future__ import annotations

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from app.core.auth import AuthError, resolve_auth_context
from app.services.simulation import run_simulation

router = APIRouter(prefix="/api/simulations", tags=["simulations"])


class PersonaMixEntry(BaseModel):
    persona_id: str
    count: int


class StartSimulationRequest(BaseModel):
    plan_id: str
    persona_mix: list[PersonaMixEntry]


@router.websocket("/ws")
async def simulation_socket(websocket: WebSocket):
    """Client connects, sends {plan_id, persona_mix, token} as the first message (browsers
    can't set custom headers on the WS handshake, hence the token being in-band), then
    receives one JSON tick payload per message until {"final": true} is sent."""
    await websocket.accept()
    try:
        init = await websocket.receive_json()

        try:
            auth = resolve_auth_context(init.get("token"))
        except AuthError as exc:
            await websocket.send_json({"error": str(exc)})
            return

        plan_id = init["plan_id"]
        persona_mix = init["persona_mix"]

        async for tick_payload in run_simulation(auth.org_id, plan_id, persona_mix):
            await websocket.send_json(tick_payload)

    except WebSocketDisconnect:
        return
    except Exception as exc:  # noqa: BLE001 - surface simulation errors to the client
        await websocket.send_json({"error": str(exc)})
    finally:
        await websocket.close()
