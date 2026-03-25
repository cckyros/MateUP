// ========== 常量配置 ==========

// 游戏类型
export const GAMES = {
  LOL: 'lol',
  王者: 'honor',
  永劫: 'yongjie',
  APEX: 'apex',
  蛋仔: 'danzai',
} as const

export type GameType = (typeof GAMES)[keyof typeof GAMES]

// 游戏显示名
export const GAME_NAMES: Record<string, string> = {
  lol: '英雄联盟',
  honor: '王者荣耀',
  yongjie: '永劫无间',
  apex: '和平精英',
  danzai: '蛋仔派对',
}

// 订单状态
export const ORDER_STATUS = {
  CREATED: 'CREATED',       // 订单已创建
  WAIT_ACCEPT: 'WAIT_ACCEPT', // 待接单
  IN_PROGRESS: 'IN_PROGRESS', // 进行中
  COMPLETED: 'COMPLETED',     // 已完成
  CANCELLED: 'CANCELLED',     // 已取消
} as const

// 订单状态显示文案
export const ORDER_STATUS_TEXT: Record<string, string> = {
  [ORDER_STATUS.CREATED]: '待支付',
  [ORDER_STATUS.WAIT_ACCEPT]: '待接单',
  [ORDER_STATUS.IN_PROGRESS]: '进行中',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
}

// 订单状态颜色
export const ORDER_STATUS_COLOR: Record<string, string> = {
  [ORDER_STATUS.CREATED]: '#FFB800',
  [ORDER_STATUS.WAIT_ACCEPT]: '#FF6B9D',
  [ORDER_STATUS.IN_PROGRESS]: '#00D9A6',
  [ORDER_STATUS.COMPLETED]: '#999999',
  [ORDER_STATUS.CANCELLED]: '#FF4757',
}

// 支付方式
export const PAY_METHODS = {
  MOCK: 'mock',
  IAP: 'iap',
  STRIPE: 'stripe',
} as const

// 聊天消息类型
export const MSG_TYPE = {
  CHAT: 'chat',
  SYSTEM: 'system',
  IMAGE: 'image',
  VOICE: 'voice',
} as const

// 通用颜色
export const COLORS = {
  primary: '#FF6B9D',
  secondary: '#FF8E53',
  accent: '#667eea',
  background: '#16213e',
  card: '#1a1a2e',
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
  border: 'rgba(255,255,255,0.1)',
  success: '#00D9A6',
  warning: '#FFB800',
  error: '#FF4757',
} as const

// 分页配置
export const PAGE_SIZE = 20

// 本地存储 Key
export const STORAGE_KEY = {
  TOKEN: 'token',
  USER: 'user',
  PLAYER_FILTERS: 'player_filters',
} as const
