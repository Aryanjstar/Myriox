from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import simulation

settings = get_settings()

app = FastAPI(title="Myriox Simulation Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulation.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "simulation-service", "environment": settings.environment}
