// ============================================================
// OrderCard - 订单卡片
// ============================================================
import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { colors, borderRadius, fontSize, gradients } from '@/theme'
import type { Order } from '@/store/order/types'

// 游戏中文名映射
const GAME_NAMES: Record<string, string> = {
  honor: '王者荣耀',
  apex: '和平精英',
  lol: '英雄联盟',
  yongjie: '永劫无间',
  danzai: '蛋仔派对',
}

// 状态映射
const STATUS_MAP: Record<string, { label: string; color: string }> = {
  CREATED: { label: '待支付', color: '#FFD700' },
  WAIT_ACCEPT: { label: '待接单', color: '#FFD700' },
  IN_PROGRESS: { label: '进行中', color: colors.primary },
  COMPLETED: { label: '已完成', color: colors.success },
  CANCELLED: { label: '已取消', color: colors.textSecondary },
}

// 相对时间
const formatRelativeTime = (ts: number | string) => {
  const d = new Date(Number(ts))
  const now = new Date()
  const diff = Number(now) - Number(d)
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

interface OrderCardProps {
  order: Order
  onCancel?: (orderId: string) => void
  onComplete?: (orderId: string) => void
}

export const OrderCard = memo(function OrderCard({
  order,
  onCancel,
  onComplete,
}: OrderCardProps) {
  const navigate = useNavigate()
  const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: colors.textSecondary }
  const gameName = GAME_NAMES[order.game] || order.game || '游戏'

  return (
    <motion.div
      onClick={() => navigate(`/order-detail/${order.id}`)}
      whileHover={{ scale: 1.01, boxShadow: '0px 6px 20px rgba(0,0,0,0.3)' }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: 16,
        marginBottom: 12,
        border: `1px solid ${colors.border}`,
        cursor: 'pointer',
      }}
    >
      {/* 顶部：游戏 + 状态 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            backgroundColor: 'rgba(255,107,157,0.15)',
            color: colors.primary,
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: fontSize.md,
            fontWeight: 'bold',
          }}
        >
          {gameName}
        </span>
        <span
          style={{
            fontSize: fontSize.md,
            fontWeight: 'bold',
            color: statusInfo.color,
          }}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* 陪玩师信息 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 0',
          borderTop: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <span style={{ fontSize: 40 }}>💫</span>
        <div style={{ flex: 1 }}>
          <span
            style={{
              display: 'block',
              fontSize: fontSize.lg,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: 2,
            }}
          >
            {order.playerName}
          </span>
          <span
            style={{
              fontSize: fontSize.sm,
              color: colors.textSecondary,
            }}
          >
            {order.duration}小时
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', fontSize: fontSize.xs, color: colors.textSecondary }}>
            时长
          </span>
          <span
            style={{
              fontSize: fontSize.base,
              fontWeight: 'bold',
              color: colors.text,
            }}
          >
            {order.duration}小时
          </span>
        </div>
      </div>

      {/* 底部：时间 + 价格 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 12,
        }}
      >
        <span style={{ fontSize: fontSize.sm, color: colors.textSecondary }}>
          📅 {formatRelativeTime(order.createTime)}
        </span>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', fontSize: fontSize.xs, color: colors.textSecondary }}>
            总价
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: colors.primary,
            }}
          >
            ¥{order.price}
          </span>
        </div>
      </div>

      {/* 底部ID */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 10,
          paddingTop: 10,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <span style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
          订单号: {order.id}
        </span>
        <span style={{ fontSize: fontSize.xs, color: colors.textSecondary }}>
          {formatRelativeTime(order.createTime)}
        </span>
      </div>

      {/* 操作按钮 */}
      {order.status === 'WAIT_ACCEPT' && onCancel && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
          <motion.span
            onClick={(e) => { e.stopPropagation(); onCancel(order.id) }}
            whileTap={{ scale: 0.94, opacity: 0.7 }}
            style={{
              padding: '6px 16px',
              borderRadius: 16,
              fontSize: fontSize.sm,
              color: colors.textSecondary,
              border: `1px solid ${colors.border}`,
              cursor: 'pointer',
            }}
          >
            取消订单
          </motion.span>
        </div>
      )}
      {order.status === 'IN_PROGRESS' && onComplete && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
          <motion.span
            onClick={(e) => { e.stopPropagation(); onComplete(order.id) }}
            whileTap={{ scale: 0.94, opacity: 0.8 }}
            style={{
              padding: '6px 16px',
              borderRadius: 16,
              fontSize: fontSize.sm,
              color: '#fff',
              background: gradients.primary,
              cursor: 'pointer',
              boxShadow: `0 4px 12px ${colors.primary}40`,
              border: 'none',
            }}
          >
            确认完成
          </motion.span>
        </div>
      )}
    </motion.div>
  )
})