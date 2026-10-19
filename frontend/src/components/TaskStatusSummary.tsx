import type { ProjectTaskSummary, TaskStatus } from '../types/task'

type TaskStatusSummaryProps = {
  tasks: ProjectTaskSummary[]
}

const statuses: Array<{ value: TaskStatus; label: string }> = [
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'not_started', label: 'Not started' },
  { value: 'blocked', label: 'Blocked' },
]

export function TaskStatusSummary({ tasks }: TaskStatusSummaryProps) {
  const counts: Record<TaskStatus, number> = {
    not_started: 0,
    in_progress: 0,
    blocked: 0,
    completed: 0,
  }
  tasks.forEach((task) => { counts[task.status] += 1 })

  return (
    <section className="task-status-summary" aria-label="Task status summary">
      {statuses.map(({ value, label }) => (
        <div className={`task-summary-item task-summary-${value}`} key={value}>
          <span className="task-summary-count">{counts[value]}</span>
          <span className="task-summary-label">{label}</span>
        </div>
      ))}
    </section>
  )
}
