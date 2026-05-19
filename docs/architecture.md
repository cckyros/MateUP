# MateUP 架构与页面说明

> 前端架构、目录结构、路由、页面功能一览

---

## 一、技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 19 |
| 构建 | Vite | 8 |
| 路由 | React Router | 7 |
| 状态管理 | Zustand | 5 |
| 动画 | Framer Motion | - |
| HTTP | Axios | - |
| 实时通信 | WebSocket（自研 Manager） | - |
| 语言 | TypeScript | 6 |

---

## 二、目录结构

```
src/
├── main.tsx              # 入口文件
├── App.tsx               # 根组件 + 路由配置 + TabBar
├── api/                  # API 客户端
│   ├── index.ts          # Axios 实例 + 拦截器 + Mock 挂载
│   ├── players.ts        # 陪玩师相关 API
│   ├── order.ts          # 订单相关 API
│   ├── user.ts           # 用户认证 API
│   ├── chat.ts           # 聊天 API
│   ├── favorites.ts      # 收藏 API
│   ├── apply.ts          # 申请陪玩师 API
│   └── playerApi.ts      # 陪玩师端 API（工作台/收入/评价）
├── types/                # 统一类型定义
│   └── index.ts          # Player, Order, User, ChatMessage, Review 等
├── store/                # Zustand Store（按模块拆分）
│   ├── userStore.ts      # 用户状态（登录/Token）
│   ├── playerStore.ts    # 陪玩师列表 + 筛选
│   ├── orderStore.ts     # 订单列表
│   ├── chatStore.ts      # 聊天消息
│   ├── favoritesStore.ts # 收藏列表
│   ├── applyStore.ts     # 申请状态
│   ├── playerProfileStore.ts # 陪玩师端资料/订单
│   └── index.ts          # 统一导出 + WebSocket 单例
├── mocks/                # Mock 数据系统
│   ├── index.ts          # 入口（导出 setupMockInterceptor）
│   ├── interceptor.ts    # Axios adapter 拦截器
│   └── data/             # 按实体分文件的 mock 数据
│       ├── players.ts
│       ├── orders.ts
│       ├── conversations.ts
│       ├── favorites.ts
│       ├── reviews.ts
│       ├── earnings.ts
│       └── user.ts
├── constants/            # 常量
│   ├── colors.ts         # 主题色
│   ├── config.ts         # API / WS 地址
│   ├── games.ts          # 游戏名映射
│   ├── order.ts          # 订单状态文本/颜色
│   └── chat.ts           # 聊天相关常量
├── components/           # 公共组件
│   ├── PlayerCard.tsx    # 陪玩师卡片
│   ├── OrderRating.tsx   # 评分组件
│   └── ui/               # 基础 UI 组件
├── hooks/                # 自定义 Hooks
│   ├── usePagination.ts  # 分页加载
│   ├── useDebounce.ts    # 防抖
│   └── useWebSocket.ts   # WebSocket 连接
├── services/             # 服务层
│   └── websocket.ts      # WebSocket Manager
├── utils/                # 工具函数
│   ├── playerMapper.ts   # 陪玩师字段标准化
│   ├── animations.ts     # 动画配置
│   └── styles.ts         # 样式类型
└── pages/                # 页面组件（见下方路由表）
```

---

## 三、路由结构

### 用户端

| 路径 | 页面组件 | TabBar | 说明 |
|------|---------|--------|------|
| `/` | CoverPage | 无 | 启动页：Logo + 欢迎语 + 登录/先逛逛 |
| `/login` | LoginPage | 无 | 手机号 + 验证码/密码 登录注册 |
| `/home` | PlayerListPage | ✅ | 首页：游戏分类 Tab + 筛选 + 陪玩师卡片列表 |
| `/player/:id` | PlayerDetailPage | 无 | 陪玩师详情：头像/等级/评分/游戏/时长/价格 |
| `/search` | SearchPage | 无 | 高级筛选：游戏/价格/段位/风格/在线状态 |
| `/orders` | OrdersPage | ✅ | 订单列表 + Tab 筛选 |
| `/order-detail/:id` | OrderDetailPage | 无 | 订单详情 + 操作（取消/联系/完成） |
| `/payment` `/payment/:id` | PaymentPage | 无 | 支付：倒计时 + 支付方式选择 |
| `/chat` | ChatPage | ✅ | 聊天列表 + 聊天房间（WebSocket） |
| `/profile` | ProfilePage | ✅ | 个人中心：数据/徽章/功能菜单 |
| `/favorites` | FavoritesPage | 无 | 收藏的陪玩师列表 |
| `/notifications` | NotificationPage | 无 | 通知消息列表 |
| `/settings` | SettingsPage | 无 | 设置页 |

