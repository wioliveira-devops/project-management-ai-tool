import type { ProjectTaskSummary } from '../../types/task'
import { getOverdueTasks } from '../tasks/overdueTasks'

export type ProjectHealth = {
  state: 'loading' | 'unavailable' | 'insufficient' | 'on-track' | 'at-risk' | 'needs-attention'
  label: string
  detail: string
}

type TaskListState = 'loading' | 'ready' | 'error'

function countLabel(count: number, singular: string): string {
  return `${count} ${singular}${count === 1 ? '' : 's'}`
}

export function getProjectHealth(
  tasks: ProjectTaskSummary[],
  taskState: TaskListState,
): ProjectHealth {
  if (taskState === 'loading') {
    return { state: 'loading', label: 'Calculating', detail: 'Waiting for task data.' }
  }

  if (taskState === 'error') {
    return { state: 'unavailable', label: 'Unavailable', detail: 'Task data could not be loaded.' }
  }

  if (tasks.length === 0) {
    return { state: 'insufficient', label: 'Not enough data', detail: 'Add project tasks to assess health.' }
  }

  const blockedCount = tasks.filter((task) => task.status === 'blocked').length
  const overdueCount = getOverdueTasks(tasks).length

  if (blockedCount > 0) {
    const signals = [
      countLabel(blockedCount, 'blocked task'),
      ...(overdueCount > 0 ? [countLabel(overdueCount, 'overdue task')] : []),
    ]
    return {
      state: 'needs-attention',
      label: 'Needs attention',
      detail: `${signals.join(' and ')} need review.`,
    }
  }

  if (overdueCount > 0) {
    return {
      state: 'at-risk',
      label: 'At risk',
      detail: `${countLabel(overdueCount, 'overdue task')} need review.`,
    }
  }

  return {
    state: 'on-track',
    label: 'On track',
    detail: 'No blocked or overdue tasks found.',
  }
}
