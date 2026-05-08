import { create } from 'zustand'
import { FavoriteItem } from './types'
import { STORAGE_KEY } from '../../config/constants'

const loadFavoriteIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY.FAVORITE_IDS)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

const saveFavoriteIds = (ids: Set<string>) => {
  try {
    localStorage.setItem(STORAGE_KEY.FAVORITE_IDS, JSON.stringify([...ids]))
  } catch {}
}

interface FavoritesState {
  favorites: FavoriteItem[]
  favoriteIds: Set<string>
  setFavorites: (favorites: FavoriteItem[]) => void
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (playerId: string) => void
  isFavorited: (playerId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  favoriteIds: loadFavoriteIds(),

  setFavorites: (favorites) => {
    const ids = new Set(favorites.map((f) => f.playerId))
    saveFavoriteIds(ids)
    set({ favorites, favoriteIds: ids })
  },

  addFavorite: (item) => {
    const state = get()
    const newIds = new Set(state.favoriteIds)
    newIds.add(item.playerId)
    saveFavoriteIds(newIds)
    set({ favorites: [item, ...state.favorites], favoriteIds: newIds })
  },

  removeFavorite: (playerId) => {
    const state = get()
    const newIds = new Set(state.favoriteIds)
    newIds.delete(playerId)
    saveFavoriteIds(newIds)
    set({
      favorites: state.favorites.filter((f) => f.playerId !== playerId),
      favoriteIds: newIds,
    })
  },

  isFavorited: (playerId) => get().favoriteIds.has(playerId),
}))
