from typing import Any


def detect_dependency_concerns(tasks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Find incomplete and unresolved prerequisites within a project's tasks."""
    tasks_by_id = {task["id"]: task for task in tasks}
    signals = []

    for task in tasks:
        if task.get("status") == "completed":
            continue

        # Sample data currently uses `depends_on`; accept the documented
        # `dependencies` field as well so imported records use the same rule.
        dependency_ids = task.get("dependencies", task.get("depends_on", [])) or []
        incomplete_prerequisites = []
        unresolved_dependency_ids = []

        for dependency_id in dependency_ids:
            prerequisite = tasks_by_id.get(dependency_id)
            if prerequisite is None:
                unresolved_dependency_ids.append(dependency_id)
            elif prerequisite.get("status") != "completed":
                incomplete_prerequisites.append(
                    {"task_id": dependency_id, "status": prerequisite.get("status")}
                )

        if incomplete_prerequisites:
            signals.append(
                {
                    "rule_id": "incomplete-dependency",
                    "task_id": task["id"],
                    "prerequisites": incomplete_prerequisites,
                }
            )

        if unresolved_dependency_ids:
            signals.append(
                {
                    "rule_id": "unresolved-dependency",
                    "task_id": task["id"],
                    "dependency_ids": unresolved_dependency_ids,
                }
            )

    return signals
