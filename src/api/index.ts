import client, { request } from './client'

// API 统一入口
// 所有模块统一通过这里导出

const api = client

export default api
export { request }

// Auth
export { authApi } from './modules/auth'

// Players
export { playersApi } from './modules/players'

// Orders
export { ordersApi } from './modules/orders'
export * from './order'  // 直接导出独立函数（acceptOrder 等）

// Player Center
export { playerApi } from './modules/playerApi'

// Apply
export * from './modules/apply'

// Chat
export * from './modules/chat'

// User
export * from './user'

// Mock
export * from '../mocks'
