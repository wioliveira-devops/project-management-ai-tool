import type { ProjectTaskSummary } from '../../types/task'
import { getOverdueTasks } from '../tasks/overdueTasks'
import { getHighPriorityTasks } from '../tasks/highPriorityTasks'

export type ProjectRecommendation = {
  id: string
  title: string
  reason: string
  taskTitles: string[]
}

export function getProjectRecommendations(
  tasks: ProjectTaskSummary[],
): ProjectRecommendation[] {
  const recommendations: ProjectRecommendation[] = []
  const blockedTasks = tasks.filter((task) => task.status === 'blocked')
  const overdueTasks = getOverdueTasks(tasks)
  const urgentTasks = getHighPriorityTasks(tasks).filter((task) => task.priority === 'urgent')
  const unassignedTasks = tasks.filter((task) => task.status !== 'completed' && !task.owner)

  if (blockedTasks.length > 0) {
    recommendations.push({
      id: 'resolve-blockers',
      title: 'Resolve blocked work',
      reason: `Review the blockers and agree on the next step for ${blockedTasks.length === 1 ? 'this task' : 'these tasks'}.`,
      taskTitles: blockedTasks.map((task) => task.title),
    })
  }

  if (overdueTasks.length > 0) {
    recommendations.push({
      id: 'replan-overdue-work',
      title: 'Replan overdue work',
      reason: 'Confirm the remaining effort, update due dates, and communicate any impact to dependent work.',
      taskTitles: overdueTasks.map((task) => task.title),
    })
  }

  if (urgentTasks.length > 0) {
    recommendations.push({
      id: 'protect-urgent-focus',
      title: 'Protect time for urgent items',
      reason: 'Keep urgent work visible in the near-term plan and check for conflicts with other commitments.',
      taskTitles: urgentTasks.map((task) => task.title),
    })
  }

  if (unassignedTasks.length > 0) {
    recommendations.push({
      id: 'assign-owners',
      title: 'Confirm task ownership',
      reason: 'Assign a clear owner so each item has someone responsible for its next update.',
      taskTitles: unassignedTasks.map((task) => task.title),
    })
  }

  return recommendations
}