### 陪玩师端（需路由守卫 `PlayerRouteGuard`）

| 路径 | 页面组件 | 说明 |
|------|---------|------|
| `/apply-player` | ApplyPlayerPage | 申请成为陪玩师 |
| `/apply-status` | ApplyStatusPage | 申请状态查看 |
| `/player-home` | PlayerHomePage | 工作台（概览/待接单/进行中） |
| `/player-orders` | PlayerOrdersPage | 陪玩师订单管理 |
| `/player-profile` | PlayerProfilePage | 陪玩师资料编辑 |
| `/player-earnings` | PlayerEarningsPage | 收入管理 + 提现 |
| `/player-reviews` | PlayerReviewsPage | 评价管理 + 回复 |

---

## 四、状态管理

| Store | 职责 | 核心 state |
|-------|------|-----------|
| `useUserStore` | 用户认证 | `user`, `token` |
| `usePlayerStore` | 陪玩师列表 | `players`, `filters`, `filteredPlayers` |
| `useOrderStore` | 订单管理 | `orders` |
| `useChatStore` | 聊天消息 | `messages` (按会话 ID 索引) |
| `useFavoritesStore` | 收藏管理 | `favorites`, `isFavorited()` |
| `useApplyStore` | 申请状态 | `applyStep`, `applyStatus` |
| `usePlayerProfileStore` | 陪玩师端 | `profile`, `orders` |

---

## 五、API 架构

### 请求流程

```
页面组件
  → API 函数 (src/api/*.ts)
    → Axios 实例 (src/api/index.ts)
      → Mock Adapter? (VITE_USE_MOCK=true)
        → 返回 mock 数据
      → 真实后端 (VITE_USE_MOCK=false)
        → http://192.168.3.14:3000
```

### 拦截器

- **请求拦截器**：自动注入 `Authorization: Bearer <token>`
- **响应拦截器**：解包 `response.data`，401 自动登出
- **Mock Adapter**：替换 axios 默认 adapter，拦截请求返回 mock 数据

---

## 六、数据结构（核心类型）

```typescript
// 陪玩师
interface Player {
  id: string
  name: string
  avatar: string
  rank: string
  tags: string[]
  price: number
  isOnline: boolean
  games: string[]
  rating: number
  ordersCount: number
  description: string
}

// 订单
interface Order {
  id: string
  playerId: string
  playerName: string
  playerAvatar: string
  game: string
  duration: number
  price: number
  status: 'CREATED' | 'WAIT_ACCEPT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createTime: number
  payTime?: number
  completeTime?: number
  cancelTime?: number
}

// 用户
interface User {
  id: string
  username: string
  avatar: string
  phone: string
  isPlayer: boolean
  playerStatus: 'none' | 'pending' | 'approved' | 'rejected'
}
```

---

## 七、WebSocket 架构

```
ChatPage
  → wsManager.connect(ws://host/ws/chat?token=xxx)
  → wsManager.onMessage(callback)   // 接收消息
  → wsManager.send({ type, to, content })  // 发送消息

WebSocketManager 特性：
  - 心跳检测（30s 间隔）
  - 断线自动重连（指数退避）
  - ACK 确认机制
  - 消息持久化（localStorage）
```

---

## 八、样式规范

- **主色**: `#FF6B9D`（粉紫色）
- **背景色**: `#16213e`（深蓝黑）
- **最大宽度**: 480px（移动端适配）
- **卡片圆角**: 12-16px
- **按钮圆角**: 25px
- 详细规范见 [UI 设计规范](./ui-guide.md)
