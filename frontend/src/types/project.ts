export type ProjectStatus = 'planned' | 'active' | 'on_hold' | 'completed'

export interface ProjectOwner {
  name: string
  role: string
}

export interface Project {
  id: string
  name: string
  description: string
  owner: ProjectOwner | null
  start_date: string | null
  target_end_date: string | null
  status: ProjectStatus
}
