/**
 * BottomSheet — Telegram 风格底部弹出面板
 *
 * 弹簧物理动画，支持遮罩层点击关闭。
 */
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { bottomSheetAnimate, overlayAnimate, SPRING } from '@/utils/animations'
import { COLORS } from '@/constants'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  children,
  title,
}) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          key="overlay"
          style={styles.overlay}
          variants={overlayAnimate}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={onClose}
        />
        <motion.div
          key="sheet"
          style={styles.sheet}
          variants={bottomSheetAnimate}
          initial="initial"
          animate="animate"
          exit="exit"
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.1}
          onDragEnd={(_e, info) => {
            if (info.offset.y > 100 || info.velocity.y > 300) onClose()
          }}
        >
          <div style={styles.handle} />
          {title && <div style={styles.title}>{title}</div>}
          <div style={styles.content}>{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
)

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  sheet: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 480,
    margin: '0 auto',
    backgroundColor: COLORS.card,
    borderRadius: '20px 20px 0 0',
    zIndex: 1000,
    maxHeight: '80vh',
    overflow: 'auto',
    touchAction: 'none',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    margin: '12px auto 0',
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    padding: '16px 20px 8px',
  },
  content: {
    padding: '8px 20px 32px',
  },
}
