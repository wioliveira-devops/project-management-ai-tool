import json
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException

from app.schemas.project import ProjectSchema

router = APIRouter()
SAMPLE_PROJECT_PATH = Path(__file__).resolve().parents[3] / "data" / "sample-project.json"


@router.get("/projects/{project_id}", response_model=ProjectSchema)
def get_project(project_id: str) -> dict[str, Any]:
    """Return the requested project from the initial sample data set."""
    project = json.loads(SAMPLE_PROJECT_PATH.read_text(encoding="utf-8"))

    if project["id"] != project_id:
        raise HTTPException(status_code=404, detail="Project not found")

    return project
