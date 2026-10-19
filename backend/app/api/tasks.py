import json
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException

from app.schemas.task import TaskSummarySchema

router = APIRouter()
DATA_DIRECTORY = Path(__file__).resolve().parents[3] / "data"
SAMPLE_PROJECT_PATH = DATA_DIRECTORY / "sample-project.json"
SAMPLE_TASKS_PATH = DATA_DIRECTORY / "sample-tasks.json"


@router.get(
    "/projects/{project_id}/tasks", response_model=list[TaskSummarySchema]
)
def get_project_tasks(project_id: str) -> list[dict[str, Any]]:
    """Return the display fields for a sample project's tasks."""
    project = json.loads(SAMPLE_PROJECT_PATH.read_text(encoding="utf-8"))

    if project["id"] != project_id:
        raise HTTPException(status_code=404, detail="Project not found")

    tasks = json.loads(SAMPLE_TASKS_PATH.read_text(encoding="utf-8"))
    return [
        {
            "id": task["id"],
            "project_id": task["project_id"],
            "title": task["title"],
            "description": task.get("description", ""),
            "status": task["status"],
            "priority": task.get("priority"),
            "owner": task.get("owner"),
            "due_date": task.get("due_date"),
        }
        for task in tasks
        if task["project_id"] == project_id
    ]
