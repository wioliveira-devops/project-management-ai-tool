import { getHighPriorityTasks } from '../features/tasks/highPriorityTasks'
import { getOverdueTasks } from '../features/tasks/overdueTasks'
import type { ProjectTaskSummary, TaskStatus } from '../types/task'

type CriticalItemsListProps = {
  tasks: ProjectTaskSummary[]
}

type CriticalReason = 'overdue' | 'priority'

type CriticalItem = {
  task: ProjectTaskSummary
  reasons: CriticalReason[]
}

const statusLabels: Record<TaskStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  blocked: 'Blocked',
  completed: 'Completed',
}

const reasonLabels: Record<CriticalReason, string> = {
  overdue: 'Overdue',
  priority: 'High priority',
}

function formatDueDate(value: string | null): string {
  if (!value) return 'No due date'

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

function getCriticalItems(tasks: ProjectTaskSummary[]): CriticalItem[] {
  const itemsById = new Map<string, CriticalItem>()

  function addReason(matchingTasks: ProjectTaskSummary[], reason: CriticalReason) {
    for (const task of matchingTasks) {
      const existingItem = itemsById.get(task.id)

      if (existingItem) {
        existingItem.reasons.push(reason)
      } else {
        itemsById.set(task.id, { task, reasons: [reason] })
      }
    }
  }

  addReason(getOverdueTasks(tasks), 'overdue')
  addReason(getHighPriorityTasks(tasks), 'priority')
  const reasonOrder: CriticalReason[] = ['overdue', 'priority']

  return [...itemsById.values()].sort((first, second) => {
    const firstReason = reasonOrder.findIndex((reason) => first.reasons.includes(reason))
    const secondReason = reasonOrder.findIndex((reason) => second.reasons.includes(reason))

    if (firstReason !== secondReason) return firstReason - secondReason
    return (first.task.due_date ?? '').localeCompare(second.task.due_date ?? '')
  })
}

export function CriticalItemsList({ tasks }: CriticalItemsListProps) {
  const criticalItems = getCriticalItems(tasks)

  return (
    <section className="attention-card critical-card" aria-labelledby="critical-items-title">
      <div className="attention-heading">
        <div>
          <p className="card-label">Needs attention</p>
          <h2 id="critical-items-title">Critical items</h2>
        </div>
        <span className="attention-count">
          {criticalItems.length} {criticalItems.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {criticalItems.length === 0 ? (
        <p className="attention-empty">No critical tasks right now.</p>
      ) : (
        <ul className="attention-task-list">
          {criticalItems.map(({ task, reasons }) => (
            <li className="attention-task-item" key={task.id}>
              <div className="critical-task-heading">
                <h3>{task.title}</h3>
                <span className={`task-status status-${task.status}`}>
                  {statusLabels[task.status]}
                </span>
              </div>
              <div className="critical-reasons" aria-label="Reasons this task needs attention">
                {reasons.map((reason) => (
                  <span className={`critical-reason critical-reason-${reason}`} key={reason}>
                    {reasonLabels[reason]}
                  </span>
                ))}
              </div>
              {task.description && <p className="attention-task-description">{task.description}</p>}
              <div className="attention-task-meta">
                <span className={reasons.includes('overdue') ? 'overdue-due-date' : undefined}>
                  {reasons.includes('overdue') ? 'Overdue since' : 'Due'} {formatDueDate(task.due_date)}
                </span>
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
