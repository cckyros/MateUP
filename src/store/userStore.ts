import { create } from 'zustand'
import type { User } from '@/types'
import { STORAGE_KEYS } from '@/constants'

interface UserState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  setUser: (user: User) => void
  setToken: (token: string) => void
  logout: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
  isLoggedIn: !!localStorage.getItem(STORAGE_KEYS.TOKEN),
  setUser: (user) => set({ user, isLoggedIn: true }),
  setToken: (token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    set({ token, isLoggedIn: true })
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.PLAYER_STATUS)
    set({ user: null, token: null, isLoggedIn: false })
  },
}))
