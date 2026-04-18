import { isBefore, isAfter, addDays, differenceInDays, startOfWeek, endOfWeek, parseISO } from 'date-fns'
import type { Application, Stage, Task, PrioritySuggestion } from '../../types'
// import { MACRO_STATUSES } from '../constants'

interface RuleContext {
  applications: Application[]
  stages: Stage[]
  tasks: Task[]
}

export function generatePrioritySuggestions(context: RuleContext): PrioritySuggestion[] {
  const suggestions: PrioritySuggestion[] = []
  const now = new Date()
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 })
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 })

  for (const app of context.applications) {
    if (app.status === '已结束') continue

    // 规则1: 截止日期临近 (3天内)
    if (app.deadline) {
      const deadline = parseISO(app.deadline)
      const daysUntil = differenceInDays(deadline, now)
      if (daysUntil >= 0 && daysUntil <= 3) {
        suggestions.push({
          id: `deadline-${app.id}`,
          title: `${app.company?.name || '某公司'} - ${app.position_name} 即将截止`,
          description: `截止日期: ${app.deadline}，还剩 ${daysUntil} 天`,
          reason: '截止日期临近，需尽快处理',
          priority: daysUntil <= 1 ? 'high' : 'medium',
          related_application_id: app.id,
          action_type: 'follow_up',
        })
      }
    }

    // 规则2: 当前阶段停滞超过7天
    const appStages = context.stages.filter(s => s.application_id === app.id)
    const latestStage = appStages.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]

    if (latestStage && latestStage.execution_status !== '已完成') {
      const stageDate = parseISO(latestStage.scheduled_date || latestStage.created_at)
      const daysStagnant = differenceInDays(now, stageDate)
      if (daysStagnant > 7) {
        suggestions.push({
          id: `stagnant-${app.id}`,
          title: `${app.company?.name || '某公司'} - ${app.position_name} 阶段停滞`,
          description: `${latestStage.raw_stage_name || latestStage.stage_type} 已停滞 ${daysStagnant} 天`,
          reason: '流程节点长时间无进展，建议主动跟进',
          priority: daysStagnant > 14 ? 'high' : 'medium',
          related_application_id: app.id,
          action_type: 'follow_up',
        })
      }
    }

    // 规则3: 进入关键面试节点
    const hasInterview = appStages.some(s =>
      ['technical', 'business', 'leader', 'hr'].includes(s.stage_type) &&
      s.execution_status === '已预约'
    )
    if (hasInterview) {
      const upcomingInterview = appStages.find(s =>
        ['technical', 'business', 'leader', 'hr'].includes(s.stage_type) &&
        s.execution_status === '已预约' &&
        s.scheduled_date &&
        isAfter(parseISO(s.scheduled_date), now) &&
        isBefore(parseISO(s.scheduled_date), addDays(now, 3))
      )
      if (upcomingInterview) {
        suggestions.push({
          id: `interview-${app.id}`,
          title: `${app.company?.name || '某公司'} - ${upcomingInterview.raw_stage_name || '面试'} 即将开始`,
          description: `预约时间: ${upcomingInterview.scheduled_date}`,
          reason: '面试即将开始，需做好准备',
          priority: 'high',
          related_application_id: app.id,
          action_type: 'prepare',
        })
      }
    }

    // 规则4: 有测评/笔试即将到来
    const upcomingAssessment = appStages.find(s =>
      ['oa', 'written_test', 'ai_coding'].includes(s.stage_type) &&
      s.execution_status === '已预约' &&
      s.scheduled_date &&
      isAfter(parseISO(s.scheduled_date), now) &&
      isBefore(parseISO(s.scheduled_date), addDays(now, 2))
    )
    if (upcomingAssessment) {
      suggestions.push({
        id: `assessment-${app.id}`,
        title: `${app.company?.name || '某公司'} - ${upcomingAssessment.raw_stage_name || '测评'} 即将开始`,
        description: `预约时间: ${upcomingAssessment.scheduled_date}`,
        reason: '测评/笔试即将开始，需提前准备',
        priority: 'high',
        related_application_id: app.id,
        action_type: 'prepare',
      })
    }
  }

  // 规则5: 同公司多岗位并行
  const companyAppCounts: Record<string, Application[]> = {}
  for (const app of context.applications) {
    if (app.status === '已结束') continue
    if (!companyAppCounts[app.company_id]) companyAppCounts[app.company_id] = []
    companyAppCounts[app.company_id].push(app)
  }
  for (const [companyId, apps] of Object.entries(companyAppCounts)) {
    if (apps.length > 1) {
      const companyName = apps[0].company?.name || '某公司'
      suggestions.push({
        id: `parallel-${companyId}`,
        title: `${companyName} 有 ${apps.length} 个岗位在推进`,
        description: apps.map(a => a.position_name).join('、'),
        reason: '同公司多岗位并行，注意经验复用和冲突',
        priority: 'medium',
        action_type: 'review',
      })
    }
  }

  // 规则6: 本周关键事件
  const thisWeekEvents = context.stages.filter(s =>
    s.scheduled_date &&
    isAfter(parseISO(s.scheduled_date), thisWeekStart) &&
    isBefore(parseISO(s.scheduled_date), thisWeekEnd) &&
    s.execution_status === '已预约'
  )
  for (const event of thisWeekEvents) {
    const app = context.applications.find(a => a.id === event.application_id)
    if (app) {
      suggestions.push({
        id: `thisweek-${event.id}`,
        title: `${app.company?.name || '某公司'} - 本周有 ${event.raw_stage_name || event.stage_type}`,
        description: `时间: ${event.scheduled_date}`,
        reason: '本周关键事件，提前安排时间',
        priority: 'medium',
        related_application_id: app.id,
        action_type: 'remind',
      })
    }
  }

  // 去重并排序
  const unique = suggestions.filter((s, i, arr) =>
    arr.findIndex(t => t.id === s.id) === i
  )
  return unique
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
    .slice(0, 5)
}
