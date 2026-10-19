from datetime import date
from typing import Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

TaskStatus = Literal["not_started", "in_progress", "blocked", "completed"]
TaskPriority = Literal["low", "medium", "high", "urgent"]


class TaskSummarySchema(BaseModel):
    """Task fields displayed in the project task list."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    id: str = Field(min_length=1)
    project_id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: str = ""
    status: TaskStatus
    priority: TaskPriority | None = None
    owner: str | None = None
    due_date: date | None = None


class TaskSchema(BaseModel):
    """Validated task data shared by API request and response contracts."""

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
        if (
            self.start_date is not None
            and self.due_date is not None
            and self.due_date < self.start_date
        ):
            raise ValueError("due_date must be on or after start_date")
        return self
