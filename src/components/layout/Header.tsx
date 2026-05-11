// ============================================================
// Header 组件 - 页面顶部导航栏
// ============================================================
import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, MotionProps } from 'framer-motion'
import { colors, fontSize } from '@/theme'

interface HeaderProps {
  title: string
  onBack?: () => void
  showBack?: boolean
  right?: React.ReactNode
  motionProps?: MotionProps
}

export const Header = memo(function Header({
  title,
  onBack,
  showBack = true,
  right,
  motionProps,
}: HeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div
      style={{
        backgroundColor: colors.card,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ width: 40 }}>
        {showBack && (
          <motion.span
            style={{ fontSize: 24, cursor: 'pointer', color: colors.text }}
            onClick={handleBack}
            whileTap={{ scale: 0.85, opacity: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            {...motionProps}
          >
            ←
          </motion.span>
        )}
      </div>

      <span
        style={{
          fontSize: fontSize['2xl'],
          fontWeight: 'bold',
          color: colors.text,
        }}
      >
        {title}
      </span>

      <div style={{ width: 40, textAlign: 'right' }}>
        {right}
      </div>
    </div>
  )
})