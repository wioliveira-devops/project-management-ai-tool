import type { ProjectTaskSummary } from '../../types/task'

export const DEFAULT_DEADLINE_WARNING_WINDOW_DAYS = 7

function getToday(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function addCalendarDays(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number)
  const result = new Date(Date.UTC(year, month - 1, day + days))

  return result.toISOString().slice(0, 10)
}

export function getApproachingDeadlineTasks(
  tasks: ProjectTaskSummary[],
  warningWindowDays = DEFAULT_DEADLINE_WARNING_WINDOW_DAYS,
  today = getToday(),
): ProjectTaskSummary[] {
  if (!Number.isInteger(warningWindowDays) || warningWindowDays < 0) {
    throw new RangeError('warningWindowDays must be a non-negative integer')
  }

  const warningWindowEnd = addCalendarDays(today, warningWindowDays)

  return tasks
    .filter(
      (task) =>
        task.status !== 'completed' &&
        task.due_date !== null &&
        task.due_date >= today &&
        task.due_date <= warningWindowEnd,
    )
    .sort((first, second) =>
      (first.due_date ?? '').localeCompare(second.due_date ?? ''),
    )
}
