// Zustand 轻量状态管理
// 文档参考: https://docs.pmnd.rs/zustand

import { create } from 'zustand'

// ========== 用户 Store ==========
interface User {
  id: string
  username: string
  avatar?: string
  phone?: string
}

interface UserState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoggedIn: !!localStorage.getItem('token'),
  setUser: (user) => set({ user, isLoggedIn: true }),
  setToken: (token) => {
    localStorage.setItem('token', token)
    set({ token, isLoggedIn: true })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isLoggedIn: false })
  },
}))

// ========== 订单 Store ==========
export type OrderStatus = 'CREATED' | 'WAIT_ACCEPT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Order {
  id: string
  playerId: string
  playerName: string
  playerAvatar: string
  game: string
  duration: number
  price: number
  status: OrderStatus
  createTime: number
}

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  setOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  setCurrentOrder: (order: Order) => void
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
      currentOrder:
        state.currentOrder?.id === orderId
          ? { ...state.currentOrder, status }
          : state.currentOrder,
    })),
  setCurrentOrder: (order) => set({ currentOrder: order }),
}))

// ========== 陪玩列表 Store ==========
export interface Player {
  id: string
  name: string
  avatar: string
  rank: string
  tags: string[]
  price: number
  isOnline: boolean
  games: string[]
  rating: number
  ordersCount: number
}

interface PlayerState {
  players: Player[]
  filteredPlayers: Player[]
  filters: {
    game?: string
    priceMin?: number
    priceMax?: number
    onlineOnly: boolean
    sortBy?: 'comprehensive' | 'price_asc' | 'price_desc' | 'rating'
  }
  setPlayers: (players: Player[]) => void
  setFilters: (filters: Partial<PlayerState['filters']>) => void
  applyFilters: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  players: [],
  filteredPlayers: [],
  filters: {
    onlineOnly: false,
    sortBy: 'comprehensive',
  },
  setPlayers: (players) => {
    set({ players })
    get().applyFilters()
  },
  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }))
    get().applyFilters()
  },
  applyFilters: () => {
    const { players, filters } = get()
    let result = [...players]

    if (filters.game) {
      result = result.filter((p) => p.games.includes(filters.game!))
    }
    if (filters.priceMin !== undefined) {
      result = result.filter((p) => p.price >= filters.priceMin!)
    }
    if (filters.priceMax !== undefined) {
      result = result.filter((p) => p.price <= filters.priceMax!)
    }
    if (filters.onlineOnly) {
      result = result.filter((p) => p.isOnline)
    }

    set({ filteredPlayers: result })
  },
}))

// ========== 聊天消息 Store ==========
export interface ChatMessage {
  id: string
  type: 'chat' | 'system'
  from: string
  to: string
  content: string
  timestamp: number
  isSelf: boolean
}

interface ChatState {
  messages: Record<string, ChatMessage[]> // key: conversationId
  currentConversation: string | null
  setMessages: (conversationId: string, messages: ChatMessage[]) => void
  addMessage: (conversationId: string, message: ChatMessage) => void
  setCurrentConversation: (conversationId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: {},
  currentConversation: null,
  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),
  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          message,
        ],
      },
    })),
  setCurrentConversation: (conversationId) =>
    set({ currentConversation: conversationId }),
}))
