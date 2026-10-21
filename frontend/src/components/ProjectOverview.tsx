import type { Project, ProjectStatus } from '../types/project'
import type { ProjectHealth } from '../features/projects/projectHealth'

type ProjectOverviewProps = {
  project: Project | null
  health: ProjectHealth
  state: 'loading' | 'ready' | 'error'
  errorMessage: string
  onRetry: () => void
  onRetryHealth: () => void
}

const statusLabels: Record<ProjectStatus, string> = {
  planned: 'Planned',
  active: 'Active',
  on_hold: 'On hold',
  completed: 'Completed',
}

function formatDate(value: string | null): string {
  if (!value) return 'Not set'

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

export function ProjectOverview({
  project,
  health,
  state,
  errorMessage,
  onRetry,
  onRetryHealth,
}: ProjectOverviewProps) {
  if (state === 'loading') {
    return (
      <section className="project-card" aria-busy="true">
        <p role="status">Loading project information…</p>
      </section>
    )
  }

  if (state === 'error' || !project) {
    return (
      <section className="project-card error-card" aria-labelledby="project-error-title">
        <h2 id="project-error-title">Project unavailable</h2>
        <p role="alert">{errorMessage || 'Project information could not be loaded.'}</p>
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      </section>
    )
  }

  return (
    <article className="project-card" aria-label={`${project.name} project details`}>
      <div className="project-card-heading">
        <p className="card-label">Project details</p>
        <span className={`status-badge status-${project.status}`}>
          <span className="status-dot" aria-hidden="true" />
          {statusLabels[project.status]}
        </span>
      </div>

      <p className="project-description">
        {project.description || 'No project description provided.'}
      </p>

      <section className="project-health" aria-labelledby="project-health-title">
        <div className="project-health-heading">
          <p className="card-label" id="project-health-title">Project health</p>
          <span className={`health-badge health-${health.state}`}>
            <span className="status-dot" aria-hidden="true" />
            {health.label}
          </span>
        </div>
        <p className="project-health-detail" role={health.state === 'loading' ? 'status' : undefined}>
          {health.detail}
        </p>
        {health.state === 'unavailable' && (
          <button className="health-retry" type="button" onClick={onRetryHealth}>
            Retry health assessment
          </button>
        )}
      </section>

      <dl className="project-facts">
        <div className="project-fact">
          <dt>Project owner</dt>
          <dd>{project.owner?.name ?? 'Not assigned'}</dd>
          {project.owner?.role && <span className="fact-detail">{project.owner.role}</span>}
        </div>
        <div className="project-fact">
          <dt>Start date</dt>
          <dd>{formatDate(project.start_date)}</dd>
        </div>
        <div className="project-fact">
          <dt>Target end date</dt>
          <dd>{formatDate(project.target_end_date)}</dd>
        </div>
      </dl>
    </article>
  )
}
