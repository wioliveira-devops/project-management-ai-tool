import { getProjectRecommendations } from '../features/projects/projectRecommendations'
import type { ProjectTaskSummary } from '../types/task'

type ProjectRecommendationListProps = {
  tasks: ProjectTaskSummary[]
}

export function ProjectRecommendationList({ tasks }: ProjectRecommendationListProps) {
  const recommendations = getProjectRecommendations(tasks)

  return (
    <section className="attention-card recommendation-card" aria-labelledby="recommendation-title">
      <div className="attention-heading">
        <div>
          <p className="card-label">Suggested actions</p>
          <h2 id="recommendation-title">Key recommendations</h2>
        </div>
        <span className="attention-count">
          {recommendations.length} {recommendations.length === 1 ? 'suggestion' : 'suggestions'}
        </span>
      </div>
      <p className="recommendation-scope">Suggestions based on current task status, priority, due dates, and ownership.</p>

      {recommendations.length === 0 ? (
        <p className="attention-empty">No immediate suggestions from the available task data. Continue reviewing progress as work changes.</p>
      ) : (
        <ul className="recommendation-list">
          {recommendations.map((recommendation) => (
            <li className="recommendation-item" key={recommendation.id}>
              <div className="recommendation-heading">
                <span className="recommendation-icon" aria-hidden="true">→</span>
                <div>
                  <h3>{recommendation.title}</h3>
                  <p>{recommendation.reason}</p>
                </div>
              </div>
              <p className="recommendation-related-label">Related tasks</p>
              <ul className="recommendation-related-tasks">
                {recommendation.taskTitles.map((title) => <li key={title}>{title}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
