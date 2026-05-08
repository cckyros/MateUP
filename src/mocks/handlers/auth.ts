import { MOCK_USER } from '../data/users'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const authHandlers = {
  async login(phone: string, password: string) {
    await delay(500)
    if (phone === '13800138000' && password === '123456') {
      return {
        token: 'mock_token_' + Date.now(),
        user: { ...MOCK_USER, phone },
      }
    }
    throw new Error('手机号或密码错误')
  },

  async register(phone: string, password: string, username: string) {
    await delay(600)
    return {
      token: 'mock_token_' + Date.now(),
      user: { ...MOCK_USER, phone, username, id: 'user_new' },
    }
  },

  async getApplyStatus() {
    await delay(300)
    return { data: { step: 1 } }
  },
}
