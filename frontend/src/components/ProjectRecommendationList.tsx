import { useState } from 'react'
import { generateProjectRecommendations } from '../api/projectRecommendations'
import type { Recommendation } from '../types/recommendation'
import type { ProjectTaskSummary } from '../types/task'

type ProjectRecommendationListProps = {
  projectId: string
  tasks: ProjectTaskSummary[]
}

export function ProjectRecommendationList({ projectId, tasks }: ProjectRecommendationListProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleGenerate() {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const result = await generateProjectRecommendations(projectId)
      setRecommendations(result.recommendations)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Recommendations could not be generated.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const tasksById = new Map(tasks.map((task) => [task.id, task.title]))

  return (
    <section className="attention-card recommendation-card" aria-labelledby="recommendation-title">
      <div className="attention-heading">
        <div>
          <p className="card-label">Suggested actions</p>
          <h2 id="recommendation-title">Key recommendations</h2>
        </div>
        <div className="recommendation-controls">
          {recommendations && (
            <span className="attention-count">
              {recommendations.length} {recommendations.length === 1 ? 'suggestion' : 'suggestions'}
            </span>
          )}
          <button type="button" onClick={() => void handleGenerate()} disabled={isLoading}>
            {isLoading ? 'Generating…' : recommendations ? 'Refresh' : 'Generate'}
          </button>
        </div>
      </div>
      <p className="recommendation-scope">
        These AI-generated options are suggestions, not instructions. Review the
        evidence and decide whether any action is right for the project.
      </p>

      {isLoading && <p className="recommendation-message" role="status">Reviewing project data and generating suggestions…</p>}
      {errorMessage && <p className="recommendation-error" role="alert">{errorMessage}</p>}
      {recommendations === null && !isLoading && !errorMessage && (
        <p className="attention-empty">Generate suggestions grounded in the current project data.</p>
      )}
      {recommendations?.length === 0 && !isLoading && (
        <p className="attention-empty">No actionable suggestions are supported by the available project data.</p>
      )}
      {recommendations && recommendations.length > 0 && (
        <ul className="recommendation-list">
          {recommendations.map((recommendation, index) => (
            <li className="recommendation-item" key={`${recommendation.title}-${index}`}>
              <div className="recommendation-heading">
                <span className="recommendation-icon" aria-hidden="true">→</span>
                <div>
                  <h3>{recommendation.title}</h3>
                  <p className="recommendation-action-label">Possible action to consider</p>
                  <p className="recommendation-action">{recommendation.suggested_action}</p>
                </div>
              </div>
              <p className="recommendation-rationale">{recommendation.rationale}</p>
              <p className="recommendation-related-label">Related tasks</p>
              <ul className="recommendation-related-tasks">
                {recommendation.related_task_ids.map((taskId) => (
                  <li key={taskId}>{tasksById.get(taskId) ?? taskId}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
