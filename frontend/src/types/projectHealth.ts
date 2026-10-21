export type ProjectHealthState = 'insufficient' | 'on-track' | 'at-risk' | 'needs-attention'

export interface ProjectHealthIndicators {
  total_tasks: number
  not_started_tasks: number
  completed_tasks: number
  in_progress_tasks: number
  blocked_tasks: number
  overdue_tasks: number
  high_priority_overdue_tasks: number
  approaching_deadline_tasks: number
  tasks_with_incomplete_dependencies: number
  tasks_with_unresolved_dependencies: number
}

export interface ProjectHealthAssessment {
  state: ProjectHealthState
  analysis_date: string
  indicators: ProjectHealthIndicators
}
