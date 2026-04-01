// Zustand 轻量状态管理
// 文档参考: https://docs.pmnd.rs/zustand

import { create } from 'zustand'

// ========== 用户角色类型 ==========
export type PlayerStatus = 'none' | 'pending' | 'approved' | 'rejected'

// ========== 用户 Store ==========
export interface User {
  id: string
  username: string
  avatar?: string
  phone?: string
  isPlayer: boolean       // 是否已申请为陪玩师
  playerStatus: PlayerStatus  // 陪玩师申请状态
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
    localStorage.removeItem('playerStatus')
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
  remark?: string
  payTime?: number | null
  completeTime?: number | null
  cancelTime?: number | null
  cancelReason?: string | null
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

// localStorage key for chat persistence
const CHAT_STORAGE_KEY = 'banlv_chat_messages'

// 从 localStorage 加载历史记录
const loadChatFromStorage = (): Record<string, ChatMessage[]> => {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

// 保存到 localStorage
const saveChatToStorage = (messages: Record<string, ChatMessage[]>) => {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
  } catch (e) {
    console.warn('[ChatStore] failed to save to localStorage:', e)
  }
}

interface ChatState {
  messages: Record<string, ChatMessage[]> // key: conversationId
  currentConversation: string | null
  setMessages: (conversationId: string, messages: ChatMessage[]) => void
  addMessage: (conversationId: string, message: ChatMessage) => void
  setCurrentConversation: (conversationId: string) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: loadChatFromStorage(),
  currentConversation: null,
  setMessages: (conversationId, messages) =>
    set((state) => {
      const updated = { ...state.messages, [conversationId]: messages }
      saveChatToStorage(updated)
      return { messages: updated }
    }),
  addMessage: (conversationId, message) =>
    set((state) => {
      const existing = state.messages[conversationId] || []
      const updated = {
        ...state.messages,
        [conversationId]: [...existing, message],
      }
      saveChatToStorage(updated)
      return { messages: updated }
    }),
  setCurrentConversation: (conversationId) =>
    set({ currentConversation: conversationId }),
}))

// WebSocket 管理器
type MessageHandler = (data: ChatMessage) => void
type StatusHandler = (status: 'connected' | 'disconnected' | 'error') => void

interface WSMessage {
  type: string
  data: any
  ackId?: string
}

class WebSocketManager {
  private ws: WebSocket | null = null
  private url: string = ''
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5
  private reconnectDelay: number = 3000
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null
  private messageHandlers: Set<MessageHandler> = new Set()
  private statusHandlers: Set<StatusHandler> = new Set()
  private pendingMessages: Map<string, (success: boolean) => void> = new Map()
  private messageIdCounter: number = 0

  connect(url: string) {
    this.url = url
    this.createConnection()
  }

  private createConnection() {
    if (this.ws?.readyState === WebSocket.OPEN) return
    try {
      this.ws = new WebSocket(this.url)
      this.ws.onopen = () => {
        this.reconnectAttempts = 0
        this.startHeartbeat()
        this.notifyStatus('connected')
      }
      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data)
          this.handleMessage(message)
        } catch (e) {
          console.error('[WS] parse error:', e)
        }
      }
      this.ws.onclose = () => {
        this.stopHeartbeat()
        this.notifyStatus('disconnected')
        this.attemptReconnect()
      }
      this.ws.onerror = () => {
        this.notifyStatus('error')
      }
    } catch (error) {
      console.error('[WS] connection error:', error)
      this.attemptReconnect()
    }
  }

  private handleMessage(message: WSMessage) {
    switch (message.type) {
      case 'chat':
        this.messageHandlers.forEach((handler) => handler(message.data as ChatMessage))
        break
      case 'ack':
        if (message.data?.ackId && this.pendingMessages.has(message.data.ackId)) {
          this.pendingMessages.get(message.data.ackId)!(true)
          this.pendingMessages.delete(message.data.ackId)
        }
        break
      case 'pong':
        break
    }
  }

  send(type: string, data: any): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.ws?.readyState !== WebSocket.OPEN) { resolve(false); return }
      const messageId = `msg_${++this.messageIdCounter}_${Date.now()}`
      const msg: WSMessage = { type, data, ackId: messageId }
      this.pendingMessages.set(messageId, resolve)
      setTimeout(() => {
        if (this.pendingMessages.has(messageId)) {
          this.pendingMessages.delete(messageId)
          resolve(false)
        }
      }, 10000)
      this.ws.send(JSON.stringify(msg))
    })
  }

  sendChatMessage(to: string, content: string): Promise<boolean> {
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'chat',
      from: '',
      to,
      content,
      timestamp: Date.now(),
      isSelf: true,
    }
    return this.send('chat', msg)
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  onStatusChange(handler: StatusHandler) {
    this.statusHandlers.add(handler)
    return () => this.statusHandlers.delete(handler)
  }

  private notifyStatus(status: 'connected' | 'disconnected' | 'error') {
    this.statusHandlers.forEach((handler) => handler(status))
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000)
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return
    this.reconnectAttempts++
    setTimeout(() => this.createConnection(), this.reconnectDelay * this.reconnectAttempts)
  }

  disconnect() {
    this.stopHeartbeat()
    this.pendingMessages.clear()
    this.ws?.close()
    this.ws = null
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export const wsManager = new WebSocketManager()

// ========== 陪玩师 Store (Phase 7) ==========
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
  pendingWithdraw: number
  totalEarnings: number
}

export interface PlayerOrder {
  id: string
  userId: string
  userName: string
  userAvatar: string
  game: string
  duration: number
  price: number
  status: OrderStatus
  createTime: number
  remark?: string
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

interface PlayerStore {
  profile: PlayerProfile | null
  orders: PlayerOrder[]
  reviews: Review[]
  setProfile: (profile: PlayerProfile) => void
  setOrders: (orders: PlayerOrder[]) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  setReviews: (reviews: Review[]) => void
}

export const usePlayerStore = create<PlayerStore>((set) => ({
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

// ========== 申请状态 Store (Phase 7) ==========
interface ApplyState {
  status: PlayerStatus // none | pending | approved | rejected
  submittedAt: number | null
  rejectedReason: string | null
  setStatus: (status: PlayerStatus, submittedAt?: number, rejectedReason?: string) => void
}

export const useApplyStore = create<ApplyState>((set) => ({
  status: (localStorage.getItem('playerStatus') as PlayerStatus) || 'none',
  submittedAt: null,
  rejectedReason: null,
  setStatus: (status, submittedAt, rejectedReason) => {
    localStorage.setItem('playerStatus', status)
    set({ status, submittedAt: submittedAt || null, rejectedReason: rejectedReason || null })
  },
}))
