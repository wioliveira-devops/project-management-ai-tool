import { ProjectOverview } from './components/ProjectOverview'
import { HighPriorityTaskList } from './components/HighPriorityTaskList'
import { OverdueTaskList } from './components/OverdueTaskList'
import { ProjectRecommendationList } from './components/ProjectRecommendationList'
import { ProjectRiskList } from './components/ProjectRiskList'
import { ProjectTaskList } from './components/ProjectTaskList'
import { getProjectHealth } from './features/projects/projectHealth'
import { useProject } from './features/projects/useProject'
import { useProjectTasks } from './features/tasks/useProjectTasks'
import './App.css'

function App() {
  const { project, state, errorMessage, loadProject } = useProject()
  const taskList = useProjectTasks(project?.id ?? null)
  const projectHealth = getProjectHealth(taskList.tasks, taskList.state)

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="Project workspace home">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>Project workspace</span>
        </a>
        <span className="topbar-label">Dashboard</span>
      </header>

      <section className="page-content" id="overview" aria-labelledby="page-title">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Project dashboard</p>
            <h1 id="page-title">{project?.name ?? 'Project overview'}</h1>
            <p className="intro">A concise view of your project and its work.</p>
          </div>
        </div>
        <div className="dashboard-layout">
          <ProjectOverview
            project={project}
            health={projectHealth}
            state={state}
            errorMessage={errorMessage}
            onRetry={() => void loadProject()}
          />
          {project && (
            <div className="dashboard-work-column">
              {taskList.state === 'ready' && taskList.tasks.length > 0 && (
                <>
                  <OverdueTaskList tasks={taskList.tasks} />
                  <HighPriorityTaskList tasks={taskList.tasks} />
                  <ProjectRiskList tasks={taskList.tasks} />
                  <ProjectRecommendationList tasks={taskList.tasks} />
                </>
              )}
              <ProjectTaskList
                tasks={taskList.tasks}
                state={taskList.state}
                errorMessage={taskList.errorMessage}
                onRetry={() => void taskList.loadTasks()}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
