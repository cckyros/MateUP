// 环境配置
// 所有环境相关的配置集中在这里，禁止硬编码

export const ENV = {
  // API 地址
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.3.14:3000',

  // WebSocket 地址
  WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL || 'ws://192.168.3.14:3000',

  // Mock 开关
  USE_MOCK: import.meta.env.VITE_USE_MOCK === '1',

  // 是否开启日志
  DEBUG: import.meta.env.DEV,
} as const

export type Env = typeof ENV
