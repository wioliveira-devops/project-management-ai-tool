# Project health calculation

Project health is a deterministic summary of task data for one project. The
calculation has two steps: count the project's health indicators, then apply the
classification rules below. It does not use AI, weighted scores, or project
status fields.

Indicator definitions and counting details are maintained in
[`project-health-indicators.md`](project-health-indicators.md). The underlying
task risk signal definitions are in [`initial-risk-rules.md`](initial-risk-rules.md).

## Classification rules

Rules are evaluated in order. The first matching row determines the project
health state, so a higher-priority state takes precedence when a project has
several indicators.

| Priority | State | Condition |
|---|---|---|
| 1 | `insufficient` | The project has no tasks (`total_tasks` is zero). |
| 2 | `needs-attention` | At least one task is blocked, at least one task has an unresolved dependency, or at least one high-priority task is overdue. |
| 3 | `at-risk` | At least one task is overdue, at least one task is approaching its deadline, or at least one task has an incomplete dependency. |
| 4 | `on-track` | The project has tasks and none of the conditions above match. |

`high_priority_overdue_tasks` is a subset of `overdue_tasks`. Therefore any
high-priority overdue task produces `needs-attention`, even though it also
contributes to the general overdue count. Indicators are supporting counts and
can overlap; they are not added into a score. For example, a blocked task may
also be overdue and have an incomplete dependency.

## Analysis date and reproducibility

The API calculates health against the current server calendar date. That date
is included in the response as `analysis_date`. Date-based indicators compare
task due dates with this value. The service accepts the date explicitly so the
same task data and analysis date produce the same indicators and state.

## API response

`GET /api/projects/{project_id}/analysis` returns the calculated state, its
analysis date, and all supporting indicator counts:

```json
{
  "state": "at-risk",
  "analysis_date": "2026-10-21",
  "indicators": {
    "total_tasks": 7,
    "not_started_tasks": 2,
    "completed_tasks": 1,
    "in_progress_tasks": 4,
    "blocked_tasks": 0,
    "overdue_tasks": 1,
    "high_priority_overdue_tasks": 0,
    "approaching_deadline_tasks": 1,
    "tasks_with_incomplete_dependencies": 0,
    "tasks_with_unresolved_dependencies": 0
  }
}
```

An unknown project ID returns `404`. A project with no tasks returns
`insufficient` and zero-valued indicators. The frontend displays the returned
classification and uses the indicator counts to explain the active concerns.

## Implementation locations

- Indicator collection: `backend/app/services/project_health_indicators.py`
- State rules: `backend/app/services/project_health_rules.py`
- Combined assessment: `backend/app/services/project_health_assessment.py`
- HTTP route and response schema: `backend/app/api/analysis.py` and
  `backend/app/schemas/project_health.py`
