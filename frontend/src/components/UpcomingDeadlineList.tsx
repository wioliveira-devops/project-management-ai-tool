import { getApproachingDeadlineTasks } from '../features/tasks/approachingDeadlines'
import type { ProjectTaskSummary, TaskStatus } from '../types/task'

type UpcomingDeadlineListProps = {
  tasks: ProjectTaskSummary[]
}

const statusLabels: Record<TaskStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  blocked: 'Blocked',
  completed: 'Completed',
}

function formatDueDate(value: string | null): string {
  if (!value) return 'No due date'

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

export function UpcomingDeadlineList({ tasks }: UpcomingDeadlineListProps) {
  const upcomingTasks = getApproachingDeadlineTasks(tasks)

  return (
    <section className="attention-card deadline-card" aria-labelledby="upcoming-deadlines-title">
      <div className="attention-heading">
        <div>
          <p className="card-label">Next seven days</p>
          <h2 id="upcoming-deadlines-title">Upcoming deadlines</h2>
        </div>
        <span className="attention-count">
          {upcomingTasks.length} {upcomingTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {upcomingTasks.length === 0 ? (
        <p className="attention-empty">No deadlines in the next seven days.</p>
      ) : (
        <ul className="attention-task-list">
          {upcomingTasks.map((task) => (
            <li className="attention-task-item" key={task.id}>
              <div className="attention-task-title-row">
                <h3>{task.title}</h3>
                <span className={`task-status status-${task.status}`}>
                  {statusLabels[task.status]}
                </span>
              </div>
              <div className="attention-task-meta">
                <span>Due {formatDueDate(task.due_date)}</span>
                <span>Owner: {task.owner ?? 'Unassigned'}</span>
                <a
                  className="critical-task-link"
                  href={`#task-${encodeURIComponent(task.id)}`}
                  aria-label={`View ${task.title} in the project plan`}
                >
                  View task in project plan
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
