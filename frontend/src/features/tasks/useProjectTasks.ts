import { useCallback, useEffect, useState } from 'react'
import { getProjectTasks } from '../../api/tasks'
import type { ProjectTaskSummary } from '../../types/task'

type TaskListState = 'loading' | 'ready' | 'error'

export function useProjectTasks(projectId: string | null) {
  const [tasks, setTasks] = useState<ProjectTaskSummary[]>([])
  const [state, setState] = useState<TaskListState>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const loadTasks = useCallback(async () => {
    if (!projectId) return

    setState('loading')
    setErrorMessage('')

    try {
      const loadedTasks = await getProjectTasks(projectId)
      setTasks(loadedTasks)
      setState('ready')
    } catch {
      setState('error')
      setErrorMessage('The task list could not be loaded. Try again.')
    }
  }, [projectId])

  useEffect(() => {
    if (projectId) void loadTasks()
  }, [loadTasks, projectId])

  return { tasks, state, errorMessage, loadTasks }
}
