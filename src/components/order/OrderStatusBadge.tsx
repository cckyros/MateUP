// ============================================================
// OrderStatusBadge - 订单状态徽章
// ============================================================
import React, { memo } from 'react'
import { colors } from '@/theme'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  CREATED: { label: '待支付', color: '#FFD700', icon: '💳' },
  WAIT_ACCEPT: { label: '待接单', color: '#FFD700', icon: '⏳' },
  IN_PROGRESS: { label: '进行中', color: colors.primary, icon: '🎮' },
  COMPLETED: { label: '已完成', color: colors.success, icon: '✅' },
  CANCELLED: { label: '已取消', color: colors.textSecondary, icon: '❌' },
}

interface OrderStatusBadgeProps {
  status: string
}

export const OrderStatusBadge = memo(function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, color: colors.textSecondary, icon: '❓' }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span style={{ fontSize: 36 }}>{config.icon}</span>
      <div>
        <span
          style={{
            display: 'block',
            fontSize: 18,
            fontWeight: 'bold',
            color: config.color,
            marginBottom: 4,
          }}
        >
          {config.label}
        </span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
          {status === 'WAIT_ACCEPT' && '陪玩师还未接单，可取消订单'}
          {status === 'IN_PROGRESS' && '陪玩进行中，请耐心等待'}
          {status === 'COMPLETED' && '订单已完成，感谢使用伴游'}
          {status === 'CANCELLED' && '订单已取消'}
          {status === 'CREATED' && '请在规定时间内完成支付'}
        </span>
      </div>
    </div>
  )
})