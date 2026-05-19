# MateUP 后端设计文档

> 版本: v1.0
> 状态: 待实现

---

## 一、快速开始

```bash
cd backend

# 安装依赖
pnpm install

# 复制环境变量
cp .env.example .env

# 生成 Prisma Client 并创建数据库
pnpm db:push

# 启动开发服务器
pnpm dev
```

服务启动后访问 http://localhost:3000

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| PORT | 服务端口 | 3000 |
| DATABASE_URL | SQLite 数据库路径 | file:./dev.db |
| JWT_SECRET | JWT 签名密钥 | mateup-secret-key |
| JWT_EXPIRES_IN | Token 过期时间 | 7d |
| NODE_ENV | 运行环境 | development |

---

## 二、技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | Node.js 18+ |
| 框架 | Express.js |
| 数据库 | MySQL 8.0 / SQLite(开发) |
| ORM | Prisma |
| 认证 | JWT (jsonwebtoken) |
| 密码加密 | bcrypt |
| 验证 | express-validator / joi |
| 日志 | winston / console |

---

## 三、项目结构

```
backend/
├── src/
│   ├── app.js              # Express 应用入口
│   ├── server.js           # HTTP 服务启动
│   ├── config/
│   │   └── index.js        # 环境变量配置
│   ├── middleware/
│   │   ├── auth.js         # JWT 认证中间件
│   │   ├── errorHandler.js # 统一错误处理
│   │   └── validator.js    # 参数校验中间件
│   ├── routes/
│   │   ├── user.js         # 用户路由
│   │   ├── player.js       # 陪玩师路由
│   │   └── order.js        # 订单路由
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── playerController.js
│   │   └── orderController.js
│   ├── services/
│   │   ├── userService.js
│   │   ├── playerService.js
│   │   └── orderService.js
│   ├── models/
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── response.js     # 统一响应格式
│   └── db/
│       ├── index.js         # 数据库连接
│       └── schema.sql       # 初始建表 SQL
├── prisma/
│   └── schema.prisma        # Prisma ORM 模型定义
├── .env.example
└── package.json
```

---

## 四、数据库设计

### 4.1 用户表 (users)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(36) | PK, UUID | 用户ID |
| phone | VARCHAR(20) | UNIQUE, NOT NULL | 手机号 |
| password | VARCHAR(255) | NOT NULL | 加密密码 |
| username | VARCHAR(50) | NOT NULL | 用户名 |
| avatar | VARCHAR(500) | NULL | 头像URL |
| create_time | BIGINT | NOT NULL | 创建时间戳 |
| update_time | BIGINT | NOT NULL | 更新时间戳 |

### 4.2 陪玩师表 (players)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(36) | PK, UUID | 陪玩师ID |
| user_id | VARCHAR(36) | FK, UNIQUE | 关联用户ID |
| name | VARCHAR(50) | NOT NULL | 陪玩师名称 |
| avatar | VARCHAR(500) | NULL | 头像 |
| rank | VARCHAR(20) | NULL | 段位 |
| tags | JSON | NULL | 标签数组 |
| price | DECIMAL(10,2) | NOT NULL | 每小时价格 |
| is_online | BOOLEAN | DEFAULT false | 在线状态 |
| games | JSON | NULL | 支持游戏 |
| rating | DECIMAL(3,2) | DEFAULT 5.00 | 评分 |
| orders_count | INT | DEFAULT 0 | 订单数 |
| description | TEXT | NULL | 简介 |
| create_time | BIGINT | NOT NULL | 创建时间 |
| update_time | BIGINT | NOT NULL | 更新时间 |

### 4.3 订单表 (orders)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(36) | PK, UUID | 订单ID |
| user_id | VARCHAR(36) | FK, NOT NULL | 下单用户ID |
| player_id | VARCHAR(36) | FK, NOT NULL | 陪玩师ID |
| game | VARCHAR(50) | NOT NULL | 游戏类型 |
| duration | INT | NOT NULL | 时长(小时) |
| price | DECIMAL(10,2) | NOT NULL | 总价 |
| status | ENUM | NOT NULL | 状态 |
| remark | TEXT | NULL | 备注 |
| create_time | BIGINT | NOT NULL | 创建时间 |
| pay_time | BIGINT | NULL | 支付时间 |
| accept_time | BIGINT | NULL | 接单时间 |
| complete_time | BIGINT | NULL | 完成时间 |
| cancel_time | BIGINT | NULL | 取消时间 |
| cancel_reason | VARCHAR(255) | NULL | 取消原因 |

### 4.4 订单状态流转

