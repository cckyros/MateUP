import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Player } from '../store'
import { COLORS } from '../constants'

// ========== 陪玩师卡片组件（已优化） ==========
// - React.memo 避免不必要的重渲染
// - getItemLayout 配合 FlatList 实现精准定位

interface PlayerCardProps {
  player: Player
  onPress?: (player: Player) => void
}

// 使用 memo 优化，配合 FlatList 的 memoization
export const PlayerCard = memo(function PlayerCard({
  player,
  onPress,
}: PlayerCardProps) {
  const navigate = useNavigate()

  const handlePress = () => {
    onPress ? onPress(player) : navigate(`/player/${player.id}`)
  }

  return (
    <div style={styles.card} onClick={handlePress}>
      {/* 头像区域 */}
      <div style={styles.avatarWrapper}>
        <img src={player.avatar} alt={player.name} style={styles.avatar} />
        {player.isOnline && <span style={styles.onlineBadge} />}
      </div>

      {/* 信息区域 */}
      <div style={styles.info}>
        <div style={styles.nameRow}>
          <span style={styles.name}>{player.name}</span>
          <span style={styles.rank}>{player.rank}</span>
        </div>

        {/* 标签 */}
        <div style={styles.tags}>
          {player.tags.slice(0, 3).map((tag) => (
            <span key={tag} style={styles.tag}>
              {tag}
            </span>
          ))}
        </div>

        {/* 价格和评分 */}
        <div style={styles.bottomRow}>
          <span style={styles.price}>¥{player.price}/小时</span>
          <span style={styles.rating}>⭐ {player.rating}</span>
          <span style={styles.orders}>{player.ordersCount}单</span>
        </div>
      </div>
    </div>
  )
})

// 导出固定高度，用于 FlatList getItemLayout
export const PLAYER_CARD_HEIGHT = 100

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
    border: `1px solid ${COLORS.border}`,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: '12px',
  },
  avatar: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#00D9A6',
    border: '2px solid #16213e',
  },
  info: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  name: {
    color: COLORS.text,
    fontSize: '16px',
    fontWeight: '600',
  },
  rank: {
    color: COLORS.textSecondary,
    fontSize: '12px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  tags: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    marginTop: '4px',
  },
  tag: {
    color: COLORS.primary,
    fontSize: '11px',
    backgroundColor: 'rgba(255,107,157,0.15)',
    padding: '2px 8px',
    borderRadius: '10px',
  },
  bottomRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '6px',
  },
  price: {
    color: COLORS.secondary,
    fontSize: '15px',
    fontWeight: '700',
  },
  rating: {
    color: COLORS.textSecondary,
    fontSize: '12px',
  },
  orders: {
    color: COLORS.textSecondary,
    fontSize: '12px',
  },
}
