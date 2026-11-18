"""Generate structured AI recommendations from project analysis context."""

import json
import os
from typing import Any

from openai import APIError, OpenAI
from pydantic import ValidationError

from app.schemas.recommendation import validate_recommendations
from app.services.recommendation_prompt import build_recommendation_input


class RecommendationError(Exception):
    """Raised when recommendations cannot be generated or parsed."""


class RecommendationNotConfigured(RecommendationError):
    """Raised when the server has no AI provider credential configured."""


def generate_recommendations(context: dict[str, Any]) -> list[dict[str, Any]]:
    """Generate and validate suggested actions for the supplied project context."""
    if not context.get("tasks"):
        return []

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RecommendationNotConfigured(
            "AI recommendations are not configured on the server."
        )

    try:
        client = OpenAI(api_key=api_key, timeout=20.0, max_retries=1)
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            input=build_recommendation_input(context),
            max_output_tokens=1800,
        )
    except APIError as error:
        raise RecommendationError(
            "The AI recommendation service is unavailable."
        ) from error

    try:
        result = json.loads(response.output_text)
    except (json.JSONDecodeError, TypeError) as error:
        raise RecommendationError(
            "The AI service returned invalid recommendation data."
        ) from error

    try:
        return validate_recommendations(result, context)
    except (ValidationError, ValueError, KeyError, TypeError) as error:
        raise RecommendationError(
            "The AI service returned invalid recommendations."
        ) from error
