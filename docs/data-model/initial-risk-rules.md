# Initial Project Risk Rules

This document defines the first deterministic risk signals for project task data. Rules use the task fields already available to the application and must remain explainable from those fields. They do not estimate probability or use AI.

## Evaluation conventions

- Evaluate date-based rules against one analysis date, using ISO calendar dates (`YYYY-MM-DD`). A task due on the analysis date is not overdue.
- A task is complete only when its status is `completed`. Completed tasks do not produce active schedule or dependency risks.
- A rule produces a risk signal with the rule identifier, affected task ID, and the source values that caused it to match. Keep distinct matching rules as distinct signals, even when they affect the same task.
- Missing optional values do not satisfy a rule. Do not infer dates, priorities, or dependency completion from absent data.

## Initial rules

| ID | Risk signal | Trigger | Exclusions and evidence |
|---|---|---|---|
| `blocked-work` | Blocked work | Task status is `blocked`. | Evidence is the task status. This signal applies even when the task has no due date or listed dependency. |
| `overdue-task` | Overdue task | Task is not completed and its due date is earlier than the analysis date. | A missing due date does not match. Include the due date and analysis date as evidence. |
| `high-priority-overdue-task` | High-priority overdue task | The task matches `overdue-task` and its priority is `high` or `urgent`. | This is an additional signal for the overdue task, not a replacement for `overdue-task`. Missing or lower priority does not match. |
| `incomplete-dependency` | Incomplete prerequisite | A non-completed task depends on a task in the same project whose status is not `completed`. | Include the dependent task and each incomplete prerequisite. A missing dependency reference is invalid input and should be surfaced for correction rather than treated as a completed prerequisite. |
| `unresolved-dependency` | Unresolved prerequisite | A non-completed task references a dependency ID that cannot be resolved to a task in the same project. | This is a data-quality concern. Include the missing dependency ID; do not invent task details. |
| `approaching-deadline` | Approaching deadline | A non-completed task has a due date from the analysis date through the next 7 calendar days, inclusive. | A missing due date does not match. This signal records schedule pressure from an imminent deadline; it does not claim the task will be late. |

## Severity and presentation

Assign severity separately from detection so triggers can be refined without changing the severity policy. The initial deterministic mapping is:

| Signal | Severity | Rationale |
|---|---|---|
| `high-priority-overdue-task` | High | A high or urgent task is already past due. |
| `overdue-task` | Medium | Work is past due, but its priority is not high or urgent. |
| `incomplete-dependency` | Medium | A prerequisite is unfinished and may prevent dependent work from starting. |
| `unresolved-dependency` | Medium | A prerequisite reference cannot be resolved and needs data correction. |
| `approaching-deadline` | Low | A due date is near; the signal alone does not establish that work is late. |

Severity is a prioritization aid, not a probability or a complete project-health score. A task can have multiple separate signals, each with its own severity.

The existing dashboard may continue to show its current blocked and overdue summaries while the remaining signals are implemented. New rule detections should remain deterministic and should not require an AI service.

## Boundaries

- This rule set covers task-level indicators only; it does not calculate project completion forecasts or milestone slippage.
- Dependency evaluation requires dependency IDs and task statuses from the same project analysis input.
- Schedule pressure uses the fixed 7-calendar-day window above; it does not account for working days, holidays, capacity, or task duration.
- Keep the task schema and dependency validation rules in `data-model.md` and `task-dependencies.md` authoritative for accepted input values.
