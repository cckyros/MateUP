// ============================================================
// Badge 组件
// ============================================================
import React, { memo } from 'react'
import { colors, borderRadius, fontSize } from '@/theme'

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  style?: React.CSSProperties
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'rgba(255,107,157,0.2)',
    color: colors.primary,
    border: `1px solid ${colors.primary}40`,
  },
  success: {
    backgroundColor: 'rgba(0,217,166,0.15)',
    color: colors.success,
    border: `1px solid ${colors.success}40`,
  },
  warning: {
    backgroundColor: 'rgba(255,184,0,0.15)',
    color: colors.warning,
    border: `1px solid ${colors.warning}40`,
  },
  error: {
    backgroundColor: 'rgba(255,71,87,0.15)',
    color: colors.error,
    border: `1px solid ${colors.error}40`,
  },
  default: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: colors.textSecondary,
    border: `1px solid ${colors.border}`,
  },
}

export const Badge = memo(function Badge({
  variant = 'default',
  children,
  style,
}: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: borderRadius.full,
        fontSize: fontSize.xs,
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
})

// 在线状态小点
export const OnlineDot = memo(function OnlineDot({ size = 10 }: { size?: number }) {
  return (
    <span
      style={{
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: colors.success,
        border: `2px solid ${colors.card}`,
      }}
    />
  )
})