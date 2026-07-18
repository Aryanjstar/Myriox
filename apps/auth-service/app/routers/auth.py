from __future__ import annotations

import uuid
from datetime import datetime, timezone

import jwt
from azure.cosmos.exceptions import CosmosResourceExistsError, CosmosResourceNotFoundError
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, EmailStr, Field

from app.core.config import get_settings
from app.services.cosmos import users_container
from app.services.security import hash_password, issue_token, validate_password_strength, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])

bearer_scheme = HTTPBearer(auto_error=False)


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str = Field(min_length=1, max_length=120)
    org_name: str = Field(min_length=1, max_length=120)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthUser(BaseModel):
    id: str
    email: str
    name: str
    org_id: str
    org_name: str


class AuthResponse(BaseModel):
    token: str
    user: AuthUser


def _normalize_email(email: str) -> str:
    return email.strip().lower()


@router.post("/signup", response_model=AuthResponse)
def signup(payload: SignupRequest):
    weakness = validate_password_strength(payload.password)
    if weakness:
        raise HTTPException(422, weakness)

    email = _normalize_email(payload.email)
    now = datetime.now(timezone.utc).isoformat()
    org_id = str(uuid.uuid4())
    user_doc = {
        "id": email,
        "email": email,
        "name": payload.name,
        "orgId": org_id,
        "orgName": payload.org_name,
        "passwordHash": hash_password(payload.password),
        "createdAt": now,
    }

    try:
        users_container().create_item(user_doc)
    except CosmosResourceExistsError as exc:
        raise HTTPException(409, "An account with this email already exists.") from exc

    token = issue_token(user_id=email, org_id=org_id, email=email, name=payload.name)
    return AuthResponse(
        token=token,
        user=AuthUser(id=email, email=email, name=payload.name, org_id=org_id, org_name=payload.org_name),
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest):
    email = _normalize_email(payload.email)
    try:
        user_doc = users_container().read_item(item=email, partition_key=email)
    except CosmosResourceNotFoundError as exc:
        raise HTTPException(401, "Invalid email or password.") from exc

    if not verify_password(payload.password, user_doc["passwordHash"]):
        raise HTTPException(401, "Invalid email or password.")

    token = issue_token(
        user_id=email, org_id=user_doc["orgId"], email=email, name=user_doc["name"]
    )
    return AuthResponse(
        token=token,
        user=AuthUser(
            id=email,
            email=email,
            name=user_doc["name"],
            org_id=user_doc["orgId"],
            org_name=user_doc["orgName"],
        ),
    )


@router.get("/me", response_model=AuthUser)
def me(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)):
    if credentials is None:
        raise HTTPException(401, "Missing bearer token")

    settings = get_settings()
    try:
        claims = jwt.decode(
            credentials.credentials,
            settings.auth_jwt_secret,
            algorithms=["HS256"],
            issuer=settings.auth_jwt_issuer,
        )
    except jwt.PyJWTError as exc:
        raise HTTPException(401, f"Invalid token: {exc}") from exc

    try:
        user_doc = users_container().read_item(item=claims["sub"], partition_key=claims["sub"])
    except CosmosResourceNotFoundError as exc:
        raise HTTPException(404, "User not found") from exc

    return AuthUser(
        id=user_doc["email"],
        email=user_doc["email"],
        name=user_doc["name"],
        org_id=user_doc["orgId"],
        org_name=user_doc["orgName"],
    )
