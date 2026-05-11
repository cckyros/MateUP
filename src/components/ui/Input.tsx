// ============================================================
// Input 组件
// ============================================================
import React, { memo } from 'react'
import { colors, borderRadius, fontSize } from '@/theme'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label?: string
  error?: string
  wrapperStyle?: React.CSSProperties
}

export const Input = memo(function Input({
  label,
  error,
  wrapperStyle,
  style,
  ...props
}: InputProps) {
  return (
    <div style={{ ...wrapperStyle }}>
      {label && (
        <span
          style={{
            display: 'block',
            fontSize: fontSize.sm,
            color: colors.textSecondary,
            marginBottom: 6,
          }}
        >
          {label}
        </span>
      )}
      <input
        style={{
          width: '100%',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: borderRadius.md,
          padding: '14px 16px',
          fontSize: fontSize.base,
          color: colors.text,
          border: error
            ? `1px solid ${colors.error}`
            : `1px solid ${colors.border}`,
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
          ...style,
        }}
        {...props}
      />
      {error && (
        <span
          style={{
            display: 'block',
            fontSize: fontSize.xs,
            color: colors.error,
            marginTop: 4,
          }}
        >
          {error}
        </span>
      )}
    </div>
  )
})

// 带前缀的 Input（如 +86）
interface PrefixedInputProps extends InputProps {
  prefix?: string
  prefixStyle?: React.CSSProperties
}

export const PrefixedInput = memo(function PrefixedInput({
  prefix,
  prefixStyle,
  style,
  ...props
}: PrefixedInputProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: borderRadius.md,
        padding: '0 16px',
        border: `1px solid ${colors.border}`,
        ...wrapperStyle,
      }}
    >
      {prefix && (
        <span
          style={{
            fontSize: fontSize.base,
            color: colors.textSecondary,
            marginRight: 8,
            flexShrink: 0,
            ...prefixStyle,
          }}
        >
          {prefix}
        </span>
      )}
      <input
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          padding: '14px 0',
          fontSize: fontSize.base,
          color: colors.text,
          ...style,
        }}
        {...props}
      />
    </div>
  )
})