import { useState } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { useApplications } from '../hooks/useApplications'
import { MACRO_STATUSES } from '../lib/constants'
import { format, parseISO, differenceInDays } from 'date-fns'
import type { MacroStatus } from '../types'

export function Board() {
  const { applications, updateApplication } = useApplications()
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const statuses = Object.keys(MACRO_STATUSES) as MacroStatus[]

  const handleDragStart = (id: string) => {
    setDraggingId(id)
  }

  const handleDrop = async (status: MacroStatus) => {
    if (!draggingId) return
    await updateApplication(draggingId, { status })
    setDraggingId(null)
  }

  const statusPill = (status: string) => {
    const pillClass = MACRO_STATUSES[status]?.pillClass || 'status-gray'
    return <span className={`pill ${pillClass}`}>{status}</span>
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="page-title">宏观看板</h1>
        <p className="section-subtitle mt-2">拖拽卡片更新进度</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => {
          const apps = applications.filter(a => a.status === status)
          return (
            <div
              key={status}
              className="flex-shrink-0 w-72 space-y-2"
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(status)}
            >
              {/* Column header */}
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                <div className="flex items-center gap-2">
                  {statusPill(status)}
                </div>
                <span className="text-sm font-medium" style={{ color: '#6b6558' }}>{apps.length}</span>
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-[80px]">
                {apps.map((app) => (
                  <Card
                    key={app.id}
                    draggable
                    onDragStart={() => handleDragStart(app.id)}
                    className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-[rgba(255,255,255,0.12)]"
                  >
                    <CardContent className="p-3.5">
                      <div className="font-heading text-sm" style={{ color: '#e8e6e1' }}>{app.position_name}</div>
                      <div className="text-xs mt-1" style={{ color: '#a09b8c' }}>{app.company?.name}</div>
                      {app.deadline && (
                        <div className="text-xs mt-2.5 font-body">
                          {differenceInDays(parseISO(app.deadline), new Date()) <= 3 ? (
                            <span style={{ color: '#f87171' }} className="font-medium">
                              剩 {differenceInDays(parseISO(app.deadline), new Date())} 天
                            </span>
                          ) : (
                            <span style={{ color: '#6b6558' }}>
                              {format(parseISO(app.deadline), 'MM-dd')}
                            </span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
