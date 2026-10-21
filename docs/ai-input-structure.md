# AI insights input structure

This document defines the validated backend contract for project context that
can be supplied to an AI insights service. It is a data contract only; it does
not call an AI provider or add an API endpoint.

## Top-level shape

The payload has three parts. The selection keeps task and project facts that
help explain status, schedule, dependencies, and detected risks:

| Field | Shape | Purpose |
|---|---|---|
| `project` | Project context object | Identifies the project and provides its description, lifecycle status, and dates. |
| `tasks` | Array of task context objects | Provides task descriptions, status, priority, due date, dependencies, and deterministic risk signals. |
| `analysis` | Project health assessment | Provides the deterministic health state, analysis date, and supporting indicator counts. |

## Selected fields

| Context | Included fields | Reason |
|---|---|---|
| Project | `id`, `name`, `description`, `status`, `start_date`, `target_end_date` | Identifies the project and gives its goal, lifecycle state, and schedule context. |
| Task | `id`, `title`, `description`, `status`, `priority`, `due_date`, `risk_signals`, `dependencies` | Explains each task's work, progress, urgency, timing, detected concerns, and prerequisite relationships. |
| Analysis | `state`, `analysis_date`, and all indicator counts | Supplies a reproducible summary calculated from task data. |

Project owner details, task owner names, repeated task `project_id` values,
task start dates, raw `depends_on` ID arrays (resolved dependency references
are used instead), unrecognized internal fields, and frontend or storage
metadata are left out because they are not needed to interpret these project
health signals. Credentials and provider configuration are never part of the
project or task context.
The selection is implemented by `select_ai_insights_input` in
`backend/app/services/ai_input.py`; the selected data is validated against the
dedicated context schemas before it is returned.
The allowlists are `PROJECT_CONTEXT_FIELDS` and `TASK_CONTEXT_FIELDS`. The
context schemas reject unknown fields, so adding a source field does not
automatically add it to the AI payload.

## Validation

Before serialization, the input schema rejects unknown fields, invalid project
or task statuses, unsupported priorities, malformed dates, blank identifiers,
and invalid risk signal shapes. It also checks that project dates are ordered,
task IDs and dependency references are unique, risk signals refer to their
containing task and the same analysis date, and risk dates or priority agree
with the task context. The task status counts and total task count in the
analysis must match the tasks included in the payload. Dependency titles must
match included tasks when those tasks are present; unresolved references can
remain represented explicitly.

## Preparation flow

`prepare_ai_insights_input` in `backend/app/services/ai_input.py` assembles the
ready-to-serialize payload for a project:

1. Keep only tasks whose `project_id` matches the project.
2. Resolve dependency IDs to task titles, retaining an explicit placeholder
   when a dependency points to a missing task.
3. Calculate overdue, schedule-pressure, and dependency risk signals using the
   supplied analysis date, then assign their deterministic severities.
4. Calculate project health and its indicators using that same analysis date.
5. Select the fields described above, validate the complete payload, and
   serialize dates as ISO 8601 strings.

The function accepts project data, the available task records, and an explicit
analysis date. It does not read storage or make a provider request, so callers
can control data access and reproduce the same prepared payload for a given
date.

The Python contract is `AIInsightsInputSchema` in
`backend/app/schemas/ai_input.py`. It uses dedicated project and task context
schemas and the existing project health assessment schema. Unknown fields are
rejected at the top level and by the nested schemas.

## Example

```json
{
  "project": {
    "id": "sample-customer-portal-modernization",
    "name": "Customer Portal Modernization",
    "description": "Redesign the customer self-service portal.",
    "status": "active",
    "start_date": "2026-09-01",
    "target_end_date": "2026-12-18"
  },
  "tasks": [
    {
      "id": "task-design-account-overview",
      "title": "Design the accessible account overview",
      "description": "Prepare responsive designs for the account overview.",
      "status": "in_progress",
      "priority": "high",
      "due_date": "2026-10-30",
      "risk_signals": [],
      "dependencies": [
        {
          "id": "task-define-portal-navigation",
          "title": "Define portal navigation and content structure"
        }
      ]
    }
  ],
  "analysis": {
    "state": "at-risk",
    "analysis_date": "2026-10-21",
    "indicators": {
      "total_tasks": 8,
      "not_started_tasks": 4,
      "completed_tasks": 2,
      "in_progress_tasks": 2,
      "blocked_tasks": 0,
      "overdue_tasks": 1,
      "high_priority_overdue_tasks": 0,
      "approaching_deadline_tasks": 1,
      "tasks_with_incomplete_dependencies": 0,
      "tasks_with_unresolved_dependencies": 0
    }
  }
}
```

Dates serialize as ISO 8601 calendar dates (`YYYY-MM-DD`). The analysis is
deterministic and is included with its analysis date so an AI interpretation
can be traced to the calculations and project context it received. AI
interpretations and recommendations remain distinct from these source values.

The input contract does not include credentials, frontend state, or database
details. This selection step minimizes the payload to the context currently
needed for project insights; later preparation and validation steps can further
constrain it for a specific analysis request.
