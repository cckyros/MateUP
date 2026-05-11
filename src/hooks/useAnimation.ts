// ============================================================
// usePressAnimation - 按压动画 hook
// ============================================================
import { useCallback } from 'react'
import { motion } from 'framer-motion'

export const listStagger = (delay: number = 0.07, staggerChildren: number = 0.05) => ({
  hidden: {},
  show: {
    transition: {
      delayChildren: delay,
      staggerChildren,
    },
  },
})

export const listItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
    },
  },
}

export const cardHoverProps = {
  whileHover: { scale: 1.015, boxShadow: '0px 8px 24px rgba(255,107,157,0.25)' },
  whileTap: { scale: 0.98 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
}

export const buttonTap = {
  whileTap: { scale: 0.96, opacity: 0.85 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
}

export const scaleTap = {
  whileTap: { scale: 0.95 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
}

export const scaleHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
}