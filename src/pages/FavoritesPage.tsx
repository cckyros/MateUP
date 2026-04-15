// 收藏列表页 - Phase 8
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '../constants'
import { getFavorites, removeFavorite } from '../api/favorites'
import { useFavoritesStore } from '../store'
import { Styles } from '@/utils/styles'

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

const FavoritesPage = () => {
  const navigate = useNavigate()
  const { favorites, setFavorites, removeFavorite: removeFromStore } = useFavoritesStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFavorites({ page: 1, limit: 50 })
      .then((res) => setFavorites(res.favorites || []))
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

  return (
    <div style={styles.container}>
      {/* 顶部 */}
      <div style={styles.header}>
        <motion.span
          style={styles.backBtn}
          onClick={() => navigate(-1)}
          whileTap={{ scale: 0.85, opacity: 0.7 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          ←
        </motion.span>
        <span style={styles.headerTitle}>我的收藏</span>
        <span style={styles.count}>{favorites.length} 个</span>
      </div>

      {loading ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyText}>加载中...</span>
        </div>
      ) : favorites.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>💔</span>
          <span style={styles.emptyText}>暂无收藏</span>
          <span style={styles.emptySub}>去首页看看有哪些陪玩师吧</span>
          <motion.div
            style={styles.goHomeBtn}
            onClick={() => navigate('/home')}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            浏览陪玩师
          </motion.div>
        </div>
      ) : (
        <div style={styles.list}>
          {favorites.map((item: FavPlayer) => (
            <motion.div
              key={item.id}
              style={styles.card}
              onClick={() => navigate(`/player/${item.playerId}`)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
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
                  </div>
                  {item.isOnline && <span style={styles.onlineBadge}>在线</span>}
                </div>
                <div style={styles.info}>
                  <div style={styles.nameRow}>
                    <span style={styles.name}>{item.playerName}</span>
                    <span style={styles.rank}>{item.playerRank || '陪玩师'}</span>
                  </div>
                  <div style={styles.gamesRow}>
                    {(item.playerGames || []).slice(0, 2).map((g, i) => (
                      <span key={i} style={styles.gameTag}>{g}</span>
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
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                ❤️ 已收藏
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.card,
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    fontSize: '24px',
    cursor: 'pointer',
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  count: {
    fontSize: '13px',
    color: COLORS.textSecondary,
  },
  list: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  cardLeft: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarEmoji: {
    fontSize: '28px',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: '-2px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: COLORS.success,
    color: '#fff',
    fontSize: '9px',
    padding: '1px 5px',
    borderRadius: '8px',
    whiteSpace: 'nowrap',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  name: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  rank: {
    fontSize: '11px',
    color: COLORS.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: '1px 6px',
    borderRadius: '6px',
  },
  gamesRow: {
    display: 'flex',
    gap: '4px',
    marginBottom: '4px',
    flexWrap: 'wrap',
  },
  gameTag: {
    fontSize: '11px',
    color: COLORS.textSecondary,
    backgroundColor: 'rgba(255,107,157,0.12)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  statsRow: {
    display: 'flex',
    gap: '10px',
    fontSize: '12px',
    color: COLORS.textSecondary,
  },
  price: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  removeBtn: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    color: COLORS.primary,
    backgroundColor: `${COLORS.primary}20`,
    border: `1px solid ${COLORS.primary}40`,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '80px',
    gap: '12px',
  },
  emptyIcon: {
    fontSize: '56px',
  },
  emptyText: {
    fontSize: '16px',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: '13px',
    color: COLORS.textSecondary,
  },
  goHomeBtn: {
    marginTop: '8px',
    padding: '10px 24px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
    cursor: 'pointer',
  },
}

export default FavoritesPage
