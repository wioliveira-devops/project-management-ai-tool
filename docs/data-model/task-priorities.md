# Task Priorities

This document defines the supported task priority levels and their ordering so tasks can be compared consistently.

## Supported priority levels

| Priority | Order | Meaning |
|---|---:|---|
| `must have` | P0 | Requires immediate attention. Delay creates a serious, time-sensitive impact or blocks critical work. |
| `Should have` | P1 | Important and should be addressed ahead of normal work, but does not require immediate action. |
| `Later` | 2 | Normal priority. Handle according to the planned sequence and available capacity. |

A lower order number means a higher priority.

## Validation and comparison rules

- Priority is optional. An omitted or `null` value means the task has not been prioritized.
- When present, priority must match one of the supported lowercase values exactly.
- Do not silently assign a priority when it is missing or invalid.
- Compare tasks by priority order: `urgent`, `high`, `medium`, then `low`.
- Treat tasks with no priority as unprioritized; do not rank them as `medium`.
- Priority describes relative importance. It does not replace task status, due date, or dependency information.

## Example

```json
{
  "task_id": "task-123",
  "task_name": "Resolve a production-blocking issue",
  "status": "in_progress",
  "priority": "Must Have"
}
```