# Task Dependencies

This document defines how task dependencies are represented and validated.

## Representation and meaning

- Store dependencies in the task’s `dependencies` field as an array of task ID strings.
- Each ID identifies a prerequisite task that must be completed before the dependent task can begin.
- For example, if Task B depends on Task A, Task B’s `dependencies` contains Task A’s ID.
- Dependencies are finish-to-start in the initial data model: a prerequisite must have status `done` before dependent work can begin.
- A task with no dependencies has an empty array.

## Validation rules

- Each dependency ID must be a non-empty ID that exactly matches an existing task ID.
- Task IDs are matched exactly and are case-sensitive.
- A task cannot depend on itself.
- The same dependency ID must not appear more than once in a task’s dependency list.
- Reject a dependency that references a task that does not exist. Do not silently remove or create missing tasks.
- Validate the entire dependency graph whenever dependencies are created or changed. Reject changes that create a direct or indirect cycle.
- A cancelled prerequisite does not satisfy a dependency. Remove or replace that dependency, or cancel the dependent task, before the dependent can proceed.

## Handling invalid or unresolved dependencies

- Reject invalid dependency changes and return a clear validation error identifying the affected task and dependency.
- When importing data with missing or invalid references, flag the record for correction and do not treat the dependency as satisfied.
- A task is blocked from starting while any prerequisite is not `done`.

## Example

Task B depends on Task A:

```json
{
  "task_id": "task-b",
  "task_name": "Implement the feature",
  "dependencies": ["task-a"]
}