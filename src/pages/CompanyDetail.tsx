import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Briefcase, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useCompanies } from '../hooks/useCompanies'
import { useApplications } from '../hooks/useApplications'
import { useStages } from '../hooks/useStages'
import { MACRO_STATUSES } from '../lib/constants'
// import { format, parseISO } from 'date-fns'

export function CompanyDetail() {
  const { id } = useParams<{ id: string }>()
  const { companies } = useCompanies()
  const { applications } = useApplications()
  const { stages } = useStages()

  const company = companies.find(c => c.id === id)
  const companyApps = applications.filter(a => a.company_id === id)
  const activeApps = companyApps.filter(a => a.status !== '已结束')

  if (!company) {
    return <div className="p-6">公司不存在</div>
  }

  const furthestApp = activeApps.sort((a, b) => {
    const orderA = MACRO_STATUSES[a.status]?.order || 0
    const orderB = MACRO_STATUSES[b.status]?.order || 0
    return orderB - orderA
  })[0]

  // const mostRecentApp = activeApps.sort((a, b) =>
  //   new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  // )[0]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/companies" className="text-text-secondary hover:text-text">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-semibold">{company.name}</h1>
          <p className="text-sm text-text-secondary">{company.industry} · {company.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-text-secondary">岗位总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="text-3xl font-bold">{companyApps.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-text-secondary">进行中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="text-3xl font-bold">{activeApps.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-text-secondary">最远推进</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-lg font-bold">
                {furthestApp ? furthestApp.status : '无'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-heading font-semibold">岗位进度</h2>
        {companyApps.length === 0 ? (
          <p className="text-text-secondary">暂无岗位记录</p>
        ) : (
          companyApps.map(app => {
            const appStages = stages.filter(s => s.application_id === app.id)
            return (
              <Link key={app.id} to={`/applications/${app.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer mb-3">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{app.position_name}</h3>
                        <p className="text-sm text-text-secondary mt-1">
                          {app.city} · {app.salary_range} · {app.channel}
                        </p>
                      </div>
                      <Badge style={{ backgroundColor: MACRO_STATUSES[app.status]?.color + '20', color: MACRO_STATUSES[app.status]?.color, borderColor: MACRO_STATUSES[app.status]?.color + '40' }}>
                        {app.status}
                      </Badge>
                    </div>
                    {appStages.length > 0 && (
                      <div className="mt-3 flex gap-2">
                        {appStages.slice(0, 5).map(stage => (
                          <div key={stage.id} className="flex items-center gap-1 text-xs">
                            <div className={`h-2 w-2 rounded-full ${stage.result_status === '已通过' ? 'bg-green-500' : stage.result_status === '未通过' ? 'bg-red-500' : 'bg-gray-400'}`} />
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
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <h3 className="font-medium text-primary">经验复用提示</h3>
            <p className="text-sm text-text-secondary mt-1">
              你在 {company.name} 申请了 {companyApps.length} 个岗位，{furthestApp?.position_name} 已推进到 {furthestApp?.status} 阶段。
              同公司面试经验可以复用，建议关注公司文化、业务方向等共性内容。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
