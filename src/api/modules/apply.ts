import { request } from '../client'

export const applyApi = {
  getApplyStatus: () =>
    request.get<{ data: { step: number } }>('/api/apply/status'),
}
