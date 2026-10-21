import { useCallback, useEffect, useState } from 'react'
import { getProjectHealth } from '../../api/projectHealth'
import type { ProjectHealthAssessment } from '../../types/projectHealth'

type ProjectHealthState = 'loading' | 'ready' | 'error'

export function useProjectHealth(projectId: string | null) {
  const [assessment, setAssessment] = useState<ProjectHealthAssessment | null>(null)
  const [state, setState] = useState<ProjectHealthState>('loading')

  const loadAssessment = useCallback(async () => {
    if (!projectId) return

    setState('loading')
    try {
      const result = await getProjectHealth(projectId)
      setAssessment(result)
      setState('ready')
    } catch {
      setAssessment(null)
      setState('error')
    }
  }, [projectId])

  useEffect(() => {
    if (projectId) void loadAssessment()
  }, [loadAssessment, projectId])

  return { assessment, state, loadAssessment }
}
