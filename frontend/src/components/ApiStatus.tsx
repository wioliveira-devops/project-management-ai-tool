type ApiStatusProps = {
  state: 'idle' | 'loading' | 'connected' | 'error'
  errorMessage?: string
}

export function ApiStatus({ state, errorMessage }: ApiStatusProps) {
  if (state === 'loading') {
    return <p role="status">Checking the backend connection…</p>
  }

  if (state === 'idle') {
    return <p role="status">The backend has not been checked yet.</p>
  }

  if (state === 'error') {
    return <p role="alert">{errorMessage ?? 'The backend is unavailable.'}</p>
  }

  return <p role="status">Backend connection: available</p>
}
