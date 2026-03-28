import request from './index'

// ========== 陪玩师相关 API ==========

export interface Player {
  id: string
  name: string
  avatar: string
  rank: string
  tags: string[]
  price: number
  isOnline: boolean
  games: string[]
  rating: number
  ordersCount: number
  description?: string
}

export interface PlayerFilters {
  game?: string
  price_min?: number
  price_max?: number
  online_only?: boolean
  cursor?: string
  limit?: number
}

// 获取陪玩师列表
export const getPlayers = (filters?: PlayerFilters) =>
  request.get<{
    players: Player[]
    nextCursor?: string
    total: number
  }>('/api/playmates', filters)

// 获取陪玩师详情
export const getPlayerDetail = (playerId: string) =>
  request.get<Player>(`/api/playmates/${playerId}`)

// 搜索陪玩师
export const searchPlayers = (keyword: string, filters?: PlayerFilters) =>
  request.get<{
    players: Player[]
    total: number
  }>('/api/playmates', { keyword, ...filters })

// 热门陪玩师
export const getHotPlayers = (limit: number = 10) =>
  request.get<Player[]>(`/api/playmates?sort=hot&limit=${limit}`)

// 陪玩师评分
export const ratePlayer = (playerId: string, rating: number, comment?: string) =>
  request.post(`/api/orders/${playerId}/rate`, { rating, comment })
