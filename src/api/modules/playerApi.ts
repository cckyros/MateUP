import { request } from '../client'
import type { PlayerProfile, Review } from '../../store/playerProfile'
import type { PlayerOrder } from '../../store/order'

export const playerApi = {
  applyPlayer: (data: { games: string[]; price: number; rank: string; description: string }) =>
    request.post<{ success: boolean; message: string }>('/api/player/apply', data),

  getPlayerProfile: () =>
    request.get<PlayerProfile>('/api/player/profile'),

  updatePlayerProfile: (data: Partial<{ price: number; rank: string; description: string; games: string[] }>) =>
    request.post<{ success: boolean }>('/api/player/profile/update', data),

  getPlayerOrders: () =>
    request.get<{ orders: PlayerOrder[] }>('/api/player/orders'),

  getPlayerEarnings: () =>
    request.get<{
      balance: number
      pendingWithdraw: number
      totalEarnings: number
      todayEarnings: number
      weekEarnings: number
      monthEarnings: number
      records: any[]
    }>('/api/player/earnings'),

  getPlayerReviews: () =>
    request.get<{ reviews: Review[] }>('/api/player/reviews'),

  replyReview: (reviewId: string, reply: string) =>
    request.post<{ success: boolean }>(`/api/player/reviews/${reviewId}/reply`, { reply }),

  respondOrder: (orderId: string, action: 'accept' | 'reject') =>
    request.post<{ success: boolean }>(`/api/player/orders/${orderId}/respond`, { action }),
}
