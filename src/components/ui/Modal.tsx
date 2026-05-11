// ============================================================
// Modal 组件
// ============================================================
import React, { memo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { colors, borderRadius, fontSize } from '@/theme'
import { Button } from './Button'

interface ModalProps {
  visible: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  loading?: boolean
  children?: React.ReactNode
}

export const Modal = memo(function Modal({
  visible,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  loading = false,
  children,
}: ModalProps) {
  // ESC 关闭
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible && onCancel) {
        onCancel()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [visible, onCancel])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onCancel}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: colors.card,
              borderRadius: borderRadius.lg,
              padding: 24,
              maxWidth: 320,
              width: '100%',
              border: `1px solid ${colors.border}`,
            }}
          >
            <h3
              style={{
                fontSize: fontSize['3xl'],
                fontWeight: 'bold',
                color: colors.text,
                textAlign: 'center',
                margin: '0 0 10px 0',
              }}
            >
              {title}
            </h3>

            {description && (
              <p
                style={{
                  fontSize: fontSize.base,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  margin: '0 0 20px 0',
                }}
              >
                {description}
              </p>
            )}

            {children}

            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: children ? 20 : 0,
              }}
            >
              <Button
                variant="outline"
                size="md"
                onTap={onCancel}
                style={{ flex: 1 }}
              >
                {cancelText}
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={loading}
                onTap={onConfirm}
                style={{ flex: 1 }}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})