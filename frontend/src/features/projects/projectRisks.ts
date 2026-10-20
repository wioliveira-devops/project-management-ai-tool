import type { ProjectTaskSummary } from '../../types/task'
import { getOverdueTasks } from '../tasks/overdueTasks'

export type ProjectRisk = {
  id: string
  task: ProjectTaskSummary
  severity: 'high' | 'medium'
  title: string
  detail: string
}

export function getProjectRisks(tasks: ProjectTaskSummary[]): ProjectRisk[] {
  const overdueIds = new Set(getOverdueTasks(tasks).map((task) => task.id))

  return tasks
    .filter((task) => task.status === 'blocked' || overdueIds.has(task.id))
    .map((task) => {
      const isBlocked = task.status === 'blocked'
      const isOverdue = overdueIds.has(task.id)
      const isHighPriority = task.priority === 'urgent' || task.priority === 'high'
      const severity: ProjectRisk['severity'] =
        isBlocked || (isOverdue && isHighPriority) ? 'high' : 'medium'

      return {
        id: task.id,
        task,
        severity,
        title: isBlocked ? 'Blocked work' : 'Missed task deadline',
        detail: isBlocked
          ? isOverdue
            ? 'This task is blocked and has also passed its due date.'
            : 'This task is blocked and cannot progress until the impediment is resolved.'
          : 'This incomplete task has passed its due date.',
      }
    })
    .sort((first, second) => {
      if (first.severity !== second.severity) {
        return first.severity === 'high' ? -1 : 1
      }

      if (!first.task.due_date && !second.task.due_date) return 0
      if (!first.task.due_date) return 1
      if (!second.task.due_date) return -1
      return first.task.due_date.localeCompare(second.task.due_date)
    })
}
