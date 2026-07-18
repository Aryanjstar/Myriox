from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="MYRIOX_", extra="ignore")

    environment: str = "development"

    cosmos_endpoint: str = ""
    cosmos_key: str = ""
    cosmos_database: str = "myriox"

    # Shared HS256 secret. The Plan Service and Simulation Service verify tokens issued
    # here using the same secret — this is the only coupling between auth and the other
    # services (stateless verification, no runtime call back to auth-service required).
    auth_jwt_secret: str = "dev-only-insecure-secret-change-me"
    auth_jwt_issuer: str = "myriox-auth"
    auth_token_expires_minutes: int = 60 * 24 * 14  # 14 days

    cors_origins: list[str] = ["http://localhost:3000"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
