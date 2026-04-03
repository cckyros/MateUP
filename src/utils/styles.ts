import { CSSProperties } from 'react'

// Helper to type style objects without strict CSS property checking
export function css<T extends Record<string, unknown>>(obj: T): T {
  return obj
}

// Type alias for React style objects - accepts any string value
export type Style = Partial<CSSProperties>

// Use this instead of `React.CSSProperties` for simpler style objects
export type Styles = Record<string, Style>
