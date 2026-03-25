// 个人中心页 - 已统一暗色风格 + 移除重复底部 Tab
import { useNavigate } from 'react-router-dom'
import { COLORS } from '../constants'

const ProfilePage = () => {
  const navigate = useNavigate()

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
      <div style={styles.menuSection}>
        {menuItems.map((item, i) => (
          <div
            key={i}
            style={styles.menuItem}
            onClick={() => navigate('/settings')}
          >
            <div style={styles.menuLeft}>
              <span style={styles.menuIcon}>{item.icon}</span>
              <div>
                <p style={styles.menuLabel}>{item.label}</p>
                <p style={styles.menuSub}>{item.sub}</p>
              </div>
            </div>
            <span style={styles.menuArrow}>›</span>
          </div>
        ))}
      </div>

      {/* 退出登录 */}
      <div style={styles.logoutArea}>
        <button style={styles.logoutBtn}>退出登录</button>
      </div>
    </div>
  )
}

// ========== 暗色风格 ==========
const styles = {
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
}

export default ProfilePage
