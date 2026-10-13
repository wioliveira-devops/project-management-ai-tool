import { useState } from 'react'
import { getApiHealth } from '../../api/health'

type HealthState = 'idle' | 'loading' | 'connected' | 'error'

export function useApiHealth() {
  const [state, setState] = useState<HealthState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function checkApiHealth() {
    setState('loading')
    setErrorMessage('')

    try {
      await getApiHealth()
      setState('connected')
    } catch {
      setState('error')
      setErrorMessage('The backend is unavailable. Start the API and try again.')
    }
  }

  return { state, errorMessage, checkApiHealth }
}
