# Project health indicators

The health indicator collector reports counts from the tasks belonging to one
project. It does not assign an overall health state or severity; those rules
belong to the health calculation step.

| Indicator | Definition |
|---|---|
| `total_tasks` | All tasks in the project. |
| `not_started_tasks` | Tasks whose status is `not_started`. |
| `completed_tasks` | Tasks whose status is `completed`. |
| `in_progress_tasks` | Tasks whose status is `in_progress`. |
| `blocked_tasks` | Tasks whose status is `blocked`. |
| `overdue_tasks` | Non-completed tasks with a due date earlier than the analysis date. |
| `high_priority_overdue_tasks` | Overdue tasks with `high` or `urgent` priority. |
| `approaching_deadline_tasks` | Non-completed tasks due from the analysis date through seven calendar days later, inclusive. |
| `tasks_with_incomplete_dependencies` | Non-completed tasks with at least one prerequisite that is not completed. |
| `tasks_with_unresolved_dependencies` | Non-completed tasks with at least one prerequisite ID not found in the project. |

Indicators count affected tasks, not individual risk signals or prerequisite
links. A task may contribute to multiple indicators; for example, a blocked
task can also be overdue. Missing due dates do not count as overdue or as
approaching a deadline. Completed tasks are excluded from the date and
dependency indicators.

The collector receives an explicit analysis date so its results are
deterministic and can be reproduced. It reuses the task risk detectors for
date and dependency definitions rather than maintaining duplicate rules.