```
CREATED(待支付) → WAIT_ACCEPT(待接单) → IN_PROGRESS(进行中) → COMPLETED(已完成)
      ↓                  ↓                     ↓
   CANCELLED ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

---

## 五、API 设计

> Base URL: `/api`
> 认证方式: `Authorization: Bearer <token>`
> 通用响应: `{ code: 0, message: 'success', data: {...} }`
> 错误响应: `{ code: <error_code>, message: '<错误信息>', data: null }`

### 5.1 用户模块

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/login` | 登录 | 否 |
| POST | `/api/register` | 注册 | 否 |
| GET | `/api/user/profile` | 获取个人信息 | 是 |
| PUT | `/api/user/profile` | 更新个人信息 | 是 |

#### POST /api/login

**请求**
```json
{ "phone": "13800138000", "password": "123456" }
```

**响应**
```json
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "uuid-xxx",
      "username": "用户名",
      "avatar": "https://...",
      "phone": "13800138000",
      "createTime": 1710000000000
    }
  }
}
```

#### POST /api/register

**请求**
```json
{ "phone": "13800138000", "password": "123456", "username": "用户名" }
```

**响应** — 同登录

### 5.2 陪玩师模块

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/players` | 陪玩师列表 | 否 |
| GET | `/api/players/search` | 搜索陪玩师 | 否 |
| GET | `/api/players/hot` | 热门陪玩师 | 否 |
| GET | `/api/players/:id` | 陪玩师详情 | 否 |
| POST | `/api/players/:id/rate` | 评分 | 是 |

#### GET /api/players

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| game | string | 游戏筛选 |
| price_min | number | 最低价格 |
| price_max | number | 最高价格 |
| online_only | boolean | 仅在线 |
| cursor | string | 游标分页 |
| limit | number | 每页数量(默认 20) |

**响应**
```json
{
  "code": 0,
  "data": {
    "players": [
      {
        "id": "uuid-xxx", "name": "小甜", "avatar": "https://...",
        "rank": "钻石", "tags": ["LOL", "辅助"],
        "price": 35, "isOnline": true, "games": ["lol"],
        "rating": 4.9, "ordersCount": 328
      }
    ],
    "nextCursor": "cursor_string",
    "total": 100
  }
}
```

### 5.3 订单模块

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/order/create` | 创建订单 | 是 |
| GET | `/api/order/list` | 订单列表 | 是 |
| GET | `/api/order/:id` | 订单详情 | 是 |
| POST | `/api/order/:id/pay` | 支付订单 | 是 |
| POST | `/api/order/:id/cancel` | 取消订单 | 是 |
| POST | `/api/order/:id/accept` | 陪玩师接单 | 是 |
| POST | `/api/order/:id/reject` | 陪玩师拒单 | 是 |
| POST | `/api/order/:id/complete` | 确认完成 | 是 |

#### POST /api/order/create

**请求**
```json
{ "playerId": "uuid-xxx", "duration": 2, "game": "lol", "remark": "希望打得开心" }
```

**响应**
```json
{
  "code": 0,
  "data": {
    "id": "uuid-xxx", "playerId": "uuid-xxx",
    "playerName": "小甜", "playerAvatar": "https://...",
    "game": "lol", "duration": 2, "price": 70,
    "status": "CREATED", "createTime": 1710000000000
  }
}
```

#### GET /api/order/list

**Query 参数**

| 参数 | 类型 | 说明 |
|------|------|------|
| status | string | 状态筛选 |
| page | number | 页码(默认 1) |
| limit | number | 每页数量(默认 20) |

---

## 六、错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 参数校验失败 |
| 2001 | 用户不存在 |
| 2002 | 密码错误 |
| 2003 | 用户已存在 |
| 3001 | 陪玩师不存在 |
| 4001 | 订单不存在 |
| 4002 | 订单状态不允许此操作 |
| 4003 | 余额不足 |
| 5001 | 无权限 |
| 5002 | Token无效/过期 |
| 9001 | 服务器内部错误 |

---

## 七、安全设计

- [ ] 密码 bcrypt 加密 (salt rounds: 12)
- [ ] JWT 签名 (HS256, 7天过期)
- [ ] 请求频率限制 (express-rate-limit)
- [ ] 参数校验 (express-validator)
- [ ] SQL 注入防护 (参数化查询)
- [ ] CORS 配置
- [ ] Helmet 安全头

---

## 八、开发计划

### Phase 1 — 基础用户 + 陪玩列表
- [ ] 项目初始化 (Express + Prisma + SQLite)
- [ ] 用户注册/登录 (JWT)
- [ ] 陪玩师列表/详情 API

### Phase 2 — 订单核心链路
- [ ] 创建订单 + 模拟支付
- [ ] 订单列表/详情
- [ ] 取消订单

### Phase 3 — 完整功能
- [ ] 陪玩师接单/拒单
- [ ] 完成订单
- [ ] 搜索 + 热门 + 评分

---

*使用 Prisma + SQLite 开发。数据库文件: `prisma/dev.db`*
