import { create } from 'zustand'
import { Player, PlayerFilters } from './types'

interface PlayerState {
  players: Player[]
  filteredPlayers: Player[]
  filters: PlayerFilters
  setPlayers: (players: Player[]) => void
  setFilters: (filters: Partial<PlayerFilters>) => void
  applyFilters: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  players: [],
  filteredPlayers: [],
  filters: { onlineOnly: false, sortBy: 'comprehensive' },

  setPlayers: (players) => {
    set({ players })
    get().applyFilters()
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }))
    get().applyFilters()
  },

  applyFilters: () => {
    const { players, filters } = get()
    let result = [...players]

    if (filters.game) {
      result = result.filter((p) => p.games.includes(filters.game!))
    }
    if (filters.priceMin !== undefined) {
      result = result.filter((p) => p.price >= filters.priceMin!)
    }
    if (filters.priceMax !== undefined) {
      result = result.filter((p) => p.price <= filters.priceMax!)
    }
    if (filters.onlineOnly) {
      result = result.filter((p) => p.isOnline)
    }

    set({ filteredPlayers: result })
  },
}))
