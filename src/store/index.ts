// Store - 统一导出
// 每个 Store 单一职责，独立文件

export { useUserStore } from './userStore'
export { useOrderStore } from './orderStore'
export { usePlayerStore } from './playerStore'
export { useChatStore } from './chatStore'
export { usePlayerProfileStore } from './playerProfileStore'
export { useApplyStore } from './applyStore'
export { useFavoritesStore } from './favoritesStore'

// WebSocket 管理器 - 单例
export { wsManager } from '@/services/websocket'

// 类型重导出（向后兼容旧的 import 路径）
export type { User, PlayerStatus } from '@/types'
export type { Order, OrderStatus } from '@/types'
export type { Player } from '@/types'
export type { ChatMessage } from '@/types'
export type { PlayerProfile, PlayerOrder, Review } from '@/types'
export type { FavoriteItem } from '@/types'
