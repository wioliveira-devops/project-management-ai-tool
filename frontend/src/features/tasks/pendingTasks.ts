import type { ProjectTaskSummary } from '../../types/task'

export function getPendingTaskCount(tasks: readonly ProjectTaskSummary[]): number {
  return tasks.filter((task) => task.status !== 'completed').length
}
