// 收藏列表页 - Phase 8
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getFavorites, removeFavorite } from '@/api/favorites'
import { useFavoritesStore } from '@/store'
import { styles } from './FavoritesPage.styles'
import { SPRING, backButtonProps, listStagger, listItem } from '@/utils/animations'
import { ListSkeleton } from '@/components/Skeleton'

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
          transition={SPRING.tactile}
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
            transition={SPRING.tactile}
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
              transition={SPRING.gentle}
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
                transition={SPRING.tactile}
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


export default FavoritesPage
