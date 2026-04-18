export interface Company {
  id: string
  name: string
  industry?: string
  website?: string
  location?: string
  size?: string
  created_at: string
  user_id: string
}

export interface Application {
  id: string
  company_id: string
  position_name: string
  status: MacroStatus
  priority: number
  deadline?: string
  city?: string
  salary_range?: string
  channel?: string
  notes?: string
  created_at: string
  updated_at: string
  user_id: string
  company?: Company
  stages?: Stage[]
}

export type MacroStatus =
  | '待关注'
  | '待投递'
  | '已投递'
  | '测评中'
  | '面试中'
  | 'Offer'
  | '已结束'

export type StageType =
  | 'oa'
  | 'written_test'
  | 'ai_coding'
  | 'technical'
  | 'business'
  | 'leader'
  | 'hr'
  | 'offer'
  | 'ended'

export type ExecutionStatus = '待处理' | '已预约' | '已完成'
export type ResultStatus = '待处理' | '已通过' | '未通过' | '无反馈'

export interface Stage {
  id: string
  application_id: string
  stage_type: StageType
  raw_stage_name?: string
  round_number?: number
  event_category: 'deadline' | 'assessment' | 'interview' | 'follow_up'
  execution_status: ExecutionStatus
  result_status: ResultStatus
  scheduled_date?: string
  completed_date?: string
  feedback?: string
  strength_tags?: string[]
  weakness_tags?: string[]
  created_at: string
  user_id: string
}

export type EventType =
  | 'deadline'
  | 'oa'
  | 'written_test'
  | 'ai_coding'
  | 'technical'
  | 'business'
  | 'leader'
  | 'hr'
  | 'offer'
  | 'follow_up'

export interface Event {
  id: string
  application_id?: string
  company_id?: string
  event_type: EventType
  title: string
  event_date: string
  duration_min?: number
  location?: string
  status: '待处理' | '已完成' | '已跳过'
  notes?: string
  created_at: string
  user_id: string
}

export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: string
  application_id?: string
  company_id?: string
  title: string
  description?: string
  due_date?: string
  priority: TaskPriority
  status: TaskStatus
  source: 'manual' | 'ai_suggested'
  created_at: string
  user_id: string
}

export interface PrioritySuggestion {
  id: string
  title: string
  description: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  related_application_id?: string
  action_type: 'follow_up' | 'prepare' | 'apply' | 'review' | 'remind'
}
