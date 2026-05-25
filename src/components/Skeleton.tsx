/**
 * Skeleton — 骨架屏加载态
 *
 * 闪烁动画，在数据加载时替代空白页面。
 */
import React from 'react'
import { motion } from 'framer-motion'
import { shimmer } from '@/utils/animations'
import { COLORS } from '@/constants'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: number
  style?: React.CSSProperties
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => (
  <motion.div
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: 'rgba(255,255,255,0.08)',
      ...style,
    }}
    animate={shimmer.animate}
  />
)

/** 陪玩师卡片骨架 */
export const PlayerCardSkeleton: React.FC = () => (
  <div style={skeletonStyles.card}>
    <Skeleton width={56} height={56} borderRadius={28} />
    <div style={skeletonStyles.info}>
      <Skeleton width="60%" height={16} />
      <Skeleton width="40%" height={12} style={{ marginTop: 8 }} />
      <Skeleton width="80%" height={12} style={{ marginTop: 6 }} />
    </div>
    <Skeleton width={60} height={24} borderRadius={12} />
  </div>
)

/** 列表骨架（多行） */
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div style={skeletonStyles.list}>
    {Array.from({ length: count }).map((_, i) => (
      <PlayerCardSkeleton key={i} />
    ))}
  </div>
)

const skeletonStyles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  info: {
    flex: 1,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
}
