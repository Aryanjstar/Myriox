from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="MYRIOX_", extra="ignore")

    environment: str = "development"

    azure_openai_endpoint: str = ""
    azure_openai_api_key: str = ""
    azure_openai_api_version: str = "2024-10-21"
    agent_reasoning_deployment: str = "agent-reasoning"
    report_synthesis_deployment: str = "report-synthesis"
    embedding_deployment: str = "text-embedding-3-large"

    cosmos_endpoint: str = ""
    cosmos_key: str = ""
    cosmos_database: str = "myriox"

    # Base URL of the Plan Service — the Simulation Service never touches the `plans`
    # container directly, it fetches plan data over HTTP.
    plan_service_url: str = "http://localhost:8010"

    # Shared with the Auth Service — must be the exact same value so tokens it issues
    # verify here without any runtime call back to the Auth Service.
    auth_jwt_secret: str = "dev-only-insecure-secret-change-me"
    auth_jwt_issuer: str = "myriox-auth"

    cors_origins: list[str] = ["http://localhost:3000"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
