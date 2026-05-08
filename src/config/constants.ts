// 通用颜色常量
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

// 游戏类型映射
export const GAMES = {
  LOL: 'lol',
  HONOR: 'honor',
  YONGJIE: 'yongjie',
  APEX: 'apex',
  DANZAI: 'danzai',
} as const

export const GAME_NAMES: Record<string, string> = {
  lol: '英雄联盟',
  honor: '王者荣耀',
  yongjie: '永劫无间',
  apex: '和平精英',
  danzai: '蛋仔派对',
}

// 订单状态
export const ORDER_STATUS = {
  CREATED: 'CREATED',
  WAIT_ACCEPT: 'WAIT_ACCEPT',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export const ORDER_STATUS_TEXT: Record<string, string> = {
  [ORDER_STATUS.CREATED]: '待支付',
  [ORDER_STATUS.WAIT_ACCEPT]: '待接单',
  [ORDER_STATUS.IN_PROGRESS]: '进行中',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
}

export const ORDER_STATUS_COLOR: Record<string, string> = {
  [ORDER_STATUS.CREATED]: '#FFB800',
  [ORDER_STATUS.WAIT_ACCEPT]: '#FF6B9D',
  [ORDER_STATUS.IN_PROGRESS]: '#00D9A6',
  [ORDER_STATUS.COMPLETED]: '#999999',
  [ORDER_STATUS.CANCELLED]: '#FF4757',
}

// 分页
export const PAGE_SIZE = 20

// Storage Keys（与旧值保持一致，避免 localStorage 失效）
export const STORAGE_KEY = {
  TOKEN: 'token',
  USER: 'user',
  PLAYER_FILTERS: 'player_filters',
  CHAT_MESSAGES: 'banlv_chat_messages',
  FAVORITE_IDS: 'banlv_favorite_ids',
} as const
