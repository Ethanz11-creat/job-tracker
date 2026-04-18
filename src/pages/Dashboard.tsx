import { useEffect, useState } from 'react'
import { Briefcase, Clock, AlertCircle, CheckCircle2, Sparkles, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { useApplications } from '../hooks/useApplications'
import { useStages } from '../hooks/useStages'
import { useTasks } from '../hooks/useTasks'
import { usePriorityAI } from '../hooks/usePriorityAI'
import { seedDemoData } from '../data/seed'
import { format, isThisWeek, isToday, parseISO, differenceInDays } from 'date-fns'
import { Link } from 'react-router-dom'

export function Dashboard() {
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

  const activeApps = applications.filter(a => a.status !== '已结束')
  const thisWeekEvents = stages.filter(s =>
    s.scheduled_date && isThisWeek(parseISO(s.scheduled_date), { weekStartsOn: 1 })
  )
  const todayTasks = tasks.filter(t => t.due_date && isToday(parseISO(t.due_date)))
  const upcomingDeadlines = applications.filter(a =>
    a.deadline && differenceInDays(parseISO(a.deadline), new Date()) <= 3 && a.status !== '已结束'
  )

  if (appsLoading && !seeded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-text-secondary">加载中...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-semibold">首页总览</h1>
        <div className="text-sm text-text-secondary">
          {format(new Date(), 'yyyy年MM月dd日 EEEE')}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              总岗位数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">{applications.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              进行中岗位
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-3xl font-bold">{activeApps.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              本周关键事件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span className="text-3xl font-bold">{thisWeekEvents.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary">
              今日待办
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-3xl font-bold">{todayTasks.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 智能优先级建议 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>智能优先级建议</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {suggestions.length === 0 ? (
            <p className="text-sm text-text-secondary">暂无优先级建议，继续加油！</p>
          ) : (
            <div className="space-y-3">
              {suggestions.map(s => (
                <div key={s.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${s.priority === 'high' ? 'text-red-500' : s.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.title}</span>
                      <Badge variant={s.priority === 'high' ? 'destructive' : s.priority === 'medium' ? 'default' : 'secondary'}>
                        {s.priority === 'high' ? '高优先级' : s.priority === 'medium' ? '中优先级' : '低优先级'}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">{s.description}</p>
                    <p className="text-xs text-text-muted mt-1">{s.reason}</p>
                  </div>
                  {s.related_application_id && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/applications/${s.related_application_id}`}>查看</Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 近期截止 + 今日待办 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>近期截止事项</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-text-secondary">近期无截止事项</p>
            ) : (
              <div className="space-y-2">
                {upcomingDeadlines.map(app => (
                  <div key={app.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <span className="font-medium">{app.company?.name}</span>
                      <span className="text-text-secondary mx-2">-</span>
                      <span>{app.position_name}</span>
                    </div>
                    <Badge variant="destructive">
                      {differenceInDays(parseISO(app.deadline!), new Date()) <= 0 ? '已截止' : `剩 ${differenceInDays(parseISO(app.deadline!), new Date())} 天`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>今日待办</CardTitle>
          </CardHeader>
          <CardContent>
            {todayTasks.length === 0 ? (
              <p className="text-sm text-text-secondary">今日无待办，可以休息一下~</p>
            ) : (
              <div className="space-y-2">
                {todayTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className={`h-2 w-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <span className="flex-1">{task.title}</span>
                    <Badge variant={task.status === 'done' ? 'secondary' : 'default'}>
                      {task.status === 'done' ? '已完成' : task.status === 'in_progress' ? '进行中' : '待处理'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
