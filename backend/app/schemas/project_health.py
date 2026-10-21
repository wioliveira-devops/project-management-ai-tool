"""Validated API response models for project health assessments."""

from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

ProjectHealthStateSchema = Literal[
    "insufficient", "on-track", "at-risk", "needs-attention"
]


class ProjectHealthIndicatorsSchema(BaseModel):
    """Counts that explain the calculated project health state."""

    model_config = ConfigDict(extra="forbid")

    total_tasks: int = Field(ge=0)
    not_started_tasks: int = Field(ge=0)
    completed_tasks: int = Field(ge=0)
    in_progress_tasks: int = Field(ge=0)
    blocked_tasks: int = Field(ge=0)
    overdue_tasks: int = Field(ge=0)
    high_priority_overdue_tasks: int = Field(ge=0)
    approaching_deadline_tasks: int = Field(ge=0)
    tasks_with_incomplete_dependencies: int = Field(ge=0)
    tasks_with_unresolved_dependencies: int = Field(ge=0)


class ProjectHealthAssessmentSchema(BaseModel):
    """Health classification, its calculation date, and supporting counts."""

    model_config = ConfigDict(extra="forbid")

    state: ProjectHealthStateSchema
    analysis_date: date
    indicators: ProjectHealthIndicatorsSchema
