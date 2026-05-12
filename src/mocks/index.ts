// Mock 统一入口
// 通过 VITE_USE_MOCK=1 开启，production 默认关闭

export * from './data/players'
export * from './data/orders'
export * from './data/users'
export * from './handlers/auth'
export * from './handlers/players'
export * from './handlers/orders'

export const isMockEnabled = import.meta.env.VITE_USE_MOCK === '1'

// ============================================================
// mockApi - 兼容旧代码的 mock 统一对象
// ============================================================
import { authHandlers } from './handlers/auth'
import { playerHandlers } from './handlers/players'
import { orderHandlers } from './handlers/orders'

export const mockApi = {
  login: authHandlers.login,
  register: authHandlers.register,
  getApplyStatus: authHandlers.getApplyStatus,
  getPlayers: playerHandlers.getPlayers,
  getPlayerDetail: playerHandlers.getPlayerDetail,
  createOrder: orderHandlers.createOrder,
  getOrders: orderHandlers.getOrders,
  getOrderDetail: orderHandlers.getOrderDetail,
}