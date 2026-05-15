// ========== 订单相关常量 ==========

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

export const ORDER_TABS = ['全部', '待接单', '进行中', '已完成'] as const

export const PAY_METHODS = {
  MOCK: 'mock',
  IAP: 'iap',
  STRIPE: 'stripe',
} as const
