import { request } from '../client'

export const authApi = {
  login: (data: { phone: string; password: string }) =>
    request.post<{ token: string; user: any }>('/api/auth/login', data),

  register: (data: { phone: string; password: string; username: string }) =>
    request.post<{ token: string; user: any }>('/api/auth/register', data),

  getApplyStatus: () =>
    request.get<{ data: { step: number } }>('/api/apply/status'),
}
