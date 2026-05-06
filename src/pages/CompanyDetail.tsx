import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Briefcase, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useCompanies } from '../hooks/useCompanies'
import { useApplications } from '../hooks/useApplications'
import { useStages } from '../hooks/useStages'
import { MACRO_STATUSES } from '../lib/constants'

export function CompanyDetail() {
  const { id } = useParams<{ id: string }>()
  const { companies } = useCompanies()
  const { applications } = useApplications()
  const { stages } = useStages()

  const company = companies.find(c => c.id === id)
  const companyApps = applications.filter(a => a.company_id === id)
  const activeApps = companyApps.filter(a => a.status !== '已结束')

  if (!company) {
    return <div className="p-6 font-body text-lg" style={{ color: '#6b6558' }}>公司不存在</div>
  }

  const furthestApp = activeApps.sort((a, b) => {
    const orderA = MACRO_STATUSES[a.status]?.order || 0
    const orderB = MACRO_STATUSES[b.status]?.order || 0
    return orderB - orderA
  })[0]

  const statusPill = (status: string) => {
    const pillClass = MACRO_STATUSES[status]?.pillClass || 'status-gray'
    return <span className={`pill ${pillClass}`}>{status}</span>
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link to="/companies" className="transition-colors duration-200" style={{ color: '#6b6558' }}
          onMouseEnter={e => e.currentTarget.style.color = '#e8e6e1'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b6558'}
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="page-title">{company.name}</h1>
          <p className="text-sm font-body mt-1" style={{ color: '#a09b8c' }}>{company.industry} · {company.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-body" style={{ color: '#6b6558' }}>岗位总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)' }}
              >
                <Briefcase className="h-4 w-4" style={{ color: '#6ba3f5' }} strokeWidth={1.5} />
              </div>
              <span className="text-3xl font-heading">{companyApps.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-body" style={{ color: '#6b6558' }}>进行中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.15)' }}
              >
                <Clock className="h-4 w-4" style={{ color: '#f472b6' }} strokeWidth={1.5} />
              </div>
              <span className="text-3xl font-heading">{activeApps.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-body" style={{ color: '#6b6558' }}>最远推进</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.15)' }}
              >
                <TrendingUp className="h-4 w-4" style={{ color: '#4ade80' }} strokeWidth={1.5} />
              </div>
              <span className="text-xl font-heading">
                {furthestApp ? statusPill(furthestApp.status) : '无'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-xl" style={{ color: '#e8e6e1' }}>岗位进度</h2>
        {companyApps.length === 0 ? (
          <p className="font-body text-sm" style={{ color: '#6b6558' }}>暂无岗位记录</p>
        ) : (
          companyApps.map((app) => {
            const appStages = stages.filter(s => s.application_id === app.id)
            return (
              <Link key={app.id} to={`/applications/${app.id}`}>
                <Card className="cursor-pointer group mb-3">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-heading text-sm" style={{ color: '#e8e6e1' }}>{app.position_name}</h3>
                        <p className="text-sm font-body mt-1" style={{ color: '#a09b8c' }}>
                          {app.city} · {app.salary_range} · {app.channel}
                        </p>
                      </div>
                      {statusPill(app.status)}
                    </div>
                    {appStages.length > 0 && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {appStages.slice(0, 5).map(stage => (
                          <div key={stage.id} className="flex items-center gap-1.5 text-xs font-body" style={{ color: '#a09b8c' }}>
                            <div className="h-2 w-2 rounded-full" style={{
                              background: stage.result_status === '已通过' ? '#4ade80' : stage.result_status === '未通过' ? '#f87171' : '#6b6558'
                            }} />
                            {stage.raw_stage_name || stage.stage_type}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })
        )}
      </div>

      {companyApps.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-heading text-sm flex items-center gap-2" style={{ color: '#f0a830' }}>
              <div className="h-2 w-2 rounded-full" style={{ background: '#f0a830' }} />
              经验复用提示
            </h3>
            <p className="text-sm font-body mt-2" style={{ color: '#a09b8c' }}>
              你在 {company.name} 申请了 {companyApps.length} 个岗位，{furthestApp?.position_name} 已推进到 {furthestApp?.status} 阶段。
              同公司面试经验可以复用，建议关注公司文化、业务方向等共性内容。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
