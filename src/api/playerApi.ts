import request from '../api'

// ========== 陪玩师个人中心 API (Phase 7) ==========

export interface PlayerProfile {
  id: string
  name: string
  avatar: string
  games: string[]
  price: number
  rank: string
  description: string
  isOnline: boolean
  rating: number
  ordersCount: number
  balance: number
  pendingWithdrawal: number
  totalEarnings: number
  totalWithdrawn: number
}

export interface PlayerOrder {
  id: string
  userId: string
  userName: string
  userAvatar: string
  game: string
  duration: number
  price: number
  status: string
  createTime: number
  remark?: string
  payTime?: number
  completeTime?: number
  cancelTime?: number
  cancelReason?: string
}

export interface EarningsOverview {
  balance: number
  totalEarnings: number
  totalWithdrawn: number
  pendingWithdrawal: number
  monthEarnings: number
}

export interface EarningsRecord {
  id: string
  amount: number
  type: 'order' | 'withdraw'
  createTime: number
  note: string
}

export interface Review {
  id: string
  orderId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  createTime: number
  replied: boolean
  response?: string
}

// 获取陪玩师资料（本人）
export const getPlayerProfile = () =>
  request.get<PlayerProfile>('/api/player/profile')

// 更新陪玩师资料
export const updatePlayerProfile = (data: {
  name?: string
  rank?: string
  price?: number
  games?: string[]
  description?: string
  tags?: string[]
}) =>
  request.put<PlayerProfile>('/api/player/profile', data)

// 修改在线状态
export const setOnlineStatus = (isOnline: boolean) =>
  request.put('/api/player/online-status', { is_online: isOnline })

// 陪玩师订单列表
export const getPlayerOrders = (params?: {
  status?: string
  page?: number
  limit?: number
}) =>
  request.get<{
    orders: PlayerOrder[]
    total: number
    page: number
    totalPages: number
  }>('/api/player/orders', params)

// 收入概览
export const getEarningsOverview = () =>
  request.get<EarningsOverview>('/api/player/earnings')

// 收入明细
export const getEarningsList = (params?: { page?: number; limit?: number }) =>
  request.get<{
    records: EarningsRecord[]
    total: number
    page: number
    totalPages: number
  }>('/api/player/earnings/list', params)

// 申请提现
export const withdraw = (amount: number, remark?: string) =>
  request.post('/api/player/withdraw', { amount, remark })

// 提现记录
export const getWithdrawals = (params?: { page?: number; limit?: number }) =>
  request.get('/api/player/withdrawals', params)

// 评价列表
export const getPlayerReviews = (params?: { page?: number; limit?: number }) =>
  request.get<{
    reviews: Review[]
    total: number
    page: number
    totalPages: number
  }>('/api/player/reviews', params)

// 回复评价
export const replyReview = (reviewId: string, response: string) =>
  request.post(`/api/player/reviews/${reviewId}/respond`, { response })
