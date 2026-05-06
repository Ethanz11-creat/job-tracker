import { useEffect, useState } from 'react'
import {
  Briefcase,
  CalendarDays,
  Clock,
  Trophy,
  Plus,
  ChevronRight,
  Bell,
  ArrowRight,
  Lightbulb,
  FileText,
  Eye,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { useApplications } from '../hooks/useApplications'
import { useStages } from '../hooks/useStages'
import { useTasks } from '../hooks/useTasks'
import { usePriorityAI } from '../hooks/usePriorityAI'
import { seedDemoData } from '../data/seed'
import {
  format,
  isThisWeek,
  parseISO,
  differenceInDays,
  getDay,
} from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Link, useNavigate } from 'react-router-dom'
import { MACRO_STATUSES, STAGE_TYPES } from '../lib/constants'
import type { Stage, Application } from '../types'

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function getCompanyInitial(name?: string) {
  return name?.charAt(0) ?? '?'
}

const avatarColors = [
  'bg-[rgba(59,130,246,0.15)] text-[#6ba3f5]',
  'bg-[rgba(34,197,94,0.15)] text-[#4ade80]',
  'bg-[rgba(217,119,6,0.15)] text-[#f0a830]',
  'bg-[rgba(236,72,153,0.15)] text-[#f472b6]',
  'bg-[rgba(168,85,247,0.15)] text-[#c084fc]',
  'bg-[rgba(20,184,166,0.15)] text-[#2dd4bf]',
  'bg-[rgba(239,68,68,0.15)] text-[#f87171]',
  'bg-[rgba(201,169,110,0.15)] text-[#c9a96e]',
]

