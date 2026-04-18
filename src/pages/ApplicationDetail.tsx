import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Clock, MapPin, DollarSign, Send, StickyNote, Tag, CheckCircle2, XCircle, MinusCircle } from 'lucide-react'
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
  if (!app) return <div className="p-6">岗位不存在</div>

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
    if (result === '已通过') return <CheckCircle2 className="h-4 w-4 text-green-500" />
    if (result === '未通过') return <XCircle className="h-4 w-4 text-red-500" />
    return <MinusCircle className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/applications" className="text-text-secondary hover:text-text">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-heading font-semibold">{app.position_name}</h1>
          <p className="text-sm text-text-secondary">
            <Link to={`/companies/${app.company_id}`} className="hover:text-primary">{app.company?.name}</Link>
          </p>
        </div>
        <Button variant="outline" onClick={() => setEditing(!editing)}>
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
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-text-secondary" />
                <Badge>{app.status}</Badge>
                <Badge variant="secondary">意向 {app.priority}/5</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <MapPin className="h-4 w-4" />{app.city || '未设置'}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <DollarSign className="h-4 w-4" />{app.salary_range || '未设置'}
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Send className="h-4 w-4" />{app.channel || '未设置'}
              </div>
              {app.deadline && (
                <div className="text-sm text-text-secondary">截止: {format(parseISO(app.deadline), 'yyyy-MM-dd')}</div>
              )}
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="h-4 w-4 text-text-secondary" />
                <span className="text-sm font-medium">备注</span>
              </div>
              <p className="text-sm text-text-secondary whitespace-pre-wrap">{app.notes || '暂无备注'}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold">流程节点</h2>
          <Button size="sm" onClick={() => setStageOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />新增节点
          </Button>
        </div>

        {stages.length === 0 ? (
          <p className="text-text-secondary">暂无流程节点</p>
        ) : (
          <div className="relative pl-6 border-l-2 border-border space-y-6">
            {stages.map(stage => (
              <div key={stage.id} className="relative">
                <div className="absolute -left-[29px] top-0 h-5 w-5 rounded-full bg-surface border-2 border-primary flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stage.raw_stage_name || STAGE_TYPES[stage.stage_type]?.label || stage.stage_type}</span>
                        {stage.round_number && <Badge variant="secondary">第 {stage.round_number} 轮</Badge>}
                        {statusIcon(stage.result_status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={stage.execution_status === '已完成' ? 'default' : stage.execution_status === '已预约' ? 'secondary' : 'outline'}>
                          {stage.execution_status}
                        </Badge>
                        <Badge variant={stage.result_status === '已通过' ? 'default' : stage.result_status === '未通过' ? 'destructive' : 'secondary'}>
                          {stage.result_status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                      {stage.scheduled_date && <span>预约: {format(parseISO(stage.scheduled_date), 'MM-dd HH:mm')}</span>}
                      {stage.completed_date && <span>完成: {format(parseISO(stage.completed_date), 'MM-dd HH:mm')}</span>}
                    </div>
                    {stage.feedback && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Tag className="h-3 w-3" />
                          <span className="font-medium">复盘</span>
                        </div>
                        {stage.feedback}
                      </div>
                    )}
                    {stage.strength_tags && stage.strength_tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {stage.strength_tags.map(tag => (
                          <Badge key={tag} variant="default" className="text-xs">{tag}</Badge>
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
