// Mock 统一入口
// 通过 VITE_USE_MOCK=1 开启，production 默认关闭

export * from './data/players'
export * from './data/orders'
export * from './data/users'
export * from './handlers/auth'
export * from './handlers/players'
export * from './handlers/orders'

export const isMockEnabled = import.meta.env.VITE_USE_MOCK === '1'
