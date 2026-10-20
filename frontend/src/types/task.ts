export type TaskStatus = 'not_started' | 'in_progress' | 'blocked' | 'completed'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type RiskSeverity = 'low' | 'medium' | 'high'

export interface OverdueTaskRiskSignal {
  rule_id: 'overdue-task'
  severity: RiskSeverity
  task_id: string
  due_date: string
  analysis_date: string
}

export interface HighPriorityOverdueTaskRiskSignal {
  rule_id: 'high-priority-overdue-task'
  severity: RiskSeverity
  task_id: string
  priority: 'high' | 'urgent'
  due_date: string
  analysis_date: string
}

export interface ApproachingDeadlineRiskSignal {
  rule_id: 'approaching-deadline'
  severity: RiskSeverity
  task_id: string
  due_date: string
  analysis_date: string
}

export interface IncompleteDependencyRiskSignal {
  rule_id: 'incomplete-dependency'
  severity: RiskSeverity
  task_id: string
  prerequisites: Array<{ task_id: string; status: TaskStatus }>
}

export interface UnresolvedDependencyRiskSignal {
  rule_id: 'unresolved-dependency'
  severity: RiskSeverity
  task_id: string
  dependency_ids: string[]
}

export type TaskRiskSignal =
  | OverdueTaskRiskSignal
  | HighPriorityOverdueTaskRiskSignal
  | ApproachingDeadlineRiskSignal
  | IncompleteDependencyRiskSignal
  | UnresolvedDependencyRiskSignal

export interface TaskDependency {
  id: string
  title: string
}

export interface ProjectTaskSummary {
  id: string
  project_id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority | null
  owner: string | null
  due_date: string | null
  risk_signals: TaskRiskSignal[]
  dependencies: TaskDependency[]
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
