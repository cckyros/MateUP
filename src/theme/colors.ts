// ============================================================
// 伴游 App - 设计系统（Design System）
// ============================================================

export const colors = {
  // 品牌主色
  primary: '#FF6B9D',
  secondary: '#FF8E53',
  accent: '#667eea',

  // 背景色
  background: '#16213e',
  card: '#1a1a2e',

  // 文字
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',

  // 边框
  border: 'rgba(255,255,255,0.1)',

  // 状态色
  success: '#00D9A6',
  warning: '#FFB800',
  error: '#FF4757',
} as const

// 渐变快捷方式
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
  accent: `linear-gradient(135deg, ${colors.accent} 0%, #764ba2 100%)`,
  card: `linear-gradient(135deg, ${colors.primary} 0%, #c44569 100%)`,
} as const

// 字体大小
export const fontSize = {
  xs: '11px',
  sm: '12px',
  md: '13px',
  base: '14px',
  lg: '15px',
  xl: '16px',
  '2xl': '17px',
  '3xl': '20px',
  '4xl': '22px',
} as const

// 圆角
export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  full: '9999px',
} as const

// 间距
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '14px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
} as const

// z-index 层级
export const zIndex = {
  fixed: 100,
  modal: 200,
  toast: 300,
} as const

// 阴影
export const shadows = {
  sm: '0 2px 8px rgba(0,0,0,0.2)',
  md: '0 4px 12px rgba(0,0,0,0.3)',
  lg: '0 8px 24px rgba(255,107,157,0.25)',
  primary: `0 4px 15px ${colors.primary}40`,
  accent: `0 4px 12px ${colors.accent}40`,
} as const