import type { ProjectTaskSummary } from '../../types/task'

function getToday(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getOverdueTasks(tasks: ProjectTaskSummary[]): ProjectTaskSummary[] {
  const today = getToday()

  return tasks
    .filter(
      (task) =>
        task.status !== 'completed' &&
        task.due_date !== null &&
        task.due_date < today,
    )
    .sort((first, second) =>
      (first.due_date ?? '').localeCompare(second.due_date ?? ''),
    )
}
