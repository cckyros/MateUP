// ============================================================
// 收藏列表页 - 重构后
// ============================================================
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '@/constants'
import { getFavorites, removeFavorite } from '@/api/favorites'
import { useFavoritesStore } from '@/store'
import { Header } from '@/components/layout/Header'
import { Badge, OnlineDot, Empty, Button } from '@/components/ui'
import { listStagger, listItem } from '@/hooks'

// ============================================================
// 类型
// ============================================================
interface FavPlayer {
  id: string
  playerId: string
  playerName: string
  playerAvatar: string | null
  playerRank: string | null
  playerGames: string[]
  playerPrice: number
  playerRating: number
  playerOrdersCount: number
  isOnline: boolean
}

// ============================================================
// 主组件
// ============================================================
const FavoritesPage = () => {
  const navigate = useNavigate()
  const { favorites, setFavorites, removeFavorite: removeFromStore } = useFavoritesStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFavorites({ page: 1, limit: 50 })
      .then((res: any) => setFavorites(res.favorites || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (e: React.MouseEvent, playerId: string) => {
    e.stopPropagation()
    try {
      await removeFavorite(playerId)
      removeFromStore(playerId)
    } catch {}
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <Header title="我的收藏" onBack={() => navigate(-1)} />
        <div style={styles.loadingState}>
          <span style={{ color: COLORS.textSecondary }}>加载中...</span>
        </div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div style={styles.container}>
        <Header title="我的收藏" onBack={() => navigate(-1)} />
        <Empty
          icon="💔"
          text="暂无收藏"
          sub="去首页看看有哪些陪玩师吧"
          action={
            <Button variant="primary" size="md" onTap={() => navigate('/home')}>
              浏览陪玩师
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <Header
        title="我的收藏"
        onBack={() => navigate(-1)}
        right={<span style={{ fontSize: 13, color: COLORS.textSecondary }}>{favorites.length} 个</span>}
      />

      <div style={styles.list}>
        {favorites.map((item: FavPlayer) => (
          <motion.div
            key={item.id}
            style={styles.card}
            onClick={() => navigate(`/player/${item.playerId}`)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={styles.cardLeft}>
              <div style={styles.avatarWrapper}>
                <div style={styles.avatar}>
                  {item.playerAvatar ? (
                    <img src={item.playerAvatar} alt={item.playerName} style={styles.avatarImg} />
                  ) : (
                    <span style={styles.avatarEmoji}>💫</span>
                  )}
                  {item.isOnline && <OnlineDot />}
                </div>
              </div>
              <div style={styles.info}>
                <div style={styles.nameRow}>
                  <span style={styles.name}>{item.playerName}</span>
                  <Badge>{item.playerRank || '陪玩师'}</Badge>
                </div>
                <div style={styles.gamesRow}>
                  {(item.playerGames || []).slice(0, 2).map((g, i) => (
                    <Badge key={i} variant="primary">{g}</Badge>
                  ))}
                </div>
                <div style={styles.statsRow}>
                  <span>⭐ {item.playerRating || '5.0'}</span>
                  <span>接单 {item.playerOrdersCount || 0}</span>
                  <span style={styles.price}>¥{item.playerPrice}/小时</span>
                </div>
              </div>
            </div>
            <motion.div
              style={styles.removeBtn}
              onClick={(e) => handleRemove(e, item.playerId)}
              whileTap={{ scale: 0.9 }}
            >
              ❤️ 已收藏
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// 样式
// ============================================================
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  list: {
    padding: 12,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  cardLeft: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  avatarWrapper: {
    position: 'relative' as const,
    flexShrink: 0,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden' as const,
    position: 'relative' as const,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  gamesRow: {
    display: 'flex',
    gap: 4,
    marginBottom: 4,
    flexWrap: 'wrap' as const,
  },
  statsRow: {
    display: 'flex',
    gap: 10,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  price: {
    color: '#FFD700',
    fontWeight: 'bold' as const,
  },
  removeBtn: {
    padding: '6px 12px',
    borderRadius: 16,
    fontSize: 12,
    color: COLORS.primary,
    backgroundColor: `${COLORS.primary}20`,
    border: `1px solid ${COLORS.primary}40`,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
    flexShrink: 0,
  },
}

export default FavoritesPage