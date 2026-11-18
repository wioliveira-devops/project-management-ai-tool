import type { RecommendationsResponse } from '../types/recommendation'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export async function generateProjectRecommendations(
  projectId: string,
): Promise<RecommendationsResponse> {
  const response = await fetch(
    `${apiBaseUrl}/api/projects/${projectId}/recommendations`,
    { method: 'POST' },
  )

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { detail?: string } | null
    throw new Error(
      payload?.detail ?? `Recommendation request failed with status ${response.status}`,
    )
  }

  return (await response.json()) as RecommendationsResponse
}
