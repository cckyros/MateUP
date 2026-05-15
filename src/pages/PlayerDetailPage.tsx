import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS, GAME_CN_TO_KEY, GAME_KEY_TO_CN } from '@/constants'
import { getPlayerDetail } from '@/api/players'
import { createOrder } from '@/api/order'
import { addFavorite, removeFavorite } from '@/api/favorites'
import { useFavoritesStore } from '@/store'
import { request } from '@/api'
import { Styles } from '@/utils/styles'
import { getLevelColor } from '@/utils/playerMapper'
import type { Review, Player } from '@/types'

const PlayerDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [player, setPlayer] = useState<(Player & { online?: boolean; game?: string }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [selectedHours, setSelectedHours] = useState(2)
  const [selectedGame, setSelectedGame] = useState('王者荣耀')
  const [activeTab, setActiveTab] = useState<'intro' | 'reviews'>('intro')
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [similarPlayers, setSimilarPlayers] = useState<Player[]>([])
  const { isFavorited, addFavorite: addToStore, removeFavorite: removeFromStore } = useFavoritesStore()
  const [favoriting, setFavoriting] = useState(false)
  const hoursOptions = [1, 2, 3, 4]

  const isCurrentlyFavorited = player ? isFavorited(player.id) : false

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const data = await getPlayerDetail(id)
        const p = {
          ...data,
          online: (data as any).online ?? data.isOnline,
          game: GAME_KEY_TO_CN[(data as any).game] || data.games?.[0] || '王者荣耀',
        }
        setPlayer(p)
        if (data.games?.length > 0) {
          setSelectedGame(GAME_KEY_TO_CN[data.games[0]] || data.games[0])
        }
        loadSimilarPlayers((data as any).game, id)
      } catch (err) {
        setError('加载失败')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const loadReviews = async () => {
    if (!id) return
    setReviewsLoading(true)
    try {
      const res = await request.get<{ reviews: Review[] }>(`/api/players/${id}/reviews`)
      setReviews(res.reviews || [])
    } catch (e) {
      console.error('[PlayerDetail] loadReviews error:', e)
    }
    setReviewsLoading(false)
  }

  const loadSimilarPlayers = async (game: string, currentId: string) => {
    try {
      const res = await request.get<{ players: Player[] }>('/api/players', {
        params: { game, limit: 20 },
      })
      const filtered = (res.players || []).filter((p: Player) => p.id !== currentId)
      filtered.sort((a: Player, b: Player) => (b.rating || 0) - (a.rating || 0))
      setSimilarPlayers(filtered.slice(0, 6))
    } catch (e) {
      console.error('[PlayerDetail] loadSimilarPlayers error:', e)
    }
  }

  const handleTabSwitch = (tab: 'intro' | 'reviews') => {
    setActiveTab(tab)
    if (tab === 'reviews' && reviews.length === 0) {
      loadReviews()
    }
  }

  const handleToggleFavorite = async () => {
    if (!player || favoriting) return
    setFavoriting(true)
    try {
      if (isCurrentlyFavorited) {
        await removeFavorite(player.id)
        removeFromStore(player.id)
      } else {
        await addFavorite(player.id)
        addToStore({
          id: `fav_${player.id}`,
          playerId: player.id,
          playerName: player.name,
          playerAvatar: player.avatar,
          playerRank: player.rank,
          playerGames: player.games || [player.game],
          playerPrice: player.price,
          playerRating: player.rating || 0,
          playerOrdersCount: player.ordersCount || 0,
          isOnline: player.online || false,
        })
      }
    } catch (err) {
      console.error('收藏操作失败', err)
    } finally {
      setFavoriting(false)
    }
  }

  const handleOrder = async () => {
    if (!player) return
    setCreating(true)
    try {
      const order = await createOrder({
        playerId: id,
        duration: selectedHours,
        game: GAME_CN_TO_KEY[selectedGame] || selectedGame,
      })
      navigate(`/payment/${(order as any).id}`)
    } catch (err) {
      alert(err?.response?.data?.message || '创建订单失败')
    } finally {
      setCreating(false)
    }
  }

  const formatReviewTime = (ts: number) => {
    const d = new Date(ts)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const renderStars = (rating: number) => '⭐'.repeat(Math.round(rating))

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: COLORS.textSecondary }}>加载中...</span>
      </div>
    )
  }

  if (error || !player) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
        <span style={{ color: COLORS.error }}>{error || '加载失败'}</span>
        <span style={{ color: COLORS.textSecondary, fontSize: '13px', cursor: 'pointer' }} onClick={() => navigate(-1)}>返回</span>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* 顶部返回栏 */}
      <div style={styles.header}>
        <motion.span
          style={styles.backBtn}
          onClick={() => navigate(-1)}
          whileTap={{ scale: 0.85, opacity: 0.7 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          ←
        </motion.span>
        <span style={styles.headerTitle}>陪玩师详情</span>
        <span style={styles.shareBtn}>分享</span>
      </div>

      {/* 个人信息区 */}
      <div style={styles.profileSection}>
        <div style={styles.avatarWrapper}>
          {player.avatar ? (
            <img src={player.avatar} alt={player.name} style={styles.avatarImg} />
          ) : (
            <span style={styles.avatarEmoji}>💫</span>
          )}
          {player.online && <span style={styles.onlineBadge}>在线</span>}
        </div>
        <div style={styles.profileInfo}>
          <div style={styles.nameRow}>
            <span style={styles.name}>{player.name}</span>
            <span style={{ ...styles.level, color: getLevelColor(player.rank), backgroundColor: 'rgba(0,0,0,0.2)' }}>{player.rank || '陪玩师'}</span>
          </div>
          <div style={styles.gameInfo}>
            <span style={styles.gameTag}>{player.game}</span>
            <span style={styles.rank}>{player.rank}</span>
          </div>
          <div style={styles.statsRow}>
            <span>⭐ {player.rating || '5.0'}</span>
            <span>接单 {player.ordersCount || 0}</span>
            <span style={styles.priceTag}>¥{player.price}/小时</span>
          </div>
        </div>
      </div>

      {/* Tab切换 */}
      <div style={styles.tabBar}>
        <motion.div
          style={{ ...styles.tab, ...(activeTab === 'intro' ? styles.tabActive : {}) }}
          onClick={() => handleTabSwitch('intro')}
          whileTap={{ opacity: 0.7 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          简介
        </motion.div>
        <motion.div
          style={{ ...styles.tab, ...(activeTab === 'reviews' ? styles.tabActive : {}) }}
          onClick={() => handleTabSwitch('reviews')}
          whileTap={{ opacity: 0.7 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          评价
        </motion.div>
      </div>

      {/* 简介内容 */}
      {activeTab === 'intro' && (
        <>
          {/* 游戏选择 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>选择游戏</h3>
            <div style={styles.gameOptions}>
              {['王者荣耀', '和平精英', '英雄联盟', '永劫无间'].map(game => (
                <motion.div
                  key={game}
                  style={{
                    ...styles.gameOption,
                    ...(selectedGame === game ? styles.gameOptionActive : {}),
                  }}
                  onClick={() => setSelectedGame(game)}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {game}
                </motion.div>
              ))}
            </div>
          </div>

          {/* 时长选择 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>选择时长</h3>
            <div style={styles.hoursOptions}>
              {hoursOptions.map(hour => (
                <motion.div
                  key={hour}
                  style={{
                    ...styles.hourOption,
                    ...(selectedHours === hour ? styles.hourOptionActive : {}),
                  }}
                  onClick={() => setSelectedHours(hour)}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <span style={styles.hourValue}>{hour}</span>
                  <span style={styles.hourLabel}>小时</span>
                </motion.div>
              ))}
            </div>
            <div style={styles.priceSummary}>
              <span style={styles.priceSummaryLabel}>应付金额：</span>
              <span style={styles.totalPrice}>¥{player.price * selectedHours}</span>
            </div>
          </div>

          {/* 标签 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>擅长标签</h3>
            <div style={styles.tags}>
              {(player.tags || []).map((tag: string, i: number) => (
                <span key={i} style={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>

          {/* 个人简介 */}
          {player.description && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>个人简介</h3>
              <p style={styles.bio}>{player.description}</p>
            </div>
          )}

          {/* 相似陪玩师 */}
          {similarPlayers.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>相似陪玩师</h3>
              <div style={styles.similarScroll}>
                {similarPlayers.map(p => (
                  <motion.div
                    key={p.id}
                    style={styles.similarCard}
                    onClick={() => navigate(`/player/${p.id}`)}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <div style={styles.similarAvatar}>
                      {p.avatar ? (
                        <img src={p.avatar} alt={p.name} style={styles.similarAvatarImg} />
                      ) : (
                        <span style={styles.similarAvatarEmoji}>💫</span>
                      )}
                      {p.isOnline && <span style={styles.similarOnlineDot} />}
                    </div>
                    <span style={styles.similarName}>{p.name}</span>
                    <span style={styles.similarPrice}>¥{p.price}/h</span>
                    <span style={styles.similarRating}>⭐{p.rating || '5.0'}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* 评价内容 */}
      {activeTab === 'reviews' && (
        <div style={styles.reviewsSection}>
          {reviewsLoading ? (
            <div style={styles.reviewsLoading}>
              <span style={styles.emptyText}>加载评价中...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div style={styles.reviewsEmpty}>
              <span style={styles.emptyIcon}>📝</span>
              <span style={styles.emptyText}>暂无评价</span>
              <span style={styles.emptySub}>成为第一个评价的人吧</span>
            </div>
          ) : (
            reviews.map((review: Review) => (
              <div key={review.id} style={styles.reviewItem}>
                <div style={styles.reviewHeader}>
                  <div style={styles.reviewerAvatar}>
                    {review.userAvatar ? (
                      <img src={review.userAvatar} alt={review.userName} style={styles.reviewerAvatarImg} />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div style={styles.reviewerInfo}>
                    <span style={styles.reviewerName}>{review.userName}</span>
                    <span style={styles.reviewRating}>{renderStars(review.rating)} {review.rating}</span>
                  </div>
                  <span style={styles.reviewTime}>{formatReviewTime(review.createTime)}</span>
                </div>
                {review.comment && <p style={styles.reviewContent}>{review.comment}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {/* 底部操作栏 */}
      <div style={styles.bottomBar}>
        <motion.div
          style={{
            ...styles.favoriteBtn,
            ...(isCurrentlyFavorited ? styles.favoriteBtnActive : {}),
          }}
          onClick={handleToggleFavorite}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <span style={styles.favoriteIcon}>{isCurrentlyFavorited ? '❤️' : '🤍'}</span>
          <span style={styles.favoriteLabel}>{isCurrentlyFavorited ? '已收藏' : '收藏'}</span>
        </motion.div>
        <motion.div
          style={styles.chatBtn}
          onClick={() => navigate('/chat')}
          whileTap={{ scale: 0.92, opacity: 0.8 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <span style={styles.chatIcon}>💬</span>
          <span>聊天</span>
        </motion.div>
        <motion.button
          style={{ ...styles.orderBtn, ...(creating ? styles.orderBtnDisabled : {}) }}
          onClick={creating ? undefined : handleOrder}
          disabled={creating}
          whileTap={creating ? {} : { scale: 0.96, opacity: 0.85 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {creating ? '创建中...' : '立即预约'}
        </motion.button>
      </div>
    </div>
  )
}

// ========== 暗色风格 ==========
const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '80px',
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
    fontSize: '16px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  shareBtn: {
    fontSize: '14px',
    color: COLORS.primary,
    cursor: 'pointer',
  },
  profileSection: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #c44569 100%)`,
    padding: '20px 16px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarImg: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  avatarEmoji: {
    fontSize: '72px',
    display: 'block',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: COLORS.success,
    color: '#fff',
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: '10px',
    whiteSpace: 'nowrap',
  },
  profileInfo: {
    flex: 1,
    color: '#fff',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  name: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#fff',
  },
  level: {
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '8px',
  },
  gameInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '10px',
  },
  gameTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '3px 10px',
    borderRadius: '10px',
    fontSize: '12px',
    color: '#fff',
  },
  rank: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#fff',
  },
  priceTag: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  tabBar: {
    display: 'flex',
    backgroundColor: COLORS.card,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tab: {
    flex: 1,
    textAlign: 'center',
    padding: '14px 0',
    fontSize: '15px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
    borderBottomColor: COLORS.primary,
  },
  section: {
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 12px 0',
  },
  gameOptions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  gameOption: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    color: COLORS.textSecondary,
    backgroundColor: 'rgba(255,255,255,0.08)',
    cursor: 'pointer',
    border: '1px solid transparent',
  },
  gameOptionActive: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    fontWeight: 'bold',
  },
  hoursOptions: {
    display: 'flex',
    gap: '10px',
    marginBottom: '16px',
  },
  hourOption: {
    flex: 1,
    padding: '12px 8px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    textAlign: 'center',
    cursor: 'pointer',
    border: '2px solid transparent',
  },
  hourOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255,107,157,0.15)',
  },
  hourValue: {
    display: 'block',
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  hourLabel: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  priceSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: '12px 16px',
    borderRadius: '12px',
  },
  priceSummaryLabel: {
    color: COLORS.textSecondary,
    fontSize: '14px',
  },
  totalPrice: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  tag: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '13px',
    color: COLORS.text,
    backgroundColor: 'rgba(255,107,157,0.15)',
    border: `1px solid ${COLORS.primary}40`,
  },
  bio: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    lineHeight: '1.6',
    margin: 0,
  },
  similarScroll: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  similarCard: {
    flexShrink: 0,
    width: '90px',
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '12px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    border: `1px solid ${COLORS.border}`,
  },
  similarAvatar: {
    position: 'relative',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: '4px',
  },
  similarAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  similarAvatarEmoji: {
    fontSize: '24px',
  },
  similarOnlineDot: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: COLORS.success,
    border: '2px solid rgba(26,26,46,1)',
  },
  similarName: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  similarPrice: {
    fontSize: '11px',
    color: '#FFD700',
    fontWeight: 'bold',
  },
  similarRating: {
    fontSize: '10px',
    color: COLORS.textSecondary,
  },
  reviewsSection: {
    padding: '16px',
  },
  reviewsLoading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 0',
  },
  reviewsEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '40px',
    gap: '8px',
  },
  emptyIcon: {
    fontSize: '40px',
  },
  emptyText: {
    fontSize: '15px',
    color: COLORS.text,
  },
  emptySub: {
    fontSize: '13px',
    color: COLORS.textSecondary,
  },
  reviewItem: {
    backgroundColor: COLORS.card,
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '10px',
    border: `1px solid ${COLORS.border}`,
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  reviewerAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: '20px',
    flexShrink: 0,
  },
  reviewerAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.text,
  },
  reviewRating: {
    fontSize: '12px',
    color: '#FFD700',
  },
  reviewTime: {
    fontSize: '11px',
    color: COLORS.textSecondary,
  },
  reviewContent: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    lineHeight: '1.5',
    margin: 0,
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: '480px',
    margin: '0 auto',
    backgroundColor: COLORS.card,
    padding: '12px 16px',
    display: 'flex',
    gap: '10px',
    borderTop: `1px solid ${COLORS.border}`,
    zIndex: 100,
  },
  favoriteBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 14px',
    borderRadius: '24px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: COLORS.textSecondary,
    fontSize: '11px',
    cursor: 'pointer',
    border: `1px solid ${COLORS.border}`,
    gap: '2px',
  },
  favoriteBtnActive: {
    backgroundColor: `${COLORS.primary}20`,
    color: COLORS.primary,
    borderColor: `${COLORS.primary}40`,
  },
  favoriteIcon: {
    fontSize: '18px',
  },
  favoriteLabel: {
    fontSize: '10px',
  },
  chatBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 18px',
    borderRadius: '24px',
    background: `linear-gradient(135deg, ${COLORS.accent} 0%, #764ba2 100%)`,
    color: '#fff',
    fontSize: '12px',
    gap: '2px',
    cursor: 'pointer',
    boxShadow: `0 4px 12px ${COLORS.accent}40`,
    border: 'none',
  },
  chatIcon: {
    fontSize: '20px',
  },
  orderBtn: {
    flex: 1,
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    color: '#fff',
    padding: '14px',
    borderRadius: '24px',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: `0 4px 15px ${COLORS.primary}40`,
    border: 'none',
  },
  orderBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}

export default PlayerDetailPage
