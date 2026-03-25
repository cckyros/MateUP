// 陪玩师详情页 - 已统一暗色风格
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../constants'

const PlayerDetailPage = () => {
  const navigate = useNavigate()
  const [selectedHours, setSelectedHours] = useState(2)
  const [selectedGame, setSelectedGame] = useState('王者荣耀')

  const player = {
    id: 1,
    name: '小美',
    avatar: '👩',
    game: '王者荣耀',
    rank: '星耀3',
    level: '金牌陪玩',
    levelColor: '#FFD700',
    rating: 4.9,
    orders: 328,
    online: true,
    price: 45,
    tags: ['御姐音', '连胜王', '野王', 'carry型', '心态好'],
    photos: ['👩‍🎮', '🎮', '🔫', '⚔️', '🏆'],
    bio: '专注野王3年，擅长李白、韩信、玄策等刺客英雄。声音好听心态稳，带你轻松上分！',
    reviews: [
      { id: 1, user: '玩家A', avatar: '👨', rating: 5, content: '太厉害了！2小时带我上了3颗星，小姐姐声音超好听~', time: '3天前' },
      { id: 2, user: '玩家B', avatar: '👨', rating: 5, content: '打野意识很强，节奏带得飞起，下次还来！', time: '1周前' },
    ],
  }

  const hoursOptions = [1, 2, 3, 4, 5, 6]

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
          <span style={styles.avatar}>{player.avatar}</span>
          {player.online && <span style={styles.onlineBadge}>在线</span>}
        </div>
        <div style={styles.profileInfo}>
          <div style={styles.nameRow}>
            <span style={styles.name}>{player.name}</span>
            <span style={{ ...styles.level, color: player.levelColor }}>{player.level}</span>
          </div>
          <div style={styles.gameInfo}>
            <span style={styles.gameTag}>{player.game}</span>
            <span style={styles.rank}>{player.rank}</span>
          </div>
          <div style={styles.statsRow}>
            <span>⭐ {player.rating}</span>
            <span>接单 {player.orders}</span>
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
          {player.tags.map((tag, i) => (
            <span key={i} style={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      {/* 个人简介 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>个人简介</h3>
        <p style={styles.bio}>{player.bio}</p>
      </div>

      {/* 相册 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>相册</h3>
        <div style={styles.photos}>
          {player.photos.map((photo, i) => (
            <div key={i} style={styles.photoItem}>{photo}</div>
          ))}
        </div>
      </div>

      {/* 用户评价 */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>用户评价 ({player.reviews.length})</h3>
        {player.reviews.map(review => (
          <div key={review.id} style={styles.reviewItem}>
            <div style={styles.reviewHeader}>
              <span style={styles.reviewerAvatar}>{review.avatar}</span>
              <div style={styles.reviewerInfo}>
                <span style={styles.reviewerName}>{review.user}</span>
                <span style={styles.reviewRating}>⭐ {review.rating}</span>
              </div>
              <span style={styles.reviewTime}>{review.time}</span>
            </div>
            <p style={styles.reviewContent}>{review.content}</p>
          </div>
        ))}
      </div>

      {/* 底部操作栏 */}
      <div style={styles.bottomBar}>
        <div style={styles.chatBtn} onClick={() => navigate('/chat')}>
          <span style={styles.chatIcon}>💬</span>
          <span>聊天</span>
        </div>
        <div style={styles.orderBtn} onClick={() => navigate('/payment')}>
          立即预约
        </div>
      </div>
    </div>
  )
}

// ========== 暗色风格 ==========
const styles = {
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
}

export default PlayerDetailPage
