# 部署说明

## GitHub Pages 部署

### 1. 创建 GitHub 仓库

将代码推送到 GitHub 仓库。

### 2. 配置环境变量

进入仓库 Settings → Secrets and variables → Actions → New repository secret:

- `VITE_SUPABASE_URL`: 你的 Supabase 项目 URL
- `VITE_SUPABASE_ANON_KEY`: 你的 Supabase anon key

### 3. 配置 GitHub Pages

进入 Settings → Pages:
- Source: GitHub Actions

### 4. 推送触发部署

代码推送到 main 分支后，GitHub Actions 会自动构建并部署。

访问地址: `https://ethanz11-creat.github.io/job-tracker/`

### 5. Supabase CORS 配置

在 Supabase Dashboard → API → URL Configuration 中，添加以下 URL 到 CORS 允许列表：

- `http://localhost:5173` (本地开发)
- `https://ethanz11-creat.github.io` (GitHub Pages)
- `https://ethanz11-creat.github.io/job-tracker/` (项目页面)

### 6. 配置 Supabase Auth Redirect URLs (可选)

在 Supabase Dashboard → Authentication → URL Configuration → Redirect URLs 中添加：

- `http://localhost:5173`
- `https://ethanz11-creat.github.io/job-tracker/`

## 本地构建测试

```bash
npm run build
npm run preview
```

## 自定义域名 (可选)

1. 在 `public/` 目录下创建 `CNAME` 文件，写入你的域名
2. 在域名 DNS 中添加 CNAME 记录指向 `<username>.github.io`
3. 在仓库 Settings → Pages 中配置 Custom domain
