import type { ProjectTaskSummary, TaskPriority, TaskStatus } from '../types/task'
import { TaskStatusSummary } from './TaskStatusSummary'

type ProjectTaskListProps = {
  tasks: ProjectTaskSummary[]
  state: 'loading' | 'ready' | 'error'
  errorMessage: string
  onRetry: () => void
}

const statusLabels: Record<TaskStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  blocked: 'Blocked',
  completed: 'Completed',
}

const taskStatusOrder: TaskStatus[] = [
  'not_started',
  'in_progress',
  'blocked',
  'completed',
]

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

export function ProjectTaskList({
  tasks,
  state,
  errorMessage,
  onRetry,
}: ProjectTaskListProps) {
  const totalTaskCount = tasks.length
  const tasksByStatus = taskStatusOrder.map((status) => ({
    status,
    tasks: tasks.filter((task) => task.status === status),
  }))

  return (
    <section className="task-list-card" aria-labelledby="task-list-title">
      <div className="task-list-heading">
        <div>
          <p className="card-label">Project plan</p>
          <h2 id="task-list-title">Tasks</h2>
        </div>
        {state === 'ready' && (
          <span className="task-count" aria-label={`${totalTaskCount} total ${totalTaskCount === 1 ? 'task' : 'tasks'}`}>
            Total: {totalTaskCount}
          </span>
        )}
      </div>

      {state === 'ready' && (
        <TaskStatusSummary tasks={tasks} />
      )}

      {state === 'loading' && (
        <p className="task-list-message" role="status">
          Loading tasks…
        </p>
      )}

      {state === 'error' && (
        <div className="task-list-message task-list-error">
          <p role="alert">{errorMessage}</p>
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        </div>
      )}

      {state === 'ready' && tasks.length === 0 && (
        <p className="task-list-message">There are no tasks in this project yet.</p>
      )}

      {state === 'ready' && tasks.length > 0 && (
        <div className="task-status-groups">
          {tasksByStatus.filter(({ tasks: groupedTasks }) => groupedTasks.length > 0).map(({ status, tasks: groupedTasks }) => (
            <section className="task-status-group" key={status} aria-labelledby={`task-group-${status}`}>
              <div className="task-status-group-heading">
                <h3 id={`task-group-${status}`}>{statusLabels[status]}</h3>
                <span className={`task-status status-${status}`}>{groupedTasks.length}</span>
              </div>
              <ul className="task-list">
                {groupedTasks.map((task) => (
                  <li className="task-list-item" key={task.id}>
                    <span className="task-list-icon" aria-hidden="true">○</span>
                    <div className="task-list-content">
                      <div className="task-list-item-heading">
                        <h4>{task.title}</h4>
                        <span className={`task-priority priority-${task.priority ?? 'unset'}`}>
                          {task.priority ? priorityLabels[task.priority] : 'Priority not set'}
                        </span>
                      </div>
                      {task.description && <p>{task.description}</p>}
                      <div className="task-meta">
                        <p className="task-meta-item">
                          <span>Owner</span>
                          <span>{task.owner ?? 'Unassigned'}</span>
                        </p>
                        <p className="task-meta-item">
                          <span>Due date</span>
                          <span>{formatDueDate(task.due_date)}</span>
                        </p>
                      </div>
                      {task.dependencies.length > 0 && (
                        <div className="task-dependencies">
                          <p className="task-dependencies-label">Depends on</p>
                          <ul>
                            {task.dependencies.map((dependency) => (
                              <li key={dependency.id}>{dependency.title}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  )
}
