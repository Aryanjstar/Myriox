"""Verifies JWTs issued by the Myriox Auth Service (HS256, shared secret). Stateless —
no runtime call back to the Auth Service is needed to validate a token."""

from __future__ import annotations

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import get_settings

bearer_scheme = HTTPBearer(auto_error=False)


class AuthContext:
    def __init__(self, org_id: str, user_id: str):
        self.org_id = org_id
        self.user_id = user_id


async def get_auth_context(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> AuthContext:
    settings = get_settings()

    if settings.environment == "development" and credentials is None:
        # Local dev / anonymous-browsing convenience only; never reachable when
        # MYRIOX_ENVIRONMENT=production. A valid bearer token always takes precedence.
        return AuthContext(org_id="dev-org", user_id="dev-user")

    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.auth_jwt_secret,
            algorithms=["HS256"],
            issuer=settings.auth_jwt_issuer,
        )
    except jwt.PyJWTError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"Invalid token: {exc}") from exc

    org_id = payload.get("org_id")
    user_id = payload.get("sub")
    if not org_id or not user_id:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token missing org_id/sub claims")

    return AuthContext(org_id=org_id, user_id=user_id)
