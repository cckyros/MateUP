import { request } from '../client'
import { Order, OrderStatus } from '../../store/order'

export const ordersApi = {
  acceptOrder: (orderId: string) =>
    request.post<Order>(`/api/order/${orderId}/accept`),

  rejectOrder: (orderId: string, reason?: string) =>
    request.post<Order>(`/api/order/${orderId}/reject`, { reason }),

  createOrder: (data: { playerId: string; duration: number; game: string; remark?: string }) =>
    request.post<Order>('/api/order/create', data),

  payOrder: (orderId: string, payMethod: 'mock' | 'iap' | 'stripe' = 'mock') =>
    request.post<Order>(`/api/order/${orderId}/pay`, { payMethod }),

  cancelOrder: (orderId: string, reason?: string) =>
    request.post<Order>(`/api/order/${orderId}/cancel`, { reason }),

  completeOrder: (orderId: string) =>
    request.post<Order>(`/api/order/${orderId}/complete`),

  getOrderList: (params?: { status?: OrderStatus; page?: number; limit?: number }) =>
    request.get<{ orders: Order[]; total: number; page: number; totalPages: number }>('/api/order/list', { params }),

  getOrderDetail: (orderId: string) =>
    request.get<Order>(`/api/order/${orderId}`),

  acceptOrder: (orderId: string) =>
    request.post<Order>(`/api/order/${orderId}/accept`),

  rejectOrder: (orderId: string, reason?: string) =>
    request.post<Order>(`/api/order/${orderId}/reject`, { reason }),

  rateOrder: (orderId: string, rating: number, ratingComment?: string) =>
    request.post(`/api/order/${orderId}/rate`, { rating, ratingComment }),
}
