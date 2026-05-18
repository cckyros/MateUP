import { request } from '../client'
import type { Player } from '../../store/player'

export const playersApi = {
  getPlayers: (params?: {
    page?: number
    limit?: number
    game?: string
    price_min?: number
    price_max?: number
  }) =>
    request.get<{ players: Player[]; total: number; nextCursor?: string }>('/api/players', { params }),

  getPlayerDetail: (playerId: string) =>
    request.get<Player>(`/api/players/${playerId}`),

  searchPlayers: (keyword: string, params?: object) =>
    request.get<{ players: Player[]; total: number }>('/api/players/search', { params: { keyword, ...params } }),

  getHotPlayers: () =>
    request.get<Player[]>('/api/players/hot'),
}
