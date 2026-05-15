import { create } from 'zustand'
import type { PlayerProfile, PlayerOrder, Review, OrderStatus } from '@/types'

interface PlayerProfileState {
  profile: PlayerProfile | null
  orders: PlayerOrder[]
  reviews: Review[]
  setProfile: (profile: PlayerProfile) => void
  setOrders: (orders: PlayerOrder[]) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  setReviews: (reviews: Review[]) => void
}

export const usePlayerProfileStore = create<PlayerProfileState>((set) => ({
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
