# MateUP 一个月上线分析 — 坑点 / 前置改造 / 部署方案

> 最后更新：2026-05-15
> 基于当前代码 master 分支（PR #5 合并后）

---

## 一、上线前必须改的坑

当前代码"看上去完成了"，但直接上线会出问题的地方：

### 1.1 硬编码 & 假数据依赖

| # | 位置 | 问题 | 严重度 | 修复方式 |
|---|------|------|--------|---------|
| 1 | `constants/config.ts:3-4` | API 地址 fallback 为 `192.168.3.14:3000`，mock 关闭后直接指向内网 | **P0** | 改 fallback 为空串或生产域名，`.env.production` 必须配置 |
| 2 | `api/index.ts:55-58` | `VITE_USE_MOCK` 默认 `true`，生产构建如果忘配 `.env` 会打包 mock 拦截器 | **P0** | 改为 `import.meta.env.PROD ? false : (VITE_USE_MOCK !== 'false')`，生产环境默认关闭 |
| 3 | `pages/ProfilePage.tsx:40-48` | 用户数据 `小明同学 / 139****8888 / VIP3` 全部硬编码，不读 Store | **P0** | 从 `useUserStore` 读取真实用户信息 |
| 4 | `pages/CoverPage.tsx:8-33` | 热门陪玩师列表硬编码在组件里（3 条假数据） | **P1** | 接 `GET /api/players/hot` API |
| 5 | `pages/PaymentPage.tsx:117` | 支付方式只有 `mock`，无真实支付渠道 | **P1** | 上线前至少接入一个支付方式（微信/支付宝/Apple IAP） |
| 6 | `pages/ProfilePage.tsx:62-68` | 普通用户菜单 "余额 ¥856.00" / "5张可用" 硬编码 | **P1** | 接用户钱包 API |
| 7 | `services/websocket.ts:115` | `sendChatMessage` 中 `from: ''` 写死空串 | **P1** | 从 UserStore 获取当前用户 ID |

### 1.2 权限校验缺失

| # | 问题 | 影响 | 修复方式 |
|---|------|------|---------|
| 1 | **无全局路由守卫** — 未登录用户可直接访问 `/orders`、`/profile`、`/chat` 等页面 | **P0** | 创建 `AuthGuard` 组件包裹需登录路由，未登录重定向到 `/login` |
| 2 | **PlayerRouteGuard 有 bug** — `navigate()` 在渲染期调用（应在 useEffect 中），且无 loading 态 | **P1** | 用 `<Navigate to="/apply-player" replace />` 替代 |
| 3 | **Token 无过期校验** — 前端只检查 `localStorage` 有无 token，不验证是否过期 | **P1** | 解码 JWT payload 检查 `exp`，过期则走 refresh 或重登录 |
| 4 | **401 拦截跳转用 `window.location.href = '#/login'`** — 但路由用的是 `BrowserRouter` 不是 `HashRouter`，跳转会错 | **P0** | 改为 `window.location.href = '/login'` 或用路由 API |

### 1.3 错误处理不足

| # | 问题 | 影响 | 修复方式 |
|---|------|------|---------|
| 1 | **13 处 `alert()` 调用** — 原生弹窗在 WebView/App 里体验差 | **P1** | 统一 Toast 组件（可用 Framer Motion 动画） |
| 2 | **11 处 `.catch(() => {})` 静默吞错** — 页面数据加载失败无任何提示 | **P1** | 最少显示 "加载失败，点击重试" |
| 3 | **无 ErrorBoundary** — React 渲染崩溃直接白屏 | **P0** | 顶层加 ErrorBoundary，渲染错误时显示 fallback 页面 |
| 4 | **API 网络错误只 console.error** — 用户无感知 | **P1** | 全局 Toast 或 notification 提示网络异常 |

### 1.4 性能 & 安全

