"""Prepare and select project context for AI-assisted insights."""

from datetime import date
from typing import Any

from app.schemas.ai_input import AIInsightsInputSchema
from app.services.dependency_concerns import detect_dependency_concerns
from app.services.overdue_tasks import detect_overdue_tasks
from app.services.project_health_assessment import assess_project_health
from app.services.risk_severity import assign_risk_severity
from app.services.schedule_pressure import detect_schedule_pressure

PROJECT_CONTEXT_FIELDS = (
    "id",
    "name",
    "description",
    "status",
    "start_date",
    "target_end_date",
)
TASK_CONTEXT_FIELDS = (
    "id",
    "title",
    "description",
    "status",
    "priority",
    "due_date",
    "risk_signals",
    "dependencies",
)


def prepare_ai_insights_input(
    project: dict[str, Any],
    all_tasks: list[dict[str, Any]],
    analysis_date: date,
) -> dict[str, Any]:
    """Assemble selected context and deterministic analysis for one project."""
    project_id = project["id"]
    project_tasks = [
        task for task in all_tasks if task["project_id"] == project_id
    ]
    tasks_by_id = {task["id"]: task for task in project_tasks}

    risk_signals = detect_overdue_tasks(project_tasks, analysis_date)
    risk_signals.extend(detect_schedule_pressure(project_tasks, analysis_date))
    risk_signals.extend(detect_dependency_concerns(project_tasks))
    risk_signals = assign_risk_severity(risk_signals)
    signals_by_task: dict[str, list[dict[str, Any]]] = {}
    for signal in risk_signals:
        signals_by_task.setdefault(signal["task_id"], []).append(signal)

    task_context = [
        {
            "id": task["id"],
            "title": task["title"],
            "description": task.get("description", ""),
            "status": task["status"],
            "priority": task.get("priority"),
            "due_date": task.get("due_date"),
            "risk_signals": signals_by_task.get(task["id"], []),
            "dependencies": [
                {
                    "id": dependency_id,
                    "title": tasks_by_id.get(dependency_id, {}).get(
                        "title", f"Unknown task ({dependency_id})"
                    ),
                }
                for dependency_id in task.get("depends_on", [])
            ],
        }
        for task in project_tasks
    ]
    assessment = {
        **assess_project_health(project_tasks, analysis_date),
        "analysis_date": analysis_date,
    }
    return select_ai_insights_input(project, task_context, assessment)


def select_ai_insights_input(
    project: dict[str, Any],
    tasks: list[dict[str, Any]],
    analysis: dict[str, Any],
) -> dict[str, Any]:
    """Build a minimal validated payload from project, task, and analysis data."""
    selected_project = {
        field: project[field]
        for field in PROJECT_CONTEXT_FIELDS
        if field in project
    }
    selected_tasks = [
        {
            field: task[field]
            for field in TASK_CONTEXT_FIELDS
            if field in task
        }
        for task in tasks
    ]
    payload = AIInsightsInputSchema.model_validate(
        {
            "project": selected_project,
            "tasks": selected_tasks,
            "analysis": analysis,
        }
    )
    return payload.model_dump(mode="json")
