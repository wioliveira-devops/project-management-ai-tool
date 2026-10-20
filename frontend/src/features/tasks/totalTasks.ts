import type { ProjectTaskSummary } from '../../types/task'

export function getTotalTaskCount(tasks: readonly ProjectTaskSummary[]): number {
  return tasks.length
}