| # | 问题 | 影响 | 修复方式 |
|---|------|------|---------|
| 1 | **mock 数据打入生产 bundle** — `src/mocks/` 整个目录会被打包 | **P0** | 动态 `import()` + 条件判断，确保生产构建 tree-shaking 掉 mock 代码 |
| 2 | **无 CSP / XSS 防护** — 评论/聊天内容直接渲染，无 sanitize | **P1** | 富文本场景用 DOMPurify 或只允许纯文本 |
| 3 | **无 .env.example** — 新开发者不知道需要配哪些环境变量 | **P1** | 创建 `.env.example` 列出所有 `VITE_*` 变量 |
| 4 | **WebSocket Token 拼在 URL** — `?token=xxx` 在服务器日志和浏览器历史中可见 | **P2** | 改为首条消息认证或 Sec-WebSocket-Protocol 头传递 |

---

## 二、新功能的前置改造

### 2.1 优惠券系统

**当前差什么：**

| 层面 | 缺失 | 改造方案 |
|------|------|---------|
| **类型** | 无 Coupon 类型 | `src/types/coupon.ts` — `Coupon { id, code, type, value, minOrder, expireAt, used }` |
| **Store** | 无 CouponStore | `src/store/couponStore.ts` — 缓存可用券列表 |
| **API** | 无优惠券 API | `src/api/coupon.ts` — `getCoupons / applyCoupon / removeCoupon` |
| **页面** | PaymentPage 无券选择入口 | 在 PaymentPage 增加"优惠券"选择区域，弹出 BottomSheet 选券 |
| **后端** | 无券表和核销逻辑 | Prisma 增加 `Coupon` / `UserCoupon` model，订单创建时校验 |
| **前置改造** | BottomSheet 组件已有，**但缺通用列表选择模式** | BottomSheet 增加 `mode="select"` prop 支持单选列表 |

**工作量估算：** 前端 4h + 后端 4h

### 2.2 活动聚合页

**当前差什么：**

| 层面 | 缺失 | 改造方案 |
|------|------|---------|
| **路由** | 无 `/activity` 和 `/activity/:id` 路由 | App.tsx 添加 2 条 lazy 路由 |
| **页面** | 无 ActivityPage / ActivityDetailPage | 新建 2 个页面组件 |
| **API** | 无活动 API | `src/api/activity.ts` — `getActivities / getActivityDetail` |
| **首页入口** | PlayerListPage 顶部无活动 Banner 入口 | 复用 CoverPage 的轮播逻辑，或新建 BannerCarousel 组件 |
| **前置改造** | **路由结构需支持嵌套**（活动详情 → 陪玩师详情 → 下单） | 当前扁平路由结构无需改，`useNavigate` 已支持多级跳转 |

**工作量估算：** 前端 6h + 后端 3h

### 2.3 IM 消息回调（服务端推送消息到前端）

**当前差什么：**

| 层面 | 缺失 | 改造方案 |
|------|------|---------|
| **WS 消息类型** | 只处理 `chat` / `ack` / `pong`，不支持系统通知 | `handleMessage` 增加 `order_status` / `system_notify` 等 type |
| **Store 联动** | WS 消息不更新 OrderStore / NotificationStore | 新增 WS → Store 桥接逻辑，收到 `order_status` 消息时更新订单状态 |
| **通知中心** | NotificationPage 是纯静态页面 | 接入真实通知数据，WS 推送 + API 拉取历史 |
| **未读角标** | TabBar 聊天 Tab 无未读数 | ChatStore 增加 `totalUnread` 计算属性，TabBar 订阅显示 |
| **前置改造** | **WS 消息分发架构需重构** | 当前 `WebSocketManager` 只支持 chat handler；需改为按消息类型分发到不同 handler |

**WS 消息分发改造方案：**

```typescript
// 当前：只有一个 messageHandlers
private messageHandlers: Set<MessageHandler> = new Set()

// 改为：按 type 注册
private handlers: Map<string, Set<(data: unknown) => void>> = new Map()

on(type: string, handler: (data: unknown) => void) {
  if (!this.handlers.has(type)) this.handlers.set(type, new Set())
  this.handlers.get(type)!.add(handler)
  return () => { this.handlers.get(type)?.delete(handler) }
}
```

**工作量估算：** 前端 8h + 后端 6h

### 2.4 通用前置改造清单（所有新功能都需要）

