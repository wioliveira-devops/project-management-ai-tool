"""Validation contract for AI-generated project risk explanations."""

from collections import Counter
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class RiskExplanationSchema(BaseModel):
    """A short explanation linked to one deterministic risk signal."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    task_id: str = Field(min_length=1)
    rule_id: str = Field(min_length=1)
    explanation: str = Field(min_length=1, max_length=500)


class RiskExplanationsResponseSchema(BaseModel):
    """Structured response containing all explanations for a project."""

    model_config = ConfigDict(extra="forbid")

    risk_explanations: list[RiskExplanationSchema] = Field(default_factory=list)


def validate_risk_explanations(
    result: Any,
    context: dict[str, Any],
) -> list[dict[str, str]]:
    """Validate shape and ensure every supplied signal has exactly one result."""
    response = RiskExplanationsResponseSchema.model_validate(result)
    expected = Counter(
        (task["id"], signal["rule_id"])
        for task in context["tasks"]
        for signal in task["risk_signals"]
    )
    actual = Counter(
        (item.task_id, item.rule_id) for item in response.risk_explanations
    )
    if actual != expected:
        raise ValueError(
            "AI risk explanations must match the supplied risk signals exactly"
        )
    return response.model_dump(mode="json")["risk_explanations"]
