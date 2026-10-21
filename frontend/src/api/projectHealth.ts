import type { ProjectHealthAssessment } from '../types/projectHealth'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export async function getProjectHealth(projectId: string): Promise<ProjectHealthAssessment> {
  const response = await fetch(`${apiBaseUrl}/api/projects/${projectId}/analysis`)

  if (!response.ok) {
    throw new Error(`Project health request failed with status ${response.status}`)
  }

  return (await response.json()) as ProjectHealthAssessment
}
