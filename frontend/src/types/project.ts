export type ProjectStatus = 'planned' | 'active' | 'on_hold' | 'completed'

export interface Project {
  id: string
  name: string
  status: ProjectStatus
  start_date: string | null
  due_date: string | null
}
