// ============================================================
// Loading / Empty 状态组件
// ============================================================
import React, { memo } from 'react'
import { colors, fontSize } from '@/theme'

interface LoadingProps {
  text?: string
}

export const Loading = memo(function Loading({ text = '加载中...' }: LoadingProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 0',
        color: colors.textSecondary,
        fontSize: fontSize.base,
      }}
    >
      {text}
    </div>
  )
})

interface EmptyProps {
  icon?: string
  text?: string
  sub?: string
  action?: React.ReactNode
}

export const Empty = memo(function Empty({
  icon = '📋',
  text = '暂无数据',
  sub,
  action,
}: EmptyProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 60,
        gap: 8,
      }}
    >
      <span style={{ fontSize: 48 }}>{icon}</span>
      <span style={{ fontSize: fontSize.lg, color: colors.text }}>{text}</span>
      {sub && (
        <span style={{ fontSize: fontSize.md, color: colors.textSecondary }}>
          {sub}
        </span>
      )}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  )
})