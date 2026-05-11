// ============================================================
// Toggle 开关
// ============================================================
import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { colors, borderRadius } from '@/theme'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export const Toggle = memo(function Toggle({
  checked,
  onChange,
  disabled = false,
}: ToggleProps) {
  return (
    <motion.div
      style={{
        width: 50,
        height: 28,
        borderRadius: 14,
        backgroundColor: checked ? colors.primary : 'rgba(255,255,255,0.15)',
        padding: 2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        border: `1px solid ${checked ? colors.primary : colors.border}`,
        transition: 'background-color 0.2s',
      }}
      onClick={() => !disabled && onChange(!checked)}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          backgroundColor: '#fff',
        }}
        animate={{ x: checked ? 22 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
    </motion.div>
  )
})

// ============================================================
// Chip 筛选标签
// ============================================================
interface ChipProps {
  label: string
  active?: boolean
  onClick?: () => void
}

export const Chip = memo(function Chip({ label, active, onClick }: ChipProps) {
  return (
    <motion.div
      style={{
        padding: '8px 16px',
        borderRadius: 20,
        fontSize: 13,
        color: active ? '#fff' : colors.textSecondary,
        backgroundColor: active ? colors.primary : 'rgba(255,255,255,0.08)',
        cursor: 'pointer',
        border: `1px solid ${active ? colors.primary : colors.border}`,
        fontWeight: active ? 'bold' : 'normal',
      }}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.div>
  )
})