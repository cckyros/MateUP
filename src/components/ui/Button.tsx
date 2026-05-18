// ============================================================
// 按钮组件 - 统一渐变按钮
// ============================================================
import React, { memo } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { colors, gradients, borderRadius, shadows, fontSize } from '@/theme'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  onTap?: () => void
  children: React.ReactNode
  motionProps?: MotionProps
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 16px', fontSize: fontSize.sm, borderRadius: borderRadius.md },
  md: { padding: '10px 20px', fontSize: fontSize.base, borderRadius: borderRadius.xl },
  lg: { padding: '14px 24px', fontSize: fontSize.lg, borderRadius: borderRadius['2xl'] },
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: gradients.primary,
    color: '#fff',
    border: 'none',
    boxShadow: shadows.primary,
  },
  secondary: {
    background: gradients.accent,
    color: '#fff',
    border: 'none',
    boxShadow: shadows.accent,
  },
  outline: {
    backgroundColor: 'transparent',
    color: colors.textSecondary,
    border: `1px solid ${colors.border}`,
  },
  ghost: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: colors.text,
    border: '1px solid transparent',
  },
  danger: {
    background: `linear-gradient(135deg, ${colors.error} 0%, #ff6b6b 100%)`,
    color: '#fff',
    border: 'none',
  },
}

export const Button = memo(function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  onTap,
  children,
  style,
  disabled,
  motionProps,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.2s',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  }

  const handleClick = (e: React.MouseEvent) => {
    if (disabled || loading || !onTap) return
    onTap()
  }

  if (onTap) {
    return (
      <motion.button
        style={baseStyle}
        onClick={handleClick}
        disabled={disabled || loading}
        whileTap={disabled || loading ? {} : { scale: 0.96, opacity: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...motionProps}
        {...props}
      >
        {loading ? '加载中...' : children}
      </motion.button>
    )
  }

  return (
    <button
      style={baseStyle}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '加载中...' : children}
    </button>
  )
})