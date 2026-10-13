import { ApiStatus } from './components/ApiStatus'
import { useApiHealth } from './features/health/useApiHealth'
import './App.css'

function App() {
  const { state, errorMessage, checkApiHealth } = useApiHealth()

  return (
    <main className="app-shell">
      <section className="status-card" aria-labelledby="app-title">
        <p className="eyebrow">Project Management AI Tool</p>
        <h1 id="app-title">Application status</h1>
        <p className="intro">A simple view of the connection to the project API.</p>
        <ApiStatus state={state} errorMessage={errorMessage} />
        <button type="button" onClick={() => void checkApiHealth()} disabled={state === 'loading'}>
          {state === 'loading' ? 'Checking…' : 'Check backend'}
        </button>
      </section>
    </main>
  )
}

export default App
