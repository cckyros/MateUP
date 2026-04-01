import request from './index'

// ========== 用户相关 API ==========

export interface LoginParams {
  phone: string
  password: string
}

export interface RegisterParams {
  phone: string
  password: string
  username: string
}

export interface UserProfile {
  id: string
  username: string
  avatar: string | null
  phone: string
  isPlayer: boolean
  playerStatus: 'none' | 'pending' | 'approved' | 'rejected'
  createTime?: number
}

// 登录
export const login = (data: LoginParams) =>
  request.post<{
    token: string
    user: UserProfile
  }>('/api/login', data)

// 注册
export const register = (data: RegisterParams) =>
  request.post<{
    token: string
    user: UserProfile
  }>('/api/register', data)

// 获取用户信息
export const getUserProfile = () =>
  request.get<UserProfile>('/api/profile')

// 更新用户信息
export const updateUserProfile = (data: Partial<UserProfile>) =>
  request.put<UserProfile>('/api/profile', data)
