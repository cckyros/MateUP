# MateUP Backend API

## 快速开始

```bash
cd backend

# 安装依赖
pnpm install

# 复制环境变量
copy .env.example .env

# 生成 Prisma Client 并创建数据库
pnpm db:push

# 启动开发服务器
pnpm dev
```

服务启动后访问 http://localhost:3000

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| PORT | 服务端口 | 3000 |
| DATABASE_URL | SQLite 数据库路径 | file:./dev.db |
| JWT_SECRET | JWT 签名密钥 | mateup-secret-key |
| JWT_EXPIRES_IN | Token 过期时间 | 7d |
| NODE_ENV | 运行环境 | development |

## API 列表

### 用户模块

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/login | 登录 | 否 |
| POST | /api/register | 注册 | 否 |
| GET | /api/user/profile | 获取个人信息 | 是 |
| PUT | /api/user/profile | 更新个人信息 | 是 |

### 陪玩师模块

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/players | 陪玩师列表 | 否 |
| GET | /api/players/search | 搜索陪玩师 | 否 |
| GET | /api/players/hot | 热门陪玩师 | 否 |
| GET | /api/players/:id | 陪玩师详情 | 否 |
| POST | /api/players/:id/rate | 评分 | 是 |

### 订单模块

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/order/create | 创建订单 | 是 |
| GET | /api/order/list | 订单列表 | 是 |
| GET | /api/order/:id | 订单详情 | 是 |
| POST | /api/order/:id/pay | 支付订单 | 是 |
| POST | /api/order/:id/cancel | 取消订单 | 是 |
| POST | /api/order/:id/accept | 陪玩师接单 | 是 |
| POST | /api/order/:id/reject | 陪玩师拒单 | 是 |
| POST | /api/order/:id/complete | 确认完成 | 是 |

## 通用响应格式

成功:
```json
{ "code": 0, "message": "success", "data": {...} }
```

失败:
```json
{ "code": <error_code>, "message": "<错误信息>", "data": null }
```

## 订单状态流转

```
CREATED → WAIT_ACCEPT → IN_PROGRESS → COMPLETED
    ↓           ↓              ↓
 CANCELLED ←←←←←←←←←←←←←←←←←←←←←
```

## 数据库

使用 Prisma + SQLite 开发。数据库文件: `prisma/dev.db`
