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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-heading font-semibold">宏观看板</h1>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map(status => {
          const apps = applications.filter(a => a.status === status)
          return (
            <div
              key={status}
              className="flex-shrink-0 w-72 space-y-3"
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(status)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: MACRO_STATUSES[status]?.color }}
                  />
                  <span className="font-medium">{status}</span>
                </div>
                <span className="text-sm text-text-secondary">{apps.length}</span>
              </div>

              <div className="space-y-2 min-h-[100px]">
                {apps.map(app => (
                  <Card
                    key={app.id}
                    draggable
                    onDragStart={() => handleDragStart(app.id)}
                    className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-3">
                      <div className="font-medium text-sm">{app.position_name}</div>
                      <div className="text-xs text-text-secondary mt-1">{app.company?.name}</div>
                      {app.deadline && (
                        <div className="text-xs mt-2">
                          {differenceInDays(parseISO(app.deadline), new Date()) <= 3 ? (
                            <span className="text-red-500">
                              剩 {differenceInDays(parseISO(app.deadline), new Date())} 天
                            </span>
                          ) : (
                            <span className="text-text-muted">
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
