// ========== 订单相关类型 ==========

export type OrderStatus = 'CREATED' | 'WAIT_ACCEPT' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface Order {
  id: string
  playerId: string
  playerName: string
  playerAvatar: string | null
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
  payTime?: number
  completeTime?: number
  cancelTime?: number
  cancelReason?: string
}

export interface CreateOrderParams {
  playerId: string | undefined
  duration: number
  game: string
  remark?: string
}
