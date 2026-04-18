# AI 配置说明

## 当前能力

MVP 阶段已实现基于规则引擎的智能优先级建议，无需配置 AI Provider 即可使用。

## 规则引擎

根据以下条件自动生成 3-5 条推荐事项:
- 截止日期临近 (3天内)
- 阶段停滞超过7天
- 进入关键面试节点
- 测评/笔试即将到来
- 同公司多岗位并行
- 本周关键事件

## 接入外部模型 (可选)

项目预留了 AI Provider 抽象接口，支持接入任何 OpenAI-compatible API。

### 配置方式

在 `.env` 中添加:

```
VITE_AI_BASE_URL=https://api.openai.com/v1
VITE_AI_MODEL=gpt-4o-mini
VITE_AI_API_KEY=sk-your-key
```

### 支持的 Provider

- OpenAI
- Azure OpenAI
- 阿里云百炼
- 硅基流动
- 任何兼容 OpenAI API 格式的服务

### 未来扩展

接入模型后可扩展以下能力:
- 智能待办拆解
- 面试复盘总结
- 经验复用提示
- 简历优化建议
