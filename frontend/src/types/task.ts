export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'completed'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface ProjectTaskSummary {
  id: string
  project_id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority | null
  owner: string | null
  due_date: string | null
}

export interface Task {
  id: string
  project_id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  start_date: string | null
  due_date: string | null
  owner: string | null
}
