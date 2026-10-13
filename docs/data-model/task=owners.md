# Task Owners

This document defines how task owners are represented and how unassigned tasks are handled.

## Ownership model

- A task has **zero or one owner**.
- Multiple owners are not supported in the initial data model.
- If several people contribute, assign one accountable owner. Additional contributors can be modeled separately in the future if needed.

## Representation

| Field | Type | Required? | Meaning and validation |
|---|---|---|---|
| `owner` | User ID string or `null` | No | Stable identifier for the user accountable for the task. When set, it must resolve to a user in the project’s user directory. Use `null` when the task is unassigned. |

- Store a stable user ID, not a display name or email address. Names and email addresses can change and should not be used as identifiers.
- Show the user’s current display name in the interface by looking it up from the user directory.
- A user ID must be unique within the user directory and must not change when the user’s name changes.
- New assignments must reference a valid, active project member.
- If an assigned user later becomes inactive, preserve the existing ID for history, but do not allow new assignments to that user.

## Unassigned tasks

- Represent an unassigned task as `"owner": null`.
- An omitted `owner` field also means unassigned when reading older or partial task data.
- Do not use placeholder values such as `"unassigned"`, an empty string, or a display name.

## Example

```json
{
  "task_id": "task-123",
  "task_name": "Define task owners",
  "owner": "user-123"
}