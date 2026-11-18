"""Validation contract for AI-generated project recommendations."""

from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class RecommendationSchema(BaseModel):
    """One suggested action, its rationale, and the tasks supporting it."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    title: str = Field(min_length=1, max_length=120)
    suggested_action: str = Field(min_length=1, max_length=500)
    rationale: str = Field(min_length=1, max_length=500)
    related_task_ids: list[str] = Field(min_length=1, max_length=20)

    @field_validator("related_task_ids")
    @classmethod
    def task_ids_must_be_unique(cls, task_ids: list[str]) -> list[str]:
        if any(not task_id.strip() for task_id in task_ids):
            raise ValueError("related task IDs must not be empty")
        if len(task_ids) != len(set(task_ids)):
            raise ValueError("related task IDs must be unique")
        return task_ids


class RecommendationsResponseSchema(BaseModel):
    """Bounded collection of structured recommendations for a project."""

    model_config = ConfigDict(extra="forbid")

    recommendations: list[RecommendationSchema] = Field(
        default_factory=list,
        max_length=5,
    )


def validate_recommendations(
    result: Any,
    context: dict[str, Any],
) -> list[dict[str, Any]]:
    """Validate recommendation shape and ensure task references exist."""
    response = RecommendationsResponseSchema.model_validate(result)
    known_task_ids = {task["id"] for task in context["tasks"]}
    referenced_task_ids = {
        task_id
        for recommendation in response.recommendations
        for task_id in recommendation.related_task_ids
    }
    if not referenced_task_ids.issubset(known_task_ids):
        raise ValueError(
            "recommendations must reference tasks in the supplied context"
        )
    return response.model_dump(mode="json")["recommendations"]
