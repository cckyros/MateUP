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
          isPlayer: false,
          playerStatus: 'none',
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

  // ========== Phase 7 陪玩师相关 ==========

  // 申请成为陪玩师
  async applyPlayer(data: {
    games: string[]
    price: number
    rank: string
    description: string
  }) {
    await delay(600)
    return { success: true, message: '申请已提交，请等待审核' }
  },

  // 获取陪玩师资料
  async getPlayerProfile() {
    await delay(300)
    return {
      id: 'user_001',
      name: '测试用户',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      games: ['lol', 'honor'],
      price: 40,
      rank: '钻石',
      description: '专业陪玩，擅长辅助和打野位置，语音连麦全程陪伴',
      isOnline: true,
      rating: 4.9,
      ordersCount: 328,
      weeklyOrders: 12,
      weeklyEarnings: 480,
      balance: 1256.5,
      pendingWithdraw: 200,
      totalEarnings: 8560,
    }
  },

  // 获取陪玩师订单列表
  async getPlayerOrders() {
    await delay(300)
    return {
      orders: [
        {
          id: 'po_001',
          userId: 'u_002',
          userName: '柚子',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
          game: 'honor',
          duration: 2,
          price: 80,
          status: 'WAIT_ACCEPT',
          createTime: Date.now() - 600000,
          remark: '希望打法激进一点',
        },
        {
          id: 'po_002',
          userId: 'u_003',
          userName: '阿喵',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
          game: 'lol',
          duration: 3,
          price: 120,
          status: 'IN_PROGRESS',
          createTime: Date.now() - 1800000,
        },
        {
          id: 'po_003',
          userId: 'u_004',
          userName: '苏苏',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Susi',
          game: 'yongjie',
          duration: 1,
          price: 40,
          status: 'COMPLETED',
          createTime: Date.now() - 86400000,
        },
      ],
    }
  },

  // 陪玩师接单/拒单
  async respondPlayerOrder(orderId: string, action: 'accept' | 'reject') {
    await delay(400)
    return { success: true }
  },

  // 获取收入概览
  async getPlayerEarnings() {
    await delay(200)
    return {
      balance: 1256.5,
      pendingWithdraw: 200,
      totalEarnings: 8560,
      todayEarnings: 160,
      weekEarnings: 480,
      monthEarnings: 1860,
      records: [
        { id: 'er_001', amount: 80, type: 'order', createTime: Date.now() - 3600000, note: '订单 #po_001' },
        { id: 'er_002', amount: -200, type: 'withdraw', createTime: Date.now() - 86400000, note: '提现到账' },
        { id: 'er_003', amount: 120, type: 'order', createTime: Date.now() - 172800000, note: '订单 #po_002' },
      ],
    }
  },

  // 获取评价列表
  async getPlayerReviews() {
    await delay(300)
    return {
      reviews: [
        {
          id: 'rv_001',
          orderId: 'po_003',
          userName: '苏苏',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Susi',
          rating: 5,
          comment: '陪玩师很专业，全程带飞，体验很好！',
          createTime: Date.now() - 3600000,
          replied: false,
        },
        {
          id: 'rv_002',
          orderId: 'po_002',
          userName: '阿喵',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi',
          rating: 5,
          comment: '声音好听，游戏技术很强，下次还来！',
          createTime: Date.now() - 86400000,
          replied: true,
          reply: '谢谢支持～欢迎下次再来！',
        },
        {
          id: 'rv_003',
          orderId: 'po_001',
          userName: '柚子',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
          rating: 4,
          comment: '总体不错，稍微有点跟不上节奏',
          createTime: Date.now() - 172800000,
          replied: false,
        },
      ],
    }
  },

  // 回复评价
  async replyReview(reviewId: string, reply: string) {
    await delay(400)
    return { success: true }
  },

  // 更新陪玩师资料
  async updatePlayerProfile(data: Partial<{ price: number; rank: string; description: string; games: string[] }>) {
    await delay(400)
    return { success: true }
  },
}
