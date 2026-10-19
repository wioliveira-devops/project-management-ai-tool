import type { Project, ProjectStatus } from '../types/project'

type ProjectOverviewProps = {
  project: Project | null
  state: 'loading' | 'ready' | 'error'
  errorMessage: string
  onRetry: () => void
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
  state,
  errorMessage,
  onRetry,
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
    <article className="project-card" aria-labelledby="project-name">
      <div className="project-card-heading">
        <div>
          <p className="card-label">Project details</p>
          <h2 id="project-name">{project.name}</h2>
        </div>
        <span className={`status-badge status-${project.status}`}>
          <span className="status-dot" aria-hidden="true" />
          {statusLabels[project.status]}
        </span>
      </div>

      <p className="project-description">
        {project.description || 'No project description provided.'}
      </p>

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
