import { ProjectOverview } from './components/ProjectOverview'
import { ProjectTaskList } from './components/ProjectTaskList'
import { useProject } from './features/projects/useProject'
import { useProjectTasks } from './features/tasks/useProjectTasks'
import './App.css'

function App() {
  const { project, state, errorMessage, loadProject } = useProject()
  const taskList = useProjectTasks(project?.id ?? null)

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="Project workspace home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Project workspace</span>
        </a>
        <span className="topbar-label">Overview</span>
      </header>

      <section className="page-content" id="overview" aria-labelledby="page-title">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Project workspace</p>
            <h1 id="page-title">Project dashboard</h1>
            <p className="intro">A concise view of your project and its work.</p>
          </div>
        </div>
        <div className="dashboard-layout">
          <ProjectOverview
            project={project}
            state={state}
            errorMessage={errorMessage}
            onRetry={() => void loadProject()}
          />
          {project && (
            <ProjectTaskList
              tasks={taskList.tasks}
              state={taskList.state}
              errorMessage={taskList.errorMessage}
              onRetry={() => void taskList.loadTasks()}
            />
          )}
        </div>
      </section>
    </main>
  )
}

export default App
