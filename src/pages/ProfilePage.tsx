// ============================================================
// 个人中心页 - 重构后
// ============================================================
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '@/constants'
import { useApplyStore, useUserStore } from '@/store'
import { getApplyStatus } from '@/api/apply'
import { listStagger, listItem } from '@/hooks'

// ============================================================
// 常量
// ============================================================
const PLAYER_MENU = [
  { icon: '🏠', label: '陪玩师工作台', sub: '管理订单和收入', path: '/player-home' },
  { icon: '💰', label: '收入中心', sub: '查看和提现收入', path: '/player-earnings' },
  { icon: '⭐', label: '评价管理', sub: '查看和回复评价', path: '/player-reviews' },
  { icon: '❤️', label: '我的收藏', sub: '收藏的陪玩师', path: '/favorites' },
  { icon: '👤', label: '陪玩师资料', sub: '编辑接单信息', path: '/player-profile' },
]

const USER_MENU = [
  { icon: '💰', label: '我的钱包', sub: '余额 ¥856.00' },
  { icon: '🎁', label: '优惠券', sub: '5张可用' },
  { icon: '❤️', label: '我的收藏', sub: '收藏的陪玩师', path: '/favorites' },
  { icon: '⭐', label: '我的评价', sub: '查看收到的评价' },
  { icon: '🎮', label: '游戏偏好', sub: '王者荣耀、和平精英' },
  { icon: '📱', label: '账号安全', sub: '手机号、密码设置' },
  { icon: '👑', label: '会员中心', sub: 'VIP会员 · 专属福利' },
]

const BADGES = [
  { icon: '🥇', text: '年度陪玩王' },
  { icon: '⭐', text: '五星好评' },
  { icon: '🔥', text: '连续30天在线' },
  { icon: '🏅', text: '准时达人' },
]

