"""Collect measurable project health indicators from task data."""

from datetime import date
from typing import Any, TypedDict

from app.services.dependency_concerns import detect_dependency_concerns
from app.services.overdue_tasks import detect_overdue_tasks
from app.services.schedule_pressure import detect_schedule_pressure


class ProjectHealthIndicators(TypedDict):
    """Counts that describe the project's current task health signals."""

    total_tasks: int
    not_started_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    blocked_tasks: int
    overdue_tasks: int
    high_priority_overdue_tasks: int
    approaching_deadline_tasks: int
    tasks_with_incomplete_dependencies: int
    tasks_with_unresolved_dependencies: int


def collect_project_health_indicators(
    tasks: list[dict[str, Any]], analysis_date: date
) -> ProjectHealthIndicators:
    """Return independent task counts for downstream health calculation.

    Overdue and approaching-deadline counts exclude completed tasks through
    the shared risk detectors. Dependency counts represent affected tasks,
    rather than the number of individual prerequisite links.
    """
    overdue_signals = detect_overdue_tasks(tasks, analysis_date)
    schedule_signals = detect_schedule_pressure(tasks, analysis_date)
    dependency_signals = detect_dependency_concerns(tasks)

    def affected_task_count(signals: list[dict[str, Any]], rule_id: str) -> int:
        return len(
            {
                signal["task_id"]
                for signal in signals
                if signal["rule_id"] == rule_id
            }
        )

    return {
        "total_tasks": len(tasks),
        "not_started_tasks": sum(task["status"] == "not_started" for task in tasks),
        "completed_tasks": sum(task["status"] == "completed" for task in tasks),
        "in_progress_tasks": sum(task["status"] == "in_progress" for task in tasks),
        "blocked_tasks": sum(task["status"] == "blocked" for task in tasks),
        "overdue_tasks": affected_task_count(overdue_signals, "overdue-task"),
        "high_priority_overdue_tasks": affected_task_count(
            overdue_signals, "high-priority-overdue-task"
        ),
        "approaching_deadline_tasks": affected_task_count(
            schedule_signals, "approaching-deadline"
        ),
        "tasks_with_incomplete_dependencies": affected_task_count(
            dependency_signals, "incomplete-dependency"
        ),
        "tasks_with_unresolved_dependencies": affected_task_count(
            dependency_signals, "unresolved-dependency"
        ),
    }
