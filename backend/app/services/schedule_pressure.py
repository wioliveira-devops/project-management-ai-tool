from datetime import date, timedelta
from typing import Any


def detect_schedule_pressure(
    tasks: list[dict[str, Any]], analysis_date: date
) -> list[dict[str, Any]]:
    """Find unfinished tasks due from today through seven calendar days out."""
    window_end = analysis_date + timedelta(days=7)
    signals = []

    for task in tasks:
        due_date = task.get("due_date")
        if task.get("status") == "completed" or due_date is None:
            continue

        parsed_due_date = (
            due_date if isinstance(due_date, date) else date.fromisoformat(due_date)
        )
        if analysis_date <= parsed_due_date <= window_end:
            signals.append(
                {
                    "rule_id": "approaching-deadline",
                    "task_id": task["id"],
                    "due_date": parsed_due_date,
                    "analysis_date": analysis_date,
                }
            )

    return signals
