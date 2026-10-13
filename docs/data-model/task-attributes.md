# Task Data Attributes

This document defines the initial attributes for a task so project data can be represented and analyzed consistently.

## Attribute definitions

| Attribute | Field name | Type | Required? | Meaning and validation |
|---|---|---|---|---|
| Task ID | `task_id` | String | Yes | Stable identifier unique within the system. It must not change after the task is created. |
| Task name | `task_name` | String | Yes | Short task title. It must contain at least one non-whitespace character. |
| Description | `description` | String | No | Additional detail about the task. It may be omitted or empty. |
| Status | `status` | String | Yes | Current task lifecycle state. Its allowed values are defined in Task 12. Values must match the defined set. |
| Priority | `priority` | String | No | Relative importance of the task. If present, it must match a value defined in Task 13. |
| Owner | `owner` | User reference or `null` | No | Person responsible for the task. If present, it must refer to a valid user. Owner representation is defined in Task 14. |
| Start date | `start_date` | String using `YYYY-MM-DD` | No | Planned date work begins. If present, it must be a valid calendar date. |
| Due date | `due_date` | String using `YYYY-MM-DD` | No | Planned completion date. If present, it must be a valid calendar date. When both dates are set, the due date must not be earlier than the start date. |
| Dependencies | `dependencies` | Array of task ID strings | No | Tasks that this task depends on. Each ID must refer to another task and appear only once. A task cannot depend on itself. Dependency-cycle rules are defined in Task 16. |

## Representation rules

- Field names use `snake_case`.
- Dates represent calendar dates, not timestamps; they do not include a time or timezone.
- Omitted optional values mean “not provided.” An unassigned owner may be represented as `null`.
- Dependencies default to an empty array when none are specified.
- Status and priority values must use the canonical values defined by their respective data-model tasks.

## Example

```json
{
  "task_id": "task-123",
  "task_name": "Define task attributes",
  "description": "Document the initial task fields and their validation rules.",
  "status": "todo",
  "priority": "medium",
  "owner": null,
  "start_date": "2026-10-13",
  "due_date": "2026-10-20",
  "dependencies": []
}

# Task Statuses

This document defines the supported task statuses and the lifecycle used to represent task progress consistently.

## Supported statuses

| Status | Meaning |
|---|---|
| `backlog` | The task is recorded but has not yet been prepared for work. |
| `ready` | The task is sufficiently defined and can be started when capacity is available. |
| `in_progress` | Work on the task has started and is actively underway. |
| `blocked` | Work cannot continue because of a dependency, decision, access issue, or other impediment. The blocker should be documented. |
| `in_review` | The work is complete enough for review or validation, but has not yet been accepted as finished. |
| `done` | The task meets its completion criteria and no further work is expected. |
| `cancelled` | The task will not be completed because it is no longer needed or has been intentionally stopped. |

## Lifecycle

Typical flow:

```text
backlog → ready → in_progress → in_review → done
                         ↕
                      blocked
```

- A task may move from `backlog` to `ready` once its scope and acceptance criteria are clear.
- A task moves to `in_progress` when work begins.
- A task may move to `blocked` whenever an impediment prevents progress. Record the reason for the block.
- When the impediment is resolved, return the task to the status it had before becoming blocked, usually `in_progress`.
- A task may move from `in_progress` to `in_review` when it is ready for review or validation.
- If review finds more work is needed, return the task to `in_progress`.
- Move a task to `done` only when its completion criteria are met.
- A task may move to `cancelled` from any status if the work is no longer required.
- Reopen a `done` or `cancelled` task only through an explicit decision; return it to `ready` or `backlog` as appropriate.

## Validation rules

- `status` is required for every task.
- Store status using the exact lowercase values listed above.
- Reject values that are not in the supported set; do not silently substitute a default.
- A task marked `blocked` must have a recorded blocker reason.
- A task marked `done` must satisfy its completion criteria.
- `done` and `cancelled` are terminal statuses unless the task is explicitly reopened.
- Task status represents work progress and is independent of a GitHub issue’s open or closed state. If the system imports issues, it must use an explicit mapping rather than treating those states as interchangeable.

## Example

```json
{
  "task_id": "task-123",
  "task_name": "Define task attributes",
  "status": "in_progress"
}
```
}
