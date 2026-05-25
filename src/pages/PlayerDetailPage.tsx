import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { COLORS, GAME_CN_TO_KEY, GAME_KEY_TO_CN } from '@/constants'
import { getPlayerDetail } from '@/api/players'
import { createOrder } from '@/api/order'
import { addFavorite, removeFavorite } from '@/api/favorites'
import { useFavoritesStore } from '@/store'
import { request } from '@/api'
import { getLevelColor } from '@/utils/playerMapper'
import { SPRING, backButtonProps, tabContent, heartBeat, listStagger, listItem } from '@/utils/animations'
import { Skeleton } from '@/components'
import type { Review, Player, Order } from '@/types'
import { styles } from './PlayerDetailPage.styles'

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
        const rawData = data as Player & Record<string, unknown>
        const p = {
          ...data,
          online: (rawData.online as boolean | undefined) ?? data.isOnline,
          game: GAME_KEY_TO_CN[(rawData.game as string) || ''] || data.games?.[0] || '王者荣耀',
        }
        setPlayer(p)
        if (data.games?.length > 0) {
          setSelectedGame(GAME_KEY_TO_CN[data.games[0]] || data.games[0])
        }
        const gameKey = (rawData.game as string) || data.games?.[0] || ''
        loadSimilarPlayers(gameKey, id)
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
      navigate(`/payment/${(order as Order).id}`)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      alert(axiosErr?.response?.data?.message || '创建订单失败')
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
      <div style={styles.container}>
        <div style={styles.header}>
          <motion.span style={styles.backBtn} onClick={() => navigate(-1)} {...backButtonProps}>←</motion.span>
          <span style={styles.headerTitle}>陪玩师详情</span>
          <span style={styles.shareBtn}>分享</span>
        </div>
        <div style={{ padding: '20px 16px', display: 'flex', gap: 16 }}>
          <Skeleton width={80} height={80} borderRadius={40} />
          <div style={{ flex: 1 }}>
            <Skeleton width="50%" height={20} />
            <Skeleton width="70%" height={14} style={{ marginTop: 10 }} />
            <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
          </div>
        </div>
        <div style={{ padding: '0 16px' }}>
          <Skeleton height={40} style={{ marginTop: 16 }} />
          <Skeleton height={120} style={{ marginTop: 16 }} />
          <Skeleton height={80} style={{ marginTop: 16 }} />
        </div>
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
          {...backButtonProps}
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
        {(['intro', 'reviews'] as const).map((tab) => (
          <motion.div
            key={tab}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
            onClick={() => handleTabSwitch(tab)}
            whileTap={{ scale: 0.95 }}
            transition={SPRING.tactile}
          >
            {tab === 'intro' ? '简介' : '评价'}
            {activeTab === tab && (
              <motion.div
                layoutId="detail-tab-indicator"
                style={styles.tabIndicator}
                transition={SPRING.snappy}
              />
            )}
          </motion.div>
        ))}
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
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.02 }}
                  transition={SPRING.snappy}
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
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.03 }}
                  transition={SPRING.snappy}
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
                    whileTap={{ scale: 0.94 }}
                    whileHover={{ scale: 1.03 }}
                    transition={SPRING.snappy}
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
          whileTap={{ scale: 0.88 }}
          transition={SPRING.tactile}
        >
          <motion.span
            style={styles.favoriteIcon}
            key={isCurrentlyFavorited ? 'fav' : 'unfav'}
            variants={heartBeat}
            initial="initial"
            animate="animate"
          >
            {isCurrentlyFavorited ? '❤️' : '🤍'}
          </motion.span>
          <span style={styles.favoriteLabel}>{isCurrentlyFavorited ? '已收藏' : '收藏'}</span>
        </motion.div>
        <motion.div
          style={styles.chatBtn}
          onClick={() => navigate('/chat')}
          whileTap={{ scale: 0.88, opacity: 0.8 }}
          transition={SPRING.tactile}
        >
          <span style={styles.chatIcon}>💬</span>
          <span>聊天</span>
        </motion.div>
        <motion.button
          style={{ ...styles.orderBtn, ...(creating ? styles.orderBtnDisabled : {}) }}
          onClick={creating ? undefined : handleOrder}
          disabled={creating}
          whileTap={creating ? {} : { scale: 0.95, opacity: 0.85 }}
          transition={SPRING.tactile}
        >
          {creating ? '创建中...' : '立即预约'}
        </motion.button>
      </div>
    </div>
  )
}

export default PlayerDetailPage
