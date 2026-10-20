from datetime import date
from typing import Any


def detect_overdue_tasks(
    tasks: list[dict[str, Any]], analysis_date: date
) -> list[dict[str, Any]]:
    """Return overdue signals with the source values that triggered them."""
    signals = []

    for task in tasks:
        due_date = task.get("due_date")
        if task.get("status") == "completed" or due_date is None:
            continue

        parsed_due_date = due_date if isinstance(due_date, date) else date.fromisoformat(due_date)
        if parsed_due_date >= analysis_date:
            continue

        evidence = {
            "task_id": task["id"],
            "due_date": parsed_due_date,
            "analysis_date": analysis_date,
        }
        signals.append({"rule_id": "overdue-task", **evidence})

        if task.get("priority") in {"high", "urgent"}:
            signals.append(
                {
                    "rule_id": "high-priority-overdue-task",
                    "priority": task["priority"],
                    **evidence,
                }
            )

    return signals
