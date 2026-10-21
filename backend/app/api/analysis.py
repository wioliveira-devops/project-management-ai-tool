"""HTTP endpoint for calculated project analysis."""

import json
from datetime import date
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException

from app.schemas.project_health import ProjectHealthAssessmentSchema
from app.services.project_health_assessment import assess_project_health

router = APIRouter()
DATA_DIRECTORY = Path(__file__).resolve().parents[3] / "data"
SAMPLE_PROJECT_PATH = DATA_DIRECTORY / "sample-project.json"
SAMPLE_TASKS_PATH = DATA_DIRECTORY / "sample-tasks.json"


@router.get(
    "/projects/{project_id}/analysis",
    response_model=ProjectHealthAssessmentSchema,
)
def get_project_analysis(project_id: str) -> dict[str, Any]:
    """Return the combined health state and indicator counts for a project."""
    project = json.loads(SAMPLE_PROJECT_PATH.read_text(encoding="utf-8"))
    if project["id"] != project_id:
        raise HTTPException(status_code=404, detail="Project not found")

    tasks = json.loads(SAMPLE_TASKS_PATH.read_text(encoding="utf-8"))
    project_tasks = [task for task in tasks if task["project_id"] == project_id]
    analysis_date = date.today()
    assessment = assess_project_health(project_tasks, analysis_date)
    return {
        **assessment,
        "analysis_date": analysis_date,
    }
