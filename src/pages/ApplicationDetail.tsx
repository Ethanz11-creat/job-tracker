import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Clock, MapPin, DollarSign, Send, FileText, CheckCircle2, XCircle, MinusCircle } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog'
import { useApplications } from '../hooks/useApplications'
import { useStages } from '../hooks/useStages'
import { STAGE_TYPES, MACRO_STATUSES, EXECUTION_STATUSES, RESULT_STATUSES } from '../lib/constants'
import { format, parseISO } from 'date-fns'
import type { StageType, Stage } from '../types'

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const { applications, updateApplication } = useApplications()
  const { stages, addStage } = useStages(id)
  const [editing, setEditing] = useState(false)
  const [stageOpen, setStageOpen] = useState(false)
  const [stageForm, setStageForm] = useState({
    stage_type: 'oa' as StageType,
    raw_stage_name: '',
    round_number: 1,
    execution_status: '待处理' as const,
    result_status: '待处理' as const,
    scheduled_date: '',
    completed_date: '',
    feedback: '',
  })

  const app = applications.find(a => a.id === id)
  if (!app) return <div className="p-6 font-body text-lg" style={{ color: '#6b6558' }}>岗位不存在</div>

  const handleUpdate = async (updates: Record<string, unknown>) => {
    await updateApplication(id!, updates)
    setEditing(false)
  }

  const handleAddStage = async () => {
    await addStage({
      application_id: id!,
      ...stageForm,
      event_category: STAGE_TYPES[stageForm.stage_type]?.category || 'assessment',
    } as Omit<Stage, 'id' | 'created_at' | 'user_id'>)
    setStageOpen(false)
    setStageForm({ stage_type: 'oa', raw_stage_name: '', round_number: 1, execution_status: '待处理', result_status: '待处理', scheduled_date: '', completed_date: '', feedback: '' })
  }

  const statusIcon = (result: string) => {
    if (result === '已通过') return <CheckCircle2 className="h-4 w-4" style={{ color: '#4ade80' }} strokeWidth={2} />
    if (result === '未通过') return <XCircle className="h-4 w-4" style={{ color: '#f87171' }} strokeWidth={2} />
    return <MinusCircle className="h-4 w-4" style={{ color: '#6b6558' }} strokeWidth={2} />
  }

  const statusPill = (status: string) => {
    const pillClass = MACRO_STATUSES[status]?.pillClass || 'status-gray'
    return <span className={`pill ${pillClass}`}>{status}</span>
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link to="/applications" className="transition-colors duration-200" style={{ color: '#6b6558' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e8e6e1'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b6558'}
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </Link>
        <div className="flex-1">
          <h1 className="page-title">{app.position_name}</h1>
          <p className="text-sm font-body mt-1" style={{ color: '#a09b8c' }}>
            <Link to={`/companies/${app.company_id}`} className="transition-colors duration-200 hover:text-[#c9a96e]"
              style={{ color: '#a09b8c' }}
            >{app.company?.name}</Link>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
          {editing ? '取消' : '编辑'}
        </Button>
      </div>

      {editing ? (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Input value={app.position_name} onChange={e => handleUpdate({ position_name: e.target.value })} />
            <Select value={app.status} onValueChange={v => handleUpdate({ status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.keys(MACRO_STATUSES).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={String(app.priority)} onValueChange={v => handleUpdate({ priority: Number(v) })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5].map(p => <SelectItem key={p} value={String(p)}>{p} 级意向</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" value={app.deadline || ''} onChange={e => handleUpdate({ deadline: e.target.value })} />
            <Input value={app.city || ''} placeholder="城市" onChange={e => handleUpdate({ city: e.target.value })} />
            <Input value={app.salary_range || ''} placeholder="薪资范围" onChange={e => handleUpdate({ salary_range: e.target.value })} />
            <Input value={app.channel || ''} placeholder="投递渠道" onChange={e => handleUpdate({ channel: e.target.value })} />
            <Textarea value={app.notes || ''} placeholder="备注" onChange={e => handleUpdate({ notes: e.target.value })} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-body">
                <Clock className="h-4 w-4" strokeWidth={1.5} style={{ color: '#6b6558' }} />
                {statusPill(app.status)}
                <Badge variant="secondary">意向 {app.priority}/5</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm font-body" style={{ color: '#a09b8c' }}>
                <MapPin className="h-4 w-4" strokeWidth={1.5} />{app.city || '未设置'}
              </div>
              <div className="flex items-center gap-2 text-sm font-body" style={{ color: '#a09b8c' }}>
                <DollarSign className="h-4 w-4" strokeWidth={1.5} />{app.salary_range || '未设置'}
              </div>
              <div className="flex items-center gap-2 text-sm font-body" style={{ color: '#a09b8c' }}>
                <Send className="h-4 w-4" strokeWidth={1.5} />{app.channel || '未设置'}
              </div>
              {app.deadline && (
                <div className="text-sm font-body" style={{ color: '#a09b8c' }}>截止: {format(parseISO(app.deadline), 'yyyy-MM-dd')}</div>
              )}
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" strokeWidth={1.5} style={{ color: '#6b6558' }} />
                <span className="text-sm font-heading">备注</span>
              </div>
              <p className="text-sm font-body whitespace-pre-wrap" style={{ color: '#a09b8c' }}>{app.notes || '暂无备注'}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl" style={{ color: '#e8e6e1' }}>流程节点</h2>
            <p className="text-sm font-body" style={{ color: '#6b6558' }}>记录面试进度</p>
          </div>
          <Button size="sm" onClick={() => setStageOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />新增节点
          </Button>
        </div>

        {stages.length === 0 ? (
          <p className="font-body text-sm" style={{ color: '#6b6558' }}>暂无流程节点</p>
        ) : (
          <div className="relative pl-6 space-y-4" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
            {stages.map((stage) => (
              <div key={stage.id} className="relative">
                <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full flex items-center justify-center"
                  style={{
                    background: '#0a0a0f',
                    border: '2px solid #c9a96e'
                  }}
                >
                  <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#c9a96e' }} />
                </div>
                <Card className="group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading text-sm" style={{ color: '#e8e6e1' }}>{stage.raw_stage_name || STAGE_TYPES[stage.stage_type]?.label || stage.stage_type}</span>
                        {stage.round_number && <Badge variant="secondary">第 {stage.round_number} 轮</Badge>}
                        {statusIcon(stage.result_status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={stage.execution_status === '已完成' ? 'success' : stage.execution_status === '已预约' ? 'info' : 'outline'}>
                          {stage.execution_status}
                        </Badge>
                        <Badge variant={stage.result_status === '已通过' ? 'success' : stage.result_status === '未通过' ? 'destructive' : 'secondary'}>
                          {stage.result_status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs font-body" style={{ color: '#6b6558' }}>
                      {stage.scheduled_date && <span>预约: {format(parseISO(stage.scheduled_date), 'MM-dd HH:mm')}</span>}
                      {stage.completed_date && <span>完成: {format(parseISO(stage.completed_date), 'MM-dd HH:mm')}</span>}
                    </div>
                    {stage.feedback && (
                      <div className="mt-3 p-3 rounded-md" style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-2 w-2 rounded-full" style={{ background: '#f0a830' }} />
                          <span className="font-heading text-xs" style={{ color: '#e8e6e1' }}>复盘</span>
                        </div>
                        <span className="font-body text-sm" style={{ color: '#a09b8c' }}>{stage.feedback}</span>
                      </div>
                    )}
                    {stage.strength_tags && stage.strength_tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {stage.strength_tags.map(tag => (
                          <Badge key={tag} variant="success" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                    {stage.weakness_tags && stage.weakness_tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {stage.weakness_tags.map(tag => (
                          <Badge key={tag} variant="destructive" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={stageOpen} onOpenChange={setStageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增流程节点</DialogTitle>
            <DialogDescription>记录该岗位的一个流程节点</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={stageForm.stage_type} onValueChange={v => setStageForm({ ...stageForm, stage_type: v as StageType })}>
              <SelectTrigger><SelectValue placeholder="节点类型" /></SelectTrigger>
              <SelectContent>
                {Object.entries(STAGE_TYPES).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="原始名称 (如: 交叉面、HRG沟通)" value={stageForm.raw_stage_name} onChange={e => setStageForm({ ...stageForm, raw_stage_name: e.target.value })} />
            <Input type="number" placeholder="轮次" value={stageForm.round_number} onChange={e => setStageForm({ ...stageForm, round_number: Number(e.target.value) })} />
            <Select value={stageForm.execution_status} onValueChange={v => setStageForm({ ...stageForm, execution_status: v as typeof stageForm.execution_status })}>
              <SelectTrigger><SelectValue placeholder="执行状态" /></SelectTrigger>
              <SelectContent>
                {EXECUTION_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={stageForm.result_status} onValueChange={v => setStageForm({ ...stageForm, result_status: v as typeof stageForm.result_status })}>
              <SelectTrigger><SelectValue placeholder="结果状态" /></SelectTrigger>
              <SelectContent>
                {RESULT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="datetime-local" placeholder="预约时间" value={stageForm.scheduled_date} onChange={e => setStageForm({ ...stageForm, scheduled_date: e.target.value })} />
            <Input type="datetime-local" placeholder="完成时间" value={stageForm.completed_date} onChange={e => setStageForm({ ...stageForm, completed_date: e.target.value })} />
            <Textarea placeholder="复盘笔记" value={stageForm.feedback} onChange={e => setStageForm({ ...stageForm, feedback: e.target.value })} />
            <Button onClick={handleAddStage} className="w-full">添加节点</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
