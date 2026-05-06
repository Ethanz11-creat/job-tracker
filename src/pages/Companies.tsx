import { useState } from 'react'
import { Building2, Plus, ExternalLink, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { useCompanies } from '../hooks/useCompanies'
import { useApplications } from '../hooks/useApplications'
import { Link } from 'react-router-dom'

export function Companies() {
  const { companies, addCompany } = useCompanies()
  const { applications } = useApplications()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', industry: '', website: '', location: '', size: '' })

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    await addCompany(form)
    setForm({ name: '', industry: '', website: '', location: '', size: '' })
    setOpen(false)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="page-title">公司视图</h1>
          <p className="section-subtitle mt-2">记录感兴趣的公司</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          添加公司
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((company) => {
          const companyApps = applications.filter(a => a.company_id === company.id)
          const activeApps = companyApps.filter(a => a.status !== '已结束')
          return (
            <Link key={company.id} to={`/companies/${company.id}`}>
              <Card className="cursor-pointer h-full group">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.15)'
                      }}
                    >
                      <Building2 className="h-5 w-5" style={{ color: '#6ba3f5' }} strokeWidth={1.5} />
                    </div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5 pt-0">
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#a09b8c' }}>
                    <MapPin className="h-4 w-4" strokeWidth={1.5} />
                    {company.location || '未知地点'}
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#a09b8c' }}>
                    <Users className="h-4 w-4" strokeWidth={1.5} />
                    {company.size || '规模未知'}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span style={{ color: '#6b6558' }}>{companyApps.length} 个岗位</span>
                    <span style={{ color: '#c9a96e' }} className="font-medium">{activeApps.length} 个进行中</span>
                  </div>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-body transition-colors duration-200"
                      style={{ color: '#6ba3f5' }}
                      onClick={e => e.stopPropagation()}
                      onMouseEnter={e => e.currentTarget.style.color = '#93c5fd'}
                      onMouseLeave={e => e.currentTarget.style.color = '#6ba3f5'}
                    >
                      官网 <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加公司</DialogTitle>
            <DialogDescription>录入你感兴趣或正在投递的公司信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="公司名称 *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="行业" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} />
            <Input placeholder="地点" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <Input placeholder="规模 (如 10000+)" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} />
            <Input placeholder="官网链接" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
            <Button onClick={handleSubmit} className="w-full">添加</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
