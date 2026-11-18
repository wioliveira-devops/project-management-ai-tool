# AI Recommendation Format

This document defines the structured response contract for recommendations
generated from project analysis. Recommendations are suggestions for a Project
Manager to review; they are not verified facts or commands to change project
data.

## Response shape

Return an object with a `recommendations` array containing zero to five items.
An empty array means the supplied context does not support an actionable
recommendation.

| Field | Type | Meaning |
|---|---|---|
| `title` | non-empty string, at most 120 characters | Short label for the suggested action. |
| `suggested_action` | non-empty string, at most 500 characters | A concrete action the Project Manager may consider. |
| `rationale` | non-empty string, at most 500 characters | Why the action may help, based on supplied project information. |
| `related_task_ids` | array of 1 to 20 unique, non-empty task IDs | Tasks in the supplied project context that support the recommendation. |

Example:

```json
{
  "recommendations": [
    {
      "title": "Review the overdue design work",
      "suggested_action": "Consider confirming the remaining effort with the owner and updating the plan.",
      "rationale": "The task is past its due date and remains incomplete.",
      "related_task_ids": ["task-design-account-overview"]
    }
  ]
}
```

## Validation and boundaries

- Reject unknown fields, blank text, out-of-range lengths, more than five
  recommendations, duplicate task IDs, and references to tasks absent from the
  supplied context.
- Keep the action and rationale separate so the user can review both what is
  suggested and which evidence supports it.
- Do not include project facts as recommendation fields or claim that a
  suggested action has already happened.
- The response contract is implemented by `RecommendationsResponseSchema` and
  `validate_recommendations` in `backend/app/schemas/recommendation.py`.
- The matching frontend wire types are in
  `frontend/src/types/recommendation.ts`.
