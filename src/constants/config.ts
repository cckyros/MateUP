// ========== 环境配置 ==========

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.3.14:3000'
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://192.168.3.14:3000'

export const PAGE_SIZE = 20

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  PLAYER_FILTERS: 'player_filters',
  PLAYER_STATUS: 'playerStatus',
  CHAT_MESSAGES: 'banlv_chat_messages',
  FAVORITE_IDS: 'banlv_favorite_ids',
} as const
