"""Cosmos access owned exclusively by the Plan Service. No other Myriox service should
read or write the `plans` container directly — they call this service's HTTP API instead."""

from functools import lru_cache

from azure.cosmos import ContainerProxy, CosmosClient, DatabaseProxy
from azure.identity import DefaultAzureCredential

from app.core.config import get_settings


@lru_cache
def get_cosmos_client() -> CosmosClient:
    settings = get_settings()
    if settings.cosmos_key:
        return CosmosClient(settings.cosmos_endpoint, credential=settings.cosmos_key)
    # Managed identity path used in Azure Container Apps deployments.
    return CosmosClient(settings.cosmos_endpoint, credential=DefaultAzureCredential())


@lru_cache
def get_database() -> DatabaseProxy:
    settings = get_settings()
    return get_cosmos_client().get_database_client(settings.cosmos_database)


def get_container(name: str) -> ContainerProxy:
    return get_database().get_container_client(name)


def plans_container() -> ContainerProxy:
    return get_container("plans")
