import type { Project } from '../types/project'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export async function getProject(projectId: string): Promise<Project> {
  const response = await fetch(`${apiBaseUrl}/api/projects/${projectId}`)

  if (!response.ok) {
    throw new Error(`Project request failed with status ${response.status}`)
  }

  return (await response.json()) as Project
}
