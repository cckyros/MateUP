// ============================================================
// BottomSheet 底部弹层
// ============================================================
import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colors, borderRadius } from '@/theme'

interface BottomSheetProps {
  visible: boolean
  title?: string
  onClose?: () => void
  children: React.ReactNode
}

export const BottomSheet = memo(function BottomSheet({
  visible,
  title,
  onClose,
  children,
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)',
              zIndex: 200,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxWidth: 480,
              margin: '0 auto',
              backgroundColor: colors.card,
              borderRadius: `${borderRadius.xl}px ${borderRadius.xl}px 0 0`,
              padding: '0 0 32px 0',
              zIndex: 201,
              maxHeight: '80vh',
              overflowY: 'auto' as const,
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* 拖动把手 */}
            <div
              style={{
                width: 40,
                height: 4,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                margin: '12px auto 0',
              }}
            />
            {title && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 'bold' as const,
                    color: colors.text,
                    margin: 0,
                  }}
                >
                  {title}
                </h3>
                {onClose && (
                  <motion.span
                    style={{ fontSize: 18, color: colors.textSecondary, cursor: 'pointer' }}
                    onClick={onClose}
                    whileTap={{ scale: 0.85, opacity: 0.7 }}
                  >
                    ✕
                  </motion.span>
                )}
              </div>
            )}
            <div>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
})