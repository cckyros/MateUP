import { request } from './index'
import type { Order, OrderStatus, CreateOrderParams } from '@/types'

export const createOrder = (data: CreateOrderParams) =>
  request.post<Order>('/api/order/create', data)

export const payOrder = (orderId: string, payMethod: 'mock' | 'iap' | 'stripe') =>
  request.post<Order>(`/api/order/${orderId}/pay`, { payMethod })

export const cancelOrder = (orderId: string, reason?: string) =>
  request.post<Order>(`/api/order/${orderId}/cancel`, { reason })

export const completeOrder = (orderId: string) =>
  request.post<Order>(`/api/order/${orderId}/complete`)

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
  }>('/api/order/list', { params })

export const getOrderDetail = (orderId: string) =>
  request.get<Order>(`/api/order/${orderId}`)

export const acceptOrder = (orderId: string) =>
  request.post<Order>(`/api/order/${orderId}/accept`)

export const rejectOrder = (orderId: string, reason?: string) =>
  request.post<Order>(`/api/order/${orderId}/reject`, { reason })

export const rateOrder = (orderId: string, rating: number, ratingComment?: string) =>
  request.post(`/api/order/${orderId}/rate`, { rating, ratingComment })
