// store 统一导出（兼容旧代码）
// 新代码请直接从对应子目录导入

export { useUserStore } from './user'
export type { User } from './user/types'

export { useOrderStore } from './order'
export type { Order, OrderStatus, PlayerOrder } from './order/types'

export { usePlayerStore } from './player'
export type { Player, PlayerFilters } from './player/types'

export { useChatStore, wsManager } from './chat'
export type { ChatMessage } from './chat/types'

export { useFavoritesStore } from './favorites'
export type { FavoriteItem } from './favorites/types'

export { useApplyStore } from './apply'
export type { PlayerStatus } from './apply/types'

export { usePlayerProfileStore } from './playerProfile'
export type { PlayerProfile, Review } from './playerProfile'
