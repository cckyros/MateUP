# 伴游 App 后端设计文档

> 工程目录: `D:\SOFT\repository\MateUP`
> 状态: 待实现
> 版本: v1.0

---

## 1. 技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | Node.js 18+ |
| 框架 | Express.js / 轻量原生封装 |
| 数据库 | MySQL 8.0 / SQLite(开发) |
| ORM | Prisma / 原生 SQL |
| 认证 | JWT (jsonwebtoken) |
| 密码加密 | bcrypt |
| 验证 | express-validator / joi |
| 日志 | winston / console |

---

## 2. 项目结构

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
│   │   ├── player.js        # 陪玩师路由
│   │   └── order.js        # 订单路由
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── playerController.js
│   │   └── orderController.js
│   ├── services/
│   │   ├── userService.js
│   │   ├── playerService.js
│   │   └── orderService.js
│   ├── models/              # 数据模型 (Prisma schema 或手工模型)
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── response.js     # 统一响应格式
│   └── db/
│       ├── index.js         # 数据库连接
│       └── schema.sql      # 初始建表 SQL
├── prisma/
│   └── schema.prisma        # Prisma ORM 模型定义
├── tests/                   # 单元测试
├── .env.example             # 环境变量模板
├── package.json
└── README.md
```

---

## 3. 数据库设计

### 3.1 用户表 (users)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(36) | PK, UUID | 用户ID |
| phone | VARCHAR(20) | UNIQUE, NOT NULL | 手机号 |
| password | VARCHAR(255) | NOT NULL | 加密密码 |
| username | VARCHAR(50) | NOT NULL | 用户名 |
| avatar | VARCHAR(500) | NULL | 头像URL |
| create_time | BIGINT | NOT NULL | 创建时间戳 |
| update_time | BIGINT | NOT NULL | 更新时间戳 |

### 3.2 陪玩师表 (players)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(36) | PK, UUID | 陪玩师ID |
| user_id | VARCHAR(36) | FK, UNIQUE | 关联用户ID |
| name | VARCHAR(50) | NOT NULL | 陪玩师名称 |
| avatar | VARCHAR(500) | NULL | 头像 |
| rank | VARCHAR(20) | NULL | 段位 |
| tags | JSON | NULL | 标签数组 ['LOL','辅助'] |
| price | DECIMAL(10,2) | NOT NULL | 每小时价格 |
| is_online | BOOLEAN | DEFAULT false | 在线状态 |
| games | JSON | NULL | 支持游戏 ['lol','honor'] |
| rating | DECIMAL(3,2) | DEFAULT 5.00 | 评分 |
| orders_count | INT | DEFAULT 0 | 订单数 |
| description | TEXT | NULL | 简介 |
| create_time | BIGINT | NOT NULL | 创建时间 |
| update_time | BIGINT | NOT NULL | 更新时间 |

### 3.3 订单表 (orders)

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

### 3.4 订单状态枚举

```
CREATED      → 已创建(待支付)
WAIT_ACCEPT → 已支付(待接单)
IN_PROGRESS → 进行中
COMPLETED   → 已完成
CANCELLED   → 已取消
```

---

## 4. API 设计

> Base URL: `/api`
> 认证方式: `Authorization: Bearer <token>`
> 通用响应: `{ code: 0, message: 'success', data: {...} }`
> 错误响应: `{ code: <error_code>, message: '<错误信息>', data: null }`

### 4.1 用户模块

#### POST /api/login
登录

**请求**
```json
{
  "phone": "13800138000",
  "password": "123456"
}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
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

---

#### POST /api/register
注册

**请求**
```json
{
  "phone": "13800138000",
  "password": "123456",
  "username": "用户名"
}
```

