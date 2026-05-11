// ============================================================
// 陪玩师详情页 - 重构后
// ============================================================
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '@/constants'
import { getPlayerDetail } from '@/api/players'
import { createOrder } from '@/api/order'
import { addFavorite, removeFavorite } from '@/api/favorites'
import { useFavoritesStore } from '@/store'
import { request } from '@/api'
import { Header } from '@/components/layout/Header'
import { TabBar } from '@/components/layout/TabBar'
import { SimilarPlayers } from '@/components/player'
import { Button, Loading, Empty, Badge } from '@/components/ui'
import type { Player } from '@/store/player/types'

// ============================================================
// 常量
// ============================================================
const GAME_MAP: Record<string, string> = {
  '王者荣耀': 'honor',
  '和平精英': 'apex',
  '英雄联盟': 'lol',
  '永劫无间': 'yongjie',
}
const GAME_REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(GAME_MAP).map(([k, v]) => [v, k])
)

const GAMES = ['王者荣耀', '和平精英', '英雄联盟', '永劫无间']
const HOUR_OPTIONS = [1, 2, 3, 4]

const getLevelColor = (rank?: string | null) => {
  if (!rank) return COLORS.text
  if (rank.includes('王者')) return '#FFD700'
  if (rank.includes('大师')) return '#C0C0C0'
  if (rank.includes('钻石')) return '#B9F2F0'
  return '#90EE90'
}

// ============================================================
// 类型
// ============================================================
interface Review {
  id: string
  orderId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  createTime: number
}

interface SimplePlayer {
  id: string
  name: string
  avatar: string | null
  rank: string | null
  games: string[]
  price: number
  rating: number
  isOnline: boolean
}

