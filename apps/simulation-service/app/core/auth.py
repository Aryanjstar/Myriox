"""Verifies JWTs issued by the Myriox Auth Service (HS256, shared secret). Stateless —
no runtime call back to the Auth Service is needed to validate a token.

Browsers can't set custom headers on the native WebSocket handshake, so the Simulation
Service's `/api/simulations/ws` accepts the token in the first JSON message instead of an
Authorization header (see routers/simulation.py) and verifies it with the same helper used
here."""

from __future__ import annotations

import jwt

from app.core.config import get_settings


class AuthContext:
    def __init__(self, org_id: str, user_id: str):
        self.org_id = org_id
        self.user_id = user_id


class AuthError(Exception):
    pass


def resolve_auth_context(token: str | None) -> AuthContext:
    settings = get_settings()

    if token is None:
        if settings.environment == "development":
            return AuthContext(org_id="dev-org", user_id="dev-user")
        raise AuthError("Missing token")

    try:
        payload = jwt.decode(
            token,
            settings.auth_jwt_secret,
            algorithms=["HS256"],
            issuer=settings.auth_jwt_issuer,
        )
    except jwt.PyJWTError as exc:
        raise AuthError(f"Invalid token: {exc}") from exc

    org_id = payload.get("org_id")
    user_id = payload.get("sub")
    if not org_id or not user_id:
        raise AuthError("Token missing org_id/sub claims")

    return AuthContext(org_id=org_id, user_id=user_id)
