# Task Dates

This document defines how task start dates and due dates are represented, validated, and interpreted.

## Representation

| Field | Type | Required? | Meaning |
|---|---|---|---|
| `start_date` | Date string or `null` | No | Calendar date when work is planned to begin. |
| `due_date` | Date string or `null` | No | Calendar date by which the task is expected to be complete. |

- Use the ISO 8601 date format `YYYY-MM-DD`, such as `2026-10-20`.
- These fields represent calendar dates, not timestamps. Do not store a time or timezone in either value.
- A due date is inclusive: the task may be completed on that date.

## Timezone expectations

- A date-only value has no timezone and must not be converted to or from UTC.
- When importing a timestamp from another system, convert it to the project’s configured timezone before extracting the calendar date.
- If the source provides a date without a timestamp, preserve that date as supplied.
- If a timestamp has no timezone and the project timezone is unknown, do not guess. Flag it for resolution before converting it to a date.

## Validation and missing values

- Both dates are optional. An omitted or `null` value means the date is not set.
- When present, a date must match `YYYY-MM-DD` and be a real calendar date, including valid leap-year dates.
- If both dates are set, `due_date` must be the same day as or later than `start_date`.
- Reject invalid dates and report which field failed validation. Do not silently correct, reinterpret, or replace an invalid date.
- Do not invent a date when one is missing. Keep the field unset.

## Examples

Dates set:

```json
{
  "task_id": "task-123",
  "start_date": "2026-10-13",
  "due_date": "2026-10-20"
}