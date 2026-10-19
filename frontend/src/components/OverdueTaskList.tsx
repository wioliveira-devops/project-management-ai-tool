import { getOverdueTasks } from '../features/tasks/overdueTasks'
import type { ProjectTaskSummary, TaskPriority, TaskStatus } from '../types/task'

type OverdueTaskListProps = {
  tasks: ProjectTaskSummary[]
}

const statusLabels: Record<TaskStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  blocked: 'Blocked',
  completed: 'Completed',
}

const priorityLabels: Record<TaskPriority, string> = {
  urgent: 'Urgent',
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
}

function formatDueDate(value: string | null): string {
  if (!value) return 'No due date'

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

export function OverdueTaskList({ tasks }: OverdueTaskListProps) {
  const overdueTasks = getOverdueTasks(tasks)

  return (
    <section className="attention-card overdue-card" aria-labelledby="overdue-title">
      <div className="attention-heading">
        <div>
          <p className="card-label">Needs attention</p>
          <h2 id="overdue-title">Overdue tasks</h2>
        </div>
        <span className="attention-count">
          {overdueTasks.length} {overdueTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {overdueTasks.length === 0 ? (
        <p className="attention-empty">No overdue tasks.</p>
      ) : (
        <ul className="attention-task-list">
          {overdueTasks.map((task) => (
            <li className="attention-task-item" key={task.id}>
              <div className="attention-task-title-row">
                <h3>{task.title}</h3>
                <span className={`task-status status-${task.status}`}>
                  {statusLabels[task.status]}
                </span>
              </div>
              {task.description && <p className="attention-task-description">{task.description}</p>}
              <div className="attention-task-meta">
                <span className="overdue-due-date">Due {formatDueDate(task.due_date)}</span>
                <span>Owner: {task.owner ?? 'Unassigned'}</span>
                {task.priority && <span>{priorityLabels[task.priority]}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
