"""HTTP endpoint that builds the task list for a project."""

import json
from datetime import date
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException

from app.schemas.task import TaskSummarySchema
from app.services.dependency_concerns import detect_dependency_concerns
from app.services.overdue_tasks import detect_overdue_tasks
from app.services.risk_severity import assign_risk_severity
from app.services.schedule_pressure import detect_schedule_pressure

router = APIRouter()
# Build paths relative to this file rather than relying on where the server
# command happens to be run from.
DATA_DIRECTORY = Path(__file__).resolve().parents[3] / "data"
SAMPLE_PROJECT_PATH = DATA_DIRECTORY / "sample-project.json"
SAMPLE_TASKS_PATH = DATA_DIRECTORY / "sample-tasks.json"


@router.get(
    "/projects/{project_id}/tasks", response_model=list[TaskSummarySchema]
)
def get_project_tasks(project_id: str) -> list[dict[str, Any]]:
    """Return tasks belonging to a project with fields needed by the UI."""
    # Check the project first so an unknown project gets a clear 404 response.
    project = json.loads(SAMPLE_PROJECT_PATH.read_text(encoding="utf-8"))

    if project["id"] != project_id:
        raise HTTPException(status_code=404, detail="Project not found")

    # Keep only this project's tasks; the JSON file may contain several.
    tasks = json.loads(SAMPLE_TASKS_PATH.read_text(encoding="utf-8"))
    project_tasks = [task for task in tasks if task["project_id"] == project_id]
    # This lookup lets us turn dependency IDs into readable task titles.
    tasks_by_id = {task["id"]: task for task in project_tasks}

    risk_signals: dict[str, list[dict[str, Any]]] = {}
    signals = detect_overdue_tasks(project_tasks, date.today())
    signals.extend(detect_schedule_pressure(project_tasks, date.today()))
    signals.extend(detect_dependency_concerns(project_tasks))
    signals = assign_risk_severity(signals)
    for signal in signals:
        risk_signals.setdefault(signal["task_id"], []).append(signal)
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
            "risk_signals": risk_signals.get(task["id"], []),
            "dependencies": [
                {
                    "id": dependency_id,
                    # Keep the ID visible if sample data references a missing task.
                    "title": tasks_by_id.get(dependency_id, {}).get(
                        "title", f"Unknown task ({dependency_id})"
                    ),
                }
                for dependency_id in task.get("depends_on", [])
            ],
        }
        for task in project_tasks
    ]
