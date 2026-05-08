import { create } from 'zustand'
import { User } from './types'
import { STORAGE_KEY } from '../../config/constants'

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
  token: localStorage.getItem(STORAGE_KEY.TOKEN) || null,
  isLoggedIn: !!localStorage.getItem(STORAGE_KEY.TOKEN),

  setUser: (user) => set({ user, isLoggedIn: true }),

  setToken: (token) => {
    localStorage.setItem(STORAGE_KEY.TOKEN, token)
    set({ token, isLoggedIn: true })
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY.TOKEN)
    localStorage.removeItem(STORAGE_KEY.USER)
    set({ user: null, token: null, isLoggedIn: false })
  },
}))
