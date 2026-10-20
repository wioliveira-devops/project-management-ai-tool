from typing import Any, Literal

RiskSeverity = Literal["low", "medium", "high"]

SEVERITY_BY_RULE: dict[str, RiskSeverity] = {
    "approaching-deadline": "low",
    "incomplete-dependency": "medium",
    "unresolved-dependency": "medium",
    "overdue-task": "medium",
    "high-priority-overdue-task": "high",
}


def assign_risk_severity(signals: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Add the rule-based severity level to each detected signal."""
    return [
        {**signal, "severity": SEVERITY_BY_RULE[signal["rule_id"]]}
        for signal in signals
    ]
