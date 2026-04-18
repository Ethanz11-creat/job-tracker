import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useStages } from '../hooks/useStages'
import { useEvents } from '../hooks/useEvents'
import { EVENT_TYPE_LABELS } from '../lib/constants'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { stages } = useStages()
  const { events, addEvent } = useEvents()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    event_type: 'deadline' as const,
    event_date: '',
    location: '',
    notes: '',
  })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getDayEvents = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const stageEvents = stages.filter(s =>
      s.scheduled_date && format(parseISO(s.scheduled_date), 'yyyy-MM-dd') === dayStr
    )
    const calEvents = events.filter(e =>
      format(parseISO(e.event_date), 'yyyy-MM-dd') === dayStr
    )
    return [...stageEvents, ...calEvents]
  }

  const handleAdd = async () => {
    await addEvent({
      ...form,
      status: '待处理' as const,
    } as Parameters<typeof addEvent>[0])
    setOpen(false)
    setForm({ title: '', event_type: 'deadline', event_date: '', location: '', notes: '' })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-semibold">日历</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium w-32 text-center">
            {format(currentDate, 'yyyy年 MM月', { locale: zhCN })}
          </span>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />添加事件
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
        {['一', '二', '三', '四', '五', '六', '日'].map(d => (
          <div key={d} className="bg-surface-elevated p-3 text-center text-sm font-medium text-text-secondary">
            周{d}
          </div>
        ))}
        {days.map(day => {
          const dayEvents = getDayEvents(day)
          return (
            <div
              key={day.toISOString()}
              className={`bg-surface-elevated min-h-[100px] p-2 ${isToday(day) ? 'ring-2 ring-primary ring-inset' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${isSameMonth(day, currentDate) ? 'text-text' : 'text-text-muted'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((e, i) => (
                  <div key={i} className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary truncate">
                    {'stage_type' in e ? EVENT_TYPE_LABELS[e.stage_type] || e.stage_type : e.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-text-muted">+{dayEvents.length - 3}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加事件</DialogTitle>
            <DialogDescription>添加一个日程事件</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="标题" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <Select value={form.event_type} onValueChange={v => setForm({ ...form, event_type: v as typeof form.event_type })}>
              <SelectTrigger><SelectValue placeholder="事件类型" /></SelectTrigger>
              <SelectContent>
                {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="datetime-local" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} />
            <Input placeholder="地点" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <Button onClick={handleAdd} className="w-full">添加</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
