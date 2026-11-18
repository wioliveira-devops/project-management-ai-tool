"""Quality guardrails for generated project recommendations."""

import json
import os
import unittest
from unittest.mock import MagicMock, patch

from pydantic import ValidationError

from app.schemas.recommendation import validate_recommendations
from app.services.recommendation_prompt import (
    RECOMMENDATION_PROMPT,
    build_recommendation_input,
)
from app.services.recommendations import (
    RecommendationError,
    RecommendationNotConfigured,
    generate_recommendations,
)


class RecommendationQualityTests(unittest.TestCase):
    def setUp(self) -> None:
        self.context = {
            "project": {"id": "project-1", "name": "Customer Portal"},
            "tasks": [
                {"id": "task-1", "title": "Review account design"},
                {"id": "task-2", "title": "Implement account page"},
            ],
            "analysis": {"state": "at-risk"},
        }
        self.recommendation = {
            "title": "Review the overdue account design",
            "suggested_action": (
                "Consider confirming the remaining effort with the task owner."
            ),
            "rationale": "The design task is overdue and remains incomplete.",
            "related_task_ids": ["task-1"],
        }

    def test_accepts_action_with_rationale_and_known_task_evidence(self) -> None:
        result = validate_recommendations(
            {"recommendations": [self.recommendation]}, self.context
        )

        self.assertEqual(result, [self.recommendation])

    def test_accepts_empty_result_when_context_supports_no_action(self) -> None:
        result = validate_recommendations({"recommendations": []}, self.context)

        self.assertEqual(result, [])

    def test_rejects_recommendation_without_task_evidence(self) -> None:
        recommendation = {**self.recommendation, "related_task_ids": []}

        with self.assertRaises(ValidationError):
            validate_recommendations(
                {"recommendations": [recommendation]}, self.context
            )

    def test_rejects_task_reference_outside_supplied_context(self) -> None:
        recommendation = {**self.recommendation, "related_task_ids": ["task-unknown"]}

        with self.assertRaisesRegex(ValueError, "supplied context"):
            validate_recommendations(
                {"recommendations": [recommendation]}, self.context
            )

    def test_rejects_duplicate_task_ids_and_extra_fields(self) -> None:
        duplicate_reference = {
            **self.recommendation,
            "related_task_ids": ["task-1", "task-1"],
        }
        extra_field = {**self.recommendation, "confidence": "high"}

        with self.subTest("duplicate references"):
            with self.assertRaises(ValidationError):
                validate_recommendations(
                    {"recommendations": [duplicate_reference]}, self.context
                )
        with self.subTest("unknown response field"):
            with self.assertRaises(ValidationError):
                validate_recommendations(
                    {"recommendations": [extra_field]}, self.context
                )

    def test_rejects_more_than_five_recommendations(self) -> None:
        response = {"recommendations": [self.recommendation] * 6}

        with self.assertRaises(ValidationError):
            validate_recommendations(response, self.context)

    def test_rejects_blank_or_overlong_recommendation_text(self) -> None:
        blank_action = {**self.recommendation, "suggested_action": "  "}
        long_title = {**self.recommendation, "title": "x" * 121}

        with self.subTest("blank suggested action"):
            with self.assertRaises(ValidationError):
                validate_recommendations(
                    {"recommendations": [blank_action]}, self.context
                )
        with self.subTest("title length limit"):
            with self.assertRaises(ValidationError):
                validate_recommendations(
                    {"recommendations": [long_title]}, self.context
                )

    def test_prompt_requires_grounded_specific_suggestions(self) -> None:
        messages = build_recommendation_input(self.context)

        self.assertEqual(messages[0]["content"], RECOMMENDATION_PROMPT)
        self.assertIn("specific, manageable actions", RECOMMENDATION_PROMPT)
        self.assertIn("explicitly as an optional suggestion", RECOMMENDATION_PROMPT)
        self.assertIn("Do not phrase actions as commands", RECOMMENDATION_PROMPT)
        self.assertIn("Do not invent project facts", RECOMMENDATION_PROMPT)
        self.assertIn("related_task_ids", messages[0]["content"])
        self.assertEqual(json.loads(messages[1]["content"]), self.context)

    @patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"})
    @patch("app.services.recommendations.OpenAI")
    def test_generation_returns_only_validated_recommendations(
        self,
        openai_class: MagicMock,
    ) -> None:
        openai_class.return_value.responses.create.return_value.output_text = (
            json.dumps({"recommendations": [self.recommendation]})
        )

        result = generate_recommendations(self.context)

        self.assertEqual(result, [self.recommendation])
        openai_class.return_value.responses.create.assert_called_once()

    @patch.dict(os.environ, {"OPENAI_API_KEY": "test-key"})
    @patch("app.services.recommendations.OpenAI")
    def test_generation_rejects_invalid_json(self, openai_class: MagicMock) -> None:
        openai_class.return_value.responses.create.return_value.output_text = "not json"

        with self.assertRaisesRegex(RecommendationError, "invalid recommendation data"):
            generate_recommendations(self.context)

    @patch.dict(os.environ, {"OPENAI_API_KEY": ""})
    @patch("app.services.recommendations.OpenAI")
    def test_generation_requires_provider_configuration(
        self,
        openai_class: MagicMock,
    ) -> None:
        with self.assertRaises(RecommendationNotConfigured):
            generate_recommendations(self.context)

        openai_class.assert_not_called()

    @patch.dict(os.environ, {}, clear=True)
    @patch("app.services.recommendations.OpenAI")
    def test_empty_task_context_skips_provider_call(
        self,
        openai_class: MagicMock,
    ) -> None:
        context = {**self.context, "tasks": []}

        self.assertEqual(generate_recommendations(context), [])
        openai_class.assert_not_called()


if __name__ == "__main__":
    unittest.main()
