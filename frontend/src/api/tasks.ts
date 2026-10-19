import type { ProjectTaskSummary } from '../types/task'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export async function getProjectTasks(projectId: string): Promise<ProjectTaskSummary[]> {
  const response = await fetch(`${apiBaseUrl}/api/projects/${projectId}/tasks`)

  if (!response.ok) {
    throw new Error(`Task request failed with status ${response.status}`)
  }

  return (await response.json()) as ProjectTaskSummary[]
}
