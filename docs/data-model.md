# Initial Data Contracts

This document records the first project and task data shapes for the MVP. They follow the documented scope in `project-definition.md` and `architecture.md`. They are API/data-validation contracts only; they do not create database tables or persistence behavior.

## Project

| Field | Type | Meaning |
|---|---|---|
| `id` | non-empty string | Stable project identifier |
| `name` | string | Project name |
| `status` | `planned`, `active`, `on_hold`, or `completed` | Current project lifecycle status |
| `start_date` | date or `null` | Planned or actual start date |
| `due_date` | date or `null` | Target project completion date |

## Task

| Field | Type | Meaning |
|---|---|---|
| `id` | non-empty string | Stable task identifier |
| `project_id` | non-empty string | Identifier of the parent project |
| `title` | string | Short task name |
| `status` | `not_started`, `in_progress`, `blocked`, or `completed` | Current task state |
| `priority` | `low`, `medium`, or `high` | Relative task priority |
| `start_date` | date or `null` | Planned or actual task start date |
| `due_date` | date or `null` | Target task completion date |
| `owner` | string or `null` | Task owner when known |

Dates use ISO 8601 calendar dates (`YYYY-MM-DD`) in JSON. The Python schemas use `date`; the TypeScript contracts use strings for these serialized values. Optional dates and task owners are represented as `null` so the frontend and backend wire contracts stay consistent. A due date cannot precede a start date. Unknown fields and invalid status or priority values are rejected by the backend schemas.

## Source locations

- TypeScript contracts: `frontend/src/types/project.ts` and `frontend/src/types/task.ts`.
- Python validation schemas: `backend/app/schemas/project.py` and `backend/app/schemas/task.py`.

Risk, milestone, dependency, user, and database models are intentionally not included until their fields and behavior are required by a later task.
