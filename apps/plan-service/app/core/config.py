from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="MYRIOX_", extra="ignore")

    environment: str = "development"

    cosmos_endpoint: str = ""
    cosmos_key: str = ""
    cosmos_database: str = "myriox"

    # Shared with the Auth Service — must be the exact same value so tokens it issues
    # verify here without any runtime call back to the Auth Service.
    auth_jwt_secret: str = "dev-only-insecure-secret-change-me"
    auth_jwt_issuer: str = "myriox-auth"

    cors_origins: list[str] = ["http://localhost:3000"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