| # | 改造项 | 说明 | 工作量 |
|---|--------|------|--------|
| 1 | **Toast / Notification 组件** | 替代 alert()，所有交互反馈用 Toast | 2h |
| 2 | **ErrorBoundary** | 顶层渲染错误兜底 | 1h |
| 3 | **AuthGuard 路由守卫** | 统一认证拦截 | 1h |
| 4 | **Loading / Empty / Error 状态组件** | 统一数据加载三态 UI | 2h |
| 5 | **表单验证 Hook (useForm)** | 目前每个表单自己管验证逻辑 | 2h |
| 6 | **WS 消息分发重构** | 支持多类型消息按 type 分发 | 2h |

---

## 三、最小成本 CI/CD + 域名部署

### 3.1 整体架构图

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   用户手机    │────▶│  CDN (前端)   │     │  API 服务器   │
│   App/H5    │     │  Vercel /     │     │  ¥48/月       │
│             │◀────│  Cloudflare   │────▶│  轻量云       │
└─────────────┘     │  Pages       │     │  Express +    │
                    │  免费        │     │  SQLite/MySQL │
                    └──────────────┘     │  + WS         │
                                        └──────────────┘
```

### 3.2 前端部署方案（免费）

**推荐：Vercel（零配置）**

| 项目 | 方案 | 成本 |
|------|------|------|
| 托管 | Vercel Free Tier | 免费 |
| 域名 | `*.vercel.app` 或自定义域名 | 免费 |
| HTTPS | 自动 Let's Encrypt | 免费 |
| CI/CD | Git push 自动构建 | 免费 |

**配置步骤：**

```bash
# 1. 安装 Vercel CLI（可选，也可直接在 vercel.com 连接 GitHub）
npm i -g vercel

# 2. 在项目根目录
vercel

# 3. 配置环境变量（Vercel 控制台 → Settings → Environment Variables）
VITE_API_BASE_URL=https://api.mateup.com  # 你的后端地址
VITE_WS_BASE_URL=wss://api.mateup.com     # WebSocket 地址
VITE_USE_MOCK=false                         # 生产环境关闭 mock
```

**备选：Cloudflare Pages**
- 同样免费，全球 CDN 更快
- 支持 `_redirects` 文件处理 SPA fallback

### 3.3 后端部署方案（¥48-99/月）

**推荐：轻量应用服务器 + Docker**

| 云厂商 | 规格 | 价格 |
|--------|------|------|
| 腾讯云轻量 | 2C2G 50GB SSD | ¥48/月（首年） |
| 阿里云轻量 | 2C2G 40GB SSD | ¥54/月（首年） |
| 华为云 HECS | 1C2G 40GB SSD | ¥42/月（首年） |

**部署方式（Docker Compose）：**

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./prod.db
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    volumes:
      - ./data:/app/data  # SQLite 持久化
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./certbot/conf:/etc/letsencrypt  # SSL 证书
    depends_on:
      - api
    restart: always
```

**Nginx 配置（API + WebSocket 反代）：**

```nginx
server {
    listen 443 ssl;
    server_name api.mateup.com;

    ssl_certificate /etc/letsencrypt/live/api.mateup.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.mateup.com/privkey.pem;

    # API 请求
    location /api/ {
        proxy_pass http://api:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://api:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400s;  # 24h 超时
    }
}
```

### 3.4 WebSocket 部署注意事项

| 问题 | 解决方案 |
|------|---------|
| WSS 需要 HTTPS | Nginx 做 SSL 终结，内部 WS 走明文 |
| 长连接超时 | Nginx `proxy_read_timeout 86400s` + 应用层心跳 30s |
| 多实例部署 | 当前单机方案无此问题；未来多实例需 Redis Pub/Sub 做消息广播 |
| 断线重连 | 前端已实现指数退避重连（WebSocketManager），最多 5 次 |

### 3.5 域名方案（最低成本）

