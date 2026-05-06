import { useMemo } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { useApplications } from '../hooks/useApplications'
import { useStages } from '../hooks/useStages'
import { format, parseISO, differenceInDays } from 'date-fns'
import { MACRO_STATUSES, STAGE_TYPES } from '../lib/constants'

export function Gantt() {
  const { applications } = useApplications()
  const { stages } = useStages()

  const activeApps = applications.filter(a => a.status !== '已结束')

  const timeline = useMemo(() => {
    if (activeApps.length === 0) return null
    const allDates = activeApps
      .map(a => a.created_at)
      .concat(stages.map(s => s.scheduled_date).filter(Boolean) as string[])
      .concat(stages.map(s => s.completed_date).filter(Boolean) as string[])

    if (allDates.length === 0) return null

    const minDate = new Date(Math.min(...allDates.map(d => new Date(d).getTime())))
    const maxDate = new Date(Math.max(...allDates.map(d => new Date(d).getTime())))
    const totalDays = differenceInDays(maxDate, minDate) + 7

    return { minDate, maxDate, totalDays }
  }, [activeApps, stages])

  const getBarStyle = (_appId: string, startDate: Date, endDate: Date) => {
    if (!timeline) return {}
    const left = (differenceInDays(startDate, timeline.minDate) / timeline.totalDays) * 100
    const width = (differenceInDays(endDate, startDate) / timeline.totalDays) * 100
    return { left: `${left}%`, width: `${Math.max(width, 2)}%` }
  }

  const statusPill = (status: string) => {
    const pillClass = MACRO_STATUSES[status]?.pillClass || 'status-gray'
    return <span className={`pill ${pillClass}`}>{status}</span>
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="page-title">甘特图</h1>
        <p className="section-subtitle mt-2">时间轴视图</p>
      </div>

      {activeApps.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center font-body text-base" style={{ color: '#6b6558' }}>
            暂无进行中的岗位
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeApps.map((app) => {
            const appStages = stages.filter(s => s.application_id === app.id)
            const startDate = parseISO(app.created_at)
            const latestDate = appStages.length > 0
              ? new Date(Math.max(...appStages.map(s => new Date(s.created_at).getTime())))
              : startDate

            return (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-heading text-sm w-48 truncate" style={{ color: '#e8e6e1' }}>{app.position_name}</span>
                    <span className="text-sm w-24 font-body" style={{ color: '#a09b8c' }}>{app.company?.name}</span>
                    {statusPill(app.status)}
                  </div>

                  {timeline && (
                    <div className="relative h-8 rounded-lg overflow-hidden" style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      {/* Total progress bar */}
                      <div
                        className="absolute h-full rounded-lg"
                        style={{
                          ...getBarStyle(app.id, startDate, latestDate),
                          background: 'rgba(59,130,246,0.15)'
                        }}
                      />

                      {/* Stage markers */}
                      {appStages.map(stage => {
                        const stageDate = stage.scheduled_date
                          ? parseISO(stage.scheduled_date)
                          : parseISO(stage.created_at)
                        const pos = (differenceInDays(stageDate, timeline.minDate) / timeline.totalDays) * 100

                        return (
                          <div
                            key={stage.id}
                            className="absolute top-0 h-full flex items-center"
                            style={{ left: `${pos}%` }}
                          >
                            <div
                              className="h-3 w-3 rounded-full border-2 shadow-sm"
                              style={{
                                borderColor: '#0a0a0f',
                                background: stage.result_status === '已通过' ? '#4ade80' :
                                  stage.result_status === '未通过' ? '#f87171' : '#6ba3f5'
                              }}
                              title={`${stage.raw_stage_name || STAGE_TYPES[stage.stage_type]?.label}: ${format(stageDate, 'MM-dd')}`}
                            />
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="flex gap-3 mt-2 text-xs font-body" style={{ color: '#a09b8c' }}>
                    {appStages.map(stage => (
                      <div key={stage.id} className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full" style={{
                          background: stage.result_status === '已通过' ? '#4ade80' :
                            stage.result_status === '未通过' ? '#f87171' : '#6b6558'
                        }} />
                        {stage.raw_stage_name || STAGE_TYPES[stage.stage_type]?.label}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
