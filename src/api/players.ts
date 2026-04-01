import request from './index'

// ========== 陪玩师相关 API ==========

export interface Player {
  id: string
  name: string
  avatar: string | null
  rank: string | null
  tags: string[]
  price: number
  isOnline: boolean
  games: string[]
  rating: number
  ordersCount: number
  description?: string
}

export interface PlayerFilters {
  page?: number
  limit?: number
  game?: string
  price_min?: number
  price_max?: number
}

// 获取陪玩师列表
export const getPlayers = (filters?: PlayerFilters) =>
  request.get<{
    players: Player[]
    total: number
    nextCursor?: string
  }>('/api/players', filters)

// 获取陪玩师详情
export const getPlayerDetail = (playerId: string) =>
  request.get<Player>(`/api/players/${playerId}`)

// 搜索陪玩师
export const searchPlayers = (keyword: string, filters?: PlayerFilters) =>
  request.get<{
    players: Player[]
    total: number
  }>('/api/players/search', { keyword, ...filters })

// 热门陪玩师
export const getHotPlayers = () =>
  request.get<Player[]>('/api/players/hot')

// 陪玩师评分
export const ratePlayer = (playerId: string, rating: number, comment?: string) =>
  request.post(`/api/players/${playerId}/rate`, { rating, comment })
