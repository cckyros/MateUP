import request from './index'
import { OrderStatus } from '../store'

// ========== 订单相关 API ==========

export interface CreateOrderParams {
  playerId: string
  duration: number
  game: string
  remark?: string
}

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
  payTime?: number
  completeTime?: number
  cancelTime?: number
  cancelReason?: string
}

// 创建订单
export const createOrder = (data: CreateOrderParams) =>
  request.post<Order>('/api/order/create', data)

// 支付订单
export const payOrder = (orderId: string, payMethod: 'mock' | 'iap' | 'stripe') =>
  request.post<Order>(`/api/order/${orderId}/pay`, { payMethod })

// 取消订单
export const cancelOrder = (orderId: string, reason?: string) =>
  request.post<Order>(`/api/order/${orderId}/cancel`, { reason })

// 确认完成订单
export const completeOrder = (orderId: string) =>
  request.post<Order>(`/api/order/${orderId}/complete`)

// 获取订单列表
export const getOrderList = (params?: {
  status?: OrderStatus
  page?: number
  limit?: number
}) =>
  request.get<{
    orders: Order[]
    total: number
    page: number
    totalPages: number
  }>('/api/order/list', params)

// 获取订单详情
export const getOrderDetail = (orderId: string) =>
  request.get<Order>(`/api/order/${orderId}`)

// 陪玩师：接受订单
export const acceptOrder = (orderId: string) =>
  request.post<Order>(`/api/order/${orderId}/accept`)

// 陪玩师：拒绝订单
export const rejectOrder = (orderId: string, reason?: string) =>
  request.post<Order>(`/api/order/${orderId}/reject`, { reason })
