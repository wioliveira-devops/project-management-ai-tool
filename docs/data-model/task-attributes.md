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