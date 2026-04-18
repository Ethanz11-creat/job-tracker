import { supabase, getAnonymousUserId } from '../lib/supabase'

export async function seedDemoData() {
  const userId = getAnonymousUserId()

  // Check if data already exists
  const { count } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (count && count > 0) {
    console.log('Demo data already exists, skipping seed')
    return
  }

  const companies = [
    { name: '字节跳动', industry: '互联网', website: 'https://www.bytedance.com', location: '北京/上海/深圳', size: '10000+', user_id: userId },
    { name: '腾讯', industry: '互联网', website: 'https://www.tencent.com', location: '深圳', size: '10000+', user_id: userId },
    { name: '阿里巴巴', industry: '互联网/电商', website: 'https://www.alibaba.com', location: '杭州', size: '10000+', user_id: userId },
    { name: '美团', industry: '本地生活', website: 'https://www.meituan.com', location: '北京', size: '10000+', user_id: userId },
    { name: '小米', industry: '智能硬件', website: 'https://www.mi.com', location: '北京', size: '10000+', user_id: userId },
  ]

  const { data: companyData, error: companyError } = await supabase
    .from('companies')
    .insert(companies)
    .select()

  if (companyError) {
    console.error('Error seeding companies:', companyError)
    return
  }

  const companyMap = new Map(companyData.map(c => [c.name, c.id]))

  const applications = [
    { company_id: companyMap.get('字节跳动'), position_name: '后端开发工程师', status: '面试中', priority: 5, deadline: '2026-04-25', city: '北京', salary_range: '25k-35k', channel: '官网投递', notes: '一面已通过，二面预约中', user_id: userId },
    { company_id: companyMap.get('字节跳动'), position_name: '算法工程师', status: '测评中', priority: 4, deadline: '2026-04-20', city: '上海', salary_range: '30k-45k', channel: '内推', notes: '刚完成笔试', user_id: userId },
    { company_id: companyMap.get('腾讯'), position_name: '前端开发工程师', status: '已投递', priority: 4, deadline: '2026-04-30', city: '深圳', salary_range: '20k-30k', channel: 'BOSS直聘', notes: '等待面试通知', user_id: userId },
    { company_id: companyMap.get('阿里巴巴'), position_name: 'Java开发工程师', status: '待投递', priority: 3, deadline: '2026-05-05', city: '杭州', salary_range: '22k-32k', channel: '官网', notes: '简历还需优化', user_id: userId },
    { company_id: companyMap.get('美团'), position_name: '产品经理', status: '已结束', priority: 2, deadline: '2026-04-10', city: '北京', salary_range: '18k-28k', channel: '实习僧', notes: 'HR面未通过', user_id: userId },
    { company_id: companyMap.get('小米'), position_name: '嵌入式工程师', status: '待关注', priority: 3, city: '北京', salary_range: '15k-25k', channel: '校园招聘', notes: '观望中', user_id: userId },
  ]

  const { data: appData, error: appError } = await supabase
    .from('applications')
    .insert(applications)
    .select()

  if (appError) {
    console.error('Error seeding applications:', appError)
    return
  }

  const appMap = new Map(appData.map(a => [a.position_name, a.id]))

  const stages = [
    { application_id: appMap.get('后端开发工程师'), stage_type: 'oa', raw_stage_name: '在线测评', event_category: 'assessment', execution_status: '已完成', result_status: '已通过', completed_date: '2026-04-01T10:00:00Z', feedback: '行测+编程题，难度中等', user_id: userId },
    { application_id: appMap.get('后端开发工程师'), stage_type: 'technical', raw_stage_name: '技术面', round_number: 1, event_category: 'interview', execution_status: '已完成', result_status: '已通过', scheduled_date: '2026-04-05T14:00:00Z', completed_date: '2026-04-05T15:00:00Z', feedback: '问了分布式系统和MySQL优化，回答不错', strength_tags: ['系统设计', '数据库'], weakness_tags: ['网络协议'], user_id: userId },
    { application_id: appMap.get('后端开发工程师'), stage_type: 'technical', raw_stage_name: '二面', round_number: 2, event_category: 'interview', execution_status: '已预约', result_status: '待处理', scheduled_date: '2026-04-20T10:00:00Z', feedback: '', user_id: userId },
    { application_id: appMap.get('算法工程师'), stage_type: 'written_test', raw_stage_name: '笔试', event_category: 'assessment', execution_status: '已完成', result_status: '无反馈', completed_date: '2026-04-10T09:00:00Z', feedback: '4道算法题，完成3道', user_id: userId },
    { application_id: appMap.get('前端开发工程师'), stage_type: 'oa', raw_stage_name: 'Code Test', event_category: 'assessment', execution_status: '已预约', result_status: '待处理', scheduled_date: '2026-04-22T14:00:00Z', feedback: '', user_id: userId },
    { application_id: appMap.get('产品经理'), stage_type: 'technical', raw_stage_name: '业务面', round_number: 1, event_category: 'interview', execution_status: '已完成', result_status: '已通过', completed_date: '2026-04-02T10:00:00Z', feedback: '产品思维不错', user_id: userId },
    { application_id: appMap.get('产品经理'), stage_type: 'hr', raw_stage_name: 'HRG沟通', event_category: 'interview', execution_status: '已完成', result_status: '未通过', completed_date: '2026-04-08T15:00:00Z', feedback: '期望薪资过高，HC冻结', weakness_tags: ['薪资谈判'], user_id: userId },
  ]

  const { error: stageError } = await supabase.from('stages').insert(stages)
  if (stageError) {
    console.error('Error seeding stages:', stageError)
  }

  const tasks = [
    { title: '完善字节后端简历项目描述', due_date: '2026-04-19', priority: 'high', status: 'todo', source: 'manual', user_id: userId },
    { title: '准备腾讯前端面试八股文', due_date: '2026-04-21', priority: 'medium', status: 'in_progress', source: 'manual', user_id: userId },
    { title: '复盘美团HR面失败经验', due_date: '2026-04-20', priority: 'medium', status: 'todo', source: 'manual', user_id: userId },
  ]

  const { error: taskError } = await supabase.from('tasks').insert(tasks)
  if (taskError) {
    console.error('Error seeding tasks:', taskError)
  }

  console.log('Demo data seeded successfully')
}
