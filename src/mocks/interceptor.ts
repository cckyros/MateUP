/**
 * Mock API 拦截器
 *
 * 拦截 axios 请求，返回 mock 数据。
 * 所有 mock 数据存放在 src/mocks/data/ 下，后续替换为真实 API 只需关闭此拦截器。
 */
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import type { Order, PlayerOrder } from '@/types'
import {
  MOCK_PLAYERS,
  MOCK_ORDERS,
  MOCK_PLAYER_ORDERS,
  MOCK_CONVERSATIONS,
  MOCK_CHAT_MESSAGES,
  MOCK_FAVORITES,
  MOCK_PLAYER_REVIEWS,
  MOCK_EARNINGS_OVERVIEW,
  MOCK_EARNINGS_RECORDS,
  MOCK_USER,
  MOCK_PLAYER_PROFILE,
  MOCK_LOGIN_RESPONSE,
} from './data'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

type RouteHandler = (url: string, config: InternalAxiosRequestConfig) => Promise<unknown>

const getRoutes: Record<string, RouteHandler> = {
  // 陪玩师列表
  '/api/players': async (_url, config) => {
    await delay(200)
    const params = (config.params as Record<string, string>) || {}
    let list = [...MOCK_PLAYERS]
    if (params.game) {
      list = list.filter((p) => p.games.includes(params.game))
    }
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(kw) || p.tags.some((t) => t.toLowerCase().includes(kw))
      )
    }
    return { players: list, total: list.length }
  },

  // 陪玩师搜索
  '/api/players/search': async (_url, config) => {
    await delay(200)
    const params = (config.params as Record<string, string>) || {}
    const kw = (params.keyword || '').toLowerCase()
    const list = MOCK_PLAYERS.filter(
      (p) => p.name.toLowerCase().includes(kw) || p.tags.some((t) => t.toLowerCase().includes(kw))
    )
    return { players: list, total: list.length }
  },

  // 热门陪玩师
  '/api/players/hot': async () => {
    await delay(150)
    return [...MOCK_PLAYERS].sort((a, b) => b.ordersCount - a.ordersCount).slice(0, 5)
  },

  // 订单列表
  '/api/order/list': async (_url, config) => {
    await delay(200)
    const params = (config.params as Record<string, string>) || {}
    let list = [...MOCK_ORDERS]
    if (params.status) {
      list = list.filter((o) => o.status === params.status)
    }
    return { orders: list, total: list.length, page: 1, totalPages: 1 }
  },

  // 聊天会话列表
  '/api/chat/conversations': async () => {
    await delay(200)
    return { conversations: MOCK_CONVERSATIONS }
  },

  // 收藏列表
  '/api/favorites': async () => {
    await delay(200)
    return { favorites: MOCK_FAVORITES, total: MOCK_FAVORITES.length, page: 1, totalPages: 1 }
  },

  // 陪玩师个人资料
  '/api/player/profile': async () => {
    await delay(200)
    return MOCK_PLAYER_PROFILE
  },

  // 陪玩师订单
  '/api/player/orders': async () => {
    await delay(200)
    return { orders: MOCK_PLAYER_ORDERS, total: MOCK_PLAYER_ORDERS.length, page: 1, totalPages: 1 }
  },

  // 收入概览
  '/api/player/earnings': async () => {
    await delay(150)
    return MOCK_EARNINGS_OVERVIEW
  },

  // 收入记录
  '/api/player/earnings/list': async () => {
    await delay(200)
    return { records: MOCK_EARNINGS_RECORDS, total: MOCK_EARNINGS_RECORDS.length, page: 1, totalPages: 1 }
  },

  // 提现记录
  '/api/player/withdrawals': async () => {
    await delay(200)
    return { records: MOCK_EARNINGS_RECORDS.filter((r) => r.type === 'withdraw'), total: 2, page: 1, totalPages: 1 }
  },

  // 陪玩师评价
  '/api/player/reviews': async () => {
    await delay(200)
    return { reviews: MOCK_PLAYER_REVIEWS, total: MOCK_PLAYER_REVIEWS.length, page: 1, totalPages: 1 }
  },

  // 用户资料
  '/api/profile': async () => {
    await delay(200)
    return {
      id: MOCK_USER.id,
      username: MOCK_USER.username,
      avatar: MOCK_USER.avatar,
      phone: MOCK_USER.phone,
      isPlayer: MOCK_USER.isPlayer,
      playerStatus: MOCK_USER.playerStatus,
    }
  },

  // 申请状态
  '/api/apply/status': async () => {
    await delay(200)
    return { step: 0, status: 'none' }
  },
}

