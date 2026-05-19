# MateUP — 游戏陪玩平台

移动端 H5 游戏陪玩平台，用户可浏览、预约游戏陪玩师，支持实时聊天和订单管理。

## 技术栈

React 19 · TypeScript 6 · Vite 8 · Zustand 5 · React Router 7 · Framer Motion · Axios · WebSocket

## 快速开始

```bash
# 安装依赖
npm install

# 开发服务器 (http://localhost:5173)
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### Mock 模式

默认启用 Mock 数据，无需后端即可运行。通过环境变量控制：

```bash
# .env
VITE_USE_MOCK=true   # 默认，使用 mock 数据
VITE_USE_MOCK=false  # 连接真实后端 (http://192.168.3.14:3000)
```

## 核心功能

| 模块 | 功能 |
|------|------|
| 用户端 | 登录注册 · 陪玩师浏览/筛选/搜索 · 详情/下单/支付 · 订单管理 · 实时聊天 · 收藏 · 个人中心 |
| 陪玩师端 | 申请入驻 · 工作台 · 接单/拒单 · 收入管理 · 评价管理 · 资料编辑 |

## 文档

| 文档 | 说明 |
|------|------|
| [架构说明](docs/architecture.md) | 目录结构、路由、页面功能、状态管理、API 架构、数据结构 |
| [产品路线图](docs/product-roadmap.md) | 已完成功能、Phase 8-10 规划、优先级、工作量估算 |
| [后端设计](docs/backend-design.md) | 技术栈、数据库设计、API 接口文档、错误码、安全设计 |
| [UI 设计规范](docs/ui-guide.md) | 色彩系统、按钮规范、字体间距、动画规范 |
| [多角色协作模板](docs/multi-agent-prompt.md) | PM / 架构师 / 前端 / 后端 / 测试 Agent 协作模板 |
