// ========== 用户相关类型 ==========

export type PlayerStatus = 'none' | 'pending' | 'approved' | 'rejected'

export interface User {
  id: string
  username: string
  avatar?: string
  phone?: string
  isPlayer: boolean
  playerStatus: PlayerStatus
}

export interface UserProfile {
  id: string
  username: string
  avatar: string | null
  phone: string
  isPlayer: boolean
  playerStatus: PlayerStatus
  createTime?: number
}

export interface LoginParams {
  phone: string
  password: string
}

export interface RegisterParams {
  phone: string
  password: string
  username: string
}

export interface LoginResponse {
  token: string
  user: UserProfile
}
