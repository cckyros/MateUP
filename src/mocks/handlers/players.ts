import { MOCK_PLAYERS } from '../data/players'
import { Player } from '../../store/player'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const playerHandlers = {
  async getPlayers(): Promise<{ players: Player[]; total: number }> {
    await delay(300)
    return { players: MOCK_PLAYERS, total: MOCK_PLAYERS.length }
  },

  async getPlayerDetail(playerId: string): Promise<Player | null> {
    await delay(200)
    return MOCK_PLAYERS.find((p) => p.id === playerId) || null
  },

  async getPlayerProfile() {
    await delay(300)
    const { MOCK_PLAYER_PROFILE } = await import('../data/users')
    return MOCK_PLAYER_PROFILE
  },

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

  async updatePlayerProfile(data: Partial<{ price: number; rank: string; description: string; games: string[] }>) {
    await delay(400)
    return { success: true }
  },

  async applyPlayer(data: { games: string[]; price: number; rank: string; description: string }) {
    await delay(600)
    return { success: true, message: '申请已提交，请等待审核' }
  },

  async replyReview(reviewId: string, reply: string) {
    await delay(400)
    return { success: true }
  },

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
}
