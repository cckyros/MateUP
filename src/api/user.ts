import { request } from './index'
import type { LoginParams, RegisterParams, LoginResponse, UserProfile } from '@/types'

export const login = (data: LoginParams) =>
  request.post<LoginResponse>('/api/login', data)

export const register = (data: RegisterParams) =>
  request.post<LoginResponse>('/api/register', data)

export const getUserProfile = () =>
  request.get<UserProfile>('/api/profile')

export const updateUserProfile = (data: Partial<UserProfile>) =>
  request.put<UserProfile>('/api/profile', data)