const postRoutes: Record<string, RouteHandler> = {
  // 登录
  '/api/login': async () => {
    await delay(400)
    return MOCK_LOGIN_RESPONSE
  },

  // 注册
  '/api/register': async () => {
    await delay(400)
    return MOCK_LOGIN_RESPONSE
  },

  // 发送验证码
  '/api/user/sms': async () => {
    await delay(300)
    return { success: true }
  },

  // 创建订单
  '/api/order/create': async (_url, config) => {
    await delay(300)
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    const player = MOCK_PLAYERS.find((p) => p.id === body.playerId)
    const newOrder: Order = {
      id: 'order_' + Date.now(),
      playerId: body.playerId,
      playerName: player?.name || '未知陪玩师',
      playerAvatar: player?.avatar || null,
      game: body.game,
      duration: body.duration,
      price: (player?.price || 0) * body.duration,
      status: 'CREATED',
      createTime: Date.now(),
      remark: body.remark,
    }
    MOCK_ORDERS.unshift(newOrder)
    return newOrder
  },

  // 申请成为陪玩师
  '/api/apply': async () => {
    await delay(400)
    return { success: true, step: 1, message: '申请已提交，请等待审核' }
  },

  // 收藏
  '/api/favorites': async () => {
    await delay(200)
    return { success: true }
  },

  // 发送消息
  '/api/chat': async (_url, config) => {
    await delay(200)
    const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
    return {
      id: 'msg_' + Date.now(),
      type: 'chat',
      from: MOCK_USER.id,
      to: body.to,
      content: body.content,
      timestamp: Date.now(),
      isSelf: true,
    }
  },

  // 提现
  '/api/player/withdraw': async () => {
    await delay(400)
    return { success: true }
  },
}

const putRoutes: Record<string, RouteHandler> = {
  // 更新用户资料
  '/api/profile': async () => {
    await delay(300)
    return { success: true }
  },

  // 更新陪玩师资料
  '/api/player/profile': async () => {
    await delay(300)
    return { success: true }
  },

  // 更新在线状态
  '/api/player/online-status': async () => {
    await delay(200)
    return { success: true }
  },
}

