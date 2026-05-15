import { request } from './index'
import type { PlayerProfile, PlayerOrder, EarningsOverview, EarningsRecord, Review } from '@/types'

export const getPlayerProfile = () =>
  request.get<PlayerProfile>('/api/player/profile')

export const updatePlayerProfile = (data: {
  name?: string
  rank?: string
  price?: number
  games?: string[]
  description?: string
  tags?: string[]
}) =>
  request.put<PlayerProfile>('/api/player/profile', data)

export const setOnlineStatus = (isOnline: boolean) =>
  request.put('/api/player/online-status', { is_online: isOnline })

export const getPlayerOrders = (params?: {
  status?: string
  page?: number
  limit?: number
}) =>
  request.get<{
    orders: PlayerOrder[]
    total: number
    page: number
    totalPages: number
  }>('/api/player/orders', { params })

export const getEarningsOverview = () =>
  request.get<EarningsOverview>('/api/player/earnings')

export const getEarningsList = (params?: { page?: number; limit?: number }) =>
  request.get<{
    records: EarningsRecord[]
    total: number
    page: number
    totalPages: number
  }>('/api/player/earnings/list', { params })

export const withdraw = (amount: number, remark?: string) =>
  request.post('/api/player/withdraw', { amount, remark })

export const getWithdrawals = (params?: { page?: number; limit?: number }) =>
  request.get('/api/player/withdrawals', { params })

export const getPlayerReviews = (params?: { page?: number; limit?: number }) =>
  request.get<{
    reviews: Review[]
    total: number
    page: number
    totalPages: number
  }>('/api/player/reviews', { params })

export const replyReview = (reviewId: string, response: string) =>
  request.post(`/api/player/reviews/${reviewId}/respond`, { response })
