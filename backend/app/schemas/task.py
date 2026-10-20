"""Pydantic models and allowed values for task data."""

from datetime import date
from typing import Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

TaskStatus = Literal["not_started", "in_progress", "blocked", "completed"]
TaskPriority = Literal["low", "medium", "high", "urgent"]
RiskSeverity = Literal["low", "medium", "high"]


class OverdueTaskSignalSchema(BaseModel):
    """A date-based risk signal and the dates that support it."""

    model_config = ConfigDict(extra="forbid")

    rule_id: Literal["overdue-task"]
    severity: RiskSeverity
    task_id: str = Field(min_length=1)
    due_date: date
    analysis_date: date


class HighPriorityOverdueTaskSignalSchema(BaseModel):
    """A high-priority overdue signal with supporting task values."""

    model_config = ConfigDict(extra="forbid")

    rule_id: Literal["high-priority-overdue-task"]
    severity: RiskSeverity
    task_id: str = Field(min_length=1)
    priority: Literal["high", "urgent"]
    due_date: date
    analysis_date: date


class ApproachingDeadlineSignalSchema(BaseModel):
    """An unfinished task has a due date in the next seven calendar days."""

    model_config = ConfigDict(extra="forbid")

    rule_id: Literal["approaching-deadline"]
    severity: RiskSeverity
    task_id: str = Field(min_length=1)
    due_date: date
    analysis_date: date


class IncompletePrerequisiteSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    task_id: str = Field(min_length=1)
    status: TaskStatus


class IncompleteDependencySignalSchema(BaseModel):
    """A non-completed task has one or more unfinished prerequisites."""

    model_config = ConfigDict(extra="forbid")

    rule_id: Literal["incomplete-dependency"]
    severity: RiskSeverity
    task_id: str = Field(min_length=1)
    prerequisites: list[IncompletePrerequisiteSchema] = Field(min_length=1)


class UnresolvedDependencySignalSchema(BaseModel):
    """A task references prerequisite IDs absent from its project data."""

    model_config = ConfigDict(extra="forbid")

    rule_id: Literal["unresolved-dependency"]
    severity: RiskSeverity
    task_id: str = Field(min_length=1)
    dependency_ids: list[str] = Field(min_length=1)


# These Literal types make FastAPI reject status or priority values outside
# the choices supported by the application.


class TaskDependencySchema(BaseModel):
    """The ID and display title of a prerequisite task."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    id: str = Field(min_length=1)
    title: str = Field(min_length=1)


class TaskSummarySchema(BaseModel):
    """Fields returned for each task in the project's display list."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    id: str = Field(min_length=1)
    project_id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: str = ""
    status: TaskStatus
    priority: TaskPriority | None = None
    owner: str | None = None
    due_date: date | None = None
    risk_signals: list[
        OverdueTaskSignalSchema
        | HighPriorityOverdueTaskSignalSchema
        | ApproachingDeadlineSignalSchema
        | IncompleteDependencySignalSchema
        | UnresolvedDependencySignalSchema
    ] = Field(default_factory=list)
    # Each task gets its own empty list when it has no dependencies.
    dependencies: list[TaskDependencySchema] = Field(default_factory=list)


class TaskSchema(BaseModel):
    """Task data rules, including fields not currently shown in the list."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    id: str = Field(min_length=1)
    project_id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    status: TaskStatus
    priority: TaskPriority
    start_date: date | None = None
    due_date: date | None = None
    owner: str | None = None

    @model_validator(mode="after")
    def due_date_is_not_before_start_date(self) -> Self:
        """Reject a task whose due date comes before its start date."""
        if (
            self.start_date is not None
            and self.due_date is not None
            and self.due_date < self.start_date
        ):
            raise ValueError("due_date must be on or after start_date")
        return self
