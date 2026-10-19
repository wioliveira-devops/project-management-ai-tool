"""Pydantic models and allowed values for task data."""

from datetime import date
from typing import Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

TaskStatus = Literal["not_started", "in_progress", "blocked", "completed"]
TaskPriority = Literal["low", "medium", "high", "urgent"]
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
