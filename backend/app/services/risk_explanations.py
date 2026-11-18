"""Generate AI explanations for deterministic project risk signals."""

import json
import os
from typing import Any

from openai import APIError, OpenAI
from pydantic import ValidationError

from app.schemas.risk_explanation import validate_risk_explanations
from app.services.risk_prompt import build_risk_explanation_input


class RiskExplanationError(Exception):
    """Raised when risk explanations cannot be generated or parsed."""


class RiskExplanationNotConfigured(RiskExplanationError):
    """Raised when the server has no AI provider credential configured."""


def generate_risk_explanations(
    context: dict[str, Any],
) -> list[dict[str, str]]:
    """Generate one explanation per deterministic risk signal in the context."""
    if not any(task.get("risk_signals") for task in context.get("tasks", [])):
        return []

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RiskExplanationNotConfigured(
            "AI risk explanations are not configured on the server."
        )

    try:
        client = OpenAI(api_key=api_key, timeout=20.0, max_retries=1)
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            input=build_risk_explanation_input(context),
            max_output_tokens=1200,
        )
    except APIError as error:
        raise RiskExplanationError(
            "The AI risk explanation service is unavailable."
        ) from error

    try:
        result = json.loads(response.output_text)
    except (json.JSONDecodeError, TypeError) as error:
        raise RiskExplanationError(
            "The AI service returned invalid risk explanation data."
        ) from error

    try:
        return validate_risk_explanations(result, context)
    except (ValidationError, ValueError, KeyError, TypeError) as error:
        raise RiskExplanationError(
            "The AI service returned invalid or incomplete risk explanations."
        ) from error
