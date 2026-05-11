// ============================================================
// PlayerCard - 陪玩师卡片
// ============================================================
import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { colors, borderRadius, fontSize, gradients } from '@/theme'
import { OnlineDot } from '../ui/Badge'
import type { Player } from '@/store/player/types'

interface PlayerCardProps {
  player: Player
  onPress?: (player: Player) => void
}

export const PlayerCard = memo(function PlayerCard({
  player,
  onPress,
}: PlayerCardProps) {
  const navigate = useNavigate()

  const handlePress = () => {
    onPress ? onPress(player) : navigate(`/player/${player.id}`)
  }

  return (
    <motion.div
      onClick={handlePress}
      whileHover={{ scale: 1.015, boxShadow: '0px 8px 24px rgba(255,107,157,0.25)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: 16,
        marginBottom: 14,
        border: `1px solid ${colors.border}`,
        cursor: 'pointer',
      }}
    >
      {/* 头部：头像 + 基本信息 */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
        {/* 头像 */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={player.avatar}
            alt={player.name}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          {player.isOnline && <OnlineDot />}
        </div>

        {/* 信息 */}
        <div style={{ flex: 1 }}>
          {/* 名字 + 等级 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: fontSize.xl, fontWeight: 'bold', color: colors.text }}>
              {player.name}
            </span>
            <span
              style={{
                fontSize: fontSize.xs,
                color: colors.textSecondary,
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '2px 6px',
                borderRadius: 4,
              }}
            >
              {player.rank}
            </span>
          </div>

          {/* 游戏标签 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            {player.games?.slice(0, 1).map(game => (
              <span
                key={game}
                style={{
                  backgroundColor: 'rgba(255,107,157,0.2)',
                  color: colors.primary,
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: fontSize.xs,
                }}
              >
                {game}
              </span>
            ))}
            <span style={{ fontSize: fontSize.sm, color: 'rgba(255,255,255,0.5)' }}>
              {player.rank}
            </span>
          </div>

          {/* 标签 */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {player.tags?.slice(0, 3).map(tag => (
              <span
                key={tag}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '3px 8px',
                  borderRadius: 8,
                  fontSize: fontSize.xs,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 统计行 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '12px 0',
          borderTop: `1px solid ${colors.border}`,
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: 12,
        }}
      >
        <StatItem label="评分" value={`⭐ ${player.rating}`} />
        <StatItem label="接单" value={String(player.ordersCount)} />
        <StatItem
          label={player.isOnline ? '在线' : '离线'}
          value={player.isOnline ? '在线' : '离线'}
          valueStyle={{ color: player.isOnline ? colors.success : 'rgba(255,255,255,0.3)' }}
        />
      </div>

      {/* 底部：价格 + 预约 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: colors.primary,
            }}
          >
            ¥{player.price}
          </span>
          <span style={{ fontSize: fontSize.sm, color: 'rgba(255,255,255,0.4)' }}>
            /小时
          </span>
        </div>
        <motion.div
          onClick={(e) => { e.stopPropagation(); navigate(`/player/${player.id}`) }}
          whileTap={{ scale: 0.96, opacity: 0.85 }}
          style={{
            background: gradients.primary,
            color: '#fff',
            padding: '10px 20px',
            borderRadius: 20,
            fontSize: fontSize.base,
            fontWeight: 'bold',
            boxShadow: `0 4px 12px ${colors.primary}40`,
          }}
        >
          立即预约
        </motion.div>
      </div>
    </motion.div>
  )
}, (prev, next) => prev.player.id === next.player.id && prev.onPress === next.onPress)

// 小型统计组件
function StatItem({
  label,
  value,
  valueStyle,
}: {
  label: string
  value: string
  valueStyle?: React.CSSProperties
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <span
        style={{
          display: 'block',
          fontSize: fontSize.xs,
          color: 'rgba(255,255,255,0.4)',
          marginBottom: 2,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: fontSize.base,
          fontWeight: 'bold',
          color: colors.text,
          ...valueStyle,
        }}
      >
        {value}
      </span>
    </div>
  )
}