| 方案 | 成本 | 推荐 |
|------|------|------|
| **用 Vercel 提供的 `*.vercel.app` 子域名** | 免费 | 开发 / 测试 |
| **注册 `.com` 域名 + Cloudflare DNS** | ¥55/年（域名）+ 免费 DNS | 正式上线 |
| **`.cn` 域名**（需备案） | ¥29/年 + 备案周期 2-4 周 | 国内用户优先 |

**推荐域名结构：**
```
前端：mateup.com 或 app.mateup.com  → Vercel
后端：api.mateup.com                → 轻量云服务器
WS：  api.mateup.com/ws/            → 同后端（Nginx 反代）
```

### 3.6 CI/CD 流程（免费）

**前端 — GitHub Actions + Vercel：**

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend
on:
  push:
    branches: [master]
    paths: ['src/**', 'package.json', 'vite.config.js']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**后端 — GitHub Actions + SSH 部署：**

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend
on:
  push:
    branches: [master]
    paths: ['backend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/mateup
            git pull origin master
            cd backend
            pnpm install --prod
            npx prisma db push
            pm2 restart mateup-api
```

### 3.7 整体成本汇总

| 项目 | 月成本 | 备注 |
|------|--------|------|
| 前端托管 (Vercel) | ¥0 | Free Tier 100GB 带宽/月足够 |
| 后端服务器 | ¥48 | 腾讯云轻量 2C2G |
| 域名 | ¥5 | ¥55/年均摊 |
| SSL 证书 | ¥0 | Let's Encrypt 免费 |
| GitHub Actions | ¥0 | 开源仓库无限分钟 |
| **合计** | **¥53/月** | 首年价格 |

---

## 四、一个月执行路线图

### 第 1 周：修坑 + 基础设施

| 天 | 任务 | 产出 |
|----|----|------|
| D1 | 修 3.1 节全部 P0 坑点（AuthGuard / ErrorBoundary / 401 跳转 / mock 隔离） | PR |
| D2 | Toast 组件 + 替换 13 处 alert + 替换 11 处静默 catch | PR |
| D3 | .env.example + Vercel 配置 + 前端上线（连 mock） | 前端可访问 |
| D4 | 服务器购买 + Docker 环境搭建 + Nginx + SSL | 后端基础设施就绪 |
| D5 | 后端部署 + 前端 .env 切到真实 API | 全链路跑通（注册→登录→浏览） |

### 第 2 周：核心链路闭环

| 天 | 任务 | 产出 |
|----|----|------|
| D6-7 | 后端用户模块（注册/登录/SMS）+ 陪玩师列表 API | 首页有真实数据 |
| D8-9 | 后端订单模块（创建/支付/取消/完成）+ 前端对接 | 下单链路闭环 |
| D10 | WebSocket 后端实现 + 前端切换真实 WS 地址 | 聊天跑通 |

### 第 3 周：陪玩师端 + 支付

| 天 | 任务 | 产出 |
|----|----|------|
| D11-12 | 后端陪玩师模块（申请/审核/接单/评价）| 陪玩师工作台跑通 |
| D13 | 接入支付（微信 H5 支付 or 模拟支付流程）| 支付链路闭环 |
| D14-15 | 端到端测试 + Bug 修复 | 全功能可用 |

### 第 4 周：优化 + 上线

| 天 | 任务 | 产出 |
|----|----|------|
| D16-17 | ProfilePage 真实数据接入 + CoverPage 热门 API | 消灭假数据 |
| D18-19 | 性能优化（图片懒加载/CDN/缓存策略）+ 安全加固 | 生产就绪 |
| D20 | 域名备案完成（如需）+ 最终部署 + UAT | **上线** |

---

## 五、风险项

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| 域名备案超时（.cn 域名需 2-4 周） | 高 | 延迟上线 | 先用 .com 域名 + Cloudflare DNS，不需备案 |
| 微信支付接入审核慢（3-7 天） | 中 | 支付不可用 | 先用模拟支付上线测试版，并行申请 |
| 后端工作量超预期 | 中 | 延迟 | 优先做最小可用链路（注册→浏览→下单→聊天），其余功能渐进上线 |
| WebSocket 在特定运营商下连接不稳定 | 低 | 聊天异常 | 已有断线重连机制；添加 HTTP 轮询 fallback |
