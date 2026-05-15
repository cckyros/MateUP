import { request } from './index'
import type { ApplyStatusResponse, ApplyParams } from '@/types'

export const submitApply = (data: ApplyParams) =>
  request.post('/api/apply', data)

export const getApplyStatus = () =>
  request.get<ApplyStatusResponse>('/api/apply/status')
