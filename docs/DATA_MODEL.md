# 数据模型说明

## 核心表

### companies (公司)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| name | text | 公司名称 |
| industry | text | 行业 |
| website | text | 官网 |
| location | text | 地点 |
| size | text | 规模 |
| user_id | text | 用户标识 (匿名) |

### applications (岗位申请)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| company_id | uuid | 关联公司 |
| position_name | text | 岗位名称 |
| status | text | 宏观阶段 |
| priority | int | 意向等级 1-5 |
| deadline | date | 截止日期 |
| city | text | 城市 |
| salary_range | text | 薪资范围 |
| channel | text | 投递渠道 |
| notes | text | 备注 |

### stages (流程节点)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| application_id | uuid | 关联岗位 |
| stage_type | text | 标准化类型 |
| raw_stage_name | text | 公司原始叫法 |
| round_number | int | 轮次 |
| event_category | text | 事件分类 |
| execution_status | text | 执行状态 |
| result_status | text | 结果状态 |
| scheduled_date | timestamptz | 预约时间 |
| completed_date | timestamptz | 完成时间 |
| feedback | text | 复盘笔记 |
| strength_tags | text[] | 优势标签 |
| weakness_tags | text[] | 不足标签 |

### events (日历事件)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| application_id | uuid | 关联岗位 (可选) |
| company_id | uuid | 关联公司 (可选) |
| event_type | text | 事件类型 |
| title | text | 标题 |
| event_date | timestamptz | 事件时间 |
| status | text | 状态 |

### tasks (待办)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| application_id | uuid | 关联岗位 (可选) |
| title | text | 标题 |
| due_date | date | 截止日期 |
| priority | text | 优先级 |
| status | text | 状态 |
| source | text | 来源 (手动/AI) |

## 状态设计

### 宏观阶段 (Application.status)
- 待关注 → 待投递 → 已投递 → 测评中 → 面试中 → Offer → 已结束

### 标准化流程节点 (Stage.stage_type)
- oa, written_test, ai_coding, technical, business, leader, hr, offer, ended

### 执行状态 (Stage.execution_status)
- 待处理, 已预约, 已完成

### 结果状态 (Stage.result_status)
- 待处理, 已通过, 未通过, 无反馈
