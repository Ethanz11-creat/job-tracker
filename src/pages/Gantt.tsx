import { useMemo } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-heading font-semibold">甘特图</h1>

      {activeApps.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-text-secondary">
            暂无进行中的岗位
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeApps.map(app => {
            const appStages = stages.filter(s => s.application_id === app.id)
            const startDate = parseISO(app.created_at)
            const latestDate = appStages.length > 0
              ? new Date(Math.max(...appStages.map(s => new Date(s.created_at).getTime())))
              : startDate

            return (
              <Card key={app.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-medium w-48 truncate">{app.position_name}</span>
                    <span className="text-sm text-text-secondary w-24">{app.company?.name}</span>
                    <Badge style={{ backgroundColor: MACRO_STATUSES[app.status]?.color + '20', color: MACRO_STATUSES[app.status]?.color }}>
                      {app.status}
                    </Badge>
                  </div>

                  {timeline && (
                    <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                      {/* 总进度条 */}
                      <div
                        className="absolute h-full bg-primary/20 rounded-full"
                        style={getBarStyle(app.id, startDate, latestDate)}
                      />

                      {/* 各节点标记 */}
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
                              className={`h-4 w-4 rounded-full border-2 border-white shadow ${
                                stage.result_status === '已通过' ? 'bg-green-500' :
                                stage.result_status === '未通过' ? 'bg-red-500' :
                                'bg-blue-500'
                              }`}
                              title={`${stage.raw_stage_name || STAGE_TYPES[stage.stage_type]?.label}: ${format(stageDate, 'MM-dd')}`}
                            />
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="flex gap-3 mt-2 text-xs text-text-secondary">
                    {appStages.map(stage => (
                      <div key={stage.id} className="flex items-center gap-1">
                        <div className={`h-2 w-2 rounded-full ${
                          stage.result_status === '已通过' ? 'bg-green-500' :
                          stage.result_status === '未通过' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`} />
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
