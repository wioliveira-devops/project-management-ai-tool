"""HTTP endpoint for reading project information."""

import json
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException

from app.schemas.project import ProjectSchema

router = APIRouter()
# Resolve the sample-data file from this module's location, so the path works
# even when the backend server is started from a different current folder.
SAMPLE_PROJECT_PATH = Path(__file__).resolve().parents[3] / "data" / "sample-project.json"


@router.get("/projects/{project_id}", response_model=ProjectSchema)
def get_project(project_id: str) -> dict[str, Any]:
    """Load a project, return 404 for an unknown ID, and provide its data."""
    # This first version uses JSON files as a simple stand-in for a database.
    project = json.loads(SAMPLE_PROJECT_PATH.read_text(encoding="utf-8"))

    # A URL can contain any ID, so confirm it matches the sample project.
    if project["id"] != project_id:
        raise HTTPException(status_code=404, detail="Project not found")

    # FastAPI checks and formats this dictionary using ProjectSchema above.
    return project
