import type { ProjectHealthState } from './projectHealth'

export type ProjectSummary = {
  summary: string
  health_state: ProjectHealthState
  analysis_date: string
  generated_at: string
}
