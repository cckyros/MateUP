import { create } from 'zustand'
import { OrderStatus } from './order'

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
  reply?: string
}

interface PlayerProfileStore {
  profile: PlayerProfile | null
  orders: import('./order').PlayerOrder[]
  reviews: Review[]
  setProfile: (profile: PlayerProfile) => void
  setOrders: (orders: import('./order').PlayerOrder[]) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  setReviews: (reviews: Review[]) => void
}

export const usePlayerProfileStore = create<PlayerProfileStore>((set) => ({
  profile: null,
  orders: [],
  reviews: [],

  setProfile: (profile) => set({ profile }),
  setOrders: (orders) => set({ orders }),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    })),
  setReviews: (reviews) => set({ reviews }),
}))
