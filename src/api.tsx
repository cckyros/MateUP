// API 统一入口（兼容旧代码）
// 新代码请直接从 '../api' 或对应子目录导入

export { default as api, request } from './api/client'
export * from './api/user'
export * from './api/players'
export * from './api/order'
export * from './api/apply'
export * from './api/playerApi'
export * from './api/chat'
export * from './api/favorites'

// modules 层的 API（部分页面从 '../api' 导入这些）
export { authApi } from './api/modules/auth'
export { playersApi } from './api/modules/players'
export { ordersApi } from './api/modules/orders'
export { playerApi } from './api/modules/playerApi'
export { applyApi } from './api/modules/apply'
export * from './api/modules/chat'

export { mockApi } from './mocks'
