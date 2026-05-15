// ========== 陪玩师申请相关类型 ==========

export type ApplyStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ApplyStatusResponse {
  status: ApplyStatus
  step: number
  rejectedReason?: string
  submittedAt?: number
}

export interface ApplyParams {
  games: string[]
  rank: string
  price: number
  description: string
}
