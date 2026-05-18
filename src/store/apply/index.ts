import { create } from 'zustand'
import { PlayerStatus } from './types'
import { STORAGE_KEYS } from '@/constants'

interface ApplyState {
  status: PlayerStatus
  submittedAt: number | null
  rejectedReason: string | null
  setStatus: (status: PlayerStatus, submittedAt?: number, rejectedReason?: string) => void
}

export const useApplyStore = create<ApplyState>((set) => ({
  status: (localStorage.getItem(STORAGE_KEYS.USER) ? JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)!).playerStatus : null) as PlayerStatus || 'none',
  submittedAt: null,
  rejectedReason: null,

  setStatus: (status, submittedAt, rejectedReason) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ playerStatus: status }))
    set({ status, submittedAt: submittedAt || null, rejectedReason: rejectedReason || null })
  },
}))
