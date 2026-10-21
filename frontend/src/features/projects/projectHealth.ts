import type { ProjectHealthAssessment, ProjectHealthState } from '../../types/projectHealth'

export type ProjectHealth = {
  state: 'loading' | 'unavailable' | 'insufficient' | 'on-track' | 'at-risk' | 'needs-attention'
  label: string
  detail: string
}

type AssessmentRequestState = 'loading' | 'ready' | 'error'

const healthLabels: Record<ProjectHealthState, string> = {
  insufficient: 'Not enough data',
  'on-track': 'On track',
  'at-risk': 'At risk',
  'needs-attention': 'Needs attention',
}

export function getProjectHealth(
  assessment: ProjectHealthAssessment | null,
  requestState: AssessmentRequestState,
): ProjectHealth {
  if (requestState === 'loading') {
    return { state: 'loading', label: 'Calculating', detail: 'Waiting for task data.' }
  }

  if (requestState === 'error' || !assessment) {
    return { state: 'unavailable', label: 'Unavailable', detail: 'Project health could not be calculated.' }
  }

  const { indicators, state } = assessment
  const label = healthLabels[state]

  if (state === 'insufficient') {
    return { state, label, detail: 'Add project tasks to assess health.' }
  }

  if (state === 'on-track') {
    return { state, label, detail: 'No blocking health indicators were found.' }
  }

  const concerns = [
    indicators.blocked_tasks > 0 && `${indicators.blocked_tasks} blocked`,
    indicators.high_priority_overdue_tasks > 0
      && `${indicators.high_priority_overdue_tasks} high-priority overdue`,
    indicators.overdue_tasks > 0 && `${indicators.overdue_tasks} overdue`,
    indicators.approaching_deadline_tasks > 0
      && `${indicators.approaching_deadline_tasks} approaching deadline`,
    indicators.tasks_with_unresolved_dependencies > 0
      && `${indicators.tasks_with_unresolved_dependencies} with unresolved dependencies`,
    indicators.tasks_with_incomplete_dependencies > 0
      && `${indicators.tasks_with_incomplete_dependencies} with incomplete dependencies`,
  ].filter(Boolean)

  return {
    state,
    label,
    detail: `${concerns.join(', ')}. Review these project health indicators.`,
  }
}
