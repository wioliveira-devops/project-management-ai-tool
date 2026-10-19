import { getProjectRisks } from '../features/projects/projectRisks'
import type { ProjectRisk } from '../features/projects/projectRisks'
import type { ProjectTaskSummary, TaskPriority, TaskStatus } from '../types/task'

type ProjectRiskListProps = {
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

function RiskItem({ risk }: { risk: ProjectRisk }) {
  return (
    <li className="risk-item">
      <div className="risk-item-heading">
        <div>
          <h3>{risk.title}</h3>
          <p className="risk-task-title">{risk.task.title}</p>
        </div>
        <span className={`risk-severity risk-severity-${risk.severity}`}>
          {risk.severity === 'high' ? 'High severity' : 'Medium severity'}
        </span>
      </div>
      <p className="risk-detail">{risk.detail}</p>
      {risk.task.description && <p className="risk-context">{risk.task.description}</p>}
      <div className="risk-meta">
        <span className={`task-status status-${risk.task.status}`}>
          {statusLabels[risk.task.status]}
        </span>
        <span>Due {formatDueDate(risk.task.due_date)}</span>
        <span>Owner: {risk.task.owner ?? 'Unassigned'}</span>
        {risk.task.priority && <span>{priorityLabels[risk.task.priority]}</span>}
      </div>
    </li>
  )
}

export function ProjectRiskList({ tasks }: ProjectRiskListProps) {
  const risks = getProjectRisks(tasks)

  return (
    <section className="attention-card risk-card" aria-labelledby="risk-title">
      <div className="attention-heading">
        <div>
          <p className="card-label">Risk signals</p>
          <h2 id="risk-title">Identified risks</h2>
        </div>
        <span className="attention-count">
          {risks.length} {risks.length === 1 ? 'risk' : 'risks'}
        </span>
      </div>
      <p className="risk-scope">Based on blocked and overdue task data.</p>

      {risks.length === 0 ? (
        <p className="attention-empty">No current risks identified from available task data.</p>
      ) : (
        <ul className="risk-list">
          {risks.map((risk) => <RiskItem key={risk.id} risk={risk} />)}
        </ul>
      )}
    </section>
  )
}
