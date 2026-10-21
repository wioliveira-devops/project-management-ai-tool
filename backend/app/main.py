"""Create the FastAPI application and connect its HTTP routes."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analysis import router as analysis_router
from app.api.health import router as health_router
from app.api.projects import router as projects_router
from app.api.tasks import router as tasks_router

app = FastAPI(
    title="Project Management AI Tool API",
    version="0.1.0",
)

# The browser frontend runs on a separate local address during development.
# CORS lets it make read-only (GET) requests to this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Routers group related endpoints; the shared prefix makes their URLs start
# with /api (for example, /api/health).
app.include_router(health_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(tasks_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
