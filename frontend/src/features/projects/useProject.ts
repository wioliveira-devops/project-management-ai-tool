import { useCallback, useEffect, useState } from 'react'
import { getProject } from '../../api/projects'
import type { Project } from '../../types/project'

type ProjectState = 'loading' | 'ready' | 'error'
const SAMPLE_PROJECT_ID = 'sample-customer-portal-modernization'

export function useProject() {
  const [project, setProject] = useState<Project | null>(null)
  const [state, setState] = useState<ProjectState>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const loadProject = useCallback(async () => {
    setState('loading')
    setErrorMessage('')

    try {
      const loadedProject = await getProject(SAMPLE_PROJECT_ID)
      setProject(loadedProject)
      setState('ready')
    } catch {
      setState('error')
      setErrorMessage('Project information could not be loaded. Try again.')
    }
  }, [])

  useEffect(() => {
    void loadProject()
  }, [loadProject])

  return { project, state, errorMessage, loadProject }
}