function getAvatarColor(name?: string) {
  if (!name) return avatarColors[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getStageApp(stages: Stage[], stageId: string, apps: Application[]) {
  const stage = stages.find(s => s.id === stageId)
  if (!stage) return null
  return apps.find(a => a.id === stage.application_id) ?? null
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function Dashboard() {
  const navigate = useNavigate()
  const { applications, loading: appsLoading, refresh: refreshApps } = useApplications()
  const { stages, refresh: refreshStages } = useStages()
  const { tasks, refresh: refreshTasks } = useTasks()
  const suggestions = usePriorityAI(applications, stages, tasks)
  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    seedDemoData().then(() => {
      setSeeded(true)
      refreshApps()
      refreshStages()
      refreshTasks()
    })
  }, [])

  /* ---------- derived data ---------- */
  const activeApps = applications.filter(a => a.status !== '已结束')
  const offerApps = applications.filter(a => a.status === 'Offer')
  const appliedCount = applications.filter(a =>
    ['已投递', '测评中', '面试中', 'Offer', '已结束'].includes(a.status)
  ).length
  const passRate = appliedCount > 0 ? Math.round((offerApps.length / appliedCount) * 100) : 0

  const thisWeekInterviews = stages.filter(
    s => s.scheduled_date && isThisWeek(parseISO(s.scheduled_date), { weekStartsOn: 1 }) && s.event_category === 'interview'
  )

  const upcomingDeadlines = applications.filter(
    a => a.deadline && differenceInDays(parseISO(a.deadline), new Date()) <= 7 && a.status !== '已结束'
  )

  const thisWeekStages = stages
    .filter(s => s.scheduled_date && isThisWeek(parseISO(s.scheduled_date), { weekStartsOn: 1 }))
    .sort((a, b) => new Date(a.scheduled_date!).getTime() - new Date(b.scheduled_date!).getTime())

  const todoStages = thisWeekStages.filter(s => s.execution_status !== '已完成')

  /* ---------- loading ---------- */
  if (appsLoading && !seeded) {
    return (
      <div className="flex h-screen items-center justify-center animate-fade-in">
        <div className="text-sm" style={{ color: '#6b6558' }}>
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#c9a96e' }} />
            正在加载...
          </div>
        </div>
      </div>
    )
  }

  /* ---------- stat cards meta ---------- */
  const statCards = [
    {
      icon: Briefcase,
      accent: '#3b82f6',
      accentBg: 'rgba(59,130,246,0.1)',
      title: '总岗位数',
      value: applications.length,
      desc: activeApps.length > 0 ? `${activeApps.length} 进行中` : '暂无岗位',
    },
    {
      icon: CalendarDays,
      accent: '#22c55e',
      accentBg: 'rgba(34,197,94,0.1)',
      title: '本周面试',
      value: thisWeekInterviews.length,
      desc: thisWeekInterviews.length > 0
        ? (() => {
            const app = getStageApp(stages, thisWeekInterviews[0].id, applications)
            return app ? `最近：${app.company?.name ?? ''} ${thisWeekInterviews[0].raw_stage_name ?? STAGE_TYPES[thisWeekInterviews[0].stage_type]?.label ?? ''}` : '暂无面试'
          })()
        : '暂无面试',
    },
    {
      icon: Clock,
      accent: '#d97706',
      accentBg: 'rgba(217,119,6,0.1)',
      title: '近期截止',
      value: upcomingDeadlines.length,
      desc: upcomingDeadlines.length > 0
        ? `${Math.min(...upcomingDeadlines.map(a => differenceInDays(parseISO(a.deadline!), new Date())))} 天内截止`
        : '近期无截止',
    },
    {
      icon: Trophy,
      accent: '#c9a96e',
      accentBg: 'rgba(201,169,110,0.1)',
      title: '已获 Offer',
      value: offerApps.length,
      desc: `通过率 ${passRate}%`,
    },
  ]

  /* ---------- action icon map ---------- */
  const actionIcon = (type: string) => {
    switch (type) {
      case 'follow_up': return <ArrowRight className="h-3.5 w-3.5" style={{ color: '#6ba3f5' }} strokeWidth={2} />
      case 'prepare': return <Lightbulb className="h-3.5 w-3.5" style={{ color: '#f0a830' }} strokeWidth={2} />
      case 'apply': return <FileText className="h-3.5 w-3.5" style={{ color: '#4ade80' }} strokeWidth={2} />
      case 'review': return <Eye className="h-3.5 w-3.5" style={{ color: '#c084fc' }} strokeWidth={2} />
      case 'remind': return <Clock className="h-3.5 w-3.5" style={{ color: '#f472b6' }} strokeWidth={2} />
      default: return <AlertCircle className="h-3.5 w-3.5" style={{ color: '#6b6558' }} strokeWidth={2} />
    }
  }

  const actionBg = (type: string) => {
    switch (type) {
      case 'follow_up': return 'rgba(59,130,246,0.1)'
      case 'prepare': return 'rgba(217,119,6,0.1)'
      case 'apply': return 'rgba(34,197,94,0.1)'
      case 'review': return 'rgba(168,85,247,0.1)'
      case 'remind': return 'rgba(236,72,153,0.1)'
      default: return 'rgba(255,255,255,0.04)'
    }
  }

  /* ---------------------------------------------------------------- */
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* ===== Header ===== */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="page-title">总览</h1>
          <p className="section-subtitle mt-2">
            {format(new Date(), 'yyyy年M月d日 EEEE', { locale: zhCN })}
          </p>
        </div>
        <Button onClick={() => navigate('/applications')}>
          <Plus className="mr-1.5 h-4 w-4" strokeWidth={2} />
          添加新岗位
        </Button>
      </div>

      {/* ===== Stat Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <Card
            key={card.title}
            className="p-5 animate-fade-in-up"
            style={{ animationDelay: `${(i + 1) * 0.06}s`, opacity: 0 }}
          >
            <div className="flex items-start gap-3.5">
              <div
                className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105"
                style={{
                  background: card.accentBg,
                  border: `1px solid ${card.accentBg}`,
                }}
              >
                <card.icon className="h-5 w-5" style={{ color: card.accent }} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium" style={{ color: '#6b6558' }}>{card.title}</div>
                <div className="stat-number mt-1">{card.value}</div>
              </div>
            </div>
            <div className="mt-4 text-xs truncate" style={{ color: '#6b6558' }}>{card.desc}</div>
          </Card>
        ))}
      </div>

      {/* ===== Two-column layout ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* ---- Left column ---- */}
        <div className="space-y-6">
          {/* Today's Todo */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(59,130,246,0.1)',
                      border: '1px solid rgba(59,130,246,0.15)'
                    }}>
                    <Clock className="h-4 w-4" style={{ color: '#6ba3f5' }} strokeWidth={1.5} />
                  </div>
                  <span className="font-heading text-base" style={{ color: '#e8e6e1' }}>今日待办</span>
                </div>
                <Link to="/applications" className="flex items-center gap-1 text-xs transition-colors duration-200 group"
                  style={{ color: '#6b6558' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b6558'}>
                  查看全部 <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 8px)' }}>
                {todoStages.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm" style={{ color: '#6b6558' }}>暂无待办事项</div>
                ) : (
                  todoStages.map((stage, idx) => {
                    const app = getStageApp(stages, stage.id, applications)
                    if (!app) return null
                    const pillClass = MACRO_STATUSES[app.status]?.pillClass || 'status-gray'
                    return (
                      <Link
                        key={stage.id}
                        to={`/applications/${app.id}`}
                        className="flex items-center gap-3 px-5 py-3 transition-all duration-200 group"
                        style={{
                          borderBottom: idx < todoStages.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${getAvatarColor(app.company?.name)}`}>
                          {getCompanyInitial(app.company?.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate" style={{ color: '#e8e6e1' }}>
                              {app.company?.name} · {app.position_name}
                            </span>
                          </div>
                          <p className="text-xs mt-0.5 truncate" style={{ color: '#6b6558' }}>
                            {stage.raw_stage_name || STAGE_TYPES[stage.stage_type]?.label}
                          </p>
                        </div>
                        <span className={`pill ${pillClass} flex-shrink-0`}>{app.status}</span>
                        <span className="text-xs flex-shrink-0 w-14 text-right" style={{ color: '#6b6558' }}>
                          {stage.scheduled_date ? format(parseISO(stage.scheduled_date), 'M月d日') : ''}
                        </span>
                      </Link>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Timeline */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.35s', opacity: 0 }}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(34,197,94,0.1)',
                      border: '1px solid rgba(34,197,94,0.15)'
                    }}>
                    <CalendarDays className="h-4 w-4" style={{ color: '#4ade80' }} strokeWidth={1.5} />
                  </div>
                  <span className="font-heading text-base" style={{ color: '#e8e6e1' }}>本周关键节点</span>
                </div>
                <Link to="/calendar" className="flex items-center gap-1 text-xs transition-colors duration-200 group"
                  style={{ color: '#6b6558' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b6558'}>
                  查看日历 <ChevronRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="px-5 py-5 space-y-4">
                {thisWeekStages.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: '#6b6558' }}>本周暂无节点</p>
                ) : (
                  thisWeekStages.map((stage, idx) => {
                    const app = getStageApp(stages, stage.id, applications)
                    if (!app || !stage.scheduled_date) return null
                    const date = parseISO(stage.scheduled_date)
                    const pillClass = MACRO_STATUSES[app.status]?.pillClass || 'status-gray'
                    const stageLabel = stage.raw_stage_name || STAGE_TYPES[stage.stage_type]?.label || stage.stage_type
                    const isLast = idx === thisWeekStages.length - 1
                    return (
                      <div key={stage.id} className="flex gap-4 group">
                        {/* Date block */}
                        <div className="flex-shrink-0 w-12 text-center">
                          <div className="text-xs" style={{ color: '#6b6558' }}>{weekDays[getDay(date)]}</div>
                          <div className="text-lg font-heading font-normal" style={{ color: '#e8e6e1' }}>{format(date, 'd')}</div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 pb-4" style={{
                          borderBottom: !isLast ? '1px solid rgba(255,255,255,0.04)' : 'none'
                        }}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium" style={{ color: '#e8e6e1' }}>
                              {app.company?.name} {stageLabel}
                            </span>
                            <span className={`pill ${pillClass} text-xs`}>{app.status}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs" style={{ color: '#6b6558' }}>
                            <span>{format(date, 'HH:mm')}</span>
                            {stage.execution_status === '已预约' && <span>· 已预约</span>}
                            {stage.execution_status === '已完成' && <span style={{ color: '#4ade80' }}>· 已完成</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---- Right column ---- */}
        <div className="space-y-6">
          {/* AI Suggestions */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <CardContent className="p-0">
              <div className="px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'rgba(201,169,110,0.1)',
                      border: '1px solid rgba(201,169,110,0.2)'
                    }}>
                    <Sparkles className="h-4 w-4" style={{ color: '#c9a96e' }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="font-heading text-base" style={{ color: '#e8e6e1' }}>AI 智能建议</span>
                    <p className="text-xs mt-0.5" style={{ color: '#6b6558' }}>基于你的申请进度智能分析</p>
                  </div>
                </div>
              </div>
              <div>
                {suggestions.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm" style={{ color: '#6b6558' }}>暂无建议，继续加油！</div>
                ) : (
                  suggestions.slice(0, 6).map((s, idx) => (
                    <div key={s.id} className="px-5 py-4 transition-all duration-200"
                      style={{
                        borderBottom: idx < Math.min(suggestions.length, 6) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: actionBg(s.action_type) }}>
                          {actionIcon(s.action_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium" style={{ color: '#e8e6e1' }}>{s.title}</span>
                          </div>
                          <p className="text-xs mt-1 leading-relaxed" style={{ color: '#a09b8c' }}>{s.description}</p>
                          <div className="mt-2 flex items-start gap-1.5">
                            <span className="text-xs font-medium flex-shrink-0" style={{ color: '#c9a96e' }}>建议：</span>
                            <span className="text-xs leading-relaxed" style={{ color: '#a09b8c' }}>{s.reason}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Deadline Reminders */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.45s', opacity: 0 }}>
            <CardContent className="p-0">
              <div className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.15)'
                  }}>
                  <Bell className="h-4 w-4" style={{ color: '#f87171' }} strokeWidth={1.5} />
                </div>
                <span className="font-heading text-base" style={{ color: '#e8e6e1' }}>截止提醒</span>
              </div>
              <div>
                {upcomingDeadlines.length === 0 ? (
                  <div className="px-5 py-8 text-center text-sm" style={{ color: '#6b6558' }}>近期无截止</div>
                ) : (
                  upcomingDeadlines.map((app, idx) => {
                    const days = differenceInDays(parseISO(app.deadline!), new Date())
                    return (
                      <Link
                        key={app.id}
                        to={`/applications/${app.id}`}
                        className="flex items-center justify-between px-5 py-3 transition-all duration-200"
                        style={{
                          borderBottom: idx < upcomingDeadlines.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: '#e8e6e1' }}>{app.position_name}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#6b6558' }}>{app.company?.name}</div>
                        </div>
                        <Badge variant={days <= 1 ? 'destructive' : days <= 3 ? 'warning' : 'secondary'}>
                          {days <= 0 ? '已截止' : `${days}天后`}
                        </Badge>
                      </Link>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===== Bottom add button ===== */}
      <div className="pt-2 animate-fade-in-up" style={{ animationDelay: '0.5s', opacity: 0 }}>
        <Button onClick={() => navigate('/applications')} className="w-full sm:w-auto">
          <Plus className="mr-1.5 h-4 w-4" strokeWidth={2} />
          添加岗位
        </Button>
      </div>
    </div>
  )
}
