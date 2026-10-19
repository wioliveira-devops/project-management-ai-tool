import type { ProjectTaskSummary } from '../../types/task'

type HighPriorityTask = ProjectTaskSummary & { priority: 'urgent' | 'high' }

export function getHighPriorityTasks(tasks: ProjectTaskSummary[]): HighPriorityTask[] {
  return tasks
    .filter(
      (task): task is HighPriorityTask =>
        task.status !== 'completed' &&
        (task.priority === 'urgent' || task.priority === 'high'),
    )
    .sort((first, second) => {
      if (first.priority !== second.priority) {
        return first.priority === 'urgent' ? -1 : 1
      }

      if (!first.due_date && !second.due_date) return 0
      if (!first.due_date) return 1
      if (!second.due_date) return -1
      return first.due_date.localeCompare(second.due_date)
    })
}
