// ========== 陪玩师相关类型 ==========

export interface Player {
  id: string
  name: string
  avatar: string | null
  rank: string | null
  tags: string[]
  price: number
  isOnline: boolean
  games: string[]
  rating: number
  ordersCount: number
  description?: string
}

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
  weeklyOrders: number
  weeklyEarnings: number
  balance: number
  pendingWithdrawal: number
  totalEarnings: number
  totalWithdrawn?: number
}

export interface PlayerFilters {
  game?: string
  priceMin?: number
  priceMax?: number
  onlineOnly: boolean
  sortBy?: SortOption
}

export type SortOption = 'comprehensive' | 'price_asc' | 'price_desc' | 'rating'

export interface Review {
  id: string
  orderId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  createTime: number
  replied?: boolean
  reply?: string
  response?: string
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
