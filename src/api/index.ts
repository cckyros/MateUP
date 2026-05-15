import axios from 'axios'
import { useUserStore } from '@/store/userStore'
import { API_BASE_URL } from '@/constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 自动注入 Token
api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器 - 统一错误处理
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          useUserStore.getState().logout()
          window.location.href = '#/login'
          break
        case 403:
          console.error('[API] 无权限访问')
          break
        case 500:
          console.error('[API] 服务器错误')
          break
        default:
          console.error(`[API] Error ${status}: ${data?.message || error.message}`)
      }
    } else if (error.request) {
      console.error('[API] 网络错误，请检查网络连接')
    }
    return Promise.reject(error)
  }
)

export default api

export const request = {
  get: <T>(url: string, config?: Record<string, unknown>) =>
    api.get(url, config) as unknown as Promise<T>,

  post: <T>(url: string, data?: unknown) =>
    api.post(url, data) as unknown as Promise<T>,

  put: <T>(url: string, data?: unknown) =>
    api.put(url, data) as unknown as Promise<T>,

  delete: <T>(url: string, config?: Record<string, unknown>) =>
    api.delete(url, config) as unknown as Promise<T>,
}
