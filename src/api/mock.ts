// 模拟数据 - 用于本地开发和测试
// 上线前替换为真实 API 调用

import { Player, Order } from '../store'

// ========== 模拟陪玩师数据 ==========
export const MOCK_PLAYERS: Player[] = [
  {
    id: '1',
    name: '小甜',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    rank: '钻石',
    tags: ['LOL', '辅助', '语音连麦'],
    price: 35,
    isOnline: true,
    games: ['lol'],
    rating: 4.9,
    ordersCount: 328,
  },
  {
    id: '2',
    name: '柚子',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    rank: '王者',
    tags: ['王者', '打野', '全标签'],
    price: 50,
    isOnline: true,
    games: ['honor'],
    rating: 5.0,
    ordersCount: 512,
  },
  {
    id: '3',
    name: '阿喵',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
    rank: '星耀',
    tags: ['永劫', '近代', '娱乐'],
    price: 40,
    isOnline: false,
    games: ['yongjie'],
    rating: 4.8,
    ordersCount: 156,
  },
  {
    id: '4',
    name: '苏苏',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Susi',
    rank: '钻石',
    tags: ['蛋仔', '巅峰', '上分'],
    price: 30,
    isOnline: true,
    games: ['danzai'],
    rating: 4.7,
    ordersCount: 89,
  },
  {
    id: '5',
    name: '林妹',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linn',
    rank: '大师',
    tags: ['APEX', 'FPS', '技术流'],
    price: 60,
    isOnline: true,
    games: ['apex'],
    rating: 4.95,
    ordersCount: 421,
  },
]

// ========== 模拟订单数据 ==========
export const MOCK_ORDERS: Order[] = [
  {
    id: 'order_001',
    playerId: '1',
    playerName: '小甜',
    playerAvatar: MOCK_PLAYERS[0].avatar,
    game: 'lol',
    duration: 2,
    price: 70,
    status: 'IN_PROGRESS',
    createTime: Date.now() - 3600000,
  },
  {
    id: 'order_002',
    playerId: '2',
    playerName: '柚子',
    playerAvatar: MOCK_PLAYERS[1].avatar,
    game: 'honor',
    duration: 3,
    price: 150,
    status: 'COMPLETED',
    createTime: Date.now() - 86400000,
    completeTime: Date.now() - 82800000,
  },
  {
    id: 'order_003',
    playerId: '5',
    playerName: '林妹',
    playerAvatar: MOCK_PLAYERS[4].avatar,
    game: 'apex',
    duration: 1,
    price: 60,
    status: 'WAIT_ACCEPT',
    createTime: Date.now() - 1800000,
  },
]

// ========== 模拟 API 函数 ==========
// 延迟模拟网络请求
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockApi = {
  // 登录
  async login(phone: string, password: string) {
    await delay(500)
    if (phone === '13800138000' && password === '123456') {
      return {
        token: 'mock_token_' + Date.now(),
        user: {
          id: 'user_001',
          username: '测试用户',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
          phone,
        },
      }
    }
    throw new Error('手机号或密码错误')
  },

  // 获取陪玩列表
  async getPlayers() {
    await delay(300)
    return { players: MOCK_PLAYERS }
  },

  // 获取陪玩详情
  async getPlayerDetail(playerId: string) {
    await delay(200)
    return MOCK_PLAYERS.find((p) => p.id === playerId) || null
  },

  // 获取订单列表
  async getOrders() {
    await delay(300)
    return { orders: MOCK_ORDERS }
  },

  // 创建订单
  async createOrder(playerId: string, duration: number, game: string) {
    await delay(400)
    const player = MOCK_PLAYERS.find((p) => p.id === playerId)
    if (!player) throw new Error('陪玩师不存在')

    const newOrder: Order = {
      id: 'order_' + Date.now(),
      playerId,
      playerName: player.name,
      playerAvatar: player.avatar,
      game,
      duration,
      price: player.price * duration,
      status: 'CREATED',
      createTime: Date.now(),
    }
    MOCK_ORDERS.unshift(newOrder)
    return newOrder
  },

  // 模拟支付
  async payOrder(orderId: string) {
    await delay(800)
    const order = MOCK_ORDERS.find((o) => o.id === orderId)
    if (order) {
      order.status = 'WAIT_ACCEPT'
      order.payTime = Date.now()
    }
    return order
  },
}
