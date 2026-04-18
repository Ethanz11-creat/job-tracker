# JobTracker - 求职申请管理看板

面向大学生实习/秋招/春招的轻量求职流程管理系统，支持多公司、多岗位、多流程节点的统一管理。

## 功能特性

- **首页总览**: 统计卡片、智能优先级建议、本周关键事件、近期截止、今日待办
- **公司视图**: 同公司多岗位并行进度、最远推进岗位、经验复用提示
- **岗位列表**: 按公司/阶段/截止日期/意向等级筛选排序
- **岗位详情**: 基本信息、节点时间线、复盘标签、材料状态
- **宏观看板**: 按待关注/待投递/已投递/测评中/面试中/Offer/已结束 七列展示
- **日历页面**: 统一展示截止、测评、笔试、面试等各类事件
- **甘特图**: 岗位级时间进度可视化
- **AI 智能建议**: 规则引擎生成优先级建议，预留模型接入接口

## 技术栈

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL + REST API)
- GitHub Pages 部署

## 快速开始

### 1. 配置 Supabase

1. 创建 [Supabase](https://supabase.com) 项目
2. 执行 `supabase/migrations/001_initial.sql` 和 `002_events_tasks.sql`
3. 复制项目 URL 和 anon key

### 2. 本地开发

```bash
# 克隆项目
git clone <repo-url>
cd job-tracker

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env，填入 Supabase 配置

# 启动开发服务器
npm run dev
```

### 3. 部署到 GitHub Pages

1. Fork 本项目
2. 在 GitHub Settings → Pages 中配置 Source 为 GitHub Actions
3. 在仓库 Settings → Secrets and variables → Actions 中添加:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. 推送代码到 main 分支，自动触发部署

## 数据模型

详见 [DATA_MODEL.md](DATA_MODEL.md)

## AI 配置

详见 [AI_SETUP.md](AI_SETUP.md)

## 目录结构

```
job-tracker/
├── src/
│   ├── components/     # UI 组件
│   ├── pages/          # 页面组件
│   ├── hooks/          # 数据 hooks
│   ├── lib/            # 工具函数 + AI
│   ├── types/          # TypeScript 类型
│   └── data/           # 演示数据
├── supabase/
│   └── migrations/     # 数据库迁移
├── docs/               # 项目文档
└── .github/workflows/  # CI/CD
```
