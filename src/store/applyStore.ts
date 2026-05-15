import { create } from 'zustand'
import type { PlayerStatus } from '@/types'
import { STORAGE_KEYS } from '@/constants'

interface ApplyState {
  status: PlayerStatus
  submittedAt: number | null
  rejectedReason: string | null
  setStatus: (status: PlayerStatus, submittedAt?: number | null, rejectedReason?: string | null) => void
}

export const useApplyStore = create<ApplyState>((set) => ({
  status: (localStorage.getItem(STORAGE_KEYS.PLAYER_STATUS) as PlayerStatus) || 'none',
  submittedAt: null,
  rejectedReason: null,
  setStatus: (status, submittedAt, rejectedReason) => {
    localStorage.setItem(STORAGE_KEYS.PLAYER_STATUS, status)
    set({ status, submittedAt: submittedAt || null, rejectedReason: rejectedReason || null })
  },
}))
