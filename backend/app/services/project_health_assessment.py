"""Combine project health indicators and classification rules."""

from datetime import date
from typing import Any, TypedDict

from app.services.project_health_indicators import (
    ProjectHealthIndicators,
    collect_project_health_indicators,
)
from app.services.project_health_rules import (
    ProjectHealthState,
    calculate_project_health,
)


class ProjectHealthAssessment(TypedDict):
    """A project health state and the counts used to calculate it."""

    state: ProjectHealthState
    indicators: ProjectHealthIndicators


def assess_project_health(
    tasks: list[dict[str, Any]], analysis_date: date
) -> ProjectHealthAssessment:
    """Collect task indicators and classify health for the supplied date."""
    indicators = collect_project_health_indicators(tasks, analysis_date)
    return {
        "state": calculate_project_health(indicators),
        "indicators": indicators,
    }
