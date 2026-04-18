import { useState } from 'react'
import { Plus, Search, ArrowUpDown } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog'
import { Badge } from '../components/ui/badge'
import { useApplications } from '../hooks/useApplications'
import { useCompanies } from '../hooks/useCompanies'
import { MACRO_STATUSES, PRIORITY_LABELS } from '../lib/constants'
import { Link } from 'react-router-dom'
import { format, parseISO, differenceInDays } from 'date-fns'

export function Applications() {
  const { applications, addApplication } = useApplications()
  const { companies } = useCompanies()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updated_at')

  const [form, setForm] = useState({
    company_id: '',
    position_name: '',
    status: '待关注' as const,
    priority: 3,
    deadline: '',
    city: '',
    salary_range: '',
    channel: '',
    notes: '',
  })

  const handleSubmit = async () => {
    if (!form.company_id || !form.position_name.trim()) return
    await addApplication(form)
    setForm({ company_id: '', position_name: '', status: '待关注', priority: 3, deadline: '', city: '', salary_range: '', channel: '', notes: '' })
    setOpen(false)
  }

  const filtered = applications
    .filter(a => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false
      if (companyFilter !== 'all' && a.company_id !== companyFilter) return false
      if (search && !a.position_name.toLowerCase().includes(search.toLowerCase()) &&
        !a.company?.name?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      }
      if (sortBy === 'priority') return b.priority - a.priority
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-semibold">岗位列表</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          添加岗位
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="搜索岗位或公司..."
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="宏观阶段" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部阶段</SelectItem>
            {Object.keys(MACRO_STATUSES).map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="公司" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部公司</SelectItem>
            {companies.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[150px]">
            <ArrowUpDown className="mr-1 h-4 w-4" />
            <SelectValue placeholder="排序" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated_at">最近更新</SelectItem>
            <SelectItem value="deadline">截止日期</SelectItem>
            <SelectItem value="priority">意向等级</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map(app => (
          <Link key={app.id} to={`/applications/${app.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{app.position_name}</h3>
                      <Badge style={{ backgroundColor: MACRO_STATUSES[app.status]?.color + '20', color: MACRO_STATUSES[app.status]?.color }}>
                        {app.status}
                      </Badge>
                      <Badge variant="secondary">{PRIORITY_LABELS[app.priority]}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                      <span>{app.company?.name}</span>
                      <span>{app.city}</span>
                      <span>{app.salary_range}</span>
                      <span>{app.channel}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {app.deadline && (
                      <div className="text-sm">
                        {differenceInDays(parseISO(app.deadline), new Date()) <= 3 ? (
                          <span className="text-red-500 font-medium">
                            剩 {differenceInDays(parseISO(app.deadline), new Date())} 天
                          </span>
                        ) : (
                          <span className="text-text-secondary">{format(parseISO(app.deadline), 'MM-dd')}</span>
                        )}
                      </div>
                    )}
                    <div className="text-xs text-text-muted mt-1">
                      {format(parseISO(app.updated_at), 'MM-dd HH:mm')} 更新
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加岗位</DialogTitle>
            <DialogDescription>记录一个新的求职岗位</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={form.company_id} onValueChange={v => setForm({ ...form, company_id: v })}>
              <SelectTrigger>
                <SelectValue placeholder="选择公司 *" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="岗位名称 *" value={form.position_name} onChange={e => setForm({ ...form, position_name: e.target.value })} />
            <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as typeof form.status })}>
              <SelectTrigger><SelectValue placeholder="宏观阶段" /></SelectTrigger>
              <SelectContent>
                {Object.keys(MACRO_STATUSES).map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(form.priority)} onValueChange={v => setForm({ ...form, priority: Number(v) })}>
              <SelectTrigger><SelectValue placeholder="意向等级" /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(p => (
                  <SelectItem key={p} value={String(p)}>{PRIORITY_LABELS[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" placeholder="截止日期" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            <Input placeholder="城市" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            <Input placeholder="薪资范围" value={form.salary_range} onChange={e => setForm({ ...form, salary_range: e.target.value })} />
            <Input placeholder="投递渠道" value={form.channel} onChange={e => setForm({ ...form, channel: e.target.value })} />
            <Button onClick={handleSubmit} className="w-full">添加</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