// ============================================================
// 主组件
// ============================================================
const PlayerDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // State
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedHours, setSelectedHours] = useState(2)
  const [selectedGame, setSelectedGame] = useState('王者荣耀')
  const [activeTab, setActiveTab] = useState<'intro' | 'reviews'>('intro')
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [similarPlayers, setSimilarPlayers] = useState<SimplePlayer[]>([])
  const [creating, setCreating] = useState(false)
  const [favoriting, setFavoriting] = useState(false)

  const { isFavorited, addFavorite: addToStore, removeFavorite: removeFromStore } = useFavoritesStore()
  const isCurrentlyFavorited = player ? isFavorited(player.id) : false

  // ============================================================
  // 加载数据
  // ============================================================
  useEffect(() => {
    if (!id) return

    const load = async () => {
      try {
        const data = await getPlayerDetail(id)
        const p: any = {
          ...data,
          online: data.online ?? data.isOnline,
          game: GAME_REVERSE_MAP[data.game] || data.games?.[0] || '王者荣耀',
          games: data.games?.length
            ? data.games.map((g: string) => GAME_REVERSE_MAP[g] || g)
            : [GAME_REVERSE_MAP[data.game] || '王者荣耀'],
        }
        setPlayer(p)
        if (data.games?.length > 0) {
          setSelectedGame(GAME_REVERSE_MAP[data.games[0]] || data.games[0])
        }
        loadSimilarPlayers(data.game, id)
      } catch {
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
    } catch {}
    setReviewsLoading(false)
  }

  const loadSimilarPlayers = async (game: string, currentId: string) => {
    try {
      const res = await request.get<{ players: SimplePlayer[] }>('/api/players', {
        params: { game, limit: 20 },
      })
      const filtered = (res.players || []).filter((p: SimplePlayer) => p.id !== currentId)
      filtered.sort((a: SimplePlayer, b: SimplePlayer) => (b.rating || 0) - (a.rating || 0))
      setSimilarPlayers(filtered.slice(0, 6))
    } catch {}
  }

  // ============================================================
  // 操作
  // ============================================================
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
        game: GAME_MAP[selectedGame] || selectedGame,
      })
      navigate(`/payment/${(order as any).id}`)
    } catch (err) {
      alert((err as any)?.response?.data?.message || '创建订单失败')
    } finally {
      setCreating(false)
    }
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  // ============================================================
  // 渲染
  // ============================================================
  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loading />
      </div>
    )
  }

  if (error || !player) {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' as const, gap: 12 }}>
        <span style={{ color: COLORS.error }}>{error || '加载失败'}</span>
        <span style={{ color: COLORS.textSecondary, fontSize: 13, cursor: 'pointer' }} onClick={() => navigate(-1)}>返回</span>
      </div>
    )
  }

  const totalPrice = player.price * selectedHours

  return (
    <div style={styles.container}>
      <Header
        title="陪玩师详情"
        onBack={() => navigate(-1)}
        right={<span style={{ color: COLORS.primary, fontSize: 14 }}>分享</span>}
      />

      {/* 个人信息区 */}
      <div style={styles.profileSection}>
        <div style={styles.avatarWrapper}>
          {player.avatar ? (
            <img src={player.avatar} alt={player.name} style={styles.avatarImg} />
          ) : (
            <span style={styles.avatarEmoji}>💫</span>
          )}
          {player.online && (
            <span style={styles.onlineBadge}>在线</span>
          )}
        </div>
        <div style={styles.profileInfo}>
          <div style={styles.nameRow}>
            <span style={styles.name}>{player.name}</span>
            <span style={{ ...styles.level, color: getLevelColor(player.rank), backgroundColor: 'rgba(0,0,0,0.2)' }}>
              {player.rank || '陪玩师'}
            </span>
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
      <TabBar
        tabs={[
          { key: 'intro', label: '简介' },
          { key: 'reviews', label: '评价' },
        ]}
        activeTab={activeTab}
        onChange={(key) => handleTabSwitch(key as 'intro' | 'reviews')}
      />

      {/* 简介内容 */}
      {activeTab === 'intro' && (
        <>
          {/* 游戏选择 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>选择游戏</h3>
            <div style={styles.gameOptions}>
              {GAMES.map(game => (
                <motion.div
                  key={game}
                  style={{
                    ...styles.gameOption,
                    ...(selectedGame === game ? styles.gameOptionActive : {}),
                  }}
                  onClick={() => setSelectedGame(game)}
                  whileTap={{ scale: 0.94 }}
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
              {HOUR_OPTIONS.map(hour => (
                <motion.div
                  key={hour}
                  style={{
                    ...styles.hourOption,
                    ...(selectedHours === hour ? styles.hourOptionActive : {}),
                  }}
                  onClick={() => setSelectedHours(hour)}
                  whileTap={{ scale: 0.94 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <span style={styles.hourValue}>{hour}</span>
                  <span style={styles.hourLabel}>小时</span>
                </motion.div>
              ))}
            </div>
            <div style={styles.priceSummary}>
              <span style={styles.priceSummaryLabel}>应付金额：</span>
              <span style={styles.totalPrice}>¥{totalPrice}</span>
            </div>
          </div>

          {/* 标签 */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>擅长标签</h3>
            <div style={styles.tags}>
              {(player.tags || []).map((tag: string, i: number) => (
                <Badge key={i} variant="primary">{tag}</Badge>
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
              <SimilarPlayers players={similarPlayers as any} />
            </div>
          )}
        </>
      )}

      {/* 评价内容 */}
      {activeTab === 'reviews' && (
        <div style={styles.reviewsSection}>
          {reviewsLoading ? (
            <Loading text="加载评价中..." />
          ) : reviews.length === 0 ? (
            <Empty icon="📝" text="暂无评价" sub="成为第一个评价的人吧" />
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
                    <span style={styles.reviewRating}>
                      {'⭐'.repeat(Math.round(review.rating))} {review.rating}
                    </span>
                  </div>
                  <span style={styles.reviewTime}>{formatTime(review.createTime)}</span>
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
        >
          <span>{isCurrentlyFavorited ? '❤️' : '🤍'}</span>
          <span>{isCurrentlyFavorited ? '已收藏' : '收藏'}</span>
        </motion.div>
        <motion.div
          style={styles.chatBtn}
          onClick={() => navigate('/chat')}
          whileTap={{ scale: 0.92, opacity: 0.8 }}
        >
          💬 聊天
        </motion.div>
        <Button
          variant="primary"
          size="lg"
          loading={creating}
          onTap={handleOrder}
          style={{ flex: 1 }}
        >
          {creating ? '创建中...' : '立即预约'}
        </Button>
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
    paddingBottom: '80px',
  },
  profileSection: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #c44569 100%)`,
    padding: '20px 16px',
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    objectFit: 'cover' as const,
    border: '3px solid rgba(255,255,255,0.3)',
  },
  avatarEmoji: {
    fontSize: 60,
    display: 'block',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.success,
    color: '#fff',
    fontSize: 10,
    padding: '2px 6px',
    borderRadius: 8,
    fontWeight: 'bold' as const,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  level: {
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 6,
  },
  gameInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  gameTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '2px 10px',
    borderRadius: 10,
    fontSize: 12,
  },
  rank: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statsRow: {
    display: 'flex',
    gap: 16,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  priceTag: {
    fontWeight: 'bold' as const,
    color: '#FFD700',
  },
  section: {
    padding: '16px',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    margin: '0 0 14px 0',
  },
  gameOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
  },
  gameOption: {
    padding: '10px 16px',
    borderRadius: 12,
    fontSize: 14,
    textAlign: 'center' as const,
    backgroundColor: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  gameOptionActive: {
    backgroundColor: 'rgba(255,107,157,0.2)',
    borderColor: COLORS.primary,
    color: COLORS.primary,
    fontWeight: 'bold' as const,
  },
  hoursOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
  },
  hourOption: {
    padding: '12px 8px',
    borderRadius: 12,
    backgroundColor: COLORS.card,
    border: `1px solid ${COLORS.border}`,
    textAlign: 'center' as const,
    cursor: 'pointer',
  },
  hourOptionActive: {
    backgroundColor: 'rgba(255,107,157,0.2)',
    borderColor: COLORS.primary,
  },
  hourValue: {
    display: 'block',
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  hourLabel: {
    display: 'block',
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  priceSummary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    padding: '12px 16px',
    backgroundColor: COLORS.card,
    borderRadius: 12,
  },
  priceSummaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: COLORS.primary,
  },
  tags: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  bio: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    margin: 0,
  },
  reviewsSection: {
    padding: 16,
  },
  reviewItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
  },
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: COLORS.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden' as const,
  },
  reviewerAvatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    display: 'block',
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  reviewRating: {
    fontSize: 12,
    color: '#FFD700',
  },
  reviewTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reviewContent: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 1.6,
    margin: 0,
  },
  bottomBar: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 480,
    margin: '0 auto',
    backgroundColor: COLORS.card,
    padding: '12px 16px',
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    borderTop: `1px solid ${COLORS.border}`,
    zIndex: 100,
  },
  favoriteBtn: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 2,
    padding: '8px 12px',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    cursor: 'pointer',
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  favoriteBtnActive: {
    color: COLORS.error,
  },
  chatBtn: {
    padding: '10px 16px',
    borderRadius: 20,
    backgroundColor: 'rgba(255,107,157,0.2)',
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold' as const,
    cursor: 'pointer',
  },
}

export default PlayerDetailPage