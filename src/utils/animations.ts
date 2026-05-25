/**
 * animations.ts - Telegram 风格非线性弹簧动画系统
 *
 * 核心理念：
 * - 所有动画使用弹簧物理（spring），拒绝线性/贝塞尔
 * - 小元素用高刚度（快速响应），大元素用低刚度（柔和过渡）
 * - 交互反馈即时（< 50ms 感知），回弹自然
 * - 级联动画错开时间，营造流动感
 */

import type { Variants, Transition } from 'framer-motion'

// ============================================================
// 弹簧物理预设
// ============================================================

export const SPRING = {
  /** 触觉反馈：极快响应，按下/松开瞬间完成 */
  tactile: { type: 'spring' as const, stiffness: 800, damping: 35, mass: 0.5 },
  /** 快速弹簧：按钮、标签切换、小卡片 */
  snappy: { type: 'spring' as const, stiffness: 500, damping: 30, mass: 0.8 },
  /** 默认弹簧：通用元素动画 */
  default: { type: 'spring' as const, stiffness: 400, damping: 28, mass: 1 },
  /** 柔和弹簧：页面过渡、大区块 */
  gentle: { type: 'spring' as const, stiffness: 260, damping: 26, mass: 1 },
  /** 慢速弹簧：全屏 Modal、底部面板 */
  slow: { type: 'spring' as const, stiffness: 200, damping: 24, mass: 1.2 },
  /** 弹性：有明显回弹（overshoot），用于弹窗入场、点赞等强调 */
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 15, mass: 0.8 },
  /** 橡皮筋：下拉刷新、边界回弹 */
  rubber: { type: 'spring' as const, stiffness: 150, damping: 15, mass: 1 },
} satisfies Record<string, Transition>

// ============================================================
// 页面过渡（Telegram 风格：从右滑入，有轻微纵深缩放）
// ============================================================

export const pageTransition: Variants = {
  initial: {
    x: '8%',
    opacity: 0,
    scale: 0.96,
  },
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: SPRING.gentle,
  },
  exit: {
    x: '-4%',
    opacity: 0,
    scale: 0.97,
    transition: { ...SPRING.snappy, stiffness: 350 },
  },
}

/** 从底部滑入（Modal 类页面：支付、设置） */
export const slideUpTransition: Variants = {
  initial: {
    y: '12%',
    opacity: 0,
    scale: 0.94,
  },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: SPRING.slow,
  },
  exit: {
    y: '6%',
    opacity: 0,
    scale: 0.96,
    transition: SPRING.snappy,
  },
}

// ============================================================
// 列表级联动画（Telegram 消息列表/联系人列表风格）
// ============================================================

/** 列表容器：子元素错开入场 */
export const listStagger = (
  staggerChildren = 0.04,
  delayChildren = 0.06,
): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
})

/** 列表项：从下方滑入 + 淡入 */
export const listItem: Variants = {
  initial: {
    opacity: 0,
    y: 16,
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
    y: -8,
    scale: 0.97,
    transition: SPRING.snappy,
  },
}

/** 紧凑列表项（聊天消息气泡） */
export const chatBubble: Variants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: SPRING.snappy,
  },
}

// ============================================================
// 卡片交互
// ============================================================

/** 卡片 hover + press */
export const cardHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    transition: SPRING.default,
  },
  hover: {
    scale: 1.015,
    boxShadow: '0 6px 20px rgba(255,107,157,0.2)',
    transition: SPRING.snappy,
  },
  tap: {
    scale: 0.975,
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
    transition: SPRING.tactile,
  },
}

export const cardHoverProps = {
  initial: 'rest',
  whileHover: 'hover',
  whileTap: 'tap',
  variants: cardHover,
}

// ============================================================
// 按钮 / 可按压元素
// ============================================================

/** 主按钮按压 */
export const buttonTap = {
  whileTap: {
    scale: 0.95,
    opacity: 0.85,
    transition: SPRING.tactile,
  },
}

/** 图标按钮按压（更小幅度） */
export const iconTap = {
  whileTap: {
    scale: 0.88,
    opacity: 0.7,
    transition: SPRING.tactile,
  },
}

/** 返回按钮动画 */
export const backButtonProps = {
  whileTap: { scale: 0.82, opacity: 0.6 },
  transition: SPRING.tactile,
}

// ============================================================
// Tab 指示器
// ============================================================

/** Tab 底部滑块 — 使用 layoutId 自动过渡 */
export const tabIndicatorTransition: Transition = {
  ...SPRING.snappy,
}

/** Tab 内容切换 */
export const tabContent: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: SPRING.default },
  exit: { opacity: 0, y: -6, transition: SPRING.snappy },
}

// ============================================================
// Modal / Bottom Sheet
// ============================================================

/** 遮罩层 */
export const overlayAnimate: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

/** Modal 弹窗（中心弹出） */
export const modalAnimate: Variants = {
  initial: {
    opacity: 0,
    scale: 0.85,
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
    scale: 0.9,
    y: 10,
    transition: SPRING.snappy,
  },
}

/** Bottom Sheet（从底部弹出） */
export const bottomSheetAnimate: Variants = {
  initial: {
    y: '100%',
    borderRadius: '20px 20px 0 0',
  },
  animate: {
    y: 0,
    transition: SPRING.slow,
  },
  exit: {
    y: '100%',
    transition: { ...SPRING.gentle, stiffness: 300 },
  },
}

// ============================================================
// 微交互
// ============================================================

/** 淡入 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

/** 缩放淡入（头像、徽章、图标） */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1, transition: SPRING.bouncy },
  exit: { opacity: 0, scale: 0.8, transition: SPRING.snappy },
}

/** 收藏心跳动画 */
export const heartBeat: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.3, 0.95, 1.05, 1],
    transition: {
      duration: 0.5,
      times: [0, 0.2, 0.4, 0.6, 1],
      ease: 'easeOut',
    },
  },
}

/** 数字变化脉冲 */
export const numberPop: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.15, 1],
    transition: SPRING.bouncy,
  },
}

/** 通知红点入场 */
export const badgePop: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: SPRING.bouncy,
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: SPRING.tactile,
  },
}

/** 骨架屏闪烁 */
export const shimmer = {
  animate: {
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
}

// ============================================================
// 页面容器 Props
// ============================================================

export const pageDivProps = {
  variants: pageTransition,
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
}
