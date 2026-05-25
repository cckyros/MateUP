/**
 * AnimatedList — Telegram 风格级联列表
 *
 * 子元素依次入场，从下方滑入 + 淡入。
 * 用法：
 *   <AnimatedList>
 *     {items.map(item => <AnimatedItem key={item.id}>...</AnimatedItem>)}
 *   </AnimatedList>
 */
import React from 'react'
import { motion } from 'framer-motion'
import { listStagger, listItem } from '@/utils/animations'

interface AnimatedListProps {
  children: React.ReactNode
  stagger?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  stagger = 0.04,
  delay = 0.06,
  style,
}) => (
  <motion.div
    variants={listStagger(stagger, delay)}
    initial="initial"
    animate="animate"
    style={style}
  >
    {children}
  </motion.div>
)

interface AnimatedItemProps {
  children: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
}

export const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  style,
  onClick,
}) => (
  <motion.div
    variants={listItem}
    style={style}
    onClick={onClick}
    layout
  >
    {children}
  </motion.div>
)
