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
  const totalTasks = tasks.length
  const distributionDescription = statuses
    .map(({ value, label }) => `${label}: ${counts[value]}`)
    .join(', ')

  return (
    <section className="task-status-summary" aria-labelledby="task-status-summary-title">
      <h3 id="task-status-summary-title">Task status summary</h3>
      <div className="task-status-summary-grid">
        {statuses.map(({ value, label }) => (
          <div className={`task-summary-item task-summary-${value}`} key={value}>
            <span className="task-summary-count">{counts[value]}</span>
            <span className="task-summary-label">{label}</span>
          </div>
        ))}
      </div>
      {totalTasks > 0 ? (
        <div
          className="task-summary-chart"
          role="img"
          aria-label={`Task status distribution. ${distributionDescription}.`}
        >
          {statuses.map(({ value }) => (
            <span
              className={`task-summary-chart-segment task-summary-chart-${value}`}
              key={value}
              style={{ width: `${(counts[value] / totalTasks) * 100}%` }}
              aria-hidden="true"
            />
          ))}
        </div>
      ) : (
        <p className="task-summary-empty">No task data to visualize yet.</p>
      )}
    </section>
  )
}
