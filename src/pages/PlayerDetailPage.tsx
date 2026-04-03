// 陪玩师详情页 - 已接入真实 API
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { COLORS } from '../constants'
import { getPlayerDetail } from '../api/players'
import { createOrder } from '../api/order'
import { Styles } from '@/utils/styles'

// 游戏名称映射
const GAME_MAP = {
  '王者荣耀': 'honor',
  '和平精英': 'apex',
  '英雄联盟': 'lol',
  '永劫无间': 'yongjie',
}
const GAME_REVERSE_MAP = Object.fromEntries(Object.entries(GAME_MAP).map(([k, v]) => [v, k]))

// 等级颜色
const getLevelColor = (rank) => {
  if (rank?.includes('王者')) return '#FFD700'
  if (rank?.includes('大师')) return '#C0C0C0'
  if (rank?.includes('钻石')) return '#B9F2F0'
  return '#90EE90'
}

const PlayerDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [selectedHours, setSelectedHours] = useState(2)
  const [selectedGame, setSelectedGame] = useState('王者荣耀')
  const hoursOptions = [1, 2, 3, 4]

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const data = await getPlayerDetail(id)
        // 标准化数据
        const normalized: any = {
          ...data.data,
          online: (data.data as any).online ?? (data.data as any).isOnline,
          game: GAME_REVERSE_MAP[(data.data as any).game] || (data.data as any).games?.[0] || '王者荣耀',
        }
        setPlayer(normalized)
        // 默认选中第一个游戏
        if (data.data.games?.length > 0) {
          setSelectedGame(GAME_REVERSE_MAP[data.data.games[0]] || data.data.games[0])
        }
      } catch (err) {
        setError('加载失败')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

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
      alert(err?.response?.data?.message || '创建订单失败')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* 顶部返回栏 */}
      <div style={styles.header}>
        <span style={styles.backBtn} onClick={() => navigate(-1)}>←</span>
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
            <span style={{ ...styles.level, color: getLevelColor(player.rank) }}>{player.rank || '陪玩师'}</span>
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

      {/* 游戏选择 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>选择游戏</h3>
        <div style={styles.gameOptions}>
          {['王者荣耀', '和平精英', '英雄联盟', '永劫无间'].map(game => (
            <div
              key={game}
              style={{
                ...styles.gameOption,
                ...(selectedGame === game ? styles.gameOptionActive : {}),
              }}
              onClick={() => setSelectedGame(game)}
            >
              {game}
            </div>
          ))}
        </div>
      </div>

      {/* 时长选择 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>选择时长</h3>
        <div style={styles.hoursOptions}>
          {hoursOptions.map(hour => (
            <div
              key={hour}
              style={{
                ...styles.hourOption,
                ...(selectedHours === hour ? styles.hourOptionActive : {}),
              }}
              onClick={() => setSelectedHours(hour)}
            >
              <span style={styles.hourValue}>{hour}</span>
              <span style={styles.hourLabel}>小时</span>
            </div>
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
          {(player.tags || []).map((tag, i) => (
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

      {/* 底部操作栏 */}
      <div style={styles.bottomBar}>
        <div style={styles.chatBtn} onClick={() => navigate('/chat')}>
          <span style={styles.chatIcon}>💬</span>
          <span>聊天</span>
        </div>
        <div
          style={{ ...styles.orderBtn, ...(creating ? styles.orderBtnDisabled : {}) }}
          onClick={creating ? undefined : handleOrder}
        >
          {creating ? '创建中...' : '立即预约'}
        </div>
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
  avatar: {
    fontSize: '72px',
    display: 'block',
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
    backgroundColor: 'rgba(0,0,0,0.2)',
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
  photos: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
  },
  photoItem: {
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    backgroundColor: COLORS.card,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    flexShrink: 0,
    border: `1px solid ${COLORS.border}`,
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
    fontSize: '32px',
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
    gap: '12px',
    borderTop: `1px solid ${COLORS.border}`,
    zIndex: 100,
  },
  chatBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
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
