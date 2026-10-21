"""Deterministic rules for translating health indicators into a state."""

from typing import Literal

from app.services.project_health_indicators import ProjectHealthIndicators

ProjectHealthState = Literal[
    "insufficient", "on-track", "at-risk", "needs-attention"
]


def calculate_project_health(
    indicators: ProjectHealthIndicators,
) -> ProjectHealthState:
    """Classify project health using the highest-priority matching condition.

    No tasks yields insufficient data. Blocked work, unresolved prerequisites,
    or high-priority overdue work needs attention. Other overdue tasks,
    approaching deadlines, or incomplete prerequisites indicate risk. A
    project with none of these signals is on track.
    """
    if indicators["total_tasks"] == 0:
        return "insufficient"

    if (
        indicators["blocked_tasks"] > 0
        or indicators["tasks_with_unresolved_dependencies"] > 0
        or indicators["high_priority_overdue_tasks"] > 0
    ):
        return "needs-attention"

    if (
        indicators["overdue_tasks"] > 0
        or indicators["approaching_deadline_tasks"] > 0
        or indicators["tasks_with_incomplete_dependencies"] > 0
    ):
        return "at-risk"

    return "on-track"
