// 个人中心页 - 已统一暗色风格 + 移除重复底部 Tab
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLORS } from '../constants'
import { useApplyStore } from '../store'
import { useUserStore } from '../store'
import { getApplyStatus } from '../api/apply'
import { Styles } from '@/utils/styles'
import { listStagger, listItem } from '../utils/animations'

const ProfilePage = () => {
  const navigate = useNavigate()
  const { status, setStatus } = useApplyStore()
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)
  const isPlayer = status === 'approved'
  const isPending = status === 'pending'

  // 每次进入页面，同步最新的申请状态
  useEffect(() => {
    if (!user) return
    getApplyStatus()
      .then((res) => {
        const statusMap = {
          1: 'pending',
          3: 'approved',
          4: 'rejected',
        }
        const s = statusMap[(res as any).step] || 'none'
        setStatus(s, (res as any).submittedAt || null, (res as any).rejectedReason || null)
        if (user) {
          setUser({ ...user, playerStatus: s, isPlayer: s === 'approved' })
        }
      })
      .catch(() => {})
  }, [])

  const userData = {
    name: '小明同学',
    avatar: '👨‍🎮',
    phone: '139****8888',
    vipLevel: 'VIP会员',
    levelColor: COLORS.primary,
    balance: '¥856.00',
    totalOrders: 28,
    starRating: 4.8,
    playTime: '126小时',
  }

  // 陪玩师菜单
  const playerMenuItems = [
    { icon: '🏠', label: '陪玩师工作台', sub: '管理订单和收入', path: '/player-home' },
    { icon: '💰', label: '收入中心', sub: '查看和提现收入', path: '/player-earnings' },
    { icon: '⭐', label: '评价管理', sub: '查看和回复评价', path: '/player-reviews' },
    { icon: '👤', label: '陪玩师资料', sub: '编辑接单信息', path: '/player-profile' },
  ]

  // 普通用户菜单
  const menuItems = [
    { icon: '💰', label: '我的钱包', sub: '余额 ¥856.00' },
    { icon: '🎁', label: '优惠券', sub: '5张可用' },
    { icon: '⭐', label: '我的评价', sub: '查看收到的评价' },
    { icon: '🎮', label: '游戏偏好', sub: '王者荣耀、和平精英' },
    { icon: '📱', label: '账号安全', sub: '手机号、密码设置' },
    { icon: '👑', label: '会员中心', sub: 'VIP会员 · 专属福利' },
  ]

  const badges = [
    { icon: '🥇', text: '年度陪玩王' },
    { icon: '⭐', text: '五星好评' },
    { icon: '🔥', text: '连续30天在线' },
    { icon: '🏅', text: '准时达人' },
  ]

  const activeMenuItems = isPlayer ? playerMenuItems : menuItems

  return (
    <div style={styles.container}>
      {/* 顶部个人信息 */}
      <div style={styles.header}>
        <div style={styles.profileSection}>
          <div style={styles.avatarArea}>
            <div style={styles.avatar}>{userData.avatar}</div>
            <div style={styles.editBadge}>✏️</div>
          </div>
          <div style={styles.userInfo}>
            <h2 style={styles.userName}>{userData.name}</h2>
            <div style={styles.riderBadge}>
              <span style={{ ...styles.levelTag, backgroundColor: userData.levelColor }}>
                {userData.vipLevel}
              </span>
              <span style={styles.phone}>{userData.phone}</span>
            </div>
          </div>
          <div style={styles.settingsIcon} onClick={() => navigate('/settings')}>⚙️</div>
        </div>

        {/* 数据卡片 */}
        <div style={styles.dataCards}>
          {[
            { label: '余额', value: userData.balance },
            { label: '完成订单', value: userData.totalOrders },
            { label: '评分', value: `⭐ ${userData.starRating}` },
            { label: '陪玩时长', value: userData.playTime },
          ].map((item, i) => (
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
          {badges.map((badge, i) => (
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
        initial="initial"
        animate="animate"
      >
        {activeMenuItems.map((item, i) => (
          <motion.div
            key={i}
            style={styles.menuItem}
            onClick={() => navigate((item as any).path || '/settings')}
            variants={listItem}
            whileTap={{ opacity: 0.7, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
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

        {/* 申请陪玩师入口（普通用户可见） */}
        {!isPlayer && !isPending && (
          <motion.div
            style={styles.applyBanner}
            onClick={() => navigate('/apply-player')}
            variants={listItem}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span style={styles.applyIcon}>🎮</span>
            <div style={styles.applyInfo}>
              <p style={styles.applyTitle}>成为陪玩师</p>
              <p style={styles.applySub}>空闲时间接单，赚取额外收入</p>
            </div>
            <span style={styles.applyBtn}>申请</span>
          </motion.div>
        )}

        {/* 审核中入口 */}
        {!isPlayer && isPending && (
          <motion.div
            style={styles.applyBanner}
            onClick={() => navigate('/apply-status')}
            variants={listItem}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <span style={styles.applyIcon}>⏳</span>
            <div style={styles.applyInfo}>
              <p style={styles.applyTitle}>申请审核中</p>
              <p style={styles.applySub}>您的申请正在审核，请耐心等待</p>
            </div>
            <span style={styles.applyBtn} onClick={() => navigate('/apply-status')}>查看</span>
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

// ========== 暗色风格 ==========
const styles: Styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    paddingBottom: '70px',
  },
  header: {
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, #c44569 100%)`,
    paddingBottom: '20px',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    padding: '24px 16px 16px',
    gap: '14px',
  },
  avatarArea: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    border: '3px solid rgba(255,255,255,0.3)',
  },
  editBadge: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#fff',
    margin: '0 0 6px 0',
  },
  riderBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  levelTag: {
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
  },
  phone: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
  },
  settingsIcon: {
    fontSize: '24px',
    cursor: 'pointer',
  },
  dataCards: {
    display: 'flex',
    backgroundColor: 'rgba(255,255,255,0.15)',
    margin: '0 12px',
    borderRadius: '16px',
    padding: '16px 8px',
    justifyContent: 'space-around',
  },
  dataCard: {
    textAlign: 'center',
    flex: 1,
  },
  dataValue: {
    display: 'block',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
  },
  dataLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.7)',
    marginTop: '2px',
    display: 'block',
  },
  badges: {
    backgroundColor: COLORS.card,
    margin: '12px 12px',
    borderRadius: '16px',
    padding: '16px',
    border: `1px solid ${COLORS.border}`,
  },
  badgeTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 12px 0',
  },
  badgeList: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  badgeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: '6px 12px',
    borderRadius: '20px',
  },
  badgeIcon: {
    fontSize: '14px',
  },
  badgeText: {
    fontSize: '12px',
    color: COLORS.text,
  },
  menuSection: {
    backgroundColor: COLORS.card,
    margin: '0 12px',
    borderRadius: '16px',
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
    gap: '12px',
  },
  menuIcon: {
    fontSize: '22px',
  },
  menuLabel: {
    fontSize: '15px',
    fontWeight: '500',
    color: COLORS.text,
    margin: 0,
  },
  menuSub: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    margin: '2px 0 0 0',
  },
  menuArrow: {
    color: COLORS.textSecondary,
    fontSize: '16px',
  },
  logoutArea: {
    margin: '20px 12px 0',
  },
  logoutBtn: {
    width: '100%',
    padding: '15px',
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '25px',
    fontSize: '15px',
    color: COLORS.textSecondary,
    cursor: 'pointer',
  },
  applyBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    background: `linear-gradient(135deg, ${COLORS.primary}22 0%, ${COLORS.secondary}22 100%)`,
    border: `1px solid ${COLORS.primary}44`,
    borderRadius: '12px',
    marginTop: '12px',
    cursor: 'pointer',
  },
  applyIcon: {
    fontSize: '28px',
  },
  applyInfo: {
    flex: 1,
  },
  applyTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.text,
    margin: '0 0 2px 0',
  },
  applySub: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    margin: 0,
  },
  applyBtn: {
    padding: '6px 16px',
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
    cursor: 'pointer',
  },
}

export default ProfilePage
