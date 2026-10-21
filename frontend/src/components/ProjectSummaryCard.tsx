import { useState } from 'react'
import { generateProjectSummary } from '../api/projectSummary'
import type { ProjectSummary } from '../types/projectSummary'

type ProjectSummaryCardProps = {
  projectId: string
}

export function ProjectSummaryCard({ projectId }: ProjectSummaryCardProps) {
  const [summary, setSummary] = useState<ProjectSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleGenerate() {
    setIsLoading(true)
    setErrorMessage('')
    try {
      setSummary(await generateProjectSummary(projectId))
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'The project summary could not be generated.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="summary-card" aria-labelledby="project-summary-title">
      <div className="summary-heading">
        <div>
          <p className="card-label">AI insight</p>
          <h2 id="project-summary-title">Project summary</h2>
        </div>
        <button type="button" onClick={() => void handleGenerate()} disabled={isLoading}>
          {isLoading ? 'Generating…' : summary ? 'Refresh summary' : 'Generate summary'}
        </button>
      </div>
      {!summary && !isLoading && !errorMessage && (
        <p className="summary-placeholder">
          Get a concise readout of project progress and the main areas to watch.
        </p>
      )}
      {isLoading && <p className="summary-message" role="status">Reviewing project data and generating a summary…</p>}
      {errorMessage && <p className="summary-error" role="alert">{errorMessage}</p>}
      {summary && !isLoading && (
        <>
          <p className="summary-text">{summary.summary}</p>
          <p className="summary-meta">
            AI-generated from project data as of{' '}
            {new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' }).format(
              new Date(`${summary.analysis_date}T00:00:00Z`),
            )}. Review the source project data before acting on this summary.
          </p>
        </>
      )}
    </section>
  )
}
