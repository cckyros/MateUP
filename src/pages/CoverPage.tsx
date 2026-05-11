// ============================================================
// 封面页 - 重构后
// ============================================================
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '@/constants'
import { useUserStore } from '@/store'
import { Button } from '@/components/ui'

// ============================================================
// 常量
// ============================================================
const HOT_PLAYERS = [
  { id: 1, name: '小美', avatar: '👩', level: '金牌陪玩', rating: 4.9, ordersCount: 892, price: 80 },
  { id: 2, name: '阿杰', avatar: '👨', level: '银牌陪玩', rating: 4.8, ordersCount: 564, price: 60 },
  { id: 3, name: '小林', avatar: '👩', level: '金牌陪玩', rating: 5.0, ordersCount: 1203, price: 100 },
]

const FEATURES = [
  { icon: '🎮', title: '海量陪玩', desc: '王者荣耀、和平精英...热门游戏全覆盖' },
  { icon: '🎧', title: '语音连麦', desc: '实时语音，边玩边聊，欢乐不间断' },
  { icon: '🛡️', title: '安全支付', desc: '平台担保交易，资金安全有保障' },
  { icon: '⭐', title: '真实评价', desc: '查看真实评价，找到靠谱陪玩' },
]

// ============================================================
// 主组件
// ============================================================
const CoverPage = () => {
  const navigate = useNavigate()
  const { isLoggedIn } = useUserStore()

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home', { replace: true })
    }
  }, [isLoggedIn, navigate])

  return (
    <div style={styles.container}>
      {/* Banner */}
      <div style={styles.banner}>
        <div style={styles.logoArea}>
          <div style={styles.logo}>💫</div>
          <div>
            <h1 style={styles.appName}>伴游</h1>
            <p style={styles.slogan}>游戏陪玩 · 语音陪伴 · 开心每一天</p>
          </div>
        </div>
        <p style={styles.stats}>
          已有 <span style={styles.highlight}>5万+</span> 玩家加入
        </p>
      </div>

      {/* 热门陪玩师 */}
      <div style={styles.hotSection}>
        <div style={styles.hotHeader}>
          <div style={styles.hotTitleRow}>
            <span style={styles.hotFire}>🔥</span>
            <span style={styles.hotTitle}>热门陪玩师</span>
          </div>
          <span style={styles.hotMore} onClick={() => navigate('/home')}>查看更多 →</span>
        </div>
        <div style={styles.hotList}>
          {HOT_PLAYERS.map(player => (
            <div
              key={player.id}
              style={styles.hotCard}
              onClick={() => navigate(`/player/${player.id}`)}
            >
              <span style={styles.hotAvatar}>{player.avatar}</span>
              <span style={styles.hotOnlineDot} />
              <div style={styles.hotInfo}>
                <span style={styles.hotName}>{player.name}</span>
                <span style={styles.hotLevel}>{player.level}</span>
              </div>
              <div style={styles.hotStats}>
                <span style={styles.hotRating}>⭐ {player.rating}</span>
                <span style={styles.hotOrders}>接单 {player.ordersCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 特性卡片 */}
      <div style={styles.mainContent}>
        {FEATURES.map((f, i) => (
          <div key={i} style={styles.featureCard}>
            <div style={styles.cardIcon}>{f.icon}</div>
            <div style={styles.cardText}>
              <h3 style={styles.cardTitle}>{f.title}</h3>
              <p style={styles.cardDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 底部按钮 */}
      <div style={styles.bottomArea}>
        <Button variant="primary" size="lg" onTap={() => navigate('/login')} style={{ width: '100%', marginBottom: 12 }}>
          立即登录
        </Button>
        <Button variant="secondary" size="lg" onTap={() => navigate('/home')} style={{ width: '100%' }}>
          先逛逛
        </Button>
      </div>

      <p style={styles.downloadTip}>下载 App 获取更多功能</p>
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
    display: 'flex',
    flexDirection: 'column' as const,
  },
  banner: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #c44569 100%)`,
    padding: '50px 24px 30px',
    color: '#fff',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  logo: {
    fontSize: 56,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold' as const,
    margin: '0 0 6px 0',
    color: '#fff',
  },
  slogan: {
    fontSize: 14,
    margin: 0,
    opacity: 0.9,
  },
  stats: {
    fontSize: 14,
    textAlign: 'center' as const,
    margin: 0,
  },
  highlight: {
    fontWeight: 'bold' as const,
    color: '#FFD700',
  },
  hotSection: {
    padding: '16px 20px 8px',
  },
  hotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hotTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  hotFire: {
    fontSize: 20,
  },
  hotTitle: {
    fontSize: 17,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  hotMore: {
    fontSize: 13,
    color: COLORS.primary,
    cursor: 'pointer',
  },
  hotList: {
    display: 'flex',
    gap: 10,
    overflowX: 'auto' as const,
    paddingBottom: 4,
  },
  hotCard: {
    flexShrink: 0,
    width: 120,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: '14px 10px',
    textAlign: 'center' as const,
    border: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
    position: 'relative' as const,
  },
  hotAvatar: {
    fontSize: 40,
    display: 'block',
    marginBottom: 6,
  },
  hotOnlineDot: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    backgroundColor: COLORS.success,
    borderRadius: '50%',
    border: `2px solid ${COLORS.card}`,
  },
  hotInfo: {
    marginBottom: 6,
  },
  hotName: {
    display: 'block',
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    marginBottom: 2,
  },
  hotLevel: {
    fontSize: 11,
    color: '#FFD700',
  },
  hotStats: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
  },
  hotRating: {
    fontSize: 12,
    color: '#FFD700',
  },
  hotOrders: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  mainContent: {
    padding: '8px 20px 0',
    flex: 1,
  },
  featureCard: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: '18px 16px',
    marginBottom: 14,
    gap: 16,
    border: `1px solid ${COLORS.border}`,
  },
  cardIcon: {
    fontSize: 36,
    width: 52,
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    flexShrink: 0,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    margin: '0 0 4px 0',
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  cardDesc: {
    fontSize: 13,
    margin: 0,
    color: COLORS.textSecondary,
  },
  bottomArea: {
    padding: '0 24px 16px',
  },
  downloadTip: {
    textAlign: 'center' as const,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    paddingBottom: 24,
    margin: 0,
  },
}

export default CoverPage