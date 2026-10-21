"""Validated context structure prepared for AI-assisted project insights."""

from datetime import date
from typing import Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.project import ProjectStatus
from app.schemas.project_health import ProjectHealthAssessmentSchema
from app.schemas.task import (
    ApproachingDeadlineSignalSchema,
    HighPriorityOverdueTaskSignalSchema,
    IncompleteDependencySignalSchema,
    OverdueTaskSignalSchema,
    TaskDependencySchema,
    TaskPriority,
    TaskStatus,
    UnresolvedDependencySignalSchema,
)


class AIProjectContextSchema(BaseModel):
    """Project facts useful for interpreting task and health context."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    description: str = ""
    status: ProjectStatus
    start_date: date | None = None
    target_end_date: date | None = None

    @model_validator(mode="after")
    def target_end_date_is_not_before_start_date(self) -> Self:
        """Reject project context with an impossible date range."""
        if (
            self.start_date is not None
            and self.target_end_date is not None
            and self.target_end_date < self.start_date
        ):
            raise ValueError("target_end_date must be on or after start_date")
        return self


class AITaskContextSchema(BaseModel):
    """Task facts and explainable signals relevant to project analysis."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: str = ""
    status: TaskStatus
    priority: TaskPriority | None = None
    due_date: date | None = None
    risk_signals: list[
        OverdueTaskSignalSchema
        | HighPriorityOverdueTaskSignalSchema
        | ApproachingDeadlineSignalSchema
        | IncompleteDependencySignalSchema
        | UnresolvedDependencySignalSchema
    ] = Field(default_factory=list)
    dependencies: list[TaskDependencySchema] = Field(default_factory=list)


class AIInsightsInputSchema(BaseModel):
    """Project context and deterministic analysis supplied to an AI service."""

    model_config = ConfigDict(extra="forbid")

    project: AIProjectContextSchema
    tasks: list[AITaskContextSchema] = Field(default_factory=list)
    analysis: ProjectHealthAssessmentSchema

    @model_validator(mode="after")
    def context_is_consistent(self) -> Self:
        """Ensure task references and health counts match the included context."""
        task_ids = [task.id for task in self.tasks]
        if len(task_ids) != len(set(task_ids)):
            raise ValueError("task IDs must be unique within the AI input")

        tasks_by_id = {task.id: task for task in self.tasks}
        for task in self.tasks:
            dependency_ids = [dependency.id for dependency in task.dependencies]
            if len(dependency_ids) != len(set(dependency_ids)):
                raise ValueError(
                    f"task {task.id} must not repeat dependency references"
                )
            for signal in task.risk_signals:
                if signal.task_id != task.id:
                    raise ValueError(
                        f"risk signal task_id must match task {task.id}"
                    )
                if hasattr(signal, "analysis_date") and (
                    signal.analysis_date != self.analysis.analysis_date
                ):
                    raise ValueError(
                        "risk signal analysis_date must match project analysis_date"
                    )
                if hasattr(signal, "due_date") and signal.due_date != task.due_date:
                    raise ValueError(
                        f"risk signal due_date must match task {task.id}"
                    )
                if hasattr(signal, "priority") and signal.priority != task.priority:
                    raise ValueError(
                        f"risk signal priority must match task {task.id}"
                    )

        indicators = self.analysis.indicators
        if indicators.total_tasks != len(self.tasks):
            raise ValueError("total_tasks must match the number of included tasks")

        status_counts = {
            "not_started_tasks": sum(
                task.status == "not_started" for task in self.tasks
            ),
            "completed_tasks": sum(task.status == "completed" for task in self.tasks),
            "in_progress_tasks": sum(
                task.status == "in_progress" for task in self.tasks
            ),
            "blocked_tasks": sum(task.status == "blocked" for task in self.tasks),
        }
        for field, count in status_counts.items():
            if getattr(indicators, field) != count:
                raise ValueError(f"{field} must match the included task statuses")

        for task in self.tasks:
            for dependency in task.dependencies:
                if dependency.id in tasks_by_id and (
                    dependency.title != tasks_by_id[dependency.id].title
                ):
                    raise ValueError(
                        f"dependency title must match included task {dependency.id}"
                    )
        return self
