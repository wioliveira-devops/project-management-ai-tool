import type { ProjectTaskSummary, TaskStatus } from '../types/task'
import { getCompletedTaskCount } from '../features/tasks/completedTasks'
import { getPendingTaskCount } from '../features/tasks/pendingTasks'
import { getTotalTaskCount } from '../features/tasks/totalTasks'

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
    completed: getCompletedTaskCount(tasks),
  }
  tasks.forEach((task) => {
    if (task.status !== 'completed') counts[task.status] += 1
  })
  const totalTasks = getTotalTaskCount(tasks)
  const pendingTasks = getPendingTaskCount(tasks)
  const distributionDescription = statuses
    .map(({ value, label }) => `${label}: ${counts[value]}`)
    .join(', ')

  return (
    <section className="task-status-summary" aria-labelledby="task-status-summary-title">
      <h3 id="task-status-summary-title">Task status summary</h3>
      <div className="task-status-summary-grid">
        <div className="task-summary-item">
          <span className="task-summary-count">{pendingTasks}</span>
          <span className="task-summary-label">Pending</span>
        </div>
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
