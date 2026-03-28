import axios from 'axios'
import { useUserStore } from '../store'

// ========== API Base 配置 ==========
const BASE_URL = 'http://192.168.3.14:3000' // 后端地址

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ========== 请求拦截器 - 自动注入 Token ==========
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

// ========== 响应拦截器 - 统一错误处理 ==========
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Token 过期或无效
          useUserStore.getState().logout()
          window.location.href = '#/login'
          break
        case 403:
          console.error('无权限访问')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(`API Error: ${data?.message || error.message}`)
      }
    } else if (error.request) {
      console.error('网络错误，请检查网络连接')
    }
    return Promise.reject(error)
  }
)

export default api

// ========== 通用请求方法 ==========
export const request = {
  get: <T>(url: string, params?: object) =>
    api.get<T>(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: object) =>
    api.post<T>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: object) =>
    api.put<T>(url, data).then((res) => res.data),

  delete: <T>(url: string, params?: object) =>
    api.delete<T>(url, { params }).then((res) => res.data),
}
