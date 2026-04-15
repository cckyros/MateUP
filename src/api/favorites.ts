import request from '../api'

// ========== 收藏 API (Phase 8) ==========

export interface FavoritePlayer {
  id: string
  playerId: string
  playerName: string
  playerAvatar: string | null
  playerRank: string | null
  playerGames: string[]
  playerPrice: number
  playerRating: number
  playerOrdersCount: number
  isOnline: boolean
  createTime: number
}

// 添加收藏
export const addFavorite = (playerId: string) =>
  request.post<void>(`/api/favorites/${playerId}`)

// 取消收藏
export const removeFavorite = (playerId: string) =>
  request.delete<void>(`/api/favorites/${playerId}`)

// 收藏列表
export const getFavorites = (params?: { page?: number; limit?: number }) =>
  request.get<{
    favorites: FavoritePlayer[]
    total: number
    page: number
    totalPages: number
  }>('/api/favorites', params)

// 检查是否收藏
export const checkFavorite = (playerId: string) =>
  request.get<{ favorited: boolean }>(`/api/favorites/${playerId}`)
