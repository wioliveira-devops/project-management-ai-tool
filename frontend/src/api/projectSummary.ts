import type { ProjectSummary } from '../types/projectSummary'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export async function generateProjectSummary(projectId: string): Promise<ProjectSummary> {
  const response = await fetch(`${apiBaseUrl}/api/projects/${projectId}/summary`, {
    method: 'POST',
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { detail?: string } | null
    throw new Error(payload?.detail ?? `Summary request failed with status ${response.status}`)
  }

  return (await response.json()) as ProjectSummary
}
