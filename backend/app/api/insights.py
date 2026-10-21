"""HTTP endpoint for user-triggered AI project summaries."""

import json
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException

from app.schemas.project_summary import ProjectSummarySchema
from app.services.ai_input import prepare_ai_insights_input
from app.services.project_summary import (
    ProjectSummaryError,
    ProjectSummaryNotConfigured,
    generate_project_summary,
)

router = APIRouter()
DATA_DIRECTORY = Path(__file__).resolve().parents[3] / "data"
SAMPLE_PROJECT_PATH = DATA_DIRECTORY / "sample-project.json"
SAMPLE_TASKS_PATH = DATA_DIRECTORY / "sample-tasks.json"


@router.post(
    "/projects/{project_id}/summary",
    response_model=ProjectSummarySchema,
)
def create_project_summary(project_id: str) -> dict[str, Any]:
    """Generate an on-demand summary from validated project and analysis data."""
    project = json.loads(SAMPLE_PROJECT_PATH.read_text(encoding="utf-8"))
    if project["id"] != project_id:
        raise HTTPException(status_code=404, detail="Project not found")

    tasks = json.loads(SAMPLE_TASKS_PATH.read_text(encoding="utf-8"))
    analysis_date = date.today()
    context = prepare_ai_insights_input(project, tasks, analysis_date)
    try:
        summary = generate_project_summary(context)
    except ProjectSummaryError as error:
        status_code = 503 if isinstance(error, ProjectSummaryNotConfigured) else 502
        raise HTTPException(status_code=status_code, detail=str(error)) from error

    return {
        "summary": summary,
        "health_state": context["analysis"]["state"],
        "analysis_date": analysis_date,
        "generated_at": datetime.now(timezone.utc),
    }
