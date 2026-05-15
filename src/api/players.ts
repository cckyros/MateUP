import { request } from './index'
import type { Player } from '@/types'

export interface PlayerListFilters {
  page?: number
  limit?: number
  game?: string
  price_min?: number
  price_max?: number
}

export const getPlayers = (filters?: PlayerListFilters) =>
  request.get<{
    players: Player[]
    total: number
    nextCursor?: string
  }>('/api/players', { params: filters })

export const getPlayerDetail = (playerId: string) =>
  request.get<Player>(`/api/players/${playerId}`)

export const searchPlayers = (keyword: string, filters?: PlayerListFilters) =>
  request.get<{
    players: Player[]
    total: number
  }>('/api/players/search', { params: { keyword, ...filters } })

export const getHotPlayers = () =>
  request.get<Player[]>('/api/players/hot')

export const ratePlayer = (playerId: string, rating: number, comment?: string) =>
  request.post(`/api/players/${playerId}/rate`, { rating, comment })
