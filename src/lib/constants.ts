export const MACRO_STATUSES: Record<string, { label: string; color: string; order: number }> = {
  '待关注': { label: '待关注', color: '#9ca3af', order: 0 },
  '待投递': { label: '待投递', color: '#f59e0b', order: 1 },
  '已投递': { label: '已投递', color: '#3b82f6', order: 2 },
  '测评中': { label: '测评/考试中', color: '#8b5cf6', order: 3 },
  '面试中': { label: '面试流程中', color: '#ec4899', order: 4 },
  'Offer': { label: 'Offer 阶段', color: '#10b981', order: 5 },
  '已结束': { label: '已结束', color: '#6b7280', order: 6 },
}

export const STAGE_TYPES: Record<string, { label: string; category: 'assessment' | 'interview' | 'follow_up' }> = {
  oa: { label: '在线测评', category: 'assessment' },
  written_test: { label: '笔试', category: 'assessment' },
  ai_coding: { label: 'AI Coding', category: 'assessment' },
  technical: { label: '技术面', category: 'interview' },
  business: { label: '业务面', category: 'interview' },
  leader: { label: 'Leader 面', category: 'interview' },
  hr: { label: 'HR 面', category: 'interview' },
  offer: { label: 'Offer', category: 'follow_up' },
  ended: { label: '已结束', category: 'follow_up' },
}

export const EXECUTION_STATUSES = ['待处理', '已预约', '已完成'] as const
export const RESULT_STATUSES = ['待处理', '已通过', '未通过', '无反馈'] as const

export const EVENT_TYPE_LABELS: Record<string, string> = {
  deadline: '截止日期',
  oa: '在线测评',
  written_test: '笔试',
  ai_coding: 'AI Coding',
  technical: '技术面',
  business: '业务面',
  leader: 'Leader 面',
  hr: 'HR 面',
  offer: 'Offer',
  follow_up: '跟进提醒',
}

export const PRIORITY_LABELS: Record<number, string> = {
  1: '低意向',
  2: '较低',
  3: '一般',
  4: '高意向',
  5: '最高意向',
}
