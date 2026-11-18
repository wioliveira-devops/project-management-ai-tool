/** One suggested action linked to the project tasks that support it. */
export interface Recommendation {
  title: string
  suggested_action: string
  rationale: string
  related_task_ids: string[]
}

/** Structured AI recommendation response. */
export interface RecommendationsResponse {
  recommendations: Recommendation[]
}
