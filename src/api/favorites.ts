import { request } from './index'
import type { FavoriteItem } from '@/types'

export const addFavorite = (playerId: string) =>
  request.post<void>(`/api/favorites/${playerId}`)

export const removeFavorite = (playerId: string) =>
  request.delete<void>(`/api/favorites/${playerId}`)

export const getFavorites = (params?: { page?: number; limit?: number }) =>
  request.get<{
    favorites: FavoriteItem[]
    total: number
    page: number
    totalPages: number
  }>('/api/favorites', { params })

export const checkFavorite = (playerId: string) =>
  request.get<{ favorited: boolean }>(`/api/favorites/${playerId}`)
