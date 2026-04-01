import request from './index'

// ========== 陪玩师申请 API (Phase 7) ==========

export type ApplyStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ApplyStatusResponse {
  status: ApplyStatus
  step: number // 1=审核中, 3=已通过
  rejectedReason?: string
  submittedAt?: number
}

export interface ApplyParams {
  games: string[]
  rank: string
  price: number
  description: string
}

// 提交申请
export const submitApply = (data: ApplyParams) =>
  request.post('/api/apply', data)

// 获取申请状态
export const getApplyStatus = () =>
  request.get<ApplyStatusResponse>('/api/apply/status')
