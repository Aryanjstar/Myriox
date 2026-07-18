from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import personas, plans

settings = get_settings()

app = FastAPI(title="Myriox Plan Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plans.router)
app.include_router(personas.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "plan-service", "environment": settings.environment}
