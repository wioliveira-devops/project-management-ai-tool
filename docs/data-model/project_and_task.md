# Project and Task Data Model

This document defines a consistent representation for projects and their tasks. It specifies attributes, types, validation rules, statuses, priorities, owners, dates, and dependencies.

## Project model

| Attribute | Field | Type | Required? | Meaning and validation |
|---|---|---|---|---|
| Project ID | `project_id` | String | Yes | Stable, unique identifier. It must not change after creation. |
| Project name | `project_name` | String | Yes | Project’s display name. It must contain at least one non-whitespace character. |
| Description | `description` | String | No | Additional information about the project. It may be omitted or empty. |
| Timezone | `timezone` | IANA timezone string or `null` | No | Project timezone used when converting imported timestamps into calendar dates. If set, it must be a valid IANA timezone, such as `America/Sao_Paulo`. |

A project contains zero or more tasks. Each task belongs to exactly one project.

## Task model

| Attribute | Field | Type | Required? | Meaning and validation |
|---|---|---|---|---|
| Task ID | `task_id` | String | Yes | Stable identifier unique within the system. It must not change after creation. |
| Task name | `task_name` | String | Yes | Short task title. It must contain at least one non-whitespace character. |
| Description | `description` | String | No | Additional task detail. It may be omitted or empty. |
| Status | `status` | String | Yes | Task’s lifecycle state. It must match one of the statuses defined below. |
| Priority | `priority` | String or `null` | No | Relative importance. If set, it must match one of the priorities defined below. |
| Owner | `owner` | User ID string or `null` | No | The single user accountable for the task. It must refer to a valid project user. Use `null` when unassigned. |
| Start date | `start_date` | Date string or `null` | No | Planned start date in `YYYY-MM-DD` format. |
| Due date | `due_date` | Date string or `null` | No | Expected completion date in `YYYY-MM-DD` format. |
| Dependencies | `dependencies` | Array of task ID strings | No | Prerequisite tasks that must be completed before this task can begin. Defaults to an empty array. |
| Blocker reason | `blocker_reason` | String or `null` | Conditional | Required when status is `blocked`; explains what prevents progress. |

### General representation rules

- Field names use `snake_case`.
- IDs are stable identifiers, not display names or email addresses.
- Reject invalid values with a clear validation error; do not silently substitute defaults.
- Optional fields that are not set may be omitted or represented as `null`, unless a field’s rules specify otherwise.
- Each task ID must be unique. A task must belong to one project.

## Task statuses

| Status | Meaning |
|---|---|
| `backlog` | Recorded but not yet prepared for work. |
| `ready` | Defined sufficiently to be started when capacity is available. |
| `in_progress` | Work has started and is actively underway. |
| `blocked` | Work cannot continue because of a dependency, decision, access issue, or another impediment. A blocker reason is required. |
| `in_review` | Work is ready for review or validation but has not yet been accepted as complete. |
| `done` | Completion criteria are met and no further work is expected. |
| `cancelled` | The task will not be completed because it is no longer needed or has been intentionally stopped. |

Typical flow:

```text
backlog → ready → in_progress → in_review → done
                         ↕
                      blocked
```

- Return a task from `blocked` to the status it had before it was blocked, usually `in_progress`, once the impediment is resolved.
- Return a task from `in_review` to `in_progress` if review finds more work is needed.
- `done` and `cancelled` are terminal unless the task is explicitly reopened.
- Task status is separate from a GitHub issue’s open or closed state.

## Task priorities

| Priority | Order | Meaning |
|---|---:|---|
| `must_have` | P0 | Requires immediate attention. Delay creates a serious, time-sensitive impact or blocks critical work. |
| `should_have` | P1 | Important and should be addressed ahead of normal work, but does not require immediate action. |
| `later` | P2 | Normal priority. Handle according to the planned sequence and available capacity. |

- P0 is the highest priority; P2 is the lowest.
- Priority is optional. An omitted or `null` value means the task has not been prioritized.
- Do not treat an unprioritized task as `later`.

## Task owners

- A task has zero or one owner in the initial model.
- Store a stable user ID, not a display name or email address.
- An assigned owner must resolve to an active member of the project.
- Use `null` for an unassigned task. Do not use an empty string or a placeholder such as `"unassigned"`.
- If an owner later becomes inactive, preserve the ID for history but do not allow new assignments to that user.

## Dates and timezones

- `start_date` and `due_date` are calendar dates, not timestamps. Use ISO 8601 `YYYY-MM-DD` format without a time or timezone.
- Both dates are optional. An omitted or `null` value means the date is not set.
- Validate that each date is a real calendar date, including leap-year dates.
- If both dates are set, `due_date` must be the same day as or later than `start_date`.
- Reject invalid dates; do not guess, silently correct, or invent a date.
- Date-only values are not converted to or from UTC.
- When importing a timestamp, convert it to the project’s configured timezone before extracting the calendar date.
- If an imported timestamp has no timezone and the project timezone is not set, flag it for resolution rather than guessing.

## Dependencies

- `dependencies` lists the IDs of prerequisite tasks.
- If Task B depends on Task A, Task B’s `dependencies` contains Task A’s ID.
- Dependencies are finish-to-start: every prerequisite must have status `done` before the dependent task can begin.
- Each referenced ID must match an existing task ID exactly; IDs are case-sensitive.
- Reject missing references, duplicate IDs, and self-dependencies.
- Validate the full dependency graph whenever dependencies change. Reject any change that creates a direct or indirect cycle.
- A cancelled prerequisite does not satisfy a dependency. Remove or replace that dependency, or cancel the dependent task, before it can proceed.
- If imported data contains a missing or invalid dependency, flag it for correction and do not treat it as satisfied.

## Example project with tasks

```json
{
  "project_id": "project-001",
  "project_name": "Website Refresh",
  "description": "Redesign and update the company website.",
  "timezone": "America/Sao_Paulo",
  "tasks": [
    {
      "task_id": "task-001",
      "task_name": "Approve page structure",
      "description": "Review and approve the proposed website page structure.",
      "status": "done",
      "priority": "must_have",
      "owner": "user-123",
      "start_date": "2026-10-13",
      "due_date": "2026-10-14",
      "dependencies": []
    },
    {
      "task_id": "task-002",
      "task_name": "Build the landing page",
      "description": "Implement the approved landing page design.",
      "status": "in_progress",
      "priority": "should_have",
      "owner": "user-456",
      "start_date": "2026-10-15",
      "due_date": "2026-10-22",
      "dependencies": ["task-001"]
    },
    {
      "task_id": "task-003",
      "task_name": "Prepare release notes",
      "description": "Summarize the website changes for release.",
      "status": "backlog",
      "priority": null,
      "owner": null,
      "start_date": null,
      "due_date": null,
      "dependencies": ["task-002"]
    }
  ]
}
```

In this example, Task 001 is complete, so Task 002 may proceed. Task 003 cannot begin until Task 002 is complete. Task 003 is unassigned and has no dates or priority set.