// ============================================================
// 主组件
// ============================================================
const ProfilePage = () => {
  const navigate = useNavigate()
  const { status, setStatus } = useApplyStore()
  const user = useUserStore(s => s.user)
  const setUser = useUserStore(s => s.setUser)
  const isPlayer = status === 'approved'
  const isPending = status === 'pending'

  useEffect(() => {
    if (!user) return
    getApplyStatus()
      .then((res: any) => {
        const statusMap: Record<number, string> = { 1: 'pending', 3: 'approved', 4: 'rejected' }
        const s = statusMap[res.step] || 'none'
        setStatus(s, res.submittedAt || null, res.rejectedReason || null)
        if (user) {
          setUser({ ...user, playerStatus: s, isPlayer: s === 'approved' })
        }
      })
      .catch(() => {})
  }, [])

  const STATS = [
    { label: '余额', value: '¥856.00' },
    { label: '完成订单', value: '28' },
    { label: '评分', value: '⭐ 4.8' },
    { label: '陪玩时长', value: '126小时' },
  ]

  const activeMenu = isPlayer ? PLAYER_MENU : USER_MENU

  return (
    <div style={styles.container}>
      {/* 顶部个人信息 */}
      <div style={styles.header}>
        <div style={styles.profileSection}>
          <div style={styles.avatarArea}>
            <div style={styles.avatar}>👨‍🎮</div>
            <div style={styles.editBadge}>✏️</div>
          </div>
          <div style={styles.userInfo}>
            <h2 style={styles.userName}>小明同学</h2>
            <div style={styles.riderBadge}>
              <span style={{ ...styles.levelTag, backgroundColor: COLORS.primary }}>
                VIP会员
              </span>
              <span style={styles.phone}>139****8888</span>
            </div>
          </div>
          <div style={styles.settingsIcon} onClick={() => navigate('/settings')}>⚙️</div>
        </div>

        {/* 数据卡片 */}
        <div style={styles.dataCards}>
          {STATS.map((item, i) => (
            <div key={i} style={styles.dataCard}>
              <span style={styles.dataValue}>{item.value}</span>
              <span style={styles.dataLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 荣誉徽章 */}
      <div style={styles.badges}>
        <p style={styles.badgeTitle}>我的成就</p>
        <div style={styles.badgeList}>
          {BADGES.map((badge, i) => (
            <div key={i} style={styles.badgeItem}>
              <span style={styles.badgeIcon}>{badge.icon}</span>
              <span style={styles.badgeText}>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 功能菜单 */}
      <motion.div
        style={styles.menuSection}
        variants={listStagger(0.04, 0.06)}
        initial="hidden"
        animate="show"
      >
        {activeMenu.map((item, i) => (
          <motion.div
            key={i}
            style={styles.menuItem}
            onClick={() => navigate((item as any).path || '/settings')}
            variants={listItem}
            whileTap={{ opacity: 0.7, scale: 0.99 }}
          >
            <div style={styles.menuLeft}>
              <span style={styles.menuIcon}>{item.icon}</span>
              <div>
                <p style={styles.menuLabel}>{item.label}</p>
                <p style={styles.menuSub}>{item.sub}</p>
              </div>
            </div>
            <span style={styles.menuArrow}>›</span>
          </motion.div>
        ))}

        {/* 申请入口 */}
        {!isPlayer && !isPending && (
          <motion.div
            style={styles.applyBanner}
            onClick={() => navigate('/apply-player')}
            variants={listItem}
            whileTap={{ scale: 0.98 }}
          >
            <span style={styles.applyIcon}>🎮</span>
            <div style={styles.applyInfo}>
              <p style={styles.applyTitle}>成为陪玩师</p>
              <p style={styles.applySub}>空闲时间接单，赚取额外收入</p>
            </div>
            <span style={styles.applyBtn}>申请</span>
          </motion.div>
        )}

        {isPending && (
          <motion.div
            style={styles.applyBanner}
            onClick={() => navigate('/apply-status')}
            variants={listItem}
            whileTap={{ scale: 0.98 }}
          >
            <span style={styles.applyIcon}>⏳</span>
            <div style={styles.applyInfo}>
              <p style={styles.applyTitle}>申请审核中</p>
              <p style={styles.applySub}>您的申请正在审核，请耐心等待</p>
            </div>
            <span style={styles.applyBtn}>查看</span>
          </motion.div>
        )}
      </motion.div>

      {/* 退出登录 */}
      <div style={styles.logoutArea}>
        <button style={styles.logoutBtn}>退出登录</button>
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
    paddingBottom: '70px',
  },
  header: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #c44569 100%)`,
    paddingBottom: 20,
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    padding: '24px 16px 16px',
    gap: 14,
  },
  avatarArea: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    border: '3px solid rgba(255,255,255,0.3)',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold' as const,
    color: '#fff',
    margin: '0 0 6px 0',
  },
  riderBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  levelTag: {
    padding: '3px 10px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  phone: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  settingsIcon: {
    fontSize: 24,
    cursor: 'pointer',
  },
  dataCards: {
    display: 'flex',
    backgroundColor: 'rgba(255,255,255,0.15)',
    margin: '0 12px',
    borderRadius: 16,
    padding: '16px 8px',
    justifyContent: 'space-around',
  },
  dataCard: {
    textAlign: 'center' as const,
    flex: 1,
  },
  dataValue: {
    display: 'block',
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  dataLabel: {
    display: 'block',
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  badges: {
    backgroundColor: COLORS.card,
    margin: 12,
    borderRadius: 16,
    padding: 16,
    border: `1px solid ${COLORS.border}`,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    margin: '0 0 12px 0',
  },
  badgeList: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  badgeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: '6px 12px',
    borderRadius: 20,
  },
  badgeIcon: {
    fontSize: 14,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.text,
  },
  menuSection: {
    backgroundColor: COLORS.card,
    margin: '0 12px',
    borderRadius: 16,
    overflow: 'hidden',
    border: `1px solid ${COLORS.border}`,
  },
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 14px',
    borderBottom: `1px solid ${COLORS.border}`,
    cursor: 'pointer',
  },
  menuLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: COLORS.text,
    margin: 0,
  },
  menuSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    margin: '2px 0 0 0',
  },
  menuArrow: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  applyBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    background: `linear-gradient(135deg, ${COLORS.primary}22 0%, ${COLORS.secondary}22 100%)`,
    border: `1px solid ${COLORS.primary}44`,
    borderRadius: 12,
    marginTop: 12,
    cursor: 'pointer',
  },
  applyIcon: {
    fontSize: 28,
  },
  applyInfo: {
    flex: 1,
  },
  applyTitle: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: COLORS.text,
    margin: '0 0 2px 0',
  },
  applySub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    margin: 0,
  },
  applyBtn: {
    padding: '6px 16px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: '#fff',
    cursor: 'pointer',
  },
  logoutArea: {
    margin: '20px 12px 0',
  },
  logoutBtn: {
    width: '100%',
    padding: 15,
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 25,
    fontSize: 15,
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
}

export default ProfilePage