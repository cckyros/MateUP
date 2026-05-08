// API 统一入口（兼容旧代码）
// 新代码请直接从 '../api' 或对应子目录导入

export { default as api, request } from './api/client'
export * from './api/user'
export * from './api/players'
export * from './api/order'
export * from './api/apply'
export * from './api/playerApi'
export * from './api/chat'
export { mockApi } from './api/mock'
