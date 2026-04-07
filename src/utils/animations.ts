/**
 * animations.ts - Telegram风格的弹簧物理动画工具
 * 
 * 基于 Framer Motion 的统一动画配置
 * 弹簧物理参数参考 Telegram/微信小程序的设计语言
 */

import { Variants, Spring, Transition } from 'framer-motion'

// ============================================================
// 弹簧动画配置（可调参数）
// ============================================================

export const SPRING = {
  /** 默认弹簧：快速且有弹性，适合页面元素 */
  default: { type: 'spring' as const, stiffness: 400, damping: 30, mass: 1 },
  /** 柔和弹簧：适合大型页面过渡 */
  gentle: { type: 'spring' as const, stiffness: 200, damping: 25, mass: 1 },
  /** 强硬弹簧：适合小元素交互 */
  snappy: { type: 'spring' as const, stiffness: 600, damping: 35, mass: 0.8 },
  /** 弹性弹簧：适合 Modal/Toast 弹窗 */
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 20, mass: 1 },
} satisfies Record<string, Spring>

// 动画时长（毫秒），当 type 为 "tween" 时使用
export const DURATION = {
  fast: 150,
  normal: 250,
  slow: 400,
}

// ============================================================
// 页面过渡动画
// ============================================================

/** 页面入场：从右滑入 + 淡入 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    x: 30,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: SPRING.gentle,
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.98,
    transition: { duration: DURATION.fast, ease: 'easeOut' },
  },
}

/** 页面入场：从底部滑入（适合 Modal 类页面） */
export const slideUpTransition: Variants = {
  initial: {
    opacity: 0,
    y: 60,
    scale: 0.96,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: SPRING.bouncy,
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.96,
    transition: { duration: DURATION.fast, ease: 'easeOut' },
  },
}

// ============================================================
// 卡片悬停动画
// ============================================================

/** 卡片 hover：轻微放大 + 阴影增强 */
export const cardHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.3)',
    transition: SPRING.default,
  },
  hover: {
    scale: 1.02,
    boxShadow: '0px 8px 24px rgba(255,107,157,0.25)',
    transition: SPRING.snappy,
  },
}

export const cardHoverProps = {
  initial: 'rest',
  whileHover: 'hover',
  variants: cardHover,
}

// ============================================================
// 按钮点击动画
// ============================================================

/** 按钮点击：缩小 + 透明度变化 */
export const buttonTap = {
  whileTap: {
    scale: 0.96,
    opacity: 0.85,
    transition: SPRING.snappy,
  },
}

// ============================================================
// Modal / Toast 弹窗动画
// ============================================================

/** Modal 入退场：scale + opacity 弹簧动画 */
export const modalAnimate: Variants = {
  initial: {
    opacity: 0,
    scale: 0.88,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: SPRING.bouncy,
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 10,
    transition: { duration: DURATION.fast, ease: 'easeOut' },
  },
}

/** Modal 遮罩层动画 */
export const overlayAnimate = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: DURATION.fast },
}

// ============================================================
// 列表级联（Stagger）动画
// ============================================================

/** 列表容器 stagger 配置 */
export const listStagger = (
  staggerChildren = 0.06,
  delayChildren = 0.1
): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})

/** 列表 item 入场动画 */
export const listItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.97,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: SPRING.default,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.97,
    transition: { duration: DURATION.fast },
  },
}

// ============================================================
// 通用过渡动画
// ============================================================

/** 淡入 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.normal } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
}

/** 缩放淡入 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: SPRING.bouncy },
  exit: { opacity: 0, scale: 0.9, transition: { duration: DURATION.fast } },
}

// ============================================================
// AnimatePresence 包装器组件 Props
// ============================================================

/** 页面容器 Props，配合 AnimatePresence 使用 */
export const pageDivProps = {
  variants: pageTransition,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
}