**响应**
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": { ... }
  }
}
```

---

#### GET /api/user/profile
获取当前用户信息

**响应**
```json
{
  "code": 0,
  "data": {
    "id": "uuid-xxx",
    "username": "用户名",
    "avatar": "https://...",
    "phone": "13800138000",
    "createTime": 1710000000000
  }
}
```

---

#### PUT /api/user/profile
更新用户信息

**请求**
```json
{
  "username": "新名字",
  "avatar": "https://new-avatar.png"
}
```

**响应**: 同 GET /api/user/profile

---

### 4.2 陪玩师模块

#### GET /api/players
陪玩师列表

**Query 参数**
| 参数 | 类型 | 说明 |
|------|------|------|
| game | string | 游戏筛选 |
| price_min | number | 最低价格 |
| price_max | number | 最高价格 |
| online_only | boolean | 仅在线 |
| cursor | string | 游标分页 |
| limit | number | 每页数量(default: 20) |

**响应**
```json
{
  "code": 0,
  "data": {
    "players": [
      {
        "id": "uuid-xxx",
        "name": "小甜",
        "avatar": "https://...",
        "rank": "钻石",
        "tags": ["LOL", "辅助", "语音连麦"],
        "price": 35,
        "isOnline": true,
        "games": ["lol"],
        "rating": 4.9,
        "ordersCount": 328
      }
    ],
    "nextCursor": "cursor_string",
    "total": 100
  }
}
```

---

#### GET /api/players/:id
陪玩师详情

**响应**
```json
{
  "code": 0,
  "data": {
    "id": "uuid-xxx",
    "name": "小甜",
    "avatar": "https://...",
    "rank": "钻石",
    "tags": ["LOL", "辅助", "语音连麦"],
    "price": 35,
    "isOnline": true,
    "games": ["lol"],
    "rating": 4.9,
    "ordersCount": 328,
    "description": "小姐姐声音好听..."
  }
}
```

---

#### GET /api/players/search
搜索陪玩师

**Query 参数**
| 参数 | 类型 | 说明 |
|------|------|------|
| keyword | string | 搜索关键词 |
| game | string | 游戏筛选 |
| limit | number | 数量限制 |

---

#### GET /api/players/hot
热门陪玩师

**Query**: `?limit=10`

**响应**: `{ players: [...], total: N }`

---

#### POST /api/players/:id/rate
评分

**请求**
```json
{
  "rating": 5
}
```

---

### 4.3 订单模块

#### POST /api/order/create
创建订单

**请求**
```json
{
  "playerId": "uuid-xxx",
  "duration": 2,
  "game": "lol",
  "remark": "希望打得开心"
}
```

**响应**
```json
{
  "code": 0,
  "data": {
    "id": "uuid-xxx",
    "playerId": "uuid-xxx",
    "playerName": "小甜",
    "playerAvatar": "https://...",
    "game": "lol",
    "duration": 2,
    "price": 70,
    "status": "CREATED",
    "createTime": 1710000000000
  }
}
```

---

#### POST /api/order/:id/pay
支付订单

**请求**
```json
{
  "payMethod": "mock"  // mock | iap | stripe
}
```

**响应**: 返回更新后的订单对象

---

#### POST /api/order/:id/cancel
取消订单

**请求**
```json
{
  "reason": "不想玩了"
}
```

**响应**: 返回更新后的订单对象

---

#### POST /api/order/:id/accept
陪玩师接单

**响应**: 返回更新后的订单对象

---

#### POST /api/order/:id/reject
陪玩师拒单

**请求**
```json
{
  "reason": "时间冲突"
}
```

---

#### POST /api/order/:id/complete
确认完成

**响应**: 返回更新后的订单对象

---

#### GET /api/order/list
订单列表

**Query 参数**
| 参数 | 类型 | 说明 |
|------|------|------|
| status | string | 状态筛选 |
| page | number | 页码(default: 1) |
| limit | number | 每页数量(default: 20) |

**响应**
```json
{
  "code": 0,
  "data": {
    "orders": [...],
    "total": 50,
    "page": 1,
    "totalPages": 3
  }
}
```

---

#### GET /api/order/:id
订单详情

**响应**
```json
{
  "code": 0,
  "data": {
    "id": "uuid-xxx",
    "playerId": "uuid-xxx",
    "playerName": "小甜",
    "playerAvatar": "https://...",
    "game": "lol",
    "duration": 2,
    "price": 70,
    "status": "IN_PROGRESS",
    "createTime": 1710000000000,
    "payTime": 1710000100000
  }
}
```

---

## 5. 错误码

| 错误码 | 说明 |
|---------|------|
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

## 6. 安全设计

- [ ] 密码 bcrypt 加密 (salt rounds: 12)
- [ ] JWT 签名 (HS256, 7天过期)
- [ ] 请求频率限制 (express-rate-limit)
- [ ] 参数校验 (express-validator)
- [ ] SQL 注入防护 (参数化查询)
- [ ] CORS 配置
- [ ] Helmet 安全头

---

## 7. 待实现功能 (MVP Phase)

### Phase 1 - 基础用户+陪玩列表
- [ ] 用户注册/登录 (JWT)
- [ ] 获取陪玩师列表 (分页/筛选)
- [ ] 获取陪玩师详情

### Phase 2 - 订单核心链路
- [ ] 创建订单
- [ ] 模拟支付
- [ ] 订单列表/详情
- [ ] 取消订单

### Phase 3 - 完整功能
- [ ] 陪玩师接单/拒单
- [ ] 完成订单
- [ ] 搜索陪玩师
- [ ] 热门陪玩师
- [ ] 评分功能

---

## 8. 开发计划

### 第一周
1. 项目初始化 (Express + Prisma + SQLite)
2. 用户模块 (注册/登录/JWT)
3. 陪玩师列表/详情 API

### 第二周
1. 订单创建/支付/取消
2. 订单状态流转
3. 陪玩师接单逻辑

### 第三周
1. 搜索+热门+评分
2. 基础测试
3. API 文档完善

---

*文档版本: v1.0 | 创建时间: 2026-03-26*
