export type PlayerStatus = 'none' | 'pending' | 'approved' | 'rejected'

export interface User {
  id: string
  username: string
  avatar?: string
  phone?: string
  isPlayer: boolean
  playerStatus: PlayerStatus
}
