import { getHighPriorityTasks } from '../features/tasks/highPriorityTasks'
import type { ProjectTaskSummary, TaskPriority, TaskStatus } from '../types/task'

type HighPriorityTaskListProps = {
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

export function HighPriorityTaskList({ tasks }: HighPriorityTaskListProps) {
  const highPriorityTasks = getHighPriorityTasks(tasks)

  return (
    <section className="attention-card priority-card" aria-labelledby="priority-title">
      <div className="attention-heading">
        <div>
          <p className="card-label">Focus items</p>
          <h2 id="priority-title">High-priority tasks</h2>
        </div>
        <span className="attention-count">
          {highPriorityTasks.length} {highPriorityTasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {highPriorityTasks.length === 0 ? (
        <p className="attention-empty">No open urgent or high-priority tasks.</p>
      ) : (
        <ul className="attention-task-list">
          {highPriorityTasks.map((task) => (
            <li className="attention-task-item" key={task.id}>
              <div className="attention-task-title-row">
                <h3>{task.title}</h3>
                <span className={`task-status status-${task.status}`}>
                  {statusLabels[task.status]}
                </span>
              </div>
              {task.description && <p className="attention-task-description">{task.description}</p>}
              <div className="attention-task-meta">
                <span className={`task-priority priority-${task.priority}`}>
                  {priorityLabels[task.priority]}
                </span>
                <span>Due {formatDueDate(task.due_date)}</span>
                <span>Owner: {task.owner ?? 'Unassigned'}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
