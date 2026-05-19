import type { EarningsOverview, EarningsRecord } from '@/types'

const now = Date.now()
const HOUR = 3600000
const DAY = 86400000

export const MOCK_EARNINGS_OVERVIEW: EarningsOverview = {
  balance: 1256.50,
  totalEarnings: 8560,
  totalWithdrawn: 6800,
  pendingWithdrawal: 200,
  monthEarnings: 1860,
}

export const MOCK_EARNINGS_RECORDS: EarningsRecord[] = [
  { id: 'er_001', amount: 80, type: 'order', createTime: now - 2 * HOUR, note: '订单 #po_004 - 王者荣耀 2小时' },
  { id: 'er_002', amount: 120, type: 'order', createTime: now - 1 * DAY, note: '订单 #po_002 - LOL 3小时' },
  { id: 'er_003', amount: -200, type: 'withdraw', createTime: now - 2 * DAY, note: '提现到支付宝' },
  { id: 'er_004', amount: 40, type: 'order', createTime: now - 3 * DAY, note: '订单 #po_003 - 永劫无间 1小时' },
  { id: 'er_005', amount: 160, type: 'order', createTime: now - 4 * DAY, note: '订单 #po_001 - 王者荣耀 4小时' },
  { id: 'er_006', amount: -500, type: 'withdraw', createTime: now - 7 * DAY, note: '提现到银行卡' },
  { id: 'er_007', amount: 90, type: 'order', createTime: now - 8 * DAY, note: '订单 #po_005 - LOL 2小时' },
  { id: 'er_008', amount: 60, type: 'order', createTime: now - 10 * DAY, note: '订单 #po_006 - APEX 1小时' },
]