function matchDynamicRoute(url: string, method: string): RouteHandler | null {
  // GET: 陪玩师详情 /api/players/:id
  if (method === 'get' && /^\/api\/players\/[^/]+$/.test(url) && !url.includes('/search') && !url.includes('/hot')) {
    return async () => {
      await delay(200)
      const id = url.split('/').pop()!
      const player = MOCK_PLAYERS.find((p) => p.id === id)
      if (!player) return { error: 'Player not found' }
      return player
    }
  }

  // GET: 陪玩师评价 /api/players/:id/reviews
  if (method === 'get' && /^\/api\/players\/[^/]+\/reviews$/.test(url)) {
    return async () => {
      await delay(200)
      return { reviews: MOCK_PLAYER_REVIEWS }
    }
  }

  // GET: 订单详情 /api/order/:id
  if (method === 'get' && /^\/api\/order\/[^/]+$/.test(url) && !url.includes('/list')) {
    return async () => {
      await delay(200)
      const id = url.split('/').pop()!
      return MOCK_ORDERS.find((o) => o.id === id) || { error: 'Order not found' }
    }
  }

  // GET: 聊天历史 /api/chat/history/:partnerId
  if (method === 'get' && /^\/api\/chat\/history\//.test(url)) {
    return async () => {
      await delay(200)
      const partnerId = url.split('/').pop()!
      return { messages: MOCK_CHAT_MESSAGES[partnerId] || [], hasMore: false }
    }
  }

  // GET: 收藏检查 /api/favorites/:playerId
  if (method === 'get' && /^\/api\/favorites\/[^/]+$/.test(url)) {
    return async () => {
      await delay(100)
      const playerId = url.split('/').pop()!
      return { favorited: MOCK_FAVORITES.some((f) => f.playerId === playerId) }
    }
  }

  // POST: 订单支付 /api/order/:id/pay
  if (method === 'post' && /\/pay$/.test(url)) {
    return async () => {
      await delay(500)
      const id = url.split('/')[3]
      const order = MOCK_ORDERS.find((o) => o.id === id)
      if (order) {
        order.status = 'WAIT_ACCEPT'
        order.payTime = Date.now()
      }
      return order || { error: 'Order not found' }
    }
  }

  // POST: 取消订单 /api/order/:id/cancel
  if (method === 'post' && /\/cancel$/.test(url)) {
    return async () => {
      await delay(300)
      const id = url.split('/')[3]
      const order = MOCK_ORDERS.find((o) => o.id === id)
      if (order) {
        order.status = 'CANCELLED'
        order.cancelTime = Date.now()
      }
      return order || { error: 'Order not found' }
    }
  }

  // POST: 完成订单 /api/order/:id/complete
  if (method === 'post' && /\/complete$/.test(url)) {
    return async () => {
      await delay(300)
      const id = url.split('/')[3]
      const order = MOCK_ORDERS.find((o) => o.id === id)
      if (order) {
        order.status = 'COMPLETED'
        order.completeTime = Date.now()
      }
      return order || { error: 'Order not found' }
    }
  }

  // POST: 评价订单 /api/order/:id/rate
  if (method === 'post' && /\/rate$/.test(url)) {
    return async () => {
      await delay(300)
      return { success: true }
    }
  }

  // POST: 接单/拒单 /api/order/:id/accept, /api/order/:id/reject
  if (method === 'post' && (/\/accept$/.test(url) || /\/reject$/.test(url))) {
    return async () => {
      await delay(300)
      const id = url.split('/')[3]
      const isAccept = url.endsWith('/accept')
      const order = MOCK_PLAYER_ORDERS.find((o: PlayerOrder) => o.id === id)
      if (order) {
        order.status = isAccept ? 'IN_PROGRESS' : 'CANCELLED'
      }
      return { success: true }
    }
  }

  // POST: 回复评价 /api/player/reviews/:id/respond
  if (method === 'post' && /\/respond$/.test(url)) {
    return async () => {
      await delay(300)
      return { success: true }
    }
  }

  // POST: 收藏/取消收藏 /api/favorites/:playerId
  if ((method === 'post' || method === 'delete') && /^\/api\/favorites\/[^/]+$/.test(url)) {
    return async () => {
      await delay(200)
      return { success: true }
    }
  }

  return null
}

function findHandler(url: string, method: string, config: InternalAxiosRequestConfig): RouteHandler | null {
  let handler: RouteHandler | null = null

  if (method === 'get') {
    handler = getRoutes[url] || null
  } else if (method === 'post') {
    handler = postRoutes[url] || null
  } else if (method === 'put') {
    handler = putRoutes[url] || null
  }

  if (!handler) {
    handler = matchDynamicRoute(url, method)
  }

  return handler
}

export function setupMockInterceptor(axiosInstance: AxiosInstance) {
  const originalAdapter = axiosInstance.defaults.adapter

  axiosInstance.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    const url = config.url || ''
    const method = (config.method || 'get').toLowerCase()
    const handler = findHandler(url, method, config)

    if (handler) {
      const data = await handler(url, config)
      return { data, status: 200, statusText: 'OK', headers: {}, config }
    }

    if (typeof originalAdapter === 'function') {
      return originalAdapter(config)
    }
    throw new Error(`[Mock] No handler for ${method.toUpperCase()} ${url} and no fallback adapter`)
  }
}
